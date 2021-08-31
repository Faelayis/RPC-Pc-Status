const process = require("process");
const RPC = require("discord-rpc");
const os = require("os");
const si = require("systeminformation");

const clientId = "879327042498342962";
const { tray } = require("./tray");
const store = require("./store");
// StartTimestamp = new Date();

let Presence = new RPC.Client({
  transport: "ipc",
});
let user;
let Interval;
let Presenceready;
let osdistro;
let osrelease;
let oslogo;
let cpu;
let cpuload;
let ram;
let ramusage;

// Check systeminformation
si.osInfo().then(
  (data) => (
    data.distro ? (osdistro = data.distro) : " ",
    data.release ? (osrelease = data.release) : " ",
    data.logofile ? (oslogo = data.logofile) : " "
  )
);
si.cpu().then((data) => (cpu = `${data.manufacturer} ${data.brand}`));

function checkos() {
  switch (true) {
    case /(Windows\s7)/g.test(osdistro):
      oslogo = "windows7";
      break;
    case /(Windows\s8)/g.test(osdistro):
      oslogo = "windows8";
      break;
    case /(Windows\s10)/g.test(osdistro):
      oslogo = "windows10";
      break;
    case /(Windows\s11)/g.test(osdistro):
      oslogo = "windows11";
      break;
    default:
      break;
  }
}
// Let Memoryfree, Memoryused;
// setInterval(() => {
//     si.mem().then(data => (Memoryfree = data.free, Memoryused = data.total));
// }, 3000);

// Start Presence
function StartPresence() {
  checkos();
  Interval = setInterval(() => {
    si.currentLoad().then((data) => (cpuload = data.currentLoad.toFixed(0)));
    formatBytes(os.freemem(), os.totalmem());
    setActivity();
  }, 3000); // 15e33
}

// FormatBytes
function formatBytes(freemem, totalmem, decimals = 2) {
  if (freemem === 0) {
    return "0 Bytes";
  }

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
  const i = Math.floor(Math.log(freemem) / Math.log(k));
  ramusage = `${parseFloat((freemem / k ** i).toFixed(dm))} `;
  ram = `${parseFloat((totalmem / k ** i).toFixed(dm))} ${sizes[i]}`;
}

// Presence setActivity
async function setActivity() {
  if (!Presenceready || !Presence) {
    clearInterval(Interval);
    return;
  }

  Presence.setActivity({
    details: `CPU ${cpuload} %`,
    state: `RAM ${ramusage} / ${ram}`,
    // StartTimestamp,
    largeImageKey: `${store.largeImageKeyCustom}`,
    largeImageText: `${cpu}`,
    smallImageKey: `${oslogo}`,
    smallImageText: `${osdistro} ${osrelease}`,
    instance: false,
  });
}

connectDiscord();
tray();
function connectDiscord() {
  if (Presence) {
    Presence.destroy();
    Presence = new RPC.Client({
      transport: "ipc",
    });
  }

  Presence.once("disconnected", () => {
    Presenceready = false;
    module.exports.user = user = undefined;
    connectDiscord();
    tray();
  });
  Presence.once("ready", () => {
    Presenceready = true;
    module.exports.user = user = Presence.user.username
    StartPresence();
    tray();
  });
  setTimeout(() => {
    Presence.login({ clientId });
  }, 1 * 1000);
}

process.on("unhandledRejection", (err) => {
  if (err.message === "Could not connect") {
    connectDiscord();
  }
});

exports.connectDiscord = () => {
  connectDiscord();
  tray();
};
