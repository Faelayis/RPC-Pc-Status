const process = require("process");
const { app, dialog, Notification, nativeImage } = require("electron");
const log = require("electron-log");
const isDev = require("electron-is-dev");
const os = require("os");
const path = require("path");
const { format } = require("util");
const package = require("../package.json");
const iconpath = nativeImage.createFromPath(
  path.join(__dirname, "icon/updateavailable.png")
);
let allow = true,
  autoupdatarun = true,
  reqrestart = false,
  silent = Boolean,
  interval = Number;

var supportedPlatforms = ["darwin", "win32", "linux"];
if (process.platform === "darwin" || process.platform === "win32") {
  var { autoUpdater } = require("electron");
  var userAgent = format(
    "%s/%s (% s: %s)",
    package.name,
    package.version,
    os.platform(),
    os.arch()
  );
  var feedURL = `https://update.electronjs.org/${
    package.author.name
  }/RPC-Pc-Status/${process.platform}-${process.arch}/${app.getVersion()}`;
  var requestHeaders = { "User-Agent": userAgent };
  autoUpdater.setFeedURL(feedURL, requestHeaders);
  updateon();
} else if (process.platform === "linux") {
  var { AppImageUpdater } = require("electron-updater");
  const options = {
    provider: "github",
    owner: `${package.author.name}`,
    repo: "RPC-Pc-Status",
  };
  autoUpdater = new AppImageUpdater(options);
  updateon();
}

async function updateon() {
  log.info("Updata feedURL:", feedURL);
  log.info("Updata requestHeaders:", requestHeaders);
  autoUpdater.logger = log;
  autoUpdater.logger.transports.file.level = "info";
  autoUpdater.setFeedURL(feedURL, requestHeaders);
  autoUpdater.on("checking-for-update", () => {
    if (!silent) {
      log.info(`Checking for update...`);
    }
  });
  autoUpdater.on("update-available", () => {
    log.info("Update available.");
    autoupdatarun ? autoupdata(false) : null;
    allow = false;
    if (!silent) {
      new Notification({
        title: "Update available",
        body: `Found New version download automatically \ncomplete you will be notified.`,
      }).show();
    }
  });
  autoUpdater.on("update-not-available", () => {
    if (!silent) {
      log.info("Update not available.");
      new Notification({
        title: "Update not available",
        body: `You are now using ${app.getVersion()} the latest version.`,
      }).show();
    }
    !autoupdatarun ? autoupdata(true) : null;
    allow = true;
  });
  autoUpdater.on("error", (message) => {
    log.error(`Update ${message}`);
    allow = false;
    if (silent) {
      if (!autoupdatarun) {
        autoupdata(true);
      }
      allow = true;
    } else if (!silent) {
      dialog
        .showMessageBox({
          type: "error",
          buttons: ["Pause AutoUpdata", "ok"],
          title: `${package.apptitle} Update Error`,
          message: "There was a problem updating the application",
          detail: `${message}`,
          noLink: true,
        })
        .then((returnValue) => {
          if (returnValue.response === 0) {
            autoupdata(false);
            allow = true;
          } else if (returnValue.response === 1) {
            !autoupdatarun ? autoupdata(true) : null;
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
            title: `${package.apptitle} Update`,
            detail: `A new version has been downloaded. Restart the application to apply the updates.`,
            noLink: true,
            icon: iconpath,
          })
          .then((returnValue) => {
            if (returnValue.response === 0) {
              autoUpdater.quitAndInstall();
              app.exit(0);
            } else if (returnValue.response === 1) {
              autoupdatarun ? autoupdata(false) : null;
              reqrestart = true;
              allow = true;
            }
          });
      }
    }
  );
}

exports.checkupdates = async (arg) => {
  if (allow) {
    allow = false;
    await autoupdata(false);
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
            title: `${package.apptitle} Update Error`,
            message: "There was a problem updating the application",
            detail: `Updater does not support the '${process.platform}' platform`,
            noLink: true,
          })
          .then((returnValue) => {
            if (returnValue.response === 0) {
              autoupdatarun ? autoupdata(false) : null;
              allow = true;
            }
          });
      }
    } else {
      if (!isDev) {
        log.warn(`Updata: not support Running in development`);
        if (silent) {
          allow = true;
        } else if (!silent) {
          dialog
            .showMessageBox({
              type: "error",
              buttons: ["ok"],
              title: `${package.apptitle} Update Error`,
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
        if (reqrestart) {
          autoUpdater.quitAndInstall();
          app.exit(0);
        } else {
          autoUpdater.checkForUpdates();
        }
      }
    }
  } else {
    silent
      ? log.info(`Update: is working now!`)
      : new Notification({
          title: "Update is working now!",
          body: null,
        }).show();
    allow ? null : log.warn(`Update: is working now!`);
  }
};

function autoupdata(B) {
  switch (B) {
    case false:
      clearInterval(interval);
      autoupdatarun = false;
      break;
    case true:
      autoupdatarun = true;
      interval = setInterval(() => {
        silent = true;
        autoUpdater.checkForUpdates();
      }, 3000); // 5 * 60 * 1000
      break;
  }
}

log.info(`Updata Ready`);
