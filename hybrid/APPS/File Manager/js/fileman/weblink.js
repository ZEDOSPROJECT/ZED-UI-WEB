Ext.onReady(function() {
	Ext.QuickTips.init();
	var fieldWidth = 160;
	var labelWidth = 95;

	if (['german', 'dutch', 'finnish', 'turkish', 'italian'].indexOf(FR.language) != -1) {
		labelWidth = 170;
	} else if (['french', 'spanish', 'danish'].indexOf(FR.language) != -1) {
		labelWidth = 150;
	} else if (['romanian', 'russian', 'swedish', 'basque', 'brazilian portuguese', 'brazilian_portuguese'].indexOf(FR.language) != -1) {
		labelWidth = 110;
	}

	FR.UI.form = new Ext.FormPanel({
		layout: 'fit',
		items: [
			{
				xtype: 'tabpanel', ref: 'tabPanel',
				activeTab: 0, deferredRender: false,
				buttonAlign: 'center',
				bodyStyle:'padding:15px',
				items: [
					{
						title: FR.T('Basic'),
						items: [
							{
							layout: 'form',
							labelAlign: 'right', labelWidth: labelWidth,
							items: [
									{
										xtype: 'datefield', fieldLabel: FR.T('Expiration date'), width: fieldWidth,
										name: 'expiry',  id: 'expiry', minValue: new Date()
									},
									{
										xtype: 'numberfield', fieldLabel: FR.T('Download limit'),
										name: 'download_limit', id: 'download_limit', width: 50, allowDecimals: false, allowNegative: false, autoStripChars: true
									},
									{
										xtype: 'textfield', fieldLabel: FR.T('Set a password'),
										name: 'password', id: 'password',
										selectOnFocus: true, width: fieldWidth,
										listeners: {
											'focus': function() {
												if (this.getRawValue().length == 0) {
													this.setValue(randomPass(12, true, true, true, true, 2));
													this.getEl().dom.select();
												}
											}
										}
									},
									{
										boxLabel: FR.T('Prevent the browser from opening the file.'),
										xtype: 'checkbox', name: 'force_save', id: 'force_save', value: '1', hideLabel: true,
										listeners: {
											render: function() {
												Ext.QuickTips.register({
													target: this.wrap.dom.lastChild,
													text: FR.T('Some common types of files are being opened by the browser instead of asking the visitors from saving to their computers.')
												}) ;
											}
										}
									},
									{
										boxLabel: FR.T('Receive download e-mail notifications.'), hideLabel: true,
										xtype: 'checkbox', name: 'notify', id: 'notify', value: '1'
									},
									{
										boxLabel: FR.T('Share the file comments with the visitors.'), hideLabel: true,
										xtype: 'checkbox', value: '1', name: 'show_comments', id: 'show_comments', hidden: !window.parent.User.perms.read_comments
									},
									{
										xtype: 'compositefield', hideLabel: true, height: 20,
										hidden: !window.parent.User.perms.read_comments,
										items: [
											{width: 20},
											{
												boxLabel: FR.T('Display users names.'), hideLabel: true,
												xtype: 'checkbox', value: '1', name: 'show_comments_names', id: 'show_comments_names'
											}
										]
									}
								]
							}
						]
					},
					{
						title: FR.T('File request'),
						id: 'file_request_tab',
						items: [
							{
								layout: 'form', hideLabels: true, defaults: {xtype: 'checkbox', value: '1'},
								items: [
									{
										boxLabel: FR.T('Enable file request.') +' ('+ FR.T('Allow visitors to upload files.')+')',
										name: 'allow_uploads', id: 'allow_uploads'
									},
									{
										boxLabel: FR.T('Allow visitors to see and download the existing files.'),
										name: 'allow_downloads', id: 'allow_downloads'
									}
								]
							}
						]
					},
					{
						title: FR.T('Download Terms'),
						items: [
							{
								layout: 'form', hideLabels: true,
								items: [
									{
										xtype: 'displayfield', value: FR.T('Force the visitors to accept your written terms before being able to download files.')
									},
									{xtype: 'htmleditor', hideLabel: true, id: 'dterms', enableFont: false, height:120, width: '99%'}
								]
							}
						]
					}
				],
				buttons: [
					{
						id: 'saveBtn', width: 'auto',
						text: FR.T('Save changes'), cls: 'fr-btn-default fr-btn-primary fr-btn-smaller', style:'margin-right:5px;',
						handler: function(){FR.SaveChanges();}
					},
					{
						cls: 'fr-btn-smaller', width: 'auto',
						text: FR.T('Cancel'),
						handler: function(){
							window.parent.FR.UI.popups.webLink.setHeight(300);
							Ext.getCmp('cardPanel').getLayout().setActiveItem(0);
						}
					}
				]
			}

		]
    });

	var linklabel = '&nbsp;';
	if (window.parent.FR.WebLinking.isFileRequest) {
		linklabel = 'Give this link to people you’re requesting files from';
	}

	FR.viewport = new Ext.Viewport({
		activeItem: 0, id: 'cardPanel', layout: 'card',
		items: [
			{
				layout: 'anchor',
				bodyStyle: 'padding-top:20px',
				items: [
					{
						xtype: 'component',
						autoEl: {html: '<div class="x-form-item" id="linkLabel">'+FR.T(linklabel)+':</div>'}
					},
					{
						xtype: 'textfield',
						id: 'LinkURLField', anchor:'100%',
						style: 'font-size:14px;', height:40,
						selectOnFocus: true, readOnly: true,
						listeners: {
							'focus': function() {
								this.getEl().dom.select();
							}
						}
					},
					{
						xtype: 'toolbar', style: 'margin-top:5px;',
						items: [
							{
								id: 'linkTypeOpt',
								text: FR.T('Link type'),
								menuAlign: 'l-r?',
								menu: {
									defaults: {
										xtype: 'menucheckitem',
										group: 'linktype', checkHandler: function(item, checked) {
											if (checked) {
												Ext.getCmp('linkTypeOpt').setText(item.text);
												Ext.getCmp('LinkURLField').setValue(FR.WebLinkInfo.url+'&mode='+item.value);
												Ext.getCmp('LinkURLField').getEl().highlight("dc143c", {attr: 'border-color', easing: 'easeIn', endColor: 'C1C1C1', duration: 1});
											}
										}
									},
									items: [
										{id: 'linkTypeRegular', text: FR.T('Grid view'), value: 'regular'},
										{text: FR.T('List view'), value: 'list'},
										{text: FR.T('Image gallery'), value: 'gallery'},
										{text: FR.T('Audio playlist'), value: 'playlist'},
										{text: FR.T('RSS feed'), value: 'rss'}
									]
								}
							},
							{
								id: 'shortLinkToggle',
								iconCls: 'fa fa-fw fa-scissors gray',
								text: FR.T('Shorten'),
								enableToggle: true,
								toggleHandler: function (item, pressed) {
									if (pressed) {
										if (!FR.WebLinkInfo.short_url) {
											FR.getShort();
										} else {
											Ext.getCmp('LinkURLField').setValue(FR.WebLinkInfo.short_url);
										}
									} else {
										Ext.getCmp('LinkURLField').setValue(FR.WebLinkInfo.url);
									}
									Ext.getCmp('LinkURLField').getEl().highlight("dc143c", {
										attr: 'border-color',
										easing: 'easeIn',
										endColor: 'C1C1C1',
										duration: 1
									});
								}
							},
							'->',
							{
								iconCls: 'fa fa-fw fa-clipboard gray',
								text: FR.T('Copy'),
								handler: function(){
									Ext.getCmp('LinkURLField').focus();
									try {
										if (document.execCommand('copy')) {
											window.parent.FR.UI.feedback(FR.T('The link has been copied to clipboard.'));
										}
									} catch (err) {}
								}
							},
							{
								id: 'openBtn',
								iconCls: 'fa fa-fw fa-external-link gray',
								text: FR.T('Open'),
								handler: function(){
									window.open(Ext.getCmp('LinkURLField').getValue());
								}
							}
						]
					}
				],
				tbar: [
					{
						text: FR.T('Advanced'),
						handler: function() {
							window.parent.FR.UI.popups.webLink.setHeight(370);
							Ext.getCmp('cardPanel').getLayout().setActiveItem(1);
						}
					},
					'->',
					{
						id: 'removeBtn',
						text: FR.T('Remove link'), iconCls: 'fa fa-fw fa-remove colorRed',
						handler: function() {
							var url = URLRoot+'/?module=weblinks&section=ajax&page=update&action=remove';
							FR.loadMask.show();
							Ext.Ajax.request({
								url: url, method: 'post',
								params: {
									path: window.parent.FR.WebLinking.path
								},
								success: function(req){
									FR.loadMask.hide();
									try {
										var rs = Ext.util.JSON.decode(req.responseText);
									} catch (er){return false;}
									if (rs.success) {
										window.parent.FR.utils.applyFileUpdates(window.parent.FR.WebLinking.path, {weblink: 0});
										window.parent.FR.UI.popups.webLink.hide();
									} else {
										new Ext.ux.prompt({text: rs.msg});
									}
								}
							});
						}
					}
				], buttonAlign: 'left',
				buttons: [
					{
						cls: 'fr-btn-default fr-btn-primary',
						text: FR.T('Done'),
						handler: function(){window.parent.FR.UI.popups.webLink.hide();}
					},
					{
						id: 'shareBtn', iconCls: 'fa fa-fw fa-share-alt gray', style: 'margin-left:10px;',
						text: FR.T('Share link'),
						menu: {
							items: [
								{
									text: FR.T('LinkedIn'), iconCls: 'fa fa-fw fa-linkedin',
									handler: function() {
										window.open(
											'http://www.linkedin.com/shareArticle?mini=true&url='+encodeURIComponent(Ext.getCmp('LinkURLField').getValue())+'&source='+encodeURIComponent(window.parent.Settings.title),
											Ext.isIE?'_blank':'linkedin-share-dialog',
											'width=570,height=430'
										);
									}
								},
								{
									text: FR.T('Twitter'), iconCls: 'fa fa-fw fa-twitter',
									handler: function() {
										window.open(
											'https://twitter.com/share?text='+encodeURIComponent(Ext.getCmp('LinkURLField').getValue()),
											Ext.isIE?'_blank':'twitter-share-dialog',
											'width=570,height=350'
										);
									}
								},
								{
									text: FR.T('Google+'), iconCls: 'fa fa-fw fa-google-plus',
									handler: function() {
										window.open(
											'https://plus.google.com/share?url='+encodeURIComponent(Ext.getCmp('LinkURLField').getValue()),
											Ext.isIE?'_blank':'google-share-dialog',
											'width=626,height=436'
										);
									}
								},
								{
									text: FR.T('Facebook'), iconCls: 'fa fa-fw fa-facebook',
									handler: function() {
										window.open(
											'https://www.facebook.com/sharer/sharer.php?u='+encodeURIComponent(Ext.getCmp('LinkURLField').getValue()),
											Ext.isIE?'_blank':'facebook-share-dialog',
											'width=626,height=436'
										);
									}
								},
								{
									text: FR.T('Gmail'), iconCls: 'fa fa-fw fa-envelope-o', hidden: !FR.userCanEmail,
									handler: function() {
										var url = 'http://mail.google.com/mail/?view=cm&fs=1&ui=1&body=' + encodeURIComponent(Ext.getCmp('LinkURLField').getValue());
										window.open(url, Ext.isIE?'_blank':'gmail-share-dialog','width=626,height=436');
									}
								},
								'-',
								{
									id: 'QRCBtn', hidden: !FR.showQR,
									text: FR.T('QR Code'), iconCls: 'fa fa-fw fa-qrcode',
									handler: function() {
										FR.showQRCode(Ext.getCmp('LinkURLField').getValue());
									}
								},
								{xtype: 'tbseparator', hidden: !FR.userCanEmail},
								{
									id: 'emailBtn', hidden: !FR.userCanEmail,
									text: FR.useClientEmail ? FR.T('E-mail program') : FR.T('E-mail'),  iconCls: 'fa fa-fw fa-envelope-o',
									handler: function() {
										FR.emailLink();
									}
								}
							]
						}
					}
				]
			},
			FR.UI.form
		]
	});
	FR.SaveChanges = function() {
		FR.loadMask.show();
		FR.UI.form.getForm().submit({
			clientValidation: true,
			url: URLRoot+'/?module=weblinks&section=ajax&page=update&action=edit',
			params: {
				path: window.parent.FR.WebLinking.path,
				download_terms: Ext.getCmp('dterms').getValue()
			},
			success: function(form, action) {
				FR.loadMask.hide();
				Ext.getCmp('cardPanel').getLayout().setActiveItem(0);
				window.parent.FR.UI.popups.webLink.setHeight(300);
				window.parent.FR.UI.feedback(action.result.msg);
			},
			failure: function(form, action) {
				FR.loadMask.hide();
				switch (action.failureType) {
					case Ext.form.Action.CLIENT_INVALID:
						new Ext.ux.prompt({text: FR.T("Please make the appropriate <br>changes to the highlighted fields.")});break;
					case Ext.form.Action.CONNECT_FAILURE:
						new Ext.ux.prompt({text: FR.T("Ajax communication failed.")});break;
					case Ext.form.Action.SERVER_INVALID:
						new Ext.ux.prompt({text: action.result.msg});
				}
			}
		});
	};
	FR.getInfo = function () {
		window.parent.Ext.get(window.parent.FR.UI.popups.webLink.getLayout().container.body.dom).mask(FR.T('Loading data...')).addClass('lightMask');
		var url = URLRoot+'/?module=weblinks&section=ajax&page=load'+(FR.email ? '&email=1' : '');
		var pars = 'path='+encodeURIComponent(window.parent.FR.WebLinking.path);
		if (window.parent.FR.WebLinking.isFileRequest) {
			pars += '&isFileRequest=1';
			window.parent.FR.WebLinking.isFileRequest = false;
		}
		Ext.Ajax.request({
			url: url, 
			method: 'post',
			params: pars,
			success: function(req){
				window.parent.Ext.get(window.parent.FR.UI.popups.webLink.getLayout().container.body.dom).unmask();
				try {
					var rs = Ext.util.JSON.decode(req.responseText);
				} catch (er){
					FR.UI.form.getForm().reset();
					Ext.getCmp('LinkURLField').setValue('');
					return false;
				}
				Ext.getCmp('allow_uploads').setVisible((FR.userCanUpload && rs.isdir));
				Ext.getCmp('linkTypeOpt').setVisible(rs.isdir);
				Ext.getCmp('download_limit').setVisible(!rs.isdir);
				Ext.getCmp('shortLinkToggle').setVisible((!FR.disableShortURL));

				if (rs.isdir) {
					FR.UI.form.tabPanel.unhideTabStripItem('file_request_tab');
				} else {
					FR.UI.form.tabPanel.hideTabStripItem('file_request_tab')
				}

				Ext.getCmp('shortLinkToggle').toggle((rs.linkInfo && rs.linkInfo.short_url), true);
				//FR.viewport.doLayout();
				if (rs.linkInfo) {
					FR.WebLinkInfo = rs.linkInfo;
					FR.WebLinkInfo.isdir = rs.isdir;
					Ext.getCmp('expiry').setValue(rs.linkInfo.expiry2);
					Ext.getCmp('download_limit').setValue(rs.linkInfo.download_limit);
					Ext.getCmp('password').setValue(rs.linkInfo.password);
					Ext.getCmp('LinkURLField').setValue(rs.linkInfo.short_url ? rs.linkInfo.short_url : rs.linkInfo.url);

					Ext.getCmp('dterms').setValue(rs.linkInfo.download_terms);
					if (rs.isdir) {
						if (rs.linkInfo.short_url) {
							Ext.getCmp('linkTypeShort').setChecked(true);
						} else {
							Ext.getCmp('linkTypeRegular').setChecked(true);
						}
					}
					Ext.getCmp('force_save').setValue((rs.linkInfo.force_save == '1'));
					Ext.getCmp('allow_uploads').setValue((rs.linkInfo.allow_uploads == '1'));
					Ext.getCmp('allow_downloads').setValue((rs.linkInfo.allow_downloads == '1'));
					Ext.getCmp('show_comments').setValue((rs.linkInfo.show_comments == '1'));
					Ext.getCmp('show_comments_names').setValue((rs.linkInfo.show_comments_names == '1'));
					Ext.getCmp('notify').setValue((rs.linkInfo.notify == '1'));
					Ext.getCmp('cardPanel').getLayout().setActiveItem(0);

					with (window.parent) {
						FR.utils.applyFileUpdates(FR.WebLinking.path, {weblink: 1});
					}
					if (rs.linkInfo.allow_uploads == true) {
						Ext.fly('linkLabel').update(FR.T('Give this link to people you’re requesting files from')+':');
					} else {
						Ext.fly('linkLabel').update('&nbsp;');
					}
				} else {
					if (rs.msg) {
						window.parent.FR.UI.feedback(rs.msg);
					}
					FR.UI.form.getForm().reset();
					Ext.getCmp('LinkURLField').setValue('');
					window.parent.FR.UI.popups.webLink.hide();
				}
			}
		});
	};
	FR.update = function() {
		if (FR.QRWindow) {FR.QRWindow.hide();}
		this.getInfo();
	};
	FR.getShort = function() {
		var url = Ext.getCmp('LinkURLField').getValue();
		Ext.getCmp('LinkURLField').setValue(FR.T('Loading...'));
		Ext.Ajax.request({
			url: URLRoot+'/?module=weblinks&section=ajax&page=get_short',
			method: 'post',
			params: {
				linkId: FR.WebLinkInfo.id,
				url: url
			},
			success: function(req){
				try {
					var rs = Ext.util.JSON.decode(req.responseText);
				} catch (er){return false;}
				if (rs.success) {
					FR.WebLinkInfo.short_url = rs.url;
					Ext.getCmp('LinkURLField').setValue(rs.url);
				} else {
					Ext.getCmp('LinkURLField').setValue(rs.error);
				}
			}
		});
	};
	FR.emailLink = function() {
		if (FR.useClientEmail) {
			document.location.href = 'mailto:?body='+Ext.getCmp('LinkURLField').getValue();
		} else {
			with (window.parent) {
				FR.UI.popups.webLink.hide();
				FR.contextMenuActions.email(FR.UI.contextMenu);
			}
		}
	};

	FR.showQRCode = function (URL) {
		if (!FR.QRWindow) {
			FR.QRWindow = new window.parent.Ext.Window({
				title: FR.T('QR Code'), closeAction: 'hide', draggable: false,
				layout: 'border', width: 270, height: 270, modal: true, hideBorders: true, resizable: false,
				items: [
					{
						region: 'north', bodyStyle: 'padding:3px;text-align:center;', height: 35,
						html: FR.T('Scan this QR code with your mobile device.')
					},
					{
						region: 'center',
						html: '<div style="text-align:center;"><div style="display:inline-block;background-image:url(images/loading.gif);background-position: center center;background-repeat:no-repeat;width:148px;height:148px;" id="qrwrap"><img src="'+URLRoot +'/?module=fileman&section=utils&page=qrcode&data='+encodeURIComponent(URL)+'" width="148" height="148" border="0" alt="" /></div></div>'
					}
				]
			});
		}
		FR.QRWindow.show();
	};
	window.parent.Ext.get(window.parent.FR.UI.popups.webLink.getLayout().container.body.dom).unmask();
	FR.loadMask = new Ext.LoadMask(Ext.getCmp('cardPanel').el, {msg: window.parent.FR.T('Loading...')});
	FR.getInfo();
});