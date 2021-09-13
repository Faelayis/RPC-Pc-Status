const { ipcRenderer } = require("electron");
const { buttonsCustom } = require("../store");
const log = require("electron-log");

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
let CodeEnter = [null];
window.addEventListener("keydown", function (event) {
  // log.log(event.code)
  if (event.code === "NumpadDivide") {
    this.i1 = true;
  } else if (event.code === "Backspace") {
    this.i1 = false, this.i2 = false, this.i3 = false;
    CodeEnter = [null]
  } else if (this.i1 === true && event.code === "KeyS") {
    this.i1 = false, this.i2 = true;
    setTimeout(() => {
      CodeEnter = [null];
      this.i1 = false, this.i2 = false, this.i3 = false;
    }, 1 * 60 * 1000);
  } else if (this.i2 === true && event.code) {
    CodeEnter.push(`${event.code}`)
    this.i3 = true;
    if (this.i3 === true && event.code === "Enter") {
      this.i1 = false, this.i2 = false, this.i3 = false;
      log.log("Event Code Enter:" + CodeEnter)
      if (CodeEnter[1] === "Numpad0" && CodeEnter[2] === "Enter") {
        ipcRenderer.send("asynchronous-largeImageKey", null);
      } else if (CodeEnter[1] === "Numpad1" && CodeEnter[2] === "Enter") {
        ipcRenderer.send("asynchronous-largeImageKey", "icon_peach_limited");
      }
      CodeEnter = [null];
    }
  }
},
  true
);
