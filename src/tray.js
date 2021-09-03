/* eslint-disable no-undef */
const { app, Menu, Tray, nativeImage } = require("electron");
const path = require("path");
const { Checkupdates } = require("./updata");
const { seticon } = require("./store");
const Package = require("../package.json");
const open = require("open");

let tray = null;

exports.tray = () => {
  const iconPath = "assets/icon/notconnected.png";
  if (tray) {
    tray.setImage(nativeImage.createFromPath(path.join(__dirname, iconPath)));
  } else {
    tray = new Tray(nativeImage.createFromPath(path.join(__dirname, iconPath)));
  }
  tray.setTitle("Pc Status");
  tray.setToolTip("Pc Status");
  tray.setIgnoreDoubleClickEvents(true);
  // tray.on("click", () => {
  //   const { CreateWindow } = require("./BrowserWindow");
  //   CreateWindow();
  // });
};

exports.trayupdata = (allow, user) => {
  if (tray) {
    const iconPath =
      user === undefined
        ? "assets/icon/notconnected.png"
        : "assets/icon/connected.png";
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
                  seticon("icon_dark");
                },
              },
              {
                label: "White",
                type: "normal",
                click: () => {
                  seticon("icon_white");
                },
              },
              {
                label: "Red",
                type: "normal",
                click: () => {
                  seticon("icon_red");
                },
              },
              {
                label: "Yellow",
                type: "normal",
                click: () => {
                  seticon("icon_yellow");
                },
              },
              {
                label: "Lime",
                type: "normal",
                click: () => {
                  seticon("icon_lime");
                },
              },
              {
                label: "Aqua",
                type: "normal",
                click: () => {
                  seticon("icon_aqua");
                },
              },
              {
                label: "Blue",
                type: "normal",
                click: () => {
                  seticon("icon_blue");
                },
              },
              {
                label: "Orange",
                type: "normal",
                click: () => {
                  seticon("icon_orange");
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
        label: "Check for updates..",
        type: "normal",
        click: () => {
          Checkupdates();
        },
      },
      { type: "separator" },
      { label: "Quit Pc Status", type: "normal", click: () => app.quit() },
    ])
  );
};
