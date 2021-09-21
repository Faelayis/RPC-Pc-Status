const { app, Menu, Tray, nativeImage } = require("electron");
const log = require("electron-log");
const open = require("open");
const path = require("path");
const package = require("../package.json");
const { mainWindowshow } = require("./BrowserWindow");
const { seticonlargeImageKey, setstatus } = require("./store");
const { checkupdates } = require("./updata");

log.info("Tray Start");
let tray = null;
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
checkupdates(true);

exports.tupdata = (allow, user) => {
  const { status } = require("./store");
  log.info(`Tray Updata: ${status} ${allow} ${user}`);
  if (tray) {
    const iconPath =
      user === undefined ? "icon/notconnected.png" : "icon/connected.png";
    tray.setImage(nativeImage.createFromPath(path.join(__dirname, iconPath)));
  }
  tray.setContextMenu(
    Menu.buildFromTemplate([
      {
        label: `${!status ? "Enable" : "Disable"}`,
        type: "normal",
        enabled: true,
        click: () => {
          setstatus();
          this.tupdata(allow, user)
        },
      },
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
      { label: "Quit Pc Status", type: "normal", click: () => app.exit(0) },
    ])
  );
};
