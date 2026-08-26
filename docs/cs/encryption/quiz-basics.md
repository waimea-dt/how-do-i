# Quiz: Encryption Basics

Test your understanding of why encryption matters and where it came from.

<quiz>

## Encryption Basics Quiz

- # What problem does encryption solve?

    ---

    - [ ] It compresses data so it transfers and downloads faster
    - [x] It scrambles data so only authorised people can read it
    - [ ] It backs up data automatically in case of a crash
    - [ ] It speeds up network connections so pages load faster

    ---

    - [x] **Correct!** Encryption's core job is confidentiality - hiding data from anyone except the intended recipient.
    - [ ] **Not quite.** Encryption doesn't reduce file size or speed up networks - it scrambles data for security.

- # In cryptography, who is "Eve"?

    ---

    - [ ] The person who sends the original message
    - [ ] The person who receives the decrypted message
    - [x] Someone eavesdropping on the communication channel
    - [ ] The algorithm used to encrypt the message

    ---

    - [x] **Correct!** Alice sends, Bob receives, and Eve represents anyone trying to intercept or spy on the message.
    - [ ] **Try again.** Alice is the sender and Bob is the receiver - Eve is the eavesdropper.

- # What is "plaintext"?

    ---

    - [ ] The scrambled, unreadable version of a message
    - [x] The original, readable message before encryption
    - [ ] The algorithm used to scramble a message
    - [ ] The secret value used to scramble a message

    ---

    - [x] **Correct!** Plaintext is the readable message you start with, before any encryption is applied.
    - [ ] **Not quite.** That describes ciphertext, a cipher, or a key - not plaintext.

- # What is "ciphertext"?

    ---

    - [ ] The original, readable message before encryption
    - [x] The scrambled, unreadable result after encryption
    - [ ] The secret value used to scramble a message
    - [ ] The person who receives the decrypted message

    ---

    - [x] **Correct!** Ciphertext is what plaintext becomes once a cipher has scrambled it.
    - [ ] **Not quite.** That describes plaintext, a key, or Bob - not ciphertext.

- # What is a "key" in cryptography?

    ---

    - [ ] The original readable message before it's encrypted
    - [ ] The scrambled result produced by an encryption algorithm
    - [x] The secret value a cipher uses to encrypt and decrypt data
    - [ ] The name given to any program that breaks encryption

    ---

    - [x] **Correct!** A key is the secret input a cipher needs to scramble or unscramble data.
    - [ ] **Not quite.** That describes plaintext, ciphertext, or code-cracking software - not a key.

- # What's the main difference between a public key and a private key?

    ---

    - [ ] A public key encrypts files; a private key only decrypts images
    - [x] A public key can be shared freely; a private key must stay secret
    - [ ] A public key changes every day; a private key never changes
    - [ ] A public key is used for hashing; a private key is used for signing only

    ---

    - [x] **Correct!** Anyone can use your public key to encrypt data for you, but only your private key can decrypt it.
    - [ ] **Not quite.** Both keys work together on the same data - neither is limited to images or signing alone.

- # Which of these best describes "confidentiality" in encryption?

    ---

    - [ ] Proof that a message hasn't been changed since it was sent
    - [x] Making sure only the intended recipient can read a message
    - [ ] Proof that a message really came from who it claims
    - [ ] Making sure a message arrives as quickly as possible

    ---

    - [x] **Correct!** Confidentiality is about keeping a message secret from anyone except the intended recipient.
    - [ ] **Not quite.** Those describe integrity, authenticity, or speed - not confidentiality.

- # Which of these best describes "integrity" in encryption?

    ---

    - [ ] Making sure only the intended recipient can read a message
    - [x] Proof that data hasn't been tampered with since it was sent
    - [ ] Proof that a message really came from who it claims
    - [ ] Making sure a message is compressed before sending

    ---

    - [x] **Correct!** Integrity is about proving data hasn't been altered - a hash check is a classic example.
    - [ ] **Not quite.** Those describe confidentiality, authenticity, or compression - not integrity.

- # Which of these best describes "authenticity" in encryption?

    ---

    - [ ] Making sure only the intended recipient can read a message
    - [ ] Proof that data hasn't been tampered with since it was sent
    - [x] Proof that a message really came from who it claims to be from
    - [ ] Making sure a message travels over a secure network

    ---

    - [x] **Correct!** Authenticity is proven with things like digital signatures, confirming who really sent a message.
    - [ ] **Not quite.** Those describe confidentiality, integrity, or network security - not authenticity.

- # Which human factor can undermine even strong encryption?

    ---

    - [ ] Using an encryption algorithm that is too fast
    - [x] People reusing the same weak password across many accounts
    - [ ] Storing data on a device with too much storage space
    - [ ] Sending messages during busy internet traffic times

    ---

    - [x] **Correct!** Even the strongest encryption can be undone by weak human choices, like reused or guessable passwords.
    - [ ] **Not quite.** Algorithm speed, storage space, and traffic levels don't weaken encryption - human habits do.

</quiz>
