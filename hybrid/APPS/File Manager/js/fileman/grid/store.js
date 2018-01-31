FR.components.gridStore = Ext.extend(Ext.data.Store, {
	loadParams: {}, initialSort: false,
	constructor: function(config) {
		var cols = [
			{name: 'uniqid', mapping: 'id'},
			{name: 'isFolder', mapping: 'dir'},
			{name: 'filename', mapping: 'n', sortFunction: function(r1, r2) {
				return compareAlphaNum(r1.get('filename').toLowerCase(), r2.get('filename').toLowerCase());
			}},
			{name: 'trash_deleted_from', mapping: 'tdf'},
			{name: 'filesize', mapping: 's', sortType: Ext.data.SortTypes.asInt},
			{name: 'nice_filesize', mapping: 'ns'},
			{name: 'icon', mapping: 'i'},
			{name: 'type', mapping: 't'},
			{name: 'thumb', mapping: 'th'},
			{name: 'filetype', mapping: 'ft'},
			{name: 'meta_filetype', mapping: 'mf'},
			{name: 'modified', mapping: 'm', type:'date', dateFormat:'m/d/Y h:i'},
			{name: 'modifiedHuman', mapping: 'mh'},
			{name: 'created', mapping: 'c', type:'date', dateFormat:'m/d/Y h:i'},
			{name: 'taken', mapping: 'dt', type: 'int'},
			{name: 'createdHuman', mapping: 'ch'},
			{name: 'isNew', mapping: 'new'},
			{name: 'hasWebLink', mapping: 'hW'},
			{name: 'share', mapping: 'sh'},
			{name: 'notInfo', mapping: 'fn'},
			{name: 'comments', mapping: 'cc'},
			{name: 'label', mapping: 'l'},
			{name: 'tags', mapping: 'tg'},
			{name: 'rating', mapping: 'r'},
			{name: 'star', mapping: 'st'},
			{name: 'path', mapping: 'p', convert: function(v, r) {return v || FR.currentPath+'/'+r.n;}},
			{name: 'lockInfo', mapping: 'lI'},
			{name: 'version', mapping: 'v'},
			{name: 'random', convert: function(v, r) {return Math.floor(Math.random() * 1000);}}
		];
		Ext.each(FR.UI.grid.customColumns, function(col) {
			cols.push({name: col.dataIndex});
		}, this);
		config = Ext.apply({
			proxy: new Ext.data.HttpProxy({url: FR.myfilesBaseURL + '&page=grid'}),
			reader: new Ext.data.JsonReader({root: 'files', totalProperty: 'count', id: 'id'}, cols)
		}, config);
		FR.components.gridStore.superclass.constructor.call(this, config);
	},
	loadByPath: function(path) {
		var url = FR.baseURL;
		if (path == '/ROOT/TRASH') {
			url += '/?module=trash&section=ajax&page=grid';
		} else if (path == '/ROOT/STARRED') {
			url += '/?module=stars&page=grid';
		} else if (path.indexOf('/ROOT/Photos') == 0) {
			url += '/?module=photos&page=grid';
		} else if (path.indexOf('/ROOT/Music') == 0) {
			url += '/?module=music';
		} else if (path == '/ROOT/WLINKED') {
			url += '/?module=weblinks&section=ajax&page=grid';
		} else if (path == '/ROOT/SEARCH') {
			url += '/?module=search&section=ajax&page=grid';
		} else {
			url = FR.myfilesBaseURL + '&page=grid';
		}
		this.proxy.conn.url = url;
		if (FR.pushState) {
			if (typeof window.history.pushState !== 'undefined') {
				window.history.pushState({path: path}, '', '#' + encodeURI(path.substring(5)));
			}
		}
		FR.pushState = true;
		this.loadParams.path = encodeURIComponent(path);
		this.load({params: this.loadParams});
		FR.currentPath = path;
	},
	applySort : function() {
		var sortInfo = this.sortInfo;
		if (!sortInfo) {
			sortInfo  = {field: 'filename', direction: 'ASC'};
		}
		if (this.initialSort) {
			sortInfo = this.initialSort;
			this.initialSort = false;
		}
		if (sortInfo == 'server') {
			this.sortInfo = this.multiSortInfo = false;
		} else {
			this.multiSortInfo = {
				sorters: [
					{field: 'isFolder', direction: 'DESC'},
					{field: sortInfo.field, direction: sortInfo.direction}
				],
				direction: sortInfo.direction
			};
			this.hasMultiSort = true;
		}
		FR.components.gridStore.superclass.applySort.apply(this, arguments);
	}
});