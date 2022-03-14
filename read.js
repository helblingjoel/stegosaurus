const barcodeXpress = require("barcode-js");

async function read(filepath) {
	const results = await barcodeXpress.analyze(filepath, {
		type: barcodeXpress.BarcodeType.MICROQRCODE,
	});

	if (!results[0]) return false;

	return {
		raw: results[0].valueRaw,
		text: results[0].value.split(" UNLICENSED accusoft.com")[0],
	};
}

async function main() {
	const out = await read("./files/out.png");
	console.log("out.png / in-transparent.png\n", out);

	const whiteBg = await read("./files/in-white-bg.png");
	console.log("in-white-bg.png\n", whiteBg);

	const bordered = await read("./files/in-bordered.png");
	console.log("in-bordered.png\n", bordered);
}

main();
