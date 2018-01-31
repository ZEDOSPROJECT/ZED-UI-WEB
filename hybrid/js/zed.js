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

function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4();
}
