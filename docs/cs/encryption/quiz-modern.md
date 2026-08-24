# Quiz: Modern Cryptography

Test your understanding of AES, RSA, and Diffie-Hellman.

<quiz>

## Modern Cryptography Quiz

- # Is AES symmetric or asymmetric?

    ---

    - [x] Symmetric
    - [ ] Asymmetric
    - [ ] A one-way hash function
    - [ ] Both, depending on the mode

    ---

    - [x] **Correct!** AES uses the same key to encrypt and decrypt.
    - [ ] **Not quite.** AES always uses a single shared key - it's never asymmetric or a hash function.

- # Why did AES replace older ciphers like DES?

    ---

    - [ ] DES was asymmetric and too slow for modern hardware
    - [x] DES's short keys became crackable by brute force as computers got faster
    - [ ] DES could only encrypt small image files
    - [ ] AES doesn't actually use any keys at all

    ---

    - [x] **Correct!** DES's 56-bit keys became too weak against modern brute-force attacks.
    - [ ] **Not quite.** DES was symmetric like AES - the issue was key length, not encryption type.

- # What mathematical fact makes RSA secure?

    ---

    - [ ] Adding two large prime numbers together is always perfectly reversible
    - [x] Factoring the product of two large primes is extremely hard, even though multiplying them is easy
    - [ ] Hashing two large prime numbers together always produces a reversible result
    - [ ] Prime numbers stop existing entirely once they get large enough

    ---

    - [x] **Correct!** This one-way difficulty is the foundation of RSA's security.
    - [ ] **Not quite.** Hashing is one-way and unrelated to RSA's core maths, and prime numbers are infinite.

- # What does Diffie-Hellman allow two people to do?

    ---

    - [ ] Encrypt bulk files considerably faster than AES normally can
    - [x] Agree on a shared secret key over a public channel, without ever sending the secret itself
    - [ ] Hash a password securely before it's ever stored
    - [ ] Verify that a received digital signature is genuine

    ---

    - [x] **Correct!** This solved the historic key distribution problem.
    - [ ] **Not quite.** That's not related to encryption speed, hashing, or signature verification.

- # Why is RSA considered at risk from future quantum computers?

    ---

    - [ ] Quantum computers can't run RSA software at all
    - [x] Quantum computers could factor large numbers far faster than classical computers
    - [ ] RSA requires internet access that quantum computers can't provide
    - [ ] Quantum computers can only ever break symmetric encryption

    ---

    - [x] **Correct!** Fast factoring would break RSA's core security assumption.
    - [ ] **Not quite.** The concern is about factoring speed, not connectivity or encryption type.

</quiz>
