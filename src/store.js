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

exports.setupdaterchannel = (c) => {
  store.set("updaterChannel", c);
  const { trayupdata } = require("./tray");
  const { userinfo } = require("./RichPresence");
  module.exports.updaterChannel = store.get("updaterChannel");
  log.log(`Set updaterchannel: ` + c);
  trayupdata(true, userinfo[0]);
};
exports.seticonlargeImageKey = (icon) => {
  store.set("largeImageKeyCustom", icon);
  module.exports.largeImageKeyCustom = store.get("largeImageKeyCustom");
  log.log(`Set largeImageKeyCustom: ` + icon);
};

exports.setbuttonslabel = (text1, text2) => {
  store.set("buttonslabelCustom", [text1, text2]);
  module.exports.buttonslabelCustom = store.get("buttonslabelCustom");
  log.log(`Set buttonslabelCustom: ` + [text1, text2]);
};

exports.setbuttonsurl = (url1, url2) => {
  store.set("buttonsurlCustom", [url1, url2]);
  module.exports.buttonsurlCustom = store.get("buttonsurlCustom");
  log.log(`Set buttonsurlCustom: ` + [url1, url2]);
};

module.exports.updaterChannel = store.get("updaterChannel");
module.exports.largeImageKeyCustom = store.get("largeImageKeyCustom");
module.exports.buttonslabelCustom = store.get("buttonslabelCustom");
module.exports.buttonsurlCustom = store.get("buttonsurlCustom");
log.log(`Store Ready`);
