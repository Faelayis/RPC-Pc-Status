const process = require("process");
const { app } = require("electron");
const isDev = require("electron-is-dev");
const AutoLaunch = require("auto-launch");
const log = require("electron-log");
const { tray } = require("./tray");
const gotTheLock = app.requestSingleInstanceLock();
require("./log.js");

const RPC = new AutoLaunch({
  name: "RPC-Pc-Status",
  path: app.getPath("exe"),
  isHidden: true,
});

if (isDev) {
  log.log(`Running in development ${app.getVersion()}`);
  RPC.disable();
} else {
  log.log(`Running in production ${app.getVersion()}`);
  RPC.enable();
  RPC.isEnabled()
    .then((isEnabled) => {
      if (isEnabled) {
        return;
      }
      RPC.enable();
    })
    .catch((err) => {
      log.error(`AutoLaunch error:${err}`);
    });
}

if (process.platform === "win32") {
  app.setAppUserModelId(app.name);
}

app.on("ready", async () => {
  log.log("App ready");
  await require("./store");
  await tray();
  await require("./RichPresence");
  let myWindow = null;
  if (!gotTheLock) {
    app.quit();
  } else {
    app.once("second-instance", () => {
      if (myWindow) {
        if (myWindow.isMinimized()) {
          myWindow.restore();
        }
        myWindow.focus();
      }
    });
    app.whenReady().then(() => {
      myWindow = null;
    });
  }
});
