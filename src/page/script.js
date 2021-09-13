const { ipcRenderer } = require("electron");
const { buttonsCustom, seticonlargeImageKey } = require("../store");
// const log = require("electron-log");

let userinfo = ipcRenderer.sendSync("synchronous-userinfo");
document.getElementById("imgprox").src = `${userinfo[3]}`;
document.getElementById("namex").innerHTML = `${userinfo[0]}`;
// document.getElementById("namex").innerHTML = `${userinfo[0]+`#`+userinfo[1]}`;
document.getElementById("button-label-1").value = buttonsCustom[0];
document.getElementById("button-url-1").value = buttonsCustom[1];
document.getElementById("button-label-2").value = buttonsCustom[2];
document.getElementById("button-url-2").value = buttonsCustom[3];

// eslint-disable-next-line no-unused-vars
function getInputValue() {
  // let inputVal = [];
  // inputVal[0] = document.getElementById("details").value;
  // inputVal[1] = document.getElementById("state").value;
  let inputValbutton = [
    document.getElementById("button-label-1").value,
    document.getElementById("button-url-1").value,
    document.getElementById("button-label-2").value,
    document.getElementById("button-url-2").value,
  ];
  ipcRenderer.send("asynchronous-buttonsinput", inputValbutton);
}

window.addEventListener("keydown", function (event) {
  // log.log(event.code)
  if (event.code === "NumpadDivide") {
    this.nice = true
  } else if (this.nice === true && event.code === "NumpadMultiply") {
    this.nice = false
    this.nice2 = true
  } else if (this.nice2 === true && event.code === "Numpad1") {
    this.nice = false
    this.nice2 = false
    seticonlargeImageKey("icon_peach_limited");
  }
}, true);

