FR = {};

Ext.onReady(function() {
	Ext.override(Ext.grid.GridView, {
		templates: {
			cell: new Ext.Template(
				'<td class="x-grid3-col x-grid3-cell x-grid3-td-{id} {css}" style="{style}" tabIndex="0" {cellAttr}>',
				'<div class="x-grid3-cell-inner x-grid3-col-{id}" {attr}>{value}</div>',
				"</td>"
			)
		}
	});
	var store = new Ext.data.Store({
		proxy: new Ext.data.HttpProxy({url: URLRoot+'/?module=filelog&section=ajax&page=index&action=load'}),
		reader: new Ext.data.JsonReader({
			root: 'records',
			totalProperty: 'totalCount',
			id: 'id',
			fields: ['id', {name: 'date_added', type:'date', dateFormat:'Y-m-d h:i:s'}, 'uid', 'username', 'fullName', 'action', 'details']
		})
    });
	store.on('load', function(store, records, opts) {
		if (store.reader.jsonData.msg) {
			window.parent.FR.UI.feedback(store.reader.jsonData.msg);
		}
	});
    var cm = new Ext.grid.ColumnModel({
		defaults: {hideable: false, menuDisabled: true},
		defaultSortable: true,
		columns: [
		{
			header: FR.T('Date'), dataIndex: 'date_added',
			width: 110, renderer: function(value) {return Ext.util.Format.date(value, 'd M y, H:i');}
		},{
			header: FR.T('User'), dataIndex: 'fullName',
			width: 130
		},{
			header: FR.T('Action'), dataIndex: 'action',
			width: 130
		},{
			id: 'details', header: FR.T('Details'), dataIndex: 'details',
			width: 250, sortable: false
		}]
	});
    var grid = new Ext.grid.GridPanel({
		selModel: new Ext.grid.RowSelectionModel({singleSelect:true}),
		store: store, cm: cm,
		loadMask: true,
	    bbar: pt = new Ext.PagingToolbar({
			pageSize: 100,
			store: store,
			displayInfo: true,
			displayMsg: '<span style="color:gray">'+FR.T('Displaying records {0} - {1} of {2}')+'</span>',
			emptyMsg: '<span style="color:gray">'+FR.T('No records to display')+'</span>',
			beforePageText: FR.T('Page'),
			afterPageText: FR.T('of {0}'),
			firstText: FR.T('First Page'),
			lastText: FR.T('Last Page'),
			nextText: FR.T('Next Page'),
			prevText: FR.T('Previous Page'),
			refreshText: FR.T('Refresh'),
		    items: [
			    '-',
			    {
			        text: FR.T('Clear log'), hidden: (!window.parent.User.isAdmin && !window.parent.User.isIndep),
				    handler: function () {
					    new Ext.ux.prompt({
						    text: FR.T('Are you sure you want to clear the file\'s activity log?'),
						    confirmHandler: function() {
							    window.parent.FR.actions.clearActivityLog(FR.path+'/'+FR.filename);
						    }
					    });
				    }
		        }
		    ]
		})
	});
	var viewport = new Ext.Viewport({
		layout: 'fit',
		border: false, hideBorders: true,
		items: grid
	});
	store.baseParams = {path: encodeURIComponent(FR.path), filename: encodeURIComponent(FR.filename)};
	store.load({params: {start: 0, limit: 100}});
});