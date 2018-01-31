FR.editSettings = {};
FR.editSettings.formPanel = new FR.components.editForm({
	title: FR.T('File indexing'),
	layout: 'form', bodyStyle: 'padding:10px;',
	defaults: {width: 500}, autoScroll: true,
	items: [
		{
			xtype: 'fieldset',
			checkboxToggle: {tag: 'input', type: 'checkbox', name: this.checkboxName || this.id + '-checkbox', id: 'settings[search_enable]'}, 
			checkboxName: 'settings[search_enable]',
			title: FR.T('Enable file indexing.'), animCollapse: true,
			collapsed: !parseInt(FR.settings.search_enable),
			labelWidth: 200,
			defaults: {width: 250},
			listeners: {'expand': function() {if (!this.layoutPatched) {this.doLayout(false, true);this.layoutPatched = true;}}},
			items: [
				{
					xtype: 'textfield', ref: 'impath',
					fieldLabel: FR.T('Path to Apache Tika jar file'),
					name: 'settings[search_tika_path]', value: FR.settings.search_tika_path
				},
				{
					xtype: 'panel', border: false, layout: 'hbox', width: 500,
					layoutConfig: {padding: 5}, bodyStyle: 'padding-left:200px',
					defaults:{margins:'0 0 0 0'},
					items: [
						{xtype: 'button', cls: 'fr-btn-smaller fr-btn-nomargin', text: FR.T('Check path'), handler: function() {
							var par = 'path='+encodeURIComponent(this.ownerCt.ownerCt.impath.getValue());
							var output = this.ownerCt.ownerCt.serverReply; output.show();
							FR.utils.getAjaxOutput(FR.URLRoot+'/?module=cpanel&section=settings&page=file_search&action=checkTikaPath', par, output);
						}}
					]
				},
				{xtype: 'displayfield', ref: 'serverReply', value: 'test', style:'border:1px solid silver;padding:3px;', hidden: true},
				{
					xtype: 'textfield',
					fieldLabel: FR.T('Apache Tika server hostname'),
					name: 'settings[search_tika_host]', value: FR.settings.search_tika_host,
					helpText: FR.T('If a hostname is set, then Apache Tika will be used in server mode.')
				},
				{
					xtype: 'textfield',
					fieldLabel: FR.T('Port number'), width: 50,
					name: 'settings[search_tika_port]', value: FR.settings.search_tika_port,
					helpText: FR.T('The default Apache Tika port is %1').replace('%1', '9998')
				},
				{
					xtype: 'panel', border: false, layout: 'hbox', width: 500,
					layoutConfig: {padding: 5}, bodyStyle: 'padding-left:200px',
					defaults:{margins:'0 0 0 0'},
					items: [
						{xtype: 'button', cls: 'fr-btn-smaller fr-btn-nomargin', text: FR.T('Test server'), handler: function() {
							var params = this.ownerCt.ownerCt.ownerCt.form.getValues();
							var output = this.ownerCt.ownerCt.serverReply2; output.show();
							FR.utils.getAjaxOutput(FR.URLRoot+'/?module=cpanel&section=settings&page=file_search&action=checkTikaServer', params, output);
						}}
					]
				},
				{xtype: 'displayfield', ref: 'serverReply2', value: 'test', style:'border:1px solid silver;padding:3px;', hidden: true},
				{
					xtype: 'textfield',
					fieldLabel: FR.T('Exclude files by extension'),
					name: 'settings[search_exclude_ext]', value: FR.settings.search_exclude_ext,
					helpText: FR.T('Example list:')+' zip,rar,tar,tar.gz,tgz,gz,gzip'
				}
			]
		},
		{
			xtype: 'displayfield', hideLabel: true, style: 'color:gray', width: 600, value: FR.T('Requires a scheduled task which periodically runs the command line script "cron/process_search_index_queue.php". Do not enable without setting the task.'), hidden: parseInt(FR.settings.search_enable)
		},
		{
			xtype: 'fieldset',
			title: FR.T('Stats'),
			hidden: !parseInt(FR.settings.search_enable),
			labelWidth: 180,
			defaults: {width: 250},
			items: [
				{
					xtype: 'displayfield',
					fieldLabel: FR.T('Number of indexed files'),
					value: FR.stats.indexCount
				},
				{
					xtype: 'displayfield',
					fieldLabel: FR.T('Number of queued operations'),
					value: FR.stats.queuedOps
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
				var params = editForm.form.getFieldValues();
				var extra = {};
				extra['settings[search_enable]'] = Ext.get('settings[search_enable]').dom.checked ? 1:0;
				Ext.apply(params, extra);
				var opts = {
					url: FR.URLRoot+'/?module=cpanel&section=settings&action=save',
					maskText: 'Saving changes...',
					params: params
				};
				editForm.submitForm(opts);
			}
		}
	]
});
Ext.getCmp('appTab').add(FR.editSettings.formPanel);
Ext.getCmp('appTab').doLayout();