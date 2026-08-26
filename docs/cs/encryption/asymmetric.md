# What is Asymmetric Encryption?

**Asymmetric encryption** (also called public-key encryption) uses *two different but mathematically linked* keys: a **public key** to encrypt, and a **private key** to decrypt. This solves the key distribution problem that plagues symmetric encryption.

> [!NOTE]
> **Type:** Asymmetric | **Common algorithms:** RSA, Elliptic Curve Cryptography (ECC) | **Speed:** Slow | **Best for:** Key exchange, signatures, identity verification

<videoembed id="AQDCe585Lnc"></videoembed>

<videoembed id="6-JjHa-qLPk"></videoembed>

## How It Works

1. Bob generates a **key pair**: a public key and a private key
2. Bob shares his public key with *anyone*, including Alice - it doesn't matter if Eve sees it too
3. Alice encrypts her message using Bob's public key
4. Only Bob's private key can decrypt it - not even Alice can undo her own encryption!

<sym-asym mode="asymmetric" message="Meet at midnight!"></sym-asym>

## Why Interception Doesn't Matter

Try it with Eve watching - notice she can see the public key and the encrypted message, but still can't read it:

<sym-asym mode="asymmetric" intercept></sym-asym>

> [!IMPORTANT]
> This is the breakthrough: **the public key never needs to be secret.** Only the private key does, and it never has to travel anywhere.

## The Trade-off

|                      | Symmetric               | Asymmetric                |
| -------------------- | ----------------------- | ------------------------- |
| Keys                 | One shared key          | Public + private key pair |
| Speed                | Fast                    | Much slower               |
| Key sharing problem? | Yes                     | No                        |
| Common use           | Bulk data (files, WiFi) | Key exchange, signatures  |

In practice, most secure systems (like HTTPS) use **both**: asymmetric encryption to safely share a key, then symmetric encryption for the actual data. See [HTTPS & TLS](/cs/encryption/https.md).

## Where It's Used Today

- **HTTPS handshakes** - your browser uses asymmetric encryption to safely agree a symmetric key with a website (see [HTTPS & TLS](/cs/encryption/https.md))
- **Digital signatures** - signing software updates, emails, and documents (see [Digital Signatures](/cs/encryption/signatures.md))
- **SSH** - securely logging into remote servers
- **Enterprise WiFi (802.1X)** - verifying a user's identity before granting network access (see [WiFi Security](/cs/encryption/wifi.md))

## In Your School

- The school's website/portal (HTTPS) uses asymmetric encryption to safely set up a secure connection before you log in
- **WPA2/WPA3-Enterprise** WiFi uses certificates and public-key cryptography to check your identity before letting your device online
- Software updates pushed to school devices are digitally signed, so the school's IT system can verify they haven't been tampered with

## Key Terms

<flashcards>

- # What is asymmetric encryption?

    ---

    Encryption using a mathematically linked key pair - a public key to encrypt, and a private key to decrypt.

- # Why doesn't the public key need to be secret?

    ---

    Because only the matching private key can decrypt data encrypted with it - anyone can see the public key safely.

- # Name a common asymmetric algorithm.

    ---

    RSA (or Elliptic Curve Cryptography).

- # Why do most real systems combine symmetric and asymmetric encryption?

    ---

    Asymmetric encryption safely exchanges a key, then fast symmetric encryption handles the actual bulk data.

</flashcards>

## Further Reading

- [Cloudflare - What is Asymmetric Encryption?](https://www.cloudflare.com/learning/ssl/what-is-asymmetric-encryption/) - clear technical overview
