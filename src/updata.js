const process = require("process");
const path = require("path");
const os = require("os");
const { format } = require("util");
const package = require("../package.json");
const log = require("electron-log");
const {
  app,
  autoUpdater,
  dialog,
  Notification,
  nativeImage,
} = require("electron");
const isDev = require("electron-is-dev");
const iconpath = nativeImage.createFromPath(
  // eslint-disable-next-line no-undef
  path.join(__dirname, "icon/updateavailable.png")
);
autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = "info";

const userAgent = format(
  "%s/%s (% s: %s)",
  package.name,
  package.version,
  os.platform(),
  os.arch()
);

const supportedPlatforms = ["darwin", "win32"];
const feedURL = `https://update.electronjs.org/${
  package.author.name
}/RPC-Pc-Status/${process.platform}-${process.arch}/${app.getVersion()}`;
const requestHeaders = { "User-Agent": userAgent };
let allow = true,
  AutoupdataRun = true,
  silent = Boolean,
  Interval = Number;

log.info("Updata feedURL:", feedURL);
log.info("Updata requestHeaders:", requestHeaders);
autoUpdater.setFeedURL(feedURL, requestHeaders);
autoUpdater.on("checking-for-update", () => {
  if (silent) {
    null;
  } else if (!silent) {
    log.info(`Checking for update...`);
  }
});
autoUpdater.on("update-available", () => {
  log.info("Update available.");
  if (AutoupdataRun === true) {
    startautoupdata(false);
  }
  if (silent) {
    null;
  } else if (!silent) {
    new Notification({
      title: "Update available",
      body: `Found New version download automatically \ncomplete you will be notified.`,
    }).show();
  }
});
autoUpdater.on("update-not-available", () => {
  if (silent) {
    if (!AutoupdataRun) {
      startautoupdata(true);
    }
    allow = true;
  } else if (!silent) {
    log.info("Update not available.");
    new Notification({
      title: "Update not available",
      body: `You are now using ${app.getVersion()} the latest version.`,
    }).show();
    if (!AutoupdataRun) {
      startautoupdata(true);
    }
    allow = true;
  }
});
autoUpdater.on("error", (message) => {
  log.error(`Update error: ${message}`);
  allow = false;
  if (silent) {
    if (!AutoupdataRun) {
      startautoupdata(true);
    }
    allow = true;
  } else if (!silent) {
    dialog
      .showMessageBox({
        type: "error",
        buttons: ["ok"],
        title: "RPC Pc Status Update Error",
        message: "There was a problem updating the application",
        detail: `${message}`,
        noLink: true,
      })
      .then((returnValue) => {
        if (returnValue.response === 0) {
          if (!AutoupdataRun) {
            startautoupdata(true);
          }
          allow = true;
        }
      });
  }
});

autoUpdater.on(
  "update-downloaded",
  (event, releaseNotes, releaseName, releaseDate, updateURL) => {
    log.warn("Update downloaded", [
      event,
      releaseNotes,
      releaseName,
      releaseDate,
      updateURL,
    ]);
    allow = false;
    if (silent) {
      autoUpdater.quitAndInstall();
      app.exit(0);
    } else if (!silent) {
      dialog
        .showMessageBox({
          type: "info",
          buttons: ["Restart App", "Later"],
          title: "RPC Pc Status Update",
          detail: `A new version has been downloaded. Restart the application to apply the updates.`,
          noLink: true,
          icon: iconpath,
        })
        .then((returnValue) => {
          if (returnValue.response === 0) {
            autoUpdater.quitAndInstall();
            app.exit(0);
          } else if (returnValue.response === 1) {
            if (!AutoupdataRun) {
              startautoupdata(true);
            }
            allow = true;
          }
        });
    }
  }
);

exports.Checkupdates = (arg) => {
  if (allow === true) {
    allow = false;
    if (AutoupdataRun === true) {
      startautoupdata(false);
    }
    silent = arg;
    if (
      typeof process !== "undefined" &&
      process.platform &&
      !supportedPlatforms.includes(process.platform)
    ) {
      log.warn(
        `Electron's autoUpdater does not support the '${process.platform}' platform`
      );
      if (silent) {
        allow = true;
      } else if (!silent) {
        dialog
          .showMessageBox({
            type: "error",
            buttons: ["ok"],
            title: "RPC Pc Status Update Error",
            message: "There was a problem updating the application",
            detail: `Updater does not support the '${process.platform}' platform`,
            noLink: true,
          })
          .then((returnValue) => {
            if (returnValue.response === 0) {
              allow = true;
            }
          });
      }
    }
    if (isDev) {
      log.warn(`Updata: not support Running in development`);
      if (silent) {
        allow = true;
      } else if (!silent) {
        dialog
          .showMessageBox({
            type: "error",
            buttons: ["ok"],
            title: "RPC Pc Status Update Error",
            message: "There was a problem updating the application",
            detail: `Updater not support Running in development`,
            noLink: true,
          })
          .then((returnValue) => {
            if (returnValue.response === 0) {
              allow = true;
            }
          });
      }
    } else {
      autoUpdater.checkForUpdates();
    }
  }
};

function startautoupdata(b) {
  switch (b) {
    case false:
      log.info(`Autoupdata: Pause`);
      clearInterval(Interval);
      AutoupdataRun = false;
      break;
    case true:
      log.info(`Autoupdata: Start`);
      AutoupdataRun = true;
      Interval = setInterval(() => {
        log.info(`Autoupdata: run`);
        silent = true;
        autoUpdater.checkForUpdates();
      },5 * 60 * 1000 );
      break;
  }
}

log.info(`Updata Ready`);
