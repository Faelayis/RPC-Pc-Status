const process = require("process");
const { app } = require("electron");
const log = require("electron-log");
require("./log");
const isDev = require("electron-is-dev");
const AutoLaunch = require("auto-launch");
const gotTheLock = app.requestSingleInstanceLock();

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
  log.log("App Ready");
  await require("./store");
  const { tray } = await require("./tray");
  await tray();
  await require("./RichPresence");
  let myWindow = null;
  if (!gotTheLock) {
    log.warn(`The app is already open!`);
    app.exit(0);
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
