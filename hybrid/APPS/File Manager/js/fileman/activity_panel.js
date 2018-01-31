FR.components.activityPanel = Ext.extend(Ext.ux.ListPanel, {
	initComponent: function() {
		this.store = new Ext.data.JsonStore({
			url: '?module=filelog&section=ajax&page=all',
			root: 'records', totalProperty: 'totalCount',
			fields: [
				'id',{name:'date_added', type:'date'},'time_ago','path','filename', 'filename_short','icon','thumb','action','details','n'
			],
			listeners: {
				'load': function() {this.updateStatus(0);},
				scope: this
			}
		});
		this.listViewCfg = {
			emptyText: '<div class="commentsEmpty">'+FR.T('No activity records found for this folder')+'</div>',
			columns: [{
				tpl: new Ext.XTemplate('<div class="eventItem">' +
					'{[this.getIconHTML(values)]}' +
					'<div class="txt">' +
					'<tpl if="n &gt; 0"><i class="fa fa-asterisk icon-red new"></i></tpl>' +
					'<div class="fn" title="{filename}">{filename_short}</div>' +
					'<div class="d">{details}</div>' +
					'<div><span class="t" title="{date_added}">{time_ago}</span></div>' +
					'</div>' +
					'</div>',
					{getIconHTML: this.getIconHTML}
				)
			}]
		};
		Ext.apply(this, {
			title: '<i class="fa fa-fw fa-bell-o" style="font-size:1.7em;padding-top:2px;"></i>',
			paginated: true,
			locateOnSel: true
		});
		FR.components.activityPanel.superclass.initComponent.apply(this, arguments);
	},
	load: function() {
		this.path = FR.currentPath;
		this.store.setBaseParam('path', this.path);
		this.store.load();
	},
	updateStatus: function(newCount, add) {
		var alert;
		if (add) {newCount += this.titleNumber;}
		if (add || newCount > this.titleNumber && this.titleNumber > 0) {
			if (FR.localSettings.get('sound-notif', Settings.sound_notification ? 'enabled' : 'disabled') == 'enabled') {
				FR.audioNotification();
				alert = true;
			}
		}
		this.setTitleNumber(newCount, alert);
	},
	onRender: function() {
		this.on('activate', function() {this.load();}, this);
		FR.components.activityPanel.superclass.onRender.apply(this, arguments);
	}
});