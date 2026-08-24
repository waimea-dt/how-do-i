# Cryptography - The Science of Keeping Secrets

Every time you check your bank balance, message a friend, or connect to school WiFi, **encryption** is quietly protecting you. This section covers everything you need for **AS91898: Demonstrate understanding of a computer science concept - Encryption**.

## What You'll Learn

- The **types of encryption**: symmetric, asymmetric, and hashing
- How **VPNs** protect your traffic
- **WPA2 / WPA3** WiFi security (Personal and Enterprise)
- **Device encryption** like BitLocker
- **Password managers** and why they matter
- **Digital signatures** and how they prove authenticity

> [!IMPORTANT]
> For 2026, questions on impacts focus on **human factors and social impact** - not just the maths. Think about *who* is affected when encryption succeeds or fails, and *why* people make risky security choices.

## Where to Start

<cards>

# Encryption Basics

Start here if you're new to cryptography. What problem does encryption actually solve?

[Read more](/cs/encryption/why.md)

---

# Symmetric vs Asymmetric

**Symmetric** (one shared key, e.g. AES) vs **asymmetric** (public/private key pairs, e.g. RSA) - the two big families of encryption, and why we need both.

[Read more](/cs/encryption/symmetric.md)

---

# Hashing & Signatures

**One-way** functions (not symmetric or asymmetric) that prove integrity and identity.

[Read more](/cs/encryption/hashing.md)

---

# Real-World Applications

VPNs, WiFi security, device encryption, and password managers - and how schools use every one of them.

[Read more](/cs/encryption/vpn.md)

</cards>

## Quick Reference: Symmetric vs Asymmetric vs Hashing

| | Symmetric | Asymmetric | Hashing |
|---|---|---|---|
| **Keys** | One shared key | Public + private key pair | No key |
| **Reversible?** | Yes (with the key) | Yes (with the private key) | No - one-way |
| **Examples** | AES, DES | RSA, Diffie-Hellman | SHA-256 |
| **Modern use** | WiFi, VPNs, disk encryption, bulk data | HTTPS handshakes, digital signatures, key exchange | Password storage, file integrity, signatures |
| **Speed** | Fast | Slow | Very fast |

> [!TIP]
> Each section below has its own **quiz** at the end - use them to check your understanding before moving on.

## Further Reading

- [Khan Academy - Cryptography](https://www.khanacademy.org/computing/computer-science/cryptography) - a free, in-depth course covering ancient and modern cryptography
- [GCFGlobal - Internet Safety](https://www.learnfree.org/en/internetsafety/) - practical, everyday security advice

