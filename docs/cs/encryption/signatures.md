# Digital Signatures

A **digital signature** proves that a message or file really came from a specific person, and hasn't been tampered with since. It combines **hashing** and **asymmetric encryption**.

<videoembed id="OZtmNEfQ6ag"></videoembed>

## How Signing Works

1. The sender hashes the document, producing a unique fingerprint
2. The sender encrypts that hash with their **private key** - this encrypted hash is the signature
3. Anyone can verify it using the sender's **public key**: decrypt the signature to get the original hash, then hash the document themselves and compare

<digital-sig file="contract.pdf"></digital-sig>

## Detecting Tampering

If even one character of the document changes after signing, the hashes will no longer match:

<digital-sig file="contract.pdf" tamper></digital-sig>

> [!IMPORTANT]
> This is why digital signatures provide two guarantees at once: **authenticity** (it really came from that person) and **integrity** (it hasn't been altered).

## Why Not Just Encrypt the Whole Document?

Encrypting an entire large file with a private key would be slow. Hashing first creates a small, fixed-size fingerprint that's fast to encrypt and verify - the same trick used in [HTTPS & TLS](/cs/encryption/https.md).

## Real-World Uses

- Verifying software updates haven't been tampered with
- Legally binding electronic signatures on contracts
- Verifying the sender of encrypted emails

## In Your School

- Official school reports, certificates, or NCEA-related documents may use digital signatures to prove authenticity
- Software and app updates pushed to school-managed devices are digitally signed so IT staff can verify they're genuine
- Staff signing off timesheets or official forms digitally rely on the same signature-and-verify process

## Test Your Knowledge: Signing and Verifying

Drag these steps into the correct order:

<drag-drop>

1. Sender hashes the original document

2. Sender encrypts the hash with their private key to create the signature

3. Sender shares the document, the signature, and their public key

4. Receiver decrypts the signature using the sender's public key to reveal the original hash

5. Receiver hashes the received document themselves

6. Receiver compares both hashes - a match confirms authenticity and integrity

</drag-drop>

## Key Terms

<flashcards>

- # What two guarantees does a digital signature provide?

    ---

    Authenticity (it really came from that person) and integrity (it hasn't been altered).

- # What two techniques does a digital signature combine?

    ---

    Hashing and asymmetric encryption.

- # Why hash the document before signing, instead of encrypting the whole thing?

    ---

    Hashing creates a small, fixed-size fingerprint that's much faster to encrypt and verify than an entire large document.

</flashcards>

## Further Reading

- [Sectigo - How Digital Signatures Work](https://www.sectigo.com/blog/how-digital-signatures-work) - detailed technical breakdown with real examples
