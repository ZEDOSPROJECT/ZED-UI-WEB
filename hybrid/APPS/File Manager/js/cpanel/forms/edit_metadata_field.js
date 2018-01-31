FR.addMetadataField = {};
FR.addMetadataField.formPanel = new FR.components.editForm({
	title: FR.T('Edit Field'),
	layout: 'form', bodyStyle: 'padding:10px;', autoScroll: true,
	items: [
		{
			xtype: 'fieldset',
			width: 500,
			defaults: {width: 200},
			items: [
				{
					xtype: 'hidden',
					name: 'id',
					value: FR.fieldInfo.id
				},
				{
					xtype: 'textfield',
					fieldLabel: FR.T('Field name'),
					name: 'name',
					value: FR.fieldInfo.name
				},{
					xtype: 'textarea',
					fieldLabel: FR.T('Description'),
					name: 'description',
					value: FR.fieldInfo.description
				},{
					xtype: 'checkbox',
					boxLabel: FR.T('Show by default as column in file grid'),
					width: 400, value: 1,
					name: 'show_column_by_default', checked: parseInt(FR.fieldInfo.show_column_by_default)
				},{
					xtype: 'checkbox',
					boxLabel: FR.T('Hide fieldset name in column header'),
					width: 400, value: 1,
					name: 'hide_fieldset_name_in_column', checked: parseInt(FR.fieldInfo.hide_fieldset_name_in_column)
				},
				{
					xtype: 'combo',
					fieldLabel: FR.T('Field type'),
					hiddenName: 'type',
					mode: 'local', editable: false,
					emptyText: FR.T('Select...'), 
					displayField: 'label', valueField: 'val',
					triggerAction:'all', disableKeyFilter: true,
					value: FR.fieldInfo.type,
					store: new Ext.data.SimpleStore({fields: ['val', 'label'], data: [
						['small', FR.T('Small text')],
						['normal', FR.T('Normal text')],
						['large', FR.T('Large text')],
						['list', FR.T('Predefined list')],
						['multiple', FR.T('Multiple values')],
						['date', FR.T('Date/time')]
					]})
				}, {
					xtype: 'textarea', width: 300,
					fieldLabel: FR.T('Predefined values'),
					name: 'options', value: FR.fieldInfo.options,
					helpText: FR.T('Separate values by commas. Example: one, two, three')
				},{
					xtype: 'textfield', width: 300,
					fieldLabel: FR.T('Automatic source'),
					name: 'source', value: FR.fieldInfo.source,
					helpText: FR.T('This is the path to the "Media Info" field.')
				}
			]
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
					url: FR.URLRoot+'/?module=metadata&section=cpanel&page=edit_field&action=save',
					maskText: 'Saving changes...'
				};
				editForm.submitForm(opts);
			}
		}
	]
});
Ext.getCmp('gridTabPanel').add(FR.addMetadataField.formPanel);
FR.addMetadataField.formPanel.show();