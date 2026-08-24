# Hash Functions

A **hash function** takes any input - a word, a file, a password - and produces a fixed-length string of characters called a **hash** (or digest). Unlike encryption, hashing is **one-way**: you can't reverse a hash back into the original input.

> [!NOTE]
> **Type:** Neither symmetric nor asymmetric - hashing uses no key at all and cannot be reversed | **Common algorithms:** SHA-256, SHA-3 | **Best for:** Password storage, integrity checks, signatures

<videoembed id="Qc66OJx28no"></videoembed>

## Try It Yourself

<hasher value="hello"></hasher>

## The Three Key Properties

| Property | What It Means |
|---|---|
| **Deterministic** | The same input always produces the same hash |
| **One-way** | You cannot reverse the hash back to the original input |
| **Avalanche effect** | Changing even one character completely changes the hash |

Watch the avalanche effect - notice how tiny text changes scramble the entire output:

<hasher value="password" history></hasher>

## Hashing vs Encryption

<flashcards>

- # What's the difference between encryption and hashing?

    ---

    ## Encryption

    - Reversible (decrypt to get original)
    - Requires a key
    - Used for confidentiality

    ## Hashing

    - One-way (cannot reverse)
    - No key needed
    - Used for integrity/authentication

</flashcards>

## What Hashing is Used For

- **Password storage**: websites store a hash of your password, not the password itself
- **File integrity**: downloaded files are checked against a published hash to detect tampering or corruption
- **Digital signatures**: hashing a document before signing it (see [Digital Signatures](/cs/encryption/signatures.md))

> [!WARNING]
> Hashing alone doesn't protect passwords well, because identical passwords produce identical hashes. Attackers exploit this with **rainbow tables** - see [Salting Passwords](/cs/encryption/salting.md) to find out why salting fixes this.

## In Your School

- Your school's student management system stores a **hash** of your password, not the password itself
- IT staff verify downloaded software hasn't been corrupted or tampered with by comparing its hash to the official published one
- Assignment submission systems can use hashes to detect if a file has been altered after submission

## Key Terms

<flashcards>

- # What is a hash function?

    ---

    A one-way function that turns any input into a fixed-length string (the hash), which cannot be reversed back to the original.

- # What is the avalanche effect?

    ---

    Changing even one character of the input completely changes the resulting hash.

- # Why can't you "decrypt" a hash?

    ---

    Hashing isn't encryption - it's a one-way process with no key, designed specifically to be irreversible.

- # What's a real-world weakness of unsalted password hashes?

    ---

    Identical passwords always produce identical hashes, making them vulnerable to pre-computed rainbow table attacks.

</flashcards>

## Further Reading

- [GeeksforGeeks - SHA-256 and SHA-3](https://www.geeksforgeeks.org/computer-networks/sha-256-and-sha-3/) - how modern hash algorithms work
