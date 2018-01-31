var FR = {chooser: false, UI: {tree: {}}};

Ext.onReady(function() {
	FR.update = FR.getInfo;
	
	FR.popupBody = window.parent.Ext.get(window.parent.FR.UI.popups.folderShare.getLayout().container.body.dom);
	FR.popupBody.unmask();

	FR.UI.tree.panel = new Ext.tree.TreePanel({
		id: 'usersList',
		border: false, hideBorders: true, animate: true, containerScroll: true,
		rootVisible:false, autoScroll: true, lines: false, useArrows: true
	});
	FR.UI.tree.panel.getSelectionModel().on('selectionchange', function(sel, node){
		if (sel.getSelectedNode()) {
			Ext.getCmp('removeBtn').show();
			unmaskOptions();
		} else {
			Ext.getCmp('removeBtn').hide();
			maskOptions();
		}
		if (node) {
			FR.currentlySelectedNode = node;
			Ext.getCmp('optPane').setTitle(node.attributes.name);
			Ext.getCmp('perms_upload').setValue(node.attributes.perms.upload);
			Ext.getCmp('perms_download').setValue(node.attributes.perms.download);
			Ext.getCmp('perms_comment').setValue(node.attributes.perms.comment);
			Ext.getCmp('perms_share').setValue(node.attributes.perms.share);
			Ext.getCmp('perms_read_comments').setValue(node.attributes.perms.read_comments);
			Ext.getCmp('perms_alter').setValue(node.attributes.perms.alter);
			Ext.getCmp('anonymous').setValue(node.attributes.anonymous);
			Ext.getCmp('alias').setValue(node.attributes.alias);
		}
	});
	FR.UI.tree.rootNode = new Ext.tree.TreeNode({});
	FR.UI.tree.panel.setRootNode(FR.UI.tree.rootNode);

	FR.addUsers = function() {
		if (!FR.chooser) {FR.chooser = new UserChooser();}
		FR.chooser.show(Ext.getCmp('addUsersBtn').getEl(), function(data) {
			var treeRoot = FR.UI.tree.rootNode;
			if (data.users) {
				Ext.each(data.users, function(user) {
					if (!treeRoot.findChild('uid', user.uid)) {
						addToList({
							name: user.name, text: user.name, leaf: true,
							cls:'user', icon:'a/?uid='+user.uid, uid: user.uid, anonymous: 0,
							perms: {upload: 0, download: 1, comment: 1, read_comments: 1, share: 0, alter: 0},
							alias: window.parent.FR.sharing.name
						})
					}
				});
			}
			if (data.groups) {
				Ext.each(data.groups, function(group) {
					if (!treeRoot.findChild('gid', group.gid)) {
						addToList({
							name: group.name, text: group.name, leaf: true, cls:'group',
							iconCls:'group', gid: group.gid, anonymous: 0,
							perms: {upload: 0, download: 1, comment: 1, read_comments: 1, share: 0, alter: 0},
							alias: window.parent.FR.sharing.name
						});
					}
				});
			}
		});
	};

	FR.viewPort = new Ext.Viewport({
		layout: 'border',
		items: [
			{
				region: 'center',
				layout: 'border',
				items: [

					{
						region: 'west', split: true, title: FR.T('Share with'),
						width: 240, layout: 'fit', items: FR.UI.tree.panel,
						tbar: [
							{
								id: 'addUsersBtn',
								text: FR.T('Add Users'), cls:'fr-btn-smaller', iconCls: 'fa fa-fw fa-user-plus',
								handler: FR.addUsers
							},
							'->',
							{
								id: 'removeBtn', text: FR.T('Remove Selected'), cls:'fr-btn-smaller', iconCls: 'fa fa-fw fa-remove colorRed', hidden: true,
								handler: function() {
									FR.UI.tree.rootNode.removeChild(FR.UI.tree.panel.getSelectionModel().getSelectedNode());
									if (FR.UI.tree.rootNode.firstChild) {FR.UI.tree.rootNode.firstChild.select();}
								}
							}
						]
					},
					{
						id: 'optPane',
						region: 'center',
						title: '&nbsp;',
						items: [
							{
								xtype: 'tabpanel',
								activeTab: 0,
								items: [
									{
										title: FR.T('Permissions'),
										items: {
											xtype: 'form',
											labelAlign: 'right', autoWidth: true,
											bodyStyle: 'padding:5px;font-size:12px;', labelWidth: 0,
											items: [
												{
													id: 'perms_upload', xtype:'checkbox', inputType: 'checkbox',
													boxLabel: FR.T('Upload'), hideLabel: true, name: 'perms_upload', value: 1,
													listeners: {
														'check': function(inpt, checked) {
															FR.currentlySelectedNode.attributes.perms.upload = checked;
														}
													}
												},
												{
													id: 'perms_download', xtype:'checkbox', inputType: 'checkbox',
													boxLabel: FR.T('Download/Copy/Preview'), hideLabel: true, name: 'perms_download', value: 1,
													listeners: {
														'check': function(inpt, checked) {
															FR.currentlySelectedNode.attributes.perms.download = checked;
														}
													}
												},
												{
													id: 'perms_read_comments', xtype:'checkbox', inputType: 'checkbox',
													boxLabel: FR.T('Read comments'), hideLabel: true, name: 'perms_read_comments', value: 1,
													listeners: {
														'check': function(inpt, checked) {
															FR.currentlySelectedNode.attributes.perms.read_comments = checked;
														}
													}
												},
												{
													id: 'perms_comment', xtype:'checkbox', inputType: 'checkbox',
													boxLabel: FR.T('Add comments'), hideLabel: true, name: 'perms_comment', value: 1,
													listeners: {
														'check': function(inpt, checked) {
															FR.currentlySelectedNode.attributes.perms.comment = checked;
														}
													}
												},
												{
													id: 'perms_share', xtype:'checkbox', inputType: 'checkbox',
													boxLabel: FR.T('Share'), hideLabel: true, name: 'perms_share', value: 1,
													listeners: {
														'check': function(inpt, checked) {
															FR.currentlySelectedNode.attributes.perms.share = checked;
														}
													}
												},
												{
													id: 'perms_alter', xtype:'checkbox', inputType: 'checkbox', hidden: (window.parent.FR.sharing.type == 'file'),
													boxLabel: FR.T('Move/Rename/Delete'), hideLabel: true, name: 'perms_alter', value: 1,
													listeners: {
														'check': function(inpt, checked) {
															FR.currentlySelectedNode.attributes.perms.alter = checked;
														}
													}
												}
											]
										}
									},
									{
										title: FR.T('Options'), disabled: (window.parent.FR.sharing.type == 'file'),
										items: {
											xtype: 'form',
											autoWidth: true,
											bodyStyle: 'padding:5px;padding-top:8px;font-size:12px;',
											labelWidth: (window.parent.FR.language == 'french') ? 95 : 80,
											items: [
												{
													xtype: 'textfield', id:'alias', anchor: '100%', enableKeyEvents: true,
													fieldLabel: FR.T('Share as'),
													listeners: {
														'keyup': function(inpt) {
															FR.currentlySelectedNode.attributes.alias = inpt.getValue();
														}
													}
												},
												{
													id: 'anonymous', xtype:'checkbox', inputType: 'checkbox',
													boxLabel: FR.T('Share anonymously'), hideLabel: true, name: 'anonymous', value: 1,
													listeners: {
														'check': function(inpt, checked) {
															FR.currentlySelectedNode.attributes.anonymous = checked;
														}
													}
												}
											]
										}
									}
								]
							}
						]
					}
				], buttonAlign: 'left',
				buttons: [{
					text: FR.T("Save"), cls: 'fr-btn-default fr-btn-primary',
					handler: function() {FR.saveInfo();}
				}, {
					text: FR.T("Cancel"), style: 'margin-left:10px',
					handler: function() {window.parent.FR.UI.popups.folderShare.hide();}
				}]
			}
		]
	});

	FR.applyInfo(FR.shareInfo);
	if (FR.shareInfo.length < 1) {maskOptions();}
});

