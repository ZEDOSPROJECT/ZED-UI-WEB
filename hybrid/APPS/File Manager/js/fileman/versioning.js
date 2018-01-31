Ext.onReady(function() {
	Ext.getBody().on('contextmenu', function(e) {e.stopEvent();});
	var colModel = new Ext.grid.ColumnModel([
		{header: FR.T("Version"), width: 40, dataIndex: 'version'},
		{header: FR.T("Date"), width: 120, dataIndex: 'date'},
		{header: FR.T("Size"), width: 70, dataIndex: 'size'},
		{header: FR.T("Modified by"), width:105, dataIndex: 'user'}
	]);
	var grid = new Ext.grid.GridPanel({
	    ds: new Ext.data.JsonStore({
		    fields: ['version', 'date', 'size', 'user']
	    }),
	    cm: colModel,
		enableHdMenu: false,
		border: false,
	 	selModel: new Ext.grid.RowSelectionModel({singleSelect:true})
	});

	grid.on('rowcontextmenu', function(grid, rowIndex, e) {versioningOnContextMenu(grid, rowIndex, e);});
	if (Ext.isMac) {
		grid.on('rowclick', function(grid, rowIndex, e) {versioningOnContextMenu(grid, rowIndex, e);});
	}
	gridContextMenu = new Ext.menu.Menu({
	    id: 'contextmenu',
	    items: []
	});
	if (window.parent.User.perms.download) {
		gridContextMenu.add(new Ext.menu.Item({text: FR.T('Download'), handler: function() {
			var selection = grid.getSelectionModel().getSelections();
			document.location.href = URLRoot+'/?module=fileman_myfiles&section=ajax&page=download&paths[]='+encodeURIComponent(FR.currentPath+'/'+FR.currentFilename)+'&version='+selection[0].data.version;
		},
			iconCls: 'fa-download'
		}));
	}
	if (!window.parent.User.perms.read_only) {
		gridContextMenu.add(new Ext.menu.Item({text: FR.T('Restore'), handler: function() {
				var selection = grid.getSelectionModel().getSelections();
				var url = URLRoot+'/?module=versioning&section=ajax&page=actions&action=restore&version='+selection[0].data.version;
				var pars = 'path='+encodeURIComponent(FR.currentPath)+'&filename='+encodeURIComponent(FR.currentFilename);
				Ext.Ajax.request({
					url: url,
					method: 'post',
					params: pars,
					success: function(req){
						try {
							var rs = Ext.util.JSON.decode(req.responseText);
						} catch (er){return false;}
						if (rs.rs) {}
						new window.parent.Ext.ux.prompt({text: rs.msg, callback: function() {
							window.parent.FR.utils.reloadGrid();
							window.parent.FR.UI.popups[FR.popupId].close();
						}});
					}
				});
			},
			iconCls: 'fa-thumbs-o-up'
		}));
		gridContextMenu.add(new Ext.menu.Item({text: FR.T('Delete'), handler: function() {
				var selection = grid.getSelectionModel().getSelections();
				var url = URLRoot+'/?module=versioning&section=ajax&page=actions&action=delete&version='+selection[0].data.version;
				var pars = 'path='+encodeURIComponent(FR.currentPath)+'&filename='+encodeURIComponent(FR.currentFilename);
				Ext.Ajax.request({
					url: url,
					method: 'post',
					params: pars,
					success: function(req){
						try {
							var rs = Ext.util.JSON.decode(req.responseText);
						} catch (er){return false;}
						if (rs.rs) {
							grid.getStore().remove(grid.getSelectionModel().getSelected());
						}
						new window.parent.Ext.ux.prompt({text: rs.msg});
					}
				});
			},
			iconCls: 'fa-times colorRed'
		}));
	}
	new Ext.Viewport({layout: 'fit', hideBorders: true, items: grid});
	grid.store.loadData(FR.gridData);
});
versioningOnContextMenu = function(grid, rowIndex, e) {
	grid.selModel.selectRow(rowIndex);
	gridContextMenu.showAt(e.getXY());
	e.stopEvent();
	return false;
}