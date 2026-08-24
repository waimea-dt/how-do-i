# Public Key Cryptography

Public key cryptography lets two people who have **never met** agree on a shared secret, over a network that's being watched. It sounds impossible - but a simple colour-mixing analogy makes it click.

## The Colour Mixing Analogy

Imagine mixing paint instead of numbers:

1. Alice and Bob publicly agree on a common paint colour (say, yellow) - Eve sees this too
2. Alice privately mixes yellow with her own secret colour; Bob does the same with his own secret colour
3. They swap their mixed colours in public - Eve sees these too
4. Each adds their *own* secret colour to the mixture they received
5. Both arrive at the **same final colour** - but Eve can't reverse-mix paint to find the secret colours!

<diffie-hellman colour intercept></diffie-hellman>

> [!NOTE]
> Mixing paint is easy, but *un-mixing* it is practically impossible. Public key cryptography uses the same idea with maths problems that are easy to do one way, but incredibly hard to reverse - like factoring huge numbers.

## The Real Version

The actual maths swaps paint colours for numbers and modular arithmetic - see [Diffie-Hellman Key Exchange](/cs/encryption/diffie-hellman.md) for the numeric version.

## Key Terms

<flashcards>

- # What is a public key?

    ---

    A key that can be shared with anyone and used to encrypt data - only the matching private key can decrypt it.

- # What is a private key?

    ---

    A secret key kept only by its owner, used to decrypt data encrypted with the matching public key.

- # Why is the colour-mixing analogy useful?

    ---

    It shows how two people can combine public and private information to reach the same shared secret, without ever sending the secret itself - even if someone is watching every exchange.

</flashcards>

## Further Reading

- [Cloudflare - How Does Public Key Encryption Work?](https://www.cloudflare.com/learning/ssl/how-does-public-key-encryption-work/) - technical explanation
