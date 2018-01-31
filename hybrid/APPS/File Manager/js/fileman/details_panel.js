FR.components.detailsPanel = Ext.extend(Ext.Panel, {
	metadataCache: new Ext.util.MixedCollection(),
	title: '<i class="fa fa-fw fa-2x fa-info" style="font-size:2.1em"></i>',
	cls: 'fr-details-panel',
	autoScroll: true,
	html: '',
	hidePreview: false,
	lastPath: false,
	initComponent: function() {
		this.metaLoaderTask = new Ext.util.DelayedTask(function(){this.loadMeta()}, this);
		this.folderIcon = '<i class="fa fa-folder" style="font-size: 35px;color:#8F8F8F"></i>';

		Ext.apply(this, {
			listeners: {
				'afterrender': function() {
					this.previewBox = this.body.createChild({
						tag: 'div', cls: 'fr-details-previewbox',
						children: [
							{tag: 'div', cls: 'title'},
							{tag: 'div', style: 'clear:both'}
						]
					});
					var title = this.previewBox.first();
					this.iconEl = title.createChild({tag: 'div', cls: 'icon'});
					this.fileNameEl = title.createChild({tag: 'div', cls: 'filename'});
					this.thumbContainer = this.previewBox.createChild({tag: 'div', cls: 'thumb'});
					if (this.hidePreview) {this.thumbContainer.setStyle('display', 'none');}
					this.thumbContainer.enableDisplayMode('block');
					this.thumbContainer.on('click', function() {
						if (this.item.filetype == 'img') {
							FR.UI.imagePreview.init(this.item);
						} else {
							FR.utils.showPreview(this.item);
						}
					}, this);

					this.infoEl = this.body.createChild({tag: 'div', cls: 'fr-details-info'});
					this.infoEl.enableDisplayMode('block');

					this.readMeEl = this.body.createChild({tag: 'div', cls: 'fr-details-readme'});
					this.readMeEl.enableDisplayMode('block');

					this.metadataEl = this.body.createChild({tag: 'div'});
					this.metadataEl.enableDisplayMode('block');

					this.body.first().on('contextmenu', function() {
						FR.UI.gridPanel.showContextMenu();
					});
				},
				'activate': function(p){
					p.active = true;
					//this.gridSelChange();
				},
				'deactivate': function(p) {p.active = false;},
				'resize': function() {if (this.active && this.item) {this.updateQuickView();}},
				scope: this
			}
		});
		FR.components.detailsPanel.superclass.initComponent.apply(this, arguments);
	},
	onRender: function() {
		FR.components.detailsPanel.superclass.onRender.apply(this, arguments);
	},
	setReadMe: function(v) {this.readMe = v;},
	gridSelChange: function() {
		if (!this.active) {return false;}
		if (!FR.UI.tree.currentSelectedNode) {return false;}
		this.countSel = FR.UI.gridPanel.countSel;
		this.countAll = FR.UI.gridPanel.store.getTotalCount();
		this.item = FR.currentSelectedFile;
		this.updateQuickView();
	},
	setItem: function(item) {
		if (!this.active) {return false;}
		this.item = item;
		this.countSel = 1;
		this.updateQuickView();
	},
	reset: function() {
		this.metaLoaderTask.cancel();
		this.readMeEl.hide();
		this.metadataEl.hide().update('');
		this.thumbContainer.hide().update('');
		this.infoEl.hide().update('');
	},
	updateHeaderTitle: function() {
		var title;
		if (this.countSel == 1) {
			title = this.item.data.isFolder ? this.item.data.filename : FR.utils.dimExt(this.item.data.filename);
		} else {
			title = FR.UI.tree.currentSelectedNode.text;
		}
		this.fileNameEl.update(title);
	},
	updateHeaderIcon: function() {
		var icon;
		if (this.countSel == 1) {
			if (this.item.data.isFolder) {
				icon = this.folderIcon;
			} else {
				var iconSrc = 'images/fico/' + this.item.data.icon;
				icon = '<img src="' + iconSrc + '" height="30" align="left" style="margin-right:5px;" />';
			}
		} else {
			var iconCls = FR.UI.tree.currentSelectedNode.attributes.iconCls || 'fa-folder';
			icon = '<i class="fa ' + iconCls + '" style="font-size:35px;color:#8F8F8F"></i>';
		}
		this.iconEl.update(icon);
	},
	showStatus: function() {
		var size = '';
		if (this.countAll == 0) {
			var statusText = FR.T('There are no files in this folder.');
		} else {
			var sel;
			if (this.countSel == 0) {
				sel = FR.UI.gridPanel.store.data.items;
				if (this.countAll == 1) {
					statusText = FR.T('One item');
				} else if (this.countAll > 0) {
					statusText = FR.T('%1 items').replace('%1', this.countAll);
				}
			} else {
				sel = FR.UI.gridPanel.selModel.getSelections();
				statusText = FR.T('%1 items selected').replace('%1', this.countSel);
			}
			size = 0;
			Ext.each(sel, function (item) {
				if (item.data.isFolder) {
					size = false;
					return false;
				}
				size += parseInt(item.data.filesize);
			});
			if (size > 0) {
				size = Ext.util.Format.fileSize(size);
			} else {
				size = '';
			}
		}
		var info = '<div class="status">' +
			'<div class="text">'+statusText+'</div>' +
			'<div class="size">'+size+'</div>' +
			'<div style="clear:both"></div><div>';
		this.infoEl.update(info).show();
	},
	showPreview: function() {
		if (this.hidePreview) {return false;}
		if (FR.UI.gridPanel.view.viewMode != 'photos' && this.item.data.filetype != 'mp3') {
			if (this.item.data.thumb) {
				var imageSrc;
				if (this.item.data.thumbImg) {
					imageSrc = this.item.data.thumbImg.dom.src;
				} else {
					imageSrc = FR.UI.getThumbURL(this.item.data);
				}
				this.thumbImg = Ext.get(Ext.DomHelper.createDom({tag: 'img', cls: 'detailsThumb'}));
				this.thumbImg.on('load', function () {
					if (this.thumbImg.dom) {
						var naturalWidth = this.thumbImg.dom.width;
						var maxWidth = this.getWidth();
						var w = maxWidth - 45;
						if (naturalWidth < w) {
							w = naturalWidth;
						}
						this.thumbImg.set({width: w, height: 'auto'});
						this.thumbContainer.appendChild(this.thumbImg);
						this.thumbContainer.show();
					}
				}, this);
				this.thumbImg.set({src: imageSrc});
				this.previewBox.show();
			}
		}
	},
	showReadMe: function() {
		if (!this.readMe) {return false;}
		if (FR.currentPath != this.lastPath) {
			var url =  FR.baseURL+'/?section=utils&page=readme&path='+encodeURIComponent(FR.currentPath);
			this.readMeEl.update('<iframe frameborder="0" width="100%" src="'+url+'"></iframe>');
			this.lastPath = FR.currentPath;
		}
		this.readMeEl.show();
	},
	onReadMeLoad: function(h) {
		this.readMeEl.first().setHeight(h+80);
	},
	updateQuickView: function() {
		if (!this.active) {return false;}
		this.reset();
		this.updateHeaderIcon();
		this.updateHeaderTitle();
		if (this.countSel == 1) {
			this.showPreview();
			this.showDetails();
			return true;
		}
		this.thumbContainer.hide();
		this.showStatus();
		this.showReadMe();
	},
	showDetails: function() {
		var info = '';
		if (!FR.currentSectionIsVirtual && ['starred', 'search', 'webLinked', 'media'].indexOf(FR.currentSection) !== -1) {
			var pInfo = FR.utils.pathInfo(this.item.data.path);
			info += '<tr>' +
			'<td class="fieldName">'+FR.T('Location')+'</td>' +
			'<td class="fieldValue"><a href="javascript:;" onclick="FR.utils.locateItem(\''+pInfo.dirname+'\', \''+pInfo.basename+'\')">'+FR.utils.humanFilePath(pInfo.dirname)+'</a></td>' +
			'</tr>';
		}

		if (FR.currentSection == 'trash') {
			info += '<tr>' +
			'<td class="fieldName">'+FR.T('Deleted from')+'</td>' +
			'<td class="fieldValue">'+this.item.data.trash_deleted_from+'</td>' +
			'</tr>';
		}

		if (!this.item.data.isFolder) {
			info += '<tr>' +
			'<td class="fieldName">' + FR.T('Size') + '</td>' +
			'<td class="fieldValue" title="' + Ext.util.Format.number(this.item.data.filesize, '0,000') + ' ' + FR.T('bytes') + '">' + this.item.data.nice_filesize + '</td>' +
			'</tr>';
		}

		if (this.item.data.type) {
			info += '<tr>' +
				'<td class="fieldName">' + FR.T('Type') + '</td>' +
				'<td class="fieldValue">' + this.item.data.type + '</td>' +
				'</tr>';
		}

		if (!this.item.data.isFolder) {
			if ((this.item.data.modified && this.item.data.created) && (this.item.data.modified.getTime() != this.item.data.created.getTime())) {
				info += '<tr>' +
				'<td class="fieldName">' + FR.T('Modified') + '</td>' +
				'<td class="fieldValue" ext:qtip="'+this.item.data.modified+'">' +
					(Settings.grid_short_date ? this.item.data.modifiedHuman : Ext.util.Format.date(this.item.data.modified, FR.T('Date Format: Files'))) +
				'</td>' +
				'</tr>';
			}
		}

		if (this.item.data.created) {
			info += '<tr>' +
			'<td class="fieldName">' + FR.T('Created') + '</td>' +
			'<td class="fieldValue" ext:qtip="'+this.item.data.created+'">' +
				(Settings.grid_short_date ? this.item.data.createdHuman : Ext.util.Format.date(this.item.data.created, FR.T('Date Format: Files'))) +
			'</td>' +
			'</tr>';
		}

		info = '<table cellspacing="1" width="100%">' + info + '</table>';
		this.infoEl.update(info).show();

		if (!FR.currentSectionIsVirtual) {
			if (this.metadataCache.containsKey(this.item.data.path)) {
				this.metadataEl.update(this.metadataCache.get(this.item.data.path)).show();
			} else {
				this.metaLoaderTask.delay(500);
			}
		}
	},
	loadMeta: function() {
		if (!User.perms.metadata) {return false;}
		if (!this.item) {return false;}
		this.metadataEl.update('<span style="color:silver;font-size:9px;margin:5px;">'+FR.T('Loading metadata...')+'</span>').show();
		Ext.Ajax.request({
			url: FR.baseURL+'/?module=metadata&page=quick_view',
			params: {path: this.item.data.path},
			callback: function(opts, succ, req) {
				if (!req.responseText || req.responseText.length == 0) {return false;}
				if (!this.item) {return false;}
				var path = this.item.data.path;
				if (!this.metadataCache.containsKey(path)) {
					this.metadataCache.add(path, req.responseText);
				} else {
					this.metadataCache.replace(path, req.responseText);
				}
				this.metadataEl.update(req.responseText);
			}, scope: this
		});
	},
	editMeta: function() {
		FR.actions.openMetadata({title: this.item.data.filename, path: this.item.data.path});
	}
});
Ext.reg('FRDetailsPanel', FR.components.detailsPanel);