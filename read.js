const barcodeXpress = require("barcode-js");
const fs = require("fs");

async function read(filepath) {
	const results = await barcodeXpress.analyze(filepath, {
		type: barcodeXpress.BarcodeType.MICROQRCODE,
	});

	if (!results[0]) return false;

	return results[0].valueRaw;
}

async function main() {
	let errors = 0;
	let success = 0;
	let count = 0;
	let earliestError = Number.MAX_SAFE_INTEGER;

	const report = {};

	const files = fs.readdirSync("./out");

	files.forEach((file, processed) => {
		if (file.split(".")[1] === "png") {
			const expectedResult = file.split(".")[0];

			read(`./out/${file}`).then((outputBuffer) => {
				const outputString = BigInt("0x" + outputBuffer.toString("hex"))
					.toString(16)
					.substring(0, expectedResult.length);

				for (let i = 0; i < expectedResult.length; i++) {
					if (i === 0) {
						report[expectedResult] = [];
						report[expectedResult].push({ output: outputString });
					}

					count++;

					if (expectedResult[i] !== outputString[i]) {
						errors++;
						report[expectedResult].push({
							position: i,
							expected: expectedResult[i],
							actual: outputString[i],
						});

						if (earliestError > i) earliestError = i;
					} else {
						success++;
					}
				}

				if (processed === files.length - 1) {
					report.result = {
						success: success,
						error: errors,
						rate: `${(100 / count) * errors}%`,
						earliestError: earliestError,
					};

					fs.writeFileSync("analysis.json", JSON.stringify(report), "utf-8");
				}
			});
		}
	});
}

main();
