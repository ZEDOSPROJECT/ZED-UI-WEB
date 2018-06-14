
<?php
  $useragent=$_SERVER['HTTP_USER_AGENT'];
  $PLATFORM="";
  if(preg_match('/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i',$useragent)||preg_match('/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|ZEDOS|zeto|zte\-/i',substr($useragent,0,4)))
  {
    $PLATFORM="MOBILE";
  } else{
      $PLATFORM="WEB";
  } 
  if(strpos($useragent,"Electron"))
  {
    $PLATFORM="DESKTOP";
  }
?>
<meta name="viewport" http-equiv="Content-Type" content="width=device-width, initial-scale=1.0">
<script>
	if (location.protocol != 'http:')
	{
	 location.href = 'http:' + window.location.href.substring(window.location.protocol.length);
	}
</script>
<script src="js/clock.js"></script>
<script src="js/jquery.js" onload="window.$ = window.jQuery = module.exports;"></script>
<script src="js/zed.js" type="text/javascript"></script> 
<!-- <script src='file:///android_asset/app.js'></script> -->
<link href='https://fonts.googleapis.com/css?family=Days+One' rel='stylesheet' type='text/css'>
<link href='https://cdnjs.cloudflare.com/ajax/libs/angular.js/1.5.8/angular.min.js' rel='stylesheet' type='text/css'>
<link rel='stylesheet prefetch' href='http://ajax.googleapis.com/ajax/libs/jqueryui/1.11.2/themes/smoothness/jquery-ui.css'>

<HTML>
  <HEAD>
    <TITLE>ZED OS (WEBDEVELOPMENT)</TITLE>
		<link href="https://fonts.googleapis.com/icon?family=Material+Icons"
      rel="stylesheet">
		<link rel="stylesheet" href="css/style.css">
  </HEAD>
  <body>
    <div id="walls">
      	<img id="wallpaper_picture" class="wallpaper"></img>
		    <video id="wallpaper_video" class="wallpaper" autoplay muted loop></video>
    </div>
    <div id="statusBar" hidden>
      <div id="clock"></div>	
		<i class="material-icon battery">
			<span class="percent-20"></span>
		</i>
		<img id="lanStatus" style="position: fixed;top: 5px;right: 40px;height: 13px;width: 18px;" src="Icons/lan.png"> </img>
    </div>
    <div id="mainMenu" hidden>
      <div id="menuContainer">
          <?php 
            foreach(scandir("APPS") as $dir){
              if($dir!="." and $dir!="..")
                if(strpos(file_get_contents("APPS/".$dir."/PLATFORMS"),$PLATFORM))
                  echo '<div class="menuItem" onclick="OpenApp(\'APPS/'.$dir.'\')"><div style="background-image: url(\'APPS/'.$dir."/favicon.png".'\')" class="menuIcons"></div><div class="menuLabel">'.$dir.'</div></div>';
            }
          ?>
      </div>
    </div>
    <img id="menuIcon" src="Icons/menu.png" onclick="menuOpen()" hidden>
    <div id="dock" hidden>
      <center id="taskBar">
        <img src="Icons/appstore.png" class="dockIcons">
        <img src="Icons/music.png" class="dockIcons">
        <img src="Icons/browser.png" class="dockIcons">
        <img src="Icons/files.png" class="dockIcons">
      </center>
    </div>
    <div id="bottomBar" hidden>
        <center>
          <img src="Icons/SystemIcons/back.png" class="dockIcons" onclick="GoBack()">
          <img style="margin-right:100px;margin-left:100px;" src="Icons/SystemIcons/home.png" class="dockIcons" onclick='GoHome()'>
          <img src="Icons/SystemIcons/tasks.png" class="dockIcons">
        </center>
      </div>
      <iframe id="MobileFrame" frameBorder="0" src="" hidden></iframe>  
      <div Id="Desktop" class="Desktop">
			
     </div> 
      <div id="Alerts">
	  </div>
  </body>
