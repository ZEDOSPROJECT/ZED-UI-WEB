<?php
\FileRun\Lang::setSection("Admin: Logs");

$export = \S::fromHTML($_REQUEST['export']);

if (!\FileRun\Perms::canManage('logs')) {
	jsonFeedback(false, "You are not allowed to access the activity logs.");
}

$paging = [];

if ($_REQUEST['limit']) {
	$limit = intval(S::fromHTML($_REQUEST['limit']));
	if (is_int($limit)) {
		$paging['perPage'] = $limit;
	}
}

if (!$paging['perPage']) {
	$paging['perPage'] = 20;
}

$paging['pageOffset'] = 0;
if ($_REQUEST['start']) {
	$start = intval(S::fromHTML($_REQUEST['start']));
	if (is_int($start)) {
		$paging['pageOffset'] = $start;
	}
}

$sort = ["id" => "DESC"];
if ($_REQUEST['sort']) {
	$t = S::fromHTML($_REQUEST['sort']);
	if (ctype_alnum($t)) {
		$paging['sort'] = $t;
	}
	$dir = strtoupper(\S::fromHTML($_REQUEST['dir']));
	if ($dir == 'DESC' || $dir == 'ASC') {
		$paging['sort_dir'] = $dir;
	}
	if ($paging['sort'] && $paging['sort_dir']) {
		$sort = array($paging['sort']  => $paging['sort_dir']);
	}
}

$filterUids = false;
if ($_REQUEST['users']) {
	$t = S::fromHTML($_REQUEST['users']);
	$t = str_replace("user:", "", $t);
	$list = explode("|", $t);
	$t = [];
	foreach($list as $uid) {
		$uid = intval($uid);
		if (strlen($uid) > 0 && is_int($uid)) {
			$t[] = $uid;
		}
	}
	if (sizeof($t) > 0) {
		$filterUids = $t;
	}
}

$d = \FileRun\Log::getTable();

$filterCriteria = [];

$usd = \FileRun\Users::getTable();

if (\FileRun\Perms::isIndependentAdmin()) {
	if ($filterUids) {
		$q = array(
			array(
				array("owner", "=", $usd->q($auth->currentUserInfo['id'])),
				array("id", "=", $usd->q($auth->currentUserInfo['id']), "OR"),
			),
			array("id", "IN", "('".implode("','", $filterUids)."')")
		);
	} else {
		$q = array(
			array("owner", "=", $usd->q($auth->currentUserInfo['id'])),
			array("id", "=", $usd->q($auth->currentUserInfo['id']), "OR")
		);
	}
	
	$uids = $usd->selectColumn(array("id"), $q);
	$filterCriteria[] = array("uid", "IN", "('".implode("','", $uids)."')");
} else {
	$adminOver = \FileRun\Perms::getOne('admin_over');
	if (\FileRun\Perms::isSuperUser()) {
		if ($filterUids) {
			$filterCriteria[] = array("uid", "IN", "('".implode("','", $filterUids)."')");
		}
	} else {
		if ($adminOver != "-ALL-") {
			$list = array();
			if (is_array($adminOver)) {
				foreach ($adminOver as $key => $gid) {
					$list = array_merge($list, \FileRun\UserGroups::selectUsersByGroup($gid));
				}
			}
			$list = array_unique($list);
			if ($filterUids) {
				$list = array_intersect($list, $filterUids);
			}
			$filterCriteria[] = array("uid", "IN", "('".implode("','", $list)."')");
		}
	}
}

if ($_REQUEST['actions']) {
	$t = [];
	foreach($_REQUEST['actions'] as $a) {
		$a = \S::fromHTML($a);
		if (strlen($a) > 0 && ctype_alpha($a)) {$t[] = $a;}
	}
	if (sizeof($t) > 0) {
		$filterCriteria[] = ["action", "IN", "('".implode("','", $t)."')"];
	}
}

if ($_REQUEST['date_start']) {
	$dateStart = \S::fromHTML($_REQUEST['date_start']);
	$filterCriteria[] = array("date", ">=", "'".\FileRun\Utils\Date::HTMLDate2MySQL($dateStart, false, "/", array("y" => 2, "m" => 0, "d" => 1))."'");
}
if ($_REQUEST['date_end']) {
	$dateEnd = \S::fromHTML($_REQUEST['date_end']);
	$filterCriteria[] = array("date", "<=", "'".\FileRun\Utils\Date::HTMLDate2MySQL($dateEnd, true, "/", array("y" => 2, "m" => 0, "d" => 1))."'");
}

