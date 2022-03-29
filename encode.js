const getPixels = require("get-pixels")
const savePixels = require("save-pixels")
const fs = require("fs")

// Implements a hex conversion method on all Numbers
Number.prototype.toHex = function() {
  return this.toString(16)
}

function getPixelsPromise(buffer) {
  return new Promise((resolve, reject) => {
    getPixels(buffer, "image/png", (err, pxData) => {
      if(err) {
        reject(err)
      } else {
        resolve(pxData)
      }
    })
  })
}


function findClosestFlagpost(value) {
  const flagposts = [2, 7, "b", "e"]
  decValue = parseInt(value, 16)

  // rounds value to nearest flagpost
  return flagposts.map(flagpost => parseInt(flagpost, 16)).reduce(function(prev, curr) {
    return (Math.abs(curr - decValue) < Math.abs(prev - decValue) ? curr : prev)
  }).toHex();
}

// Modifies the LSB of a 2 digit hex string to nearest flagpost
function modifyLSB(hexString) {
  hexString = ("0"+hexString).slice(-2) // makes sure string is always 2 digits
  splitHex = hexString.split('')
  splitHex[1] = findClosestFlagpost(splitHex[1])
  return splitHex.join("")
}

function modifyPixelData(imagePixels, qrPixels) {
  const qrAlphaLayer = qrPixels.pick(null, null, 3)
  for(var rowIndex = 0; rowIndex < qrAlphaLayer.shape[0]; rowIndex++) {
    for(var valueIndex = 0; valueIndex < qrAlphaLayer.shape[1]; valueIndex++) {
      console.log("got a 255")
      if(qrAlphaLayer.get(valueIndex, rowIndex) === 255) {
        const pixel = imagePixels.pick(valueIndex, rowIndex, null)
        const red = parseInt(modifyLSB(pixel.get(0).toHex()), 16)
        const green = parseInt(modifyLSB(pixel.get(1).toHex()), 16)
        const blue = parseInt(modifyLSB(pixel.get(2).toHex()), 16)
        const alpha = pixel.get(3)
        const channelsArr = [red, green, blue, alpha]
        console.log(channelsArr)
        channelsArr.forEach((intensity, index) => {
          imagePixels.set(rowIndex, valueIndex, index, intensity)
        })
      }
    }
  }
  saveDataToImage(imagePixels)
}

function saveDataToImage(pxData) {
  const outputFile = fs.createWriteStream("out/encoded.png");
  savePixels(pxData, "png").pipe(outputFile)
}


async function encodeQR(qrBuffer, imageBuffer) {
  const [qrPixels, imagePixels] = await Promise.all([
    getPixelsPromise(qrBuffer), 
    getPixelsPromise(imageBuffer)
  ])

  modifyPixelData(imagePixels, qrPixels)
}

module.exports = {
  encodeQR
}