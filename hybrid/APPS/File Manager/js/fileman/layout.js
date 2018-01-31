FR.initLayout = function() {
	Ext.get(document).on('dragover', function(e) {
		e = e.browserEvent;
		e.dataTransfer.dropEffect = 'none';
	}, false, {stopEvent: true});
	Ext.get(document).on('drop', function(e) {}, false, {stopEvent: true});

	Ext.getBody().on('mousemove', function(e){FR.UI.xy = e.getXY();});
	Ext.getBody().on('contextmenu', function(e, el) {if (!Ext.fly(el).hasClass('x-form-field')) {e.stopEvent();}});

	var bodyWidth = Ext.getBody().getWidth();
	var p = 20/100*bodyWidth;
	var treePanelWidth = 200;
	if (bodyWidth > 1024 || FR.isMobile) {treePanelWidth = 230;}

	FR.UI.gridPanel = new FR.components.gridPanel({
		id: 'FR-Grid-Panel',
		listeners: {
			'folderChange': function() {
				FR.UI.infoPanel.folderChange();
			}
		}
	});
	Ext.DomHelper.append(Ext.getBody(), {tag: 'div', id: 'explorer-shadow'});

	FR.UI.quotaIndicator = new Ext.Panel({
		region: 'south', height: 40, hidden: !(User.perms.space_quota_max > 0), bodyStyle: 'border-top: 1px solid #DFDFDF;text-align:center;padding:13px;font-size:11px;color:gray;',
		listeners: {'render': function(pb) {pb.mon(pb.getEl(), 'click', FR.UI.reloadStatusBar, this);}}
	});
	FR.UI.poweredBy = new Ext.Panel({
		region: 'south', height: 25, bodyStyle: 'padding:6px;font-size:11px;color:silver;',
		html: 'powered by <a href="http://www.filerun.com" target="_blank" style="color:silver">FileRun</a>'
	});

	FR.UI.NewBtnArea = {region: 'north', height: 70, bodyStyle: 'padding:5px 0px', items: FR.UI.actions.newItem};
	if (!User.perms.upload) {Ext.apply(FR.UI.NewBtnArea, {height: 10});}

	FR.UI.AudioPlayer = new FR.components.AudioPlayer({
		region: 'north', collapseMode: 'mini', animCollapse: false, id: 'FR-AudioPlayer', stateful: false
	});

	FR.UI.explorerPanel = new Ext.Panel({
		region: 'center', layout: 'border',
		bodyStyle: 'background-color:#EEEEEE',
		items: [
			{
				region: 'west', id: 'FR-Tree-Region', collapsed: FR.isMobile, stateful: false,
				width: treePanelWidth, layout: 'border', minWidth: 185, maxWidth: 600,
				items: [
					FR.UI.NewBtnArea,
					FR.UI.tree.panel,
					(Settings.free_mode ?  FR.UI.poweredBy : FR.UI.quotaIndicator)
				], split: true
			},
			{
				layout: 'border', region: 'center',
				items: [
					FR.UI.AudioPlayer,
					FR.UI.gridPanel
				]
			},
			{region: 'north', height:0, unstyled: true, html:''}
		]
	});

	var infoPanelState = FR.localSettings.get('infoPanelState', bodyWidth < 900 ? 'collapsed' : 'expanded');
	var infoPanelWidth = FR.localSettings.get('infoPanelWidth', bodyWidth < 1200 ? 280 : 350);

	FR.UI.infoPanel = new FR.components.infoPanel({
		region: 'east', width: infoPanelWidth, layout: 'fit', collapsed: (infoPanelState == 'collapsed'),
		split: true, id: 'FR-Info-Region', minWidth: 200, maxWidth: 350, collapseMode: 'mini',
		listeners: {
			'collapse': function() {
				FR.UI.actions.info.toggle(false, true);
			},
			'expand': function() {
				FR.UI.actions.info.toggle(true, true);
				this.gridSelChange();
			}
		}
	});
	if (FR.isMobile) {
		FR.UI.actions.searchField.setWidth(60);
		FR.UI.actions.logo.hide();
	}
	FR.UI.window = new Ext.Viewport({
		layout: 'fit',
		items:  {
			layout: 'fit',
			tbar: FR.UI.headerTBar,
			items: {
				layout: 'border', region: 'center',
				items: [
					FR.UI.explorerPanel,
					FR.UI.infoPanel
				]
			}
		}
	});
	if (FR.UI.actions.logo.getWidth()+680 >= bodyWidth) {
		FR.UI.actions.logo.hide();
	}
	if (User.perms.space_quota_max) {FR.UI.updateQuotaStatus();}
};