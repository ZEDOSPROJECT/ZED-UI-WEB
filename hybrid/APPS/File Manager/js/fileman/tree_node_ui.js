FR.components.TreeNodeCustomUI = Ext.extend(Ext.tree.TreeNodeUI, {
	getIcons: function() {
		var a = this.node.attributes;
		var icons = '';
		if (a.custom) {
			if (a.custom.share) {
				icons += ' <i class="fa fa-user-plus"></i>';
			}
			if (a.custom.weblink) {
				icons += ' <i class="fa fa-link"></i>';
			}
			if (a.custom.notInfo) {
				icons += ' <i class="fa fa-bell-o"></i>';
			}
			if (a.custom.star) {
				icons += ' <i class="fa fa-star-o" ></i>';
			}
			if (a.custom.label) {
				var s = a.custom.label.split('|');
				icons += ' <i class="fa fa-tag" style="color:'+s[1]+'" ext:qtip="'+s[0]+'"></i>';
			}
		}
		if (a['new']) {
			icons += ' <i class="fa fa-bolt"  ext:qtip="'+FR.T('This item has recent changes')+'"></i>';
		}
		return icons;
	},
	updateIcons: function() {
		this.frIconsNodeEl.update(this.getIcons());
	},
	getIconHTML: function() {
		var a = this.node.attributes;

		var icon = '<i';
		var iconCls = '';
		var iconStyle = '';
		if (a.uid) {
			iconCls = 'avatar';
			iconStyle += 'background-image:url(\'a/?uid='+a.uid+'\')';
		} else {
			iconCls += 'x-tree-node-icon fa fa-lg fa-fw ';
			if (a.iconCls){
				iconCls += a.iconCls;
			} else {
				iconCls += 'fa-folder';
			}
			iconCls += ' icon-silver';
		}
		icon += ' class="'+iconCls+'" style="'+iconStyle+'"></i>';
		return icon;
	},
	renderElements : function(n, a, targetNode, bulkRender){
		this.indentMarkup = n.parentNode ? n.parentNode.ui.getChildIndent() : '';
		var showMenuTrigger = (['myfiles', 'sharedFolder', 'trash'].indexOf(a.section) != -1);
		var nel,
			buf =
				'<li class="x-tree-node">' +
				'<div ext:tree-node-id="'+n.id+'" class="x-tree-node-el x-tree-node-leaf x-unselectable '+(a.cls || '')+'" unselectable="on">' +
				'<span class="x-tree-node-indent">'+this.indentMarkup+"</span>"+
				'<i class="x-tree-ec-icon fa fa-caret-right"></i>'+
				this.getIconHTML() +
				'<a hidefocus="on" class="x-tree-node-anchor">' +
				'<span unselectable="on">'+n.text+"</span>" +
				'<span style="color:silver">' + this.getIcons() + '</span>' +
				"</a>" +
				(showMenuTrigger ? '<div class="nodeMenu"><div class="triangle"></div></div>':'') +
				'</div>'+
				'<ul class="x-tree-node-ct" style="display:none;"></ul>'+
				'</li>';

		if (bulkRender !== true && n.nextSibling && (nel = n.nextSibling.ui.getEl())) {
			this.wrap = Ext.DomHelper.insertHtml("beforeBegin", nel, buf);
		} else {
			this.wrap = Ext.DomHelper.insertHtml("beforeEnd", targetNode, buf);
		}
		this.elNode = this.wrap.childNodes[0];
		this.ctNode = this.wrap.childNodes[1];
		var cs = this.elNode.childNodes;
		this.indentNode = cs[0];
		this.ecNode = cs[1];
		this.iconNode = cs[2];
		this.iconNodeEl = Ext.get(this.iconNode);
		this.anchor = cs[3];
		this.textNode = cs[3].firstChild;
		this.frIconsNodeEl = Ext.get(cs[3].lastChild);
		if (showMenuTrigger) {
			this.menuTriggerNode = cs[4];
			Ext.get(this.menuTriggerNode).on('click', function(e) {
				FR.UI.tree.showContextMenu(n, e);
				e.stopEvent();
			});
		}
	},
	updateExpandIcon : function(){
		if(this.rendered){
			var n = this.node, hasChild = n.hasChildNodes();
			if(hasChild || n.attributes.expandable){
				if (n.expanded){
					Ext.fly(this.ecNode).replaceClass('fa-caret-right', 'fa-caret-down');
				} else {
					Ext.fly(this.ecNode).replaceClass('fa-caret-down', 'fa-caret-right');
				}
			} else {
				Ext.fly(this.ecNode).removeClass('fa-caret-right');
			}
		}
	},
	beforeLoad : function() {
		var i = this.iconNodeEl;
		i.origCSSClass = i.getAttribute('class');
		i.set({'class': 'x-tree-node-icon fa fa-lg fa-fw icon-silver fa-refresh fa-spin'});
	},
	afterLoad : function() {
		this.iconNodeEl.set({'class': this.iconNodeEl.origCSSClass});
	}
});