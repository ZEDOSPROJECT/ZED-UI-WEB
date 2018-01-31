FR.logSearch = {
	actionsList: []
};
Ext.each(FR.actions, function(act) {
	FR.logSearch.actionsList.push(new Ext.form.Checkbox({name:'actions[]', inputValue: act.k, boxLabel: act.t, checked: false}));
});
FR.logSearch.formPanel = new FR.components.editForm({
	title: FR.T('Search Activity Logs'),
	layout: 'form', bodyStyle: 'padding:10px;',
	defaults: {width: 250}, autoScroll: true,
	items: [
		{
			xtype: 'textfield',
			fieldLabel: FR.T('Keyword'),
			name: 'search',
			value: ''
		},{
			xtype: 'datefield',
			fieldLabel: FR.T('Date start'),
			name: 'date_start', value: ''
		},
		{
			xtype: 'datefield',
			fieldLabel: FR.T('Date end'),
			name: 'date_end', value: ''
		},
		{
			xtype: 'compositefield',
			fieldLabel: FR.T('Action'),
			items: [{
				height: 150, width: 250, autoScroll: true, bodyStyle: 'padding:5px;border:1px solid silver',
				items: FR.logSearch.actionsList
			}]
		},
		{
			xtype: 'compositefield',
			items: [
				{
					xtype: 'panel',
					bbar: [
						{
							text: FR.T('Select all'), cls:'fr-btn-smaller', handler: function() {Ext.each(FR.logSearch.actionsList, function(c) {c.setValue(true);});}
						},
						{
							text: FR.T('Clear all'), cls:'fr-btn-smaller', handler: function() {Ext.each(FR.logSearch.actionsList, function(c) {c.setValue(false);});}
						}
					]
				}

			]
		},
		{
			xtype: 'userslistfield',
			name: 'users', only: 'users',
			value: '', showSelf: true,
			fieldLabel: FR.T('Users'),
			tcfg: {height: 150, width: 250}
		}
	],
	tbar: [
		{
			text: FR.T('Search'),
			cls: 'fr-btn-primary',
			iconCls: 'fa fa-fw fa-search color-white',
			handler: function() {
				var editForm = this.ownerCt.ownerCt;
				var store = FR.grid.panel.getStore();
				store.baseParams = Ext.apply({limit: FR.system.gridItemsPerPage}, editForm.form.getValues());
				Ext.getCmp('gridTab').show();
				store.load();
			}
		},
		{
			text: FR.T('Export'),
			cls: 'fr-btn-primary',
			iconCls: 'fa fa-fw fa-download color-white', style: 'margin-left:5px',
			hidden: (!FR.user.isAdmin && !FR.user.isIndep),
			handler: function () {
				this.ownerCt.ownerCt.bwrap.mask(FR.T('Please wait...'));
				Ext.Ajax.request({
					url: FR.URLRoot+'/?module=logs&section=cpanel&page=list',
					params: Ext.apply(this.ownerCt.ownerCt.form.getValues(), {'export': 1}),
					callback: function() {this.ownerCt.ownerCt.bwrap.unmask();},
					success: function(req) {
						try {
							var rs = Ext.util.JSON.decode(req.responseText);
						} catch (er){return false;}
						if (rs) {
							FR.feedback(rs.msg);
						} else {FR.feedback(req.responseText);}
					},
					failure: function(f) {FR.feedback(f.responseText);},
					scope: this
				});
			}
		}
	]
});
Ext.getCmp('gridTabPanel').add(FR.logSearch.formPanel);
FR.logSearch.formPanel.show();