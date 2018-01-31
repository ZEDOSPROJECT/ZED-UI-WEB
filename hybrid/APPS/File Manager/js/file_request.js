FR = {
	initUploader: function () {
		this.status = document.getElementById('upStatus');
		document.getElementById('firstStep').style.display = 'block';
		if (!UploadChunkSize) {UploadChunkSize = 2086912;}
		this.flow = new Flow({
			target: URLRoot+'/?module=weblinks&section=default&page=public_upload', progressCallbacksInterval: 100,
			startOnSubmit: false, maxChunkRetries: 3, resumeLargerThan: 10485760, maxSimultaneous: 1,
			chunkSize: UploadChunkSize, query: function() {
				return {
					id: WebLinkId,
					pass: WebLinkPass,
					path: UploadToPath,
					senderName: document.getElementById('senderName').value
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
			document.getElementById('successMsg').style.display = 'none';
			document.getElementById('lastStep').style.display = 'block';
		});
		this.flow.on('uploadStart', function() {
			FR.status.innerHTML = 'Upload starting...';
		});
		this.flow.on('progress', function(flow) {
			var percent = Math.floor(flow.getProgress()*100);
			FR.status.innerHTML = 'Uploading...'+percent+'%';
		});
		this.flow.on('fileSuccess', function(file, message) {
			try {var rs =  eval('(function(){return'+message+';})()');} catch (er) {
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
			FR.status.innerHTML = '';
			document.getElementById('lastStep').style.display = 'none';
			document.getElementById('nameInput').style.display = 'none';
			document.getElementById('successMsg').style.display = 'block';
		});
		FlowUtils.DropZoneManager.add({
			domNode: document.body, findTarget: function(e) {return {el: document.body};}, overClass: 'dragged-over',
			onDrop: this.flow.onDrop, scope: this
		});
	},
	selectFiles: function() {
		this.flow.removeAll();
		this.flow.browseFiles();
	},
	startUpload: function() {
		this.flow.start();
	}
};