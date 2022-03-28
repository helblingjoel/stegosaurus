const bwipjs = require('bwip-js');
const fs = require("fs")
const { v4: uuidv4 } = require('uuid')
const encode = require("encode.js")


// Converts hex to bwip's ^NNN syntax - NNN is a 3 digit decimal number representation of a byte (i.e. an ascii char code)
function hexToNNN(data) {
  return data.match(/.{1,2}/g).map(i => "^" + parseInt(i, 16).toString(10).padStart(3, "0")).join("")
  
}

function doGenerate(uuidMinus) {
  bwipjs.toBuffer({
    bcid: "microqrcode",
    text: hexToNNN(uuidMinus),
    scale: 1,
    eclevel: "L",
    parse: true // Tell bwip to parse NNN escape codes
    }, function (err, png) {
      console.log(uuidMinus)
      console.log(hexToNNN(uuidMinus))
      if (err) {
        throw err
      } else {
        fs.writeFileSync("out/" + uuidMinus + ".png", png)
        console.log("success")
      }
    });
}

function attemptGenerate(attemptNumber) {
  const uuidMinus = uuidv4().replace(/-/g, "").slice(0, -2)
  if(attemptNumber >= 10) {
    console.log("Failed to generate after 10 attempts")
    return
  }
  try {
    doGenerate(uuidMinus)
  } catch (error) {
    attemptGenerate(attemptNumber + 1)
  }
}

attemptGenerate(0)
