<HTML>
  <HEAD>
    <TITLE>Store</TITLE>
    <script>
      function openApp(app){
        window.location.href = "http://localhost:3031/API/APPS/ExistsAppAndRedirect.php?appName="+app;
      }
    </script>
  </HEAD>
  <BODY>
    <?php
      $json = json_decode(file_get_contents('http://zed-os.sourceforge.net/store/getAppList.php'),false);
      for ($i=0; $i < sizeof($json->files); $i++) { 
        echo('<div class="appCard" onClick="openApp(\''.$json->files[$i]->file.'\')">');
        echo('<img class="appIcon" src="http://zed-os.sourceforge.net/store/DIRECTORY/'.$json->files[$i]->file.'/favicon.png"/>');
        echo('<div class="appTitle"><h2>'.$json->files[$i]->file.'</h2></div>');
        echo("</div>");
      } 
    ?>
  </BODY>
</HTML>

<link rel="stylesheet" type="text/css" href="css/style.css" />
