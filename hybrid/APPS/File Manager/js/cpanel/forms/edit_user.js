FR.editUser = {};
FR.editUser.formPanel = new FR.components.editForm({
	title: FR.T('Edit User')+' "'+FR.userInfo.name+'"',
	items: {
		xtype: 'tabpanel',
		activeTab: 0, border: false, deferredRender: false,
		defaults: {autoScroll: true, bodyStyle:'padding:10px', listeners: {'render': function() {this.doLayout(false, true);}}},
		listeners: {'render': function() {
			if (!FR.user.isSuperuser) {this.hideTabStripItem(3);}
			if (FR.system.isFree) {
				this.hideTabStripItem(2);
				this.hideTabStripItem(3);
			}
		}},
		items: [
			{
				title: FR.T('Basic Information'),
				items: [
					{
						xtype: 'fieldset',
						title: FR.T('Login Info'),
						width: 500,
						defaults: {width: 200},
						items: [
							{
								xtype: 'hidden',
								name: 'id',
								value: FR.userInfo.id
							},
							{xtype: 'displayfield', itemCls:'x-hidden', html: '<input type="text" name="username_fake"/> <input type="password" name="password_fake"/>'},
							{
								xtype : 'compositefield',
								fieldLabel: FR.T('Name'),
								items : [
									{
										flex : 1,
										xtype: 'textfield',
										name: 'name',
										value: FR.userInfo.name
									},
									{
										flex : 1,
										xtype: 'textfield',
										name: 'name2',
										value: FR.userInfo.name2
									}
								]
							},
							{
								xtype: 'textfield',
								fieldLabel: FR.T('Username'),
								name: 'unm',
								value: FR.userInfo.username,
								listeners: {
									change: function() {
										Ext.getCmp('notifyPassChange').show();
									}
								}
							},
							{
								xtype : 'compositefield',
								fieldLabel: FR.T('Password'),
								items : [
									{
										xtype: 'textfield',
										name: 'pwd',
										width: 165, value: '********',
										listeners: {
											change: function() {
												Ext.getCmp('notifyPassChange').show();
											}
										}
									},
									{
										xtype: 'button',
										iconCls: 'fa fa-fw fa-key',
										handler: function() {
											var i = this.ownerCt.items.first();
											i.setValue(randomPass(12, true, true, true, true, 2));
											i.el.dom.select();
											Ext.getCmp('notifyPassChange').show();
										},
										tooltip: FR.T('Generate random password')
									}
								]
							},
							{
								xtype: 'checkbox', hidden: true, id: 'notifyPassChange',
								boxLabel: FR.T('Send a notification now'),
								width: 400, inputValue: 1, checked: 1,
								name: 'notify',
								helpText: FR.T('An e-mail message with the login information will be sent to the user\'s address.')
							},
							{
								xtype: 'checkbox',
								boxLabel: FR.T('Require user to change the password'),
								width: 400, value: 1,
								name: 'require_password_change', checked: parseInt(FR.userInfo.require_password_change)
							},
							{
								xtype: 'checkbox',
								boxLabel: FR.T('Enable 2-step verification'),
								width: 400, value: 1, hidden: FR.system.isFree,
								name: 'two_step_enabled', checked: parseInt(FR.userInfo.two_step_enabled),
								helpText: FR.T('In order for the user to login, he will need to type in also a temporary code which can be generated on a mobile device with a dedicated app such as Google Authenticator.')
							}
						]
					},
					{
						xtype: 'fieldset',
						width: 500, hidden: (FR.userInfo.id == 1),
						defaults: {width: 200},
						items: [
							{xtype: 'displayfield', hidden: !Ext.isIE},
							{
								xtype: 'checkbox',
								boxLabel: FR.T('The account is deactivated'),
								width: 400, value: 1,
								name: 'deactivate', checked: !parseInt(FR.userInfo.activated)
							},
							{
								xtype: 'datefield',
								fieldLabel: FR.T('Expiration date'),
								minValue: new Date(), hidden: (FR.userInfo.id == 1 || FR.system.isFree),
								helpText: FR.T('The user account will be automatically deactivated at the specified date.'),
								name: 'expiration_date', value: FR.userInfo.expiration_date
							}
						]
					},
					{
						xtype: 'fieldset',
						title: FR.T('E-mail Options'),
						width: 500,
						defaults: {width: 200},
						items: [
							{
								xtype: 'textfield',
								fieldLabel: FR.T('E-mail address'),
								name: 'email',
								value: FR.userInfo.email
							},
							{
								xtype: 'checkbox',
								boxLabel: FR.T('Notifications'),
								helpText: FR.T('If checked, this option gets the user notified when:<br>- somebody downloads files from the user\'s folders<br>- somebody uploads, moves, copies files into one of the user\'s folders'), inputValue: 1,
								name: 'receive_notifications', checked: parseInt(FR.userInfo.receive_notifications)
							}
						]
					},
					{
						xtype: 'fieldset',
						title: FR.T('Details'),
						width: 500, hidden: FR.system.isFree,
						defaults: {width: 200},
						items: [
							{
								xtype: 'textfield',
								fieldLabel: FR.T('Phone'),
								name: 'phone',
								value: FR.userInfo.phone
							},
							{
								xtype: 'textfield',
								fieldLabel: FR.T('Company'),
								name: 'company',
								value: FR.userInfo.company
							},
							{
								xtype: 'textfield',
								fieldLabel: FR.T('Website'),
								name: 'website',
								value: FR.userInfo.website
							},
							{
								xtype: 'textfield',
								fieldLabel: FR.T('Logo URL'),
								name: 'logo_url',
								value: FR.userInfo.logo_url
							},
							{
								xtype: 'textarea',
								fieldLabel: FR.T('Note'),
								name: 'description',
								value: FR.userInfo.description
							}
						]
					}
				]
			},
			{
				title: FR.T('Permissions'),
				defaults: {
					xtype: 'fieldset',
					width: 500
				},
				items: [
					{
						ref: 'roleFieldset',
						hidden: (FR.userInfo.id == 1 || FR.system.isFree),
						items: [
							{
								xtype: 'combo',
								helpText: FR.T('The role defines the user\'s permission settings. The individual permission settings of the user cannot be changed if a role is selected.'),
								fieldLabel: FR.T('Role'),
								name: 'perms[role]', hiddenName: 'perms[role]', ref: '../role',
								autoCreate: true, mode: 'local', editable: false,
								emptyText: FR.T('Select...'),
								displayField: 'name', valueField: 'id', 
								triggerAction:'all', disableKeyFilter: true,
								value: (FR.userInfo.perms.role ? FR.userInfo.perms.role : '-'), 
								store: new Ext.data.SimpleStore({fields: ['id', 'name'], data: FR.roles}),
								listeners: {
									'beforeselect': function(f, record) {
										f.ownerCt.ownerCt.items.each(function(fieldset) {
											if (fieldset.ref != 'roleFieldset') {
												fieldset.setVisible((record.data.id == '-'));
											}
										});
										f.ownerCt.ownerCt.ownerCt.adminTab.setDisabled((record.data.id != '-'));
									}
								}
							}
						]
					},
					{
						hidden: (FR.currentUserPerms.admin_homefolder_template || FR.userInfo.perms.role != '-'),
						items: [
							{
								xtype: 'textfield',
								ref: 'homefolder',
								fieldLabel: FR.T('Home folder'),
								name: 'perms[homefolder]', width: 300,
								helpText:
									FR.user.isIndep ?
										FR.T('This folder will be automatically created in your home folder, if it doesn\'t exists already.') :
										FR.T('Type the path to a folder on your server. This is the user\'s personal working space.<br><br>Examples: 	c:/users/group_name<br>/home/users/group_name')+'<br>'+
										FR.T('Your personal home folder is:')+' <b>'+FR.adminHomeFolderPath+'</b><br>',
								value: FR.userInfo.perms.homefolder,
								listeners: {
									'focus': function() {
										this.ownerCt.editPathRemark.show();
									},
									'blur': function() {
										this.ownerCt.editPathRemark.setVisible(this.isDirty());
									}
								}
							},
							{
								xtype: 'panel', border: false, layout: 'hbox', hidden: FR.user.isIndep,
								layoutConfig: {padding: 10}, bodyStyle: 'padding-left:93px',
								defaults:{margins:'0 5 0 0'},
								items: [
									{xtype: 'button', text: FR.T('Check path'), cls:'fr-btn-smaller', handler: function() {
										var par = 'path='+encodeURIComponent(this.ownerCt.ownerCt.homefolder.getValue());
										var output = this.ownerCt.ownerCt.serverReply; output.show();
										FR.utils.getAjaxOutput(FR.URLRoot+'/?module=users&section=cpanel&page=check_path', par, output);
									}},
									{xtype: 'button', text: FR.T('Create folder now'), cls:'fr-btn-primary fr-btn-smaller', handler: function() {
										var par = 'path='+encodeURIComponent(this.ownerCt.ownerCt.homefolder.getValue());
										var output = this.ownerCt.ownerCt.serverReply; output.show();
										FR.utils.getAjaxOutput(FR.URLRoot+'/?module=users&section=cpanel&page=create_path', par, output);
									}}
								]
							},
							{xtype: 'displayfield', ref: 'editPathRemark', value: FR.T('Important: Changing this path will remove the users folder sharing settings and weblinks.'), style:'padding:3px;color:red', hidden: true},
							{xtype: 'displayfield', ref: 'serverReply', value: 'test', style:'border:1px solid silver;padding:3px;', hidden: true}
						]
					},
					{
						title: FR.T('Permissions'), labelWidth: 10,
						hidden: (FR.userInfo.perms.role != '-'),
						defaults: {xtype: 'checkbox'},
						items: [
							{
								boxLabel: FR.T('User can upload files'), value: 1,
								name: 'perms[upload]', checked: parseInt(FR.userInfo.perms.upload)
							},
							{
								boxLabel: FR.T('User can download files'), value: 1,
								name: 'perms[download]', checked: parseInt(FR.userInfo.perms.download)
							},
							{
								boxLabel: FR.T('User can zip and download folders'), value: 1,
								name: 'perms[download_folders]', checked: parseInt(FR.userInfo.perms.download_folders)
							},
							{xtype: 'displayfield', value: ''},
							{
								boxLabel: FR.T('User can read comments'), value: 1,
								name: 'perms[read_comments]', checked: parseInt(FR.userInfo.perms.read_comments)
							},
							{
								boxLabel: FR.T('User can write comments'), value: 1,
								name: 'perms[write_comments]', checked: parseInt(FR.userInfo.perms.write_comments)
							},
							{xtype: 'displayfield', value: ''},
							{
								boxLabel: FR.T('User can share via web links'),
								name: 'perms[weblink]', checked: parseInt(FR.userInfo.perms.weblink)
							},
							{
								boxLabel: FR.T('User can share with other users'), value: 1, hidden: FR.system.isFree,
								name: 'perms[share]', checked: parseInt(FR.userInfo.perms.share)
							},
							{
								boxLabel: FR.T('User can share via e-mail'), value: 1,
								name: 'perms[email]', checked: parseInt(FR.userInfo.perms.email)
							},
							{xtype: 'displayfield', value: ''},
							{
								boxLabel: FR.T('User can access metadata'), value: 1,
								name: 'perms[metadata]', checked: parseInt(FR.userInfo.perms.metadata)
							},
							{
								boxLabel: FR.T('User can access the files\' activity logs'), value: 1,
								hidden: (FR.settings.disable_file_history || FR.system.isFree),
								name: 'perms[file_history]', checked: parseInt(FR.userInfo.perms.file_history)
							},
							{xtype: 'displayfield', value: ''},
							{
								boxLabel: FR.T('User cannot move, rename delete, etc..'), value: 1,
								name: 'perms[readonly]', checked: parseInt(FR.userInfo.perms.readonly)
							},
							{xtype: 'displayfield', value: ''},
							{
								boxLabel: FR.T('User can change the password'), value: 1,
								name: 'perms[change_pass]', checked: parseInt(FR.userInfo.perms.change_pass)
							},
							{
								boxLabel: FR.T('User can change personal information'), value: 1,
								name: 'perms[edit_profile]', checked: parseInt(FR.userInfo.perms.edit_profile)
							}
						]
					},
					{
						labelWidth: 150, hidden: (FR.system.isFree || FR.userInfo.perms.role != '-'),
						items: [
							{
								xtype: 'userslistfield', allowAll: true, allItemsText: FR.T('[All users]'),
								helpText:  (!FR.system.isFree ? FR.T('Use this setting to allow the user to access folders shared by other users.'):false),
								fieldLabel: FR.T('Can interact with'), showSelf: true,
								tcfg: {height: 150, width: 250},
								name: 'users_may_see', value: FR.userInfo.perms.users_may_see
							}
						]
					},
					{
						labelWidth: 150, hidden: (FR.system.isFree || FR.userInfo.perms.role != '-'),
						defaultType: 'textfield', defaults: {width: 60},
						items: [
							{
								fieldLabel: FR.T('Space quota'),
								name: 'perms[space_quota_max]',
								helpText: FR.T('The values are in megabytes. The value of 0 disables the limitation.'),
								value: FR.userInfo.perms.space_quota_max
							},
							{
								fieldLabel: FR.T('Upload max file size'),
								name: 'perms[upload_max_size]',
								value: FR.userInfo.perms.upload_max_size
							}
						]
					}
				]
			},
			{
				title: FR.T('Groups'),
				ref: 'groupsTab',
				items: [
					{xtype: 'panel',layout: 'form', border: false, items: [{
						xtype: 'userslistfield', name: 'groups', only: 'groups', value: FR.userInfo.groups,
						fieldLabel: FR.T('User group(s)'), tcfg: {height: 150, width: 250}
					}]}
				]
			},
			{
				title: FR.T('Admin'),
				ref: 'adminTab',
				disabled: ((FR.userInfo.id == 1) || (FR.userInfo.perms.role != '-')),
				items: [
					{
						xtype: 'fieldset',
						width: 500,
						items: [
							{xtype: 'displayfield', hidden: !Ext.isIE},
							{
								xtype: 'radiogroup',
								fieldLabel: FR.T('Admin'),
								columns: 1,
								items: [
									{boxLabel: FR.T('No'), name: 'perms[admin_type]', inputValue: '', value: '', checked: (FR.userInfo.perms.admin_type == '')},
									{boxLabel: FR.T('Yes'), name: 'perms[admin_type]', inputValue: 'simple', value: 'simple', checked: (FR.userInfo.perms.admin_type == 'simple')},
									{boxLabel: FR.T('Yes, Independent'), name: 'perms[admin_type]', inputValue: 'indep', value: 'indep', checked: (FR.userInfo.perms.admin_type == 'indep'), helpText: FR.T('- Can only see and manage users, groups, etc. created by himself.')+'<br>'+FR.T('- He can assign space quotas within a total of his own space quota.')}
								],
								listeners: {
									'change': function(f, checked) {
										f.ownerCt.ownerCt.adminPermsFieldset.setVisible((checked.value == 'simple'));
										f.ownerCt.ownerCt.adminHomeFolderFieldset.setVisible((checked.value != ''));
										f.ownerCt.ownerCt.maxUsersFieldset.setVisible((checked.value == 'indep'));
									}
								}
							}
						]
					},
					{
						ref: 'adminPermsFieldset',
						xtype: 'fieldset',
						title: FR.T('Admin permissions'),
						width: 500, hidden: (FR.userInfo.perms.admin_type != 'simple'),
						defaults: {xtype: 'checkbox'},
						items: [
							{
								boxLabel: FR.T('User can create new user accounts.'), inputValue: 1,
								name: 'perms[admin_users]', checked: parseInt(FR.userInfo.perms.admin_users)
							},
							{
								boxLabel: FR.T('User can manage roles.'), inputValue: 1,
								name: 'perms[admin_roles]', checked: parseInt(FR.userInfo.perms.admin_roles)
							},
							{
								boxLabel: FR.T('User can manage notifications.'), inputValue: 1,
								name: 'perms[admin_notifications]', checked: parseInt(FR.userInfo.perms.admin_notifications)
							},
							{
								boxLabel: FR.T('User can access the activity logs.'), inputValue: 1,
								name: 'perms[admin_logs]', checked: parseInt(FR.userInfo.perms.admin_logs)
							},
							{
								boxLabel: FR.T('User can change the metadata settings.'), inputValue: 1,
								name: 'perms[admin_metadata]', checked: parseInt(FR.userInfo.perms.admin_metadata)
							},
							{xtype: 'displayfield', value: ''},
							{xtype: 'userslistfield', only: 'groups', allowAll: true, allItemsText: FR.T('[All groups]'),
								name: 'perms[admin_over]', value: FR.userInfo.perms.admin_over, fieldLabel: FR.T('Can manage'),
								tcfg: {height: 150, width: 250}
							}
						]
					},
					{
						ref: 'maxUsersFieldset',
						xtype: 'fieldset',
						width: 500, hidden: (FR.userInfo.perms.admin_type != 'indep'),
						items: [
							{xtype: 'displayfield', hidden: !Ext.isIE},
							{
								xtype: 'textfield',
								fieldLabel: FR.T('Max users'),
								name: 'perms[admin_max_users]', width: 60,
								helpText: FR.T('This is the maximum number of user accounts this independent admin user can create.')+
								'<br>'+
								FR.T('Setting the value to zero will allow the admin to add an unlimited number of users.'),
								value: FR.userInfo.perms.admin_max_users
							}
						]
					},
					{
						ref: 'adminHomeFolderFieldset',
						xtype: 'fieldset',
						width: 500, hidden: (FR.userInfo.perms.admin_type == ''),
						items: [
							{xtype: 'displayfield', hidden: !Ext.isIE},
							{
								xtype: 'textfield',
								fieldLabel: FR.T('Home folder<br>template path'),
								name: 'perms[admin_homefolder_template]', width: 300,
								helpText:
									FR.T('The users created by this administrator will have their home folders set depending on this template.')+'<br>'+
									FR.T('Leave the field empty to allow the admin to set the paths manually.')+'<br><br>'+
									FR.T('Example: /home/users/{USERNAME}')+'<br><br>'+
									FR.T('{USERNAME} will be automatically replaced with each user\'s login name.')+'<br>'+
									FR.T('{ADMUSERNAME} will be automatically replaced with this user\'s login name.')+'<br>'+
									FR.T('{NAME} will be automatically replaced with this user\'s name.')+'<br>'+
									FR.T('{EMAIL} will be automatically replaced with this user\'s e-mail.')+'<br>'+
									FR.T('{COMPANY} will be automatically replaced with this user\'s company name.'),
								value: FR.userInfo.perms.admin_homefolder_template,
								listeners: {
									'focus': function() {
										this.ownerCt.editHomeFolderTemplateRemark.show();
									},
									'blur': function() {
										this.ownerCt.editHomeFolderTemplateRemark.setVisible(this.isDirty());
									}
								}
							},
							{xtype: 'displayfield', ref: 'editHomeFolderTemplateRemark', value: FR.T('Important: Changing this path will update the home folder paths of all user accounts created by this admin. It will results in the automatic removal of these users\' folder sharing settings and weblinks.'), style:'padding:3px;color:red', hidden: true}
						]
					}
				]
			}
		]},
		tbar: [
		{
			text: FR.T('Save changes'),
			cls: 'fr-btn-primary',
			ref: 'saveBtn',
			handler: function() {
				var editForm = this.ownerCt.ownerCt;
				var opts = {
					url: FR.URLRoot+'/?module=users&section=cpanel&page=edit&action=save',
					maskText: 'Saving changes...'
				};
				editForm.submitForm(opts);
			}
		},
		'->',
		{
			text: FR.T('Delete User Account'),
			iconCls: 'fa fa-fw fa-remove colorRed', disabled: (FR.userInfo.id == 1),
			handler: function(){FR.editUser.deleteHandler();}
		}
	]
});
FR.editUser.deleteHandler = function() {
	this.deleteDlg = new Ext.Window({
		title: FR.T('Please confirm the deletion of the user'),
		resizable: false, constrain:true, constrainHeader: true,
		minimizable: false, maximizable: false, modal: true, buttonAlign: "left",
		width:450, height:150,
		footer: true, closable: false, layout: 'fit', bodyBorder: false, bodyStyle: 'background-color:white;padding:10px 0 0 24px;',
		items: [{ref: 'delHF', xtype: 'checkbox', boxLabel: FR.T('Permanently delete the user\'s home folder.')}],
		buttons: [
			{text: FR.T('Delete'), cls: 'fr-btn-default fr-btn-primary', handler: function() {
				var opts = {
					url: FR.URLRoot+'/?module=users&section=cpanel&page=delete&uid='+FR.userInfo.id,
					maskText: 'Please wait...'
				};
				if (this.deleteDlg.delHF.getValue()) {
					opts.extraParams = {deleteHomeFolder: 1};
				}
				this.deleteDlg.close();
				FR.editUser.formPanel.deleteAction(opts);
			}, scope: this},
			{text: FR.T('Cancel'), cls: 'fr-btn-default', style: 'margin-left:15px', handler: function(){this.deleteDlg.close();}, scope: this}
		]
	}).show();
};
Ext.getCmp('gridTabPanel').add(FR.editUser.formPanel);
FR.editUser.formPanel.show();