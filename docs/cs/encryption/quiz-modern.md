# Quiz: Modern Cryptography

Test your understanding of AES, RSA, Diffie-Hellman, and modulo arithmetic.

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
    - [ ] **Not quite.** Think about how many keys AES actually needs, and whether that key can ever decrypt as well as encrypt.

- # Why did AES replace older ciphers like DES?

    ---

    - [ ] DES was asymmetric and too slow for modern hardware
    - [x] DES's short keys became crackable by brute force as computers got faster
    - [ ] DES could only encrypt small image files
    - [ ] AES doesn't actually use any keys at all

    ---

    - [x] **Correct!** DES's 56-bit keys became too weak against modern brute-force attacks.
    - [ ] **Not quite.** DES was symmetric, just like AES - think about what specifically made its keys too weak over time.

- # What mathematical fact makes RSA secure?

    ---

    - [ ] Adding two large prime numbers together is always perfectly reversible
    - [x] Factoring the product of two large primes is extremely hard, even though multiplying them is easy
    - [ ] Hashing two large prime numbers together always produces a reversible result
    - [ ] Prime numbers stop existing entirely once they get large enough

    ---

    - [x] **Correct!** This one-way difficulty is the foundation of RSA's security.
    - [ ] **Not quite.** RSA's security comes from a specific one-way relationship between multiplying and un-multiplying (factoring) two numbers.

- # What does Diffie-Hellman allow two people to do?

    ---

    - [ ] Encrypt bulk files considerably faster than AES normally can
    - [x] Agree on a shared secret key over a public channel, without ever sending the secret itself
    - [ ] Hash a password securely before it's ever stored
    - [ ] Verify that a received digital signature is genuine

    ---

    - [x] **Correct!** This solved the historic key distribution problem.
    - [ ] **Not quite.** Think about what specific problem - sharing a secret safely - Diffie-Hellman was designed to solve.

- # Why is RSA considered at risk from future quantum computers?

    ---

    - [ ] Quantum computers can't run RSA software at all
    - [x] Quantum computers could factor large numbers far faster than classical computers
    - [ ] RSA requires internet access that quantum computers can't provide
    - [ ] Quantum computers can only ever break symmetric encryption

    ---

    - [x] **Correct!** Fast factoring would break RSA's core security assumption.
    - [ ] **Not quite.** Think about the one specific mathematical task that quantum computers are expected to do far faster than today's computers.

- # Which key sizes does AES support?

    ---

    - [ ] 8, 16, or 32 bits
    - [x] 128, 192, or 256 bits
    - [ ] 512, 1024, or 2048 bits
    - [ ] AES only supports a single fixed key size

    ---

    - [x] **Correct!** AES was designed with three possible key sizes: 128, 192, and 256 bits.
    - [ ] **Not quite.** Think about the key sizes typically quoted for AES, and how they compare to the much larger key sizes used by RSA.

- # In what year was AES adopted as the modern encryption standard?

    ---

    - [ ] 1977
    - [ ] 1991
    - [x] 2001
    - [ ] 2018

    ---

    - [x] **Correct!** NIST adopted AES in 2001, replacing DES as the global standard.
    - [ ] **Not quite.** DES and RSA both date from the 1970s - AES came along decades later as their replacement.

- # Why would a 2048-bit RSA key be considered far more secure than a 512-bit RSA key?

    ---

    - [ ] Longer keys use a completely different, unrelated algorithm
    - [x] Factoring a much larger number takes vastly more time, even for modern computers
    - [ ] Shorter keys always use symmetric encryption instead
    - [ ] Key length has no real effect on RSA's security

    ---

    - [x] **Correct!** A 512-bit key can be factored in days, while a 2048-bit key would take far longer than the age of the universe with today's computers.
    - [ ] **Not quite.** Both key sizes use the same RSA algorithm - the difference comes down to how hard the resulting number is to factor.

- # In Diffie-Hellman, which values are shared publicly between Alice and Bob?

    ---

    - [ ] Their private secret numbers
    - [x] The generator and the prime modulus
    - [ ] The final symmetric key itself
    - [ ] Nothing at all is shared publicly

    ---

    - [x] **Correct!** The generator (g) and prime modulus (p) are public; each person's private number never leaves their side.
    - [ ] **Not quite.** Some values in Diffie-Hellman are made public on purpose, while others must always stay private.

- # What does the modulo operation calculate?

    ---

    - [ ] The sum of two numbers
    - [x] The remainder left over after division
    - [ ] The product of two numbers
    - [ ] The square root of a number

    ---

    - [x] **Correct!** For example, 23 mod 7 = 2, because 23 ÷ 7 leaves a remainder of 2 - this "wrap-around" behaviour underpins RSA and Diffie-Hellman.
    - [ ] **Not quite.** Think about what's left over once you divide one number by another, like the hours wrapping around on a clock face.

</quiz>
