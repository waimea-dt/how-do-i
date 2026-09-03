# RSA Algorithm

**RSA** (Rivest-Shamir-Adleman) was the first practical public-key algorithm, published in 1977. It still secures much of the modern internet.

## The Core Idea: Easy One Way, Hard the Other

RSA relies on a simple fact: **multiplying two large prime numbers is easy, but factoring the result back into those two primes is incredibly hard.**

<modulus value="17" mod="5" title="Modular Arithmetic" sub-title="The building block behind RSA"></modulus>

## Why It's Secure

| Key Size | Time to Brute-Force Factor (approx.) |
|---|---|
| 512-bit | Days, with modern computers |
| 2048-bit | Longer than the age of the universe |
| 4096-bit | Effectively impossible with today's technology |

<big-o algos="rsa-brute rsa-gnfs aes-brute" max="2048" step="x2"></big-o>

> [!IMPORTANT]
> RSA's security depends entirely on factoring being **intractable**. If a fast factoring method were ever found (quantum computers are a growing concern here), RSA would become insecure overnight.

## Where RSA is Used

- Securing HTTPS connections (see [HTTPS & TLS](/cs/encryption/https.md))
- Digital signatures (see [Digital Signatures](/cs/encryption/signatures.md))
- SSH and secure remote access

## In Your School

- When your device first connects to the school's HTTPS portal, RSA (or similar) can help set up the secure connection before switching to fast AES encryption
- Digitally signed software updates pushed to school-managed devices often rely on RSA-based signatures
- IT staff connecting remotely to school servers over SSH rely on RSA key pairs to prove their identity

## Test Your Knowledge: Using RSA

Drag these steps into the correct order:

<drag-drop>

1. Bob generates a public/private RSA key pair

2. Bob shares his public key with Alice (and anyone else)

3. Alice encrypts her message using Bob's public key

4. Alice sends the encrypted message to Bob

5. Bob decrypts the message using his private key

</drag-drop>

## Key Terms

<flashcards>

- # RSA

    ---

    **Rivest, Shamir, Adleman** - the first practical public-key algorithm, published in **1977**.

- # RSA's core maths

    ---

    Multiplying two large primes is **easy**; factoring the result back into those primes is **extremely hard**.

- # Type of cipher RSA is

    ---

    **Asymmetric** - it uses a public/private key pair.

- # RSA and quantum computers

    ---

    Quantum computers could **factor large numbers far faster**, potentially breaking RSA's core assumption.

</flashcards>

## Video Overviews

<videoembed id="wXB-V_Keiu8"></videoembed>


## Further Reading

- [Khan Academy - The RSA Algorithm](https://www.khanacademy.org/computing/computer-science/cryptography/modern-crypt/v/intro-to-rsa-encryption) - a full walkthrough of the maths
