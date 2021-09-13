const Store = require("electron-store");
const log = require("electron-log");
const schema = {
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

if (store.get("largeImageKeyCustom") === undefined) {
  store.set("largeImageKeyCustom", "icon_white");
}
if (store.get("buttonsCustom") === undefined) {
  store.set("buttonsCustom", [null, null, null, null]);
}

function seticonlargeImageKey(icon) {
  log.info(`Set largeImageKeyCustom: ` + icon);
  store.set("largeImageKeyCustom", icon);
  module.exports.largeImageKeyCustom = store.get("largeImageKeyCustom");
}

function setbutton(arg1, arg2, arg3, arg4) {
  log.info(`Set buttonsCustom: ` + [arg1, arg2, arg3, arg4]);
  store.set(`buttonsCustom`, [arg1, arg2, arg3, arg4]);
  module.exports.buttonsCustom = store.get("buttonsCustom");
}

module.exports = {
  seticonlargeImageKey,
  setbutton
}
module.exports.updaterChannel = store.get("updaterChannel");
module.exports.largeImageKeyCustom = store.get("largeImageKeyCustom");
module.exports.buttonsCustom = store.get("buttonsCustom");
log.info(`Store Ready`);
