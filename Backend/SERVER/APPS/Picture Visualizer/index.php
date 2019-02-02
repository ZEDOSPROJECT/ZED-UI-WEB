<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Photo Viwer</title>

    <link rel="stylesheet" href="css/style.css" />
  </head>

  <body>
    <table class="tb">
      <tr>
        <td class="imageCntainer">
          <center>Loading picture . . .</center>
          <img id="theImage" class="image" src="" />
        </td>
      </tr>
      <tr>
        <td class="toolbarContainer" align="center">
          <div class="toolbar">
            <img class="button" onclick="goBack()" src="icons/back.png" />
            <img class="button" onclick="goNext()" src="icons/next.png" />
            <img class="button" src="icons/print.png" />
            <img class="button" src="icons/setAsWallpaper.png" />
          </div>
        </td>
      </tr>
    </table>

    <script>
      let fileList=[];
      let currentIndex=0;
      
      const Http = new XMLHttpRequest();
      let url="http://"+window.location.hostname + ":3031/API/SYSTEM/IO/PATH/listPath.php?path=" + getUrlVars()["path"];
      url = url.substr(0, url.lastIndexOf("/"));

      fetch(url)
      .then(response => response.json())
      .then(json => {
          const JSONdata=JSON.parse(json);
          let index=0;
          JSONdata.data.forEach(element => {
            if(element.type=="file" && (element.name !== "." && (element.name !== ".."))){
              const extension = element.name.split('.')[1].toLowerCase();

              if(extension=="jpg" || extension=="jpeg" || extension=="png" || extension=="gif" ){
                fileList.push(url+"/"+element.name);
                if(getUrlVars()["path"].includes(element.name)){
                  currentIndex=index;
                  document.getElementById("theImage").src =
                    "http://"+window.location.hostname +
                    ":3031/API/SYSTEM/IO/FILE/read.php?path=" +
                    fileList[index].split('=')[1];
                } 
                index++;
              } 
            } 
          });
      });

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
