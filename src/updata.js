const process = require("process");
const path = require('path')
const os = require('os')
const { format } = require('util')
const package = require('../package.json')
const log = require("electron-log");
const { app, autoUpdater, dialog, Notification, nativeImage } = require("electron");
const iconpath = nativeImage.createFromPath(
  // eslint-disable-next-line no-undef
  path.join(__dirname, "icon/updateavailable.png")
);
autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = "info";

const userAgent = format(
  '%s/%s (% s: %s)',
  package.name,
  package.version,
  os.platform(),
  os.arch()
)

const supportedPlatforms = ['darwin', 'win32']
const feedURL = `https://update.electronjs.org/${package.author.name}/RPC-Pc-Status/${process.platform}-${process.arch}/${app.getVersion()}`
const requestHeaders = { 'User-Agent': userAgent }
let allow = true;

exports.Checkupdates = (silent) => {
  if (allow === true) {
    allow = false;
    if (typeof process !== 'undefined' && process.platform && !supportedPlatforms.includes(process.platform)) {
      log.warn(`Electron's autoUpdater does not support the '${process.platform}' platform`)
      if (silent) {
        dialog
          .showMessageBox({
            type: "error",
            buttons: ["ok"],
            title: "RPC Pc Status Update Error",
            message: "There was a problem updating the application",
            detail: `Electron's autoUpdater does not support the '${process.platform}' platform`,
            noLink: true,
          })
          .then((returnValue) => {
            if (returnValue.response === 0) {
              allow = true;
            }
          });
      }
    }
    log.info('feedURL', feedURL)
    log.info('requestHeaders', requestHeaders)
    autoUpdater.setFeedURL(feedURL, requestHeaders)
    autoUpdater.checkForUpdates();
    autoUpdater.once("checking-for-update", () => {
      log.info(`Checking for update...`);
    });
    autoUpdater.once("update-available", () => {
      log.info("Update available.");
      if (silent) {
        new Notification({
          title: "Update available",
          body: `Found New version download automatically \ncomplete you will be notified.`,
        }).show();
      }
    });
    autoUpdater.once("update-not-available", () => {
      log.info("Update not available.");
      if (silent) {
        new Notification({
          title: "Update not available",
          body: `You are now using ${app.getVersion()} the latest version.`,
        }).show();
        allow = true;
      }
    });
    autoUpdater.once("error", (message) => {
      allow = false;
      if (silent) {
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
              allow = true;
            }
          });
      }
    });
    autoUpdater.once("download-progress", (progressObj) => {
      allow = false;
      let log_message = "Download speed: " + progressObj.bytesPerSecond;
      log_message = log_message + " - Downloaded " + progressObj.percent + "%";
      log_message =
        log_message +
        " (" +
        progressObj.transferred +
        "/" +
        progressObj.total +
        ")";
      log.info(log_message);
    });
    autoUpdater.once('update-downloaded', (event, releaseNotes, releaseName, releaseDate, updateURL) => {
      log.warn('update-downloaded', [event, releaseNotes, releaseName, releaseDate, updateURL])
      allow = false;
      if (silent) {
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
              allow = true;
              autoUpdater.quitAndInstall();
              app.exit(0);
            } else if (returnValue.response === 1) {
              allow = true;
            }
          });
      } else if (silent === false) {
        autoUpdater.quitAndInstall();
        app.exit(0)
      }
    });
  }
};