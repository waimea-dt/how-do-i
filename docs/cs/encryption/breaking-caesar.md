# Breaking the Caesar Cipher

The Caesar cipher looks mysterious at first, but it's one of the easiest ciphers to break using two different methods.

## Method 1: Brute Force

Since there are only 25 possible shifts, you can simply try every one and see which produces readable English. A computer can do this in a fraction of a second.

## Method 2: Frequency Analysis

Every language has letters that appear more often than others. In English, `E`, `T`, and `A` are the most common letters. If you count letter frequencies in the ciphertext, the most common ciphertext letter is probably standing in for `E`.

Try it yourself - this analyzer counts letters in real time:

<frequency sort="freq">
WKLV LV D VHFUHW PHVVDJH HQFUBSWHG ZLWK D FDHVDU FLSKHU
</frequency>

> [!TIP]
> The text above is shifted by 3. Notice which letter appears most often, then try shifting it back to `E` to find the key!

## Why This Matters

This is the core weakness of **any monoalphabetic substitution cipher** - even complex ones with symbols instead of letters. As long as one letter always maps to the same replacement, frequency analysis can crack it.

<sub-cypher scheme="caesar" key="7" frequency>
CRYPTOGRAPHY IS THE PRACTICE AND STUDY OF TECHNIQUES FOR SECURE COMMUNICATION
</sub-cypher>

> [!NOTE]
> This is exactly why cryptographers moved on to **polyalphabetic ciphers**, where the substitution rule keeps changing. See [Polyalphabetic Ciphers](/cs/encryption/polyalphabetic.md).

## Test Your Knowledge: Frequency Analysis Attack

Drag these steps into the order you'd use to crack a Caesar cipher with frequency analysis:

<drag-drop>

1. Collect the ciphertext

2. Count how often each letter appears

3. Identify the most common ciphertext letter

4. Assume it represents the letter E (the most common in English)

5. Calculate the shift between that letter and E

6. Shift the whole ciphertext back by that amount

7. Check whether the result reads as sensible English

</drag-drop>

## Key Terms

<flashcards>

- # What is frequency analysis?

    ---

    Counting how often each letter appears in ciphertext to guess which letters they represent, based on known language letter frequencies.

- # Which English letters are most common?

    ---

    E, T, and A appear most frequently in English text.

- # Why does frequency analysis work on the Caesar cipher?

    ---

    Because it's monoalphabetic - the same letter always maps to the same replacement, so frequency patterns carry through to the ciphertext.

</flashcards>

## Further Reading

- [Khan Academy - Frequency Analysis](https://www.khanacademy.org/computing/computer-science/cryptography) - explore the full cryptography course
