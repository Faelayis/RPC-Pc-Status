const process = require("process");
const log = require("electron-log");
const path = require("path");
const electron = require("electron");

const APP_DATA = (electron.app || electron.remote.app).getPath("userData");
log.transports.console.format = "[{y}-{m}-{d} {h}:{i}:{s}] [{level}] > {text}";
log.transports.file.format = "[{y}-{m}-{d} {h}:{i}:{s}] [{level}] > {text}";
log.transports.file.resolvePath = () => path.join(APP_DATA, "logs/main.log");

process.on("uncaughtException", (err) => {
  log.error("uncaughtException:", err);
});
process.on("beforeExit", (code) => {
  log.info("Process beforeExit event with code: ", code);
});
process.on("exit", (code) => {
  log.info("Process exit event with code: ", code);
});
