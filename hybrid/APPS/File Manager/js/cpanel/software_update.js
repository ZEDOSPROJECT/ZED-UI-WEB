var panel = new Ext.Panel({
	title: FR.T('Step 1:')+' '+FR.T('Check for updates'),
	layout: 'fit', activeItem: 0,
	bodyStyle: 'padding:15px', cls: 'FREditForm',
	border: false, autoScroll: true,
	html: FR.T('Your current software version is %1').replace('%1', FR.currentVersion),
	tbar: [
		{
			id: 'updates-restart-btn',
			text: FR.T('Start again'),
			iconCls: 'fa fa-fw fa-reply',
			hidden: true,
			handler: function() {
				this.ownerCt.ownerCt.setTitle(FR.T('Step 1:')+' '+FR.T('Check for updates'));
				this.ownerCt.ownerCt.update('');
				this.hide();
				Ext.getCmp('updates-install-btn').hide();
				Ext.getCmp('updates-check-btn').show();
			}
		},
		{
			id: 'updates-check-btn',
			text: FR.T('Check for updates'),
			cls: 'fr-btn-primary',
			iconCls: 'fa fa-fw fa-refresh color-white',
			handler: function() {
				this.ownerCt.ownerCt.el.mask(FR.T('Loading...'));
				Ext.Ajax.request({
					url: FR.URLRoot+'/?module=software_update&section=cpanel&page=check',
					success: function(originalRequest) {
						this.el.unmask();
						var response = eval('('+originalRequest.responseText+')');
						this.update(response.msg);
						if (response.rs) {
							this.setTitle(FR.T('Step 2:')+' '+FR.T('Download update'));
							Ext.getCmp('updates-download-btn').show();
							Ext.getCmp('updates-check-btn').hide();
							FR.updateDownloadURL = response.url;
							FR.updateDownloadSize = response.size;
						}
					},
					failure: function() {},
					scope: this.ownerCt.ownerCt
				});
			}
		},
		{
			id: 'updates-download-btn',
			text: FR.T('Download update'),
			cls: 'fr-btn-primary',
			iconCls: 'fa fa-fw fa-download color-white',
			hidden: true,
			handler: function() {
				this.ownerCt.ownerCt.el.mask(FR.T('Loading...'));
				Ext.Ajax.request({
					url: FR.URLRoot+'/?module=software_update&section=cpanel&page=download',
					params: {
						downloadURL: FR.updateDownloadURL,
						downloadSize: FR.updateDownloadSize
					},
					success: function(originalRequest) {
						this.el.unmask();
						var response = eval('('+originalRequest.responseText+')');
						this.update(response.msg);
						if (response.success) {
							this.setTitle(FR.T('Step 3:')+' '+FR.T('Install update'));
							Ext.getCmp('updates-install-btn').show();
							Ext.getCmp('updates-download-btn').hide();
						}
					},
					failure: function() {},
					scope: this.ownerCt.ownerCt
				});
			}
		},
		{
			id: 'updates-install-btn',
			text: FR.T('Install update'),
			cls: 'fr-btn-primary',
			iconCls: 'fa fa-fw fa-flash color-white',
			hidden: true,
			handler: function() {
				this.ownerCt.ownerCt.el.mask(FR.T('Loading...'));
				Ext.getCmp('updates-restart-btn').show();
				Ext.Ajax.request({
					url: FR.URLRoot+'/?module=software_update&section=cpanel&page=install',
					success: function(originalRequest) {
						this.el.unmask();
						this.update('<pre>'+originalRequest.responseText+'</pre>');
					},
					failure: function() {},
					scope: this.ownerCt.ownerCt
				});
			}
		}
	]
});
Ext.getCmp('appTab').add(panel);
Ext.getCmp('appTab').doLayout();