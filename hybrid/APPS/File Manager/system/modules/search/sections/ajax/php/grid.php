<?php
namespace FileRun;

@session_write_close();
$relativePath = \S::fromHTML($_REQUEST['searchPath']);
if ($relativePath == '/ROOT/SEARCH') {$relativePath = '/ROOT/HOME';}

$keyword = \S::fromHTML($_POST['keyword']);
$searchType = \S::fromHTML($_POST['searchType']);
$searchMode = \S::fromHTML($_POST['searchMode']);

$metaType = \S::fromHTML($_POST['metatype']);
$metaField = \S::fromHTML($_POST['metafield']);

if (!Files\Utils::isCleanPath($relativePath)) {
	jsonOutput(['count' => 0, 'files' => [], 'error' => Lang::t("Invalid folder")]);
}

$shareInfo = false;
$isSharedFolder = false;
if (Files\Utils::isSharedPath($relativePath)) {
	$pathInfo = Files\Utils::parsePath($relativePath);
	$shareInfo = Share::getInfoById($pathInfo['share_id']);
	$isSharedFolder = true;
}

$path = $myfiles->getUserAbsolutePath($relativePath);

if (!is_dir($path)) {
	jsonOutput(['count' => 0, 'files' => [], 'error' => Lang::t("Invalid folder")]);
}

if ($searchType == 'filename') {
	$d = Paths::getTable();
	$searchCriteria = [];
	$searchCriteria[] = ['path', 'LIKE',   $d->q(gluePath($path, '/%'))];
	if ($relativePath == '/ROOT/HOME') {
		$searchCriteria[] = ['path', 'NOT LIKE',   $d->q(gluePath($path, '/.filerun.trash/%'))];
	}
	if ($keyword) {
		$searchCriteria[] = ['filename', 'LIKE', $d->q('%'.$keyword.'%')];
	}
	$list = $d->select(['path', 'filename'], $searchCriteria, ['depth' => 'ASC'], 100);

} else if ($searchType == 'contents') {
	\FileRun::blockIfFree();
	$search = new Search();
	\ZendSearch\Lucene\Search\QueryParser::setDefaultEncoding('utf-8');
	$query = new \ZendSearch\Lucene\Search\Query\Boolean();

	$pattern = new \ZendSearch\Lucene\Index\Term(addTrailingSlash($path)."*", "path");
	$pathQuery = new \ZendSearch\Lucene\Search\Query\Wildcard($pattern);
	$query->addSubquery($pathQuery, true);

	$userQuery = \ZendSearch\Lucene\Search\QueryParser::parse($keyword, 'utf-8');
	$query->addSubquery($userQuery, true);

	\ZendSearch\Lucene\Lucene::setResultSetLimit(100);
	$hits = $search->find($query);

	$results = [
		"totalCount" => sizeof($hits),
		"files" => []
	];
	//print_r($query->__toString());
	$list = [];
	foreach ($hits as $hit) {
		$list[] = [
			'path' => gluePath($hit->path, $hit->filename),
			'filename' => $hit->filename
		];
	}
} else if ($searchType == 'meta') {
	$d = Utils\DP::factory(
		MetaFiles::$table.' AS f '.
		'LEFT JOIN '.
			Paths::$table.' AS p ON f.pid = p.id '.
		'LEFT JOIN '.
			MetaValues::$table.' AS v ON v.file_id = f.id '
	);
	$filter = [];
	$filter[] = ["p.path", "LIKE", $d->q(gluePath($path, "/%"))];
	if ($relativePath == '/ROOT/HOME') {
		$filter[] = ['p.path', 'NOT LIKE',   $d->q(gluePath($path, '/.filerun.trash/%'))];
	}
	if ($metaField > 0) {
		$filter[] = ["v.field_id", "=", $d->q($metaField)];
		if (strlen($keyword) > 0) {
			if ($searchMode == 'exact') {
				$filter[] = ["v.val", "=", $d->q($keyword)];
			} else {
				$filter[] = ["v.val", "LIKE", $d->q('%'.$keyword.'%')];
			}
		} else {
			$filter[] = ["v.val", "!=", "''"];
		}
	}
	if ($metaType > 0) {
		$d->table .= 'LEFT JOIN '.MetaTypes::$table.' AS dt ON f.type_id = dt.id';
		$filter[] = ["dt.id", "=", $d->q($metaType)];
	}
	$limit = defaultValue($config['app']['metadata']['search']['results']['limit'], 200);
	$list = $d->select(['f.*', 'p.path', 'p.filename'], $filter, ["p.path" => "ASC"], $limit, 0, false, 'f.id');
}


$mode = 'search';
require($config['path']['includes'].'/grid_listing.php');
jsonOutput(['count' => $count, 'files' => $returnedList]);