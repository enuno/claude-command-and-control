# Building Bitcoin in Rust - Quick Reference

Fast lookup guide for common Bitcoin implementation topics in Rust.

## 🎯 Common Questions & Where to Find Answers

### Getting Started

**Q**: "Where should I start learning Bitcoin implementation?"
**A**: Read PDF pages 1-50 (cryptographic foundations)
**Topics**: Hash functions, key generation, addresses

**Q**: "What Rust crates should I use?"
**A**: Read PDF networking/dependencies chapters
**Key Crates**: `bitcoin`, `secp256k1`, `rust-crypto`, `tokio`

### Cryptography

**Q**: "How do I implement SHA-256 in Rust?"
**A**: Read PDF pages 1-30 (hash functions chapter)
**Implementation**: Step-by-step SHA-256 with Rust code

**Q**: "How does ECDSA signing work with secp256k1?"
**A**: Read PDF pages 51-80 (digital signatures)
**Topics**: Key generation, signing, verification, recovery

**Q**: "How do I generate Bitcoin addresses?"
**A**: Read PDF pages 31-50 (address generation)
**Flow**: Public key → SHA-256 → RIPEMD-160 → Base58Check

### Blockchain Basics

**Q**: "What's the structure of a Bitcoin block?"
**A**: Read PDF pages 101-130 (block structure)
**Components**: Block header, transactions, Merkle tree

**Q**: "How do I validate a blockchain?"
**A**: Read PDF pages 131-160 (chain validation)
**Rules**: PoW check, header validation, transaction validation

**Q**: "How do Merkle trees work in Bitcoin?"
**A**: Read PDF pages 115-125 (Merkle tree implementation)
**Purpose**: Efficient transaction verification

### Transactions

**Q**: "Explain the UTXO model"
**A**: Read PDF pages 151-180 (UTXO chapter)
**Concept**: Unlike accounts, Bitcoin tracks unspent outputs

**Q**: "How do I create a Bitcoin transaction?"
**A**: Read PDF pages 181-210 (transaction construction)
**Steps**: Select inputs, create outputs, sign, serialize

**Q**: "What is Bitcoin Script?"
**A**: Read PDF pages 211-240 (Script language)
**Purpose**: Programmable transaction conditions

**Q**: "How do I validate a transaction?"
**A**: Read PDF pages 195-220 (transaction validation)
**Checks**: Input validation, output sum, script execution, signatures

### Consensus

**Q**: "How does Proof of Work work?"
**A**: Read PDF pages 221-250 (PoW algorithm)
**Process**: Find nonce where block hash < target

**Q**: "How is mining difficulty adjusted?"
**A**: Read PDF pages 251-270 (difficulty adjustment)
**Formula**: Adjust every 2016 blocks based on time

**Q**: "What are consensus rules?"
**A**: Read PDF pages 240-280 (consensus chapter)
**Critical**: Rules all nodes must agree on

### Networking

**Q**: "How does Bitcoin P2P networking work?"
**A**: Read PDF pages 271-310 (networking protocol)
**Topics**: Node discovery, message types, block relay

**Q**: "What messages does Bitcoin use?"
**A**: Read PDF pages 295-310 (message formats)
**Examples**: version, verack, getblocks, inv, tx, block

**Q**: "How do I connect to Bitcoin network?"
**A**: Read PDF pages 311-330 (node implementation)
**Implementation**: Tokio async networking in Rust

### Wallets

**Q**: "How do HD wallets work?"
**A**: Read PDF pages 341-370 (HD wallets)
**Standards**: BIP32 (derivation), BIP39 (mnemonics), BIP44 (paths)

**Q**: "How do I derive keys from a seed?"
**A**: Read PDF pages 355-370 (key derivation)
**Path**: m/44'/0'/0'/0/0 (BIP44 standard)

**Q**: "How do I estimate transaction fees?"
**A**: Read PDF pages 381-390 (fee estimation)
**Methods**: Historical analysis, mempool inspection

### Advanced Features

**Q**: "What is SegWit?"
**A**: Read PDF pages 391-405 (Segregated Witness)
**Benefits**: Transaction malleability fix, capacity increase

**Q**: "How does Lightning Network work?"
**A**: Read PDF pages 406-415 (payment channels)
**Concept**: Off-chain transactions, periodic settlement

**Q**: "What is Taproot?"
**A**: Read PDF pages 416-419 (Taproot/Schnorr)
**Features**: Privacy, efficiency, smart contracts

## 🔑 Implementation Cheat Sheet

### Essential Rust Patterns

```rust
// Error handling
use std::result::Result;
type BitcoinResult<T> = Result<T, BitcoinError>;

// Hash types (use newtypes for safety)
pub struct Sha256Hash([u8; 32]);
pub struct BlockHash(Sha256Hash);
pub struct TxHash(Sha256Hash);

// Address types
pub enum Address {
    P2PKH(PubkeyHash),
    P2SH(ScriptHash),
    P2WPKH(WitnessProgram),
    P2WSH(WitnessProgram),
}

// Transaction structure
pub struct Transaction {
    version: i32,
    inputs: Vec<TxInput>,
    outputs: Vec<TxOutput>,
    locktime: u32,
}
```

### Key Algorithms

**SHA-256 Double Hash**:
```rust
fn hash256(data: &[u8]) -> [u8; 32] {
    let hash1 = sha256(data);
    sha256(&hash1)
}
```

**Base58Check Encoding**:
```rust
fn base58check_encode(version: u8, data: &[u8]) -> String {
    let mut payload = vec![version];
    payload.extend_from_slice(data);
    let checksum = &hash256(&payload)[..4];
    payload.extend_from_slice(checksum);
    base58::encode(&payload)
}
```

