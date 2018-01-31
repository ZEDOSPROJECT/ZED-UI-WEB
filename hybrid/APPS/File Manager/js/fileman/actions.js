FR.utils = {
	currentFolderAllowsUpload: function () {
		if (User.perms.upload) {
			if (!FR.UI.tree.currentSelectedNode) {
				return false;
			}
			var section = FR.UI.tree.currentSelectedNode.attributes.section;
			if (section == 'myfiles') {
				return true;
			} else {
				if (section == 'sharedFolder') {
					if (FR.currentFolderPerms && FR.currentFolderPerms.upload) {
						return true;
					}
				}
			}
		}
		return false;
	},
	canAddComments: function () {
		if (User.perms.write_comments) {
			var currentFolderPerms = FR.UI.tree.currentSelectedNode.attributes.perms;
			if (currentFolderPerms && currentFolderPerms.comment == false) {
				return false;
			}
			return true;
		}
	},
	reloadGrid: function (highlightOnDisplay) {
		if (highlightOnDisplay) {
			FR.UI.gridPanel.highlightOnDisplay = highlightOnDisplay;
		}
		FR.UI.gridPanel.load(FR.currentPath);
	},
	reloadTree: function() {
		if (['myfiles', 'sharedFolder', 'userWithShares'].indexOf(FR.currentSection) != -1) {
			var n = FR.UI.tree.currentSelectedNode;
			if (n.loading == false && n.loaded == true) {
				FR.UI.tree.reloadNode(n);
			}
		}
	},
	pathInfo: function (path) {
		var s = path.split('/');
		return {basename: s.pop(), dirname: s.join('/')};
	},
	getFileExtension: function (filename) {
		var dotpos = filename.lastIndexOf(".");
		if (dotpos == -1) {
			return '';
		}
		return filename.substr(dotpos + 1).toLowerCase();
	},
	stripFileExtension: function (filename) {
		var dotpos = filename.lastIndexOf(".");
		if (dotpos == -1) {
			return filename;
		}
		if (dotpos == 0) {
			return '';
		}
		return filename.substr(0, dotpos);
	},
	dimExt: function (filename) {
		var dot = filename.lastIndexOf(".");
		if (dot == -1) {
			return filename;
		}
		var name = filename.substr(0, dot);
		var ext = filename.substr(dot);
		return name + '<span class="gray">' + ext + '<span>';
	},
	humanFilePath: function (str) {
		str = str.replace('/ROOT/HOME', FR.T('My Files'));
		str = str.replace('/ROOT/TRASH', FR.T('Trash'));
		return str;
	},
	supportsImageViewer: function(item) {
		if (item.data.isFolder) {return false;}
		if (item.data.filetype == 'wvideo') {return true;}
		if (item.data.thumb) {
			var ext = this.getFileExtension(item.data.filename);
			if (ext != 'epub' && item.data.filetype != 'mp3') {
				return true;
			}
		}
	},
	showPreview: function (item) {
		if (!User.perms.download) {return false;}
		if (!item) {
			item = FR.UI.gridPanel.getOneSel();
		}
		var path = item.data.path;
		FR.previewData = {path: path, filename: item.data.filename};
		if (item.data.filetype == 'mp3') {
			FR.UI.AudioPlayer.open(item);
			return true;
		}
		if (this.supportsImageViewer(item)) {
			if (!FR.UI.ImageViewer) {
				FR.UI.ImageViewer = new FR.components.ImageViewer();
			}
			FR.UI.ImageViewer.open(item);
			return true;
		}
		var opts = {
			title: item.data.filename,
			autoDestroy: true, resizable: true,
			src: FR.baseURL + '/?module=fileman&section=utils&page=file_preview',
			post: [{name: 'path', value: path}]
		};
		if (item.data.filetype == 'arch') {
			opts.width = 500;
			opts.height = 400;
		}
		FR.UI.popup(opts);
		return true;
	},
	locateSelected: function () {
		var s = FR.UI.gridPanel.getOneSel().data;
		if (s.isFolder) {
			FR.utils.locateItem(s.path);
		} else {
			FR.utils.locateItem(FR.utils.pathInfo(s.path).dirname, s.filename);
		}
	},
	locateItem: function (path, filename, callback) {
		if (filename) {
			if (path == FR.currentPath) {
				FR.UI.gridPanel.highlight(filename);
				return true;
			}
			FR.UI.gridPanel.highlightOnDisplay = filename;
		}
		if (!callback) {
			callback = function (success, selNode) {
				if (success && selNode) {
					selNode.ensureVisible();
				}
			}
		}
		FR.UI.tree.panel.selectPath(path, 'pathname', callback);
	},
	browseToPath: function(path) {
		this.locateItem(path, false, function (success, selNode) {
			if (success && selNode) {
				selNode.ensureVisible();
			} else {
				if (FR.UI.tree.currentSelectedNode) {
					FR.UI.tree.reloadNode(FR.UI.tree.currentSelectedNode, function () {
						FR.utils.locateItem(path);
					});
				}
			}
		});
	},
	applyFileUpdates: function(path, updates) {
		var treeNode = FR.UI.tree.panel.findNodeByPath(path);
		if (treeNode) {
			if (!treeNode.attributes.custom) {treeNode.attributes.custom = {};}
			if (updates == 'remove') {
				treeNode.parentNode.removeChild(treeNode);
				if (!FR.UI.tree.currentSelectedNode) {
					FR.UI.tree.homeFolderNode.select();
				}
			} else if (updates == 'reload') {
				FR.UI.tree.reloadNode(treeNode);
			} else {
				Ext.iterate(updates, function (k, v) {
					if (['weblink', 'star', 'share', 'notInfo', 'label'].indexOf(k) != -1) {
						treeNode.attributes.custom[k] = v;
					} else if (k == 'filename') {
						var oldPath = treeNode.getPath('pathname');
						treeNode.attributes.pathname = v;
						treeNode.setText(v);
						if (oldPath == FR.currentPath) {
							FR.currentPath = treeNode.getPath('pathname');
							FR.utils.reloadGrid();
						}
					}
				});
				FR.UI.tree.updateIcon(treeNode);
			}
		}
		var gridRow = FR.UI.gridPanel.getByPath(path);
		if (gridRow) {
			if (updates == 'remove') {
				var store = FR.UI.gridPanel.getStore();
				store.remove(store.getById(gridRow.id));
			} else {
				Ext.iterate(updates, function (k, v) {
					if (['star', 'label', 'share', 'comments', 'notInfo'].indexOf(k) != -1) {
						gridRow.data[k] = v;
					} else if (k == 'weblink') {
						gridRow.data.hasWebLink = v;
					} else if (k == 'lock') {
						gridRow.data.lockInfo = v;
					} else if (k == 'filename') {
						if (gridRow.data.path) {
							var pi = FR.utils.pathInfo(gridRow.data.path);
							gridRow.data.path = pi.dirname + '/' + v;
						}
						gridRow.data.filename = v;
					}
				});
				FR.UI.gridPanel.getView().refresh();
			}
		}
	},
	applyBatchFileUpdates: function(updates) {
		Ext.each(updates, function(u) {this.applyFileUpdates(u.path, u.updates);}, this);
	},
	elementInView: function(o, s, offset) {
		var b = s.bottom;
		if (offset) {b = b*offset;}
		return (o.top <= b && o.bottom >= s.top && o.right >= s.left && o.left <= s.right);
	},
	encodeURIComponent: function(s) {
		return encodeURIComponent(s).replace(/\-/g, "%2D").replace(/\_/g, "%5F").replace(/\./g, "%2E").replace(/\!/g, "%21").replace(/\~/g, "%7E").replace(/\*/g, "%2A").replace(/\'/g, "%27").replace(/\(/g, "%28").replace(/\)/g, "%29");
	}
};

FR.contextMenuActions = {
	refresh: function() {
		FR.utils.reloadGrid();
		FR.utils.reloadTree();
	},
	selectAll: function () {FR.UI.gridPanel.selModel.selectAll();},
	sortItems: function() {
		FR.UI.gridPanel.getView().mainHd.setStyle('display', 'block');
		FR.UI.feedback(FR.T('Use the displayed header bar to sort by the desired field.'));
	},
	locate: function() {return FR.utils.locateSelected();},
	newFolder: function(cm) {
		var path;
		if (cm.location == 'tree') {
			var n = FR.UI.tree.panel.getNodeById(cm.target.id);
			path = n.getPath('pathname');
		} else {
			path = (cm.target[0].path);
		}
		new Ext.ux.prompt({
			title: FR.T('New sub-folder'), defaultValue: FR.T('New Folder'),
			confirmHandler: function(folderName) {
				if (folderName) {
					FR.actions.newFolder(path, folderName);
				}
			}
		});
	},
	download: function(cm) {
		if (cm.location == 'tree') {
			var n = FR.UI.tree.panel.getNodeById(cm.target.id);
			FR.actions.download([n.getPath('pathname')], cm.target.text);
		} else {
			if (cm.target.length == 1) {
				var s = cm.target[0];
				FR.actions.download(s.path, s.filename);
			} else {
				FR.UI.infoPanel.expand();
				FR.UI.infoPanel.tabs.cartPanel.show();
				Ext.each(cm.targetFiles, function(d) {FR.UI.infoPanel.tabs.cartPanel.addItem(d);}, this);
			}
		}
	},
	preview: function() {FR.utils.showPreview();},
	addStar: function(cm) {FR.actions.star(cm, 'add');},
	removeStar: function(cm) {FR.actions.star(cm, 'remove');},
	weblink: function(cm) {
		var t = cm.getTargetFileInfo();
		FR.actions.WebLink(t.path, t.filename);
	},
	unweblink: function() {FR.actions.UnWebLink();},
	shareWithUsers: function(cm) {
		var t = cm.getTargetFileInfo();
		FR.sharing = {
			path: t.path,
			name: t.filename
		};
		if (cm.location == 'tree') {
			FR.sharing.type = 'folder';
		} else {
			FR.sharing.type = cm.target[0].isFolder ? 'folder': 'file';
		}
		FR.UI.persistentWindow({
			id: 'folderShare',
			src:FR.baseURL+'/?module=fileman_myfiles_share',
			post: [{name:'path', value: FR.sharing.path}], modal: true,
			width:550, height:380, title: FR.sharing.name,
			initMsg: FR.T('Loading...')
		});
	},
	email: function(cm) {
		var items = [];
		if (cm.location == 'tree') {
			var n = FR.UI.tree.panel.getNodeById(cm.target.id);
			items.push({icon: 'f.png', filename: cm.target.text, path: n.getPath('pathname'), isFolder: true});
		} else {
			Ext.each(cm.target, function (s) {
				var path = (s.path);
				items.push({icon: s.icon, filename: s.filename, path: path, filesize: s.filesize, isFolder: s.isFolder});
			});
		}
		FR.actions.emailFiles(items, true);
	},
	props: function(cm) {
		var params = [];
		var t = cm.getTargetFileInfo();
		params.push({name:'path', value: t.path});
		FR.UI.popup({
			src:FR.baseURL+'/?module=folder_options',
			post: params,
			width:380, height:350, title: t.filename,
			initMsg: FR.T('Loading...')
		});
	},
	comment: function() {return FR.UI.infoPanel.showComments();},
	metadata: function(cm) {
		var t = cm.getTargetFileInfo();
		FR.actions.openMetadata({title: t.filename, path: t.path});
	},
	activityLog: function(cm) {
		var s = cm.target[0];
		var path = s.path;
		FR.UI.popup({
			loadingMsg: FR.T('Loading the file\'s activity log...'),
			src:FR.baseURL+'/?module=filelog&section=default&page=default',
			post: [{name: 'path', value: path}],
			title: s.filename
		});
	},
	zip: function(cm) {
		var paths = [];
		var zipName = FR.T('New Archive.zip');
		if (cm.location == 'tree') {
			var n = FR.UI.tree.panel.getNodeById(cm.target.id);
			paths.push(n.getPath('pathname'));
			zipName = FR.utils.stripFileExtension(cm.target.text)+'.zip';
		} else {
			if (cm.target.length == 1) {
				zipName = FR.utils.stripFileExtension(cm.target[0].filename)+'.zip';
			}
			Ext.each(cm.target, function (s) {
				var path = s.path;
				paths.push(path);
			});
		}
		new Ext.ux.prompt({
			title: FR.T('Add to zip'),
			text: FR.T('Please type a name for the zip file:'),
			defaultValue: zipName,
			confirmHandler: function(zipName) {
				if (zipName) {
					var target = FR.currentPath+'/'+zipName;
					FR.actions.abstractZip(target, paths);
				}
			}
		});
	},
	extract: function() {return FR.actions.extractPrompt();},
	lock: function() {return FR.actions.changeLocking(true);},
	unlock: function() {return FR.actions.changeLocking(false);},
	copy: function(cm) {
		FR.copyingPaths = [];
		if (cm.location == 'tree') {
			var n = FR.UI.tree.panel.getNodeById(cm.target.id);
			FR.copyingPaths.push(n.getPath('pathname'));
		} else {
			Ext.each(cm.target, function (s) {
				FR.copyingPaths.push(s.path);
			});
		}
		FR.UI.feedback(FR.T('Right-click the destination folder for pasting the copied item'));
		return true;
	},
	pasteCopied: function(cm) {
		var pars = {'paths[]': []};
		if (cm.location == 'tree') {
			var n = FR.UI.tree.panel.getNodeById(cm.target.id);
			pars.copyTo = n.getPath('pathname');
		} else {
			pars.copyTo = FR.currentPath;
			if (cm.target[0]) {
				pars.copyTo = cm.target[0].path;
			}
		}
		Ext.each(FR.copyingPaths, function(p) {pars['paths[]'].push(p);});
		FR.UI.showLoading(FR.T('Copying...'));
		Ext.Ajax.request({
			url: FR.myfilesBaseURL+'&page=action_copy',
			method: 'post',
			params: pars,
			callback: function(opts, succ, req) {
				FR.UI.doneLoading();
				FR.copyingPaths = [];
				try {
					var rs = Ext.decode(req.responseText);
				} catch (er){return false;}
				if (rs.success) {
					FR.utils.reloadTree();
					FR.utils.reloadGrid();
					FR.UI.reloadStatusBar();
				}
				FR.UI.feedback(rs.msg);
			}
		});
		return true;
	},
	rename: function(cm) {
		var t = cm.getTargetFileInfo();
		var pars = {path: t.path};
		new Ext.ux.prompt({
			title: FR.T('Rename'), defaultValue: t.filename,
			text: FR.T('Please enter a new name for the item:'),
			confirmHandler: function(newValue, oldValue) {
				if (newValue && newValue != oldValue) {
					pars.newfilename = newValue;
					FR.UI.showLoading(FR.T('Renaming file...'));
					Ext.Ajax.request({
						url: FR.myfilesBaseURL+'&page=action_rename',
						method: 'post',
						params: pars,
						callback: function(opts, succ, req) {
							FR.UI.doneLoading();
							try {
								var rs = Ext.decode(req.responseText);
							} catch (er){return false;}
							if (rs.updates) {FR.utils.applyBatchFileUpdates(rs.updates);}
							if (rs.msg) {
								FR.UI.feedback(rs.msg);
							}
						}
					});
				}
			}
		});
	},
	remove: function(cm) {
		var paths = [];
		FR.removeParams = {};
		var hasFolders = false;
		if (cm.location == 'tree') {
			var n = FR.UI.tree.panel.getNodeById(cm.target.id);
			paths.push(n.getPath('pathname'));
			hasFolders = true;
			FR.removeParams['paths[]'] = paths;
		} else if (cm.location == 'grid') {
			if (FR.currentSection == 'trash') {
				var ids = [];
				Ext.each(cm.target, function (i) {ids.push(i.uniqid);});
				FR.removeParams['ids[]'] = ids;
			} else {
				Ext.each(cm.target, function (s) {
					if (s.isFolder) {
						hasFolders = true;
					}
					paths.push(s.path);
				});
				FR.removeParams['paths[]'] = paths;
			}
		}
		if (hasFolders) {
			if (!FR.UI.folderDelConfirmWin) {
				FR.UI.folderDelConfirmWin = new Ext.Window({
					title: FR.T('Delete folder?'), constrain: true,
					width: 400, modal: true,
					closable : false, resizable: false, closeAction: 'close', stateful: false, bodyStyle:'padding-bottom:20px',
					html : '<div style="font-size:12px;margin: 10px 0">'+FR.T('The selected folder and all its contents will be deleted.')+'</div><div style="margin:10px 0;color:gray;font-size:11px"><label><input type="checkbox" value="1" id="folderDelConfWinPerm" style="vertical-align:bottom;margin-right:3px;" />'+FR.T('Permanent deletion')+'</label></div>',
					buttonAlign: 'right',
					buttons: [{
						text: FR.T('Remove'), cls: 'fr-btn-default',
						handler: function() {
							FR.UI.folderDelConfirmWin.hide();
							if (Ext.get('folderDelConfWinPerm')) {
								if (Ext.get('folderDelConfWinPerm').dom.checked) {
									FR.removeParams.permanent = true;
								}
								Ext.get('folderDelConfWinPerm').dom.checked = false;
							}
							FR.actions.remove();
						}
					}, {
						text : FR.T('Cancel'), cls: 'fr-btn-default fr-btn-primary', style: 'margin-left:15px',
						handler : function() {
							FR.UI.folderDelConfirmWin.hide();
						}
					}]
				});
			}
			FR.UI.folderDelConfirmWin.show();
			return true;
		}
		FR.actions.remove();
	},
	restore: function(cm) {
		var s = FR.UI.gridPanel.getSelectedFiles();
		var ids = [];
		Ext.each(cm.target, function (i) {
			ids.push(i.uniqid);
		});
		FR.UI.showLoading(FR.T('Restoring file(s)...'));
		Ext.Ajax.request({
			url: FR.baseURL+'/?module=trash&section=ajax&page=grid_action_restore',
			method: 'post',
			params: {'ids[]': ids},
			callback: function(opts, succ, req) {
				FR.UI.doneLoading();
				try {
					var rs = Ext.decode(req.responseText);
				} catch (er){return false;}
				if (rs.success) {
					if (rs.trashCount == 0) {
						FR.UI.tree.trashNode.getUI().hide();
						if (FR.currentSection == 'trash') {
							FR.UI.tree.homeFolderNode.select();
						}
					} else {
						FR.utils.reloadGrid();
					}
					FR.UI.tree.panel.getRootNode().eachChild(function(node) {if (node.loaded && node.expanded) {FR.UI.tree.reloadNode(node);}});
				}
				FR.UI.feedback(rs.msg);
			}
		});
	},
	emptyTrash: function() {return FR.actions.emptyTrash();},
	indexMetadata: function(cm) {
		FR.UI.popup({
			id: 'metadataIndex', closable: false,
			src: FR.baseURL+'/?module=metadata&section=index',
			width: 400, height: 200,
			post: {name:'path', value: cm.getTargetFileInfo().path},
			autoDestroy: true
		});
	},
	saveNotif: function(settings) {
		var cm = FR.UI.contextMenu;
		var path = false;
		if (cm.location == 'tree') {
			var n = FR.UI.tree.panel.getNodeById(cm.target.id);
			path = n.getPath('pathname');
		} else {
			path = cm.target[0].path;
		}
		FR.actions.saveNotifications(path, settings);
	},
	customAction: function(cm, ca, e) {
		return FR.actions.customActionFromCM(cm, ca, e);
	}
};

FR.actions.openMetadata = function(opts) {
	FR.UI.popup({
		title: opts.title,
		width: (FR.isMobile ? 350 : 450), height: 400, autoDestroy: true,
		src: FR.baseURL+'/?module=metadata'+'&path='+encodeURIComponent(opts.path),
		loadingMsg: FR.T('Loading...')
	});
};

FR.actions.remove = function() {
	var url = FR.myfilesBaseURL+'&page=action_delete';
	if (FR.removeParams['ids[]']) {
		url = FR.baseURL + '/?module=trash&section=ajax&page=grid_action_delete';
	}
	FR.removeParams.csrf = User.csrf_token;
	Ext.Ajax.request({
		url: url, method: 'post', params: FR.removeParams,
		callback: function(opts, succ, req) {
			try {
				var rs = Ext.decode(req.responseText);
			} catch (er){return false;}
			if (rs.success) {
				if (rs.updates) {FR.utils.applyBatchFileUpdates(rs.updates);}
				if (FR.currentSection == 'trash') {
					if (rs.trashCount == 0) {
						FR.UI.tree.homeFolderNode.select();
						FR.UI.tree.trashNode.getUI().hide();
					}
				} else {
					if (!FR.removeParams.permanent) {
						FR.UI.tree.trashNode.getUI().show();
					}
				}
				FR.UI.reloadStatusBar();
			}
			FR.UI.feedback(rs.msg);
			FR.removeParams = {};
		}
	});
};

FR.actions.download = function(paths, archiveName) {
	if (!User.perms.download) {return false;}
	var frm = document.createElement('FORM');
	var url = FR.myfilesBaseURL+'&page=download';
	if (archiveName) {url += '&archiveName='+encodeURIComponent(archiveName);}
	frm.action = url;
	frm.method = 'POST';
	frm.target = '_blank';
	Ext.each(paths, function(p) {
		inpt = document.createElement('INPUT');
		inpt.type = 'hidden';
		inpt.name = 'paths[]';
		inpt.value = encodeURIComponent(p);
		frm.appendChild(inpt);
	});
	Ext.get('theBODY').appendChild(frm);
	frm.submit();
	Ext.get(frm).remove();
};
FR.actions.openFileInBrowser = function(path) {
	var downloadURL = FR.myfilesBaseURL+'&page=download&open_in_browser=1&paths[]='+encodeURIComponent(path);
	FR.UI.feedback(FR.T('Opening popup window... <br>Click <a href="%1" target="_blank">here</a> if the browser prevents it from opening.').replace('%1', downloadURL));
	window.setTimeout(function() {window.open(downloadURL);}, 50);
};
FR.actions.openAccountSettings = function() {
	FR.UI.popup({
		id: 'accountSettings', title: FR.T('Account settings'),
		src: FR.baseURL+'/?module=fileman&section=profile',
		width: 470, height: 470, autoDestroy: true, modal: true,
		loadingMsg: FR.T('Loading...')
	});
};
FR.actions.clearActivityLog = function(path) {
	FR.UI.showLoading(FR.T('Clearing activity log...'));
	Ext.Ajax.request({
		url: FR.baseURL+'/?module=filelog&section=default&page=clear_log',
		method: 'post',
		params: 'path='+encodeURIComponent(path),
		callback: function(opts, succ, req) {
			FR.UI.doneLoading();
			try {
				var rs = Ext.decode(req.responseText);
			} catch (er){return false;}
			if (rs.msg) {FR.UI.feedback(rs.msg);}
		}
	});
};
FR.actions.move = function(drop, target) {
	FR.moveParams = {'paths[]': [], moveTo: target};
	var paths = [];
	var hasFolders = false;
	if (drop.data.grid) {
		Ext.each(drop.data.selections, function(s) {
			if (s.data.isFolder) {hasFolders = true;}
			FR.moveParams['paths[]'].push(s.data.path);
		});
	} else if (drop.tree) {
		hasFolders = true;
		FR.moveParams['paths[]'].push(drop.dropNode.getPath('pathname'));
	} else {
		return false;
	}
	if (hasFolders) {
		new Ext.ux.prompt({
			title: FR.T('Move folder?'),
			text: FR.T('Are you sure you want to move the folder?'),
			confirmHandler: function() {
				FR.actions.doMove();
			}
		});
		return true;
	}
	FR.actions.doMove();
};
FR.actions.doMove = function() {
	FR.UI.showLoading(FR.T('Moving files...'));
	Ext.Ajax.request({
		url: FR.myfilesBaseURL+'&page=action_move', method: 'post', params: FR.moveParams,
		callback: function(opts, succ, req) {
			FR.UI.doneLoading();
			try {
				var rs = Ext.decode(req.responseText);
			} catch (er){return false;}
			if (rs.success) {
				if (rs.updates) {FR.utils.applyBatchFileUpdates(rs.updates);}
				FR.UI.reloadStatusBar();
			}
			FR.UI.feedback(rs.msg);
			FR.moveParams = {};
		}
	});
};
FR.actions.emptyTrash = function(cnfirm) {
	if (!cnfirm) {
		new Ext.ux.prompt({
			title: FR.T('Empty trash?'),
			text: FR.T('All files and folders in your trash are about to be permanently deleted.'),
			confirmHandler: function() {FR.actions.emptyTrash(true);}
		});
		return true;
	}
	FR.UI.showLoading(FR.T('Emptying trash...'));
	Ext.Ajax.request({
		url: FR.baseURL+'/?module=trash&section=ajax&page=empty', method: 'post',
		callback: function(opts, succ, req) {
			FR.UI.doneLoading();
			try {var rs = Ext.decode(req.responseText);} catch (er){return false;}
			if (rs.success) {
				if (FR.currentSection == 'trash') {
					FR.UI.tree.homeFolderNode.select();
				}
				FR.UI.tree.trashNode.getUI().hide();
				FR.UI.reloadStatusBar();
			}
			if (rs.msg) {FR.UI.feedback(rs.msg);}
		}
	});
};
FR.actions.newFolder = function(path, folderName, callback) {
	var pars = {path: path, name: folderName};
	//FR.UI.showLoading(FR.T('Creating new folder...'));
	Ext.Ajax.request({
		url: FR.myfilesBaseURL+'&page=action_new_folder',
		method: 'post',
		params: pars,
		callback: function(opts, succ, req) {
			//FR.UI.doneLoading();
			FR.UI.tree.panel.getEl().unmask();
			try {
				var rs = Ext.decode(req.responseText);
			} catch (er){return false;}
			if (rs.rs) {
				if (FR.currentPath == pars.path) {
					FR.utils.reloadGrid(pars.name);
				}
				var treeNode = FR.UI.tree.panel.findNodeByPath(pars.path);
				if (treeNode) {treeNode.reload();}
				if (callback) {callback(pars.name, rs);}
			}
			if (rs.msg) {FR.UI.feedback(rs.msg);}
		}
	});
};
FR.actions.changeLocking = function(lock) {
	FR.currentlyLockingItem = FR.UI.gridPanel.getOneSel();
	var path = FR.currentlyLockingItem.data.path;
	FR.UI.showLoading(FR.T(lock?'Locking file...':'Unlocking file...'));
	Ext.Ajax.request({
		url: FR.baseURL+'/?module=versioning&section=ajax&page=locking&action='+(lock?'lock':'unlock'),
		method: 'post',
		params: 'path='+encodeURIComponent(path),
		callback: function(opts, succ, req) {	
			FR.UI.doneLoading();
			try {
				var rs = Ext.decode(req.responseText);
			} catch (er){return false;}
			if (rs.msg) {
				FR.UI.feedback(rs.msg);
			}
			if (rs.rs) {
				if (FR.currentlyLockingItem) {
					FR.currentlyLockingItem.data.lockInfo = rs.status;
					FR.UI.gridPanel.getView().refresh();
				}
			}
		}
	});
};

FR.actions.abstractZip = function(target, paths)  {
	var pars = {target: target};
	pars['paths[]'] = paths;
	FR.UI.showLoading(FR.T('Zipping files...'));
	Ext.Ajax.request({
		url: FR.myfilesBaseURL+'&page=action_zip',
		method: 'post',
		params: pars,
		callback: function(opts, succ, req) {
			FR.UI.doneLoading();
			try {
				var rs = Ext.decode(req.responseText);
			} catch (er){return false;}
			if (rs.msg) {FR.UI.feedback(rs.msg);}
			if (rs.success) {
				FR.utils.reloadGrid();
				FR.UI.reloadStatusBar();
			} else {
				if (!rs.msg) {
					new Ext.ux.prompt({text: FR.T('An error occurred while trying to process the request.')});
				}
			}
		}
	});
};
FR.actions.extractPrompt = function() {
	var fileName = FR.UI.gridPanel.getOneSel().data.filename;
	var exts = ['zip', 'tar', 'tar.gz', 'tgz', 'tar.bz2', 'tbz', 'jar', 'gz'];
	var suggestedFolderName = FR.T('Extracted Files');
	Ext.each(exts, function(x){
		if (fileName.substring(fileName.length-x.length).toLowerCase() == x) {
			suggestedFolderName = fileName.substring(0, fileName.length-(x.length+1));
			return false;
		}
	});
	new Ext.ux.prompt({
		title: FR.T('Extract archive'), allowEmpty: true,
		text: FR.T('Please type a folder name for the archive contents:'),
		defaultValue: suggestedFolderName, confirmHandler: function(folderName) {
			FR.actions.extractSelected(FR.currentPath, fileName, folderName);
		}
	});
};
FR.actions.extractSelected = function(path, fileName, folderName) {
	var pars = 'path='+encodeURIComponent(path);
	pars += '&filename='+encodeURIComponent(fileName);
	pars += '&folderName='+encodeURIComponent(folderName);
	FR.UI.showLoading(FR.T('Extracting archive contents...'));
	Ext.Ajax.request({
		url: FR.myfilesBaseURL+'&page=extract_archive',
		method: 'post',
		params: pars,
		callback: function(opts, succ, req) {
			FR.UI.doneLoading();
			try {
				var rs = Ext.decode(req.responseText);
			} catch (er){return false;}
			if (rs.rs) {
				FR.utils.reloadGrid();
				FR.utils.reloadTree();
				FR.UI.reloadStatusBar();
			}
			FR.UI.feedback(rs.msg);
		}
	});
	return true;
};

FR.actions.emailFiles = function(items, sendLinks) {
	FR.sendingByEmail = {items: items, sendLinks: sendLinks};
	FR.UI.persistentWindow({
		id: 'emailFiles',
		src: FR.baseURL+'/?module=email',
		width: (FR.isMobile ? 350 : 480), height: 440,
		title: FR.T('E-mail Files'), modal: true,
		initMsg: FR.T('Loading...')
	});
};
FR.actions.WebLink = function(path, itemTitle, isFileRequest) {
	FR.WebLinking = {path: path, isFileRequest: isFileRequest};
	FR.UI.persistentWindow({
		id: 'webLink',
		src: FR.baseURL+'/?module=weblinks',
		width: (FR.isMobile ? 350 : 450), height: 300, closable: false,
		title: itemTitle, modal: true, resizable: true,
		initMsg: FR.T('Loading...')
	});
};
FR.actions.UnWebLink = function() {
	var params = {'paths[]':[]};
	Ext.each(FR.UI.gridPanel.getSelectedFiles(), function(item) {
		params['paths[]'].push(item.path);
	});
	//FR.UI.showLoading(FR.T('Removing weblinks...'));
	Ext.Ajax.request({
		url: FR.baseURL+'/?module=weblinks&section=ajax&page=remove_multiple',
		method: 'post', params: params,
		callback: function(opts, succ, req) {
			//FR.UI.doneLoading();
			try {
				var rs = Ext.decode(req.responseText);
			} catch (er){return false;}
			FR.utils.reloadGrid();
			if (rs && rs.msg) {
				FR.UI.feedback(rs.msg);
			}
		}
	});
};
FR.actions.openVersions = function() {
	FR.UI.popup({
		title: FR.T('File Versions'),
		width: 420,	height: 300,
		src: FR.baseURL+'/?module=versioning',
		post: [
			{name: 'filename', value: FR.UI.gridPanel.getOneSel().data.filename},
			{name: 'path', value: FR.currentPath}
		],
		autoDestroy: true
	});
};
FR.actions.setLabel = function(label) {
	var params = {label: label, 'paths[]': []};

	var cm = FR.UI.contextMenu;
	var path = false;
	if (cm.location == 'tree') {
		var n = FR.UI.tree.panel.getNodeById(cm.target.id);
		params['paths[]'].push(n.getPath('pathname'));
	} else {
		Ext.each(cm.target, function(item) {
			params['paths[]'].push(item.path);
		});
	}
	Ext.Ajax.request({
		url: FR.baseURL+'/?module=labels&page=set',
		method: 'post', params: params,
		callback: function(opts, succ, req) {
			try {
				var rs = Ext.decode(req.responseText);
			} catch (er){return false;}
			if (rs.updates) {FR.utils.applyBatchFileUpdates(rs.updates);}
			if (rs.msg) {
				FR.UI.feedback(rs.msg);
			}
		}
	});
};
FR.actions.star = function(cm, action) {
	var params = {action: action, 'paths[]': []};
	if (cm.location == 'tree') {
		var n = FR.UI.tree.panel.getNodeById(cm.target.id);
		params['paths[]'].push(n.getPath('pathname'));
		FR.starringTreeNode = n;
	} else if (cm.location == 'grid') {
		Ext.each(cm.target, function (s) {
			params['paths[]'].push(s.path);
		});
		FR.starringTreeNode = false;
	}
	Ext.Ajax.request({
		url: FR.baseURL+'/?module=stars&page=set',
		method: 'post', params: params,
		callback: function(opts, succ, req) {
			try {
				var rs = Ext.decode(req.responseText);
			} catch (er){return false;}
			if (rs.msg) {FR.UI.feedback(rs.msg);}
			if (rs.updates) {FR.utils.applyBatchFileUpdates(rs.updates);}
			if (FR.currentSection == 'starred') {FR.utils.reloadGrid();}
		}
	});
};

FR.actions.customAction = function(opts, path, filename, e) {
	var url = FR.baseURL+'/?module=custom_actions&action='+opts.actionName;
	var postData;
	if (opts.popup || opts.newTab) {
		if (Ext.isArray(path)) {
			postData = [];
			Ext.each(path, function (p) {
				postData.push({name: 'paths[]', value: p});
			});
		} else {
			postData = [{name: 'path', value: path}];
		}
	}
	if (opts.newTab) {
		FR.UI.postToTarget({src: url, post: postData});
	}
	else if (opts.popup) {
		var popOpts = {
			title: FR.T(opts.title),
			loadingMsg: opts.loadingMsg || false,
			src: url, icon: opts.icon,
			post: postData,
			autoDestroy: true
		};
		if (filename) {popOpts.title += ': '+filename;}
		if (opts.width) {popOpts.width = opts.width;}
		if (opts.height) {popOpts.height = opts.height;}
		if (opts.external || (e && e.ctrlKey)) {
			FR.UI.openInPopup(popOpts);
		} else {
			FR.UI.popup(popOpts);
		}
	}
	else if (opts.ajax) {
		if (Ext.isArray(path)) {
			postData = '';
			Ext.each(path, function (p) {
				postData += '&paths[]=' + encodeURIComponent(p);
			});
		} else {
			postData = {'path': path};
		}
		FR.UI.showLoading(FR.T('Please wait...'));
		Ext.Ajax.request({
			url: url,
			method: 'post',
			params: postData,
			callback: function(opts, succ, req) {
				FR.UI.doneLoading();
				try {
					var rs = Ext.decode(req.responseText);
				} catch (er){return false;}
				if (rs.refresh) {FR.utils.reloadGrid((rs.highlight || false));}
				if (rs.msg) {FR.UI.feedback(rs.msg);}
			}
		});
	}
	else if (opts.handler) {opts.handler();}
	else if (opts.fn) {eval(opts.fn);}
};

FR.actions.customActionFromCM = function(cm, ca, e) {
	var path, filename;
	if (cm.location == 'tree') {
		var n = FR.UI.tree.panel.getNodeById(cm.target.id);
		path = n.getPath('pathname');
		filename = cm.target.text;
	} else {
		if (cm.target.length == 1) {
			var s = cm.target[0];
			path = s.path;
			filename = s.filename;
		} else {
			path = [];
			Ext.each(cm.target, function(d) {
				path.push(d.path);
			});
		}
	}
	this.customAction(ca.baseAction.settings, path, filename, e);
};
FR.actions.createNew = function(action, filename) {
	if (!filename) {
		filename = FR.T(action.createNew.defaultFileName);
	}
	new Ext.ux.prompt({text: FR.T('Please type a file name:'), defaultValue: filename, confirmHandler: function(val) {
		var url = FR.baseURL+'/?module=custom_actions&action='+action.actionName+'&method=createBlankFile';
		FR.UI.showLoading(FR.T('Creating blank file...'));
		var path;
		if (FR.utils.currentFolderAllowsUpload()) {
			path = FR.currentPath+'/'+val;
		} else {
			path = '/ROOT/HOME/'+val;
		}
		Ext.Ajax.request({
			url: url,
			method: 'post',
			params: {path: path},
			callback: function(opts, succ, req) {
				FR.UI.doneLoading();
				try {
					var rs = Ext.decode(req.responseText);
				} catch (er){return false;}
				if (rs.rs) {
					FR.actions.customAction(action, rs.path, rs.filename);
					FR.utils.reloadGrid();
				}
				FR.UI.feedback(rs.msg);
			}
		});
	}});
};

FR.actions.saveNotifications = function(path, settings) {
	var url = FR.baseURL+'/?module=folder_options&section=ajax&page=save_notifications';
	var pars = {
		path: path,
		notifyWrite: (settings[0]?1:0), notifyRead: (settings[1]?1:0)
	};
	//FR.UI.showLoading(FR.T('Saving notification settings...'));
	Ext.Ajax.request({
		url: url, method: 'post', params: pars,
		callback: function(opts, succ, req) {	
			//FR.UI.doneLoading();
			try {
				var rs = Ext.decode(req.responseText);
			} catch (er){return false;}
			FR.UI.feedback(rs.msg);
			if (rs.success) {
				if (rs.updates) {FR.utils.applyBatchFileUpdates(rs.updates);}
			}
		}
	});
	return true;
};


FR.actions.handlePaste = function(e) {
	if (!FR.utils.currentFolderAllowsUpload()) {return false;}
	var cd = e.browserEvent.clipboardData;
	if (cd.files && cd.files.length) {
		FR.UI.uploadWindow(FR.T('Uploading...'),
			new FR.components.uploadPanel({targetPath: FR.currentPath, dropEvent: e.browserEvent})
		);
	}
	if (cd.items && cd.items.length) {
		for (var i = 0; i < cd.items.length; i++) {
			var item = cd.items[i];
			if (item.type.indexOf("image") != -1) {
				FR.pasteBlob = item.getAsFile();

				var reader = new FileReader();
				reader.onload = function (event) {
					var imageObj = new Image();
					imageObj.src = event.target.result;
					imageObj.width = '500';
					imageObj.onload = function () {
						var w = new Ext.Window({
							title: FR.T('Uploading pasted image...'),
							contentEl: this
						});
						w.show();

						var fileName = FR.T('Pasted image') + ' ' + Ext.util.Format.date(new Date(), 'Y-m-d H-i-s') + '.png';
						FR.pasteBlob.fileName = fileName;

						var upload = new Flow({
							target: '?module=fileman_myfiles&section=ajax&page=up',
							validateChunkResponse: function (status, message) {
								if (status != '200') {
									return 'retry';
								}
								try {
									var rs = Ext.decode(message);
								} catch (er) {
									return 'retry';
								}
								if (rs) {
									if (rs.success) {
										return 'success';
									} else {
										return 'error';
									}
								}
							}, validateChunkResponseScope: this, startOnSubmit: true,
							query: {path: FR.currentPath}
						});
						upload.on('fileSuccess', function () {
							w.close();
							FR.UI.feedback('Pasted image successfully uploaded');
							FR.actions.WebLink(FR.currentPath + '/' + fileName, fileName);
							FR.utils.reloadGrid(fileName);
							FR.pasteBlob = false;
						});
						upload.on('progress', function (flow) {
							var percent = Math.floor(flow.getProgress() * 100);
							w.setTitle(FR.T('Uploading pasted image...') + ' ' + percent + '%');
						});
						upload.addFile(FR.pasteBlob);
					}
				};
				reader.readAsDataURL(FR.pasteBlob);
				break;
			}
		}
	}
};

FR.actions.filterMeta = function(fieldId, value, mode) {
	var f = FR.UI.actions.searchField;
	f.setRawValue(value);
	f.searchPath = '/ROOT/HOME';
	f.searchParams = {
		'searchType': 'meta',
		'metafield': fieldId
	};
	if (mode) {f.searchParams.searchMode = mode;}
	f.doSearch();
};