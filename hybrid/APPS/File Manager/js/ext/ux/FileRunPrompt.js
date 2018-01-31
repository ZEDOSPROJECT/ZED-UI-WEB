Ext.ux.prompt = Ext.extend(Ext.Window, {
	modal: true, closable: false, resizable: false, confirmBtnLabel: false, defaultValue: null, allowEmpty: false, placeHolder: null,
	width: 350,
	initComponent: function() {
		var items = [];
		this.btnLabels = {
			confirm: this.confirmBtnLabel || FR.T('Ok'),
			cancel: FR.T('Cancel')
		};
		if (this.text) {
			items.push({xtype: 'displayfield', value: this.text});
		}
		var anchorTop;
		if (this.defaultValue !== null || this.placeHolder !== null) {
			this.input = new Ext.form.TextField({
				width: '100%',
				value: this.defaultValue, allowBlank: this.allowEmpty
			});
			this.selectField = new Ext.util.DelayedTask(function(){
				this.input.focus(true);
				if (this.defaultValue) {
					var dotpos = this.defaultValue.lastIndexOf(".");
					if (dotpos !== -1) {
						this.input.selectText(0, dotpos);
					} else {
						this.input.selectText();
					}
				}
			}, this);
			items.push(this.input);
			if (FR.isMobile) {anchorTop = true;}
		} else {
			if (!this.callback && this.confirmHandler) {
				this.btnLabels = {
					confirm: FR.T('Yes'),
					cancel: FR.T('No')
				};
			}
		}
		var buttons = [];
		buttons.push({
			text: this.btnLabels.confirm, cls: 'fr-btn-default fr-btn-primary',
			handler: function() {
				if (this.input && (!this.input.isValid() && !this.allowEmpty)) {
					return false;
				}
				this.doAction(this.confirmHandler ? this.confirmHandler : this.callback);
			}, scope: this
		});
		if (this.confirmHandler || this.cancelHandler) {
			buttons.push({text: this.btnLabels.cancel,  style:'margin-left:10px;', handler: function() {this.doAction(this.cancelHandler);}, scope: this});
		}
		Ext.apply(this, {
			items: {
				layout: 'form', bodyStyle: 'padding-top:10px;padding-bottom:20px', border: false, defaults: {hideLabel: true},
				items: items
			},
			buttons: buttons,
			keys: [
				{
					'key': Ext.EventObject.ENTER,
					'fn': function() {
						if (this.input && (!this.input.isValid() && !this.allowEmpty)) {
							return false;
						}
						this.doAction(this.confirmHandler);
					},'scope': this
				},
				{
					'key': Ext.EventObject.ESC,
					'fn': function() {
						this.doAction(this.cancelHandler);
					},'scope': this
				}
			],
			listeners: {
				'afterrender': function() {
					if (this.placeHolder !== null) {
						this.input.el.set({'placeholder': this.placeHolder});
					}
				},
				'show': function() {if (this.input) {this.selectField.delay(200);}}
			}
		});
		Ext.ux.prompt.superclass.initComponent.apply(this, arguments);

		this.show();
		if (anchorTop) {
			this.alignTo(Ext.getBody(), 't-t', [0,10]);
		}
	},
	doAction: function(handler) {
		if (handler) {
			var scope = this.scope || this;
			var params = [];
			if (this.input) {
				params = [this.input.getValue(), this.defaultValue, this];
			}
			Ext.createDelegate(handler, scope, params)();
		}
		this.close();
	},
	close: function() {
		Ext.ux.prompt.superclass.close.apply(this, arguments);
	}
});