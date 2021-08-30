const Store = require('electron-store');
const store = new Store();

if (store.get('largeImageKeyCustom') === undefined) {
    store.set('largeImageKeyCustom', 'icon_dark');
}

exports.seticon = (icon) => {
    store.set('largeImageKeyCustom', icon);
    module.exports.largeImageKeyCustom = largeImageKeyCustom = store.get('largeImageKeyCustom');
}

module.exports.largeImageKeyCustom = largeImageKeyCustom = store.get('largeImageKeyCustom');