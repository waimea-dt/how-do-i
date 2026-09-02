# Key Exchange

Key exchange lets two people who have never met **agree on a shared secret** over a public, insecure network, **without ever sending that secret**.

This solves [the key distribution problem](/cs/encryption/key-distribution.md). The shared secret then becomes a key for fast symmetric encryption.

## Colour Mixing Analogy

Instead of thinking about the maths, let's instead consider mixing paint...

1. Alice and Bob publicly agree on a common paint colour (say, yellow) - Eve sees this too
2. Alice privately mixes yellow with her own secret colour; Bob does the same with his own secret colour
3. They swap their mixed colours in public - Eve sees these too
4. Each adds their *own* secret colour to the mixture they received
5. Both arrive at the **same final colour** - but Eve can't reverse-mix paint to find the secret colours!

<diffie-hellman colour intercept></diffie-hellman>

> [!NOTE]
> Mixing paint is easy, but *un-mixing* it is practically impossible. Diffie-Hellman uses maths that is easy to do one way, but incredibly hard to reverse.

## The Real Version

This colour analogy represents **Diffie-Hellman key exchange**. It uses numbers and modulo arithmetic instead of paint - see [Diffie-Hellman Key Exchange](/cs/encryption/diffie-hellman.md) for the numeric version.

> [!NOTE]
> Key exchange is **different from public-key encryption**. With RSA, Alice encrypts a message using Bob's public key. With Diffie-Hellman, Alice and Bob both **calculate the same shared secret**.

## Key Terms

<flashcards>

- # Key exchange

    ---

    Lets two people **agree on a shared secret**, without ever sending that secret itself.

- # Colour-mixing analogy

    ---

    Mixing paint is easy, but **un-mixing** it is practically impossible - just like the maths behind Diffie-Hellman.

- # Key exchange vs public-key encryption

    ---

    With RSA, Alice **encrypts using Bob's public key**. With Diffie-Hellman, Alice and Bob both **calculate the same shared secret**.

</flashcards>

## Further Reading

- [Khan Academy - Diffie-Hellman Key Exchange](https://www.khanacademy.org/computing/computer-science/cryptography/modern-crypt/v/diffie-hellman-key-exchange-part-1) - technical explanation
