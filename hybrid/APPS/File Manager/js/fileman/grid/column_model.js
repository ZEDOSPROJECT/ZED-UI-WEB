FR.components.gridColumnModel = Ext.extend(Ext.grid.ColumnModel, {
	constructor: function(config) {
		var columns = [
			{
				id: 'icon', header: false, renderer: function(v, m, r) {return r.data.iconHTML;},
				width: 58, align:'right', resizable: false, hideable: false, menuDisabled: true
			},{
				id: 'filename',
				header: FR.T("Name"), renderer: function(v, m, r) {return r.data.filenameHTML;},
				dataIndex: 'filename', width:220
			},{
				id:'icons', align: 'center', css: 'color:silver;',
				header: '<span style="color:silver">'+FR.T('Icons')+'</span>', renderer: function(v, m, r) {return r.data.icons;},
				width:43, resizable: false, hideable: false, menuDisabled: true
			},{
				id: 'nice_filesize', dataIndex: 'nice_filesize',
				header: FR.T("Size"), align: 'right', width: 65
			},{
				id: 'type', dataIndex: 'type', hidden: true,
				header: FR.T("Type")
			},{
				id: 'meta_filetype', dataIndex: 'meta_filetype', custom: 'filetype', hidden: true,
				header: FR.T("Meta Type")
			},{
				id: 'modified', dataIndex: 'modified', hidden: FR.isMobile,
				header: FR.T("Modified"),
				renderer: function(v, col, row) {
					if (Settings.grid_short_date) {
						return row.data.modifiedHuman;
					}
					return Ext.util.Format.date(v, FR.T('Date Format: Files'));
				}
			},{
				id: 'created', dataIndex: 'created', hidden:true,
				header: FR.T("Created"),
				renderer: function(v, col, row) {
					if (Settings.grid_short_date) {
						return row.data.createdHuman;
					}
					return Ext.util.Format.date(v, FR.T('Date Format: Files'));
				}
			},{
				id: 'trash_deleted_from', dataIndex: 'trash_deleted_from', hidden: true,
				header: FR.T("Deleted from"), width: 180
			},{
				id: 'path', dataIndex: 'path', hidden: true,
				header: FR.T("Location"), width: 180,
				renderer: FR.utils.humanFilePath
			},{
				dataIndex: 'comments', hidden:true,
				header: FR.T("Comments count"), width: 50,
				renderer: function(val) {return val>0?val:'';}
			},{
				dataIndex: 'tags', hidden:true, custom: 'tags',
				header: FR.T("Tags")
			},{
				dataIndex: 'rating', hidden:true, custom: 'rating', width: 90,
				header: FR.T("Rating"), renderer: function(v) {
					var s = '<ul class="rating-star">';
					s += '<li class="fa fa-fw fa-star "></li>'.repeat(v);
					s += '</ul>';
					return s;
				}
			},{
				dataIndex: 'label', hidden:true,
				header: FR.T("Label"), width: 50,
				renderer: function(v) {
					if (v) {
						var s = v.split('|');
						return '<span class="FRLabel" style="background-color:'+s[1]+'">'+s[0]+'</span>';
					}
				}
			},{
				dataIndex: 'star', hidden:true,
				header: FR.T("Star"), width: 50,
				renderer: this.renderers.YesNo
			},{
				dataIndex: 'hasWebLink', hidden:true,
				header: FR.T("Web Link"), width: 50,
				renderer: this.renderers.YesNo
			},{
				dataIndex: 'lockInfo', hidden:true,
				header: FR.T("Locked by"), width: 50,
				renderer: function(v) {return v ? v : '';}
			},{
				dataIndex: 'version', hidden:true,
				header: FR.T("Version"), width: 40,
				renderer: function(v) {return (v && v != '1') ? v : '';}
			},{
				dataIndex: 'isNew', hidden:true,
				header: FR.T("Is new"), width: 40,
				renderer: this.renderers.YesNo
			},
			{id: 'random', dataIndex: 'random', hidden: true, hideable: false, menuDisabled: true}
		];
		Ext.each(FR.UI.grid.customColumns, function(col) {
			if (col.custom == FR.specialMetaFields.title) {
				col.renderer = function(v, col, row) {
					if (!v) {return row.data.filename;}
					return v;
				};
			}
			columns.push(col);
		}, this);
		config = Ext.apply({
			defaults: {sortable: true, width: 120},
			columns: columns
		}, config);
		FR.components.gridColumnModel.superclass.constructor.call(this, config);
	},
	getMetaCols: function() {
		var cols = [];
		this.getColumnsBy(function(col, indx) {
			if (col.custom && !col.hidden) {
				cols.push(col.custom);
				return true;
			}
		}, this);
		return cols;
	},
	renderers: {
		YesNo: function(v) {return v ? FR.T('Yes') : '';}
	}
});