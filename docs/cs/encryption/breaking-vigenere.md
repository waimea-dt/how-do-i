# Breaking the Vigenère Cipher

For 300 years nobody could reliably break the Vigenère cipher - until Charles Babbage and later Friedrich Kasiski found its weakness: **the keyword repeats**.

## The Kasiski Method

1. Look for repeated sequences of letters in the ciphertext
2. Measure the distance between repeats - this distance is likely a multiple of the keyword length
3. Once you know the keyword length, split the ciphertext into groups (one per keyword letter)
4. Run **frequency analysis** on each group separately - each group was encrypted with a single, fixed shift, just like a Caesar cipher!

<sub-cipher scheme="vigenere" key="KEYWORD" frequency>
IN CRYPTOGRAPHY A SUBSTITUTION CIPHER IS A METHOD OF ENCRYPTING IN WHICH UNITS OF PLAINTEXT ARE REPLACED WITH CIPHERTEXT ACCORDING TO A FIXED SYSTEM
</sub-cipher>

> [!NOTE]
> This is why Vigenère's strength depends entirely on **keyword length**. A one-letter keyword is just a Caesar cipher. A keyword as long as the message itself (with no repetition) becomes a **one-time pad** - which is mathematically unbreakable!

## The Lesson

Every cipher based on a repeating pattern can eventually be broken once that pattern is discovered. This is why modern encryption (like AES) doesn't rely on repeating a short human-chosen keyword - it uses far more complex, mathematically random keys. See [The AES Algorithm](/cs/encryption/aes.md).

## Key Terms

<flashcards>

- # What is the Kasiski method used for?

    ---

    Finding the length of the repeating keyword in a Vigenère cipher, by measuring distances between repeated sequences in the ciphertext.

- # Once the keyword length is known, how is the cipher broken?

    ---

    The ciphertext is split into groups (one per keyword letter), and each group is attacked separately using frequency analysis, since each behaves like a simple Caesar cipher.

- # What is a one-time pad?

    ---

    A Vigenère cipher where the keyword is truly random, used only once, and as long as the message itself - the only mathematically unbreakable cipher.

</flashcards>

## Further Reading

- [Wikipedia - Kasiski Examination](https://en.wikipedia.org/wiki/Kasiski_examination) - the original method for cracking Vigenère
