const steg = require("any-steganography");
const sharp = require("sharp");
const joinImage = require("join-images").joinImages;
const fs = require("fs");

const key = "abcdefghabcdefghabcdefghabcdefgh";

embedMessage = (filepath, message) => {
	const file = steg.write(filepath, message, key);
	fs.writeFileSync("./sample_images/test-processed.jpg", file);
};

const decryptImage = (filepath) => {
	const message = steg.decode(filepath, "jpg", key);
	return message;
};

const cropImage = (filepath, width, height, widthStart = 0, heightStart = 0) => {
	sharp(filepath)
		.extract({ width: width, height: height, left: widthStart, top: heightStart })
		.toFile("./sample_images/cropped.jpg")
		.catch((err) => console.log(err));
};

const mergeImage = (image1, image2, stitchLocation) => {
	if (stitchLocation !== "horizontal" || stitchLocation !== "vertical")
		throw Error("Stitch location is neither horizontal nor vertical");
	joinImage([image1, image2], { direction: "horizontal" }).then((img) => {
		img.toFile("out.png");
	});
};

cropImage("./sample_images/test.jpg", 50, 50);

mergeImage("./sample_images/test.jpg", "./sample_images/test.jpg", "somewhere");

embedMessage("./sample_images/test.jpg", "hello there");
