const barcodeXpress = require("barcode-js");

async function read() {
	const results = await barcodeXpress.analyze("in-bordered.png", {
		type: barcodeXpress.BarcodeType.MICROQRCODE,
	});
	console.log(results[0]);
	return {
		raw: results[0].valueRaw,
		text: results[0].value.split(" UNLICENSED accusoft.com")[0],
	};
}

async function main() {
	const values = await read();
	console.log(values);
}

main();
