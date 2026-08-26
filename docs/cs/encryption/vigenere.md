# The Vigenère Cipher

<aside note>

#### Named for the Wrong Person!

![Vigenère](_assets/vigenere.png ':size=250')

The invention of the Vigenère Cipher is often (incorrectly) attributed to 16th Century French diplomat, cryptographer, and inventor, Blaise de Vigenère. In reality, Italian cryptologist Giovan Battista Bellaso beat him to it.

</aside>

The **Vigenère cipher** is a **polyalphabetic substitution cipher** that uses a repeating keyword to shift each letter by a different amount.

For 300 years it was considered unbreakable, earning it the nickname *"Le Chiffre Indechiffrable"* (the indecipherable cipher).

#### What is a Polyalphabetic Cipher?

A **polyalphabetic cipher** uses **more than one substitution alphabet** across a single message ('poly' means 'many'). So the same plaintext letter can map to different ciphertext letters depending on its position.

So, depending upon which substitution alphabet is being used, the letter `E` could be substituted for `G` at one point in the message, but `U` at another point,

#### Why This Defeats Frequency Analysis

In the Caesar cipher, `E` always becomes the same letter - so counting letter frequencies reveals the key. In a polyalphabetic cipher, `E` might become `X` in one place and `M` in another, flattening out the frequency pattern.

| Cipher Type               | `E` encrypts to...                           | Frequency Analysis Works? |
| ------------------------- | -------------------------------------------- | ------------------------- |
| Monoalphabetic (Caesar)   | The **same letter** every time               | Yes - easily broken       |
| Polyalphabetic (Vigenère) | **Different letters** based on the keystream | Much harder               |

> [!TIP]
> See [Breaking Vigenère](/cs/encryption/breaking-vigenere.md) for more details.

## How the Vigenère Cipher Works

The Vigenère Cipher uses a **repeating keyword** (the **key**) to create a long **keystream** that is the same length as the plaintext message. Each letter of the keystream tells you the shift to use for that position in the message...

1. Choose a keyword, e.g. `SECRET`
2. Repeat the keyword to match the length of your message: `SECRETSECRETSECRETSECRET...`
3. Each letter of the keyword tells you the shift for the matching letter of the plaintext (`A` = shift 0, `B` = shift 1, and so on)

### Encryption

<sub-cipher scheme="vigenere" key="SECRET">
ATTACK AT DAWN
</sub-cipher>

| Plaintext      | A       | T      | T      | A       | C      | K   |
| -------------- | ------- | ------ | ------ | ------- | ------ | --- |
| Keystream      | S       | E      | C      | R       | E      | T   |
| Shift          | **+18** | **+4** | **+2** | **+17** | **+4** | **+19** |
| Ciphertext !!! | S       | X      | V      | R       | G      | D   |

> [!NOTE]
> Notice how the four `A`s in "ATTACK", "AT" and "DAWN" can encrypt to *different* ciphertext letters, because they line up with different letters of the keyword.

Try a longer message with your own keyword`. See how the frequency analysis flattens with longer keys...

<sub-cipher scheme="vigenere" key="CRYPTO" frequency>
THE VIGENERE CIPHER IS A METHOD OF ENCRYPTING ALPHABETIC TEXT BY USING A SERIES OF INTERWOVEN CAESAR CIPHERS BASED ON THE LETTERS OF A KEYWORD
</sub-cipher>

### Decryption

Notice how editing the ciphertext also decrypts back to the plaintext - encryption and decryption are just the same process running in opposite directions...

<sub-cipher scheme="vigenere" key="CRYPTO" decrypt>
VYC KBUGECGX QKGFTK WU R KTMVQU MU XBEIWEMWPX YAIVCSCIBQ VVVI UM WJGCZ O UVPXXG QW GCMSTNMKXB ERCHTF EZNWXFU SYHXR QE RWX ZGKRTKG QW Y ZXMYFPS
</sub-cipher>


## Test Your Knowledge: Encrypting with Vigenère

Drag these steps into the correct order:

<drag-drop>

1. Choose a keyword

2. Share keyword with recipient (securely!)

2. Repeat the keyword to make a keystream

3. Each keystream letter is a shift (A=0, B=1, etc.)

4. Shift each plaintext letter by the matching keystream shift

5. Combine the shifted letters into the final ciphertext

</drag-drop>

## Key Terms

<flashcards shuffle>

- # **Polyalphabetic** Cipher

    ---

    Uses **more than one substitution alphabet** across a single message, so the same letter can encrypt differently depending on its position.

- # A polyalphabetic cipher **defeats frequency analysis** because...

    ---

    A letter like E no longer always maps to the same ciphertext letter, flattening out the frequency pattern an attacker would look for.

- # The Vigenère Cipher's **keystream** is...

    ---

    A keyword repeated multiple times to match the length of the message.

- # The **shift used** to encrypt a letter comes from...

    ---

    The matching letter in the keystream: `A` means a shift of 0, `B` means a shift of 1, etc.

- # Why "**Le chiffre indechiffrable**"?

    ---

    Vigenère **resisted being broken for around 300 years**, since its polyalphabetic design defeated simple frequency analysis.

- # A **single letter keyword** results in...

    ---

    The Vigenère cipher becomes identical to a **Caesar Cipher**.

</flashcards>

## Further Reading


- [Khan Academy - The Vigenère Cipher](https://www.khanacademy.org/computing/computer-science/cryptography) - part of the full cryptography course
- [Wikipedia - Vigenère Cipher](https://en.wikipedia.org/wiki/Vigen%C3%A8re_cipher) - full technical history and explanation
