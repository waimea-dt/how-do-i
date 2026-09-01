# The Key Distribution Problem

Symmetric encryption is fast and simple - but it has one massive weakness: **both parties need the same secret key**. How do you share that key securely, if the only channel you have is the same insecure network an eavesdropper might be watching?

> [!NOTE]
> We talk of people, Alice and Bob, but in reality it it **computers** and **software applications** that are attempting to communicate securely - Unlike people, they can't just hop up and meet in-person to exchange encryption keys!

## Eavesdropping

If Eve is monitoring Alice and Bob's communications and **intercepts** the key and encrypted message, she is able to read it:

<sym-asym mode="symmetric" intercept intercept-key></sym-asym>

> [!IMPORTANT]
> Notice that once Eve has the key, encryption is completely broken - she can decrypt everything. This is the **key distribution problem**, and it affected every symmetric cipher throughout history, including the [Enigma machine](/cs/encryption/enigma.md).

## Historical Solutions (and Their Limits)

- **Physically meeting up** to agree a key - secure, but doesn't scale to the internet
- **Codebooks** delivered by trusted couriers - still used by militaries, but slow and risky if intercepted
- **Pre-shared keys** - works for small, fixed groups, but not for talking to a stranger's website for the first time

## The Modern Solution

In 1976, **Diffie-Hellman key exchange** solved this problem mathematically, letting two strangers agree on a shared secret over a public channel - without ever sending the secret itself. See [Diffie-Hellman Key Exchange](/cs/encryption/diffie-hellman.md).


## Key Terms

<flashcards>

- # The Key Distribution Problem

    ---

    How can two parties securely share a symmetric key over a channel that is public, and the key could be intercepted?

- # Diffie-Hellman key exchange

    ---

    A mathematical solution, originally created in 1976, that lets two strangers agree a shared secret over a public channel. The solution to the Key Distribution Problem

</flashcards>

## Further Reading

- [Cloudflare - What is a Cryptographic Key?](https://www.cloudflare.com/learning/ssl/what-is-a-cryptographic-key/) - background on how keys work
