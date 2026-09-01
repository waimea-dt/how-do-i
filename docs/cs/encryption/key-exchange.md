# Key Exchange

**Key exchange** lets two people who have never met agree on a shared secret over a public, insecure network - without ever sending that secret.

This solves [the key distribution problem](/cs/encryption/key-distribution.md). The shared secret becomes a key for fast symmetric encryption.

## The Colour Mixing Analogy

Imagine mixing paint instead of numbers:

1. Alice and Bob publicly agree on a common paint colour (say, yellow) - Eve sees this too
2. Alice privately mixes yellow with her own secret colour; Bob does the same with his own secret colour
3. They swap their mixed colours in public - Eve sees these too
4. Each adds their *own* secret colour to the mixture they received
5. Both arrive at the **same final colour** - but Eve can't reverse-mix paint to find the secret colours!

<diffie-hellman colour intercept></diffie-hellman>

> [!NOTE]
> Mixing paint is easy, but *un-mixing* it is practically impossible. Diffie-Hellman uses maths that is easy to do one way, but incredibly hard to reverse.

## The Real Version

The colour analogy represents **Diffie-Hellman key exchange**. It uses numbers and modular arithmetic instead of paint - see [Diffie-Hellman Key Exchange](/cs/encryption/diffie-hellman.md) for the numeric version.

> [!NOTE]
> Key exchange is different from public-key encryption. With RSA, Alice encrypts a message using Bob's public key. With Diffie-Hellman, Alice and Bob both calculate the same shared secret.

## Important Limitation

Diffie-Hellman alone does not prove who Alice and Bob are. An attacker could pretend to be each person and create two separate shared secrets.

HTTPS prevents this using digital certificates and signatures - see [Digital Signatures](/cs/encryption/signatures.md).

## Key Terms

<flashcards>

- # What is key exchange?

    ---

    A way for two people to agree on a shared secret without sending that secret.

- # What problem does key exchange solve?

    ---

    The key distribution problem - how to safely agree a symmetric key over an insecure network.

- # Why is the colour-mixing analogy useful?

    ---

    It shows how two people can reach the same shared secret without ever sending it, even if someone watches every exchange.

</flashcards>

## Further Reading

- [Khan Academy - Diffie-Hellman Key Exchange](https://www.khanacademy.org/computing/computer-science/cryptography/modern-crypt/v/diffie-hellman-key-exchange-part-1) - technical explanation
