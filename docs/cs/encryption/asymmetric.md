# What is Asymmetric Encryption?

**Asymmetric cryptography** uses mathematically linked public and private information. Unlike symmetric encryption, it does not begin with both people holding the same secret key.

## Three Different Jobs

- **Public-key encryption** - Alice encrypts a message with Bob's public key. Only Bob's private key can decrypt it. RSA can do this.
- **Key exchange** - Alice and Bob create the same shared secret without sending it. Diffie-Hellman does this.
- **Digital signatures** - Bob uses his private key to prove that a message came from him.

Key exchange usually creates a symmetric key. Symmetric encryption then protects the actual data.

See [Public-Key Encryption](/cs/encryption/public-key.md), [Key Exchange](/cs/encryption/key-exchange.md), and [Digital Signatures](/cs/encryption/signatures.md) for each job.

## Trade-Off Between Asymmetric and Symmetric

|                  | Symmetric                   | Asymmetric                              |
| ---------------- | --------------------------- | --------------------------------------- |
| Keys             | **One** shared secret       | **Both** public and private information |
| Key Distribution | ⚠️ Problem!               | ✅ No problem                           |
| Speed            | ✅ Fast                     | ⚠️ Much slower                        |
| Main use         | **Bulk** data - files, WiFi | Key exchange, encryption, signatures    |

> [!TIP]
> In practice, most secure systems (like HTTPS) use **key exchange** to safely agree a key, then symmetric encryption for the actual data. See [HTTPS & TLS](/cs/encryption/https.md).


## Where It's Used Today

| Technology                                       | How it is Used                                                                                                                                                                       | Why it is Used                                                                                                                                  |
| ------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| **HTTPS Handshake** (start of HTTPS session) | When you browse to an HTTPS website, your browser uses asymmetric encryption to safely agree a symmetric key with the website (see [HTTPS & TLS](/cs/encryption/https.md))           | Allows your browser and the website server to safely exchange a symmetric key so they can then continue with faster symmetric encryption        |
| **Digital Signatures** (to authenticate data)    | Digital signatures are used to 'sign' software updates, emails, and documents (see [Digital Signatures](/cs/encryption/signatures.md))                                               | Signed documents are guaranteed to be authentic: they come from a known source and have not been altered.                                       |
| **SSH** (Secure Shell)                           | SSH is used to securely log into remote servers. It is common for servers not to have a physical screen / keyboard - instead an operator used SSH to login via a network connection. | SSH allows server operators to run commands and monitor services on a server without revealing any sensitive information to other network users |
| **Enterprise WiFi** (e.g. WPA3)                  | Symmetric encryption is used to verify a user's identity before granting network access (see [WiFi Security](/cs/encryption/wifi.md))                                                | Enterprice wifi is far more secure than typical home wifi, forcing users to authenticate before use. The login process is secured via encryption. |


- **HTTPS** uses key exchange to create a session key, then symmetric encryption for web traffic.
- **Digital signatures** check that software updates, emails, and documents are genuine.
- **SSH** and **enterprise WiFi** use public-key cryptography to authenticate users and devices.


## In Your School

- The school's website/portal (**HTTPS**) uses key exchange to set up a secure connection before you log in
- **WPA2/WPA3-Enterprise** WiFi uses certificates and public-key cryptography to check your identity before letting your device online
- Software updates pushed to school devices are **digitally signed**, so the school's IT system can verify they haven't been tampered with

## Video Overviews

<videoembed id="AQDCe585Lnc"></videoembed>

<videoembed id="6-JjHa-qLPk"></videoembed>

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
