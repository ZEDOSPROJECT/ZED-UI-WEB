FR.editSettings = {};
FR.editSettings.formPanel = new FR.components.editForm({
	title: FR.T('Misc options'),
	layout: 'form', bodyStyle: 'padding:10px;',
	labelWidth: 250, autoScroll: true, defaults: {width: 500},
	items: [
		{
			xtype: 'fieldset', labelWidth: 200, hidden: FR.system.isFree,
			items: [
				{
					fieldLabel: FR.T('Number of days to keep the file activity log entries'),
					name: 'settings[file_history_entry_lifetime]', value: FR.settings.file_history_entry_lifetime,
					xtype: 'numberfield', width: 60, allowBlank: false
				},
				{
					xtype: 'checkbox',
					boxLabel: FR.T('Disable the file activity logs.'),
					width: 400, value: 1,
					name: 'settings[disable_file_history]', checked: parseInt(FR.settings.disable_file_history)
				}
			]
		},
		{
			xtype: 'fieldset', labelWidth: 200,
			items: [
				{
					xtype: 'numberfield', width: 60, allowBlank: false,
					fieldLabel: FR.T('Number of old versions to keep for each file'),
					name: 'settings[versioning_max]',
					value: FR.settings.versioning_max,
					helpText: FR.T('Setting this to 0 disables the versioning system.')+' '+(!FR.system.isFree?FR.T('The recommended value is 10.'):'')
				},
				{xtype: 'displayfield', hidden: !Ext.isIE},
				{
					xtype: 'textfield', width: 250,
					fieldLabel: FR.T('Blocked file types'),
					helpText: FR.T('Example list:')+' php,sh,htaccess,ini',
					name: 'settings[upload_blocked_types]', value: FR.settings.upload_blocked_types
				},
				{
					xtype: 'combo',
					fieldLabel: FR.T('Enable download accelerator'),
					name: 'settings[download_accelerator]', hiddenName: 'settings[download_accelerator]',
					autoCreate: true, mode: 'local', editable: false,
					emptyText: FR.T('Select...'),
					displayField: 'name', valueField: 'id',
					triggerAction:'all', disableKeyFilter: true,
					value: FR.settings.download_accelerator,
					store: new Ext.data.SimpleStore({fields: ['id', 'name'], data: [
						['', FR.T('- None -')],
						['x_accel', FR.T('NGINX X-Accell')],
						['xsendfile', FR.T('Apache XSendfile')],
						['lightspeed', FR.T('LiteSpeed Internal Redirect')]
					]}),
					helpText: FR.T('Select the appropriate option for your particular web server.')+'<br>'+
					FR.T('Note that only the downloading of really large files will benefit from this option.')+'<br>'+
					FR.T('If in doubt select "- None -".')+'<br>'+
					FR.T('Make sure to check the integrity of the downloaded files after enabling an accelerator.')
				}
			]
		}
	],
	tbar: [
		{
			text: FR.T('Save changes'), cls: 'fr-btn-primary',
			ref: 'saveBtn',
			handler: function() {
				var editForm = this.ownerCt.ownerCt;
				var opts = {
					url: FR.URLRoot+'/?module=cpanel&section=settings&action=save',
					maskText: 'Saving changes...',
					params: editForm.form.getFieldValues()
				};
				editForm.submitForm(opts);
			}
		}
	]
});
Ext.getCmp('appTab').add(FR.editSettings.formPanel);
Ext.getCmp('appTab').doLayout();