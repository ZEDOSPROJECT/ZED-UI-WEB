FR.initTree = function() {
	var t = new Ext.tree.TreePanel({
		id: 'FR-Tree-Panel', region: 'center',
		enableDD: !User.perms.read_only, ddGroup: 'TreeDD', dropConfig: {appendOnly:true}, bodyStyle: 'padding-top:1px;padding-bottom:30px;',
		animate: true, autoScroll: true, rootVisible: false, trackMouseOver: !FR.isMobile,
		listeners: {
			'afterrender': function () {
				if (User.perms.upload) {
					FlowUtils.DropZoneManager.add({
						domNode: FR.UI.tree.panel.el.dom, overClass: 'x-tree-drag-append',
						findTarget: function (e) {
							var el = Ext.get(e.target);
							if (el && !el.hasClass('x-tree-node-el')) {el = el.parent('div.x-tree-node-el');}
							if (!el) {return false;}
							var treeNodeId = el.getAttribute('tree-node-id', 'ext');
							if (!treeNodeId) {return false;}
							var treeNode = FR.UI.tree.panel.getNodeById(treeNodeId);
							if (!treeNode) {return false;}
							if (['myfiles', 'sharedFolder'].indexOf(treeNode.attributes.section) != -1) {
								if (!treeNode.attributes.perms || treeNode.attributes.perms.upload) {
									return {el: el.dom, node: treeNode};
								}
							}
						},
						onDrop: function (e, target) {
							var up = new FR.components.uploadPanel({
								targetPath: target.node.getPath('pathname'), dropEvent: e
							});
							FR.UI.uploadWindow(FR.T('Upload to "%1"').replace('%1', target.node.text), up);
						},
						scope: this
					});
				}

				if (User.perms.alter) {
					FR.UI.tree.panel.on('nodedragover', function (e) {
						if (
							['trash', 'starred', 'search', 'webLinked'].indexOf(FR.currentSection) != -1 ||
							(e.dropNode && e.dropNode.attributes.readonly) ||
							(e.target.attributes.perms && (!e.target.attributes.perms.alter && !e.target.attributes.perms.upload)) ||
							(FR.currentPath == e.target.getPath('pathname'))
						) {
							e.cancel = true;
							return false;
						}
					});

					FR.UI.tree.panel.on('beforenodedrop', function (drop) {
						FR.actions.move(drop, drop.target.getPath('pathname'));
						return false;
					});
				}
			}, scope: this
		}
	});
	t.getSelectionModel().on('beforeselect', function(selectionModel, treeNode) {
		if (!treeNode.attributes.pathname) {return false;}
	});

	var r = new Ext.tree.TreeNode({pathname: 'ROOT'}),
		loader, node,
		asyncNode = FR.components.AsyncTreeNode,
		tNode = FR.components.TreeNode;

	FR.UI.tree.searchResultsNode = r.appendChild(new tNode({
		text: FR.T('Search Results'), hidden: true, iconCls: 'fa-search icon-gray',
		pathname: 'SEARCH', section: 'search', leaf: true
	}));

	FR.UI.tree.homeFolderNode = r.appendChild(new asyncNode({
		text: FR.T('My Files'), pathname: 'HOME', section: 'myfiles',
		iconCls: 'fa-folder', homefolder: true,
		allowDrag: false, allowDrop: !User.perms.read_only,
		custom: FR.homeFolderCfg.customAttr,
		loader: new FR.components.TreeLoader({
			dataUrl: this.myfilesBaseURL+'&page=tree'
		})
	}));


	if (Settings.media_folders_photos) {
		node = r.appendChild(new tNode({
			text: FR.T('Photos'), pathname: 'Photos', section: 'media',
			iconCls: 'fa-picture-o', viewMode: 'thumbnails', virtual: true,
			sortInfo: 'server'
		}));
			loader = new FR.components.TreeLoader({
				dataUrl: FR.baseURL+'/?module=photos&page=tree'
			});
			node.appendChild(new tNode({
				text: FR.T('Last taken'), leaf: true, perms: {alter:true, download: true, share: true},
				pathname: 'Latest', viewMode: 'photos', sortInfo: 'server'
			}));
			node.appendChild(new asyncNode({
				text: FR.T('By date'), pathname: 'Date',
				allowDrag: false, allowDrop: false,
				viewMode: 'thumbnails', sortInfo: {field: 'modified', direction: 'DESC', forced: true},
				loader: loader, autoExpand: false, virtual: true
			}));
			node.appendChild(new asyncNode({
				text: FR.T('By tag'), pathname: 'Tags',
				leaf: false, allowDrag: false, allowDrop: false, readonly: true,
				viewMode: 'thumbnails', sortInfo: {field: 'nice_filesize', direction: 'DESC', forced: true},
				loader: loader, autoExpand: false, virtual: true
			}));
	}
	if (Settings.media_folders_music) {
		node = r.appendChild(new tNode({
			text: FR.T('Music'), iconCls: 'fa-music', hidden: Settings.hideMusic,
			pathname: 'Music', viewMode: 'thumbnails', virtual: true, section: 'media',
			sortInfo: 'server'
		}));
			node.appendChild(new tNode({
				text: FR.T('Last added'), leaf: true, pathname: 'Latest',
				viewMode: 'music', sortInfo: 'server', perms: {alter:true, download: true, share: true}
			}));
			loader = new FR.components.TreeLoader({
				dataUrl: FR.baseURL+'/?module=music&page=tree'
			});
			node.appendChild(new asyncNode({
				text: FR.T('By artist'), pathname: 'Artists', viewMode: 'thumbnails',
				leaf: false, allowDrag: false, allowDrop: false, readonly: true,
				loader: loader, autoExpand: false, virtual: true,
				sortInfo: 'server'
			}));
			node.appendChild(new asyncNode({
				text: FR.T('By album'), pathname: 'Albums', viewMode: 'thumbnails',
				leaf: false, allowDrag: false, allowDrop: false, readonly: true,
				loader: loader, autoExpand: false, virtual: true
			}));
			node.appendChild(new tNode({
				text: FR.T('Random'), leaf: true, pathname: 'Random',
				viewMode: 'music', sortInfo: 'server', perms: {alter:true, download: true, share: true}
			}));
	}

	loader = new FR.components.TreeLoader({
		dataUrl:FR.myfilesBaseURL+'&page=tree_shares'
	});
	Ext.each(AnonShares, function(fld) {
		r.appendChild(new asyncNode(Ext.apply(fld, {
			readonly: true, allowDrag: false, allowDrop: fld.perms.upload,
			loader: loader, section: 'sharedFolder'
		})));
	});
	Ext.each(Sharing, function(usr) {
		r.appendChild(new asyncNode({
			text: usr.name, pathname: usr.id, section: 'userWithShares',
			uid: usr.id, iconCls: 'avatar',
			allowDrag: false, allowDrop: false,
			loader: loader
		}));
	});
	r.appendChild(new tNode({
		text: FR.T('Starred'), hidden: User.perms.read_only,
		iconCls: 'fa-star', pathname: 'STARRED', section: 'starred'
	}));

	r.appendChild(new tNode({
		text: FR.T('Shared links'), hidden: !User.perms.weblink,
		iconCls: 'fa-link', pathname: 'WLINKED', section: 'webLinked'
	}));

	FR.UI.tree.trashNode = r.appendChild(new tNode({
		text: FR.T('Trash'), iconCls: 'fa-trash', hidden: (!User.trashCount || User.perms.read_only),
		pathname: 'TRASH', section: 'trash', viewMode: 'list'
	}));

	FR.UI.tree.getCurrentPath = function() {
		return this.currentSelectedNode.getPath('pathname');
	};

	FR.UI.tree.onSelectionChange = function(sm, node) {
		this.currentSelectedNode = node;
		if (!node) {return false;}
		FR.currentFolderPerms = Ext.value(node.attributes.perms, false);

		FR.previousSection = Ext.value(FR.currentSection);
		FR.currentSection = node.attributes.section;
		FR.currentSectionIsVirtual = Ext.isDefined(node.attributes.virtual);

		var gridPanel = FR.UI.gridPanel;
		gridPanel.onTreeSelectionChange(node);

		if (!Ext.isDefined(node.attributes.autoExpand) || node.attributes.autoExpand) {
			node.expand();
		}
		if (['myfiles', 'sharedFolder'].indexOf(FR.currentSection) != -1) {
			FR.UI.actions.searchField.setSearchFolder(FR.currentPath, node.text);
			if (gridPanel.dropZone) {gridPanel.dropZone.unlock();}
		} else {
			if (gridPanel.dropZone) {gridPanel.dropZone.lock();}
			FR.UI.actions.searchField.setSearchFolder('/ROOT/HOME', FR.T('My Files'));
		}
		if (FR.currentSection == 'search') {
			this.searchResultsNode.getUI().show();
			this.searchResultsNode.ensureVisible();
		}
	};
	t.getSelectionModel().on('selectionchange', FR.UI.tree.onSelectionChange, FR.UI.tree);
	t.on('contextmenu', FR.UI.tree.showContextMenu);

	t.setRootNode(r);

	FR.UI.tree.panel = t;
};

