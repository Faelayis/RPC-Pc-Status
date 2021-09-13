const { app, globalShortcut, BrowserWindow, ipcMain } = require("electron");
const isDev = require("electron-is-dev");
const log = require("electron-log");
const { setbutton, seticonlargeImageKey } = require("./store");
// const path = require("path");

const mainWindow = new BrowserWindow({
  width: 800,
  height: 600,
  show: false,
  resizable: false,
  autoHideMenuBar: true,
  webPreferences: {
    nodeIntegration: true,
    enableRemoteModule: true,
    nativeWindowOpen: false,
    contextIsolation: false,
    webSecurity: true,
  },
});
mainWindow.loadFile("./src/page/index.html");
mainWindow.once("ready-to-show", () => {
  log.info("Web Ready to show");
  ipcMain.once("synchronous-userinfo", (event) => {
    event.returnValue = [
      "Not connected",
      null,
      null,
      `https://cdn.discordapp.com/embed/avatars/0.png?size=1024`,
    ];
  });
  if (isDev) {
    mainWindow.webContents.openDevTools();
    mainWindow.setAutoHideMenuBar(false);
  } else {
    mainWindow.setMenu(null);
    mainWindow.setAutoHideMenuBar(true);
    app.on('browser-window-focus', function () {
      globalShortcut.register("CommandOrControl+R", () => { });
      globalShortcut.register("F5", () => { });
    });
  }
  ipcMain.on("asynchronous-buttonsinput", (event, arg) => {
    setbutton(arg[0], arg[1], arg[2], arg[3]);
  });
  ipcMain.on("asynchronous-largeImageKey", (event, arg) => {
    seticonlargeImageKey(arg);
  });
});

this.isminimize = false;
exports.mainWindowshow = () => {
  if (mainWindow.isVisible()) {
    this.isminimize = true;
    if (this.isminimize === false) {
      mainWindow.hide();
    } else {
      mainWindow.focus();
    }
  } else {
    mainWindow.show();
  }
};

mainWindow.on("minimize", function () {
  this.isminimize = true;
});

mainWindow.on("close", function (event) {
  if (!app.isQuiting) {
    event.preventDefault();
    mainWindow.hide();
  }
  return false;
});

exports.webupdate = (userinfo) => {
  log.info("Web Update");
  ipcMain.once("synchronous-userinfo", (event) => {
    event.returnValue = userinfo;
  });
  mainWindow.loadFile("./src/page/index.html");
};

log.info(`BrowserWindow Ready`);
