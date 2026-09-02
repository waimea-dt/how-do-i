# Diffie-Hellman Key Exchange

**Diffie-Hellman** was the first practical method (1976) for two people to agree on a shared secret key over a public, insecure channel - without ever transmitting the secret itself.


## How Diffie-Hellman Key Exchange Works

Diffie-Hellman uses [modulo arithmetic](/cs/encryption/modulo.md) - numbers 'wrapping around' like a clock - to make combining secrets easy, but reversing them practically impossible.


<diffie-hellman p="17" g="5"></diffie-hellman>

> [!IMPORTANT]
> In reality, small numbers like `p = 17` as used above, are far too small for real security. Instead:
> - The **Generator (g)** is usually set to **2 or 5**
> - The **Prime Modulus (p)** is a **huge prime number**, typically 2048 or 4096 bits long

## Eavesdropping is Not a Problem

If an eavesdropper, Eve, is monitoring the communications, she sees *everything* exchanged **publicly**, but still can't work out the shared secret without knowing Alice and Bob's private values...

<diffie-hellman intercept></diffie-hellman>

> [!NOTE]
> The problem Eve needs to solve to crack Alice and Bob's private keys is called the **Discrete Logarithm Problem** - given the public numbers, working backwards to find the private ones is computationally intractable (effectively impossible) for large enough numbers.

## Why Diffie-Hellman Matters

Before Diffie-Hellman Key Exchange, symmetric encryption suffered from the [key distribution problem](/cs/encryption/key-distribution.md) - there was no safe way to agree a key without meeting first. Diffie-Hellman made secure communication between strangers possible for the first time, laying the foundation for [HTTPS](/cs/encryption/https.md), [VPNs](/cs/encryption/vpn.md), and secure messaging apps.


## Test Your Knowledge: The Exchange Process

Drag these steps into the correct order:

<drag-drop>

1. Alice and Bob publicly agree on shared starting numbers

2. Alice picks a private secret number; Bob picks his own private secret number

3. Alice and Bob each combine their private number with the public numbers, and swap results

4. Alice combines Bob's result with her own private number; Bob combines Alice's result with his own private number

5. Both Alice and Bob arrive at the same shared secret, without ever sending it

</drag-drop>

## Key Terms

<flashcards>

- # Diffie-Hellman key exchange

    ---

    A method (**1976**) for two people to agree a **shared secret** over a public channel, without ever sending the secret itself.

- # Discrete logarithm problem

    ---

    Working backwards from the public numbers to find the private ones - **easy forwards, practically impossible to reverse**.

- # Generator (g) and Prime Modulus (p)

    ---

    Publicly shared numbers - the generator is usually **2 or 5**; the modulus is a **huge prime**, typically 2048 or 4096 bits.

- # Why Diffie-Hellman matters

    ---

    It solved the **key distribution problem**, making secure communication between strangers possible for the first time.

</flashcards>

## Further Reading

- [Khan Academy - Diffie-Hellman Key Exchange](https://www.khanacademy.org/computing/computer-science/cryptography/modern-crypt/v/diffie-hellman-key-exchange-part-1) - the full mathematical walkthrough
