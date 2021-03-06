const { app, globalShortcut, BrowserWindow, ipcMain } = require("electron");
const isDev = require("electron-is-dev");
const log = require("electron-log");
const path = require("path");
const package = require("../package.json");
const { getvalue, setvalue } = require("./store");

this.isready = false;
this.isminimize = false;
let mainWindow = new BrowserWindow({
  title: `${package.apptitle}`,
  width: 800,
  height: 600,
  show: false,
  resizable: false,
  autoHideMenuBar: true,
  icon: path.join(__dirname, "icon/default.png"),
  webPreferences: {
    nodeIntegration: true,
    enableRemoteModule: true,
    nativeWindowOpen: false,
    contextIsolation: false,
    webSecurity: true,
  },
});
mainWindow.loadFile(path.join(__dirname, "page/index.html"));
mainWindow.once("ready-to-show", () => {
  log.info("Web Ready to show");
  if (isDev) {
    mainWindow.webContents.openDevTools();
    mainWindow.setAutoHideMenuBar(false);
  } else {
    mainWindow.setMenu(null);
    mainWindow.setAutoHideMenuBar(true);
    app.on("browser-window-focus", function () {
      globalShortcut.register("CommandOrControl+R", () => {});
      globalShortcut.register("F5", () => {});
    });
  }
  ipcMain.on("asynchronous-buttonsinput", (event, arg) => {
    setvalue("buttonsCustom", [arg[0], arg[1], arg[2], arg[3]]);
  });
  ipcMain.on("asynchronous-largeImageKey", (event, arg) => {
    setvalue("largeImageKeyCustom", arg);
  });
  this.isready = true;
});

exports.mainWindowshow = () => {
  if (this.isready) {
    if (mainWindow.isVisible()) {
      this.isminimize = true;
      !this.isminimize ? mainWindow.hide() : mainWindow.focus();
    } else {
      mainWindow.show();
    }
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
exports.wupdate = (userinfo) => {
  mainWindow.webContents.send("synchronous-userinfo", userinfo);
};

log.info(`BrowserWindow Ready`);