**Proof of Work Validation**:
```rust
fn validate_proof_of_work(block_header: &BlockHeader) -> bool {
    let hash = block_header.hash();
    let target = block_header.target();
    hash < target
}
```

## 📊 Decision Trees

### "I want to build a..."

```
Bitcoin Node
├─ Full Node
│  ├─ Read: Blockchain + Consensus + Networking (pages 101-340)
│  ├─ Implement: Block validation, tx relay, mempool
│  └─ Test: Connect to testnet
│
├─ Light Client (SPV)
│  ├─ Read: Merkle proofs + Networking (pages 115-125, 271-310)
│  ├─ Implement: Header validation, bloom filters
│  └─ Less storage required
│
└─ Mining Node
   ├─ Read: PoW + Block creation (pages 221-270)
   ├─ Implement: Mining loop, difficulty adjustment
   └─ Combine with bitcoin-mining skill for economics

Wallet Application
├─ HD Wallet
│  ├─ Read: HD wallets + Transaction construction (pages 341-390)
│  ├─ Implement: BIP32/39/44, fee estimation
│  └─ Secure key storage
│
├─ Hardware Wallet
│  ├─ Read: Signing + Security (pages 51-100)
│  ├─ Implement: Secure element integration
│  └─ Transaction signing without exposing keys
│
└─ Watch-Only Wallet
   ├─ Read: Address generation (pages 31-50)
   ├─ No private keys needed
   └─ Track balances only

Payment Processor
├─ Invoice Generation
│  ├─ Read: Addresses + Transactions (pages 151-210)
│  ├─ Implement: QR codes, payment requests
│  └─ Combine with btcpayserver-doc skill
│
└─ Payment Detection
   ├─ Read: Networking + Confirmations (pages 271-340)
   ├─ Monitor blockchain for payments
   └─ Webhook notifications

Alternative Cryptocurrency
├─ Fork Bitcoin
│  ├─ Read: All chapters (understand before modifying)
│  ├─ Modify: Genesis block, consensus rules
│  └─ Warning: Security implications
│
└─ New Design
   ├─ Read: Architecture decisions throughout PDF
   ├─ Learn: Why Bitcoin made specific choices
   └─ Design: Based on understanding trade-offs
```

## 🐛 Common Issues & Solutions

| Problem | Solution | PDF Reference |
|---------|----------|---------------|
| Address validation fails | Check version byte and checksum | Pages 31-50 |
| Transaction rejected | Validate inputs exist and signatures correct | Pages 195-220 |
| Block validation fails | Check PoW, Merkle root, coinbase | Pages 131-160 |
| Can't connect to network | Verify message format and protocol | Pages 271-310 |
| Key derivation incorrect | Follow BIP32 spec exactly | Pages 355-370 |
| Script execution error | Debug script step-by-step | Pages 211-240 |

## 🔒 Security Checklist

When implementing Bitcoin components:

**Cryptography**:
- [ ] Use audited libraries (secp256k1 crate)
- [ ] Never roll your own crypto
- [ ] Constant-time operations for key material
- [ ] Secure random number generation

**Key Management**:
- [ ] Never log or print private keys
- [ ] Use secure memory for key storage
- [ ] Implement proper key derivation (BIP32)
- [ ] Consider hardware wallet integration

**Consensus Rules**:
- [ ] Match Bitcoin Core behavior exactly
- [ ] Test against Bitcoin test vectors
- [ ] Handle edge cases and attacks
- [ ] Stay updated with soft/hard forks

**Network Security**:
- [ ] Validate all incoming messages
- [ ] Rate limit connections
- [ ] Implement DoS protections
- [ ] Use peer scoring

## 📚 Learning Paths

### Beginner Path (No Bitcoin experience)
1. **Week 1**: Cryptography (pages 1-100)
   - Implement hashing
   - Create key pairs
   - Generate addresses

2. **Week 2**: Blockchain basics (pages 101-160)
   - Build block structure
   - Create Merkle trees
   - Validate blocks

3. **Week 3**: Transactions (pages 151-240)
   - Understand UTXO
   - Create transactions
   - Validate scripts

4. **Week 4**: Simple wallet (pages 341-390)
   - Generate HD wallet
   - Send/receive Bitcoin
   - Testnet testing

### Intermediate Path (Some blockchain knowledge)
1. **Week 1**: Review architecture (skim pages 1-160)
2. **Week 2**: Consensus deep dive (pages 221-280)
3. **Week 3**: Networking (pages 271-340)
4. **Week 4**: Advanced features (pages 391-419)

### Expert Path (Bitcoin Core contributor)
1. Focus on Rust-specific patterns
2. Review consensus-critical sections
3. Study advanced features (SegWit, Taproot)
4. Implement optimizations

## 🔗 Cross-References

### With Other Skills in Repository

**bitcoin-mining skill**:
- That skill: Mining economics and operations
- This skill: Mining algorithm implementation
- **Together**: Build complete mining solution

**cryptocurrency/btcpayserver-doc skill**:
- That skill: Payment gateway deployment
- This skill: Transaction construction and validation
- **Together**: Build payment processing system

### With External Resources

**Bitcoin Core**:
- Reference implementation (C++)
- Consensus rules authority
- Test vectors source

**BIPs (Bitcoin Improvement Proposals)**:
- Protocol specifications
- Standard definitions
- Feature proposals

**Rust Bitcoin Library** (`bitcoin` crate):
- Production-ready implementation
- API reference
- Code examples

---

*This quick reference maps common questions to specific sections in the 419-page "Building Bitcoin in Rust" guide for efficient lookup.*
