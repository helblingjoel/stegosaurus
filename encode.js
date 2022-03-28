const getPixels = require("get-pixels")
const savePixels = require("save-pixels")
const fs = require("fs")

// Implements a hex conversion method on all Numbers
Number.prototype.toHex = function() {
  return this.toString(16)
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

function modifyPixelData(pxData) {
  // Will simply encode a hollow 5x5 square into the top left corner using flagpost encoding
  const exampleToEncode = [[1,1,1,1,1], [1,0,0,0,1], [1,0,0,0,1], [1,0,0,0,1], [1,1,1,1,1]]

  exampleToEncode.forEach((row, rowIndex) => {
    row.forEach((value, valueIndex) => {
      if(value === 1) {
        const pixel = pxData.pick(valueIndex, rowIndex, null)
        const red = parseInt(modifyLSB(pixel.get(0).toHex()), 16)
        const green = parseInt(modifyLSB(pixel.get(1).toHex()), 16)
        const blue = parseInt(modifyLSB(pixel.get(2).toHex()), 16)
        const alpha = pixel.get(3)
        const channelsArr = [red, green, blue, alpha]
        console.log(channelsArr)
        channelsArr.forEach((intensity, index) => {
          pxData.set(rowIndex, valueIndex, index, intensity)
        })
      }
    })
  })
  saveDataToImage(pxData)
}

function saveDataToImage(pxData) {
  const outputFile = fs.createWriteStream("out.png");
  savePixels(pxData, "png").pipe(outputFile)
}

getPixels("example.png", function(err, pixels) {
  if(err) {
    console.log("Bad image path")
    return
  }
  console.log(`got pixels, w: ${pixels.shape.slice()[0]}px h: ${pixels.shape.slice()[1]}px`)
  modifyPixelData(pixels)
})