/* eslint-disable no-fallthrough */
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
  if (handleSquirrelEvent()) {
    return;
  }
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

app.once("ready", async () => {
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

function handleSquirrelEvent() {
  if (process.argv.length === 1) {
    return false;
  }
  const ChildProcess = require("child_process");
  const path = require("path");
  const appFolder = path.resolve(process.execPath, "..");
  const rootAtomFolder = path.resolve(appFolder, "..");
  const updateDotExe = path.resolve(path.join(rootAtomFolder, "Update.exe"));
  const exeName = path.basename(process.execPath);
  const spawn = function (command, args) {
    // eslint-disable-next-line no-unused-vars
    let spawnedProcess, error;
    try {
      spawnedProcess = ChildProcess.spawn(command, args, { detached: true });
    } catch (error) {
      log.error(error);
    }
    return spawnedProcess;
  };
  const spawnUpdate = function (args) {
    return spawn(updateDotExe, args);
  };
  const squirrelEvent = process.argv[1];
  switch (squirrelEvent) {
    case "--squirrel-install":
      spawnUpdate(["--createShortcut", exeName]);
    case "--squirrel-updated":
      setTimeout(app.quit, 1000);
      return true;
    case "--squirrel-uninstall":
      spawnUpdate(["--removeShortcut", exeName]);
      setTimeout(app.quit, 1000);
      return true;
    case "--squirrel-obsolete":
      app.quit();
      return true;
  }
}
