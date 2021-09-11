const Store = require("electron-store");
const log = require("electron-log");
const package = require("../package.json");
const schema = {
  updaterChannel: {
    type: "string",
  },
  // detailsCustom: {
  //   type: 'string',
  // },
  // stateCustom: {
  //   type: 'string',
  // },
  largeImageKeyCustom: {
    type: "string",
  },
  // largeImageTextCustom: {
  //   type: 'string',
  // },
  buttonslabelCustom: {
    type: "string",
  },
  buttonsurlCustom: {
    type: "string",
    format: "url",
  },
};
const store = new Store(schema);

if (store.get("updaterChannel") === undefined) {
  store.set("updaterChannel", package.updaterchannel); //latest //beta //alpha
  module.exports.updaterChannel = store.get("updaterChannel");
}
if (store.get("largeImageKeyCustom") === undefined) {
  store.set("largeImageKeyCustom", "icon_white");
}
if (store.get("buttonsCustom") === undefined) {
  store.set("buttonsCustom", [null, null, null, null]);
}

exports.setupdaterchannel = (arg) => {
  store.set("updaterChannel", arg);
  const { trayupdata } = require("./tray");
  const { userinfo } = require("./RichPresence");
  module.exports.updaterChannel = store.get("updaterChannel");
  log.log(`Set updaterchannel: ` + arg);
  trayupdata(true, userinfo[0]);
};
exports.seticonlargeImageKey = (icon) => {
  store.set("largeImageKeyCustom", icon);
  module.exports.largeImageKeyCustom = store.get("largeImageKeyCustom");
  log.log(`Set largeImageKeyCustom: ` + icon);
};

exports.setbutton = (arg1, arg2, arg3, arg4) => {
  store.set(`buttonsCustom`, [arg1, arg2, arg3, arg4]);
  module.exports.buttonsCustom = store.get("buttonsCustom");
  log.log(`Set buttonsCustom: ` + [arg1, arg2, arg3, arg4]);
};

module.exports.updaterChannel = store.get("updaterChannel");
module.exports.largeImageKeyCustom = store.get("largeImageKeyCustom");
module.exports.buttonsCustom = store.get("buttonsCustom");
log.log(`Store Ready`);