</HTML>
<script>
  function GoBack(){
  }

    var menu=false;
    var APPIDs=0;
    
    function OpenApp(id){
		if(getPlatform()=="MOBILE"){
        document.getElementById("MobileFrame").hidden=false;
        document.getElementById("MobileFrame").src=id+"/index.php";
        $("#statusBar").css("background-color", "black")
        $("#bottomBar").show();
        $( "#dock" ).hide();
      }else{
        var appID=guid();
        document.getElementById("taskBar").innerHTML+="<img id='TASK_"+appID+"' src='"+id+"/favicon.png' onclick='swicthWindow(\""+appID+"\");' class='dockIcons'>";
        var WindowModel = '<div class="frame"  id="WIN_'+appID+'">'+
  '<div class="topbar">'+
  '<img style="height:16px;margin:2px;float: left;" src="'+id+"/favicon.png"+'">'+
  '<p style="height:16px;margin:2px;float: left;">'+id.split("/")[1]+'</p>'+
  '<div class="maxbtn"><span></span></div>'+
  '<div class="xbtn" onclick="inClose(\''+appID+'\')">x</div>'+
  '</div>'+
  '<div class="content">';
	if(getPlatform()=="DESKTOP"){
		WindowModel+='<webview useragent="Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.170 Safari/537.36 Viv/1.95.1077.50" disablewebsecurity plugins nodeintegration plugins nodeIntegration="false" webSecurity="false" allowRunningInsecureContent="true" id="FRM_'+appID+'" src="'+id+"/index.php"+'" frameborder="0"></webview>';
	}
	else{
		WindowModel+='<iframe id="FRM_'+appID+'" src="'+id+"/index.php"+'" frameborder="0"></iframe>';
	}
	  WindowModel+='</div>'+
	  '</div>';
        var desktop=document.getElementById("Desktop");
        
          var win = document.createElement("div");
          win.innerHTML=WindowModel;
          Desktop.appendChild(win);
          $('.frame').mousedown(function(){
          $(".active").removeClass("active");
          $(this).addClass("active");
        });
        $('.frame').not(".maximized").resizable({
          alsoResize: ".active .content",
          minWidth: 200,
          minHeight: 59
        }).draggable({
          handle: ".topbar"
        });
        
        //COLOR CHANGNG
        $('.swatches span').click(function(){
          var color = $(this).attr("class");
          $(this).parent().parent().attr("class", "topbar").addClass(color);
        });
        
        //MAXIMIZED
        $('.maxbtn').click(function(){
          $(this).parent().parent().toggleClass("maximized");
        });
        
        //CLOSE
        $('.xbtn').click(function(){
          $(this).parent().parent().remove();
        });

      }
      menu=false;
      document.getElementById("menuIcon").src="Icons/menu.png";
      $( "#mainMenu" ).fadeOut( "fast", function() {
      });
    }
    
    startTime();
    if(getPlatform()=="MOBILE"){
      $("#mainMenu").css("width", "90%");
      $("#menuContainer").css("width", "95%");
    }
    $( document ).ready(function() {
      $( "#statusBar" ).fadeIn( "slow", function() {
      });
      $( "#menuIcon" ).fadeIn( "slow", function() {
      });
      $( "#dock" ).slideDown( "slow", function() {
      });
    });  
    
    function menuOpen(){
      if(menu){
        document.getElementById("menuIcon").src="Icons/menu.png";
        $( "#mainMenu" ).fadeOut( "fast", function() {
        });
        document.getElementById("mainMenu" ).hidden=true;
        menu=false;
      }else{
        document.getElementById("menuIcon").src="Icons/menu1.png";
        if(document.getElementById("MobileFrame").hidden){
            $( "#mainMenu" ).fadeIn( "fast", function() {
            }); 
            document.getElementById("mainMenu" ).hidden=false;
            menu=true;
        }else{
          $( "#mainMenu" ).fadeIn( "fast", function() {
            menu=true;
          });
        }
      }
    }

    function GoHome(){
      $("#statusBar").css("background-color", "rgba(0,0,0,0.7)");
      document.getElementById("menuIcon").src="Icons/menu.png";
      document.getElementById("MobileFrame").hidden=true;
      $( "#mainMenu" ).fadeOut( "fast", function() {
      });
      menu=false;
      $( "#dock" ).show();
      $("#bottomBar").hide();
    }

    function getPlatform() { 
        if( navigator.userAgent.match(/Android/i)
          || navigator.userAgent.match(/webOS/i)
          || navigator.userAgent.match(/ZEDOS/i)
          || navigator.userAgent.match(/iPhone/i)
          || navigator.userAgent.match(/iPad/i)
          || navigator.userAgent.match(/iPod/i)
          || navigator.userAgent.match(/BlackBerry/i)
          || navigator.userAgent.match(/Windows Phone/i)){
            return "MOBILE"
          }
          if( navigator.userAgent.match(/Electron/i))
         {
           return "DESKTOP"
         }else{
          return "ONLINE"
        } 
    }	
	
	var batteryElement = document.getElementsByClassName('battery')[0];

