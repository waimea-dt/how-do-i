# What is Public-Key Encryption?

**Public-key encryption** is a form of **asymmetric** cryptography. Bob shares a public key with everyone, but keeps its matching private key secret. Anyone can encrypt a message for Bob. Only Bob can decrypt it.

> [!TIP]
> - Common algorithm: **RSA**
> - Keys: **Key pair**, **different keys** encrypt and decrypt
> - Speed: ⚠️ **Slow** compared to symmetric encryption
> - Best for: Small secrets, not bulk data

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
    5. L   (i R : Decrypts CIPHERTEXT using the **PRIVATE KEY**

</requests>

## Try It Yourself

<sym-asym mode="asymmetric" message="Meet at midnight!"></sym-asym>

## Why Interception Doesn't Matter

Try it with Eve watching - notice she can see the public key and the encrypted message, but still can't read it:

<sym-asym mode="asymmetric" intercept intercept-key></sym-asym>

> [!IMPORTANT]
> This is the breakthrough: **the public key never needs to be secret.** Only the private key does, and that never has to travel anywhere.

## Compared With Symmetric Encryption

|                      | Symmetric                       | Public-key encryption              |
| -------------------- | ------------------------------- | ---------------------------------- |
| Keys                 | **One** shared secret           | **Key pair**: public + private           |
| Key Distribution                | ⚠️ Problem!                         | ✅ No problem                          |
| Speed                | ✅ Fast                         | ⚠️ Much slower                     |
| Main use             | **Bulk** data - files, WiFi     | Encrypting small secrets           |

## Trusting Public Keys

Public key does not need to be secret, but it must be genuine. If Eve replaces Bob's public key with her own, Alice could encrypt her message for Eve instead.

Digital certificates link a public key to an identity. They are used by HTTPS websites, enterprise WiFi, and SSH.

## Related Topics

- [RSA Algorithm](/cs/encryption/rsa.md) - public-key encryption using prime numbers
- [Key Exchange](/cs/encryption/key-exchange.md) - agreeing a shared secret without sending it
- [Digital Signatures](/cs/encryption/signatures.md) - proving who created a message

## Video Overviews

<videoembed id="AQDCe585Lnc"></videoembed>

<videoembed id="6-JjHa-qLPk"></videoembed>

## Key Terms

<flashcards>

- # What is public-key encryption?

    ---

    Encryption using a public key and its matching private key.

- # Why doesn't the public key need to be secret?

    ---

    Because only the matching private key can decrypt data encrypted with it - anyone can see the public key safely.

- # Why must a public key be genuine?

    ---

    An attacker could replace it with their own key and read messages sent to them.

- # Why is public-key encryption not used for bulk data?

    ---

    It is much slower than symmetric encryption.

</flashcards>

## Further Reading

- [Cloudflare - What is Public Key Encryption?](https://www.cloudflare.com/learning/ssl/how-does-public-key-encryption-work/) - clear technical overview
