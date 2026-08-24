# What is a Substitution Cipher?

A **substitution cipher** replaces each letter (or symbol) in a message with a different one, according to a fixed rule. The rule is the **key** - if you know it, you can decrypt the message instantly.

## The Basic Idea

- **Plaintext**: the original, readable message
- **Ciphertext**: the scrambled result
- **Key**: the rule used to substitute letters

For example, replacing every `A` with `D`, every `B` with `E`, and so on, is a substitution cipher.

## Simple vs Complex Substitution

| Type | How It Works | Strength |
|---|---|---|
| **Monoalphabetic** | One letter always maps to the same letter | Weak - vulnerable to frequency analysis |
| **Polyalphabetic** | The mapping changes as you go through the message | Much stronger |

Try it yourself below - edit the text and watch the ciphertext update in real time:

<sub-cypher>
HELLO WORLD
</sub-cypher>

> [!TIP]
> Substitution ciphers were used for thousands of years before computers existed, but every one can eventually be broken. See [Breaking the Caesar Cipher](/cs/encryption/breaking-caesar.md) to find out how.

## Key Terms

<flashcards>

- # What is plaintext?

    ---

    The original, readable message before encryption.

- # What is ciphertext?

    ---

    The scrambled result after encryption is applied.

- # What is a monoalphabetic cipher?

    ---

    A substitution cipher where each letter always maps to the same replacement letter - weak against frequency analysis.

- # What is a polyalphabetic cipher?

    ---

    A substitution cipher where the mapping changes as you move through the message, making frequency analysis much harder.

</flashcards>

## Further Reading

- [GeeksforGeeks - Substitution Cipher](https://www.geeksforgeeks.org/ethical-hacking/caesar-cipher-in-cryptography/) - technical breakdown with worked examples
