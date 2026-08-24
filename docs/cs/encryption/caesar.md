# The Caesar Cipher

The **Caesar cipher** is one of the oldest known encryption methods, named after Julius Caesar who reportedly used it to protect military messages.

<videoembed id="UXt0C5o4hj4"></videoembed>

## How It Works

Every letter in the plaintext is shifted a fixed number of places along the alphabet. This shift amount is the **key**.

For a shift of 3: `A` becomes `D`, `B` becomes `E`, and so on. To decrypt, just shift back the other way.

Try changing the shift value below and watch both directions update:

<sub-cypher scheme="caesar" key="3">
HELLO WORLD
</sub-cypher>

## Encrypting and Decrypting

| Step | Plaintext | Shift | Ciphertext |
|---|---|---|---|
| Encrypt | `ATTACK AT DAWN` | +3 | `DWWDFN DW GDZQ` |
| Decrypt | `DWWDFN DW GDZQ` | -3 | `ATTACK AT DAWN` |

> [!NOTE]
> A shift of 13 is called **ROT13** - it's its own reverse, since shifting by 13 twice gets you back to 26 (a full loop of the alphabet)!

<sub-cypher scheme="caesar" key="13">
ROT13 IS ITS OWN INVERSE
</sub-cypher>

## Why It's Weak

There are only **25 possible shifts** (26 letters, minus the "no shift" option). A computer - or even a patient human - can try every single one in seconds. See [Breaking the Caesar Cipher](/cs/encryption/breaking-caesar.md).

## Test Your Knowledge: Encrypting with Caesar

Drag these steps into the correct order for encrypting a message with a Caesar cipher:

<drag-drop>

1. Agree on a shift value (the key) with the recipient

2. Take the first letter of the plaintext

3. Shift it forward through the alphabet by the key value

4. Wrap around to the start of the alphabet if you go past Z

5. Repeat for every remaining letter in the message

6. Send the resulting ciphertext

</drag-drop>

## Key Terms

<flashcards>

- # What is the "key" in a Caesar cipher?

    ---

    The shift amount - how many places each letter moves along the alphabet.

- # What is ROT13?

    ---

    A Caesar cipher with a shift of 13 - applying it twice returns the original text, since 13 + 13 = 26 (a full loop).

- # How many possible shifts does a Caesar cipher have?

    ---

    25 (26 letters, minus the "no shift" option) - few enough to brute-force in seconds.

</flashcards>

## Further Reading

- [Khan Academy - The Caesar Cipher](https://www.khanacademy.org/computing/computer-science/cryptography/crypt/v/caesar-cipher) - short video walkthrough
