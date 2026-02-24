// Minimal proof-of-human circuit for zkVerify (Groth16 / snarkjs).
// Proves knowledge of secret such that:
//   commitment = secret
//   nullifier = secret + campaignId
// (In production, replace with Poseidon hash; this minimal form validates the flow.)
// Public inputs: campaignId
// Public outputs: commitment, nullifier

pragma circom 2.0.0;

template ProofOfHuman() {
    signal input secret;      // private
    signal input campaignId;  // public
    signal output commitment;
    signal output nullifier;

    commitment <== secret;
    nullifier <== secret + campaignId;
}

component main = ProofOfHuman();
