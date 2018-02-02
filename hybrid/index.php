<meta name="viewport" http-equiv="Content-Type" content="width=device-width, initial-scale=1.0">
<script>
	if (location.protocol != 'http:')
	{
	 location.href = 'http:' + window.location.href.substring(window.location.protocol.length);
	}
</script>
<script src="js/clock.js"></script>
<script src="js/jquery.js"></script>
<script src="js/zed.js" type="text/javascript"></script> 
<!-- <script src='file:///android_asset/app.js'></script> -->
<link rel="stylesheet" type="text/css" href="css/style.css">
<link href='http://fonts.googleapis.com/css?family=Days+One' rel='stylesheet' type='text/css'>
<link rel='stylesheet prefetch' href='http://ajax.googleapis.com/ajax/libs/jqueryui/1.11.2/themes/smoothness/jquery-ui.css'>
<script src='http://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.3/jquery.min.js'></script>


<HTML>
  <HEAD>
    <TITLE>ZED OS (WEBDEVELOPMENT)</TITLE>
  </HEAD>
  <body>
    <div id="walls">
      <img id="wallpaper" src="Wallpaper/ZED.jpg">
      <!--<iframe id="wallpaper" src="http://www.youtube.com/embed/K-F4CeVsWHA?rel=0&amp;controls=0&amp;showinfo=0;autoplay=1;mute=1" frameborder="0" allow="autoplay; encrypted-media"></iframe>-->
    </div>
    <div id="statusBar" hidden>
      <div id="clock"></div>	
		<img id="battry_status" src="battery/5.png" style="position:absolute;top:5px;right:5px;width:30px;">
		<img id="battry_charging" src="battery/power.png" style="position:absolute;top:0px;right:20px;width:5px;">
    </div>
    <div id="mainMenu" hidden>
      <div id="menuContainer">
          <?php
            foreach(scandir("APPS") as $dir){
              if($dir!="." and $dir!="..")
                echo '<div class="menuItem" onclick="OpenApp(\'APPS/'.$dir.'\')"><div style="background-image: url(\'APPS/'.$dir."/favicon.png".'\')" class="menuIcons"></div><div class="menuLabel">'.$dir.'</div></div>';
            }
          ?>
      </div>
    </div>
    <img id="menuIcon" src="Icons/menu.png" onclick="menuOpen()" hidden>
    <div id="dock" hidden>
      <center>
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

  function updateBatteryUI(battery) {
    var batterIcon=document.getElementById("battry_status");
  /*	if(0 = (battery.level * 100)>90){
      batterIcon.src="battry/5.png";
    }

      dichargeTimeEl.textContent = battery.dischargingTime + ' Seconds';

      if (battery.charging === true) {
      chargingStateEl.textContent = 'Charging';
      } else if (battery.charging === false) {
      chargingStateEl.textContent = 'Discharging';
      }*/
  }
  
  function GoBack(){
	  ShowMSG("MSG_ERROR","FUNFOU");
  }

  function monitorBattery(battery) {
    // Update the initial UI.
    updateBatteryUI(battery);

    // Monitor for futher updates.
    battery.addEventListener('levelchange',
      updateBatteryUI.bind(null, battery));
    battery.addEventListener('chargingchange',
      updateBatteryUI.bind(null, battery));
    battery.addEventListener('dischargingtimechange',
      updateBatteryUI.bind(null, battery));
    battery.addEventListener('chargingtimechange',
      updateBatteryUI.bind(null, battery));
  }

  if ('getBattery' in navigator) {
    navigator.getBattery().then(monitorBattery);
  } else {
    ChromeSamples.setStatus('The Battery Status API is not supported on ' +
      'this platform.');
  }

    var isMobile=detectmob();
    var menu=false;
    var APPIDs=0;
    
    function OpenApp(id){
		if(isMobile){
		  document.getElementById("MobileFrame").hidden=false;
		  document.getElementById("MobileFrame").src=id+"/index.php";
		  $("#statusBar").css("background-color", "black")
		  $("#bottomBar").show();
		  $( "#dock" ).hide();
		}else{
		  var WindowModel = '<div class="frame"  id="website">'+
		'<div class="topbar blue">'+
		'<div class="maxbtn"><span></span></div>'+
		'<div class="xbtn">x</div>'+
		'</div>'+
		'<div class="content">'+
		'<iframe src="'+id+"/index.php"+'" frameborder="0"></iframe>'+
		'</div>'+
		'</div>';
			var desktop=document.getElementById("Desktop");
			Desktop.innerHTML=Desktop.innerHTML+WindowModel;

		}
		menu=false;
		document.getElementById("menuIcon").src="Icons/menu.png";
	  $( "#mainMenu" ).fadeOut( "fast", function() {
	  });
    }
    
    startTime();
    if(isMobile){
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

    function detectmob() { 
        if( navigator.userAgent.match(/Android/i)
          || navigator.userAgent.match(/webOS/i)
          || navigator.userAgent.match(/ZEDOS/i)
          || navigator.userAgent.match(/iPhone/i)
          || navigator.userAgent.match(/iPad/i)
          || navigator.userAgent.match(/iPod/i)
          || navigator.userAgent.match(/BlackBerry/i)
          || navigator.userAgent.match(/Windows Phone/i)
        ){
            return true;
        }else {
            return false;
        }
    }
</script>
<script src='http://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.3/jquery.min.js'></script>
<script src='http://ajax.googleapis.com/ajax/libs/jqueryui/1.11.2/jquery-ui.min.js'></script>
<script  src="js/index.js"></script>
