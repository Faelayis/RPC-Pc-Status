const { app, Menu, Tray, nativeImage } = require('electron');
const path = require('path');
const Package = require('../package.json');
const Presence = require('./RichPresence');
const { Checkupdates } = require('./updata');
const { seticon } = require('./store');

let tray = null

exports.tray = () => {
    if (tray) {
        tray.destroy();
    }
    app.whenReady().then(() => {
        const iconPath = (Presence.user === undefined ? 'assets/icon/notconnected.png' : 'assets/icon/connected.png');
        tray = new Tray(path.join(__dirname, iconPath));
        const contextMenu = Menu.buildFromTemplate([
            { label: `Status : ${Presence.user ? "Connected" : "Not connected"}`, type: 'normal', enabled: false },
            { label: `User : ${Presence.user ? Presence.user : "Not found"}`, type: 'normal', enabled: false },
            { label: `Version : ${Package.version}`, type: 'normal', enabled: false },
            { type: "separator" },
            {
                label: "Theme", submenu: [
                    {
                        label: "large Image", submenu: [
                            {
                                label: "Dark", type: "normal", click: () => {
                                    seticon('icon_dark');
                                }
                            },
                            {
                                label: "White", type: 'normal', click: () => {
                                    seticon('icon_white');
                                }
                            },
                            {
                                label: "Red", type: 'normal', click: () => {
                                    seticon('icon_red');
                                }
                            },
                            {
                                label: "Yellow", type: 'normal', click: () => {
                                    seticon('icon_yellow');
                                }
                            },
                            {
                                label: "Lime", type: 'normal', click: () => {
                                    seticon('icon_lime');
                                }
                            },
                            {
                                label: "Aqua", type: 'normal', click: () => {
                                    seticon('icon_aqua');
                                }
                            },
                            {
                                label: "Blue", type: 'normal', click: () => {
                                    seticon('icon_blue');
                                }
                            },
                            {
                                label: "Orange", type: 'normal', click: () => {
                                    seticon('icon_orange');
                                }
                            },
                        ]
                    },
                ]
            },
            { type: "separator" },
            { label: 'Check for updates..', type: 'normal', click: () => Checkupdates() },
            { type: "separator" },
            { label: 'Quit Pc Status', type: 'normal', click: () => app.quit() }
        ])
        tray.setTitle('Pc Status')
        tray.setToolTip('Pc Status');
        tray.setContextMenu(contextMenu);
    });
}
