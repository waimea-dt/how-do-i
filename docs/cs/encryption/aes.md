# The AES Algorithm

**AES** (Advanced Encryption Standard) is the symmetric encryption algorithm used almost everywhere today - from WiFi security to BitLocker to messaging apps.

<videoembed id="XMNLDdv9ApE"></videoembed>

<videoembed id="C4ATDMIz5wc"></videoembed>


## Key Facts

| Property | Detail |
|---|---|
| Type | Symmetric (same key encrypts and decrypts) |
| Key sizes | 128, 192, or 256 bits |
| Adopted | 2001, by the US National Institute of Standards and Technology (NIST) |
| Used in | WiFi (WPA2/WPA3), BitLocker, HTTPS, messaging apps |

## Why AES Replaced Older Ciphers

Older ciphers like DES used short 56-bit keys that became crackable by brute force as computers got faster. AES's larger keys make brute-forcing practically impossible.

<big-o algos="rsa-brute rsa-gnfs aes-brute" max="256" step="x2"></big-o>

> [!NOTE]
> A 128-bit AES key has **340 undecillion** possible values (that's 340 followed by 36 zeros). Even with every computer on Earth working together, brute-forcing it would take far longer than the universe has existed.

## How AES Works (Simplified)

AES doesn't encrypt letter-by-letter like the historical ciphers - it works on 128-bit **blocks** of data at once, scrambling them through several rounds of substitution, shuffling, and mixing with the key. Each round makes the output more unpredictable.

> [!TIP]
> You don't need to memorise every round of AES for the assessment - focus on **why** larger keys make brute force attacks impractical, not the internal maths.

## In Your School

- School laptops and Chromebooks use **AES** via BitLocker/FileVault to encrypt the whole disk (see [Device Encryption](/cs/encryption/bitlocker.md))
- The school WiFi network encrypts traffic with **AES** under WPA2/WPA3 (see [WiFi Security](/cs/encryption/wifi.md))
- Google Classroom, school portals, and other HTTPS sites switch to AES for the bulk of a session after the initial handshake

## Key Terms

<flashcards>

- # What does AES stand for?

    ---

    Advanced Encryption Standard.

- # Is AES symmetric or asymmetric?

    ---

    Symmetric - the same key encrypts and decrypts.

- # What key sizes does AES support?

    ---

    128, 192, or 256 bits.

- # Name two modern uses of AES.

    ---

    WiFi security (WPA2/WPA3) and device encryption (BitLocker/FileVault) - also HTTPS and messaging apps.

</flashcards>

## Further Reading

- [GeeksforGeeks - Advanced Encryption Standard (AES)](https://www.geeksforgeeks.org/computer-networks/advanced-encryption-standard-aes/) - technical breakdown of how AES works
