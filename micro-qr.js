const bwipjs = require("bwip-js");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");

// Converts hex to bwip's ^NNN syntax - NNN is a 3 digit decimal number representation of a byte (i.e. an ascii char code)
function hexToNNN(data) {
	return data
		.match(/.{1,2}/g)
		.map((i) => "^" + parseInt(i, 16).toString(10).padStart(3, "0"))
		.join("");
}

let successes = 0;
let failures = 0;

function doEncode(uuidMinus) {
	bwipjs.toBuffer(
		{
			bcid: "microqrcode",
			text: hexToNNN(uuidMinus),
			scale: 1,
			eclevel: "L",
			parse: true, // Tell bwip to parse NNN escape codes,
			backgroundcolor: "FFFFFF",
		},
		function (err, png) {
			console.log(uuidMinus);
			console.log(hexToNNN(uuidMinus));
			if (err) {
				failures++;
				//throw err
			} else {
				fs.writeFileSync("out/" + uuidMinus + ".png", png);
				console.log("success");
				successes++;
			}
		}
	);
}

//doEncode("4b3900000000000000000000000000")

const interval = setInterval(function () {
	const uuidMinus = uuidv4().replace(/-/g, "").slice(0, -2);
	doEncode(uuidMinus);
	if (successes === 1000) {
		clearInterval(interval);
		console.log("successes: " + successes + " | failures: " + failures);
	}
}, 10);
