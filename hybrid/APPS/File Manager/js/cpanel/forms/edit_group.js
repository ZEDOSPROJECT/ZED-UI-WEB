FR.editGroup = {};
FR.editGroup.formPanel = new FR.components.editForm({
	title: FR.T('Edit group')+' "'+FR.groupInfo.name+'"',
	layout: 'form', bodyStyle: 'padding:10px;', autoScroll: true,
	defaults: {width: 250},
	items: [
		{
			xtype: 'hidden',
			name: 'id',
			value: FR.groupInfo.id
		},
		{
			xtype: 'textfield',
			fieldLabel: FR.T('Group name'),
			name: 'name',
			value: FR.groupInfo.name
		},{
			xtype: 'textarea',
			fieldLabel: FR.T('Description'),
			name: 'description',
			value: FR.groupInfo.description
		},
		{
			xtype: 'userslistfield',
			name: 'users', only: 'users',
			value: FR.groupInfo.users, showSelf: true,
			fieldLabel: FR.T('Users'),
			tcfg: {height: 200, width: 250}
		}
	],
	tbar: [
		{
			text: FR.T('Save changes'),
			cls: 'fr-btn-primary',
			ref: 'saveBtn',
			handler: function() {
				var editForm = this.ownerCt.ownerCt;
				var opts = {
					url: FR.URLRoot+'/?module=user_groups&section=cpanel&page=edit&action=save',
					maskText: 'Saving changes...'
				};
				editForm.submitForm(opts);
			}
		},
		'->',
		{
			text: FR.T('Delete group'),
			iconCls: 'fa fa-fw fa-remove colorRed',
			handler: function(){FR.editGroup.deleteHandler();}
		}
	]
});
FR.editGroup.deleteHandler = function() {
	new Ext.ux.prompt({
		text: FR.T('Please confirm group deletion.'),
		confirmHandler: function() {
			var opts = {
				url: FR.URLRoot+'/?module=user_groups&section=cpanel&page=delete&id='+FR.groupInfo.id,
				maskText: 'Please wait...'
			};
			FR.editGroup.formPanel.deleteAction(opts);
		}
	});
};
Ext.getCmp('gridTabPanel').add(FR.editGroup.formPanel);
FR.editGroup.formPanel.show();