FR.UI.tree.reloadNode = function(node, callback) {
	node.loaded = false;
	node.collapse();
	node.expand(false, true, callback);
};

FR.UI.tree.updateIcon = function(treeNode) {
	treeNode.getUI().updateIcons();
};

FR.UI.tree.showContextMenu = function(node, e) {
	FR.UI.contextMenu.event({
		location: 'tree',
		target: node.attributes
	});
	if (e) {e.stopEvent();}
	return false;
};


FR.components.TreeNode = Ext.extend(Ext.tree.TreeNode, {
	readonly: true, defaultUI: FR.components.TreeNodeCustomUI,
	leaf: false, allowDrag: false, allowDrop: false,
	constructor: function(config) {
		Ext.apply(config, {
			listeners: {
				'append': function(t, thisNode, childNode) {
					if (thisNode.attributes.section && !childNode.attributes.section) {
						childNode.attributes.section = thisNode.attributes.section;
					}
				}
			}
		});
		FR.components.TreeNode.superclass.constructor.call(this, config)
	}
});
Ext.tree.TreePanel.nodeTypes['filerun'] = FR.components.AsyncTreeNode;

FR.components.AsyncTreeNode = Ext.extend(Ext.tree.AsyncTreeNode, {
	defaultUI: FR.components.TreeNodeCustomUI
});
Ext.tree.TreePanel.nodeTypes['filerunAsync'] = FR.components.AsyncTreeNode;
FR.components.TreeLoader = Ext.extend(Ext.tree.TreeLoader, {
	baseAttrs: {uiProvider: FR.components.TreeNodeCustomUI, nodeType: 'filerunAsync'},
	nodeParameter: null,
	listeners: {
		'beforeload': function(loader, node) {
			loader.baseAttrs.section = node.attributes.section;
			loader.baseParams.path = node.getPath('pathname');
		}
	},
	createNode: function(attr) {
		attr.pathname = Ext.value(attr.pathname, attr.text);
		return FR.components.TreeLoader.superclass.createNode.call(this, attr);
	}
});