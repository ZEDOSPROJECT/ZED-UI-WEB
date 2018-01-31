Ext.onReady(function() {

	FR.app = {
		found: 0,
		remaining: 0,
		pbar: new Ext.ProgressBar({
			height: 3, animate: true, hidden: true
		}),
		collect: function() {
			this.status.update('Collecting file list...');
			Ext.Ajax.request({
				url: URLRoot+'/?module=metadata&section=index&action=collect',
				method: 'post',
				params: 'path='+encodeURIComponent(FR.path),
				callback: function(opts, succ, req) {
					try {
						var rs = Ext.decode(req.responseText);
					} catch (er){
						this.collect();
						return false;
					}
					var msg = '';
					if (rs.found) {
						this.found = rs.found;
						msg = FR.T('%1 files found').replace('%1', Ext.util.Format.number(rs.found, '0,000'));
					}
					if (rs.completed) {
						msg += '<br>';
						msg += FR.T('Indexing files...');
					}
					this.status.update(msg);
					if (rs.completed) {
						if (rs.found > 0) {
							this.pbar.show();
							this.process();
						} else {
							this.status.update(FR.T('The folder seems to be empty'));
						}
					} else {
						this.collect();
					}
				}, scope: this
			});
		},
		process: function() {
			Ext.Ajax.request({
				url: URLRoot+'/?module=metadata&section=index&action=process',
				method: 'post',
				params: 'path='+encodeURIComponent(FR.path),
				callback: function(opts, succ, req) {
					try {
						var rs = Ext.decode(req.responseText);
					} catch (er){
						this.status.update(FR.T('There are problems with the server.')+'<br>'+FR.T('Retrying...'));
						window.setTimeout(function (){FR.app.process();}, 5000);
						return false;
					}
					FR.app.remaining = rs.remaining;
					var msg = FR.T('Indexing files...');
					msg += '<br>';
					msg += FR.T('%1 remaining').replace('%1', Ext.util.Format.number(rs.remaining, '0,000'));
					this.status.update(msg);
					if (!rs.completed) {
						this.process();
					}
					this.updateProgress();
				}, scope: this
			});
		},
		updateProgress: function() {
			if (this.remaining == 0) {
				this.status.update(FR.T('Indexing completed!'));
				Ext.getCmp('cancelBtn').setText(FR.T('Close'));
			}
			this.pbar.updateProgress((this.found-this.remaining)/this.found);
		}
	};

	new Ext.Viewport({
		layout: 'border',
		items: [

			{
				region: 'north',
				bodyStyle: 'position: relative;',
				height: 100,
				html: '<div style="text-align:center; position: absolute;top: 50%;left: 50%;transform: translate(-50%, -50%);min-width:300px" id="status">'+
					FR.T('Please note that this will import metadata from the files and can overwrite metadata which you have manually added.')
				+'</div>'
			},
			{
				region: 'center',
				id: 'north',
				items: FR.app.pbar,
				buttonAlign: 'center',
				buttons: [
					{
						cls: 'fr-btn-default fr-btn-primary',
						text: FR.T('Start'), id: 'startBtn',
						handler: function(){
							this.hide();
							FR.app.collect();
						}
					},
					{
						cls: 'fr-btn-default', style:'margin-left:10px',
						text: FR.T('Cancel'), id: 'cancelBtn',
						handler: function(){window.parent.FR.UI.popups.metadataIndex.close();}
					}
				]
			}
		],
		listeners: {
			'afterrender': function() {
				FR.app.status = Ext.get('status');
			}
		}
	});
});