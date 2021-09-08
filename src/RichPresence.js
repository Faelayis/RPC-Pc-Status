/* eslint-disable no-unused-vars */
const process = require("process");
const RPC = require("discord-rpc");
const os = require("os");
const si = require("systeminformation");
const clientId = "879327042498342962";
const { trayupdata } = require("./tray");
const store = require("./store");
const log = require("electron-log");
const { webupdate } = require("./BrowserWindow");

let Presence = new RPC.Client({
  // userinfo,
  Interval,
  Presenceready,
  osdistro,
  osrelease,
  oslogo,
  cpu,
  cpuload = "0 %",
  ram,
  ramusage;

// console.log(si.time().current);
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
async function StartPresence() {
  await checkos();
  Interval = setInterval(() => {
    si.currentLoad().then(
      (data) => (cpuload = data.currentLoad.toFixed(0) + " %")
    );
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
  ramusage = `${parseFloat(
    (totalmem / k ** i - freemem / k ** i).toFixed(dm)
  )} `;
  ram = `${parseFloat((totalmem / k ** i).toFixed(dm))} ${sizes[i]}`;
}

let allow_buttons_1 = true;
let allow_buttons_2 = true;

// Presence setActivity
async function setActivity() {
  if (!Presenceready || !Presence) {
    clearInterval(Interval);
    return;
  }
  // console.log('updata Presence')
  // StartTimestamp,
  Presence.details = `CPU ${cpuload}`;
  Presence.state = `RAM ${ramusage} / ${ram}`;
  Presence.largeImageKey = `${store.largeImageKeyCustom}`;
  Presence.largeImageText = `${cpu}`;
  Presence.smallImageKey = `${oslogo}`;
  Presence.smallImageText = `${osdistro} ${osrelease}`;
  Presence.instance = false;
  if (allow_buttons_1 === true !== allow_buttons_2 === true) {
    Presence.buttons = [
      {
        label: `${store.buttonslabelCustom[0]}`,
        url: `${store.buttonsurlCustom[0]}`,
      },
    ];
  } else if (allow_buttons_2 === true) {
    Presence.buttons = [
      {
        label: `${store.buttonslabelCustom[0]}`,
        url: `${store.buttonsurlCustom[0]}`,
      },
      {
        label: `${store.buttonslabelCustom[1]}`,
        url: `${store.buttonsurlCustom[1]}`,
      },
    ];
  }
  Presence.setActivity(Presence);
  //console.log(Presence);
}

connectDiscord();
trayupdata(false, undefined);
async function connectDiscord() {
  // log.log("Connect Discord: Try")
  if (Presence) {
    Presence.destroy();
    Presence = new RPC.Client({
      transport: "ipc",
    });
  }
  Presence.once("disconnected", async () => {
    log.log(`Connect Discord: Disconnected`);
    Presenceready = false;
    module.exports.userinfo = this.userinfo = [
      "Disconnected",
      undefined,
      undefined,
      `https://cdn.discordapp.com/embed/avatars/0.png?size=1024`,
    ];
    await trayupdata(false, undefined);
    await connectDiscord();
    await webupdate(this.userinfo);
  });
  Presence.once("ready", async () => {
    log.log(`Connect Discord: Ready`);
    Presenceready = true;
    module.exports.userinfo = this.userinfo = [
      Presence.user.username,
      Presence.user.discriminator,
      Presence.user.id,
      `https://cdn.discordapp.com/avatars/${Presence.user.id}/${Presence.user.avatar}.png?size=1024`,
    ]; //?size=1024]
    await StartPresence();
    await trayupdata(true, `${Presence.user.username}`);
    await webupdate(this.userinfo);
  });
  setTimeout(() => {
    Presence.login({ clientId });
  }, 1 * 1000);
}

process.on("unhandledRejection", (err) => {
  if (err.message === "Could not connect") {
    // log.log("Connect Discord: Could not connect")
    connectDiscord();
  }
});

exports.connectDiscord = async () => {
  await connectDiscord();
  await trayupdata();
};
