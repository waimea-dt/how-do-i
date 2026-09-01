# Quiz: Asymmetric Encryption

Test your understanding of public-key cryptography.

<quiz>

## Asymmetric Encryption Quiz

- # What defines asymmetric encryption?

    ---

    - [ ] The same single key encrypts and decrypts everything
    - [x] A public key encrypts, and a different, mathematically linked private key decrypts
    - [ ] No key is required for either step
    - [ ] It only works when sending short text messages

    ---

    - [x] **Correct!** Asymmetric encryption uses a key pair - public to encrypt, private to decrypt.
    - [ ] **Not quite.** That describes symmetric encryption, not asymmetric.

- # Why is it safe to share your public key with anyone, including Eve?

    ---

    - [ ] Because the shared public key is never genuine
    - [x] Because only the matching private key can decrypt data encrypted with it
    - [ ] Because Eve has no interest in public keys at all
    - [ ] Because every public key expires after a single use

    ---

    - [x] **Correct!** Even with the public key, Eve can't decrypt anything without the private key.
    - [ ] **Not quite.** The public key is genuine and reusable - its safety comes from the maths, not secrecy or expiry.

- # Why don't most systems use asymmetric encryption for all their data?

    ---

    - [ ] It's illegal to use for bulk data
    - [x] It's much slower than symmetric encryption
    - [ ] It can be reversed too easily
    - [ ] It doesn't work over the internet

    ---

    - [x] **Correct!** Asymmetric encryption is computationally slower, so it's typically used to exchange a key, not encrypt bulk data.
    - [ ] **Not quite.** Speed, not legality or weakness, is the reason it's paired with symmetric encryption for bulk data.

- # How is key exchange different from public-key encryption?

    ---

    - [ ] Key exchange sends a secret key; public-key encryption does not
    - [x] Key exchange creates a shared secret; public-key encryption encrypts a message for a key owner
    - [ ] Key exchange only works when Alice and Bob meet in person
    - [ ] There is no difference between them

    ---

    - [x] **Correct!** Diffie-Hellman creates a shared secret. RSA can encrypt a message using the recipient's public key.
    - [ ] **Not quite.** Key exchange creates a shared secret without sending it. Public-key encryption protects a message for a recipient.

</quiz>
