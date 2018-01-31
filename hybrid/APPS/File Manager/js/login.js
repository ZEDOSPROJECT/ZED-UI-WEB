var FR = {
	windowHeight: 190,
	windowWidth: 300,
	logoAreaWidth: 193,
	initForm: function() {
		if (Ext.isAndroid) {
			Settings.ui_login_logo = false;
			Settings.ui_login_text = false;
		}
		if (Settings.ui_login_logo.length || Settings.ui_login_text.length) {
			this.windowWidth += this.logoAreaWidth;
			this.windowHeight += 30;
		}
		if (Settings.passwordRecoveryEnabled || Settings.signUpEnabled) {
			this.windowHeight += 21;
		}

		this.formPanel = new Ext.form.FormPanel({
			labelAlign: 'right', ref: '../frm',
			defaultType: 'textfield', autoHeight: true, hideLabels: true, bodyStyle: 'padding:23px',
			cls: 'loginForm', standardSubmit: true, url: URLRoot+'/?module=fileman&page=login&action=login',
			listeners: {
				'render': function() {
					this.getForm().el.set({
						'action': URLRoot+'/?module=fileman&page=login&action=login',
						'target': 'submitIframe',
						'onSubmit': 'FR.submitForm();return false;'
					});
				}
			},
			items: [
				{
					ref: 'usrField', name: 'username', value: prefilledUsername,
					width: '100%', tabIndex: 1, height:'34px', cls: 'loginFormField',
					autoCreate: {tag: 'input', type: 'text', placeholder: FR.T('Username'), autocomplete: 'on', required: 'true'}
				},
				{
					xtype: 'textfield',
					id: 'pass', tabIndex: 2, value: prefilledPassword, width: '100%',
					name: 'password', inputType: 'password', height:'34px', cls: 'loginFormField',
					autoCreate: {tag: 'input', type: 'password', placeholder: FR.T('Password'), autocomplete: 'on'}
				},
				{xtype: 'component', html: '<input type="submit" hidefocus="true" tabindex="-1" style="position:absolute;z-index:-100;width:1px;height:1px;top:-100px;" />'},
				{
					xtype: 'textfield', ref: 'otp', hidden: true,
					id: 'otp', value: '', width: '100%',
					name: 'otp', height:'34px', cls: 'loginFormField',
					autoCreate: {tag: 'input', type: 'text', placeholder: FR.T('Verification code')}
				},
				{xtype: 'hidden', name: 'two_step_secret', ref: 'two_step_secret', value: ''},
				{xtype: 'hidden', name: 'language', ref: 'language', value: ''},
				{
					xtype: 'panel', layout: {type: 'hbox'},
					items: [
						{xtype: 'displayfield', value: '<a href="'+signUpURL+'">'+FR.T('Create account')+'</a>', style:'padding-top:5px;text-align:right', hidden: !Settings.signUpEnabled},

						{xtype: 'displayfield', flex:1,  value: '<a href="'+URLRoot+'/?module=fileman&page=password_recovery">'+FR.T('Forgot password?')+'</a>', style:'padding-top:5px;text-align:right', hidden: !Settings.passwordRecoveryEnabled}
					]
				}
			]
		});
		this.iframe = Ext.DomHelper.append(document.body, {
			tag: 'iframe', name: 'submitIframe', id:'submitIframe',
			frameBorder: 0, width: 0, height: 0,
			css: 'display:none;visibility:hidden;height:0px;',
			src: 'about:blank'
		});
		Ext.get('submitIframe').on('load', function() {
			this.win.body.unmask();
			var frameDoc;
			if (this.iframe.contentDocument) {
				if (this.iframe.contentDocument.document) {
					frameDoc = this.iframe.contentDocument.document;
				} else {
					frameDoc = this.iframe.contentDocument;
				}
			} else {
				if (this.iframe.contentWindow.document) {
					frameDoc = this.iframe.contentWindow.document;
				}
			}
			var responseText = frameDoc.body.innerHTML;
			if (responseText.length == 0) {
				return false;
			}
			try {
				var rs = Ext.util.JSON.decode(responseText);
			} catch (er) {
				if (confirm(FR.T('Unexpected server reply. Press "OK" to display it.'))) {
					document.write(responseText);
				}
				return false;
			}
			if (rs.success) {
				FR.win.body.mask(FR.T('Loading...'));
				if (rs.redirect_url) {
					document.location.href = decodeURIComponent(rs.redirect_url);
				} else {
					document.location.href = URLRoot+(startFolder ? '/?folder='+encodeURIComponent(startFolder): '/');
				}
			} else if (rs.success == false) {
				if (rs.twoStepSecret) {
					FR.win.frm.two_step_secret.setValue(rs.twoStepSecret);
					FR.showQR(rs.twoStepSecret, rs.keyURI);
				} else {
					if (rs.ask_otp) {
						FR.showOTPField();
					}
					new Ext.ux.prompt({text: rs.error, callback: function() {FR.win.frm.usrField.focus(true);}});
				}
			}
		}, this);


		var lang = [];
		Ext.each(Languages, function(l) {
			var t = l[1], v = l[0];
			lang.push({
				text: t, handler: function () {
					FR.win.body.mask(FR.T('Changing language...'));
					document.location.href = URLRoot+'/?language='+encodeURIComponent(v);
				}
			});
		});

		this.win = new Ext.Window({
			title: FR.T(Settings.ui_login_title), cls:'login'+(Settings.ui_bg?' transparent':''),
			layout: 'border', width: this.windowWidth, height: this.windowHeight, buttonAlign: 'left',
			closable: false, resizable: false, draggable: false, hideBorders: true, border:false,
			listeners: {'show': function(){
				this.frm.usrField.focus(false, 20);
				if (Settings.ui_login_logo.length) {
					Ext.get('loginLogoImage').show();
					Ext.fly('loginLogoImage').setStyle('background-image', 'url("'+Settings.ui_login_logo+'")');
					this.testImg = Ext.get(Ext.DomHelper.createDom({tag: 'img', src: '', border: 0, alt: ''}));
					this.testImg.addListener('load', function () {
						if (this.dom) {
							var maxSize = {width: 170, height: 170};
							var naturalWidth = this.dom.width;
							var naturalHeight = this.dom.height;
							if (naturalWidth < maxSize.width && naturalHeight < maxSize.height) {
								Ext.fly('loginLogoImage').setStyle('background-size', 'auto');
							}
						}
					});
					this.testImg.set({src: Settings.ui_login_logo});
					if (Settings.ui_login_text.length) {
						new Ext.Window({
							cls: 'loginTextFooter'+(Settings.ui_bg?' transparent':false), unstyled: !Settings.ui_bg,
							html: Settings.ui_login_text, autoHeight: true,
							closable: false, resizable: false, draggable: false, width: FR.windowWidth
						}).show().anchorTo(this.getEl(), 'tr-br', [0,10]);
					}
				} else {
					if (Settings.ui_login_text.length) {
						Ext.get('loginText').show();
					}
				}
			}},
			items: [
				{
					region: 'west', width: this.logoAreaWidth, id: 'logoArea', hideBorders:true,
					html:'<div id="loginLogoImage"></div><div id="loginText">'+Settings.ui_login_text+'</div>',
					hidden: (!Settings.ui_login_logo.length && !Settings.ui_login_text.length)
				},
				{
					region: 'center', hideBorders: true,
					items: [this.formPanel]
				}
			],
			buttons: [
				{
					text: selectedLang,
					cls: 'fr-btn-smaller lang-select', width: 'auto',
					hidden: !Settings.ui_display_language_menu,
					menu: lang
				},
				new Ext.Toolbar.Fill(),
				{
					text: FR.T('Sign in'),  tabIndex: 4, cls: 'fr-btn-default fr-btn-primary', style: 'font-size:13px',
					handler: function(){FR.submitForm();}
				},
				{
					text: FR.T('SSO'),  tabIndex: 4, cls: 'fr-btn-default', style: 'font-size:13px;margin-left:5px',
					handler: function(){document.location.href = URLRoot+'/sso';}, hidden: !Settings.ssoEnabled, id: 'ssoBtn'
				}
			]
		});
		this.win.show();
		if (Settings.ssoEnabled) {
			new Ext.ToolTip({
				target: 'ssoBtn', baseCls: 'headerTbar-btn-tooltip', style: 'text-align:center;padding:10px;white-space:nowrap',
				anchor: 'top', showDelay: 10, dismissDelay: 0,
				html: FR.T('Single Sign On')
			}).show();
		}
		this.win.anchorTo(Ext.get('theBODY'), 'c-c');
		if (Settings.ssoOnly) {
			document.location.href = URLRoot+'/sso';
		}
	},
	submitForm: function() {
		this.win.body.mask(FR.T('Signing in...'));
		FR.formPanel.getForm().submit();
	},
	showOTPField: function() {
		FR.win.frm.otp.show();
		FR.win.frm.doLayout();
		FR.win.setHeight(FR.windowHeight+50);
		FR.win.center();
		FR.win.frm.otp.focus();
	},
	showQR: function(secret, keyURI) {
		if (Ext.isAndroid) {
			new Ext.ux.prompt({
				text: FR.T('Open the <a href="%1" target="_blank">Google Authenticator</a> app and add a new account with the following key:').replace('%1', 'https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2&hl=en'),
				defaultValue: secret,
				callback: function () {
					FR.showOTPField();
				}
			});
			return false;
		}
		FR.QRWindow = new Ext.Window({
			title: FR.T('2-step verification: add account'), closable: false, resizable: false,
			layout: 'border', width: 400, height: 400, modal: true, hideBorders: true,
			items: [
				{
					region: 'north', bodyStyle: 'padding:10px;text-align:center;font-size:14px;', height: 50,
					html: FR.T('Scan this barcode with the <a href="%1" target="_blank">Google Authenticator</a> app on your mobile device to add your account.').replace('%1', 'https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2&hl=en')
				},
				{
					region: 'center',
					html:
					'<div style="text-align:center;">' +
					'<div style="" class="loginQRCodeWrap">' +
					'<img title="'+secret+'" src="'+URLRoot +'/?module=fileman&section=utils&page=qrcode&encoded=1&size=6&data='+encodeURIComponent(keyURI)+'" width="222" height="222" />' +
					'</div>' +
					'</div>'
				}
			],
			buttonAlign: 'center',
			buttons: [{
				cls: 'fr-btn-default fr-btn-primary',
				text: FR.T('Done'), handler: function(){
					FR.QRWindow.close();
					FR.showOTPField();
				}
			}]
		});
		FR.QRWindow.show();
	}
};
Ext.onReady(function() {
	Ext.fly('loadMsg').fadeOut();
	if (!Ext.isAndroid) {
		FR.initForm();
	}
	if (message) {
		new Ext.ux.prompt({text: message, callback: function() {FR.win.frm.usrField.focus(true);}});
	}
	if (Ext.isAndroid) {
		if (window.localStorage && !window.localStorage.getItem('androidPrompt')) {
			window.localStorage.setItem('androidPrompt', true);
			new Ext.ux.prompt({
				text: FR.T('There is an Android app that you can use to access your files more comfortably. Would you like to try that instead?'),
				confirmHandler: function () {
					document.location.href = Settings.androidAppURL;
					FR.initForm();
				},
				cancelHandler: function () {
					FR.initForm();
				}
			});
		} else {
			FR.initForm();
		}
	}
});