<HTML>
  <HEAD>
    <script>
      <?php
        echo 'let currentType="'.$_GET['type'].'";';
      ?>

      let timerKeys=null;
      function openApp(app){
        window.location.href = "http://localhost:3031/API/APPS/ExistsAppAndRedirect.php?appName="+app;
      }
      function loadType(type){
        window.location.href = "index.php?type="+type;
      }
      function search(ele) {
          if(timerKeys !== null){
            clearTimeout(timerKeys);
          }
          timerKeys=setTimeout(function(){
            window.location.href = "index.php?type="+currentType+"&query="+ele.value;
          }, 30);
          if(event.key === 'Enter') {
            window.location.href = "index.php?type="+currentType+"&query="+ele.value;
          }
      }
    </script>
    <title>Store</title>
  </HEAD>
  <BODY>
      <div class="topBar">
        <?php
          if(isset($_GET['type'])){
            $type=$_GET['type'];
          }else{
            $type="all";
          }
          if(isset($_GET['query'])){
            $query=$_GET['query'];
          }else{
            $query="";
          }
          if($type=="game"){
            echo('<div class="typeIcon selected"><img class="typeImg" width="24" height="24" src="imgs/games.png"/></div>');
          }else{
            echo('<div onclick="loadType(\'game\')" class="typeIcon"><img class="typeImg" width="24" height="24" src="imgs/games.png"/></div>');
          }
          if($type=="music"){
            echo('<div class="typeIcon selected"><img class="typeImg" width="24" height="24" src="imgs/music.png"/></div>');
          }else{
            echo('<div onclick="loadType(\'music\')" class="typeIcon"><img class="typeImg" width="24" height="24" src="imgs/music.png"/></div>');
          }
          if($type=="video"){
            echo('<div class="typeIcon selected"><img class="typeImg" width="24" height="24" src="imgs/video.png"/></div>');
          }else{
            echo('<div onclick="loadType(\'video\')" class="typeIcon"><img class="typeImg" width="24" height="24" src="imgs/video.png"/></div>');
          }
          if($type=="picture"){
            echo('<div class="typeIcon selected"><img class="typeImg" width="24" height="24" src="imgs/picture.png"/></div>');
          }else{
            echo('<div onclick="loadType(\'picture\')" class="typeIcon"><img class="typeImg" width="24" height="24" src="imgs/picture.png"/></div>');
          }
          if($type=="internet"){
            echo('<div class="typeIcon selected"><img class="typeImg" width="24" height="24" src="imgs/internet.png"/></div>');
          }else{
            echo('<div onclick="loadType(\'internet\')" class="typeIcon"><img class="typeImg" width="24" height="24" src="imgs/internet.png"/></div>');
          }
          if($type=="office"){
            echo('<div class="typeIcon selected"><img class="typeImg" width="24" height="24" src="imgs/office.png"/></div>');
          }else{
            echo('<div onclick="loadType(\'office\')" class="typeIcon"><img class="typeImg" width="24" height="24" src="imgs/office.png"/></div>');
          }
          if($type=="developper"){
            echo('<div class="typeIcon selected"><img class="typeImg" width="24" height="24" src="imgs/developer.png"/></div>');
          }else{
            echo('<div onclick="loadType(\'developper\')" class="typeIcon"><img class="typeImg" width="24" height="24" src="imgs/developer.png"/></div>');
          }
          echo('<input type="text" autofocus value="'.$query.'" placeholder="Search '.$type.'" onkeydown="search(this)" class="inputFind" />');
        ?>
      </div>
    <div class="mainPage">
      <?php
        session_start();
        if(!isset($_GET['type'])){
          header('Location: index.php?type=all');
          exit;
        }
        $json = json_decode(file_get_contents('http://zed-os.sourceforge.net/store/getAppList.php?type='.$_GET['type'].'&query='.$_GET['query']),false);
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
