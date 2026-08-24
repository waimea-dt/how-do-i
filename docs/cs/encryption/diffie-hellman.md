# Diffie-Hellman Key Exchange

**Diffie-Hellman** was the first practical method (1976) for two people to agree on a shared secret key over a public, insecure channel - without ever transmitting the secret itself.

## The Numeric Version

Diffie-Hellman uses modular arithmetic - numbers "wrapping around" like a clock - to make combining secrets easy, but reversing them practically impossible.

<diffie-hellman p="17" g="5"></diffie-hellman>

## With Eve Watching

Try it with interception enabled - Eve sees *everything* exchanged publicly, but still can't work out the shared secret:

<diffie-hellman intercept></diffie-hellman>

> [!NOTE]
> Eve's problem is called the **discrete logarithm problem** - given the public numbers, working backwards to find the private ones is computationally intractable for large enough numbers.

## Why This Matters

Before Diffie-Hellman, symmetric encryption suffered from the [key distribution problem](/cs/encryption/key-distribution.md) - there was no safe way to agree a key without meeting first. Diffie-Hellman made secure communication between strangers possible for the first time, laying the foundation for HTTPS, VPNs, and messaging apps.

## In Your School

- Every time your device connects to a school HTTPS site for the first time, a Diffie-Hellman-style exchange (or similar) can help agree a session key
- VPN software used by staff working remotely uses key exchange methods based on this same idea (see [VPNs](/cs/encryption/vpn.md))

## Test Your Knowledge: The Exchange Process

Drag these steps into the correct order:

<drag-drop>

1. Alice and Bob publicly agree on shared starting numbers

2. Alice picks a private secret number; Bob picks his own private secret number

3. Alice and Bob each combine their private number with the public numbers, and swap results

4. Alice combines Bob's result with her own private number

5. Bob combines Alice's result with his own private number

6. Both arrive at the same shared secret, without ever sending it

</drag-drop>

## Key Terms

<flashcards>

- # What problem does Diffie-Hellman solve?

    ---

    How two people can agree on a shared secret key over a public, insecure channel.

- # What is the discrete logarithm problem?

    ---

    The mathematical problem of reversing modular exponentiation - easy to compute forwards, but extremely hard to reverse for large numbers.

- # In what year was Diffie-Hellman published?

    ---

    1976.

</flashcards>

## Further Reading

- [Khan Academy - Diffie-Hellman Key Exchange](https://www.khanacademy.org/computing/computer-science/cryptography/modern-crypt/v/diffie-hellman-key-exchange-part-1) - the full mathematical walkthrough
