<!DOCTYPE html>
<html>

<head>
  <meta charset="utf-8">
  <title>ZED Media Player</title>
  <meta name="generator" content="Google Web Designer 5.0.4.0226">
  <link href="gwdvideo_style.css" rel="stylesheet" data-version="16" data-exports-type="gwd-video">
  <style type="text/css" id="gwd-text-style">
    p {
      margin: 0px;
    }
    h1 {
      margin: 0px;
    }
    h2 {
      margin: 0px;
    }
    h3 {
      margin: 0px;
    }
  </style>
  <style type="text/css">
    html, body {
      width: 100%;
      height: 100%;
      margin: 0px;
    }
    body {
      background-color: black;
      transform: perspective(1400px) matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
      transform-style: preserve-3d;
      left: 0%;
      top: 0%;
    }
    .gwd-video-1slo {
      position: absolute;
      transform-origin: 569.5px 299.5px 0px;
      height: 99.76%;
      width: 100%;
      left: 0px;
      top: 0px;
      background-image: none;
      background-color: rgb(0, 0, 0);
    }
    .gwd-div-1b7f {
      position: absolute;
      transform-origin: 610.5px 30.5px 0px;
      background-image: none;
      left: 0px;
      background-color: rgb(1, 1, 1);
      height: 80px;
      bottom: 0%;
      width: 100%;
      opacity: 70;
    }
    .gwd-div-6nvh {
      opacity: 100;
      width: 40px;
      height: 40px;
      background-color: rgb(1, 74, 191);
      margin: 10px;
    }
    .gwd-div-6nvh:hover {
      background-color: rgb(0, 102, 191);
    }
    .timeLine {
      width: 97%;
    }
    input[type="range"] {
      -webkit-appearance: none;
      width: 100%;
      margin: 6px 0px;
    }
    input[type="range"]:focus {
      outline: none;
    }
    input[type="range"]::-webkit-slider-runnable-track {
      width: 100%;
      height: 3px;
      cursor: pointer;
      box-shadow: rgba(0, 0, 0, 0) 0px 0px 0px, rgba(13, 13, 13, 0) 0px 0px 0px;
      background: rgb(0, 0, 59);
      border-radius: 0px;
      border: 0px solid rgba(0, 0, 0, 0);
    }
    input[type="range"]::-webkit-slider-thumb {
      box-shadow: rgb(255, 255, 255) 0.5px 0.5px 0.7px, rgb(255, 255, 255) 0px 0px 0.5px;
      border: 1.8px solid rgb(0, 0, 0);
      height: 15px;
      width: 14px;
      border-radius: 50px;
      background: rgb(255, 255, 255);
      cursor: pointer;
      -webkit-appearance: none;
      margin-top: -6px;
    }
    input[type="range"]:focus::-webkit-slider-runnable-track {
      background: rgb(0, 0, 59);
    }
  </style>
  <script data-source="googbase_min.js" data-version="4" data-exports-type="googbase" src="googbase_min.js"></script>
  <script data-source="gwd_webcomponents_min.js" data-version="6" data-exports-type="gwd_webcomponents" src="gwd_webcomponents_min.js"></script>
  <script data-source="gwdvideo_min.js" data-version="16" data-exports-type="gwd-video" src="gwdvideo_min.js"></script>
  <script type="text/javascript" gwd-events="support" src="gwd-events-support.1.0.js"></script>
  <script type="text/javascript" gwd-events="handlers">
    gwd.auto_ControlsBarMouseover = function(event) {
      // GWD Predefined Function
      gwd.actions.events.setInlineStyle('ControlsBar', 'transition: all 0.2s linear; opacity: 0.7;');
    };
    gwd.auto_ControlsBarMouseout = function(event) {
      // GWD Predefined Function
      gwd.actions.events.setInlineStyle('ControlsBar', 'transition: all 3.5s ease; opacity: 0;');
    };
    
    setInterval(function() {
      let player = document.getElementById("gwd-video_1");
      let timeLine = document.getElementById("timeLine");
      timeLine.min = 0;
      timeLine.max = player.duration;
      timeLine.value = player.currentTime;
    }, 900)

    function playPause() {
      let player = document.getElementById("gwd-video_1");
      let btn_play = document.getElementById("btn_play");
      let btn_pause = document.getElementById("btn_pause");
      if (player.paused) {
        player.play();
        btn_play.hidden = false;
        btn_pause.hidden = true;
      } else {
        btn_play.hidden = true;
        btn_pause.hidden = false;
        player.pause();
      }
    };

    function setTime(e) {
      let timeLine = document.getElementById("timeLine");
      let player = document.getElementById("gwd-video_1");
      player.currentTime = timeLine.value;
    }
    
    setTimeout(function(){
      let player = document.getElementById("gwd-video_1");
      let fileList = [];
      let currentIndex = 0;
      const Http = new XMLHttpRequest();
      const localFile = getUrlVars()["path"];
      player.src = "http://" + window.location.hostname + ":3031/API/SYSTEM/IO/FILE/read.php?path=" + localFile;
    },300);

    function getUrlVars() {
      var vars = {};
      var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m, key, value) {
        vars[key] = value;
      });
      return vars;
    }
  </script>
  <script type="text/javascript" gwd-events="registration">
    // Código de suporte para manipulação de eventos no Google Web Designer
     // Este bloco de script é gerado automaticamente. Não edite.
    gwd.actions.events.registerEventHandlers = function(event) {
      gwd.actions.events.addHandler('ControlsBar', 'mouseover', gwd.auto_ControlsBarMouseover, false);
      gwd.actions.events.addHandler('ControlsBar', 'mouseout', gwd.auto_ControlsBarMouseout, false);
    };
    gwd.actions.events.deregisterEventHandlers = function(event) {
      gwd.actions.events.removeHandler('ControlsBar', 'mouseover', gwd.auto_ControlsBarMouseover, false);
      gwd.actions.events.removeHandler('ControlsBar', 'mouseout', gwd.auto_ControlsBarMouseout, false);
    };
    document.addEventListener("DOMContentLoaded", gwd.actions.events.registerEventHandlers);
    document.addEventListener("unload", gwd.actions.events.deregisterEventHandlers);
  </script>
</head>

<body class="htmlNoPages">
  <video id="gwd-video_1" class="gwd-video-1slo" autoplay="" poster="placeholder.png"></video>
  <div class="gwd-div-1b7f gwd-new-class-1y5j" id="ControlsBar">
    <center>
      <input min="0" max="100" value="0" type="range" id="timeLine" class="timeLine" onchange="setTime()">
      <div class="gwd-div-6nvh" style="border-radius: 50%;" id="btn_play" onclick="playPause()">
        <img draggable="false" width="40" src="./assets/pause.png">
        <img>
      </div>
      <div hidden="" class="gwd-div-6nvh" style="border-radius: 50%;" id="btn_pause" onclick="playPause()">
        <img draggable="false" width="40" src="./assets/play.png">
        <img>
      </div>
    </center>
  </div>
</body>

</html>