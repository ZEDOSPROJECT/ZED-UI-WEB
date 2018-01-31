FR.editSettings = {};
FR.editSettings.formPanel = new FR.components.editForm({
	title: FR.T('Image preview'),
	layout: 'form', bodyStyle: 'padding:10px;', labelWidth: 150,
	defaults: {width: 250}, autoScroll: true,
	items: [
		{
			xtype: 'fieldset',
			checkboxToggle: {tag: 'input', type: 'checkbox', name: this.checkboxName || this.id + '-checkbox', id: 'settings[thumbnails_imagemagick]'}, 
			checkboxName: 'settings[thumbnails_imagemagick]',
			title: FR.T('Enable ImageMagick support.'), animCollapse: true,
			collapsed: !parseInt(FR.settings.thumbnails_imagemagick),
			labelWidth: 250,
			width: 600, defaults: {width: 300},
			listeners: {'expand': function() {if (!this.layoutPatched) {this.doLayout(false, true);this.layoutPatched = true;}}},
			items: [
				{
					xtype: 'textfield', ref: 'impath',
					fieldLabel: FR.T('Path to ImageMagick "convert" binary'),
					name: 'settings[thumbnails_imagemagick_path]', value: FR.settings.thumbnails_imagemagick_path
				},
				{
					xtype: 'panel', border: false, layout: 'hbox', width: 500,
					layoutConfig: {padding: 5}, bodyStyle: 'padding-left:250px',
					defaults:{margins:'0 0 0 0'},
					items: [
						{xtype: 'button', cls: 'fr-btn-smaller fr-btn-nomargin', text: FR.T('Check path'), handler: function() {
							var par = 'path='+encodeURIComponent(this.ownerCt.ownerCt.impath.getValue());
							var output = this.ownerCt.ownerCt.serverReply; output.show();
	FR.utils.getAjaxOutput(FR.URLRoot+'/?module=cpanel&section=settings&page=image_preview&action=checkImageMagick', par, output);
						}}
					]
				},
				{xtype: 'displayfield', ref: 'serverReply', value: 'test', style:'border:1px solid silver;padding:3px;overflow:auto', hidden: true},
				{
					xtype: 'textarea', height: 70,
					fieldLabel: FR.T('Generate ImageMagick thumbnails for the following file types'),
					name: 'settings[thumbnails_imagemagick_ext]', value: FR.settings.thumbnails_imagemagick_ext
				},
				{
					xtype: 'fieldset',
					checkboxToggle: {tag: 'input', type: 'checkbox', name: this.checkboxName || this.id + '-checkbox', id: 'settings[thumbnails_pngquant]'},
					checkboxName: 'settings[thumbnails_pngquant]',
					title: FR.T('Enable pngquant support.'), animCollapse: true,
					collapsed: !parseInt(FR.settings.thumbnails_pngquant),
					labelWidth: 239,
					width: 555, defaults: {width: 270},
					listeners: {'expand': function() {if (!this.layoutPatched) {this.doLayout(false, true);this.layoutPatched = true;}}},
					items: [
						{
							xtype: 'textfield', ref: 'pngquantPath',
							fieldLabel: FR.T('Path of the pngquant binary'),
							name: 'settings[thumbnails_pngquant_path]', value: FR.settings.thumbnails_pngquant_path
						},
						{
							xtype: 'panel', border: false, layout: 'hbox', width: 500,
							layoutConfig: {padding: 5}, bodyStyle: 'padding-left:239px',
							defaults:{margins:'0 0 0 0'},
							items: [
								{xtype: 'button', cls: 'fr-btn-smaller fr-btn-nomargin', text: FR.T('Check path'), handler: function() {
									var par = 'path='+encodeURIComponent(this.ownerCt.ownerCt.pngquantPath.getValue());
									var output = this.ownerCt.ownerCt.serverReply;output.show();
									FR.utils.getAjaxOutput(FR.URLRoot+'/?module=cpanel&section=settings&page=image_preview&action=checkpngquant', par, output);
								}}
							]
						},
						{xtype: 'displayfield', ref: 'serverReply', value: 'test', style:'border:1px solid silver;padding:3px;', hidden: true},
					]
				}
			]
		},
		{
			xtype: 'fieldset',
			checkboxToggle: {tag: 'input', type: 'checkbox', name: this.checkboxName || this.id + '-checkbox', id: 'settings[thumbnails_ffmpeg]'},
			checkboxName: 'settings[thumbnails_ffmpeg]',
			title: FR.T('Enable FFmpeg support.'), animCollapse: true,
			collapsed: !parseInt(FR.settings.thumbnails_ffmpeg),
			width: 600, defaults: {width: 300}, labelWidth: 250,
			listeners: {'expand': function() {if (!this.layoutPatched) {this.doLayout(false, true);this.layoutPatched = true;}}},
			items: [
				{
					xtype: 'textfield', ref: 'ffmpath',
					fieldLabel: FR.T('Path to FFmpeg binary'),
					name: 'settings[thumbnails_ffmpeg_path]', value: FR.settings.thumbnails_ffmpeg_path
				},
				{
					xtype: 'panel', border: false, layout: 'hbox', width: 500,
					layoutConfig: {padding: 5}, bodyStyle: 'padding-left:250px',
					defaults:{margins:'0 5 0 0'},
					items: [
						{xtype: 'button',  cls: 'fr-btn-smaller fr-btn-nomargin', text: FR.T('Check path'), handler: function() {
							var par = 'path='+encodeURIComponent(this.ownerCt.ownerCt.ffmpath.getValue());
							var output = this.ownerCt.ownerCt.serverReply; output.show();
							FR.utils.getAjaxOutput(FR.URLRoot+'/?module=cpanel&section=settings&page=image_preview&action=checkFFmpeg', par, output);
						}}
					]
				},
				{xtype: 'displayfield', ref: 'serverReply', value: 'test', style:'border:1px solid silver;padding:3px;overflow:auto', hidden: true},
				{
					xtype: 'textarea',
					fieldLabel: FR.T('Generate FFmpeg thumbnails for the following file types'),
					name: 'settings[thumbnails_ffmpeg_ext]', value: FR.settings.thumbnails_ffmpeg_ext
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
				extra['settings[thumbnails_imagemagick]'] = Ext.get('settings[thumbnails_imagemagick]').dom.checked ? 1:0;
				extra['settings[thumbnails_pngquant]'] = Ext.get('settings[thumbnails_pngquant]').dom.checked ? 1:0;
				extra['settings[thumbnails_ffmpeg]'] = Ext.get('settings[thumbnails_ffmpeg]').dom.checked ? 1:0;
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