# Quiz: Symmetric Encryption

Test your understanding of symmetric encryption and the key distribution problem.

<quiz>

## Symmetric Encryption Quiz

- # What defines symmetric encryption?

    ---

    - [x] The same key encrypts and decrypts the data
    - [ ] Two different keys are used - one public, one private
    - [ ] No key is ever required to encrypt or decrypt
    - [ ] It only works on plain text, never on files

    ---

    - [x] **Correct!** Symmetric encryption uses one shared secret key for both directions.
    - [ ] **Not quite.** That describes asymmetric encryption, not symmetric.

- # Why is symmetric encryption preferred for large amounts of data?

    ---

    - [ ] It's more secure than asymmetric encryption
    - [x] It's much faster than asymmetric encryption
    - [ ] It doesn't require any key at all
    - [ ] It can never be intercepted by attackers

    ---

    - [x] **Correct!** Speed is symmetric encryption's biggest advantage, making it ideal for bulk data like files or video.
    - [ ] **Not quite.** Both types can be intercepted and both require keys - the difference here is speed.

- # What is the key distribution problem?

    ---

    - [ ] Encryption keys are far too long for humans to memorise
    - [x] Sharing a secret key securely over an insecure channel is difficult
    - [ ] Only governments are legally allowed to generate encryption keys
    - [ ] Keys always expire before they can ever be used

    ---

    - [x] **Correct!** If every channel is being watched, there's no obviously safe way to share the secret key itself.
    - [ ] **Not quite.** The problem is about secure sharing, not key length or expiry.

- # What modern technique solves the key distribution problem?

    ---

    - [ ] Hashing the shared key
    - [x] Diffie-Hellman key exchange
    - [ ] Simply shortening the key
    - [ ] Sending the key twice

    ---

    - [x] **Correct!** Diffie-Hellman lets two parties agree a shared secret over a public channel without ever transmitting it directly.
    - [ ] **Not quite.** Hashing doesn't solve key sharing, and sending a key twice makes interception easier, not harder.

</quiz>
