FR.components.AudioPlayer = Ext.extend(Ext.Panel, {
	collapsed: true, height:138, loaded: false,
	initComponent: function() {
		Ext.apply(this, {
			listeners: {
				'collapse': function() {},
				'expand': function() {
					if (this.loaded) {
						this.gridSelChange();
						return true;
					}
					this.update('<iframe src="?module=custom_actions&action=audio_player" allowtransparency="true" frameborder="0"></iframe>');
				}
			}, scope: this
		});
		FR.components.infoPanel.superclass.initComponent.apply(this, arguments);
	},
	onLoad: function(player) {
		this.loaded = true;
		this.player = player;
		if (this.loadItem) {
			this.player.loadFile(this.loadItem);
		}
	},
	gridSelChange: function() {
		if (!this.collapsed && FR.currentSelectedFile && this.app) {
			this.app.loadFile(FR.currentSelectedFile);
		}
	},
	onRender: function() {
		FR.components.AudioPlayer.superclass.onRender.apply(this, arguments);
	},
	open: function(item) {
		if (item) {this.loadItem = item;}
		FR.UI.gridPanel.view.changeMode('music', true);
	},
	close: function() {
		var v = FR.UI.gridPanel.view;
		if (v.defaultViewMode == 'music') {
			v.changeMode('list', true);
		} else {
			v.changeMode(v.defaultViewMode, true);
		}
	}
});