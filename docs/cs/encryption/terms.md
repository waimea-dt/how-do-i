# Cryptography Terminology

## Alice, Bob and Eve

Cryptographers usually imagine three characters: **Alice** (sender), **Bob** (receiver), and **Eve** (eavesdropper). Every diagram in this section uses these names!

<requests>

- Left: **Alice**

    <i data-lucide="user"></i>

- Right: **Bob**

    <i data-lucide="user"></i>

- Requests:

    1. L ---> R : Hello! Here is a secret!
    2. L <--- R : Thanks. I hope Eve doesn't find out!

</requests>


## Key Terms

| Term                    | Meaning                                                       |
| ----------------------- | ------------------------------------------------------------- |
| **Cryptography**        | The science of keeping data secure via encryption algorithms  |
| **Encryption**          | Scrambling data so only authorized people can read it         |
| **Decryption**          | Unscrambling encrypted data back to readable form             |
| **Plaintext**           | The unencrypted information                                   |
| **Ciphertext**          | The scrambled, encrypted version of the plaintext             |
| **Cipher**              | An encryption algorithm                                       |
| **Key**                 | A secret used during encryption / decryption in a cipher      |
| **Keystream**          | A long sequence of characters created from a key              |
| **Key Space**           | Every possible key a cipher could use                         |
| **Substitution Cipher** | A cipher where each character is switched for another         |
| **Symmetric Cipher**    | Encryption where the same key encrypts and decrypts data      |
| **Asymmetric Cipher**   | Encryption using key-pairs: one to encrypt, one to decrypt    |
| **Public Key**          | A key anyone can use to encrypt data (not to decrypt)         |
| **Private Key**         | A secret key, linked to a public key, used to decrypt data    |
| **Certificate**         | A digital document that proves a website or person's identity |
| **Digital Signature**   | A way to verify the authenticity of a message                 |
| **Code Cracking**       | Attempting to break a cipher / read an encrypted message      |
| **Hashing**             | A one-way process, used to uniquely 'fingerprint' some data   |


## Quick Reference: Symmetric vs Asymmetric vs Hashing

|                 | Symmetric                              | Asymmetric                                         | Hashing                                      |
| --------------- | -------------------------------------- | -------------------------------------------------- | -------------------------------------------- |
| **Keys**        | One shared key                         | Two: public & private key-pair                     | No key                                       |
| **Reversible?** | Yes (with the key)                     | Yes (with the private key)                         | No - one-way                                 |
| **Examples**    | AES, DES                               | RSA, Diffie-Hellman                                | SHA-256                                      |
| **Modern use**  | WiFi, VPNs, disk encryption, bulk data | HTTPS handshakes, digital signatures, key exchange | Password storage, file integrity, signatures |
| **Speed**       | Fast                                   | Slow                                               | Very fast                                    |


## Test Yourself

Use these flashcards to test if you know the meaning of the terms above...

<flashcards shuffle>

- # Alice, Bob and Eve

    ---

    In example cryptography scenarios, Alice sends data to Bob, and Eve listens in (eavesdropper)

- # Cryptography

    ---

    The science of keeping data secure via encryption algorithms

- # Encryption

    ---

    **Scrambling** plaintext data into ciphertext, so only authorized people can read it

- # Decryption

    ---

    **Unscrambling** encrypted ciphertext back to readable plaintext data

- # Plaintext

    ---

    The **unencrypted** information

- # Ciphertext

    ---

    The scrambled, **encrypted** version of the plaintext

- # Cipher

    ---

    An encryption algorithm

- # Key

    ---

    A **secret** used during encryption / decryption in a cipher

- # Keystream

    ---

    A long sequence of characters created from a key

- # Key Space

    ---

    **Every possible key** a cipher could use

- # Substitution Cipher

    ---

    A cipher where each character is **switched for another**

- # Symmetric Cipher

    ---

    Encryption where the **same key encrypts and decrypts** data

- # Asymmetric Cipher

    ---

    Encryption using **key-pairs: one key to encrypt, one key to decrypt**

- # Public Key

    ---

    A key, publicly available, that **anyone** can use to **encrypt** data (not to decrypt)

- # Private Key

    ---

    A **secret key**, linked to a public key, used to **decrypt** data

- # Certificate

    ---

    A digital document that **proves a website or person's identity**

- # Digital Signature

    ---

    A way to verify the **authenticity** of a message

- # Code Cracking

    ---

    Attempting to **break a cipher** / read an encrypted message

- # Hashing

    ---

    A **one-way** process, used to uniquely '**fingerprint**' some data

</flashcards>

