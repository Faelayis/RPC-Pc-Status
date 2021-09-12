/* eslint-disable no-undef */
const { app, Menu, Tray, nativeImage } = require("electron");
const log = require("electron-log");
const path = require("path");
const { seticonlargeImageKey } = require("./store");
const { mainWindowshow } = require("./BrowserWindow");
const Package = require("../package.json");
const open = require("open");
const { Checkupdates } = require("./updata");

let tray = null;

exports.tray = () => {
  log.log("Tray Start");
  if (tray) {
    tray.setImage(
      nativeImage.createFromPath(path.join(__dirname, "icon/notconnected.png"))
    );
  } else {
    tray = new Tray(
      nativeImage.createFromPath(path.join(__dirname, "icon/notconnected.png"))
    );
  }
  tray.setTitle("Pc Status");
  tray.setToolTip("Pc Status");
  tray.setIgnoreDoubleClickEvents(true);
  tray.on("click", () => {
    mainWindowshow();
  });
  Checkupdates(false);
};

exports.trayupdata = (allow, user) => {
  log.log(`Tray Updata: ${allow} ${user}`);
  if (tray) {
    const iconPath =
      user === undefined ? "icon/notconnected.png" : "icon/connected.png";
    tray.setImage(nativeImage.createFromPath(path.join(__dirname, iconPath)));
  }
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
        label: "Theme",
        enabled: allow,
        submenu: [
          {
            label: "large Image",
            submenu: [
              {
                label: "Dark",
                type: "normal",
                click: () => {
                  seticonlargeImageKey("icon_dark");
                },
              },
              {
                label: "White",
                type: "normal",
                click: () => {
                  seticonlargeImageKey("icon_white");
                },
              },
              {
                label: "Red",
                type: "normal",
                click: () => {
                  seticonlargeImageKey("icon_red");
                },
              },
              {
                label: "Yellow",
                type: "normal",
                click: () => {
                  seticonlargeImageKey("icon_yellow");
                },
              },
              {
                label: "Lime",
                type: "normal",
                click: () => {
                  seticonlargeImageKey("icon_lime");
                },
              },
              {
                label: "Aqua",
                type: "normal",
                click: () => {
                  seticonlargeImageKey("icon_aqua");
                },
              },
              {
                label: "Blue",
                type: "normal",
                click: () => {
                  seticonlargeImageKey("icon_blue");
                },
              },
              {
                label: "Orange",
                type: "normal",
                click: () => {
                  seticonlargeImageKey("icon_orange");
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
          open(`${Package.repository.url}/graphs/contributors`);
        },
      },
      {
        label: `Check for updates..`,
        type: "normal",
        click: () => {
          Checkupdates(true);
        },
      },
      { label: "Quit Pc Status", type: "normal", click: () => app.exit(0) },
    ])
  );
};
