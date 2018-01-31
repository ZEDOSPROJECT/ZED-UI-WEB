FR.components.gridView = Ext.extend(Ext.grid.GridView, {
	defaultViewMode: false,
	viewMode: false, previousState: false, previousViewMode: false,
	filters: [],
	init: function(grid) {
		this.defaultViewMode = Settings.ui_default_view;
		grid.colModel.on('hiddenchange', function(cm, idx, hideCol) {
			if (cm.getColumnAt(idx).custom) {
				this.grid.setMetaCols();
				if (!hideCol) {
					this.grid.load(FR.currentPath);
				}
			}
		}, this);
		FR.components.gridView.superclass.init.call(this, grid);
	},
	resetMode: function() {
		this.changeMode(this.defaultViewMode);
	},
	setMode: function(mode) {
		this.viewMode = mode;
	},
	configureForAudioPlayer: function() {
		this.previousState = this.grid.getState();
		var cm = this.cm;
		cm.suspendEvents();
		cm.setColumnWidth(cm.getIndexById('icon'), 40);
		if (User.perms.metadata) {
			cm.setHidden(cm.getIndexById('filename'), true);
			cm.setHidden(cm.getIndexById('nice_filesize'), true);
			cm.setHidden(cm.getIndexById('icons'), true);
			cm.setHidden(cm.getIndexById('modified'), true);
			cm.setHidden(cm.getIndexById('meta_' + FR.specialMetaFields.album), false);
			var titleIndex = cm.getIndexById('meta_' + FR.specialMetaFields.title);
			cm.setHidden(titleIndex, false);
			cm.moveColumn(titleIndex, 3);
			var artistIndex = cm.getIndexById('meta_' + FR.specialMetaFields.artist);
			cm.setHidden(artistIndex, false);
			cm.moveColumn(artistIndex, 4);
			if (!FR.isMobile) {
				var durationIndex = cm.getIndexById('meta_' + FR.specialMetaFields.duration);
				cm.setHidden(durationIndex, false);
				this.grid.autoExpandColumn = 'meta_' + FR.specialMetaFields.title;
			}
			this.grid.setMetaCols();
		}
		cm.resumeEvents();
		this.grid.stateful = false;
	},
	restoreAfterAudioPlayer: function() {
		this.grid.autoExpandColumn = 'filename';
		if (this.previousState) {
			var cm = this.cm;
			cm.suspendEvents();
			this.grid.applyState(this.previousState);
			cm.resumeEvents();
		}
		this.grid.stateful = true;
	},
	changeMode: function(mode, persist) {
		if (mode == this.viewMode) {return;}
		this.viewMode = mode;
		this.refresh(true);
		if (persist) {
			Settings.ui_default_view = mode;
		}
	},
	prepareData: function(r) {
		var icons = [];
		if (r.data.isNew) {
			icons.push('<i class="fa fa-bolt" ext:qtip="'+FR.T('This item has recent changes')+'"></i>');
		}
		if (r.data.hasWebLink) {
			icons.push('<i class="fa fa-link"></i>');
		}
		if (r.data.share) {
			icons.push('<i class="fa fa-user-plus"></i>');
		}
		if (r.data.comments == 1) {
			icons.push('<i class="fa fa-comment-o"></i>');
		} else if (r.data.comments > 1) {
			icons.push('<i class="fa fa-comments-o"></i>');
		}
		if (r.data.lockInfo) {
			icons.push('<i class="fa fa-lock" ext:qtip="'+FR.T('This file is locked by %1.').replace('%1', r.data.lockInfo)+'"></i>');
		}
		if (r.data.star) {
			icons.push('<i class="fa fa-star-o"></i>');
		}
		if (r.data.notInfo) {
			icons.push(' <i class="fa fa-bell-o"></i>');
		}
		r.data.icons = icons.join('');
		var iconsHolder = '<div class="iconsHolder">'+r.data.icons+'</div>';
		var filename = r.data.filename;
		if (!r.data.isFolder) {
			var name = FR.utils.stripFileExtension(r.data.filename);
			var ext = FR.utils.getFileExtension(r.data.filename).toUpperCase();
			r.data.filenameHTML = name +'<span class="ext-list">'+ ext +'</span>';
		} else {
			r.data.filenameHTML = filename;
		}

		var cls;
		if (this.isListViewStyle()) {
			if (r.data.isFolder) {
				r.data.iconHTML = '<i class="fa fa-folder fa-fw fileIcon"></i>';
			} else {
				if (this.viewMode == 'music') {
					r.data.iconHTML = '<img src="images/fico/audio-i.png" width="28" height="28" align="absmiddle" />';
				} else {
					r.data.iconHTML = '<img src="images/fico/'+r.data.icon+'" width="32" height="32" align="absmiddle" />';
				}
			}
		} else {
			r.data.labelHTML = '';
			if (r.data.label) {
				var s = r.data.label.split('|');
				var labelText = s[0];
				var labelColor = s[1];
				if (labelColor) {
					labelText = '<div style="background-color: '+labelColor+';">'+labelText+'</div>';
				} else {
					labelText = '<div>'+labelText+'</div>';
				}
				r.data.labelHTML = '<div class="label">'+labelText+'</div>';
			}
			if (r.data.isFolder) {
				cls = 'thumbFolder';
				if (r.data.label) {
					cls += ' labeled';
				}
				return r.data.labelHTML +
					'<table cellspacing="0" cellpadding="0" border="0" class="'+cls+'"><tr>' +
					'<td class="thumb"><i class="fa fa-folder fa-lg "></i></td>' +
					'<td class="filename"><div class="wrap">' +
					'<span ext:qtip="'+r.data.filename+'">' + r.data.filename + '</span>' + iconsHolder +
					'</div></td>' +
					'</tr></table>';
			} else {
				cls = 'tmbInner';
				if (r.data.label) {cls += ' labeled';}
				var img = '';
				if (r.data.thumbURL) {
					img = r.data.thumbURL;
				} else {
					img = 'images/fico/'+r.data.icon;
				}
				var itemId = 'itemIcon_'+ r.data.uniqid + r.data.filesize;
				var iconStyle = 'background-image:url(\''+img+'\')';
				if (r.data.thumbBgSize) {
					iconStyle += ';background-size:'+r.data.thumbBgSize;
				}
				if (this.viewMode == 'thumbnails') {
					return r.data.labelHTML +
						'<div class="'+cls+'" id="'+itemId+'" style="'+iconStyle+'">' +
						'</div>' +
						'<div class="title">' +
						'<div class="name" ext:qtip="'+r.data.filename+'&lt;br&gt; '+r.data.nice_filesize+'" style="max-width:'+(Settings.thumbnail_size-44)+'px;">'+r.data.filenameHTML+'</div>' +
						iconsHolder +
						'</div>';
				} else {
					return '<div class="tmbInner large" id="'+itemId+'" style="'+iconStyle+'" ext:qtip="'+r.data.filename+'">'+r.data.labelHTML+'</div>';
				}
			}
		}
	},
	getRows : function() {
		return this.hasRows() ? this.mainBody.query(this.rowSelector) : [];
	},
	doRender : function(cs, rs, ds, startRow, colCount, stripe) {
		if (this.isListViewStyle()) {
			Ext.each(rs, function(r) {this.prepareData(r);}, this);
			return FR.components.gridView.superclass.doRender.apply(this, arguments);
		}
		var bufFolders ='', bufFiles = '', html ='', cls = 'x-unselectable tmbItem', ret = '';
		if (this.viewMode == 'photos') {cls += ' largeItem';}
		Ext.each(rs, function(r) {
			html = this.prepareData(r);
			if (r.data.isFolder) {
				bufFolders += '<div class="tmbItem typeFolder">'+html+'</div>';
			} else {
				bufFiles += '<div class="'+cls+'">'+html+'</div>';
			}
		}, this);
		if (bufFolders.length > 0) {
			ret = '<div class="typeSeparator">'+FR.T('Folders')+'</div>' + bufFolders;
		}
		if (bufFiles.length > 0) {
			if (this.viewMode != 'photos') {
				ret = ret + '<div class="typeSeparator">'+FR.T('Files')+'</div>';
			}
			ret = ret + bufFiles;
		}
		return ret + '<div style="clear:both"></div>';
	},
	refresh: function(headersToo) {
		if (!this.viewMode) {this.viewMode = Settings.ui_default_view;}
		FR.UI.actions.toggleViewList.setIconClass(FR.UI.getViewIconCls(this.viewMode));
		if (this.isListViewStyle()) {
			this.selectedRowClass = "x-grid3-row-selected";
			this.el.removeClass('thumbMode');
			this.rowSelector = 'div.x-grid3-row';
			this.mainHd.setStyle('display', 'block');
		} else {
			this.rowSelector = 'div.tmbItem';
			this.selectedRowClass = "tmbItemSel";
			this.el.addClass('thumbMode');
			this.mainHd.setStyle('display', 'none');
		}
		var ap = FR.UI.AudioPlayer;
		this.filters = [];
		if (this.viewMode == 'photos') {
			this.filters.push(function(r){return (r.data.thumb && (r.data.filetype == 'img' || r.data.filetype == 'raw'));});
		} else if (this.viewMode == 'music') {
			this.filters.push(function (r) {return (r.data.filetype == 'mp3');});
		}

		if (this.viewMode != this.previousViewMode) {
			if (this.viewMode == 'music') {
				this.configureForAudioPlayer();
				ap.expand();
			} else {
				if (!ap.collapsed) {
					if (ap.app) {ap.app.pause();}
					ap.collapse();
					this.restoreAfterAudioPlayer();
				}
			}
		}

		var s = this.grid.getStore();
		if (this.filters.length > 0) {
			s.suspendEvents();
			s.filterBy(function(r) {
				var rs = false;
				Ext.each(this.filters, function (f) {
					if (f(r)) {
						rs = true;
						return false;
					}
				});
				return rs;
			}, this);
			s.resumeEvents();
		} else {
			if (s.isFiltered()) {s.clearFilter(true);}
		}
		FR.components.gridView.superclass.refresh.apply(this, arguments);
		this.grid.loadThumbs.delay(0, false, this.grid);
		this.previousViewMode = this.viewMode;
	},
	updateAllColumnWidths: function(){
		if (this.isListViewStyle()) {
			return FR.components.gridView.superclass.updateAllColumnWidths.apply(this);
		}
		var tw = this.getTotalWidth();
		var clen = this.cm.getColumnCount();
		var ws = [];
		for(var i = 0; i < clen; i++){
			ws[i] = this.getColumnWidth(i);
		}
		this.innerHd.firstChild.firstChild.style.width = tw;
		for(i = 0; i < clen; i++){
			var hd = this.getHeaderCell(i);
			hd.style.width = ws[i];
		}
		this.onAllColumnWidthsUpdated(ws, tw);
	},
	updateColumnWidth : function(col, width){
		if (this.isListViewStyle()) {
			return FR.components.gridView.superclass.updateColumnWidth.apply(this, arguments);
		}
		var w = this.getColumnWidth(col);
		var tw = this.getTotalWidth();
		this.innerHd.firstChild.firstChild.style.width = tw;
		var hd = this.getHeaderCell(col);
		hd.style.width = w;
		this.onColumnWidthUpdated(col, w, tw);
	},
	updateColumnHidden : function(col, hidden){
		if (this.isListViewStyle()) {
			return FR.components.gridView.superclass.updateColumnHidden.apply(this, arguments);
		}
		var tw = this.getTotalWidth();
		this.innerHd.firstChild.firstChild.style.width = tw;
		var display = hidden ? 'none' : '';
		var hd = this.getHeaderCell(col);
		hd.style.display = display;
		this.onColumnHiddenUpdated(col, hidden, tw);
		delete this.lastViewWidth;
		this.layout();
	},
	applyEmptyText : function() {
		var t;
		var iconCls,
			color = 'silver',
			text = 'This folder is empty',
			style = 'simple';

		if (FR.currentSection == 'starred') {
			iconCls = 'fa-star';
			text = 'There are no starred files or folders';
		} else if (FR.currentSection == 'webLinked') {
			iconCls = 'fa-link';
			text = 'There are no shared links';
		} else if (FR.currentSection == 'search') {
			iconCls = 'fa-search';
			text = 'No file was found matching your search criteria.';
		} else {
			if (FR.utils.currentFolderAllowsUpload() && !FR.isMobile) {
				style = 'upload';
			}
		}

		if (this.viewMode == 'photos') {
			iconCls = 'fa-picture-o';
			text = 'There are no photos in here';
			style = 'simple';
		} else if (this.viewMode == 'music') {
			text = 'There are no audio files in here';
			color = '#EEEEEE';
			style = 'simple';
		}
		var count = this.ds.getTotalCount();
		if (count == 1) {
			text += '<br>'+FR.T('There is one other item');
			text += '<br>(<a href="javascript:;" onclick="FR.UI.gridPanel.view.resetMode()" style="pointer-events:auto">'+FR.T('Show the item')+'</a>)';
		} else if (count > 1) {
			text += '<br>'+FR.T('There are %1 other items').replace('%1', count);
			text += '<br>(<a href="javascript:;" onclick="FR.UI.gridPanel.view.resetMode()" style="pointer-events:auto">'+FR.T('Show all items')+'</a>)';
		}

		if (style == 'simple') {
			t = '<div style="text-align:center;">';
			if (iconCls) {
				t += '<div style="margin-bottom:10px;"><i class="fa ' + iconCls + ' fa-5x" style="color:' + color + '"></i></div>';
			}
			t += '<div>' + FR.T(text) + '</div></div>';
		} else {
			t = '<div class="dropIcon"><i class="fa fa-reply fa-rotate-270 fa-5x"></i></div>' +
				'<div style="float:left;">' +
				'<div style="font-size:26px;">' + FR.T('Drop files here') + '</div>' +
				'<div style="font-size:13px;margin-top:10px;">' + FR.T('or use the "NEW" button') + '</div>' +
				'</div>';
		}
		this.emptyText = t;
		FR.components.gridView.superclass.applyEmptyText.apply(this, arguments);
	},
	layout: function() {
		FR.components.gridView.superclass.layout.apply(this);
		this.mainBody.setStyle('width', 'auto');
		this.mainBody.setStyle('height', '100%');
	},
	isListViewStyle: function() {
		return (this.viewMode == 'list' || this.viewMode == 'music');
	}
});