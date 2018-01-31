FR.components.gridPanel = Ext.extend(Ext.grid.GridPanel, {
	highlightOnDisplay: false, region: 'center',
	initComponent: function() {
		this.initStore();
		Ext.apply(this, {
			stateful: true, stateId: 'files-grid',
			stateEvents: ['columnresize', 'columnmove'],
			ddGroup : 'TreeDD', ds: this.store,
			cm: new FR.components.gridColumnModel(),
			enableDragDrop: true,
			stripeRows: false, trackMouseOver: false, enableColLock:false,
			selModel: new Ext.grid.RowSelectionModel({
				singleSelect:false,
				listeners: {
					'selectionchange': function() {this.onSelectionChange.delay(150, false, this);}, scope: this
				}
			}),
			keys: [{
				key: [10,13], stopEvent: true,
				fn: function() {
					var item = FR.currentSelectedFile;
					this.openItem(item);
				}, scope: this
			}],
			autoExpandColumn: 'filename',
			view: new FR.components.gridView({
				sortAscText: FR.T('Sort Ascending'),
				sortDescText: FR.T('Sort Descending'),
				columnsText: FR.T('Columns')
			}),
			plugins: [new Ext.ux.GridDragSelector({dragSafe:true})],
			listeners: {
				'afterrender': function() {
					this.view.scroller.on('scroll', function() {this.loadThumbs.delay(300, false, this);}, this);
					this.setMetaCols();
				},
				'resize': function() {
					this.loadThumbs.delay(300, false, this);
				},
				'rowdblclick': function (grid, rowIndex, e){
					var item = grid.store.getAt(rowIndex);
					if (item) {this.openItem(item);}
					e.stopEvent();
					return false;
				},
				'containermousedown': function(p, e) {
					if (!e.ctrlKey) {
						this.selModel.clearSelections();
						this.countSel = 0;
					}
				},
				'containercontextmenu': function(p, e) {
					this.showContextMenu();
					e.stopEvent();
				},
				'rowcontextmenu': function(grid, rowIndex, e) {
					if (!this.selModel.isSelected(rowIndex)) {
						this.selModel.clearSelections();
						this.selModel.selectRow(rowIndex);
						this.countSel = 1;
						FR.currentSelectedFile = this.store.getAt(rowIndex);
					}
					if (this.countSel > 0) {
						this.showContextMenu();
					}
					e.stopEvent();
				},
				'render': function (grid) {
					if (User.perms.alter) {
						this.dropZone = new Ext.dd.DropZone(grid.getView().scroller, {
							ddGroup: grid.ddGroup,
							getTargetFromEvent: function (e) {
								var target = e.getTarget(grid.getView().rowSelector);
								if (target) {
									var rowIndex = grid.getView().findRowIndex(target);
									var r = grid.getStore().getAt(rowIndex);
									if (r.data.isFolder) {
										return {rowIndex: rowIndex, record: r};
									}
								}
							},
							onNodeEnter: function (target) {
								Ext.fly(grid.getView().getRow(target.rowIndex)).addClass('dragged-over');
							},
							onNodeOut: function (target) {
								Ext.fly(grid.getView().getRow(target.rowIndex)).removeClass('dragged-over');
							},
							onNodeOver: function (target) {
								if (target.record.data.isFolder) {
									return Ext.dd.DropZone.prototype.dropAllowed;
								}
							},
							onNodeDrop: function (target, dz, e, dropData) {
								if (target.record.data.isFolder) {
									FR.actions.move({data: dropData}, target.record.data.path);
								}
								return true;
							}
						});
					}

					if (User.perms.upload) {
						FlowUtils.DropZoneManager.add({
							domNode: this.getView().scroller.dom, overClass: 'dragged-over',
							findTarget: function(e) {
								if (['myfiles', 'sharedFolder'].indexOf(FR.currentSection) == -1) {
									return false;
								}
								if (FR.UI.tree.currentSelectedNode.attributes.perms && !FR.UI.tree.currentSelectedNode.attributes.perms.upload) {
									return false;
								}
								var n, cls,
									p = FR.UI.gridPanel,
									el = Ext.get(e.target);
								if (FR.UI.gridPanel.getView().viewMode == 'list') {
									cls = 'x-grid3-row';
								} else {
									cls = 'tmbItem';
								}
								if (el && !el.hasClass(cls)) {el = el.parent('div.'+cls);}
								if (!el) {
									return {el: this.getView().scroller.dom};
								}
								var rowIndex = p.getView().findRowIndex(el.dom);
								var r = p.getStore().getAt(rowIndex);
								if (r.data.isFolder) {
									return {el: el.dom, record: r};
								} else {
									return {el: this.getView().scroller.dom};
								}
							},
							onDrop: function (e, target) {
								var path, folderName;
								if (!target.record) {
									if (
										(FR.currentFolderPerms && !FR.currentFolderPerms.upload) ||
										(FR.currentSection != 'myfiles' && FR.currentSection != 'sharedFolder')
									) {return false;}
									path = FR.currentPath;
									folderName = FR.UI.tree.currentSelectedNode.text;
								} else {
									var r = target.record;
									path = r.data.path;
									folderName = r.data.filename;
								}
								FR.UI.uploadWindow(FR.T('Upload to "%1"').replace('%1', folderName),
									new FR.components.uploadPanel({targetPath: path, dropEvent: e})
								);
							},
							scope: this
						});
					}
				},
				scope: this
			}
		});
		this.addEvents(['folderChange']);
		FR.components.gridPanel.superclass.initComponent.apply(this, arguments);
	},
	openItem: function(item) {
		if (FR.currentSection == 'trash') {return false;}
		var path = item.data.path;
		if (item.data.isFolder) {
			FR.utils.browseToPath(path);
		} else {
			if (!User.perms.download) {return false;}
			var ext = FR.utils.getFileExtension(item.data.filename);
			if (FR.ext[ext] && FR.UI.contextActions[FR.ext[ext]]) {
				FR.UI.contextActions[FR.ext[ext]].execute();
			} else {
				if (Settings.ui_double_click == 'download') {
					FR.actions.download(path);
				} else if (Settings.ui_double_click == 'downloadb') {
					FR.actions.openFileInBrowser(path);
				} else if (Settings.ui_double_click == 'showmenu') {
					this.showContextMenu();
				} else {
					FR.utils.showPreview();
				}
			}
		}
	},
	getDragDropText: function() {
		var count = this.selModel.getCount();
		if (count == 1) {
			return  FR.T('One item');
		}
		return  FR.T('%1 items').replace('%1', count);
	},
	initStore: function() {
		this.store = new FR.components.gridStore();
		this.store.on('exception', function(p, t, a, opt, response) {
			var d = opt.reader.jsonData;
			if (d && d.authError) {
				new Ext.ux.prompt({
					title: FR.T('Error'),
					text: d.msg,
					confirmBtnLabel: FR.T('Refresh'),
					callback: function() {document.location.href = FR.logoutURL;}
				});
			}

			var msg = FR.T('Failed to load file list.');
			if (response.status == 200) {
				FR.lastGridServerResponse = response.responseText;
				msg += '<br>'+FR.T('<a href="%1">The data</a> recevied from the server contains errors.').replace('%1', 'javascript:alert(FR.lastGridServerResponse)');
			} else if (response.status == 500) {
				msg += '<br>'+FR.T('There is a server internal error (HTTP code 500).<br>The administrator should check the appropriate server error logs for related information.');
			} else if (response.status == 0) {
				msg += '<br>'+FR.T('Please check your network connection.');
			} else {
				msg += '<br>'+FR.T('The server HTTP response code is '+response.status);
			}

			this.body.mask(msg);
		}, this);
		this.store.on('beforeload', function(store) {
			var i = FR.UI.ImageViewer;
			if (i && i.isVisible()) {i.hide();}
			store.removeAll(true);
			this.selModel.clearSelections(true);
			this.view.mainBody.update('');
		}, this);
		this.store.on('load', function(store) {
			FR.lastGridServerResponse = false;
			var data = store.reader.jsonData;
			if (this.body.isMasked()) {
				this.body.unmask();
			}
			if (data.error) {
				new Ext.ux.prompt({title: FR.T('Error'), text: data.error});
				if (FR.currentPath == '/ROOT/HOME') {
					FR.UI.tree.panel.el.mask();
				} else {
					var currentSelectedNode = FR.UI.tree.panel.getSelectionModel().getSelectedNode();
					currentSelectedNode.parentNode.removeChild(currentSelectedNode);
					FR.UI.tree.homeFolderNode.select();
				}
			} else {
				this.fireEvent('folderChange', this, store);
				this.onSelectionChange.delay(0, false, this);
				if (this.highlightOnDisplay) {
					this.highlight(this.highlightOnDisplay);
					this.highlightOnDisplay = false;
				}
				if (store.reader.jsonData.countNewEvents) {
					FR.UI.infoPanel.tabs.activityPanel.updateStatus(parseInt(data.countNewEvents));
				}
				FR.UI.infoPanel.tabs.detailsPanel.setReadMe(data.readme);
			}
		}, this);
	},
	setMetaCols: function() {
		this.store.loadParams['metadata[]'] = this.colModel.getMetaCols();
	},
	getSelectedFiles: function() {
		var s = this.selModel.getSelections();
		var list = [];
		for(var i = 0, len = s.length; i < len; i++){
			var data = s[i].data;
			data.id = s[i].id;
			list.push(data);
		}
		return list;
	},
	getOneSel: function() {
		var selection = this.selModel.getSelections();
		return selection[0];
	},
	countSelected: function() {
		return this.selModel.getCount();
	},
	getByPath: function(path) {
		var rowIdx = this.store.findBy(function(r) {
			if (r.data.path == path) {return true;}
		});
		return (rowIdx != -1) ? this.store.getAt(rowIdx) : false;
	},
	highlight: function(filename) {
		var rowIdx = this.store.findBy(function(record) {
			if (record.data.filename == filename) {return true;}
		});
		if (rowIdx > -1) {
			this.selModel.selectRow(rowIdx);
			this.getView().focusRow(rowIdx);
		}
	},
	highlightByRecord: function(record) {
		var rowIdx = this.store.findBy(function(r) {
			if (r == record) {return true;}
		});
		if (rowIdx > -1) {
			this.selModel.selectRow(rowIdx);
			this.getView().ensureVisible(rowIdx, 0, false);
		}
	},
	load: function(path) {this.store.loadByPath(path);},
	onSelectionChange: new Ext.util.DelayedTask(function(){
		this.countSel = this.countSelected();
		if (this.countSel == 0) {
			FR.currentSelectedFile = false;
		} else  {
			if (this.countSel == 1) {
				FR.currentSelectedFile = this.getOneSel();
			}
		}
		FR.UI.infoPanel.gridSelChange();
		FR.UI.AudioPlayer.gridSelChange();
		this.showTopMenu();
	}, this),
	showTopMenu: function() {
		if (FR.isMobile) {return false;}

		Ext.iterate(['weblink', 'shareWithUsers', 'preview', 'remove'], function (k) {
			FR.UI.actions[k].hide();
		});

		if (FR.currentSection == 'myfiles') {
			if (this.countSel > 0) {
				if (this.countSel == 1) {
					if (User.perms.download) {
						if (!FR.currentSelectedFile.data.isFolder) {
							FR.UI.actions.preview.show();
						}
						if (User.perms.weblink) {
							FR.UI.actions.weblink.show();
						}
						if (User.perms.share) {
							FR.UI.actions.shareWithUsers.show();
						}
					}
				}
				if (!User.perms.read_only) {
					FR.UI.actions.remove.show();
				}
			}
		} else if (['webLinked', 'starred', 'photos', 'userWithShares'].indexOf(FR.currentSection) != -1) {
			if (this.countSel == 1) {
				if (User.perms.download) {
					if (!FR.currentSelectedFile.data.isFolder) {
						FR.UI.actions.preview.show();
					}
				}
				FR.UI.actions.weblink.show();
			}
		} else if (FR.currentSection == 'trash') {
			if (this.countSel > 0) {
				if (!User.perms.read_only) {
					FR.UI.actions.remove.show();
				}
			}
		} else if (FR.currentSection == 'sharedFolder') {
			var f = FR.currentFolderPerms;
			if (this.countSel == 1) {
				if (User.perms.download && f && f.download) {
					if (!FR.currentSelectedFile.data.isFolder) {
						FR.UI.actions.preview.show();
					}
					if (f.share && User.perms.weblink) {
						FR.UI.actions.weblink.show();
					}
					if (f.alter && !User.perms.read_only) {
						FR.UI.actions.remove.show();
					}
				}
			}
		}

	},
	showContextMenu: function() {
		FR.UI.contextMenu.event({
			location: 'grid',
			target: this.getSelectedFiles(),
			targetFiles: this.selModel.getSelections()
		});
	},
	loadThumbs: new Ext.util.DelayedTask(function() {
		if (this.view.isListViewStyle()) {return false;}
		var scroller = this.view.scroller.dom;
		var scrollerRect = scroller.getBoundingClientRect();
		this.store.each(function(item) {
			if (!item.data.thumb) {return true;}
			if (item.data.thumbLoading) {return true;}
			if (item.data.thumbLoaded) {return true;}
			var idx = this.store.indexOfId(item.id);
			if (idx == -1) {return true;}
			var el = this.view.getRow(idx);
			if (!el) {return true;}
			if (!FR.utils.elementInView(el.getBoundingClientRect(), scrollerRect, 2)) {return true;}
			var elId = 'itemIcon_'+item.data.uniqid + item.data.filesize;
			var iconEl = Ext.get(elId);
			if (!iconEl) {return true;}
			var t = Ext.get(new Image());
			t.on('load', function() {
				item.data.thumbLoading = false;
				item.data.thumbLoaded = true;
				if (!iconEl.dom) {return false;}
				var bgSize = FR.UI.gridPanel.thumbBGSize(this.dom.width, this.dom.height);
				if (bgSize) {
					item.data.thumbBgSize = bgSize;
					iconEl.setStyle('background-size', bgSize);
				}
				iconEl.setStyle('background-image', 'url(\''+item.data.thumbURL+'\')');
				this.remove();
			});
			t.on('error', function() {
				item.data.thumbLoading = false;
			});
			item.data.thumbURL = FR.UI.getThumbURL(item.data);
			t.set({src: item.data.thumbURL});
			item.data.thumbLoading = true;
		}, this);
	}),
	thumbBGSize: function(w, h) {
		var m = Settings.thumbnail_size;
		if (w <= m || h <= m) {
			if (w <= m && h <= m) {
				return  w+'px'+' '+h+'px';
			} else {
				return 'contain';
			}
		}
	},
	onTreeSelectionChange: function(node) {
		var path = node.getPath('pathname');
		if (path == FR.currentPath) {return;}
		this.view.setMode(Ext.value(node.attributes.viewMode));
		var customSortInfo = node.attributes.sortInfo;
		if (customSortInfo && (customSortInfo.forced || customSortInfo == 'server')) {
			this.store.initialSort = customSortInfo;
		}
		this.store.loadByPath(path);
	}
});