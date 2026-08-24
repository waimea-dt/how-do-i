# Polyalphabetic Ciphers

A **polyalphabetic cipher** uses more than one substitution alphabet across a single message, so the same plaintext letter can map to different ciphertext letters depending on its position.

## Why This Defeats Frequency Analysis

In the Caesar cipher, `E` always becomes the same letter - so counting letter frequencies reveals the key. In a polyalphabetic cipher, `E` might become `X` in one place and `M` in another, flattening out the frequency pattern.

| Cipher Type | Same Letter Always Encrypts the Same Way? | Frequency Analysis Works? |
|---|---|---|
| Monoalphabetic (Caesar) | Yes | Yes - easily broken |
| Polyalphabetic (Vigenere) | No | Much harder |

## How It Works

Instead of one shift value, a polyalphabetic cipher uses a **repeating keyword**. Each letter of the keyword tells you the shift to use for that position in the message.

<sub-cypher scheme="vigenere" key="KEY">
HELLO WORLD
</sub-cypher>

> [!NOTE]
> Notice how the two `L`s in "HELLO" and "WORLD" can encrypt to *different* ciphertext letters, because they line up with different letters of the keyword.

The most famous polyalphabetic cipher is the **Vigenere cipher** - see [The Vigenere Cipher](/cs/encryption/vigenere.md) for a full walkthrough.

## Key Terms

<flashcards>

- # What makes a cipher "polyalphabetic"?

    ---

    It uses more than one substitution alphabet across a single message, so the same letter can encrypt differently depending on its position.

- # Why does this defeat basic frequency analysis?

    ---

    Because a letter like E no longer always maps to the same ciphertext letter, flattening out the frequency pattern an attacker would look for.

- # What repeats in a keyword-based polyalphabetic cipher?

    ---

    The keyword itself repeats to match the length of the message, controlling the shift used at each position.

</flashcards>

## Further Reading

- [Wikipedia - Vigenere Cipher](https://en.wikipedia.org/wiki/Vigen%C3%A8re_cipher) - full technical history and explanation
