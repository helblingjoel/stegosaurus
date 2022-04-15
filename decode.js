const ndarray = require('ndarray')
const getPixels = require("get-pixels")
const savePixels = require("save-pixels")
const fs = require("fs")

Number.prototype.toHex = function() {
  return ("0"+this.toString(16)).slice(-2)
}

function checkPixelIsFlagpost(pixel) {
  flagposts = ["2", "7", "b", "e"]
  const red = pixel.get(0).toHex()
  const green = pixel.get(1).toHex()
  const blue = pixel.get(2).toHex()
  return flagposts.includes(red.substr(-1)) && flagposts.includes(green.substr(-1)) && flagposts.includes(blue.substr(-1))
}

function extractFlagpostPixels(buffer){
  getPixels(buffer, "image/png", (err, pxData) => {
    const flagpostPxArray = ndarray(new Array, [pxData.shape[0], pxData.shape[1]])
    if(err) {
      console.error(err)
    } else {
      for(var rowIndex = 0; rowIndex < pxData.shape[0]; rowIndex++) {
        for(var valueIndex = 0; valueIndex < pxData.shape[1]; valueIndex++) {
          const pixel = pxData.pick(valueIndex, rowIndex, null)
          if(checkPixelIsFlagpost(pixel)) {
            flagpostPxArray.set(valueIndex, rowIndex, 0)
          } else {
            flagpostPxArray.set(valueIndex,rowIndex, 255)
          }
        }
      }
      console.log(flagpostPxArray)
      savePixels(flagpostPxArray, "png").pipe(fs.createWriteStream("out/decoded.png"))
    }
  })
}

extractFlagpostPixels(fs.readFileSync("out/encoded.png"))