const { app, BrowserWindow } = require('electron')
const path = require('path')
const url = require('url')
let pluginName = '/PepperFlashPlayer-linux.so';
require('flash-player-loader').addSource(__dirname + pluginName).load();

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win

function createWindow() {
  // Create the browser window.
  win = new BrowserWindow({
    width: 800,
    height: 600,
    fullscreen: true,
    kiosk: true,
    'webPreferences': {
      "plugins": true,
      "webSecurity": true,
      "webgl": true,
      "nodeIntegration": true,
      "allowDisplayingInsecureContent": true,
      "scrollBounce": false,
      "webviewTag": true
    }
  })
  win.setMenu(null);
  win.onbeforeunload = (e) => {
    e.returnValue = false;
  }
  // win.webContents.openDevTools()

  setTimeout(() => {
    win.loadURL('http://localhost:3031', { userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.66 Safari/537.36' });
  }, 200);
  // and load the index.html of the app.
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.

app.commandLine.appendSwitch('use-bundled-ca');
app.commandLine.appendSwitch('force-fips');
app.commandLine.appendSwitch('enable-fips');
app.commandLine.appendSwitch('openssl-config');
app.commandLine.appendSwitch('use-openssl-ca');
app.commandLine.appendSwitch('autoplay-policy', 'no-user-gesture-required');
app.disableHardwareAcceleration();
app.commandLine.appendSwitch("disable-software-rasterizer");

app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow()
  }
})

  // In this file you can include the rest of your app's specific main process
  // code. You can also put them in separate files and require them here.





