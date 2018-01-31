
Ext.override(Ext.form.Field, {
	afterRender: function(){
		if (this.helpText) {
			var c = document.createElement('div');
			c.className='infoButton';
			var b = new Ext.Button({
				style:'padding:4px',
				iconCls: 'fa fa-info-circle silver',
				renderTo: c,
				handler: function(){new Ext.ux.prompt({text: this.helpText});},
				scope: this
			});
			this.getErrorCt().appendChild(c);
        }
		Ext.form.Field.superclass.afterRender.call(this);
		this.initValue();
		this.initEvents();
	}
});