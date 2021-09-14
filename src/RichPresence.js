/* eslint-disable no-unused-vars */
const process = require("process");
const RPC = require("discord-rpc");
const os = require("os");
const si = require("systeminformation");
const { trayupdata } = require("./tray");
const store = require("./store");
const log = require("electron-log");
const { webupdate } = require("./BrowserWindow");
let Interval = Number,
  Presenceready = Boolean,
  clientId = Boolean,
  Presence = new RPC.Client({
    transport: "ipc",
  });

// log.info(si.time().current);
// Check systeminformation
checkos();
async function checkos() {
  // await log.info("Systeminformation: " + os.version(), os.release());
  this.cpuload = "loading..";
  this.ramusage = "0";
  this.ram = "0";
  this.cpu = "loading..";
  this.SImageText = "loading..";
  si.cpu().then((data) =>
    data.manufacturer ? (this.cpu = `${data.manufacturer} ${data.brand}`) : null
  );
  await si.osInfo().then(
    (data) => (
      data.distro ? (this.osdistro = `${data.distro}`) : null,
      data.release ? (this.osrelease = `${data.release}`) : null,
      data.logofile ? (this.oslogo = `${data.logofile}`) : null
    )
  );
  if (process.platform === "win32") {
    log.info("windows platform");
    this.SImageText = `${this.osdistro} ${this.osrelease}`;
    switch (true) {
      case /(Windows\s10)/g.test(this.osdistro):
        this.oslogo = "windows10";
        break;
      case /(Windows\s11)/g.test(this.osdistro):
        this.oslogo = "windows11";
        break;
      default:
        this.oslogo = null;
        break;
    }
  } else if (process.platform === "linux") {
    log.info("Linux Platform");
    this.SImageText = `${this.osdistro} ${this.osrelease} ${os.release()}`;
    switch (true) {
      case /(Ubuntu)/g.test(this.osdistro):
        this.oslogo = "linux_ubuntu";
        break;
      case /(Kali)/g.test(this.osdistro):
        this.oslogo = "linux_kali";
        break;
      default:
        this.oslogo = null;
        break;
    }
  } else if (process.platform === "darwin") {
    log.info("Darwin platform (MacOS, IOS etc)");
    this.oslogo = "macOS";
  }
  si.battery().then((data) => data.hasBattery ?  connectDiscord("886899221062647818") : connectDiscord("879327042498342962"));
}
// Let Memoryfree, Memoryused;
// setInterval(() => {
//     si.mem().then(data => (Memoryfree = data.free, Memoryused = data.total));
// }, 3000);

// Start Presence
async function StartPresence() {
  Interval = setInterval(() => {
    si.currentLoad().then((data) =>
      data.currentLoad
        ? (this.cpuload = data.currentLoad.toFixed(0) + " %")
        : null
    );
    formatBytes(os.freemem(), os.totalmem());
    setActivity();
  }, 3000); // 15e33
}

// FormatBytes
function formatBytes(freemem, totalmem, decimals = 0) {
  if (freemem === 0) {
    return "0 Bytes";
  }
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
  const i = Math.floor(Math.log(freemem) / Math.log(k));
  this.ramusage = `${parseFloat(
    // eslint-disable-next-line no-constant-condition
    (totalmem / k ** i - freemem / k ** i).toFixed(2 < 0 ? 0 : 2)
  )} `;
  this.ram = `${parseFloat(
    (totalmem / k ** i).toFixed(decimals < 0 ? 0 : decimals)
  )} ${sizes[i]}`;
}

// Presence setActivity
async function setActivity() {
  if (!Presenceready || !Presence) {
    clearInterval(Interval);
    return;
  }
  // log.info('updata Presence')
  // StartTimestamp,
  Presence.details = `CPU ${this.cpuload}`;
  Presence.state = `RAM ${this.ramusage} / ${this.ram}`;
  Presence.largeImageKey = `${store.largeImageKeyCustom}`;
  Presence.largeImageText = `${this.cpu}`;
  Presence.smallImageKey = `${this.oslogo}`;
  Presence.smallImageText = `${this.SImageText}`;
  Presence.instance = false;
  if (store.buttonsCustom[(2, 3)] && store.buttonsCustom[(0, 1)]) {
    Presence.buttons = [
      {
        label: `${store.buttonsCustom[0]}`,
        url: `${store.buttonsCustom[1]}`,
      },
      {
        label: `${store.buttonsCustom[2]}`,
        url: `${store.buttonsCustom[3]}`,
      },
    ];
  } else if (store.buttonsCustom[0] && store.buttonsCustom[1]) {
    Presence.buttons = [
      {
        label: `${store.buttonsCustom[0]}`,
        url: `${store.buttonsCustom[1]}`,
      },
    ];
  } else {
    delete Presence.buttons;
  }
  Presence.setActivity(Presence);
  // log.info(Presence);
}

trayupdata(false, undefined);

async function connectDiscord(id) {
  id ? (clientId = id) : (clientId = "886899221062647818");
  // log.warn("Connect Discord: Try");
  if (Presence) {
    Presence.destroy();
    Presence = new RPC.Client({
      transport: "ipc",
    });
  }
  Presence.once("disconnected", async () => {
    log.info(`Connect Discord: Disconnected`);
    Presenceready = false;
    module.exports.userinfo = this.userinfo = [
      "Disconnected",
      null,
      null,
      `https://cdn.discordapp.com/embed/avatars/0.png?size=1024`,
    ];
    await trayupdata(false, undefined);
    await webupdate(this.userinfo);
    await connectDiscord();
  });
  Presence.once("ready", async () => {
    log.info(`Connect Discord: Ready`);
    Presenceready = true;
    module.exports.userinfo = this.userinfo = [
      Presence.user.username,
      Presence.user.discriminator,
      Presence.user.id,
      `https://cdn.discordapp.com/avatars/${Presence.user.id}/${Presence.user.avatar}.png?size=1024`,
    ];
    StartPresence();
    await trayupdata(true, `${Presence.user.username}`);
    await webupdate(this.userinfo);
  });
  setTimeout(() => {
    Presence.login({ clientId });
  }, 1 * 1000);
}

process.on("unhandledRejection", (err) => {
  if (err.message === "Could not connect") {
    // log.info("Connect Discord: Could not connect")
    connectDiscord();
  }
});

// exports.connectDiscord = async () => {
//   await connectDiscord();
//   await trayupdata();
// };
