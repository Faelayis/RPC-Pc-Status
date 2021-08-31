const process = require("process");
const { app } = require("electron");
const isDev = require("electron-is-dev");
const AutoLaunch = require("auto-launch");
const gotTheLock = app.requestSingleInstanceLock();
const log = require("electron-log");
require("./log.js");

const DiscordPcStatus = new AutoLaunch({
  name: "RPC-Pc-Status",
  path: app.getPath("exe"),
  isHidden: true,
});

if (isDev) {
  log.log(`Running in development ${app.getVersion()}`);
  DiscordPcStatus.disable();
} else {
  log.log(`Running in production ${app.getVersion()}`);
  DiscordPcStatus.enable();
  DiscordPcStatus.isEnabled()
    .then((isEnabled) => {
      if (isEnabled) {
        return;
      }
      DiscordPcStatus.enable();
    })
    .catch((err) => {
      log.error(`AutoLaunch error:${err}`);
    });
}

if (process.platform === "win32") {
  app.setAppUserModelId(app.name);
}

app.on("ready", () => {
  log.log("App ready");
  require("./store");
  require("./RichPresence");
  let myWindow = null;
  if (!gotTheLock) {
    app.quit();
  } else {
    app.on("second-instance", () => {
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
