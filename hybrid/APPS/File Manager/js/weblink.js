FR = {
	hideHeader: true, itemHasThumb: false, largeThumbMaxSize: 500,
	initUploader: function () {
		this.status = document.getElementById('upStatus');
		document.getElementById('upbtn').style.display = 'inline-block';
		if (!UploadChunkSize) {UploadChunkSize = 2086912;}
		this.flow = new Flow({
			target: URLRoot+'/?module=weblinks&section=default&page=public_upload', progressCallbacksInterval: 100,
			startOnSubmit: true, maxChunkRetries: 3, resumeLargerThan: 10485760, maxSimultaneous: 1,
			chunkSize: UploadChunkSize,
			query: function() {
				return {
					id: WebLinkId,
					pass: WebLinkPass,
					path: UploadToPath
				};
			},
			validateGetOffsetResponse: function(file, status, message) {
				if (status == 200) {
					try {var rs = eval('(function(){return'+message+';})()');} catch (er){return false;}
					if (rs && rs.success) {
						if (rs.offset) {
							rs.offset = parseInt(rs.offset);
							if (!isNaN(rs.offset) && isFinite(rs.offset)) {
								file.offset = rs.offset;
							}
						}
						return true;
					}
				}
			}, validateGetOffsetResponseScope: this,
			validateChunkResponse: function(status, message) {
				if (status != '200') {return 'retry';}
				try {var rs = eval('(function(){return'+message+';})()');} catch (er){return 'retry';}
				if (rs) {if (rs.success) {return 'success';} else {return 'error';}}
			}, validateChunkResponseScope: this
		});
		this.flow.on('filesSubmitted', function() {
			FR.status.style.display = 'inline-block';
			FR.status.innerHTML = 'Upload starting...';
		});
		this.flow.on('progress', function(flow) {
			var percent = Math.floor(flow.getProgress()*100);
			FR.status.innerHTML = 'Uploading...'+percent+'%';
		});
		this.flow.on('fileSuccess', function(file, message) {
			try {
				eval('(function(){return'+message+';})()');
			} catch (er) {
				FR.status.innerHTML = 'Unexpected server reply: ' + message;
			}
		});
		this.flow.on('fileError', function(file, message) {
			try {var rs = eval('(function(){return'+message+';})()');} catch (er){
				FR.status.innerHTML = 'Unexpected server reply: '+message;
			}
			if (rs && rs.msg) {FR.status.innerHTML = rs.msg;}
		});
		this.flow.on('complete', function() {
			FR.status.innerHTML = 'Refreshing page...';
			document.location.reload();
		});
		FlowUtils.DropZoneManager.add({
			domNode: document.body, findTarget: function() {return {el: document.body};}, overClass: 'dragged-over',
			onDrop: this.flow.onDrop, scope: this
		});
	},
	startUpload: function() {
		this.flow.removeAll();
		this.flow.browseFiles();
	},
	getShortestColumn: function(offset) {
		var heights = [];
		var col;
		var shortest = 0;
		jQuery.each(this.columns, function(i, item) {
			var h = item.height()+offset;
			if (shortest) {
				if (h <= shortest) {
					shortest = h;
					col = item;
				}
			} else {
				shortest = h;
				col = item;
			}
		});
		return col;
	},
	loadedCount: 0,
	totalCount: 0,
	lastProgressChange: 0,
	initGallery: function() {
		this.totalCount = window.itemCount;
		this.loadBar = new Nanobar({id:'loadBar'});
		if (this.totalCount > 0) {
			FR.loadBar.go(1);
		}
		$("#gallery-folders").justifiedGallery({
			rowHeight: 120,
			maxRowHeight: 120,
			margins: 5,
			border: 5,
			justifyThreshold: 0.8,
			captionSettings : {
				animationDuration : 500,
				visibleOpacity : 0.7,
				nonVisibleOpacity : 0.3
			}
		});
		var g = $("#gallery").justifiedGallery({
			rowHeight: 160,
			margins: 5,
			border: 5,
			waitThumbnailsLoad: false
		});
		g.on('jg.itemcomplete', function (e) {
			FR.loadedCount++;
			var change = Math.round(FR.loadedCount / FR.totalCount * 100);
			if (change != FR.lastProgressChange) {
				FR.loadBar.go(change);
			}
			FR.lastProgressChange = change;
		});
		$('.swipebox').swipebox();
	},
	loadLargeThumb: function() {
		var img = $('<img>');
		img.on('load', function() {
			var i = $(this);
			var naturalWidth = i.prop('width');
			if (naturalWidth < FR.largeThumbMaxSize) {
				i.attr('width', Math.round(naturalWidth/2));
			} else {
				i.attr('width', FR.largeThumbMaxSize);
			}
			i.attr('height', 'auto');
			i.hide();
			$('#theIcon').remove();
			$('#thumbHolder').append(i);
			if (naturalWidth > 256) {
				$('#thumbHolder').css('float', 'none');
				$('#comments').css('width', (parseInt(i.attr('width'))+10)+'px');
			}
			i.fadeIn();
		});
		var double = FR.largeThumbMaxSize*2;
		img.attr('src', itemURL+'&thumbnail=1&width='+double+'&height='+double);
	},
	acceptTerms: function() {
		$('#terms').hide();
		document.location.href= FR.currentDownloadURL;
	},
	cancelTerms: function() {
		$('#terms').hide();
	},
	download: function(url) {
		if (hasTerms) {
			FR.currentDownloadURL = url || downloadURL;
			$('#terms').show();
		} else {
			document.location.href = url || downloadURL;
		}
	}
};
var hasGallery, allowsUploads;
$(document).ready(function() {
	$("#header").headroom({offset: 70});
	if (FR.itemHasThumb) {
		FR.loadLargeThumb();
	}
	if (hasGallery) {
		FR.initGallery();
	}
	if (allowsUploads) {
		FR.initUploader();
	}
});