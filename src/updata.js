const { platform } = require("process");
const path = require("path");
const os = require("os");
const { format } = require("util");
const package = require("../package.json");
const log = require("electron-log");
const {
  app,
  dialog,
  Notification,
  nativeImage,
} = require("electron");
const isDev = require("electron-is-dev");
const iconpath = nativeImage.createFromPath(
  // eslint-disable-next-line no-undef
  path.join(__dirname, "icon/updateavailable.png")
);

let allow = true,
  AutoupdataRun = true,
  silent = Boolean,
  Interval = Number;

var supportedPlatforms = ["darwin", "win32", "linux"];
const options = {
  provider: "github",
  owner: "Faelayis",
  repo: "RPC-Pc-Status",
}
if (platform === "darwin" || platform === "win32") {
  var { autoUpdater } = require('electron');
  const userAgent = format(
    "%s/%s (% s: %s)",
    package.name,
    package.version,
    os.platform(),
    os.arch()
  );
  var feedURL = `https://update.electronjs.org/${package.author.name
    }/RPC-Pc-Status/${platform}-${process.arch}/${app.getVersion()}`;
  var requestHeaders = { "User-Agent": userAgent };
  autoUpdater.setFeedURL(feedURL, requestHeaders);
} else if (platform === "linux") {
  // eslint-disable-next-line no-redeclare
  var { AppImageUpdater } = require('electron-updater');
  autoUpdater = new AppImageUpdater(options)
  // autoUpdater.setFeedURL({
  //   provider: "github",
  //   owner: "Faelayis",
  //   repo: "RPC-Pc-Status",
  // });
}

autoUpdater.logger = require("electron-log")
autoUpdater.logger.transports.file.level = "info";
log.info("Updata feedURL:", feedURL);
log.info("Updata requestHeaders:", requestHeaders);
autoUpdater.on("checking-for-update", () => {
  if (silent) {
    null;
  } else if (!silent) {
    log.info(`Checking for update...`);
  }
});
autoUpdater.on("update-available", () => {
  log.info("Update available.");
  !AutoupdataRun ? startautoupdata(true) : null;
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
    !AutoupdataRun ? startautoupdata(true) : null;
    allow = true;
  } else if (!silent) {
    log.info("Update not available.");
    new Notification({
      title: "Update not available",
      body: `You are now using ${app.getVersion()} the latest version.`,
    }).show();
    !AutoupdataRun ? startautoupdata(true) : null;
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
          !AutoupdataRun ? startautoupdata(true) : null;
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
            !AutoupdataRun ? startautoupdata(true) : null;
            allow = true;
          }
        });
    }
  }
)

exports.Checkupdates = (arg) => {
  if (allow === true) {
    allow = false;
    AutoupdataRun === true ? startautoupdata(false) : null;
    silent = arg;
    if (
      typeof process !== "undefined" &&
      platform &&
      !supportedPlatforms.includes(platform)
    ) {
      log.warn(
        `Electron's autoUpdater does not support the '${platform}' platform`
      );
      if (silent) {
        allow = true;
      } else if (!silent) {
        dialog
          .showMessageBox({
            type: "error",
            buttons: ["ok", "Try Update"],
            title: "RPC Pc Status Update Error",
            message: "There was a problem updating the application",
            detail: `Updater does not support the '${platform}' platform`,
            noLink: true,
          })
          .then((returnValue) => {
            if (returnValue.response === 0) {
              allow = true;
            }
          });
      }
    }
    if (!isDev) {
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
        silent = true;
        autoUpdater.checkForUpdates();
      }, 15 * 60 * 1000); // 5 * 60 * 1000
      break;
  }
}

log.info(`Updata Ready`);
