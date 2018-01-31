FR.initTree = function () {
	var displayed = [];
	var opts = {
		usersOnline: {
			text: FR.T('Users online'), hidden: !FR.system.enableUsersOnline,
			icon: FR.iconURL+'online.png', leaf: true,
			appURL: FR.URLRoot+'/?module=cpanel&section=tools&page=users_online'
		},
		actLogs: {
			text: FR.T('Activity logs'),
			id: 'alogs', leaf: true,
			icon: FR.iconURL+'report.png',
			module: FR.modules.logs
		},
		uTools: {
			text: FR.T('Tools'), id: 'tools', expanded: true, cls: 'sysConfMenuItem',
			children: [
				{
					text: FR.T('Web Links'),
					icon: FR.iconURL+'link.png', leaf: true,
					id: 'wlinks',
					module: FR.modules.weblinks
				},
				{
					text: FR.T('Storage usage'), hidden: FR.system.isFree,
					icon: FR.iconURL+'chart_bar.png', leaf: true, id: 'spacequota',
					appURL: FR.URLRoot+'/?module=cpanel&section=tools&page=space_quota'
				},
				{
					text: FR.T('Import users'), hidden: (FR.system.isFree || !FR.user.isSuperuser),
					icon: FR.iconURL+'import.png', leaf: true, id: 'importusers',
					appURL: FR.URLRoot+'/?module=cpanel&section=tools&page=import_users'
				},
				{
					text: FR.T('Export users'), hidden: (FR.system.isFree || !FR.user.isSuperuser),
					icon: FR.iconURL+'export.png', leaf: true, id: 'exportusers',
					appURL: FR.URLRoot+'/?module=cpanel&section=tools&page=export_users'
				}
			]
		},
		users: {
			text: FR.T('Admin'), id: 'admin', cls: 'sysConfMenuItem', expanded: true,
			hidden: ((!FR.user.isAdmin && !FR.user.isIndep) || !FR.user.perms.adminUsers),
			children: [
				{
					text: FR.T('Users'), id: 'users', leaf: true,
					icon: FR.iconURL+'user.png',
					module: FR.modules.users
				},
				{
					text: FR.T('Roles'), id: 'roles',
					icon: FR.iconURL+'role.png', leaf: true,
					module: FR.modules.roles, hidden: (FR.system.isFree || !FR.user.perms.adminRoles)
				},
				{
					text: FR.T('Groups'), id: 'groups',
					icon: FR.iconURL+'group.png', leaf: true,
					module: FR.modules.groups, hidden: (FR.system.isFree || !FR.user.perms.adminUsers)
				}
			]
		},
		iface: {
			text: FR.T('Interface'), expanded: true,
			cls: 'adminSection',
			children: [
				{
					text: FR.T('Options'), leaf: true, id: 'interfaceoptions', cls: 'adminNoIcon',
					appURL: FR.URLRoot+'/?module=cpanel&section=settings&page=interface'
				}
			]
		},
		email: {
			text: FR.T('E-mail'), cls: 'adminSection',
			icon: FR.iconURL+'email.png',  expanded: true,
			children: [
				{
					text: FR.T('Settings'), leaf: true, hidden: !FR.user.isSuperuser,
					appURL: FR.URLRoot+'/?module=cpanel&section=settings&page=email',
					id: 'emailsettings', cls: 'adminNoIcon'
				},
				{
					text: FR.T('Notifications'), leaf: true, cls: 'adminNoIcon',
					module: FR.modules.notifications, id: 'emailnotifications'
				},
				{
					text: FR.T('Logs'), leaf: true, hidden: !FR.user.isSuperuser,
					module: FR.modules.notif_logs, id: 'emaillogs', cls: 'adminNoIcon'
				}
			]
		},
		files: {
			text: FR.T('Files'),  expanded: true, cls: 'adminSection',
			icon: FR.iconURL+'files.png',
			children: [
				{
					text: FR.T('Image preview'), leaf: true, hidden: !FR.user.isSuperuser,
					appURL: FR.URLRoot+'/?module=cpanel&section=settings&page=image_preview',
					id: 'filespreview', cls: 'adminNoIcon'
				},
				{
					text: FR.T('Plugins'), expanded: true, hidden: !FR.user.isSuperuser,
					module: FR.modules.openWith, id: 'filesplugins', cls: 'adminNoIcon',
					children: [
						{
							text: FR.T('Defaults'), leaf: true, id: 'filespluginsdefaults',
							module: FR.modules.defaultOpenWith, cls: 'adminNoIcon'
						}
					]
				},
				{
					text: FR.T('Indexing'), leaf: true, hidden: (!FR.user.isSuperuser || FR.system.isFree),
					appURL: FR.URLRoot+'/?module=cpanel&section=settings&page=file_search', id: 'indexing',
					cls: 'adminNoIcon'
				},
				{
					text: FR.T('Misc options'), leaf: true, hidden: !FR.user.isSuperuser,
					appURL: FR.URLRoot+'/?module=cpanel&section=settings&page=files', id: 'filesmisc',
					cls: 'adminNoIcon'
				},
				{
					text: FR.T('Metadata'), expanded: true, id: 'metadata', cls: 'adminNoIcon',
					children: [
						{
							text: FR.T('File types'), leaf: true, cls: 'adminNoIcon',
							module: FR.modules.metadata_filetypes
						},
						{
							text: FR.T('Field sets'), leaf: true, id: 'metadatafieldsets',
							module: FR.modules.metadata_fieldsets, cls: 'adminNoIcon'
						}
					]
				}
			]
		},
		sec: {
			text: FR.T('Security'),  expanded: true, cls: 'adminSection',
			icon: FR.iconURL+'lock.png',
			children: [
				{
					text: FR.system.isFree ? FR.T('User login') : FR.T('Login and registration'), leaf: true, cls: 'adminNoIcon',
					appURL: FR.URLRoot+'/?module=cpanel&section=settings&page=login_registration', id: 'loginsettings'
				},
				{
					text: FR.T('Password policy'), leaf: true, hidden: FR.system.isFree, cls: 'adminNoIcon',
					appURL: FR.URLRoot+'/?module=cpanel&section=settings&page=passwords', id: 'passpolicy'
				},
				{
					text: FR.T('API'), id: 'oauth', expanded: true, cls: 'adminNoIcon',
					appURL: FR.URLRoot+'/?module=cpanel&section=settings&page=oauth',
					children: [
						{
							text: FR.T('Clients'), leaf: true, id: 'oauthclients',
							module: FR.modules.oauth2_clients, cls: 'adminNoIcon'
						}
					]
				}
			]
		},
		more: {
			text: FR.T('More'), expanded: true, cls: 'adminSection',
			icon: FR.iconURL+'cog.png',
			children: [
				{
					text: FR.T('Misc options'), leaf: true, id: 'misc', cls: 'adminNoIcon',
					appURL: FR.URLRoot+'/?module=cpanel&section=settings&page=misc'
				},
				{
					text: FR.T('Third party services'), leaf: true, id: 'thirdparty', cls: 'adminNoIcon',
					appURL: FR.URLRoot+'/?module=cpanel&section=settings&page=third_party'
				},
				{
					text: FR.T('Software update'), leaf: true, id: 'update', cls: 'adminNoIcon',
					appURL: FR.URLRoot+'/?module=software_update&section=cpanel'
				},
				{
					text: FR.T('Software licensing'), leaf: true, id: 'license', cls: 'adminNoIcon',
					appURL: FR.URLRoot+'/?module=cpanel&section=settings&page=license'
				}
			]
		},
		sysConf: {
			text: FR.T('Configuration'), id: 'sysconf', leaf: true,
			cls: 'sysConfMenuItem'
		}
	};
	if (FR.user.isIndep || FR.user.perms.adminUsers) {
		displayed.push(opts.users);
		if (FR.user.perms.adminLogs) {
			opts.uTools.children.unshift(opts.actLogs);
			if (FR.system.enableUsersOnline) {
				opts.uTools.children.unshift(opts.usersOnline);
			}
		}
		displayed.push(opts.uTools);
	} else {
		if (FR.user.perms.adminLogs) {
			if (FR.system.enableUsersOnline) {
				displayed.push(opts.usersOnline);
			}
			displayed.push(opts.actLogs);
		}
	}
	if (FR.user.isSuperuser || FR.user.perms.adminNotif  || FR.user.perms.adminMetadata) {
		displayed.push(opts.sysConf);
	}
	if (FR.user.isSuperuser) {
		displayed.push(opts.iface);
	}
	if (FR.user.isSuperuser || FR.user.perms.adminNotif) {
		displayed.push(opts.email);
	}
	if (FR.user.isSuperuser || FR.user.perms.adminMetadata) {
		displayed.push(opts.files);
	}

	if (FR.user.isSuperuser) {
		displayed.push(opts.sec);
		displayed.push(opts.more);
	}


	this.tree = {
		init: function() {
			this.panel = new Ext.tree.TreePanel({
				autoScroll: true, containerScroll: true, rootVisible: false, trackMouseOver: false,
				bodyStyle: 'padding-bottom:20px',
				listeners: {
					'contextmenu': function (tree, e) {e.stopEvent();return false;},
					'beforecollapsenode': function() {return false;}
				},
				root: {
					expanded: true,
					id: 'root',
					children: displayed
				}
			});
			this.panel.getSelectionModel().on('selectionchange', function(selectionModel, treeNode) {
				FR.tsel = treeNode.attributes;
				if (FR.tsel.module) {
					if (FR.tsel.module.type == 'grid') {
						Ext.getCmp('cardDisplayArea').getLayout().setActiveItem(0);
						FR.grid.loadModule(FR.tsel.module);
					} else {
						if (FR.tsel.module.activeItem) {
							Ext.getCmp('cardDisplayArea').getLayout().setActiveItem(FR.tsel.module.activeItem);
						}
					}
				} else {
					if (FR.tsel.appURL) {
						Ext.getCmp('cardDisplayArea').getLayout().setActiveItem(1);
						Ext.getCmp('appTab').removeAll(true);
						FR.tempPanel.load({
							url: FR.tsel.appURL,
							nocache: true,
							scripts: true
						});
					}
				}
			});
			this.panel.getSelectionModel().on('beforeselect', function(selectionModel, treeNode) {
				var a = treeNode.attributes;
				if (a.id == 'metadata') {
					treeNode.firstChild.select();
					return false;
				}
				if (['sysConfMenuItem','adminSection'].indexOf(a.cls) != -1) {
					return false;
				}
			});
			this.panel.getRootNode().on('load', function () {
				window.setTimeout(function () {
					if (FR.user.perms.adminUsers) {
						var nodeId = decodeURI(document.location.hash.substring(1));
						if (!nodeId) {
							nodeId = 'users';
						}
						var node = FR.tree.panel.getNodeById(nodeId);
						if (node) {node.select();}
					}
				}, 200);
			});
		}
	};
	this.tree.init();
};