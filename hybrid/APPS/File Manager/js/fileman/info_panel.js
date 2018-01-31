FR.components.infoPanel = Ext.extend(Ext.Panel, {//if using TabPanel directly, there are layout problems
	baseCls: 'fr-info-panel', stateful: false,
	showTabComments: false,
	showTabActivity: false,
	showTabCart: false,
	initComponent: function() {
		var hideCart = (FR.isMobile || !User.perms.download);
		this.tabs = {
			detailsPanel: new FR.components.detailsPanel(Ext.apply({}, this.initialConfig.detailsPanelOptions)),
			activityPanel: new FR.components.activityPanel({
				path: '/ROOT/HOME',
				style:'padding:0px;'
			}),
			commentsPanel: new FR.components.commentsPanel({
				title: '<span class="fa-stack" style="font-size:1em"><i class="fa fa-comment-o fa-stack-2x"></i></span>'
			}),
			cartPanel: new FR.components.cartPanel({hidden: hideCart})
		};
		var tabs = [
			this.tabs.detailsPanel,
			this.tabs.activityPanel,
			this.tabs.commentsPanel,
			this.tabs.cartPanel
		];
		Ext.apply(this, {
			items: {
				xtype: 'tabpanel', ref: 'tabPanel', tabPosition: 'bottom', activeTab: 0, items: tabs
			}
		});
		FR.components.infoPanel.superclass.initComponent.apply(this, arguments);
	},
	customCollapse: function() {
		this.collapse();
		FR.localSettings.set('infoPanelState', 'collapsed');
	},
	customExpand: function() {
		this.expand();
		FR.localSettings.set('infoPanelState', 'expanded');
	},
	gridSelChange: function() {
		if (this.collapsed) {return false;}

		if (FR.UI.gridPanel.countSel == 1) {
			this.setItem(FR.currentSelectedFile);
		} else {
			this.item = null;
			this.showTabComments = false;
			this.showTabActivity = true;
			if (FR.currentSection == 'sharedFolder') {
				this.showTabActivity = Settings.filelog_for_shares;
			} else if (FR.currentSection != 'myfiles') {
				this.showTabActivity = false;
			}
			this.updateTabs();
			this.tabs.detailsPanel.gridSelChange();
		}
	},
	updateTabs: function() {
		if (!User.perms.read_comments && !User.perms.write_comments) {this.showTabComments = false;}
		if (!User.perms.file_history) {this.showTabActivity = false;}
		this.showTabCart = (!FR.isMobile && User.perms.download);

		var tp = this.tabPanel;

		if (this.showTabComments) {
			tp.unhideTabStripItem(2);
		} else {
			tp.hideTabStripItem(2);
			if (tp.getActiveTab() == this.tabs.commentsPanel) {
				tp.setActiveTab(0);
			}
		}
		if (this.showTabActivity) {
			tp.unhideTabStripItem(1);
		} else {
			tp.hideTabStripItem(1);
			if (tp.getActiveTab() == this.tabs.activityPanel) {
				tp.setActiveTab(0);
			}
		}

		if (this.showTabCart) {
			tp.unhideTabStripItem(3);
		} else {
			tp.hideTabStripItem(3);
		}
	},
	setItem: function(item) {
		if (this.collapsed) {return false;}
		if (item == this.item) {return false;}
		this.item = item;
		this.showTabComments = (FR.currentSection != 'trash');
		this.showTabActivity = false;
		this.updateTabs();
		this.tabs.detailsPanel.setItem(item);
		this.tabs.commentsPanel.setItem(item);
	},
	folderChange: function() {
		this.tabs.detailsPanel.metadataCache.clear();
		if (this.tabPanel.getActiveTab() == FR.UI.activityPanel) {
			this.tabs.activityPanel.load();
		}
	},
	showComments: function() {
		if (!this.isVisible()) {this.expand();}
		this.tabPanel.setActiveTab(2);
		return this;
	}
});
Ext.reg('FRInfoPanel', FR.components.infoPanel);