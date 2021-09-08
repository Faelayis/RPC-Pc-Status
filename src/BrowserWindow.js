const { app, globalShortcut, BrowserWindow, ipcMain } = require("electron");
const log = require("electron-log");
const { setbuttonslabel, setbuttonsurl } = require("./store");
// const path = require("path");
app.on("browser-window-focus", function () {
  globalShortcut.register("CommandOrControl+R", () => {
    // console.log("CommandOrControl+R is pressed: Shortcut Disabled");
  });
  globalShortcut.register("F5", () => {
    // console.log("F5 is pressed: Shortcut Disabled");
  });
});

const mainWindow = new BrowserWindow({
  width: 800,
  height: 600,
  show: false,
  resizable: false,
  autoHideMenuBar: true,
  webPreferences: {
    nodeIntegration: true,
    nativeWindowOpen: false,
    contextIsolation: false,
  },
});
mainWindow.loadFile("./src/page/index.html");
ipcMain.once("synchronous-userinfo", (event) => {
  event.returnValue = [
    "Not connected",
    "",
    undefined,
    `https://cdn.discordapp.com/embed/avatars/0.png?size=1024`,
  ];
});

let isminimize = false;
exports.CreateWindow = () => {
  if (mainWindow.isVisible()) {
    isminimize = true;
    if (isminimize === false) {
      mainWindow.hide();
    } else {
      mainWindow.focus();
    }
  } else {
    mainWindow.show();
  }
};
mainWindow.on("minimize", function () {
  isminimize = true;
});

mainWindow.on("close", function (event) {
  event.preventDefault();
  mainWindow.hide();
});

exports.webupdate = (userinfo) => {
  log.log("Web Update");
  ipcMain.once("synchronous-userinfo", (event) => {
    event.returnValue = userinfo;
  });
  ipcMain.on('asynchronous-buttonsinput', (arg) => {
    console.log(arg)
    setbuttonslabel(arg[0],arg[2]);
    setbuttonsurl(arg[1],arg[3]);
 })
  mainWindow.loadFile("./src/page/index.html");
};

log.log(`BrowserWindow Ready`);
