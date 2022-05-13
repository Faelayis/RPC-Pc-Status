const { app, Menu, Tray, nativeImage } = require("electron");
const log = require("electron-log");
const open = require("open");
const path = require("path");
const package = require("../package.json");
const { mainWindowshow } = require("./BrowserWindow");
const { getvalue, setvalue } = require("./store");
const { checkupdates } = require("./updata");

log.info("Tray Start");
var tray = null;
tray = new Tray(
  nativeImage.createFromPath(path.join(__dirname, "icon/notconnected.png"))
);
tray.setTitle("Pc Status");
tray.setToolTip("Pc Status");
tray.setIgnoreDoubleClickEvents(true);
tray.on("click", () => {
  mainWindowshow();
});
checkupdates(true);

exports.tupdata = (allow, user) => {
  // log.info(`Tray Updata: ${status} ${allow} ${user}`);
  const iconPath =
    user === undefined ? "icon/notconnected.png" : "icon/connected.png";
  tray.setImage(nativeImage.createFromPath(path.join(__dirname, iconPath)));
  tray.setContextMenu(
    Menu.buildFromTemplate([
      {
        label: `Status : ${user ? "Connected" : "Not connected"}`,
        type: "normal",
        enabled: false,
      },
      {
        label: `User : ${user ? user : "Not found"}`,
        type: "normal",
        enabled: false,
      },
      {
        label: `Version : ${app.getVersion()}`,
        type: "normal",
        enabled: false,
      },
      { type: "separator" },
      {
        label: `${getvalue("status") ? "Disable" : "Enable"}`,
        type: "normal",
        enabled: true,
        click: async () => {
          setvalue("status", null, "switch");
          this.tupdata(allow, user);
        },
      },
      {
        label: `${getvalue("onlytext") ? "Onlytext on" : "Onlytext off"}`,
        type: "normal",
        enabled: true,
        click: async () => {
          setvalue("onlytext", null, "switch");
          this.tupdata(allow, user);
        },
      },
      {
        label: "Theme",
        enabled: getvalue("onlytext") ? false : allow,
        submenu: [
          {
            label: "large Image",
            submenu: [
              {
                label: "Dark",
                type: "normal",
                click: () => {
                  setvalue("largeImageKeyCustom", "icon_dark");
                },
              },
              {
                label: "White",
                type: "normal",
                click: () => {
                  setvalue("largeImageKeyCustom", "icon_white");
                },
              },
              {
                label: "Red",
                type: "normal",
                click: () => {
                  setvalue("largeImageKeyCustom", "icon_red");
                },
              },
              {
                label: "Yellow",
                type: "normal",
                click: () => {
                  setvalue("largeImageKeyCustom", "icon_yellow");
                },
              },
              {
                label: "Lime",
                type: "normal",
                click: () => {
                  setvalue("largeImageKeyCustom", "icon_lime");
                },
              },
              {
                label: "Aqua",
                type: "normal",
                click: () => {
                  setvalue("largeImageKeyCustom", "icon_aqua");
                },
              },
              {
                label: "Blue",
                type: "normal",
                click: () => {
                  setvalue("largeImageKeyCustom", "icon_blue");
                },
              },
              {
                label: "Orange",
                type: "normal",
                click: () => {
                  setvalue("largeImageKeyCustom", "icon_orange");
                },
              },
            ],
          },
        ],
      },
      { type: "separator" },
      {
        label: "Contributors",
        type: "normal",
        click: () => {
          open(`${package.repository.url}/graphs/contributors`);
        },
      },
      {
        label: `Check for updates..`,
        type: "normal",
        click: () => {
          checkupdates(false);
        },
      },
      { type: "separator" },
      { label: "Exit", type: "normal", click: () => app.exit(0) },
    ])
  );
};
