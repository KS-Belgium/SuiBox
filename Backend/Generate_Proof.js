const snarkjs = require("snarkjs");
const fs = require("fs");

async function main() {
    // Load the circuit and witness generator (WASM file and zkey)
    const wasmPath = "../circuit/main_js/main.wasm"; // Path to your WASM file
    // const zkeyPath = "../circuit/main.zkey"; // Path to your zkey file (Groth16 proving key)
    const r1csPath = "../circuit/main.r1cs"; // Optional: For debugging, you may load the R1CS file

    // Define the input for the circuit
    const input = {
        "a": "641",
        "b": "6700417"
    };

    // Generate a random zkey
    const zkey = await snarkjs.zKey.new(r1csPath, input);

    // Generate the witness
    const { proof, publicSignals } = await snarkjs.groth16.fullProve(input, wasmPath, zkeyPath);

    // Output the proof and public signals (public inputs)
    console.log("Proof: ", JSON.stringify(proof, null, 1));
    console.log("Public signals: ", JSON.stringify(publicSignals, null, 1));

    // Verify the proof using the verifier key
    const vkey = JSON.parse(fs.readFileSync("../circuit/verification_key.json"));
    const res = await snarkjs.groth16.verify(vkey, publicSignals, proof);

    if (res) {
        console.log("Proof is valid");
    } else {
        console.log("Invalid proof");
    }
}

main().then(() => {
    console.log("Done");
}).catch((err) => {
    console.error("Error: ", err);
});
