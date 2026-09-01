# What is Asymmetric Encryption?

Asymmetric cryptography uses **mathematically linked public and private information** so that secret keys do not need to be exchanged publically, unlike symmetric cryptography.

> [!TIP]
> - Keys: **Secret keys are never shared**, only public information
> - Speed: ⚠️ **Slow** compared to symmetric encryption
> - Benefits: ✅ **No Key Distribution Problem**
> - Best for: **Small secrets**, not bulk data

## Three Different Uses

| Use                                                   | Description                                                                                                                                                                      | Application                                                               |
| ----------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| [Public-Key Encryption](/cs/encryption/public-key.md) | Key pairs are created: public and private. The public key can be shared freely. The public key is used to encrypt messages, but these can only be decrypted with the private key | [RSA](/cs/encryption/rsa.md) can do this                                  |
| [Key Exchange](/cs/encryption/key-exchange.md)        | Two parties can end up with the same shared secret without actually sending it. Instead they publically share information that is used to generate the shared secret             | [Diffie-Hellman Key Exchange](/cs/encryption/diffie-hellman.md) does this |
| [Digital Signatures](/cs/encryption/signatures.md)    | A private key can be used to 'sign' a document / message to prove that it came from a specific person and ensure it has not been tampered with                                   | **DSA** (Digital Signature Algorithm) is a common standard for this |

> [!NOTE]
> **Key exchange** is usually used to create a **shared symmetric key** and symmetric encryption is then used to protect the actual data.

## Asymmetric vs Symmetric Encryption

|                  | Symmetric                   | Asymmetric                              |
| ---------------- | --------------------------- | --------------------------------------- |
| Keys             | **One** shared secret       | **Both** public and private information |
| Key Distribution | ⚠️ Problem!               | ✅ No problem                           |
| Speed            | ✅ Fast                     | ⚠️ Much slower                        |
| Main use         | **Bulk** data - files, WiFi | Key exchange, encryption, signatures    |

## Where It's Used Today

| Technology                                    | How it is Used                                                                                                                                                                       | Why it is Used                                                                                                                                     |
| --------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| **HTTPS Handshake** (setup of HTTPS session)  | When you browse to an HTTPS website, your browser uses **key exchange** to safely agree a symmetric key with the website (see [HTTPS & TLS](/cs/encryption/https.md))                | Allows your browser and the website server to continue with faster symmetric encryption for all subsequent web traffic                             |
| **Digital Signatures** (to authenticate data) | Digital signatures are used to 'sign' software updates, emails, and documents (see [Digital Signatures](/cs/encryption/signatures.md))                                               | Signed documents can be validated to make sure they are authentic and haven't been tampered with, e.g. software updates for school devices                                                  |
| **SSH** (Secure Shell)                        | SSH is used to securely log into remote servers. It is common for servers not to have a physical screen / keyboard - instead an operator used SSH to login via a network connection. | SSH allows server operators to login and run commands on a server without revealing any sensitive information to other network users               |
| **WPA2/WPA3-Enterprise Wifi**                 | Enterprise-grade wifi uses certificates and public-key cryptography to check a user's identity before granting network access (see [WiFi Security](/cs/encryption/wifi.md))          | Enterprise wifi is far more secure than typical home wifi, forcing users to authenticate before use, preventing unauthorised use and securing data |

## Key Terms

<flashcards>

- # What is asymmetric cryptography used for?

    ---

    Public-key encryption, key exchange, and digital signatures.

- # How is asymmetric cryptography different from symmetric encryption?

    ---

    Symmetric encryption uses one shared secret key. Asymmetric cryptography uses public and private information.

- # Name one asymmetric algorithm.

    ---

    RSA (or Elliptic Curve Cryptography).

- # Why do most systems also use symmetric encryption?

    ---

    Symmetric encryption is much faster, so it handles the actual bulk data.

</flashcards>

## Further Reading

- [Cloudflare - What is Asymmetric Encryption?](https://www.cloudflare.com/learning/ssl/what-is-asymmetric-encryption/) - clear technical overview
