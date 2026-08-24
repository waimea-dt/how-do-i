# The Vigenere Cipher

The **Vigenere cipher** is a polyalphabetic substitution cipher that uses a repeating keyword to shift each letter by a different amount. For 300 years it was considered unbreakable, earning it the nickname *"le chiffre indechiffrable"* (the indecipherable cipher).

## How It Works

1. Choose a keyword, e.g. `SECRET`
2. Repeat the keyword to match the length of your message
3. Each letter of the keyword tells you the shift for the matching letter of the plaintext (`A` = shift 0, `B` = shift 1, and so on)

<sub-cypher scheme="vigenere" key="SECRET">
ATTACK AT DAWN
</sub-cypher>

## Worked Example

| Plaintext | A | T | T | A | C | K |
|---|---|---|---|---|---|---|
| Keyword | S | E | C | R | E | T |
| Shift | +18 | +4 | +2 | +17 | +4 | +19 |
| Ciphertext | S | X | V | R | G | D |

Try a longer message with your own keyword:

<sub-cypher scheme="vigenere" key="CRYPTO">
THE VIGENERE CYPHER IS A METHOD OF ENCRYPTING ALPHABETIC TEXT BY USING A SERIES OF INTERWOVEN CAESAR CYPHERS BASED ON THE LETTERS OF A KEYWORD
</sub-cypher>

> [!TIP]
> Notice how editing the ciphertext also decrypts back to the plaintext - encryption and decryption are just the same process running in opposite directions.

## Test Your Knowledge: Encrypting with Vigenere

Drag these steps into the correct order:

<drag-drop>

1. Choose a keyword and share it with the recipient

2. Repeat the keyword until it matches the length of the message

3. Convert each keyword letter into its shift value (A=0, B=1, and so on)

4. Shift each plaintext letter by the matching keyword shift

5. Combine the shifted letters into the final ciphertext

</drag-drop>

## Key Terms

<flashcards>

- # Why was the Vigenere cipher called "le chiffre indechiffrable"?

    ---

    It resisted being broken for around 300 years, since its polyalphabetic design defeated simple frequency analysis.

- # What determines the shift at each position in a Vigenere cipher?

    ---

    The matching letter of the repeating keyword.

- # What happens if the keyword is only one letter long?

    ---

    The Vigenere cipher becomes identical to a Caesar cipher.

</flashcards>

## Further Reading

- [Khan Academy - The Vigenere Cipher](https://www.khanacademy.org/computing/computer-science/cryptography) - part of the full cryptography course
