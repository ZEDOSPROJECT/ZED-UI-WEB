var items = [
	{
		xtype: 'checkbox',
		hideLabel: true,
		boxLabel: FR.T('Disable plugin'),
		width: 400, value: 1,
		name: 'settings[disable_custom_action_'+FR.pluginInfo.name+']', checked: FR.pluginInfo.isDisabled
	},
	{
		xtype: 'checkbox',
		hideLabel: true,
		boxLabel: FR.T('Open in a new browser tab'),
		width: 400, value: 1,
		name: 'settings[custom_action_'+FR.pluginInfo.name+'_newtab]', checked: FR.pluginInfo.openInNewTab
	}
];

var settingFields = [];
Ext.each(FR.pluginInfo.settings, function(s) {
	settingFields.push({
		xtype: (s.large ? 'textarea' : 'textfield'), width: 270, height: (s.large ? 100 : false),
		fieldLabel: FR.T(s.title),  value: s.v,
		name: 'settings[plugins_'+FR.pluginInfo.name+'_'+s.k+']'
	});
	if (s.comment) {
		settingFields.push({xtype: 'displayfield', value: s.comment});
	}
});
if (settingFields.length > 0) {
	items.push({xtype: 'displayfield', style:'height:20px'});
	items.push({
		xtype: 'fieldset',
		title: FR.T('Plugin settings'),
		width: 500, labelWidth: 180,
		items: settingFields
	})
}
var formPanel = new FR.components.editForm({
	title: FR.T('Edit plugin: %1').replace('%1', FR.pluginInfo.JSconfig.title),
	layout: 'form', bodyStyle: 'padding:10px;', autoScroll: true,
	items: items,
	tbar: [
		{
			text: FR.T('Save changes'),
			cls: 'fr-btn-primary',
			ref: 'saveBtn',
			handler: function() {
				var editForm = this.ownerCt.ownerCt;
				var params = editForm.form.getFieldValues();
				var opts = {
					url: FR.URLRoot+'/?module=cpanel&section=settings&page=default&action=save',
					maskText: 'Saving changes...',
					params: params
				};
				editForm.submitForm(opts);
			}
		}
	]
});
Ext.getCmp('gridTabPanel').add(formPanel);
formPanel.show();