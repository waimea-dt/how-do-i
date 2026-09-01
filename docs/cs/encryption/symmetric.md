# What is Symmetric Encryption?

**Symmetric encryption** uses the *same* key to both encrypt and decrypt data. It's the oldest and **fastest** form of modern encryption.

> [!TIP]
> - Common algorithms: **AES**, **DES**
> - Keys: **Same key** encrypts and decrypts
> - Speed: ✅ **Fast** - AES is ~1000x faster than RSA
> - Issues: ⚠️ **Key distribution problem** - How do you share the key securely?
> - Best for: **Bulk data** - whole hard drives, video streams, etc.

## How It Works

1. Alice or Bob create a **secret key**
2. Alice and Bob **share the key**, so they both have a copy
3. Alice **encrypts** her plaintext message using that **key**
4. Alice **sends** the ciphertext to Bob
5. Bob **decrypts** the ciphertext using the **same key**

<requests>

- Left: **Alice**

- Right: **Bob**

- Requests:

    1. L   (i R : Creates a **KEY**
    2. L <--- R : Shares **KEY**
    3. L i)   R : Encrypts PLAINTEXT message using the **KEY**
    4. L ---> R : Sends **CIPHERTEXT**
    6. L   (i R : Decrypts CIPHERTEXT using the **KEY**

</requests>

## Try It Yourself

Try it below - notice that the same key appears on both sides:

<sym-asym mode="symmetric"></sym-asym>

## The Key Distribution Problem

If Alice and Bob have never met (or it is not possible for them to meet in-person), and every message between them can be intercepted, how can they agree on a secret key without Eve, the eavesdropper, learning it too?

If Eve is monitoring Alice and Bob's communications and **intercepts** the key and encrypted message, she is able to read it.

This is [the Key Distribution Problem](/cs/encryption/key-distribution.md).

## Why We Still Use It

Despite the key-sharing problem, symmetric encryption is much **faster** than asymmetric encryption, which is why it's used for **bulk data** - like encrypting an entire hard drive, or data streamed during a video call.

See [The AES Algorithm](/cs/encryption/aes.md) for the real-world symmetric algorithm.

## Where It's Used Today

| Technology                                                   | How it is Used                                                                                                                                                                     | Why it is Used                                                                                                      |
| ------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| **HTTPS** (HyperText Transfer Protocol, Secure)              | When browsing the web, after the initial TLS handshake (which used asymmetric encryption), your browser and the website switch to symmetric encryption for the bulk of the session | Allows the bulk of your web browsing to use fast, symmetric encryption (see [HTTPS & TLS](/cs/encryption/https.md)) |
| **Messaging Apps** (e.g. WhatsApp, Signal, etc.)             | Encrypting the actual content of calls and messages                                                                                                                                | Keeps personal messages secure and allows high-data features like audio and video calls to be fully secure too      |
| **WiFi Security** (e.g. WPA2/WPA3)                           | WPA2/WPA3 encrypt all your WiFi traffic with AES (see [WiFi Security](/cs/encryption/wifi.md))                                                                                     | Allows for maximum speed throughput from mobile devices to wireless access points                                   |
| **Disk/device encryption** (e.g. BitLocker, FileVault, etc.) | Full disk encryption systems such as BitLocker encrypt your entire drive with AES (see [Device Encryption](/cs/encryption/bitlocker.md))                                           | The large volume of data on a hard drive (often 100s of GBs) needs to be constantly accessed, so speed is essential |
| **VPNs**                                                     | VPNs 'tunnel' your data through servers to disguise or hide your web online activity                                                                                               | The actual tunnelled traffic is symmetrically encrypted for speed (see [VPNs](/cs/encryption/vpn.md))               |


## In Your School

- School laptops use **BitLocker/FileVault** (AES) so a lost or stolen device doesn't expose student data
- The school WiFi network encrypts traffic between your device and the access point using **WPA3 Enterprise** (AES) for high speed wireless connections
- Video call platforms like Teams, used for remote learning, encrypt the **audio/video stream** symmetrically for speed (AES)


## Key Terms

<flashcards shuffle>

- # **Symmetric** Encryption

    ---

    Encryption where the **same key** is used to both encrypt and decrypt data

- # Common **symmetric algorithms**

    ---

    **AES** (modern standard) and **DES** (older, now considered weak)

- # Symmetric encryption is good for **bulk data** because...

    ---

    Because it's **much faster than asymmetric encryption**, making it suitable for large amounts of data like files or video streams

- # Symmetric encryption's main **weakness** is...

    ---

    The **key distribution problem** - both parties need the same secret key, and sharing it securely over an insecure channel is difficult.

</flashcards>

## Further Reading

- [Cloudflare - What is a Cryptographic Key?](https://www.cloudflare.com/learning/ssl/what-is-a-cryptographic-key/) - how keys work in encryption
