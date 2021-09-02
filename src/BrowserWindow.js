const { BrowserWindow, ipcMain } = require("electron");
// const path = require("path");
const mainWindow = new BrowserWindow({
  width: 800,
  height: 600,
  show: false,
  resizable: false,
  webPreferences: {
    nodeIntegration: true,
    nativeWindowOpen: true,
    contextIsolation: false,
  },
});

let isminimize = false;
exports.CreateWindow = () => {
  mainWindow.loadFile("./src/page/index.html");
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
  const { username, useravatar } = require("./RichPresence");
  ipcMain.on("synchronous-useravatars", (event) => {
    event.returnValue = useravatar;
  });
  ipcMain.on("synchronous-username", (event) => {
    event.returnValue = username;
  });
};
mainWindow.on("minimize", function () {
  isminimize = true;
});

mainWindow.on("close", function (event) {
  event.preventDefault();
  mainWindow.hide();
});
