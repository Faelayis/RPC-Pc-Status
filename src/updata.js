const { nativeImage, dialog } = require('electron')
const { autoUpdater } = require("electron-updater");
const path = require('path');

autoUpdater.currentChannel = autoUpdater.channel;
autoUpdater.allowPrerelease = true;
autoUpdater.allowDowngrade = true;
autoUpdater.setFeedURL({
    provider: "github",
    owner: "Faelayis",
    repo: "RPC-Pc-Status",
});

exports.Checkupdates = () => {
    autoUpdater.checkForUpdates();
    autoUpdater.on('checking-for-update', () => {
        console.log('Checking for update...');
    })
    autoUpdater.on('update-available', (info) => {
        console.log('Update available.');
    })
    autoUpdater.on('update-not-available', (info) => {
        console.log('Update not available.');
    })
    autoUpdater.on('error', message => {
        console.error('There was a problem updating the application')
        console.error(message)
    })
    autoUpdater.on('download-progress', (progressObj) => {
        let log_message = "Download speed: " + progressObj.bytesPerSecond;
        log_message = log_message + ' - Downloaded ' + progressObj.percent + '%';
        log_message = log_message + ' (' + progressObj.transferred + "/" + progressObj.total + ')';
        console.log(log_message);
    })
    autoUpdater.on('update-downloaded', (event, releaseNotes, releaseName) => {
        const dialogOpts = {
            type: 'none',
            buttons: ['Restart', 'Later'],
            title: `RPC Pc Status Update`,
            message: process.platform === 'win32' ? releaseNotes : releaseName,
            detail: `${event.releaseName} \nA new version has been downloaded. Restart the application to apply the updates.`,
            icon: nativeImage.createFromPath(path.join(__dirname, 'assets/icon/connected.png')),
        }
        dialog.showMessageBox(dialogOpts).then((returnValue) => {
            if (returnValue.response === 0) autoUpdater.quitAndInstall()
        })
    })
};
