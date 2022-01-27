const Steganography = require("any-steganography");
const fs = require("fs");

let key = "abcdefghabcdefghabcdefghabcdefgh";
let file = Steganography.write("./sample_images/test.jpg", "Hello", key);

fs.writeFileSync("./sample_images/test-processed.jpg", file);
let msg = Steganography.decode("./sample_images/test-processed.jpg", "jpg", key);
console.log("Decrypted Message : ", msg);
