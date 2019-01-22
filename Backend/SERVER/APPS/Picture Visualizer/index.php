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
            <img class="button" src="icons/back.png" />
            <img class="button" src="icons/next.png" />
            <img class="button" src="icons/print.png" />
            <img class="button" src="icons/setAsWallpaper.png" />
          </div>
        </td>
      </tr>
    </table>

    <script>
      document.getElementById("theImage").src =
        "http://"+window.location.hostname +
        ":3031/API/SYSTEM/IO/FILE/read.php?path=" +
        getUrlVars()["path"];

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
