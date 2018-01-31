FR.editRole = {};

if (FR.user.isIndep) {
	FR.editRole.homeFolderHelpText = FR.T('This folder will be automatically created in your home folder, if it doesn\'t exists already.');
} else {
	FR.editRole.homeFolderHelpText = FR.T('Type the path to a folder on your server. This is the user\'s personal working space.<br><br>Examples: 	c:/users/group_name<br>/home/users/group_name');
}
FR.editRole.homeFolderHelpText += '<br>'+FR.T('{USERNAME} will be automatically replaced with each user\'s login name.')+'<br>'+
	FR.T('{NAME} will be automatically replaced with this user\'s name.')+'<br>'+
	FR.T('{EMAIL} will be automatically replaced with this user\'s e-mail.')+'<br>'+
	FR.T('{COMPANY} will be automatically replaced with this user\'s company name.');

FR.editRole.formPanel = new FR.components.editForm({
	title: FR.T('Edit Role')+' "'+FR.roleInfo.name+'"',
	items: {
		xtype: 'tabpanel',
		activeTab: 0, border: false, deferredRender: false,
		defaults: {autoScroll: true, bodyStyle:'padding:10px', listeners: {'render': function() {this.doLayout(false, true);}}},
		items: [
			{
				title: FR.T('Basic Information'),
				items: [
					{
						xtype: 'fieldset',
						width: 500,
						defaults: {width: 200},
						items: [
							{
								xtype: 'hidden',
								name: 'id',
								value: FR.roleInfo.id
							},
							{
								xtype: 'textfield',
								fieldLabel: FR.T('Role name'),
								name: 'name',
								value: FR.roleInfo.name
							},{
								xtype: 'textarea',
								fieldLabel: FR.T('Description'),
								name: 'description',
								value: FR.roleInfo.description
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
						hidden: !FR.userCanSetHomeFolder,
						items: [
							{
								xtype: 'textfield',
								fieldLabel: FR.T('Home folder<br> template'),
								name: 'homefolder', width: 300,
								helpText: FR.editRole.homeFolderHelpText,
								value: FR.roleInfo.homefolder,
								listeners: {
									'focus': function() {
										this.ownerCt.editPathRemark.show();
									},
									'blur': function() {
										this.ownerCt.editPathRemark.setVisible(this.isDirty());
									}
								}
							},
							{xtype: 'displayfield', ref: 'editPathRemark', value: FR.T('Important: Changing this path will update the home folder paths of all user accounts using this role. It will results in the automatic removal of the users\' folder sharing settings and weblinks.'), style:'padding:3px;color:red', hidden: true},
							{
								xtype: 'checkbox',
								boxLabel: FR.T('Automatically create the folder if it doesn\'t exists.'), value: 1,
								name: 'create_folder', checked: parseInt(FR.roleInfo.create_folder), hidden: FR.user.isIndep
							}
						]
					},
					{
						ref: 'permsFieldset',
						title: FR.T('Permissions'),
						defaults: {xtype: 'checkbox'},
						labelWidth: 10,
						items: [
							{
								boxLabel: FR.T('User can upload files'), value: 1,
								name: 'upload', checked: parseInt(FR.roleInfo.upload)
							},
							{
								boxLabel: FR.T('User can download files'), value: 1,
								name: 'download', checked: parseInt(FR.roleInfo.download)
							},
							{
								boxLabel: FR.T('User can zip and download folders'), value: 1,
								name: 'download_folders', checked: parseInt(FR.roleInfo.download_folders)
							},
							{xtype: 'displayfield', value: ''},
							{
								boxLabel: FR.T('User can read comments'), value: 1,
								name: 'read_comments', checked: parseInt(FR.roleInfo.read_comments)
							},
							{
								boxLabel: FR.T('User can write comments'), value: 1,
								name: 'write_comments', checked: parseInt(FR.roleInfo.write_comments)
							},
							{xtype: 'displayfield', value: ''},
							{
								boxLabel: FR.T('User can share via web links'),
								name: 'weblink', checked: parseInt(FR.roleInfo.weblink)
							},
							{
								boxLabel: FR.T('User can share with other users'), value: 1,
								name: 'share', checked: parseInt(FR.roleInfo.share)
							},
							{
								boxLabel: FR.T('User can share via e-mail'), value: 1,
								name: 'email', checked: parseInt(FR.roleInfo.email)
							},
							{xtype: 'displayfield', value: ''},
							{
								boxLabel: FR.T('User can access metadata'), value: 1,
								name: 'metadata', checked: parseInt(FR.roleInfo.metadata)
							},
							{
								boxLabel: FR.T('User can access the files\' activity logs'), value: 1,
								hidden: FR.settings.disable_file_history,
								name: 'file_history', checked: parseInt(FR.roleInfo.file_history)
							},
							{xtype: 'displayfield', value: ''},
							{
								boxLabel: FR.T('User cannot move, rename delete, etc..'), value: 1,
								name: 'readonly', checked: parseInt(FR.roleInfo.readonly)
							},
							{xtype: 'displayfield', value: ''},
							{
								boxLabel: FR.T('User can change the password'), value: 1,
								name: 'change_pass', checked: parseInt(FR.roleInfo.change_pass)
							},
							{
								boxLabel: FR.T('User can change personal information'), value: 1,
								name: 'edit_profile', checked: parseInt(FR.roleInfo.edit_profile)
							}
						]
					},
					{
						labelWidth: 150,
						items: [
							{
								xtype: 'userslistfield', allowAll: true, showSelf: true,
								allItemsText: FR.T('[All users]'), tcfg: {height: 150, width: 250},
								name: 'users_may_see', value: FR.roleInfo.users_may_see,
								helpText: FR.T('Use this setting to allow the user to access folders shared by other users.'),
								fieldLabel: FR.T('Can interact with')
							}
						]
					},
					{

						labelWidth: 150,
						defaultType: 'textfield', defaults: {width: 60},
						items: [
							{
								
								fieldLabel: FR.T('Space quota'),
								name: 'space_quota_max',
								helpText: FR.T('The values are in megabytes. The value of 0 disables the limitation.'),
								value: FR.roleInfo.space_quota_max
							},
							{
								fieldLabel: FR.T('Upload max file size'),
								name: 'upload_max_size',
								value: FR.roleInfo.upload_max_size
							}
						]
					}
				]
			},
			{
				title: FR.T('Admin'),
				ref: 'adminTab',
				items: [
					{
						xtype: 'fieldset',
						width: 500,
						items: [
							{
								xtype: 'radiogroup',
								fieldLabel: FR.T('Admin'),
								columns: 1,
								items: [
									{boxLabel: FR.T('No'), name: 'admin_type', inputValue: '', value: '', checked: (FR.roleInfo.admin_type == '')},
									{boxLabel: FR.T('Yes'), name: 'admin_type', inputValue: 'simple', value: 'simple', checked: (FR.roleInfo.admin_type == 'simple')},
									{boxLabel: FR.T('Yes, Independent'), name: 'admin_type', inputValue: 'indep', value: 'indep', checked: (FR.roleInfo.admin_type == 'indep'), helpText: FR.T('- Can only see and manage users, groups, etc. created by himself.')+'<br>'+FR.T('- He can assign space quotas within a total of his own space quota.')}
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
						width: 500, hidden: (FR.roleInfo.admin_type != 'simple'),
						defaults: {xtype: 'checkbox'},
						items: [
							{
								boxLabel: FR.T('User can create new user accounts.'), inputValue: 1,
								name: 'admin_users', checked: parseInt(FR.roleInfo.admin_users)
							},
							{
								boxLabel: FR.T('User can manage roles.'), inputValue: 1,
								name: 'admin_roles', checked: parseInt(FR.roleInfo.admin_roles)
							},
							{
								boxLabel: FR.T('User can manage notifications.'), inputValue: 1,
								name: 'admin_notifications', checked: parseInt(FR.roleInfo.admin_notifications)
							},
							{
								boxLabel: FR.T('User can access the activity logs.'), inputValue: 1,
								name: 'admin_logs', checked: parseInt(FR.roleInfo.admin_logs)
							},
							{
								boxLabel: FR.T('User can change the metadata settings.'), inputValue: 1,
								name: 'admin_metadata', checked: parseInt(FR.roleInfo.admin_metadata)
							},
							{xtype: 'displayfield', value: ''},
							{xtype: 'userslistfield', only: 'groups', allowAll: true, allItemsText: FR.T('[All groups]'),
								name: 'admin_over', value: FR.roleInfo.admin_over,
								tcfg: {title: FR.T('Can manage'),  height: 150, width: 300}
							}
						]
					},
					{
						ref: 'maxUsersFieldset',
						xtype: 'fieldset',
						width: 500, hidden: (FR.roleInfo.admin_type != 'indep'),
						items: [
							{
								xtype: 'textfield',
								fieldLabel: FR.T('Max users'),
								name: 'admin_max_users', width: 60,
								helpText: FR.T('This is the maximum number of user accounts this independent admin user can create.')+
								'<br>'+
								FR.T('Setting the value to zero will allow the admin to add an unlimited number of users.'),
								value: FR.roleInfo.admin_max_users
							}
						]
					},
					{
						ref: 'adminHomeFolderFieldset',
						xtype: 'fieldset',
						width: 500, hidden: (FR.roleInfo.admin_type == ''),
						items: [
							{
								xtype: 'textfield',
								fieldLabel: FR.T('Home folder<br>template path'),
								name: 'admin_homefolder_template', width: 300,
								helpText:
									FR.T('The users created by this administrator will have their home folders set depending on this template.')+'<br>'+
									FR.T('Leave the field empty to allow the admin to set the paths manually.')+'<br><br>'+
									FR.T('Example: /home/users/{USERNAME}')+'<br><br>'+
									FR.T('{USERNAME} will be automatically replaced with each user\'s login name.')+'<br>'+
									FR.T('{ADMUSERNAME} will be automatically replaced with this user\'s login name.')+'<br>'+
									FR.T('{NAME} will be automatically replaced with this user\'s name.')+'<br>'+
									FR.T('{EMAIL} will be automatically replaced with this user\'s e-mail.')+'<br>'+
									FR.T('{COMPANY} will be automatically replaced with this user\'s company name.'),
								value: FR.roleInfo.admin_homefolder_template,
								listeners: {
									'focus': function() {
										this.ownerCt.editHFTRemark.show();
									},
									'blur': function() {
										this.ownerCt.editHFTRemark.setVisible(this.isDirty());
									}
								}
							},
							{xtype: 'displayfield', ref: 'editHFTRemark', value: FR.T('Important: Changing this path will update the home folder paths of all user accounts created by admins using this role. It will results in the automatic removal of the users\' folder sharing settings and weblinks.'), style:'padding:3px;color:red', hidden: true},
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
					url: FR.URLRoot+'/?module=user_roles&section=cpanel&page=edit&action=save',
					maskText: 'Saving changes...'
				};
				editForm.submitForm(opts);
			}
		},
		'->',
		{
			text: FR.T('Delete Role'),
			iconCls: 'fa fa-fw fa-remove colorRed',
			handler: function(){FR.editRole.deleteHandler();}
		}
	]
});
FR.editRole.deleteHandler = function() {
	new Ext.ux.prompt({
		text: FR.T('Please confirm role deletion.'),
		confirmHandler: function() {
			var opts = {
				url: FR.URLRoot+'/?module=user_roles&section=cpanel&page=delete&id='+FR.roleInfo.id,
				maskText: 'Please wait...'
			};
			FR.editRole.formPanel.deleteAction(opts);
		}
	});
};
Ext.getCmp('gridTabPanel').add(FR.editRole.formPanel);
FR.editRole.formPanel.show();