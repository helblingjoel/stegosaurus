const jsQR = require("jsqr");
const getPixels = require("get-pixels");
const size = require("image-size");


function readQR(data, width, height){
    const code = jsQR(data, width, height);
    console.log(code);
    if (code)
        console.log(code.binaryData, code.data);
}

getPixels(filepath = "in-bordered.png", (err, pixels) => {
        if (err){
            console.log(`An error occured:\n${err}`);
            return;
        }

        const dimension = size.imageSize(filepath)
        readQR(pixels.data, dimension.width, dimension.height);
    }
);