function maskOptions() {
	Ext.getCmp('optPane').getEl().mask();
}
function unmaskOptions() {
	Ext.getCmp('optPane').getEl().unmask();
}
function addToList(data) {
	if (data.alias == '' || !data.alias) {
		data.alias = window.parent.FR.sharing.name;
	}
	var newTreeNode = new Ext.tree.TreeNode(data);
	FR.UI.tree.rootNode.appendChild(newTreeNode);
	if (!FR.UI.tree.panel.getSelectionModel().getSelectedNode()) {
		newTreeNode.select();
	}
}
FR.getInfo = function() {
	FR.popupBody.mask(FR.T('Loading data...'));
	Ext.Ajax.request({
		url: URLRoot+'/?module=fileman_myfiles_share&section=ajax&page=load',
		method: 'post',
		params: 'path='+encodeURIComponent(window.parent.FR.sharing.path),
		success: function(req){
			FR.popupBody.unmask();
			try {
				var rs = Ext.util.JSON.decode(req.responseText);
			} catch (er){return false;}
			if (rs) {
				FR.applyInfo(rs);
			}
		}
	});
};
FR.applyInfo = function(shareInfo) {
	var troot = FR.UI.tree.rootNode;
	while (troot.firstChild) {troot.removeChild(troot.firstChild);}
	Ext.each(shareInfo, function(record) {
		var r = {
			name: record.name, text: record.name, leaf: true,
			anonymous: record.anonymous,
			perms: record.perms,
			alias: record.alias
		};
		if (record.uid) {
			r.icon = 'a/?uid='+record.uid;
			r.uid = record.uid;
		} else {
			r.iconCls = 'group';
			r.cls = 'group';
			r.gid = record.gid;
		}
		addToList(r);
	});
	if (troot.childNodes.length > 0) {
		troot.firstChild.select();
	} else {
		FR.addUsers();
	}
};
FR.saveInfo = function() {
	var pars = 'path='+encodeURIComponent(window.parent.FR.sharing.path);
	pars += '&csrf='+encodeURIComponent(FR.csrf_token);
	FR.UI.tree.rootNode.eachChild(function(node) {
		if (!node.disabled) {
			var alias = node.attributes.alias;
			if (alias == window.parent.FR.sharing.name) {
				alias = '';
			}
			pars += '&actors[]='+(node.attributes.uid?node.attributes.uid:'false')+'-'+(node.attributes.gid?node.attributes.gid:'false')+'-'+(node.attributes.perms.upload?1:0)+'-'+(node.attributes.perms.download?1:0)+'-'+(node.attributes.perms.alter?1:0)+'-'+(node.attributes.perms.comment?1:0)+'-'+(node.attributes.perms.read_comments?1:0)+'-'+(node.attributes.anonymous?1:0)+'-'+(node.attributes.perms.share?1:0)+'-'+alias;
		}
	});
	FR.viewPort.el.mask(FR.T('Saving options...'));
	Ext.Ajax.request({
		url: URLRoot+'/?module=fileman_myfiles_share&section=ajax&page=save',
		method: 'post', params: pars,
		success: function(req){
			FR.viewPort.el.unmask();
			try {
				var rs = Ext.util.JSON.decode(req.responseText);
			} catch (er){return false;}
			if (rs.rs) {
				window.parent.FR.UI.popups.folderShare.hide();
				if (rs.update) {
					window.parent.FR.utils.applyFileUpdates(rs.update.path, rs.update.updates);
				}
			}
			window.parent.FR.UI.feedback(rs.msg);
		}
	});
};