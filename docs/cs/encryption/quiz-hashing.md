# Quiz: Hashing & Digital Signatures

Test your understanding of hashing, salting, and digital signatures.

<quiz>

## Hashing & Digital Signatures Quiz

- # What makes hashing different from encryption?

    ---

    - [ ] Hashing is simply a faster version of encryption
    - [x] Hashing is one-way and cannot be reversed, even with a key
    - [ ] Hashing always requires a private key to reverse
    - [ ] Hashing only works when applied to numbers

    ---

    - [x] **Correct!** Unlike encryption, there is no key and no way to reverse a hash back to the original input.
    - [ ] **Not quite.** Think about whether a hash ever uses a key, and whether it can ever be turned back into the original input.

- # What is the avalanche effect?

    ---

    - [ ] Hashes get longer the more times you hash something
    - [x] Changing one character of input completely changes the resulting hash
    - [ ] Hash functions gradually slow down the more you use them
    - [ ] Multiple files can share the same hash safely

    ---

    - [x] **Correct!** Even a tiny change produces a completely different, unpredictable hash.
    - [ ] **Not quite.** Think about what happens to the output hash when just one character of the input changes.

- # Why do rainbow tables threaten unsalted password hashes?

    ---

    - [ ] They guess passwords completely at random until one works
    - [x] They pre-compute hashes for common passwords, letting attackers instantly match a stolen hash
    - [ ] They only work against hashes that are salted
    - [ ] They physically break into servers to steal databases

    ---

    - [x] **Correct!** If your hash matches a pre-computed entry, your password is revealed instantly.
    - [ ] **Not quite.** Think about how a table of pre-computed hashes could be used to instantly look up a matching password.

- # What does salting actually protect against?

    ---

    - [ ] Slow or unreliable internet connections
    - [x] Identical passwords producing identical, easily-attacked hashes
    - [ ] Viruses and other forms of malware
    - [ ] Users simply forgetting their passwords

    ---

    - [x] **Correct!** A unique salt per user ensures identical passwords still produce different stored hashes.
    - [ ] **Not quite.** Salting is about making two identical passwords produce two different hashes.

- # What two things does a digital signature prove together?

    ---

    - [ ] Speed and the overall file size
    - [x] Authenticity (who sent it) and integrity (it hasn't changed)
    - [ ] Only that a file is virus-free
    - [ ] Only that a file was encrypted

    ---

    - [x] **Correct!** Combining hashing and asymmetric encryption proves both at once.
    - [ ] **Not quite.** Think about who really sent something, and whether it's been altered since - a digital signature proves both together.

- # What does it mean for a hash function to be "deterministic"?

    ---

    - [ ] It produces a different hash every time, even for identical input
    - [x] The same input always produces exactly the same hash
    - [ ] It can only be run once per device
    - [ ] It randomly decides whether to hash the input at all

    ---

    - [x] **Correct!** Deterministic means identical inputs always give identical hashes - essential for verifying data hasn't changed.
    - [ ] **Not quite.** Think about what "same input, same output, every single time" actually means for a hash function.

- # Which of these is a modern hashing algorithm used for password storage and integrity checks?

    ---

    - [ ] AES
    - [ ] RSA
    - [x] SHA-256
    - [ ] Diffie-Hellman

    ---

    - [x] **Correct!** SHA-256 (and SHA-3) are widely-used hash algorithms, distinct from encryption algorithms like AES and RSA.
    - [ ] **Not quite.** The others are encryption or key-exchange algorithms that use keys - hashing algorithms don't use any key at all.

- # Where is a salt stored, and does it need to stay secret?

    ---

    - [x] Stored alongside the hash, and it does not need to be secret
    - [ ] Memorised by the user, never stored anywhere
    - [ ] Encrypted separately and kept more secret than the password itself
    - [ ] Deleted immediately after hashing, so it can never be reused

    ---

    - [x] **Correct!** A salt's job is to guarantee uniqueness, not secrecy - it's stored openly next to the hash it protects.
    - [ ] **Not quite.** Salting relies on the salt being unique per user, not on keeping the salt itself hidden.

- # Why does signing hash the document first, instead of encrypting the whole document directly?

    ---

    - [ ] Hashing makes the document larger, which is more secure
    - [x] A hash is small and fixed-size, so it's fast to encrypt and verify compared to a whole large file
    - [ ] Encrypting a whole document is actually impossible
    - [ ] Hashing removes the need for a private key entirely

    ---

    - [x] **Correct!** Encrypting an entire large file with a private key would be slow - hashing first keeps signing fast and practical.
    - [ ] **Not quite.** Think about the size difference between a whole document and its hash, and what that means for speed.

- # In the digital signature process, what does the sender encrypt with their private key?

    ---

    - [ ] The entire original document
    - [x] The hash of the document
    - [ ] The recipient's public key
    - [ ] A randomly generated salt

    ---

    - [x] **Correct!** Encrypting the hash (not the whole document) with the private key creates the signature the recipient can verify.
    - [ ] **Not quite.** Think about which small, fixed-size piece of data gets encrypted to create the signature.

</quiz>