var battery;

function updateAllBatteryInfo() {
  updateChargeInfo();
  updateLevelInfo();
  updateChargingInfo();
  updateDischargingInfo();
}

function updateChargingInfo() {
  console.log("Battery charging time: " + battery.chargingTime + " seconds");
}

function updateChargeInfo() {
  console.log("Battery charging? " + (battery.charging ? "Yes" : "No"));
  if (battery.charging) {
    if (!batteryElement.classList.contains('charging')) {
      batteryElement.classList.add('charging');
    }
  } else {
    if (batteryElement.classList.contains('charging')) {
      batteryElement.classList.remove('charging');
    }
  }
}

function updateDischargingInfo() {
  console.log("Battery discharging time: " + battery.dischargingTime + " seconds");
}

function updateLevelInfo() {
  console.log("Battery level: " + parseFloat(battery.level * 100).toPrecision(2) + "%");
  var percent = batteryElement.getElementsByTagName('span')[0];
  var percentNumber = parseInt(battery.level * 100);
  if (parseInt(percentNumber) > 100) {
    percentNumber = 100;
  }
  percent.className = 'percent-' + percentNumber.toString();
}

if (!!navigator.getBattery) {
  navigator.getBattery().then(function (bat) {
    battery = bat;
    updateAllBatteryInfo();

    battery.addEventListener('chargingchange', function () {
      updateChargeInfo();
    });

    battery.addEventListener('levelchange', function () {
      updateLevelInfo();
    });

    battery.addEventListener('chargingtimechange', function () {
      updateChargingInfo();
    });

    battery.addEventListener('dischargingtimechange', function () {
      updateDischargingInfo();
    });
  });
} else {
  battery = {
    charging: false,
    level: 1.0
  };
  updateChargeInfo();
  updateLevelInfo();
  setInterval(function () {
	// Battery
    if (battery.level < 0.02 && !battery.charging) {
      battery.charging = true;
      battery.level = parseFloat(battery.level + .01).toPrecision(2);
      updateChargeInfo();
      updateLevelInfo();
    }
    if (battery.level >= 1.0 && battery.charging) {
      battery.charging = false;
      updateChargeInfo();
    }
    if (battery.charging) {
      battery.level = parseFloat(battery.level) + parseFloat(.01);
      updateLevelInfo();
    } else {
      if (battery.level < .10) {
        battery.level = parseFloat(battery.level - .01).toPrecision(1);
      } else {
        battery.level = parseFloat(battery.level - .01).toPrecision(2);
      }
      updateLevelInfo();
    }
	///////////////////////
  }, 5000);
}

setInterval(function(){
	// get Settings
	$.ajax({url: "/APPS/Settings/settings.json", success: function(result){
		var settigns = JSON.parse(result);
		var picture=document.getElementById("wallpaper_picture");
		var video=document.getElementById("wallpaper_video");
		if(settigns.wallpaper_PATH.toLowerCase().includes(".mp4")){
			if(video.paused){
				video.src=settigns.wallpaper_PATH;
				$("#wallpaper_video").show();
        		$( "#wallpaper_picture" ).hide();
			}
		}else{
			$("#wallpaper_picture").show();
        	$( "#wallpaper_video" ).hide();
			picture.src=settigns.wallpaper_PATH;
			video.pause();
		}
    }});
	//////////////////////////
},500)
</script>
<script src='http://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.3/jquery.min.js'></script>
<script src='http://ajax.googleapis.com/ajax/libs/jqueryui/1.11.2/jquery-ui.min.js'></script>
<script  src="js/index.js"></script>
