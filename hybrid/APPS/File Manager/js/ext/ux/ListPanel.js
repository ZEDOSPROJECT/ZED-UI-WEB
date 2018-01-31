Ext.ux.ListPanel = Ext.extend(Ext.Panel, {
	titleNumber: 0,
	initComponent: function() {
		var cfg = {
			layout: this.layout || 'fit',
			baseTitle: this.title
		};

		if (!this.items) {
			var listViewCfg = {
				store: this.store, loadingText: '<i class="fa fa-refresh fa-spin"></i> ' + FR.T('Loading...'),
				hideHeaders: true, singleSelect: true
			};
			this.listView = new Ext.list.ListView(Ext.apply(this.listViewCfg, listViewCfg));

			if (this.locateOnSel) {
				this.listView.on('selectionchange', function (list, sel) {
					if (!sel[0]) {
						return false;
					}
					var r = list.getRecord(sel[0]);
					FR.utils.locateItem(FR.utils.pathInfo(r.data.path).dirname, r.data.filename);
				}, this);
			}
			cfg.items = this.listView;
			if (this.paginated) {
				this.pagingbar = new Ext.PagingToolbar({
					store: this.store,
					pageSize: 20,
					beforePageText: FR.T('Page'),
					afterPageText: FR.T('of {0}'),
					firstText: FR.T('First Page'),
					lastText: FR.T('Last Page'),
					nextText: FR.T('Next Page'),
					prevText: FR.T('Previous Page'),
					refreshText: FR.T('Refresh')
				});
				cfg.bbar = this.pagingbar;
			}
		}
		Ext.apply(this, cfg);
		Ext.ux.ListPanel.superclass.initComponent.apply(this, arguments);
	},
	getIconHTML: function(v) {
		var url, cls = '';
		if (v.isFolder) {
			url = 'images/fico/folder-gray.png';
			cls = 'fr-folder';
		} else {
			url = 'images/fico/'+v.icon;
			if (v.thumb) {
				if (v.thumbURL) {
					url = v.thumbURL;
				} else {
					url = FR.UI.getThumbURL({path: v.path});
				}
			}
		}
		return '<div class="ico fr-thumbnail '+cls+'" style="background-image:url(\''+url+'\')"></div>';
	},
	setTitleNumber: function(n, alert) {
		this.titleNumber = n;
		var t = this.baseTitle;
		if (n > 0) {
			if (n > 99) {n = '99+';}
			t += '<div class="bubbleCount '+(alert?'alert':'')+'"><div>'+n+'</div></div>';
		}
		this.setTitle(t);
	}
});