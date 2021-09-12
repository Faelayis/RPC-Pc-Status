const updateApp = require("update-electron-app");
updateApp({
  updateInterval: "10 minutes",
  logger: require("electron-log"),
  notifyUser: false,
});
