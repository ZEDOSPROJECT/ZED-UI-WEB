FR.components.cartPanel = Ext.extend(Ext.ux.ListPanel, {
	initComponent: function() {
		this.store = FR.cartStore;
		FR.cartStore.carts.push(this);
		this.listViewCfg = {
			emptyText: '<div class="commentsEmpty">'+FR.T('Drag here the files and folders you wish to download')+'</div>',
			columns:[{
				tpl: new Ext.XTemplate(
					'<div class="fr-cart-item">{[this.getIconHTML(values)]} {filename}{[this.getDetails(values)]}</div>',
					{getIconHTML: this.getIconHTML},
					{getDetails: function(v) {
						var d = '';
						if (v.isFolder) {
							d = v.type;
						} else {
							d = v.nice_filesize;
						}
						return '<br><span class="silver">'+d+'</span>';
					}}
				)
			}],
			listeners: {
				'afterrender': function() {
					if (this.store.getCount() == 0){this.store.removeAll();}
				},
				'contextmenu': function(list, index) {
					this.store.removeAt(index);
				}, scope: this
			}
		};
		this.total = new Ext.Toolbar.TextItem({style:'color:gray;margin-left:10px;'});
		Ext.apply(this, {
			style:'padding-top:10px;',
			title: '<i class="fa fa-fw fa-2x fa-cart-arrow-down"></i>',
			locateOnSel: true,
			tbar: [
				{text: FR.T('Download all'), cls: 'fr-btn-default fr-btn-primary fr-btn-smaller', style: 'margin-left:5px', handler: function() {this.download();}, scope: this},
				this.total,
				'->',
				{text: FR.T('Clear list'), cls: 'fr-btn-smaller', style: 'margin-right:10px', handler: function() {this.clear();}, scope: this}
			]
		});
		FR.components.cartPanel.superclass.initComponent.apply(this, arguments);
		this.updateUI();
	},
	onRender: function() {
		FR.components.cartPanel.superclass.onRender.apply(this, arguments);
		new Ext.dd.DropTarget(this.el, {
			ddGroup: 'TreeDD',
			notifyDrop: Ext.createDelegate(function(dragsource, event, data) {
				if (!data.node) {
					if (FR.currentFolderPerms && !FR.currentFolderPerms.download) {return false;}
					Ext.each(data.selections, function(item) {this.addItem(item);}, this);
				}
			}, this),
			notifyEnter: function(source, e, data) {}
		});
	},
	addItem: function(item) {
		if (this.store.getById(item.data.path)) {return false;}
		this.store.add(new Ext.data.Record(item.data, item.data.path));
		this.updateTotal();
		return true;
	},
	clear: function() {
		this.store.suspendEvents();
		this.store.removeAll();
		this.listView.refresh();
		this.store.resumeEvents();
		this.updateUI();
	},
	updateUI: function() {
		var c = this.store.getCount();
		this.setTitleNumber(c);
		this.getTopToolbar().setVisible((c > 0));
		this.updateTotal();
	},
	download: function() {
		var paths = [];
		this.store.each(function(item) {
			paths.push(item.data.path);
		});
		FR.actions.download(paths, FR.UI.tree.currentSelectedNode.attributes.text);
	},
	updateTotal: function () {
		var t = 0; var hasFolder = false;
		this.store.each(function(item) {
			if (item.data.filesize) {t += parseInt(item.data.filesize);} else {hasFolder = true;}
		});
		if (t > 0) {
			t = Ext.util.Format.fileSize(t);
			if (hasFolder) {
				t = '&gt; ' + t;
			}
		}
		this.total.setText(t);
	}
});