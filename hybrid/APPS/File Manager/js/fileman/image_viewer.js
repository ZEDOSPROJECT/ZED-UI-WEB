FR.components.ImageViewer = Ext.extend(Ext.Window, {
	unstyled: true, closable: false, layout: 'border', UI: {}, maximized: true, monitorResize: true, direction: false,
	cls: 'image-viewer', highDPIRatio: 2, image: false, zoomed: false, restoreInfoPanel: false, lastIndex: false,
	files: new Ext.util.MixedCollection(), cached: new Ext.util.MixedCollection(),
	initComponent: function() {
		this.UI.icon = new Ext.Toolbar.Item({cls: 'fr-prv-tbar-icon', hidden: FR.isMobile});
		this.UI.filename = new Ext.Toolbar.TextItem({cls: 'fr-prv-tbar-filename'});
		this.UI.status = new Ext.Toolbar.TextItem({cls: 'fr-prv-tbar-status', hidden: FR.isMobile});
		this.UI.zoomSlider = new Ext.Slider({
			width: 110, minValue: 0, maxValue: 100, value: 0, hidden: true, cls: 'fr-prv-tbar-slider',
			listeners: {
				'change': function (s, v) {
					this.applyZoom.cancel();
					this.applyZoom.delay(50, false, this, [v]);
				},
				scope: this
			}
		});
		if (FR.isMobile) {
			this.UI.zoomToggle = new Ext.Button({
				iconCls: 'fa fa-fw fa-search-plus fa-2x',
				handler: function () {window.open(this.getFullResURL());}, scope: this
			});
		} else {
			this.UI.zoomToggle = new Ext.Button({
				iconCls: 'fa fa-fw fa-search-plus fa-2x',
				enableToggle: true,
				toggleHandler: function (b, pressed) {
					if (pressed) {
						this.initZoom();
					} else {
						this.cancelZoom();
					}
				}, scope: this, listeners: {'afterrender': FR.UI.tooltip(FR.T('Zoom'))},
				menu: [this.UI.zoomSlider]
			});
		}
		this.detailsBtn = new Ext.Button({
			iconCls: 'fa fa-fw fa-info-circle fa-2x',
			toggleHandler: this.toggleDetails, scope: this, enableToggle: true,
			listeners: {'afterrender': FR.UI.tooltip(FR.T('Info'))}
		});
		this.downloadBtn = new Ext.Button({
			iconCls: 'fa fa-fw fa-cart-arrow-down fa-2x',
			handler: this.download, scope: this, hidden: (!this.canDownload() || FR.isMobile),
			listeners: {'afterrender': FR.UI.tooltip(FR.T('Add to download cart'))}
		});
		this.moreBtn = new Ext.Button({
			iconCls: 'fa fa-fw fa-ellipsis-v fa-2x',
			listeners: {'afterrender': FR.UI.tooltip(FR.T('More actions'))},
			handler: function() {FR.UI.gridPanel.showContextMenu();return false;}
		});

		var bbar = false;
		var tbarItems;

		if (FR.isMobile) {
			tbarItems = [
				this.UI.icon,
				this.UI.filename,
				'->',
				{
					iconCls: 'fa fa-fw fa-close fa-2x',
					handler: function(){this.hide();}, scope: this,
					listeners: {'afterrender': FR.UI.tooltip(FR.T('Close'))}
				}
			];
			bbar = new Ext.Toolbar({
				autoCreate: {cls: 'fr-prv-tbar'},
				items: [
					this.detailsBtn,
					'->',
					this.UI.zoomSlider,
					this.UI.zoomToggle,
					this.downloadBtn,
					this.moreBtn
				]
			});
		} else {
			tbarItems = [
				{
					iconCls: 'fa fa-fw fa-close fa-2x',
					handler: function(){this.hide();}, scope: this,
					listeners: {'afterrender': FR.UI.tooltip(FR.T('Close'))}
				},
				this.UI.icon,
				this.UI.filename,
				this.UI.status,
				'->',
				this.UI.zoomSlider,
				this.UI.zoomToggle,
				this.downloadBtn,
				this.moreBtn,
				this.detailsBtn,
				'<div style="width:15px"></div>'
			];
		}

		var tbar = new Ext.Toolbar({
			autoCreate: {cls: 'fr-prv-tbar'},
			items: tbarItems
		});

		Ext.apply(this, {
			items: [
				{
					region: 'center', unstyled: true,
					tbar: tbar, bbar: bbar, ref: 'canvas', bodyCssClass: 'canvas'
				},
				{
					region: 'east', ref: 'infoPanel', id: 'ImageViewerInfoPanel', layout: 'fit',
					xtype: 'FRInfoPanel', bodyStyle: 'background-color:white;',
					title: false, detailsPanelOptions: {hidePreview: true},
					width: (FR.isMobile ? 290 : 350), collapseMode: 'mini', collapsed: true,
					listeners: {
						'expand': function() {
							this.infoPanel.setItem(this.file);
						}, scope: this
					}
				}
			],
			listeners: {
				'afterrender': function() {
					this.spinner = this.canvas.body.createChild({
						tag: 'img', src: 'images/loading.svg', cls: 'spinner'
					});
					this.canvas.bwrap.set({tabindex: 0});
					this.initNav();
					this.setupKeys();
					if (FR.isMobile) {this.el.addClass('mobile');}
				},
				'show': function() {
					this.canvas.focus();
					this.nav.enable();
					if (!FR.UI.infoPanel.collapsed) {
						FR.UI.infoPanel.collapse();
						this.restoreInfoPanel = true;
					}
				},
				'hide': function() {
					if (this.imageWrap) {
						this.imageWrap.remove(true);
						this.imageWrap = false;
					}
					this.files.clear();
					this.cached.clear();
					this.nav.disable();
					if (this.restoreInfoPanel) {
						FR.UI.infoPanel.expand();
					}
				},
				'resize': function(p) {
					this.updateMaxDimensions();
					this.cached.clear();
				}
			}, scope: this
		});
		FR.components.infoPanel.superclass.initComponent.apply(this, arguments);
	},
	canDownload: function() {
		return (User.perms.download && FR.currentSection != 'trash');
	},
	initNav: function() {
		this.UI.navLeftWrap = Ext.DomHelper.append(this.canvas.body.dom, {tag: 'div', cls: 'fr-prv-nav-left-wrap'}, true);
		this.UI.navLeft = Ext.DomHelper.append(this.UI.navLeftWrap, {tag: 'div', cls: 'fr-prv-nav-btn', html: '<i class="fa fa-fw fa-chevron-left"></i>'}, true);
		this.UI.navLeft.on('click', this.previous, this);
		this.UI.navRightWrap = Ext.DomHelper.append(this.canvas.body.dom, {tag: 'div', cls: 'fr-prv-nav-right-wrap'}, true);
		this.UI.navRight = Ext.DomHelper.append(this.UI.navRightWrap, {tag: 'div', cls: 'fr-prv-nav-btn', html: '<i class="fa fa-fw fa-chevron-right"></i>'}, true);
		this.UI.navRight.on('click', this.next, this);
		if (!FR.isMobile) {
			new Ext.ToolTip({
				target: this.UI.navRight, showDelay: 250,
				html: FR.T('Next'), anchor: 'left',
				baseCls: 'headerTbar-btn-tooltip'
			});
			new Ext.ToolTip({
				target: this.UI.navLeft, showDelay: 250,
				html: FR.T('Previous'), anchor: 'right',
				baseCls: 'headerTbar-btn-tooltip'
			});
		}
		this.canvas.body.on('contextmenu', function() {
			FR.UI.gridPanel.showContextMenu();return false;
		});
	},
	setupKeys: function() {
		var keys = {
			'left' : function() {this.previous();},
			'right' : function(){this.next();},
			'space' : function(){this.next();},
			'up': function() {this.previous();},
			'down': function() {this.next();},
			'esc': function() {this.hide();},
			scope : this
		};
		if (this.canDownload()) {
			keys['enter'] =  function(){this.download();};
		}
		this.nav = new Ext.KeyNav(this.canvas.bwrap, keys);
	},
	toggleDetails: function(btn, toggled) {
		if (toggled) {
			this.showDetails();
		} else {
			this.hideDetails();
		}
	},
	showDetails: function() {
		this.infoPanel.expand();
		this.UI.icon.hide();
		this.UI.filename.hide();
	},
	hideDetails: function () {
		this.infoPanel.collapse();
		this.UI.icon.show();
		this.UI.filename.show();
	},
	initZoom: function() {
		this.loadHiRes.cancel();
		if (this.zoomed) {return false;}
		this.spinner.show();
		FR.UI.preloadImage(this.getFullResURL(), function(success, img, src) {
			if (!this.imageWrap) {return false;}
			this.spinner.hide();
			if (!success) {return false;}

			this.UI.zoomSlider.show();
			this.zoomed = true;

			var w = this.imageWrap.getWidth();
			var h = this.imageWrap.getHeight();
			this.imgDrag = new Ext.dd.DD(this.imageWrap.dom, false, {moveOnly: true, scroll: false});
			this.imageWrap.setStyle('background-size', '');
			this.imageWrap.removeClass('centered').addClass('dragging').setHeight(h).setWidth(w).center();

			var nHeight = img.dom.naturalHeight;
			var nWidth = img.dom.naturalWidth;

			var min = Math.min(w, h);
			var max = Math.max(nHeight, nWidth);

			var current = min+((max-min)/4);
			this.UI.zoomSlider.setMinValue(min);
			this.UI.zoomSlider.setMaxValue(max);
			this.UI.zoomSlider.setValue(current);

			this.imageWrap.setStyle('background-image', 'url(\''+src+'\')');
		}, this);
	},
	applyZoom: new Ext.util.DelayedTask(function(v) {
		if (!this.imageWrap) {return false;}
		this.imageWrap.setHeight(v).setWidth(v).center();
	}),
	cancelZoom: function(skipRestore) {
		if (!this.zoomed) {return false;}
		if (!skipRestore) {
			this.imgDrag.lock();
			this.imageWrap.removeClass('dragging').addClass('centered')
				.setStyle('width', null)
				.setStyle('height', null)
				.setStyle('top', null)
				.setStyle('left', null);
		}
		this.UI.zoomSlider.suspendEvents();
		this.UI.zoomSlider.setValue(0);
		this.UI.zoomSlider.resumeEvents();
		this.UI.zoomSlider.hide();
		this.UI.zoomToggle.toggle(false, true);
		this.zoomed = false;
	},
	preloadFollowingHiRes: new Ext.util.DelayedTask(function() {
		var followingIndex = this.getFollowingIndex();
		if (followingIndex === false) {return false;}
		var followingFile = this.files.itemAt(followingIndex);
		if (!followingFile) {return false;}
		var ext = FR.utils.getFileExtension(followingFile.data.filename);
		if ((ext == 'pdf' && !FR.isMobile) || followingFile.data.filetype == 'wvideo') {return false;}
		var src = this.getHighResURL(followingFile);
		if (!this.isCached(src)) {
			if (this.direction == 'right') {
				this.UI.navRight.setStyle('color', 'orange');
			} else {
				this.UI.navLeft.setStyle('color', 'orange');
			}
			FR.UI.preloadImage(src, function (success, loaded, src) {
				if (success) {
					if (this.direction == 'right') {
						this.UI.navRight.setStyle('color', '');
					} else {
						this.UI.navLeft.setStyle('color', '');
					}
					this.cached.add(src, {img: loaded});
				}
			}, this);
		}
	}),
	loadHiRes: new Ext.util.DelayedTask(function(src) {
		var ext = FR.utils.getFileExtension(this.file.data.filename);
		if ((ext == 'pdf' && !FR.isMobile) || this.file.data.filetype == 'wvideo') {
			this.spinner.show();
			this.imageWrap.show();
			var action = FR.baseURL + '/?module=fileman&section=utils&page=file_preview';
			var frameName = 'preview-frame-'+Ext.id();
			this.imageWrap.setStyle('background-image', 'none');
			var frame = this.imageWrap.createChild({
				tag: 'iframe', name: frameName, style: 'width:100%;height:100%;border:0'
			});
			FR.UI.postToTarget({src: action, post: [{name: 'path', value: this.file.data.path}]}, frameName);
			this.spinner.hide();
			return true;
		}
		if (this.file.data.thumbLoaded) {
			var thumbSize = Math.max(Settings.thumbnail_size, 400) * 2;
			if ((this.maxH < thumbSize) && (this.maxH < thumbSize)) {
				/* pointless to load high res version on small screens */
				return true;
			}
		}
		this.spinner.show();
		this.changed = false;
		this.preloading = FR.UI.preloadImage(src, function(success, loaded, src) {
			if (this.changed) {return false;}
			if (!this.imageWrap) {return false;}
			this.spinner.hide();
			if (!success) {
				src = 'images/fico/'+this.file.data.icon;
			} else {
				this.cached.add(src, {img: loaded});
			}
			this.imageWrap.setStyle('background-image', 'url(\''+src+'\')');
			if (
				loaded.dom &&
				loaded.dom.naturalHeight < this.canvas.body.getHeight() &&
				loaded.dom.naturalWidth < this.canvas.body.getWidth()
			) {
				this.imageWrap.setStyle('background-size', 'auto');
				this.UI.zoomToggle.disable();
			}
			if (!this.imageWrap.isVisible()) {
				this.imageWrap.fadeIn({stopFx: true});
			}
			this.preloadFollowingHiRes.delay(300, false, this);
		}, this);
	}),
	cancelHiResLoad: function() {
		this.loadHiRes.cancel();
		if (this.preloading) {
			this.preloading.remove(true);
			this.preloading = false;
		}
		this.spinner.hide();
	},
	updateMaxDimensions: function() {
		this.maxH = this.canvas.body.getHeight() * this.highDPIRatio;
		this.maxW = this.canvas.body.getWidth() * this.highDPIRatio;
	},
	getFullResURL: function() {
		return URLRoot+'/?module=custom_actions&action=open_in_browser&path='+encodeURIComponent(this.file.data.path);
	},
	getHighResURL: function(file) {
		this.updateMaxDimensions();
		return URLRoot+'/t.php?p='+encodeURIComponent(file.data.path)+'&noCache=1&width='+this.maxW+'&height='+this.maxH+'&fsize='+file.data.filesize;
	},
	loadFile: function(item) {
		this.changed = true;
		this.cancelHiResLoad();
		var r = item.data;
		this.cancelZoom(true);
		this.UI.icon.update('<img src="images/fico/'+r.icon+'" height="30" />');
		this.UI.filename.setText(r.filename);
		this.infoPanel.setItem(item);
		this.file = item;
		if (this.imageWrap) {this.imageWrap.remove(true);}
		this.imageWrap = this.canvas.body.createChild({
			tag: 'div', cls: 'centered activeImage'
		});
		if (!FR.isMobile) {
			if (this.file.data.filetype == 'img') {
				this.UI.zoomToggle.enable();
			} else {
				this.UI.zoomToggle.disable();
			}
		}
		var highResSrc = this.getHighResURL(this.file);

		var cache = this.isCached(highResSrc);
		if (cache) {
			this.imageWrap.setStyle('background-image', 'url(\''+highResSrc+'\')').show();
			this.preloadFollowingHiRes.delay(0, false, this);
			return true;
		}
/*
		if (the following is currently preloading) {
			wait for the preload to finnish
			if the preload finds out that what preloaded is the current file, then just show it
		}
*/
		if (r.thumbLoaded) {
			this.imageWrap.setStyle('background-image', 'url(\''+r.thumbURL+'\')').show();
			this.loadHiRes.delay(1000, false, this, [highResSrc]);
			return true;
		}
		this.loadHiRes.delay(0, false, this, [highResSrc]);
	},
	isCached: function(url) {
		return this.cached.get(url);
	},
	setFile: function(index, direction) {
		this.direction = (direction || false);
		this.currentIndex = index;
		var record = this.files.itemAt(index);
		var count = this.files.getCount();
		if (count > 1) {
			this.UI.navRightWrap.show();
			this.UI.navLeftWrap.show();
		} else {
			this.UI.navRightWrap.hide();
			this.UI.navLeftWrap.hide();
		}
		var status = '&nbsp;';
		if (count > 1) {
			 status = FR.T('%1 / %2').replace('%1', this.currentIndex+1).replace('%2', count);
		}
		this.UI.status.setText(status);
		this.loadFile(record);
		FR.UI.gridPanel.highlightByRecord(record);
	},
	previous: function() {
		var index = this.files.getCount()-1;
		if (this.currentIndex > 0) {
			index = this.currentIndex-1;
		}
		this.setFile(index, 'left');
	},
	getFollowingIndex: function() {
		var count = this.files.getCount();
		if (this.direction == 'right') {
			if (this.currentIndex < count-1) {
				return this.currentIndex+1;
			}
			return 0;
		} else if (this.direction == 'left') {
			if (this.currentIndex > 0) {
				return this.currentIndex-1;
			}
			return count-1;
		}
		return false;
	},
	next: function() {
		var index = 0;
		if (this.currentIndex < this.files.getCount()-1) {
			index = this.currentIndex+1;
		}
		this.setFile(index, 'right');
	},
	open: function(selectedFile) {
		this.collectFiles(selectedFile);
		this.show();
		this.setFile(this.startIndex);
	},
	collectFiles: function(startFile) {
		FR.UI.gridPanel.store.each(function(file) {
			if (FR.utils.supportsImageViewer(file)) {
				var c = this.files.getCount();
				this.files.add(c, file);
				if (startFile == file) {
					this.startIndex = c;
				}
			}
		}, this);
	},

	download: function() {
		if (this.infoPanel.tabs.cartPanel.addItem(this.file)) {
			FR.UI.feedback(FR.T('The file has been added to the download cart'));
		} else {
			FR.UI.feedback(FR.T('The file is already in the download cart'));
		}
	}
});