# Symmetric vs Asymmetric Encryption

## What's the Difference?

Encryption protects data by transforming it into an unreadable format. There are two main approaches:

- **Symmetric encryption**: Uses the same key to encrypt and decrypt
- **Asymmetric encryption**: Uses a public key to encrypt, private key to decrypt

## Symmetric Encryption Demo

In symmetric encryption, Alice and Bob must **share a secret key** before they can communicate securely. This is fast and efficient, but how do they safely share the key in the first place?

<sym-asym mode="symmetric"></sym-asym>

### With Message Interception Only

Eve can see the encrypted message, but not the key:

<sym-asym mode="symmetric" intercept></sym-asym>

### With Key Interception (Key Distribution Problem!)

Eve intercepts both the key AND the message - disaster!

<sym-asym mode="symmetric" intercept intercept-key></sym-asym>

### Key Points
- ✅ **Fast**: AES is ~1000x faster than RSA
- ✅ **Simple**: Same key encrypts and decrypts
- ⚠️ **Key distribution problem**: How do you share the key securely?
- ⚠️ **Scalability**: Need n(n-1)/2 keys for n people to communicate

### Real-world uses
- File encryption (BitLocker, FileVault)
- Encrypting large amounts of data
- VPN tunnels (after key exchange)
- Wi-Fi (WPA2/WPA3)

### With Message Interception Only

Eve can see the encrypted message and the public key, but still can't decrypt:

<sym-asym mode="asymmetric" intercept></sym-asym>

### Eve Has Public Key Too

Even when Eve intercepts the public key, she still can't decrypt the message!

<sym-asym mode="asymmetric" intercept intercept-key

In asymmetric encryption, Bob generates a **public/private key pair**. He can share the public key openly — anyone can use it to encrypt messages, but only Bob's private key can decrypt them!

<sym-asym mode="asymmetric"></sym-asym>

Showing interception of key...

<sym-asym mode="asymmetric" intercept></sym-asym>

### Key Points
- ✅ **No pre-shared secrets**: Public keys can be shared openly
- ✅ **Digital signatures**: Prove authenticity
- ✅ **Key distribution solved**: No secure channel needed
- ⚠️ **Slower**: 100-1000x slower than symmetric encryption
- ⚠️ **Larger ciphertext**: Encrypted data is bigger

### Real-world uses
- HTTPS (TLS/SSL certificates)
- Email encryption (PGP/GPG)
- Digital signatures
- SSH keys
- Cryptocurrency wallets

---

## Direct Comparison

| Feature | Symmetric | Asymmetric |
|---------|-----------|------------|
| **Speed** | Very fast (⚡ AES) | Slow (🐌 RSA) |
| **Key distribution** | Requires secure channel | Public keys safe to share |
| **Keys per person** | 1 shared key per pair | 1 public + 1 private key |
| **Scalability** | Poor (too many keys) | Good (everyone shares public keys) |
| **Use case** | Bulk data encryption | Key exchange, signatures |

---

## Hybrid Approach (Real World)

Most real-world systems like **HTTPS** use **both**:

1. **Asymmetric** (RSA/ECC) to securely exchange a session key
2. **Symmetric** (AES) to encrypt the actual data using that session key

This gives you the **security of asymmetric** encryption with the **speed of symmetric** encryption!

---

## Try Different Messages

### Symmetric with custom message
<sym-asym mode="symmetric" message="Top Secret Plans"></sym-asym>

### Asymmetric with custom message
<sym-asym mode="asymmetric" message="Meet at midnight!"></sym-asym>
