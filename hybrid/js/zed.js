// API Functions //////////////////////////////////////////////////////

function ShowMSG(type,text){
	// Types of Messages
	// MSG_ERROR
	// MSG_ALERT
	// MSG_INFO
	// MSG_SUCESS
	var uuid=guid();
	var alerts=document.getElementById("Alerts");
	alerts.innerHTML=alerts.innerHTML+"<div id='"+uuid+"' class='"+type+"' onclick='$(this).fadeOut();$(this).remove()' hidden>"+text+"</div>";
	$( "#"+uuid+"" ).fadeIn("slow");
}

function listPath(path){
	$.ajax({ 
			type: 'GET', 
			url: 'API/listPath.php?path='+path, 
			data: { get_param: 'value' }, 
			dataType: 'json',
			success: function (data) { 
					$.each(data, function(index, element) {
							console.log(element);
					});
			},
			error:function(data){
				console.log(data.responseText);
			}
	});
}

function getPATH_SYSTEM(){
	return window.location.href;
}

/////////////////////////////////////////////////////////////////////////

function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4();
}


function inClose(id){
	document.getElementById("TASK_"+id).remove();
}

function swicthWindow(id){
	var win=document.getElementById("WIN_"+id);
	if(win.style.display=="none"){
		win.style.display="";
	}else{
		win.style.display="none";
	}
}
//listPath("/");