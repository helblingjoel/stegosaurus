const steg = require("any-steganography");
const sharp = require("sharp");
const joinImage = require("join-images").joinImages;
const fs = require("fs");

const key = "abcdefghabcdefghabcdefghabcdefgh";

embedMessage = (filepath, message, outpath) => {
	const file = steg.write(filepath, message, key);
	fs.writeFileSync(outpath, file);
};

const decryptImage = (filepath) => {
	const message = steg.decode(filepath, "png", key);
	return message;
};

const cropImage = (filepath, outpath, width, height, widthStart = 0, heightStart = 0) => {
	return sharp(filepath)
		.extract({ width: width, height: height, left: widthStart, top: heightStart })
		.toFile(outpath)
		.catch((err) => console.log(err));
};

const mergeImage = (image1, image2, stitchLocation, outpath) => {
	if (stitchLocation !== "horizontal" && stitchLocation !== "vertical")
		throw Error("Stitch location is neither horizontal nor vertical");

	joinImage([image1, image2], { direction: stitchLocation }).then((img) => {
		img.toFile(outpath);
	});
};

const main = async () => {
	const file = "./sample_images/test.jpg";
	const metadata = await sharp(file).metadata();

	let width = metadata.width;
	let height = metadata.height;

	let xProcessed = 0;
	let yProcessed = 0;
	for (let x = 0; x <= width - 50; x += 50) {
		yProcessed = 0;
		for (let y = 0; y <= height - 50; y += 50) {
			await cropImage(
				file,
				`./sample_images/cropped-${xProcessed}-${yProcessed}.png`,
				50,
				50,
				x,
				y
			);
			embedMessage(
				`./sample_images/cropped-${xProcessed}-${yProcessed}.png`,
				`message ${xProcessed}-${yProcessed}`,
				`./sample_images/cropped-${xProcessed}-${yProcessed}-done.png`
			);
			fs.unlinkSync(`./sample_images/cropped-${xProcessed}-${yProcessed}.png`);
			yProcessed++;
		}
		xProcessed++;
	}

	xProcessed = 0;
	yProcessed = 0;

	for (let x = 0; x <= width - 50; x += 50) {
		yProcessed = 0;
		for (let y = 0; y <= height - 50; y += 50) {
			console.log(
				decryptImage(
					`./sample_images/cropped-${xProcessed}-${yProcessed}-done.png`
				)
			);
			yProcessed++;
		}
		xProcessed++;
	}
};

main();

// mergeImage("./sample_images/test.jpg", "./sample_images/test.jpg", "vertical");

// embedMessage("./sample_images/test.jpg", "hello there");
