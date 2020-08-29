<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Photo Viewer</title>

    <link rel="stylesheet" href="css/style.css" />
  </head>

  <body>
    <table class="tb">
      <tr>
        <td class="imageCntainer">
          <img draggable="false" id="theImage" class="image" src="" />
        </td>
      </tr>
      <tr>
        <td class="toolbarContainer" align="center">
          <div class="toolbar">
            <img draggable="false" class="button" onclick="goBack()" src="icons/back.png" />
            <img draggable="false" class="button" onclick="goNext()" src="icons/next.png" />
            <img draggable="false" class="button" src="icons/print.png" />
            <img draggable="false" class="button" onclick="setAsWallpaper()" src="icons/setAsWallpaper.png" />
          </div>
        </td>
      </tr>
    </table>

    <script>
      let fileList=[];
      let currentIndex=0;
      
      const Http = new XMLHttpRequest();
      const localFile = getUrlVars()["path"];
      document.title = localFile.replace(/^.*[\\\/]/, '').split(".")[0]+" - ZED Picture Viewer";
      let url = "http://"+window.location.hostname + ":3031/API/SYSTEM/IO/PATH/listPath.php?path=" + localFile;
      url = url.substr(0, url.lastIndexOf("/"));

      fetch(url)
      .then(response => response.json())
      .then(json => {
          const JSONdata=JSON.parse(json);
          let index=0;
          JSONdata.data.forEach(element => {
            if(element.type=="file" && (element.name !== "." && (element.name !== ".."))){
              const nameArr=element.name.split('.');
              if(nameArr.length>=2){
                const extension = nameArr[1].toLowerCase();
                if(extension=="jpg" || extension=="jpeg" || extension=="png" || extension=="gif" ){
                  fileList.push(url+"/"+element.name);
                  if(localFile.includes(element.name)){
                    currentIndex=index;
                    document.getElementById("theImage").src =
                      "http://"+window.location.hostname +
                      ":3031/API/SYSTEM/IO/FILE/read.php?path=" +
                      fileList[index].split('=')[1];
                  } 
                  index++;
                }   
              } 
              
            } 
          });
      });

      function setAsWallpaper(){
        fetch("http://"+window.location.hostname +
          ":3031/API/SYSTEM/SETTINGS/USER/SETTING/setWallpaper.php?path=" +
          document.getElementById("theImage").src.split("=")[1]);
      } 

      function goNext(){
        if(currentIndex==fileList.length-1){
          currentIndex=0;
        }else{
          currentIndex++;
        } 
        document.getElementById("theImage").src =
          "http://"+window.location.hostname +
          ":3031/API/SYSTEM/IO/FILE/read.php?path=" +
          fileList[currentIndex].split('=')[1];
          document.title = fileList[currentIndex].split('=')[1].replace(/^.*[\\\/]/, '').split(".")[0]+" - ZED Picture Viewer";
      } 

      function goBack(){
        if(currentIndex==0){
          currentIndex=fileList.length-1;
        }else{
          currentIndex--;
        } 
        document.getElementById("theImage").src =
          "http://"+window.location.hostname +
          ":3031/API/SYSTEM/IO/FILE/read.php?path=" +
          fileList[currentIndex].split('=')[1];
          document.title = fileList[currentIndex].split('=')[1].replace(/^.*[\\\/]/, '').split(".")[0]+" - ZED Picture Viewer"
      } 

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
  </body>
</html>
