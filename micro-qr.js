const bwipjs = require('bwip-js');
const fs = require("fs")

// Converts hex to bwip's ^NNN syntax - NNN is a 3 digit decimal number representation of a byte (i.e. an ascii char code)
function hexToNNN(data) {
  return data.match(/.{1,2}/g).map(i => "^" + parseInt(i, 16).toString(10).padStart(3, "0")).join("")
}
const uuidMinus = "a5d3d1513e74466881678dc5553c2a" //UUID minus last byte
console.log(hexToNNN(uuidMinus))

bwipjs.toBuffer({
        bcid: "microqrcode",
        text: hexToNNN(uuidMinus),
        scale: 1,
        eclevel: "L",
        parse: true // Tell bwip to parse NNN escape codes
    }, function (err, png) {
        if (err) {
            throw err
        } else {
          fs.writeFileSync("out.png", png)
            // `png` is a Buffer
            // png.length           : PNG file length
            // png.readUInt32BE(16) : PNG image width
            // png.readUInt32BE(20) : PNG image height
        }
    });