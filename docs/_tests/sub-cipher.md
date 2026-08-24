# Substitution Cipher

Interactive visualization of Caesar and Vigenère substitution ciphers with animated encryption/decryption.

## Caesar Cipher

### Basic Example (Default Shift of 3)

<sub-cipher>
HELLO WORLD
</sub-cipher>

### Custom Shift (ROT13)

<sub-cipher scheme="caesar" key="13">
THE QUICK BROWN FOX JUMPS OVER THE LAZY DOG
</sub-cipher>

### Caesar with Frequency Analysis

<sub-cipher scheme="caesar" key="7" frequency>
CRYPTOGRAPHY IS THE PRACTICE AND STUDY OF TECHNIQUES FOR SECURE COMMUNICATION
</sub-cipher>

## Vigenère Cipher

### Basic Vigenère

<sub-cipher scheme="vigenere" key="SECRET">
ATTACK AT DAWN
</sub-cipher>

### Vigenère with Longer Message

<sub-cipher scheme="vigenere" key="CRYPTO">
THE VIGENERE CIPHER IS A METHOD OF ENCRYPTING ALPHABETIC TEXT BY USING A SERIES OF INTERWOVEN CAESAR CIPHERS BASED ON THE LETTERS OF A KEYWORD
</sub-cipher>

### Vigenère with Frequency Analysis

<sub-cipher scheme="vigenere" key="KEYWORD" frequency>
IN CRYPTOGRAPHY A SUBSTITUTION CIPHER IS A METHOD OF ENCRYPTING IN WHICH UNITS OF PLAINTEXT ARE REPLACED WITH CIPHERTEXT ACCORDING TO A FIXED SYSTEM
</sub-cipher>

## Decrypt Mode

When the `decrypt` attribute is present, the top box/row is relabelled "Ciphertext" (green) and the bottom "Plaintext" (blue). The text in the tag still fills the top box and the key is still applied top-to-bottom as normal - so to decrypt a message encrypted with shift `+3`, supply the ciphertext along with shift `-3`.

<sub-cipher scheme="caesar" key="-3" decrypt>
DWWDFN DW GDZQ
</sub-cipher>

For Vigenère, a self-inverse keystream (like a repeated "N", equivalent to ROT13) demonstrates the same idea - applying the same key twice cancels out:

<sub-cipher scheme="vigenere" key="N" decrypt frequency>
NGGNPX NG QNJA
</sub-cipher>

## Interactive Features

Try these features:

### Edit Text Bidirectionally
- **Plaintext to Ciphertext**: Edit the plaintext to see the ciphertext update
- **Ciphertext to Plaintext**: Edit the ciphertext to decrypt and see the plaintext

### Adjust the Key
- **Caesar**: Change the shift value (0-25)
- **Vigenère**: Change the keystream to any text

### Animation
- **Toggle on/off**: Use the animation checkbox to enable/disable
- **Watch the process**: With animation on, see each letter highlight in the plaintext, find its substitution in the grid, and appear in the ciphertext

### Frequency Analysis
- **Pattern detection**: When the frequency attribute is present, compare letter frequencies
- **Caesar weakness**: Notice how Caesar cipher maintains relative frequencies
- **Vigenère strength**: See how Vigenère spreads out the frequency distribution

## Understanding the Ciphers

### Caesar Cipher
A simple substitution cipher where each letter is shifted by a fixed number of positions in the alphabet.

- **Shift of 3**: A → D, B → E, C → F, etc.
- **ROT13**: A shift of 13 (A ↔ N, B ↔ O, etc.) - applying it twice returns the original text
- **Weakness**: Vulnerable to frequency analysis since it preserves letter frequency patterns

### Vigenère Cipher
Uses a repeating keyword to determine different shift amounts for each position.

- **Key "SECRET"**: Position 0 uses S (shift 18), position 1 uses E (shift 4), etc.
- **Repeating pattern**: The key repeats for the length of the message
- **Historical strength**: More secure than Caesar because frequency analysis is harder
- **Modern status**: Still vulnerable to statistical analysis, especially with short or repeated keys

## Examples to Try

### Famous Messages

#### Caesar Shift 3 (allegedly used by Julius Caesar)
<sub-cipher scheme="caesar" key="3">
I CAME I SAW I CONQUERED
</sub-cipher>

#### Decrypt a ROT13 Message
Try editing this ciphertext to see the plaintext:
<sub-cipher scheme="caesar" key="13">
URYYB JBEYQ
</sub-cipher>

### Breaking the Cipher

With frequency analysis enabled, you can:
1. Look at the frequency distribution of the ciphertext
2. Compare it to expected English letter frequencies (E is most common)
3. Adjust the key to try to match patterns
4. See the plaintext update as you experiment

### Pattern Exploration

<sub-cipher scheme="vigenere" key="A">
WHEN THE KEY IS A THE VIGENERE CIPHER BECOMES A CAESAR CIPHER WITH SHIFT ZERO
</sub-cipher>

<sub-cipher scheme="vigenere" key="AAAAAAAAAA" frequency>
MULTIPLE A CHARACTERS IN THE KEY STILL PRODUCE NO SHIFT
</sub-cipher>
