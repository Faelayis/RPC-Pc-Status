
const { ipcRenderer } = require("electron");
const store = require("../store");
// const log = require("electron-log");

let userinfo = ipcRenderer.sendSync("synchronous-userinfo");
document.getElementById("imgprox").src = `${userinfo[3]}`;
document.getElementById("namex").innerHTML = `${userinfo[0]}`;
// document.getElementById("namex").innerHTML = `${userinfo[0]+`#`+userinfo[1]}`;
document.getElementById("button-label-1").value = store.buttonsCustom[0];
document.getElementById("button-url-1").value = store.buttonsCustom[1];
document.getElementById("button-label-2").value = store.buttonsCustom[2];
document.getElementById("button-url-2").value = store.buttonsCustom[3];

// eslint-disable-next-line no-unused-vars
function getInputValue() {
    // let inputVal = [];
    // inputVal[0] = document.getElementById("details").value;
    // inputVal[1] = document.getElementById("state").value;
    let inputValbutton = [
        document.getElementById("button-label-1").value,
        document.getElementById("button-url-1").value,
        document.getElementById("button-label-2").value,
        document.getElementById("button-url-2").value];
    ipcRenderer.send('asynchronous-buttonsinput', inputValbutton);
}