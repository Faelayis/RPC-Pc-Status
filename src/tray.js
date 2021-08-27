const { app, Menu, Tray } = require('electron');
const path = require('path');
Presence = require('./RichPresence');
Package = require('../package.json');
let tray = null;

app.whenReady().then(() => {
    const iconPath = (Presence.user === undefined ? 'assets/icon/notconnected.png' : 'assets/icon/connected.png');
    tray = new Tray(path.join(__dirname, iconPath));
    const contextMenu = Menu.buildFromTemplate([
        { label: `Status : ${Presence.user ? "Connected" : "Not connected"}`, type: 'normal', enabled: false },
        { label: `User : ${Presence.user ? Presence.user : "Not found"}`, type: 'normal', enabled: false },
        { label: `Version : ${Package.version}`, type: 'normal', enabled: false },
        { type: "separator" },
        { label: 'Check for updates..', type: 'normal', click: () => require('./updata.js') },
        { type: "separator" },
        { label: 'Quit Pc Status', type: 'normal', click: () => app.quit() }
    ])
    tray.setTitle('Pc Status')
    tray.setToolTip('Pc Status');
    tray.setContextMenu(contextMenu);
});