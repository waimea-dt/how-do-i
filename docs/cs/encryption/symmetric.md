# What is Symmetric Encryption?

**Symmetric encryption** uses the *same* key to both encrypt and decrypt data. It's the oldest and fastest form of modern encryption.

> [!NOTE]
> **Type:** Symmetric | **Common algorithms:** AES, DES, ChaCha20 | **Speed:** Fast | **Best for:** Bulk data

<videoembed id="PGsfMXWUUtk"></videoembed>

## How It Works

1. Alice and Bob agree on a secret key beforehand
2. Alice encrypts her message using that key
3. Bob decrypts it using the *same* key

Try it below - notice that the same key appears on both sides:

<sym-asym mode="symmetric"></sym-asym>

## The Catch: Eavesdropping

If Eve intercepts the encrypted message but doesn't have the key, she can't read it:

<sym-asym mode="symmetric" intercept></sym-asym>

> [!WARNING]
> But what if Eve intercepts the **key itself** before Alice and Bob can use it? Symmetric encryption has no way to protect a key while it's being shared - see [The Key Distribution Problem](/cs/encryption/key-distribution.md).

<sym-asym mode="symmetric" intercept intercept-key></sym-asym>

## Why We Still Use It

Despite the key-sharing problem, symmetric encryption is much **faster** than asymmetric encryption, which is why it's used for bulk data - like encrypting an entire hard drive or a video call. See [The AES Algorithm](/cs/encryption/aes.md).

## Where It's Used Today

- **WiFi security** - WPA2/WPA3 encrypt all your WiFi traffic with AES (see [WiFi Security](/cs/encryption/wifi.md))
- **Disk/device encryption** - BitLocker and FileVault encrypt your entire drive with AES (see [Device Encryption](/cs/encryption/bitlocker.md))
- **VPNs** - the actual tunnelled traffic is symmetrically encrypted for speed (see [VPNs](/cs/encryption/vpn.md))
- **HTTPS** - after the initial handshake, your browser and the website swap to symmetric encryption for the bulk of the session (see [HTTPS & TLS](/cs/encryption/https.md))
- **Messaging apps** - encrypting the actual content of calls and messages

## In Your School

- School laptops use **BitLocker/FileVault** (AES) so a lost or stolen device doesn't expose student data
- The school WiFi network encrypts traffic between your device and the access point using AES
- Video call platforms used for remote learning encrypt the audio/video stream symmetrically for speed

## Key Terms

<flashcards>

- # What is symmetric encryption?

    ---

    Encryption where the same key is used to both encrypt and decrypt data.

- # Name two common symmetric algorithms.

    ---

    AES (modern standard) and DES (older, now considered weak).

- # Why is symmetric encryption used for bulk data?

    ---

    Because it's much faster than asymmetric encryption, making it suitable for large amounts of data like files or video streams.

- # What is the main weakness of symmetric encryption?

    ---

    The key distribution problem - both parties need the same secret key, and sharing it securely over an insecure channel is difficult.

</flashcards>

## Further Reading

- [Cloudflare - What is a Cryptographic Key?](https://www.cloudflare.com/learning/ssl/what-is-a-cryptographic-key/) - how keys work in encryption
