const { ipcRenderer } = require("electron");
const { buttonsCustom, largeImageKeyCustom } = require("../store");
const log = require("electron-log");

ipcRenderer.on("synchronous-userinfo", function (e, userinfo) {
  document.getElementById("profilelogo").src = `${userinfo[3]}`;
  // document.getElementById("nametag").innerHTML = `${userinfo[1]}`;
  document.getElementById("username").innerHTML = `${userinfo[0]}`;
});

document.getElementById("button-label-1").value = `${
  buttonsCustom[0] ? buttonsCustom[0] : ""
}${buttonsCustom[0] && buttonsCustom[1] ? " * " : ""}${
  buttonsCustom[1] ? buttonsCustom[1] : ""
}`;
document.getElementById("button-label-2").value = `${
  buttonsCustom[2] ? buttonsCustom[0] : ""
}${buttonsCustom[2] && buttonsCustom[3] ? " * " : ""}${
  buttonsCustom[3] ? buttonsCustom[3] : ""
}`;
document.getElementById("custom-image").value = `${largeImageKeyCustom}`;

// eslint-disable-next-line no-unused-vars
function getInputValue() {
  let input = document.getElementById("button-label-1").value,
    input2 = document.getElementById("button-label-2").value;
  input = input.split(" * ");
  input2 = input2.split(" * ");
  let inputValbutton = [input[1], input2[0], input2[1]];
  ipcRenderer.send("asynchronous-buttonsinput", inputValbutton);
  ipcRenderer.send(
    "asynchronous-largeImageKey",
    document.getElementById("custom-image").value
  );
}

let CodeEnter = [null];
window.addEventListener(
  "keydown",
  function (event) {
    // log.log(event.code)
    if (event.code === "NumpadDivide") {
      this.i1 = true;
    } else if (event.code === "Backspace") {
      (this.i1 = false), (this.i2 = false), (this.i3 = false);
      CodeEnter = [null];
    } else if (this.i1 === true && event.code === "KeyS") {
      (this.i1 = false), (this.i2 = true);
      setTimeout(() => {
        CodeEnter = [null];
        (this.i1 = false), (this.i2 = false), (this.i3 = false);
      }, 1 * 60 * 1000);
    } else if (this.i2 === true && event.code) {
      CodeEnter.push(`${event.code}`);
      this.i3 = true;
      if (this.i3 === true && event.code === "Enter") {
        (this.i1 = false), (this.i2 = false), (this.i3 = false);
        log.log("Event Code Enter:" + CodeEnter);
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
