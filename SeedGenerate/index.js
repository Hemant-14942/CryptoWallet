// Import required libraries
const bip39 = require('bip39');                // For mnemonic generation & seed derivation
const ethers = require('ethers');              // Ethereum key derivation
const bitcoin = require('bitcoinjs-lib');      // Bitcoin key & address generation
const { BIP32Factory } = require('bip32');      // BIP32 hierarchical key derivation
const ecc = require('tiny-secp256k1');          // Elliptic curve math for secp256k1
const { Keypair } = require('@solana/web3.js'); // Solana wallet support
const { derivePath } = require('ed25519-hd-key'); // Ed25519 derivation for Solana
const bs58 = require('bs58');                   // Base58 encoding

// Create bip32 instance with secp256k1 curve support
const bip32 = BIP32Factory(ecc);

// ===================== Ethereum Wallet =====================
function deriveEthereumWallet(seed) {
  // BIP44 path for Ethereum: m / purpose' / coin_type' / account' / change / address_index
  const ethPath = "m/44'/60'/0'/0/0";
  
  // Create root node from seed
  const rootNode = ethers.HDNodeWallet.fromSeed(seed);
  
  // Derive Ethereum child key
  const ethNode = rootNode.derivePath(ethPath);

  console.log("\n--- Ethereum ---");
  console.log("Derivation Path:   ", ethPath);
  console.log("Private Key:       ", ethNode.privateKey); // 64-char hex
  console.log("Public Key:        ", ethNode.publicKey);  // 130-char hex
  console.log("Address:           ", ethNode.address);    // Starts with '0x'
}

// ===================== Bitcoin Wallet =====================
function deriveBitcoinWallet(seed) {
  const btcPath = "m/44'/0'/0'/0/0"; // BIP44 path for Bitcoin
  
  const rootNode = bip32.fromSeed(seed);      // Root key from seed
  const btcNode = rootNode.derivePath(btcPath); // Derive Bitcoin key
  
  // Generate P2PKH address (legacy Bitcoin address starting with '1')
  const btcAddress = bitcoin.payments.p2pkh({
    pubkey: Buffer.from(btcNode.publicKey),
  }).address;

  // Convert public key buffer to hexadecimal string
  const publicKeyHex = Array.from(btcNode.publicKey)
    .map(byte => byte.toString(16).padStart(2, '0'))
    .join('');

  console.log("\n--- Bitcoin ---");
  console.log("Derivation Path:   ", btcPath);
  console.log("Private Key (WIF): ", btcNode.toWIF()); // Wallet Import Format
  console.log("Public Key:        ", publicKeyHex);
  console.log("Address:           ", btcAddress);
}

// ===================== Solana Wallet =====================
function deriveSolanaWallet(seed) {
  const solanaPath = "m/44'/501'/0'/0'"; // BIP44 path for Solana
  
  // Ed25519 key derivation (different from secp256k1)
  const solanaDerivedSeed = derivePath(solanaPath, seed).key;
  
  // Create Solana keypair from derived seed
  const solanaKeypair = Keypair.fromSeed(solanaDerivedSeed);
  
  // Get public address (Base58)
  const solanaAddress = solanaKeypair.publicKey.toBase58();
  
  // Encode private key in Base58
  const solanaPrivateKey = bs58.encode(solanaKeypair.secretKey);

  console.log("\n--- Solana ---");
  console.log("Derivation Path:     ", solanaPath);
  console.log("Private Key (Base58):", solanaPrivateKey);
  console.log("Public Key/Address:  ", solanaAddress);
}

// ===================== Main Program =====================
async function main() {
  console.log("========================================================================");
  
  // Generate a 12-word BIP39 mnemonic
  const mnemonic = bip39.generateMnemonic();
  console.log("✅ Generated 12-Word Mnemonic Phrase:");
  console.log(mnemonic);
  console.log("========================================================================");

  // Convert mnemonic to 512-bit seed
  const seed = await bip39.mnemonicToSeed(mnemonic);
  // console.log("✅ Generated 512-Bit Seed:", seed.toString('hex')) ;
  

  // Derive wallets for multiple blockchains
  deriveEthereumWallet(seed);
  deriveBitcoinWallet(seed);
  deriveSolanaWallet(seed);

  console.log("\n========================================================================");
  console.log("✅ Wallet generation complete.");
}

// Run the program
main().catch(console.error);
