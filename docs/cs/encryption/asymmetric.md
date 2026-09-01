# What is Asymmetric Encryption?

**Asymmetric encryption** uses **two different but mathematically linked keys**: a **public key** to encrypt, and a **private key** to decrypt. This solves the key distribution problem that plagues symmetric encryption.

> [!TIP]
> - Common algorithms: **RSA**, **ECC**
> - Keys: **Key pair**, **different keys** encrypt and decrypt
> - Speed: ⚠️ **Slow** - 100-1000x slower than symmetric
> - Ciphertext: ⚠️ **Large** compared to symmetric
> - Benefits: ✅ **No pre-shared secrets** - public keys can be shared openly
> - Best for: Key exchange, digital signatures

## How It Works

1. Bob generates a **key pair**: a public key and a private key
2. Bob **shares his public key** with *anyone*, including Alice
3. Alice **encrypts** her message using Bob's **public key**
4. Alice **sends** the ciphertext to Bob
5. Bob **decrypts** the ciphertext using his **private key**

<requests>

- Left: **Alice**

- Right: **Bob**

- Requests:

    1. L   (i R : Creates a **PUBLIC KEY** and **PRIVATE KEY** pair
    2. L <--- R : Shares **PUBLIC KEY**
    3. L i)   R : Encrypts PLAINTEXT message using Bob's **PUBLIC KEY**
    4. L ---> R : Sends **CIPHERTEXT**
    6. L   (i R : Decrypts CIPHERTEXT using the **PRIVATE KEY**

</requests>

## Try It Yourself

<sym-asym mode="asymmetric" message="Meet at midnight!"></sym-asym>

## Why Interception Doesn't Matter

Try it with Eve watching - notice she can see the public key and the encrypted message, but still can't read it:

<sym-asym mode="asymmetric" intercept intercept-key></sym-asym>

> [!IMPORTANT]
> This is the breakthrough: **the public key never needs to be secret.** Only the private key does, and that never has to travel anywhere.

## Trade-Off Between Asymmetric and Symmetric

|                      | Symmetric               | Asymmetric                |
| -------------------- | ----------------------- | ------------------------- |
| Keys                 | **One** shared key          | **Key pair**: public + private |
| Speed                | ✅ Fast                    | ⚠️ Much slower               |
| Key sharing problem? | ⚠️ Yes                     | ✅ No                        |
| Common use           | **Bulk** data (files, WiFi) | Key exchange, signatures  |

> [!TIP]
> In practice, most secure systems (like HTTPS) use **both**: asymmetric encryption to safely share a key, then symmetric encryption for the actual data. See [HTTPS & TLS](/cs/encryption/https.md).


## Where It's Used Today

| Technology                                       | How it is Used                                                                                                                                                                       | Why it is Used                                                                                                                                  |
| ------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| **HTTPS Handshake** (start of HTTPS session) | When you browse to an HTTPS website, your browser uses asymmetric encryption to safely agree a symmetric key with the website (see [HTTPS & TLS](/cs/encryption/https.md))           | Allows your browser and the website server to safely exchange a symmetric key so they can then continue with faster symmetric encryption        |
| **Digital Signatures** (to authenticate data)    | Digital signatures are used to 'sign' software updates, emails, and documents (see [Digital Signatures](/cs/encryption/signatures.md))                                               | Signed documents are guaranteed to be authentic: they come from a known source and have not been altered.                                       |
| **SSH** (Secure Shell)                           | SSH is used to securely log into remote servers. It is common for servers not to have a physical screen / keyboard - instead an operator used SSH to login via a network connection. | SSH allows server operators to run commands and monitor services on a server without revealing any sensitive information to other network users |
| **Enterprise WiFi** (e.g. WPA3)                  | Symmetric encryption is used to verify a user's identity before granting network access (see [WiFi Security](/cs/encryption/wifi.md))                                                | Enterprice wifi is far more secure than typical home wifi, forcing users to authenticate before use. The login process is secured via encryption. |

## In Your School

- The school's website/portal (**HTTPS**) uses asymmetric encryption to safely set up a secure connection before you log in
- **WPA2/WPA3-Enterprise** WiFi uses certificates and public-key cryptography to check your identity before letting your device online
- Software updates pushed to school devices are **digitally signed**, so the school's IT system can verify they haven't been tampered with

## Video Overviews

<videoembed id="AQDCe585Lnc"></videoembed>

<videoembed id="6-JjHa-qLPk"></videoembed>

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
