const { app, Menu, Tray } = require('electron');
const path = require('path');
const RPC = require("discord-rpc");
const os = require("os");
const si = require('systeminformation');
const clientId = '879327042498342962';
// const startTimestamp = new Date();

Package = require('../package.json');

let user, osdistro, osrelease, oslogo, cpu, cpuload, cpuspeed, ram, ramusage;
let Presence = new RPC.Client({
    transport: 'ipc'
});

// check systeminformation
si.osInfo().then(data => (
    data.distro ? osdistro = data.distro : " ",
    data.release ? osrelease = data.release : " ",
    data.logofile ? oslogo = data.logofile : " "
));
si.cpu().then(data => (
    cpu = data.manufacturer + ' ' + data.brand
));

// let Memoryfree, Memoryused;
// setInterval(() => {
//     si.mem().then(data => (Memoryfree = data.free, Memoryused = data.total));
// }, 3000);

setInterval(function () {
    si.currentLoad().then(data =>
        (cpuload = data.currentLoad.toFixed(0)));
    // si.cpu().then(data =>
    //     (`Cpu speed ${cpuspeed = data.speed + ' ' + data.speedMax} GHz`));
}, 3000)

let tray = null;
app.whenReady().then(() => {
    const iconPath = (user === undefined ? 'assets/icon/notconnected.png' : 'assets/icon/connected.png');
    tray = new Tray(path.join(__dirname, iconPath));
    const contextMenu = Menu.buildFromTemplate([
        { label: `Status : ${user ? "Connected" : "Not connected"}`, type: 'normal', enabled: false },
        { label: `User : ${user ? user : "Not found"}`, type: 'normal', enabled: false },
        { label: `Version : ${Package.version}`, type: 'normal', enabled: false },
        { type: "separator" },
        { label: 'Quit Pc Status', type: 'normal', click: () => app.quit() }
    ])
    tray.setTitle('Pc Status')
    tray.setToolTip('Pc Status');
    tray.setContextMenu(contextMenu);
});

//Presence Ready
async function start() {
    tray.destroy();
    require('./tray');
    setInterval(() => {
        setActivity(Presence);
        formatBytes(os.freemem(), os.totalmem());
    }, 3000) //15e33
}

//formatBytes
function formatBytes(freemem, totalmem, decimals = 2) {
    if (freemem === 0) return '0 Bytes';
    const k = 1024,
        dm = decimals < 0 ? 0 : decimals,
        sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
        i = Math.floor(Math.log(freemem) / Math.log(k));
    ramusage = parseFloat((freemem / Math.pow(k, i)).toFixed(dm)) + ' ';
    ram = parseFloat((totalmem / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

//Presence setActivity
function setActivity() {
    if (!Presence) {
        return;
    }
    Presence.setActivity({
        details: `CPU ${cpuload} %`,
        state: `RAM ${ramusage} / ${ram}`,
        // startTimestamp,
        largeImageKey: 'connected',
        largeImageText: `${cpu}`,
        smallImageKey: `${oslogo}`,
        smallImageText: `${osdistro} ${osrelease}`,
        instance: false,
    });
}

connectDiscord();
function connectDiscord() {
    if (Presence) {
        Presence.destroy();
        Presence = new RPC.Client({
            transport: 'ipc'
        });
    }
    Presence.on('ready', () => {
        user = Presence.user.username
        module.exports.user = user;
        start();
    });
    setTimeout(() => {
        Presence.login({ clientId });
    }, 1 * 1000)
}

process.on('unhandledRejection', err => {
    if (err.message === 'Could not connect') {
        connectDiscord();
    }
});
