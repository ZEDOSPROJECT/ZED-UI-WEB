FR.editSettings = {};
FR.editSettings.formPanel = new FR.components.editForm({
	title: FR.T('Interface options'),
	layout: 'form', bodyStyle: 'padding:10px;',
	labelWidth: 150, autoScroll: true,
	defaults: {width: 500},
	items: [
		{
			xtype: 'fieldset',
			defaults: {width: 250},
			title: false,
			items: [
				{xtype: 'displayfield', hidden: !Ext.isIE},
				{
					xtype: 'combo',
					fieldLabel: FR.T('Default language'),
					name: 'settings[ui_default_language]', hiddenName: 'settings[ui_default_language]',
					autoCreate: true, mode: 'local', editable: false,
					emptyText: FR.T('Select...'),
					displayField: 'name', valueField: 'id',
					triggerAction:'all', disableKeyFilter: true,
					value: FR.settings.ui_default_language,
					store: new Ext.data.SimpleStore({fields: ['id', 'name'], data: FR.languages})
				},
				{
					xtype: 'checkbox',
					boxLabel: FR.T('Display language menu'),
					width: 400, value: 1,
					name: 'settings[ui_display_language_menu]', checked: parseInt(FR.settings.ui_display_language_menu)
				},
				{
					xtype: 'compositefield',
					fieldLabel: FR.T('Upload language file'),
					items:[
						{xtype: 'button', text: FR.T('Upload file..'), iconCls: 'fa fa-fw fa-upload', cls: 'fr-btn-primary fr-btn-smaller fr-btn-nomargin color-white',
							listeners: {
								'afterrender': function() {
									this.flow = new Flow({
										target: '?module=cpanel&section=settings&page=interface&action=upload_translation',
										singleFile: true, startOnSubmit: true,
										validateChunkResponse: function(status, message) {
											if (status != '200') {return 'retry';}
											try {var rs = Ext.util.JSON.decode(message);} catch (er){return 'retry';}
											if (rs) {if (rs.success) {return 'success';} else {return 'error';}}
										}
									});
									this.flow.on('fileSuccess', function(file, message) {
										try {var rs = Ext.util.JSON.decode(message);} catch (er){
											FR.feedback('Unexpected server reply: '+message);
										}
										if (rs && rs.msg) {FR.feedback(rs.msg);}
									});
									this.flow.on('fileError', function(file, message) {
										try {var rs = Ext.util.JSON.decode(message);} catch (er){
											FR.feedback('Unexpected server reply: '+message);
										}
										if (rs && rs.msg) {FR.feedback(rs.msg);}
									});
								}
							},
							handler: function() {
								this.flow.removeAll();
								this.flow.browseFiles();
							}
						},{xtype: 'displayfield'}
					]
				}
			]
		},
		{
			xtype: 'fieldset',
			defaults: {width: 250},
			title: false,
			items: [
				{xtype: 'displayfield', hidden: !Ext.isIE},
				{
					xtype: 'textfield',
					fieldLabel: FR.T('Login form title'),
					name: 'settings[ui_login_title]',
					value: FR.settings.ui_login_title
				},
				{
					xtype: 'textfield',
					fieldLabel: FR.T('Login form logo URL'),
					name: 'settings[ui_login_logo]',
					value: FR.settings.ui_login_logo
				},
				{
					xtype: 'textfield',
					fieldLabel: FR.T('Login page background'),
					name: 'settings[ui_login_bg]',
					value: FR.settings.ui_login_bg,
					helpText: FR.T('For a background image type in a full URL.')+'<br>'+FR.T('For a background color type in a hexadecimal value, for example #EC6952')
				},
				{
					xtype: 'textarea',
					fieldLabel: FR.T('Login form welcome message'),
					name: 'settings[ui_login_text]',
					value: FR.settings.ui_login_text
				}
			]
		},
		{
			xtype: 'fieldset',
			defaults: {width: 250},
			items: [
				{xtype: 'displayfield', hidden: !Ext.isIE},
				{
					xtype: 'textfield', ref:'app_title',
					fieldLabel: FR.T('Application title'),
					name: 'settings[app_title]',
					value: FR.settings.app_title
				},
				{
					xtype: 'checkbox', ref:'ui_title_logo',
					boxLabel: FR.T('Use title as logo'),
					width: 400, value: 1,
					name: 'settings[ui_title_logo]', checked: parseInt(FR.settings.ui_title_logo),
					listeners: {
						check: function(field, checked) {
							if (checked) {
								field.ownerCt.ui_logo_url.disable();
							} else {
								field.ownerCt.ui_logo_url.enable();
							}
						}
					}
				},
				{
					xtype: 'textfield', ref: 'ui_logo_url',
					fieldLabel: FR.T('Logo URL'),
					name: 'settings[ui_logo_url]',
					value: FR.settings.ui_logo_url,
					disabled: parseInt(FR.settings.ui_title_logo),
					helpText: FR.T('Recommended height for the image file is 38 pixels')
				},
				{
					xtype: 'textfield', ref: 'ui_logo_link_url',
					fieldLabel: FR.T('Logo link URL'),
					name: 'settings[ui_logo_link_url]',
					value: FR.settings.ui_logo_link_url,
					helpText: FR.T('This is the address to where the users are redirected when clicking the logo')
				},
				{
					xtype: 'textfield',
					fieldLabel: FR.T('Help URL'),
					name: 'settings[ui_help_url]',
					value: FR.settings.ui_help_url,
					helpText: FR.T('URL of your help and support page')
				},
				{
					xtype: 'textarea',
					fieldLabel: FR.T('Welcome message'),
					name: 'settings[ui_welcome_message]',
					value: FR.settings.ui_welcome_message
				}
			]
		},
		{
			xtype: 'fieldset',
			defaults: {width: 250},
			items: [
				{
					xtype: 'radiogroup', vertical: true, columns: 1,
					fieldLabel: FR.T('Default display mode'),
					items: [
						{boxLabel: '<i class="fa fa-fw fa-list gray"></i> '+FR.T('Detailed list'), name: 'settings[ui_default_view]', inputValue: 'list', checked: (FR.settings.ui_default_view == 'list')},
						{boxLabel: '<i class="fa fa-fw fa-th gray"></i> '+FR.T('Thumbnails'), name: 'settings[ui_default_view]', inputValue: 'thumbnails', checked: (FR.settings.ui_default_view == 'thumbnails')},
						{boxLabel: '<i class="fa fa-fw fa-picture-o gray"></i> '+FR.T('Photos'), name: 'settings[ui_default_view]', inputValue: 'photos', checked: (FR.settings.ui_default_view == 'photos')},
						{boxLabel: '<i class="fa fa-fw fa-music gray"></i> '+FR.T('Music'), name: 'settings[ui_default_view]', inputValue: 'music', checked: (FR.settings.ui_default_view == 'music')}
					]
				},
				{
					xtype: 'checkboxgroup', vertical: true, columns: 1,
					fieldLabel: FR.T('Show media library'),
					items: [
						{boxLabel: FR.T('Photos'), name: 'settings[ui_media_folders_photos_enable]', inputValue: 1, checked: parseInt(FR.settings.ui_media_folders_photos_enable)},
						{boxLabel: FR.T('Music'), name: 'settings[ui_media_folders_music_enable]', inputValue: 1, checked: parseInt(FR.settings.ui_media_folders_music_enable)}
					]
				},
				{
					xtype: 'textfield',
					fieldLabel: FR.T('Thumbnail size'), width: 50,
					name: 'settings[thumbnails_size]', value: FR.settings.thumbnails_size
				},
				{
					xtype: 'combo',
					fieldLabel: FR.T('Double-click files action'),
					name: 'settings[ui_double_click]', hiddenName: 'settings[ui_double_click]',
					autoCreate: true, mode: 'local', editable: false,
					emptyText: FR.T('Select...'),
					displayField: 'name', valueField: 'id',
					triggerAction:'all', disableKeyFilter: true,
					value: FR.settings.ui_double_click,
					store: new Ext.data.SimpleStore({fields: ['id', 'name'], data: [
						['preview', FR.T('open preview')],
						['downloadb', FR.T('open in browser')],
						['download', FR.T('prompt to save')],
						['showmenu', FR.T('display contextual menu')]
					]})
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
					params: Ext.apply({
						'settings[ui_display_language_menu]': 0,
						'settings[ui_title_logo]': 0,
						'settings[ui_enable_full_screen]': 0,
						'settings[ui_media_folders_photos_enable]': 0,
						'settings[ui_media_folders_music_enable]': 0
					}, editForm.form.getValues())
				};
				editForm.submitForm(opts);
			}
		}
	]
});
Ext.getCmp('appTab').add(FR.editSettings.formPanel);
Ext.getCmp('appTab').doLayout();