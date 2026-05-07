# Substitution Cypher

Interactive visualization of Caesar and Vigenère substitution cyphers with animated encryption/decryption.

## Caesar Cypher

### Basic Example (Default Shift of 3)

<sub-cypher>
HELLO WORLD
</sub-cypher>

### Custom Shift (ROT13)

<sub-cypher scheme="caesar" key="13">
THE QUICK BROWN FOX JUMPS OVER THE LAZY DOG
</sub-cypher>

### Caesar with Frequency Analysis

<sub-cypher scheme="caesar" key="7" frequency>
CRYPTOGRAPHY IS THE PRACTICE AND STUDY OF TECHNIQUES FOR SECURE COMMUNICATION
</sub-cypher>

## Vigenère Cypher

### Basic Vigenère

<sub-cypher scheme="vigenere" key="SECRET">
ATTACK AT DAWN
</sub-cypher>

### Vigenère with Longer Message

<sub-cypher scheme="vigenere" key="CRYPTO">
THE VIGENERE CYPHER IS A METHOD OF ENCRYPTING ALPHABETIC TEXT BY USING A SERIES OF INTERWOVEN CAESAR CYPHERS BASED ON THE LETTERS OF A KEYWORD
</sub-cypher>

### Vigenère with Frequency Analysis

<sub-cypher scheme="vigenere" key="KEYWORD" frequency>
IN CRYPTOGRAPHY A SUBSTITUTION CYPHER IS A METHOD OF ENCRYPTING IN WHICH UNITS OF PLAINTEXT ARE REPLACED WITH CYPHERTEXT ACCORDING TO A FIXED SYSTEM
</sub-cypher>

## Interactive Features

Try these features:

### Edit Text Bidirectionally
- **Plaintext to Cyphertext**: Edit the plaintext to see the cyphertext update
- **Cyphertext to Plaintext**: Edit the cyphertext to decrypt and see the plaintext

### Adjust the Key
- **Caesar**: Change the shift value (0-25)
- **Vigenère**: Change the keystream to any text

### Animation
- **Toggle on/off**: Use the animation checkbox to enable/disable
- **Watch the process**: With animation on, see each letter highlight in the plaintext, find its substitution in the grid, and appear in the cyphertext

### Frequency Analysis
- **Pattern detection**: When the frequency attribute is present, compare letter frequencies
- **Caesar weakness**: Notice how Caesar cypher maintains relative frequencies
- **Vigenère strength**: See how Vigenère spreads out the frequency distribution

## Understanding the Cyphers

### Caesar Cypher
A simple substitution cypher where each letter is shifted by a fixed number of positions in the alphabet.

- **Shift of 3**: A → D, B → E, C → F, etc.
- **ROT13**: A shift of 13 (A ↔ N, B ↔ O, etc.) - applying it twice returns the original text
- **Weakness**: Vulnerable to frequency analysis since it preserves letter frequency patterns

### Vigenère Cypher
Uses a repeating keyword to determine different shift amounts for each position.

- **Key "SECRET"**: Position 0 uses S (shift 18), position 1 uses E (shift 4), etc.
- **Repeating pattern**: The key repeats for the length of the message
- **Historical strength**: More secure than Caesar because frequency analysis is harder
- **Modern status**: Still vulnerable to statistical analysis, especially with short or repeated keys

## Examples to Try

### Famous Messages

#### Caesar Shift 3 (allegedly used by Julius Caesar)
<sub-cypher scheme="caesar" key="3">
I CAME I SAW I CONQUERED
</sub-cypher>

#### Decrypt a ROT13 Message
Try editing this cyphertext to see the plaintext:
<sub-cypher scheme="caesar" key="13">
URYYB JBEYQ
</sub-cypher>

### Breaking the Cypher

With frequency analysis enabled, you can:
1. Look at the frequency distribution of the cyphertext
2. Compare it to expected English letter frequencies (E is most common)
3. Adjust the key to try to match patterns
4. See the plaintext update as you experiment

### Pattern Exploration

<sub-cypher scheme="vigenere" key="A">
WHEN THE KEY IS A THE VIGENERE CYPHER BECOMES A CAESAR CYPHER WITH SHIFT ZERO
</sub-cypher>

<sub-cypher scheme="vigenere" key="AAAAAAAAAA" frequency>
MULTIPLE A CHARACTERS IN THE KEY STILL PRODUCE NO SHIFT
</sub-cypher>
