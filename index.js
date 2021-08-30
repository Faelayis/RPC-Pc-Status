const { app, BrowserWindow, ipcMain } = require('electron');
const { autoUpdater } = require('electron-updater');
const package = require('./package.json');
autoUpdater.channel = (package.autoUpdater_channel)
//latest
//beta
//alpha

autoUpdater.setFeedURL({
  provider: "github",
  owner: "Faelayis",
  repo: "RPC-Pc-Status",
});

let loading_screen
function create_loading_screen() {
  loading_screen = new BrowserWindow({
    width: 268,
    height: 190,
    resizable: false,
    transparent: true,
    frame: false,
    alwaysOnTop: true,
    show: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    }
  });
  loading_screen.loadURL(`file://${__dirname}/loading.html`)

  loading_screen.once('ready-to-show', () => {
    loading_screen.show()
  })

  loading_screen.on('closed', function () {
    loading_screen = null
  });
};

app.on('ready', () => {
  create_loading_screen()
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  if (mainWindow === null) {
    create_loading_screen()
  }
})

function sendStatusToloading(StatusToloading) {
  ipcMain.on('ApplicationsendStatusToloading', (event) => {
    event.sender.send('ApplicationsendStatusToloading', (StatusToloading))
  })
}
ipcMain.on('ApplicationsendStatusToloading-async', (event, arg) => {
  console.log(arg)
})

autoUpdater.on('checking-for-update', () => {
  if (process.env.NODE_ENV === "development") {
  } else {
    loading_screen.show()
    console.log('checking for update')
    sendStatusToloading('Checking for ' + (package.autoUpdater_channel) + ' update');
  }
})
autoUpdater.on('update-available', () => {
  console.log('update available')
  sendStatusToloading((package.autoUpdater_channel) + ' Update available');
  loading_screen.loadURL(`file://${__dirname}/loading.html`)
})
autoUpdater.on('update-not-available', () => {
  console.log('Update not available')
  sendStatusToloading((package.autoUpdater_channel) + ' Update not available.');
  loading_screen.loadURL(`file://${__dirname}/loading.html`)
  setTimeout(function () {
    createWindow()
  }, 5000);
})
autoUpdater.on('error', (err) => {
  if (process.env.NODE_ENV === "development") {

  } else {
    console.log('Update error')
    sendStatusToloading(err);
    loading_screen.loadURL(`file://${__dirname}/loading.html`)
    loading_screen.setBounds({ height: 203 })
    setTimeout(function () {
      loading_screen.loadURL(`file://${__dirname}/loading.html`)
      app.quit()
    }, 15000);
  }
})
autoUpdater.on('download-progress', (progressObj) => {
  console.log('download progress')
  sendStatusToloading("Download " + progressObj.percent + '%');
  loading_screen.loadURL(`file://${__dirname}/loading.html`)
  let log_message = "Download speed: " + progressObj.bytesPerSecond;
  log_message = log_message + ' - Downloaded ' + progressObj.percent + '%';
  log_message = log_message + ' (' + progressObj.transferred + "/" + progressObj.total + ')';
  console.log(log_message)
})
autoUpdater.on('update-downloaded', (ev, releaseNotes, releaseName) => {
  console.log('update-downloaded')
  loading_screen.loadURL(`file://${__dirname}/loading.html`),
    sendStatusToloading('Update installer');
  autoUpdater.quitAndInstall();
})

app.on('ready', function () {
  if (process.env.NODE_ENV === "development") {

  } else {
    autoUpdater.checkForUpdates();
  }
});