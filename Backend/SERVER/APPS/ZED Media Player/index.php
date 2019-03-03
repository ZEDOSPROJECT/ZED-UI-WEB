<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <title>ZED Media Player</title>
    <link rel="stylesheet" href="css/style.css" />
  </head>
  <body>
    <video id="thePlayer" src="" controls></video>
  </body>
</html>

<script>
  let fileList=[];
  let currentIndex=0;
  
  const Http = new XMLHttpRequest();
  const localFile = getUrlVars()["path"];

  let thePlayer=document.getElementById("thePlayer");

  thePlayer.src =
  "http://"+window.location.hostname +
  ":3031/API/SYSTEM/IO/FILE/read.php?path=" +
  localFile;

  function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(
      /[?&]+([^=&]+)=([^&]*)/gi,
      function(m, key, value) {
        vars[key] = value;
      }
    );
    return vars;
  }
</script>
