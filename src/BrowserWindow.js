const { BrowserWindow, ipcMain } = require("electron");
// const path = require("path");
const mainWindow = new BrowserWindow({
  width: 800,
  height: 600,
  show: false,
  resizable: false,
  webPreferences: {
    nodeIntegration: true,
    nativeWindowOpen: false,
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
  const { userinfo } = require("./RichPresence");
  ipcMain.on("synchronous-userinfo", (event) => {
    event.returnValue = userinfo;
  });
};
mainWindow.on("minimize", function () {
  isminimize = true;
});

mainWindow.on("close", function (event) {
  event.preventDefault();
  mainWindow.hide();
});
