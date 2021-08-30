const { dialog } = require('electron')
const { autoUpdater } = require("electron-updater");
const path = require('path');
const iconpath = path.join(__dirname, 'assets/icon/connected.png');
let allow = true;

exports.Checkupdates = () => {
    if (allow === true) {
        allow = false;
        autoUpdater.currentChannel = autoUpdater.channel;
        autoUpdater.allowPrerelease = true;
        autoUpdater.allowDowngrade = true;
        autoUpdater.setFeedURL({
            provider: "github",
            owner: "Faelayis",
            repo: "RPC-Pc-Status",
        });
        autoUpdater.checkForUpdates();
        autoUpdater.once('checking-for-update', () => {
            console.log('Checking for update...');
        })
        autoUpdater.once('update-available', (info) => {
            console.log('Update available.');
        })
        autoUpdater.once('update-not-available', (info, event) => {
            dialog.showMessageBox({
                type: 'info',
                buttons: ['ok'],
                title: 'RPC Pc Status Update',
                message: 'Update not available :)',
                noLink: true,
                icon: iconpath,
            }).then((returnValue) => {
                if (returnValue.response === 0) {
                    allow = true;
                };
            })
        })
        autoUpdater.once('error', message => {
            dialog.showMessageBox({
                type: 'error',
                buttons: ['ok'],
                title: 'RPC Pc Status Update Error',
                message: 'There was a problem updating the application',
                detail: `${message}`,
                noLink: true,
            }).then((returnValue) => {
                if (returnValue.response === 0) {
                    allow = true;
                };
            })
        })
        autoUpdater.once('download-progress', (progressObj) => {
            let log_message = "Download speed: " + progressObj.bytesPerSecond;
            log_message = log_message + ' - Downloaded ' + progressObj.percent + '%';
            log_message = log_message + ' (' + progressObj.transferred + "/" + progressObj.total + ')';
            console.log(log_message);
        })
        autoUpdater.once('update-downloaded', (event, releaseNotes, releaseName) => {
            dialog.showMessageBox({
                type: 'info',
                buttons: ['Restart App', 'Later'],
                title: 'RPC Pc Status Update',
                message: process.platform === 'win32' ? releaseNotes : releaseName,
                detail: `${event.releaseName} \nA new version has been downloaded. Restart the application to apply the updates.`,
                noLink: true,
                icon: path.join(__dirname, 'assets/icon/connected.png'),
            }).then((returnValue) => {
                if (returnValue.response === 0) {
                    allow = true, autoUpdater.quitAndInstall();
                } else if (returnValue.response === 1) {
                    allow = true;
                };
            })
        })
    }
};
