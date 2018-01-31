var FR = {UI: {translations:[]}};
Ext.onReady(function() {
	var win = new Ext.Window({
		layout: 'fit',
		constrain: true, closable: false,
		resizable: false, draggable: false,
		title: FR.T('Password Reset'),
		autoHeight: true, width:350,
		bodyStyle:'padding:25px 25px 35px 25px',
		items: [
			recoveryForm = new Ext.form.FormPanel({
		        baseCls: 'x-plain',
				hideLabels: true,
		        defaultType: 'textfield', autoHeight: true,
		        items: [
			        {
						id: 'usr',
			            name: 'email', width:'100%', height:'34px', cls: 'loginFormField',
				        autoCreate: {tag: 'input', type: 'text', placeholder: FR.T('E-mail address')}
			        }
		        ]
		    })
		],
		buttons: [{
			text: FR.T('Submit'), cls: 'fr-btn-default fr-btn-primary',
			handler: submitForm
		},{
	    	text: FR.T('Cancel'), cls: 'fr-btn-default', style: 'margin-left:15px',
			handler: function() {document.location.href = URLRoot+'/?page=login';}
	    }]
	});
	function submitForm() {
		recoveryForm.getForm().submit({
			url: submitURL, 
			failure: function(frm, act) {
				var msg = act.result ? act.result.msg : FR.T('A problem was encountered while trying to submit the form: ')+act.response.responseText;
				new Ext.ux.prompt({text: msg});
			},
			success: function(frm, act) {
				new Ext.ux.prompt({text: act.result.msg, callback: function() {document.location.href = URLRoot;}});
			}
		});
	}
	win.show().anchorTo(Ext.get('theBODY'), 'c-c');
	new Ext.KeyMap("usr", {
	    key: Ext.EventObject.ENTER,
	    fn: submitForm
	});
});