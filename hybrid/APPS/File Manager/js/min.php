<?php
chdir(dirname(dirname(__FILE__)));
if (isset($_GET['cpanel'])) {
	$files = [
		'ext/ux/ScriptLoader.js',
		'cpanel/ext.overrides.js',
		'cpanel/app.js',
		'cpanel/tree.js',
		'cpanel/grid.js',
		'cpanel/layout.js',
		'fileman/user_chooser.js',
		'cpanel/userslist.comp.js',
		'cpanel/editform.comp.js',
		'genpass.js',
		'ext/ux/statusbar/StatusBar.js'
	];
} else if (isset($_GET['extjs'])) {
	if (isset($_GET['debug'])) {
		$files = [
			'ext/adapter/ext/_ext-base-debug.js',
			'ext/_ext-all-debug-w-comments.js',
		];
	} else {
		$files = [
			'ext/adapter/ext/ext-base.js',
			'ext/ext-all.js',

		];
	}
	array_push($files,
	    'ext/ux/overrides.js',
		'ext/ux/LocalStorage.js',
		'ext/ux/FileRunPrompt.js',
		'ext/ux/ListPanel.js'
	);
} else if (isset($_GET['weblink_gallery'])) {
		$files = [
			'jquery/jquery.min.js',
			'nanobar.min.js',
			'headroom.min.js',
			'jquery/jG/jquery.justifiedGallery.min.js',
			'weblink.js'
		];
		if (isset($_GET['debug'])) {
			$files[] = 'jquery/swipebox/js/_jquery.swipebox.js';
		} else {
			$files[] = 'jquery/swipebox/js/jquery.swipebox.min.js';
		}
} else if (isset($_GET['file_request'])) {
	$files = [
		'file_request.js'
	];
	if (isset($_GET['debug'])) {
		$files[] = 'flow/_flow.js';
		$files[] = 'flow/_flowfile.js';
		$files[] = 'flow/_flowchunk.js';
	} else {
		$files[] = 'flow/all-standalone.min.js';
	}
} else if (isset($_GET['flow'])) {
	if (isset($_GET['debug'])) {
		$files[] = 'flow/_flow.js';
		$files[] = 'flow/_flowfile.js';
		$files[] = 'flow/_flowchunk.js';
		$files[] = 'flow/_flowext.js';
	} else {
		$files[] = 'flow/all.min.js';
	}
} else if (isset($_GET['flow-standalone'])) {
	if (isset($_GET['debug'])) {
		$files[] = 'flow/_flow.js';
		$files[] = 'flow/_flowfile.js';
		$files[] = 'flow/_flowchunk.js';
	} else {
		$files[] = 'flow/all-standalone.min.js';
	}
} else {
	$files = [
		'ext/ux/ProgressColumn/ProgressColumn.js',
		'ext/ux/GridDragSelector.js',
		'fileman/filerun.js',
		'fileman/toolbars_and_menus.js',
		'fileman/grid/column_model.js',
		'fileman/grid/view.js',
		'fileman/grid/store.js',
		'fileman/grid/panel.js',
		'fileman/tree_node_ui.js',
		'fileman/tree.js',
		'fileman/info_panel.js',
		'fileman/details_panel.js',
		'fileman/download_cart_store.js',
		'fileman/download_cart.js',
		'fileman/activity_panel.js',
		'fileman/comments_panel.js',
		'fileman/audio_player.js',
		'fileman/layout.js',
		'fileman/ui_utils.js',
		'fileman/searchbox.js',
		'fileman/actions.js',
		'fileman/image_viewer.js'
	];
	if (isset($_GET['debug'])) {
		$files[] = 'flow/_flow.js';
		$files[] = 'flow/_flowfile.js';
		$files[] = 'flow/_flowchunk.js';
		$files[] = 'flow/_flowext.js';
	} else {
		$files[] = 'flow/all.min.js';
	}
}


if (extension_loaded("zlib") && (ini_get("output_handler") != "ob_gzhandler")) {
	ini_set("zlib.output_compression", 1);
}

header("Content-Type: application/javascript; charset=UTF-8");
header("Cache-control: public");
header("Pragma: cache");
header("Expires: " . gmdate ("D, d M Y H:i:s", time() + 31356000) . " GMT");

foreach ($files as $key => $file) {
	readfile('js/'.$file);
	echo "\r\n";
}