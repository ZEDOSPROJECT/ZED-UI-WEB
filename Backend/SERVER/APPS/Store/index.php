<HTML>
  <HEAD>
    <script>
      function openApp(app){
        window.location.href = "http://localhost:3031/API/APPS/ExistsAppAndRedirect.php?appName="+app;
      }
      function loadType(type){
        window.location.href = "index.php?type="+type;
      }
    </script>
  </HEAD>
  <BODY>
      <div class="topBar">
        <?php
          $type=$_GET['type'];
          if($type=="game"){
            echo('<div class="typeIcon selected"><img class="typeImg" width="24" height="24" src="imgs/games.png"/><div class="typelbl">Games</div></div>');
          }else{
            echo('<div onclick="loadType(\'game\')" class="typeIcon"><img class="typeImg" width="24" height="24" src="imgs/games.png"/><div class="typelbl">Games</div></div>');
          }
          if($type=="music"){
            echo('<div class="typeIcon selected"><img class="typeImg" width="24" height="24" src="imgs/music.png"/><div class="typelbl">Music</div></div>');
          }else{
            echo('<div onclick="loadType(\'music\')" class="typeIcon"><img class="typeImg" width="24" height="24" src="imgs/music.png"/><div class="typelbl">Music</div></div>');
          }
          if($type=="video"){
            echo('<div class="typeIcon selected"><img class="typeImg" width="24" height="24" src="imgs/video.png"/><div class="typelbl">Video</div></div>');
          }else{
            echo('<div onclick="loadType(\'video\')" class="typeIcon"><img class="typeImg" width="24" height="24" src="imgs/video.png"/><div class="typelbl">Video</div></div>');
          }
          if($type=="picture"){
            echo('<div class="typeIcon selected"><img class="typeImg" width="24" height="24" src="imgs/picture.png"/><div class="typelbl">Picture</div></div>');
          }else{
            echo('<div onclick="loadType(\'picture\')" class="typeIcon"><img class="typeImg" width="24" height="24" src="imgs/picture.png"/><div class="typelbl">Picture</div></div>');
          }
          if($type=="internet"){
            echo('<div class="typeIcon selected"><img class="typeImg" width="24" height="24" src="imgs/internet.png"/><div class="typelbl">Internet</div></div>');
          }else{
            echo('<div onclick="loadType(\'internet\')" class="typeIcon"><img class="typeImg" width="24" height="24" src="imgs/internet.png"/><div class="typelbl">Internet</div></div>');
          }
          if($type=="office"){
            echo('<div class="typeIcon selected"><img class="typeImg" width="24" height="24" src="imgs/office.png"/><div class="typelbl">Office</div></div>');
          }else{
            echo('<div onclick="loadType(\'office\')" class="typeIcon"><img class="typeImg" width="24" height="24" src="imgs/office.png"/><div class="typelbl">Office</div></div>');
          }
          if($type=="developper"){
            echo('<div class="typeIcon selected"><img class="typeImg" width="24" height="24" src="imgs/developer.png"/><div class="typelbl">Devs</div></div>');
          }else{
            echo('<div onclick="loadType(\'developper\')" class="typeIcon"><img class="typeImg" width="24" height="24" src="imgs/developer.png"/><div class="typelbl">Devs</div></div>');
          }
        ?>
      </div>
    <div class="mainPage">
      <?php
        if(!isset($_GET['type'])){
          header('Location: index.php?type=all');
          exit;
        }
        $json = json_decode(file_get_contents('http://zed-os.sourceforge.net/store/getAppList.php?type='.$_GET['type']),false);
        for ($i=0; $i < sizeof($json->files); $i++) { 
          echo('<div class="appCard" onClick="openApp(\''.$json->files[$i]->file.'\')">');
          echo('<img class="appIcon" src="http://zed-os.sourceforge.net/store/DIRECTORY/'.$json->files[$i]->file.'/favicon.png"/>');
          echo('<div class="appTitle"><h2>'.$json->files[$i]->file.'</h2></div>');
          echo("</div>");
        } 
      ?>
    </div>
  </BODY>
</HTML>

<link rel="stylesheet" type="text/css" href="css/style.css" />