if ($_REQUEST['search']) {
	$searchKey = \S::fromHTML($_REQUEST['search']);
	$filterCriteria[] = ["data", "LIKE", $d->q('%'.$searchKey.'%')];
}

if (sizeof($filterCriteria) == 0) {$filterCriteria = false;}


if ($export) {
	$q = $d->getQuery("*", $filterCriteria, array("id" => "DESC"));
	$rs = $d->query($q);
	$filename = "Activity Log (".date("j M Y - H.i.s").").csv";
	$relativePath = "/ROOT/HOME/".$filename;
	$logPath = $myfiles->getUserAbsolutePath($relativePath);
	if (!file_exists($logPath)) {
		$fp = fopen($logPath, "w");

		if ($fp) {
			fputcsv($fp, array("No", "Date", "UserID", "Username", "Name", "Last name", "Action", "Details"));
			$i = 0;
			foreach($rs as $k => $row) {
				$i++;
				$userInfo = \FileRun\Users::getInfo($row['uid'], array("username", "name", "name2"));
				$row['data'] = unserialize($row['data']);
				$details = array();
				if (is_array($row['data'])) {
					foreach ($row['data'] as $key => $val) {
						if (is_array($val)) {
							$val = print_r($val, 1);
						}
						$details[] = $key.": ".$val;
					}
				}
				$details = implode("\r\n", $details);
				$data = array(
					$i,
					$row['date'],
					$row['uid'],
					$userInfo['username'],
					$userInfo['name'],
					$userInfo['name2'],
					\notifications::getActionName($row['action']),
					$details
				);
				$rs = fputcsv($fp, $data);
			}
			fclose($fp);
			jsonFeedback(true, \FileRun\Lang::t("The search results have been saved to your home folder as \"%1\"", false, array($filename)));
		}
	}
} else {
	$rs = $d->select("*", $filterCriteria, $sort, $paging['perPage'], $paging['pageOffset']);
}

$paging['total'] = $d->selectOneCol("COUNT(id)", $filterCriteria);
//$paging['total'] = $db->GetOne("SELECT FOUND_ROWS()");

$rows = [];
foreach ($rs as $r) {
	$userInfo = \FileRun\Users::getInfo( $r['uid']);
	if (!$userInfo) {
		$userInfo['name'] = "<em>-deleted user-<br>id: ".$r['uid']."</em>";
	}
	$data = unserialize($r['data']);
	if (is_array($data)) {
		$detailsTemplateFile = $GLOBALS['section_path']."/php/details/".$r['action'].".php";
		ob_start();
		if (file_exists($detailsTemplateFile)) {
			require($detailsTemplateFile);
		} else {
?><table cellspacing="1" border="0" class="niceborder verysmall">
<?php foreach ($data as $key => $val) {?>
<tr>
	<td><?php echo $key?></td>
	<td><?php
		if (is_array($val)) {$val = implode('<br>', $val);}
		echo S::forHTML($val);
	?></td>
</tr>
<?php }?>
</table><?php
		}
		$details = ob_get_clean();
	} else {
		if (strlen($data) > 0) {
			$details = $data;
		} else {
			$details = "";
		}
	}

	$actionName = \notifications::getActionName($r['action']);
	if (stristr($r['action'], 'fail')) {
		$actionName = '<span class="colorRed">'.$actionName.'</span>';
	}
    $name = implode(' ', array($userInfo['name'], $userInfo['name2']));
	$rows[] = array(
		'avatar' => '<img src="a/?uid='.$r['uid'].'" class="avatar-xs" />',
		"id" => $r['id'],
		"name" => $name,
		"date" => date(\FileRun\Lang::t("Date Format: Grid - Date"), strtotime($r['date'])),
		"action" => $actionName,
		"details" => $details
	);
}

$returnedFields = [];
$returnedFields[] = ['header' => '&nbsp;', 'name' => 'avatar',  'width' => 28, 'resizable' => false];
$returnedFields[] = ["header" => "ID", "name" => "id", "hidden" => true];
$returnedFields[] = ["header" => \FileRun\Lang::t("Name"), "name" => "name", "width" => 70];
$returnedFields[] = ["header" => \FileRun\Lang::t("Date"), "name" => "date", "width" => 130, "sortable" => true];
$returnedFields[] = ["header" => \FileRun\Lang::t("Action"), "name" => "action", "width" => 120, "sortable" => true];
$returnedFields[] = ["header" => \FileRun\Lang::t("Details"), "name" => "details", "width" => 400];

jsonOutput([
	"success" => true,
	"metaData" => [
		"fields" => $returnedFields,
		"root" => "rows",
		"totalProperty" => "totalCount"
	],
	"totalCount" => $paging['total'],
	"rows" => $rows
]);