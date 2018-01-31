FR.editDefaultViewer = {
	typeStore: new Ext.data.SimpleStore({idIndex: 0, fields: ['type', 'name', 'extList'], data: FR.types})
};
FR.editDefaultViewer.extList = '';
if (FR.entry.type) {
	var selectedType = FR.editDefaultViewer.typeStore.getById(FR.entry.type);
	if (selectedType) {
		FR.editDefaultViewer.extList = selectedType.data.extList;
	}
}
FR.editDefaultViewer.formPanel = new FR.components.editForm({
	title: FR.T('Edit default viewer'),
	layout: 'form', bodyStyle: 'padding:10px;', autoScroll: true,
	defaults: {width: 220},
	items: [

		{
			xtype: 'hidden',
			name: 'id',
			value: FR.entry.id
		},
		{
			xtype: 'combo',
			fieldLabel: FR.T('File type'),
			name: 'type',
			autoCreate: true, mode: 'local', editable: false,
			displayField: 'name', valueField: 'type',
			value: (FR.entry.type || '-'), triggerAction:'all',
			store: FR.editDefaultViewer.typeStore,
			listeners: {
				'beforeselect': function(f, record) {
					if (record.data.type == '-') {
						f.ownerCt.extList.setVisible(false);
						f.ownerCt.ext.setVisible(true);
					} else {
						f.ownerCt.extList.setValue(record.data.extList);
						f.ownerCt.extList.setVisible(true);
						f.ownerCt.ext.setValue('');
						f.ownerCt.ext.setVisible(false);
					}
				}
			}
		},
		{
			xtype: 'textfield',
			fieldLabel: FR.T('File extension'), width: 60,
			name: 'ext', ref: 'ext', hidden: (FR.entry.type != '-'),
			value: FR.entry.ext
		},
		{
			xtype: 'displayfield', ref: 'extList',
			fieldLabel: FR.T('File extensions'), hidden: (FR.entry.type == '-'),
			value: FR.editDefaultViewer.extList
		},
		{
			xtype: 'combo',
			fieldLabel: FR.T('Open with'),
			name: 'handler',
			autoCreate: true, mode: 'local', editable: false,
			displayField: 'name', valueField: 'handler',
			triggerAction:'all',
			value: FR.entry.handler,
			store: new Ext.data.SimpleStore({fields: ['handler', 'name'], data: FR.viewers})
		}
	],
	tbar: [
		{
			text: FR.T('Save changes'),
			cls: 'fr-btn-primary',
			ref: 'saveBtn',
			handler: function() {
				var editForm = this.ownerCt.ownerCt;
				var params = editForm.form.getFieldValues();
				var opts = {
					url: FR.URLRoot+'/?module=custom_actions&section=cpanel&page=defaults_edit&action=save',
					maskText: 'Saving changes...',
					params: params
				};
				editForm.submitForm(opts);
			}
		},
		'->',
		{
			text: FR.T('Delete'), iconCls: 'fa fa-fw fa-remove colorRed',
			handler: function() {
				FR.editDefaultViewer.formPanel.deleteAction({
					url: FR.URLRoot+'/?module=custom_actions&section=cpanel&page=defaults_delete&id='+FR.entry.id,
					maskText: 'Please wait...'
				});
			}
		}
	]
});
Ext.getCmp('gridTabPanel').add(FR.editDefaultViewer.formPanel);
FR.editDefaultViewer.formPanel.show();