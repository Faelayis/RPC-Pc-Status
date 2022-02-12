const Store = require("electron-store");
const log = require("electron-log");
const schema = {
  // detailsCustom: {
  //   type: String,
  // },
  // stateCustom: {
  //   type: String,
  // },
  largeImageKeyCustom: {
    type: String,
  },
  // largeImageTextCustom: {
  //   type: String,
  // },
  status: {
    type: Boolean,
  },
  buttonslabelCustom: {
    type: String,
  },
  // buttonsurlCustom: {
  //   type: String,
  //   format: "url",
  // },
};
const store = new Store(schema);

if (store.get("largeImageKeyCustom") === undefined) {
  store.set("largeImageKeyCustom", "icon_white");
}
if (store.get("buttonsCustom") === undefined) {
  store.set("buttonsCustom", [null, null, null, null]);
}
if (store.get("status") === undefined) {
  store.set("status", true);
}

function setstatus() {
  switch (store.get("status")) {
    case true:
      store.set(`status`, false);
      log.info(`Set status: ` + false);
      break;
    case false:
      store.set(`status`, true);
      log.info(`Set status: ` + true);
      break;
  }
  module.exports.status = store.get("status");
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
  setbutton,
  setstatus,
};
module.exports.largeImageKeyCustom = store.get("largeImageKeyCustom");
module.exports.buttonsCustom = store.get("buttonsCustom");
module.exports.status = store.get("status");
log.info(`Store Ready`);
