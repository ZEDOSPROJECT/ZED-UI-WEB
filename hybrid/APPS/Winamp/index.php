<!DOCTYPE html>
<html>

<head>
    <title>Winamp2-js</title>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="description" content="Winamp 2.9 reimplemented in HTML5 and JavaScript" />
    <meta property="og:title" content="Winamp2-js &bull; Winamp in your browser" />
    <meta property="og:description" content="Winamp 2.9 reimplemented in HTML5 and JavaScript" />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="https://webamp.org" />
    <meta property="og:image" content="https://webamp.org<%= require('./images/preview.png') %>" />
    <link rel='stylesheet' type='text/css' href="<%= require('!file-loader?name=[path][name]-[hash].[ext]!./css/page.css') %>" />
    <link rel="shortcut icon" sizes="16x16 32x32" href="<%= require('./images/favicon.ico') %>">

    <!-- See https://goo.gl/OOhYW5 -->
    <!--
    The manifest.json file is generated and injected by `webpack-pwa-manifest`
    <link rel="manifest" href="./manifest.json">
    -->

    <!-- See https://goo.gl/qRE0vM -->
    <meta name="theme-color" content="#4b4b4b">

    <!-- Add to homescreen for Chrome on Android. Fallback for manifest.json -->
    <meta name="mobile-web-app-capable" content="yes">
    <meta name="application-name" content="Winamp">

    <!-- Add to homescreen for Safari on iOS -->
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
    <meta name="apple-mobile-web-app-title" content="Winamp">

    <!-- Homescreen icons -->
    <link rel="apple-touch-icon" href="<%= require('./images/manifest/icon-48x48.png') %>">
    <link rel="apple-touch-icon" sizes="72x72" href="<%= require('./images/manifest/icon-72x72.png') %>">
    <link rel="apple-touch-icon" sizes="96x96" href="<%= require('./images/manifest/icon-96x96.png') %>">
    <link rel="apple-touch-icon" sizes="144x144" href="<%= require('./images/manifest/icon-144x144.png') %>">
    <link rel="apple-touch-icon" sizes="192x192" href="<%= require('./images/manifest/icon-192x192.png') %>">

    <!-- Tile icon for Windows 8 (144x144 + tile color) -->
    <meta name="msapplication-TileImage" content="<%= require('./images/manifest/icon-144x144.png') %>">
    <meta name="msapplication-TileColor" content="#4b4b4b">
    <meta name="msapplication-tap-highlight" content="no">

    <!-- Load and register service worker that adds offline support -->
    <script>
      if ('serviceWorker' in navigator) {
        window.addEventListener('load', function() {
          navigator.serviceWorker.register('/service-worker.js');
        });
      }
    </script>
</head>

<body>
    <div id='app'>
        <div id="loading">
            Loading<span class="ellipsis-anim"><span>.</span><span>.</span><span>.</span></span>
        </div>
    </div>
    <div id='browser-compatibility'>
        <p>Your browser does not support the features we need.</p>
        <p>Try using the most recent version of Chrome, Firefox, Safari or Edge.</p>
    </div>
    <p class='about'>
        <a href='mailto:jordan@jordaneldredge.com?subject=Winamp2-js%20Feedback'>Feedback</a> |
        <a href='https://github.com/captbaritone/winamp2-js'>GitHub</a>
    </p>
    <script type="text/javascript" src="https://www.dropbox.com/static/api/2/dropins.js" id="dropboxjs" data-app-key="7py29249dpeddu8"></script>
    <!-- Scripts get injected by html-webpack-plugin -->
</body>

</html>
