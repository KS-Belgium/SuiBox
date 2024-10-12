const snarkjs = require('snarkjs')
const fs = require("fs");

async function verify(){

    // Test if the file is found using the path
    const testFile = fs.readFileSync("./circuit_js/circuit.wasm");
    console.log(testFile);

    const { proof, publicSignals } = await snarkjs.groth16.fullProve(
        { secret: 12345 },
        "./circuit_js/circuit.wasm",
        "circuit_0000.zkey");


    const vKey = JSON.parse(fs.readFileSync("verification_key.json"));
    const res = await snarkjs.groth16.verify(vKey, publicSignals, proof);
    if (res === true) {
        console.log("Verification OK");
    } else {
        console.log("Invalid proof");
    }
}
verify()

verify().then(() => {
    process.exit(0);
});