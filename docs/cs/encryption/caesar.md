# The Caesar Cipher

The **Caesar cipher** is one of the oldest known encryption methods, named after Julius Caesar who reportedly used it to protect military messages.

The Caesar Cipher is an example of a simple **monoalphabetic substitution cipher**...

## What is a Substitution Cipher?

A **substitution cipher** replaces each letter (or symbol) in a message with a different one, according to a fixed rule. The rule is the **key** - if you know it, you can decrypt the message by reversing the substitution process.

For example, replacing every `A` with `D`, every `B` with `E`, and so on, is a substitution cipher.

## What is Monoalphabetic Substitution?

If one letter always maps to the same letter in a cipher, we say that it always uses the same 'alphabet', and so is a **monoalphabetic cipher** ('mono' means 'one').


## How The Caesar Cipher Works

Every letter in the plaintext is **shifted a fixed number of places** along the alphabet. This shift amount is the **key**.

For a shift of 3: `A` becomes `D`, `B` becomes `E`, and so on. To decrypt, just shift back the other way.

Try changing the shift value below and watch both directions update:

<sub-cipher scheme="caesar" key="3">
HELLO WORLD
</sub-cipher>

> [!NOTE]
> Each of the letters `L` in `Hello` and `World` are always substituted with the **same letter** every time

### Encrypting and Decrypting

To decrypt the ciphertext, we simply reverse the shift, so an encryption of **+3**, means a decryption of **-3**

| Step    | Plaintext        | Shift | Ciphertext       |
| ------- | ---------------- | ----- | ---------------- |
| Encrypt | `ATTACK AT DAWN` | +3    | `DWWDFN DW GDZQ` |
| Decrypt | `DWWDFN DW GDZQ` | -3    | `ATTACK AT DAWN` |

> [!TIP]
> A shift of 13 is called **ROT13** - it's its own reverse, since shifting by 13 twice gets you back to 26 (a full loop of the alphabet)!


## Why the Caesar Cipher is Weak

In the Caesar Cipher, there are only **25 possible shifts** (26 letters, minus the "no shift" option). We say that the size of the **keyspace** of the Caesar Cipher is **25** - this is **very small**! A computer - or even a patient human - can try every single one in seconds.

The Caesar Cipher is also very suseptible to **frequency analysis** attacks.

See [Breaking the Caesar Cipher](/cs/encryption/breaking-caesar.md).

## Key Terms

<flashcards>

- # The "**key**" in a Caesar Cipher

    ---

    The **shift** amount - how many places each letter moves along the alphabet.

- # Substitution cipher

    ---

    A cipher that **replaces each letter** (or symbol) in a message with a different one, according to a fixed rule

- # Monoalphabetic cipher

    ---

    A substitution cipher where each letter **always maps to the same replacement** letter

- # Size of the **keyspace** in the Caesar Cipher

    ---

    **25** (26 letters, minus the "no shift" option)

    Few enough to easily brute-force

</flashcards>

## Further Reading

- [Khan Academy - The Caesar Cipher](https://www.khanacademy.org/computing/computer-science/cryptography/crypt/v/caesar-cipher) - short video walkthrough
- [GeeksforGeeks - Substitution Cipher](https://www.geeksforgeeks.org/ethical-hacking/caesar-cipher-in-cryptography/) - technical breakdown with worked examples


