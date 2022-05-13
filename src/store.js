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
  onlytext: {
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
if (store.get("onlytext") === undefined) {
  store.set("onlytext", false);
}

function getvalue(_store) {
  return store.get(`${_store}`);
}

function setvalue(_store, val, type) {
  if (type === "switch") {
    switch (store.get(_store)) {
      case true:
        store.set(_store, false);
        log.info(`Set ${_store}: false`);
        break;
      case false:
        store.set(_store, true);
        log.info(`Set ${_store}: true`);
        break;
    }
  } else {
    log.info(`Set ${_store}: ${val}`);
    store.set(_store, val);
  }
  return store.get(_store);
}

module.exports = {
  setvalue,
  getvalue,
};
log.info(`Store Ready`);
