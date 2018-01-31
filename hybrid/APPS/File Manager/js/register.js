var FR = {UI: {translations:[]}};
Ext.onReady(function() {
	FR.win = new Ext.Window({
		title: Settings.title+' - '+FR.T('User Registration'),
		closable: false, resizable: false, draggable: false,
		width:405, autoHeight: true, layout: 'fit',
		bodyStyle:'padding:10px 23px 20px 35px',
		items: [
			FR.registrationForm = new Ext.form.FormPanel({
				labelAlign: 'right',
				defaultType: 'textfield', autoHeight: true,
				defaults: {labelStyle: 'white-space:nowrap', width: '100%'},
				items: [
					{fieldLabel: FR.T('Username'), name: 'username'},
					{fieldLabel: FR.T('E-mail address'), name: 'email'},
					{
						fieldLabel: FR.T('Password'),
						name: 'password',
						inputType: generatePass ? 'hidden' : 'password',
						xtype: generatePass ? 'hidden': 'textfield'
					},{
						fieldLabel: FR.T('Retype password'),
						name: 'repassword',
						inputType: generatePass ? 'hidden' : 'password',
						xtype: generatePass ? 'hidden': 'textfield'
					},
					{
						xtype : 'compositefield',
						fieldLabel: FR.T('Name'),
						items : [
							{
								flex : 1,
								xtype: 'textfield',
								name: 'first_name'
							},
							{
								flex : 1,
								xtype: 'textfield',
								name: 'last_name'
							}
						]
					},
					{fieldLabel: FR.T('Phone'), name: 'phone'},
					{fieldLabel: FR.T('Company'), name: 'company'},
					{fieldLabel: FR.T('Web site address'), name: 'website'},
					{
						fieldLabel: FR.T('Comment'),
						name: 'description',
						xtype: 'textarea'
					},
					{
						hidden: !Settings.enableCaptcha,
						hideLabel: true,
						xtype: 'field',
						height: 80,
						autoCreate: {tag: 'div', id: 'recaptcha', cls: 'g-recaptcha', style: 'margin-left:13px'}
					}
				]
			})
		],
		buttons: [
		{
			text: FR.T('Submit'),
			cls: 'fr-btn-default fr-btn-primary',
			handler: function () {
				var button = this;
				button.disable();
				FR.win.el.mask(FR.T('Loading...'));
				FR.registrationForm.getForm().submit({
					url:signUpURL, 
					failure: function(frm, act) {
						if (Settings.enableCaptcha) {grecaptcha.reset();}
						button.enable();
						FR.win.el.unmask();
						var msg = act.result ? act.result.error : FR.T('A problem was encountered while trying to submit the form: ')+act.response.statusText;
						new Ext.ux.prompt({text: msg});
					},
					success: function(frm, act) {
						button.enable();
						FR.win.el.unmask();
						new Ext.ux.prompt({text: act.result.message, callback: function() {document.location.href = URLRoot;}});
					}
				});
			}
		},{
			text: FR.T('Cancel'), cls: 'fr-btn-default', style: 'margin-left:15px',
			handler: function() {document.location.href = URLRoot+'/?page=login';}
		}]
	});
	FR.win.show();
	FR.win.anchorTo(Ext.get('theBODY'), 'c-c');
});

var onloadGRCCallback = function() {
	grecaptcha.render('recaptcha', {
		'sitekey': Settings.recaptcha_site_key
	});
};