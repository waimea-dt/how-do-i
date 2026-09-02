# Quiz: Asymmetric Encryption

Test your understanding of public-key cryptography.

<quiz>

## Asymmetric Encryption Quiz

- # What defines asymmetric, public-key encryption?

    ---

    - [ ] The same single key encrypts and decrypts everything
    - [x] A public key encrypts, and a different, mathematically linked private key decrypts
    - [ ] No key is required for either step
    - [ ] It only works when sending short text messages

    ---

    - [x] **Correct!** Public-key encryption uses a key-pair - public to encrypt, private to decrypt.
    - [ ] **Not quite.** Think about how many keys are involved, and whether they're identical or mathematically linked but different.

- # Why is it safe to share your public key with anyone, including Eve?

    ---

    - [ ] Because the shared public key is never genuine
    - [x] Because only the matching private key can decrypt data encrypted with it
    - [ ] Because Eve has no interest in public keys at all
    - [ ] Because every public key expires after a single use

    ---

    - [x] **Correct!** Even with the public key, Eve can't decrypt anything without the private key.
    - [ ] **Not quite.** The safety comes from a mathematical relationship between two specific keys, not from secrecy, expiry, or disinterest.

- # Why don't most systems use asymmetric encryption for all their data?

    ---

    - [ ] It's illegal to use for bulk data
    - [x] It's much slower than symmetric encryption
    - [ ] It can be reversed too easily
    - [ ] It doesn't work over the internet

    ---

    - [x] **Correct!** Asymmetric encryption is computationally slower, so it's typically used to exchange a key, not encrypt bulk data.
    - [ ] **Not quite.** The reason is about how long it takes to process large amounts of data, not legality or how reversible it is.

- # How is key exchange different from public-key encryption?

    ---

    - [ ] Key exchange sends a secret key; public-key encryption does not
    - [x] Key exchange creates a shared secret; public-key encryption encrypts a message for a key owner
    - [ ] Key exchange only works when Alice and Bob meet in person
    - [ ] There is no difference between them

    ---

    - [x] **Correct!** Diffie-Hellman creates a shared secret. RSA can encrypt a message using the recipient's public key.
    - [ ] **Not quite.** One approach ends with both sides independently arriving at the same secret; the other encrypts a message specifically for one recipient.

- # Which of these is one of the three main uses of asymmetric cryptography?

    ---

    - [ ] Compressing large files before transmission
    - [ ] Storing whole hard drives at rest
    - [x] Creating digital signatures to prove authenticity and integrity
    - [ ] Backing up data automatically

    ---

    - [x] **Correct!** Public-key encryption, key exchange, and digital signatures are the three main uses of asymmetric cryptography.
    - [ ] **Not quite.** Think about the three uses covered in the notes: encrypting for someone, agreeing a shared secret, and proving who sent something.

- # In a public-key system, which key must Bob keep secret at all times?

    ---

    - [x] His private key
    - [ ] His public key
    - [ ] Both keys equally
    - [ ] Neither key needs to stay secret

    ---

    - [x] **Correct!** The public key is meant to be shared freely - only the private key must never leave Bob's control.
    - [ ] **Not quite.** Only one of the two keys in the pair needs to remain secret for the system to stay secure.

- # What could go wrong if an attacker manages to swap in their own "public key" pretending it's Bob's?

    ---

    - [ ] Nothing - public keys can't be faked
    - [x] Alice could end up encrypting messages the attacker, not Bob, can decrypt
    - [ ] Bob's private key would automatically change
    - [ ] The message would fail to encrypt at all

    ---

    - [x] **Correct!** This is why a public key's genuineness matters - certificates exist to prove a public key really belongs to who it claims.
    - [ ] **Not quite.** Think about what would happen if Alice trusted a fake key without realising, and who would then be able to read her message.

- # Why do WPA2/WPA3-Enterprise WiFi networks rely on asymmetric cryptography?

    ---

    - [ ] To compress WiFi traffic for faster speeds
    - [x] To use certificates and public-key authentication to verify each user's identity
    - [ ] To avoid needing any encryption at all
    - [ ] To let every device share one single symmetric key forever

    ---

    - [x] **Correct!** Enterprise mode uses certificates and public-key techniques to check who's really connecting, not just a shared password.
    - [ ] **Not quite.** Enterprise mode is specifically about proving identity, not about speed or avoiding encryption.

- # In the classic paint-mixing analogy, what does the final matching colour represent?

    ---

    - [ ] A public key that anyone can use to encrypt data
    - [x] The shared secret both parties reach through a Diffie-Hellman key exchange
    - [ ] A digital signature proving who sent the message
    - [ ] A hash of the original message

    ---

    - [x] **Correct!** Both parties mix their own secret in and reach the same final colour - representing a shared secret neither ever transmitted.
    - [ ] **Not quite.** The analogy is about two people reaching the same result independently, without ever sending the secret itself.

- # Once a shared secret has been created through key exchange, what is it normally used for?

    ---

    - [x] As a fast symmetric key to encrypt the actual data
    - [ ] As a replacement for a digital signature
    - [ ] It's discarded immediately and never used
    - [ ] As a password for a single login only

    ---

    - [x] **Correct!** The slow asymmetric process sets up a key; the fast symmetric cipher then does the heavy lifting of encrypting real data.
    - [ ] **Not quite.** Think about which type of encryption is fast enough to handle the actual bulk of the data being sent.

</quiz>
