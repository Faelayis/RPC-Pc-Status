const { app } = require('electron');
const isDev = require('electron-is-dev');
var AutoLaunch = require('auto-launch');
const gotTheLock = app.requestSingleInstanceLock()

app.on('ready', function () {
  console.log('App ready');
  require('./store');
  require('./RichPresence');
  let myWindow = null
  if (!gotTheLock) {
    app.quit()
  } else {
    app.on('second-instance', (event, commandLine, workingDirectory) => {
      if (myWindow) {
        if (myWindow.isMinimized()) myWindow.restore()
        myWindow.focus()
      }
    })
    app.whenReady().then(() => {
      myWindow = null
    })
  }
});

let DiscordPcStatus = new AutoLaunch({
  name: 'RPC-Pc-Status',
  path: app.getPath('exe'),
  isHidden: true
});

if (isDev) {
  console.log('Running in development');
  DiscordPcStatus.disable();
} else {
  console.log('Running in production');
  DiscordPcStatus.enable();
  DiscordPcStatus.isEnabled()
    .then(function (isEnabled) {
      if (isEnabled) {
        return;
      }
      DiscordPcStatus.enable();
    })
    .catch(function (err) {
      // handle error
    });
}