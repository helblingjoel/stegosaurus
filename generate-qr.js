const bwipjs = require('bwip-js');
const fs = require("fs")
const { v4: uuidv4 } = require('uuid')
//const encode = require("encode.js")


// Converts hex to bwip's ^NNN syntax - NNN is a 3 digit decimal number representation of a byte (i.e. an ascii char code)
function hexToNNN(data) {
  return data.match(/.{1,2}/g).map(i => "^" + parseInt(i, 16).toString(10).padStart(3, "0")).join("")
  
}

function doGenerate(uuid) {
  bwipjs.toBuffer({
    bcid: "qrcode",
    text: hexToNNN(uuid),
    scale: 1,
    eclevel: "M",
    parse: true // Tell bwip to parse NNN escape codes
    }, function (err, png) {
      console.log(uuid)
      console.log(hexToNNN(uuid))
      if (err) {
        throw err
      } else {
        fs.writeFileSync("out/" + uuid + ".png", png)
        console.log("success")
      }
    });
}

const uuid = uuidv4().replace(/-/g, "")
doGenerate(uuid)