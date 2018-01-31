var UserChooser = function(config){
	this.config = config || {};
	if (this.config.URLRoot) {
		URLRoot = this.config.URLRoot;
	}
	this.config.url = URLRoot+'/?module=fileman&section=utils&page=user_chooser_tree';
	this.initTree();
	this.triggerField = new Ext.form.TriggerField({
		id: this.config.id+'-search',
		triggerClass: 'x-form-clear-trigger',
		emptyText: window.parent.FR.T('Search'),
		onTriggerClick: this.cancelSearch.createDelegate(this),
		enableKeyEvents: true,
		listeners:{
			keyup: {
				buffer: 500,
				fn: function(field, e) {
					if(Ext.EventObject.ESC == e.getKey()) {
						field.onTriggerClick();
					} else {
						this.rootNode.loaded = false;
						this.rootNode.collapse();
						this.rootNode.expand();
					}
				}
			},
			scope: this
		}
	});
	this.dlg = new Ext.Window({
		id: this.config.id || Ext.id(),
		closeAction: 'hide',
		resizable:false, width: 280, height: 280,
		title: FR.T('Select Users'), modal: true,
		layout: 'border', hideBorders: true,
		tools: [
			{
				id: 'search',
				handler: function() {
					Ext.getCmp(this.config.id+'-north-region').show();
					Ext.getCmp(this.config.id+'-north-region').ownerCt.doLayout();
					this.triggerField.focus();
				}, scope: this
			}
		],
        items: [
			{
				region: 'north',
				layout: 'fit',
				height: 25,
				border:false, hideBorders: true,
				id: this.config.id+'-north-region',
				items: this.triggerField
			},
			{
				region: 'center',
				layout: 'fit', bodyStyle: 'padding-bottom:20px;',
				items: this.tree, buttonAlign: 'left',
				buttons: [
					{
						cls: 'fr-btn-default fr-btn-smaller fr-btn-primary', style: 'margin-left:25px;margin-right:10px',
						text: FR.T('Ok'),
						handler: this.doCallback,
						scope: this
					},
					{
						cls: 'fr-btn-smaller',
						text: FR.T('Cancel'),
						handler: function () {
							this.dlg.hide()
						},
						scope: this
					}
				]
			}
		]
	});
};
UserChooser.prototype = {
	initTree : function() {
		this.tree = new Ext.tree.TreePanel({
		    animate: true,
		    containerScroll: true,
			rootVisible: false,
			bodyBorder: false,
			autoScroll: true, useArrows: true,
			listeners: {
				beforeclick: function(node) {
					node.getUI().toggleCheck();
					return false;
				}
			}
		});
		this.rootNode = new Ext.tree.AsyncTreeNode({
			text: 'Root', gid:'',
			loader: new Ext.tree.TreeLoader({
				dataUrl: this.config.url,
				requestMethod: 'GET',
				baseAttrs: {checked: false}
			})
		});
		this.tree.setRootNode(this.rootNode);
		this.rootNode.attributes.loader.on({
			beforeload: function() {this.tree.el.mask(window.parent.FR.T('Loading...'));},
			load: function() {this.tree.el.unmask();},
			loadexception: function() {this.tree.el.unmask();},
			scope: this
		});
		this.rootNode.attributes.loader.on('beforeload', function(loader, node){
			if (node.attributes.gid && node.attributes.countUsers > 200) {
				alert('You choose to browse a group with '+node.attributes.countUsers+' users. The loading will take a while, please wait.');
			}
			loader.baseParams.gid = node.attributes.gid;
			if (this.config.only) {
				loader.baseParams.only = this.config.only;
			}
			loader.baseParams.allow_all = (this.config.allowAll ? 1 : 0);
			loader.baseParams.showSelf = (this.config.showSelf ? 1 : 0);
			loader.baseParams.search = this.triggerField.getRawValue();
		}, this);
	},
	cancelSearch: function() {
		if (this.triggerField.getRawValue() != '') {
			this.triggerField.setValue('');
			this.rootNode.loaded = false;
			this.rootNode.collapse();
			this.rootNode.expand();
		}
		Ext.getCmp(this.config.id+'-north-region').hide();
		Ext.getCmp(this.config.id+'-north-region').ownerCt.doLayout();
	},
	show : function(el, callback, scope){
	    this.dlg.show(el);
		Ext.getCmp(this.config.id+'-north-region').hide();
		var task = new Ext.util.DelayedTask(function(){
			Ext.getCmp(this.config.id+'-north-region').ownerCt.doLayout();
		}, this);
		task.delay(500);
		this.callback = callback;
		this.scope = scope;
	},
	clearChecked: function() {
		this.tree.getRootNode().cascade(function(n) {
			n.getUI().toggleCheck(false);
	    });
	},
	doCallback : function() {
		var data = {users:[], groups:[]};
		Ext.each(this.tree.getChecked(), function(node) {
			var type = node.attributes.uid ? 'users' : 'groups';
			var id = node.attributes.uid ? node.attributes.uid : node.attributes.gid;
			if (type == 'groups' && id == '-' && ! this.config.allowAll) {
				//skip "unsorted users" item
			} else {
				data[type].push(node.attributes);
			}
		}, this);
		if (this.scope) {
			this.callback.createDelegate(this.scope, [data]).call();
		} else {
			this.callback(data);
		}
		this.cancelSearch();
		this.dlg.hide();
	}
};