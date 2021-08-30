const RPC = require("discord-rpc"),
    os = require("os"),
    si = require('systeminformation'),
    clientId = '879327042498342962',
    { tray } = require('./tray'),
    store = require('./store');
// startTimestamp = new Date();

let Presence = new RPC.Client({
    transport: 'ipc'
}),
    Interval,
    Presenceready,
    user,
    osdistro,
    osrelease,
    oslogo,
    cpu,
    cpuload,
    ram,
    ramusage;

// check systeminformation
si.osInfo().then(data => (
    data.distro ? osdistro = data.distro : " ",
    data.release ? osrelease = data.release : " ",
    data.logofile ? oslogo = data.logofile : " "
));
si.cpu().then(data => (
    cpu = data.manufacturer + ' ' + data.brand
));

function checkos() {
    switch (true) {
        case /(Windows\s7)/g.test(osdistro):
            oslogo = 'windows7'
            break;
        case /(Windows\s8)/g.test(osdistro):
            oslogo = 'windows8'
            break;
        case /(Windows\s10)/g.test(osdistro):
            oslogo = 'windows10'
            break;
        case /(Windows\s11)/g.test(osdistro):
            oslogo = 'windows11'
            break;
        default:
            break;
    }
}
// let Memoryfree, Memoryused;
// setInterval(() => {
//     si.mem().then(data => (Memoryfree = data.free, Memoryused = data.total));
// }, 3000);

//Start Presence
function StartPresence() {
    checkos();
    Interval = setInterval(() => {
        si.currentLoad().then(data => (cpuload = data.currentLoad.toFixed(0)));
        formatBytes(os.freemem(), os.totalmem());
        setActivity();
    }, 3000) //15e33
};

//formatBytes
function formatBytes(freemem, totalmem, decimals = 2) {
    if (freemem === 0) return '0 Bytes';
    const k = 1024,
        dm = decimals < 0 ? 0 : decimals,
        sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
        i = Math.floor(Math.log(freemem) / Math.log(k));
    ramusage = parseFloat((freemem / Math.pow(k, i)).toFixed(dm)) + ' ';
    ram = parseFloat((totalmem / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

//Presence setActivity
async function setActivity() {
    if (!Presenceready || !Presence) {
        clearInterval(Interval);
        return;
    }
    Presence.setActivity({
        details: `CPU ${cpuload} %`,
        state: `RAM ${ramusage} / ${ram}`,
        // startTimestamp,
        largeImageKey: `${store.largeImageKeyCustom}`,
        largeImageText: `${cpu}`,
        smallImageKey: `${oslogo}`,
        smallImageText: `${osdistro} ${osrelease}`,
        instance: false,
    });
};

connectDiscord(); tray(); function connectDiscord() {
    if (Presence) {
        Presence.destroy();
        Presence = new RPC.Client({
            transport: 'ipc'
        });
    }
    Presence.once('disconnected', () => {
        Presenceready = false
        module.exports.user = user = undefined;
        connectDiscord(); tray();
        return;
    });
    Presence.once('ready', () => {
        Presenceready = true
        module.exports.user = user = Presence.user.username;
        StartPresence(); tray();
        return;
    });
    setTimeout(() => {
        Presence.login({ clientId });
    }, 1 * 1000)
};

process.on('unhandledRejection', err => {
    if (err.message === 'Could not connect') {
        connectDiscord();
    }
});

exports.connectDiscord = () => {
    connectDiscord(); tray();
};
