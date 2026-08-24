# Breaking the Caesar Cipher

The Caesar cipher looks mysterious at first, but it's one of the easiest ciphers to break using two different methods.

## Method 1: Brute-Force

Since there are only **25 possible shifts** (a keyspace of 25), you can simply **try every one** and see which produces readable English. This is called a '**brute-force attack**. A computer can do this in a fraction of a second.


| Ciphertext           | Shift | Plaintext        | English? |
| -------------------- | ----- | ---------------- | -------- |
| `HAAHJR HA KHDU`     | -1    | `GZZGIQ GZ JGCT` | No       |
| `HAAHJR HA KHDU`     | -2    | `FYYFHP FY IFBS` | No       |
| `HAAHJR HA KHDU`     | -3    | `EXXEGO EX HEAR` | No       |
| `HAAHJR HA KHDU`     | -4    | `DWWDFN DW GDZQ` | No       |
| `HAAHJR HA KHDU`     | -5    | `CVVCEM CV FCYP` | No       |
| `HAAHJR HA KHDU`     | -6    | `BUUBDL BU EBXO` | No       |
| `HAAHJR HA KHDU` !!! | -7    | `ATTACK AT DAWN` | **YES**  |


## Method 2: Frequency Analysis

Every language has letters that appear more often than others. In English, `E`, `T`, and `A` are the most common letters.

<frequency>
The quick brown fox jumps over the lazy dog. This pangram contains every letter of the alphabet!
</frequency>

### Applying this Knowledge to Attack the Caesar Cipher

Here is a ciphertext that we want to attack...

`LW VKRXOG EH TXLWH HDVB WR FUDFN WKLV PHVVDJH XVLQJ D IUHTXHQFB DQDOBVLV DWWDFN ZKLFK ORRNV DW WKH PRVW FRPPRQ OHWWHUV WR GHWHUPLQH OLNHOB OHWWHU VKLIWV`

If we count the letter frequencies in the ciphertext, the most common ciphertext letter is likely to be the letter substituted for `E`. In this example...

<frequency header="false">
LW VKRXOG EH TXLWH HDVB WR FUDFN WKLV PHVVDJH XVLQJ D IUHTXHQFB DQDOBVLV DWWDFN ZKLFK ORRNV DW WKH PRVW FRPPRQ OHWWHUV WR GHWHUPLQH OLNHOB OHWWHU VKLIWV
</frequency>

... we can see that `H` and `W` are very common giving likely shifts of:
- `E` to `H` = **+3**
- `E` to `W` = **+18**

Trying decrypts with shifts of -3 and -18, we can see that the key to encrypt must have been **+3**...

<sub-cipher scheme="caesar" key="-3" decrypt>
LW VKRXOG EH TXLWH HDVB WR FUDFN WKLV PHVVDJH XVLQJ D IUHTXHQFB DQDOBVLV DWWDFN ZKLFK ORRNV DW WKH PRVW FRPPRQ OHWWHUV WR GHWHUPLQH OLNHOB OHWWHU VKLIWV
</sub-cipher>

## Why This Matters

This is the core weakness of **any monoalphabetic substitution cipher** - even complex ones with symbols instead of letters. As long as one letter always maps to the same replacement, frequency analysis can crack it.

This Caesar Cipher tool shows the letter frequencies of the plaintext and cipher text. You can clearly see the patterns of common letters (`E`, `T` and `A`) '**leaking**' through to the ciphertext...

<sub-cipher scheme="caesar" key="7" frequency>
CRYPTOGRAPHY IS THE PRACTICE AND STUDY OF TECHNIQUES FOR SECURE COMMUNICATION. ONE TYPE OF ATTACK ON A CIPHER IS FREQUENCY ANALYSIS WHICH IDENTIFIES COMMON LETTERS IN A CIPHERTEXT WHICH LIKELY MAP TO COMMON LETTERS IN THE PLAINTEXT
</sub-cipher>


> [!NOTE]
> This is exactly why cryptographers moved on to **polyalphabetic ciphers**, where the substitution rule keeps changing. See [The Vigenere Cipher](/cs/encryption/vigenere.md).



## Key Terms

<flashcards>

- # Brute-Force attack

    ---

    Trying **every possible key** in the keyspace until you find the correct one.

- # Frequency Analysis

    ---

    Counting **how often each letter appears** in ciphertext to guess which letters they represent, based on known language letter frequencies.

- # Most common letters in English

    ---

    `E`, `T`, and `A` appear most frequently in English text.

- # Why is Caesar Cipher weak?

    ---

    Because it's **monoalphabetic** - the same letter always maps to the same replacement, so frequency patterns carry through to the ciphertext.

</flashcards>


## Further Reading

- [Khan Academy - Frequency Analysis](https://www.khanacademy.org/computing/computer-science/cryptography) - explore the full cryptography course
