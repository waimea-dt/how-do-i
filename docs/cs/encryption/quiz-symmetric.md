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
    - [ ] **Not quite.** Think about how many keys are involved, and whether a key is needed at all.

- # Why is symmetric encryption preferred for large amounts of data?

    ---

    - [ ] It's more secure than asymmetric encryption
    - [x] It's much faster than asymmetric encryption
    - [ ] It doesn't require any key at all
    - [ ] It can never be intercepted by attackers

    ---

    - [x] **Correct!** Speed is symmetric encryption's biggest advantage, making it ideal for bulk data like files or video.
    - [ ] **Not quite.** Both types can be intercepted and both require keys - think about what actually differs between them.

- # What is the key distribution problem?

    ---

    - [ ] Encryption keys are far too long for humans to memorise
    - [x] Sharing a secret key securely over an insecure channel is difficult
    - [ ] Only governments are legally allowed to generate encryption keys
    - [ ] Keys always expire before they can ever be used

    ---

    - [x] **Correct!** If every channel is being watched, there's no obviously safe way to share the secret key itself.
    - [ ] **Not quite.** The problem is specifically about how to safely get a secret key from one person to another.

- # What modern technique solves the key distribution problem?

    ---

    - [ ] Hashing the shared key
    - [x] Diffie-Hellman key exchange
    - [ ] Simply shortening the key
    - [ ] Sending the key twice

    ---

    - [x] **Correct!** Diffie-Hellman lets two parties agree a shared secret over a public channel without ever transmitting it directly.
    - [ ] **Not quite.** The solution is a specific 1976 breakthrough that lets two strangers agree a secret mathematically, without sending it at all.

- # Which cipher became the modern symmetric standard, replacing the older DES?

    ---

    - [ ] RSA
    - [x] AES
    - [ ] Diffie-Hellman
    - [ ] SHA-256

    ---

    - [x] **Correct!** AES was adopted in 2001 after DES's 56-bit keys became too weak against brute-force attacks.
    - [ ] **Not quite.** The replacement is itself a symmetric cipher, not an asymmetric algorithm or a hash function.

- # Roughly how much faster is AES than an asymmetric cipher like RSA?

    ---

    - [ ] About twice as fast
    - [ ] About 10 times as fast
    - [x] About 1000 times as fast
    - [ ] They run at almost exactly the same speed

    ---

    - [x] **Correct!** This huge speed gap is why symmetric encryption handles bulk data while asymmetric encryption only handles small secrets.
    - [ ] **Not quite.** The real gap is large enough to explain why nobody uses asymmetric encryption for streaming video or whole hard drives.

- # What happens once an eavesdropper obtains the symmetric key?

    ---

    - [ ] Nothing - the key alone is useless without the algorithm
    - [x] Every message encrypted with that key is compromised
    - [ ] Only future messages are at risk, not past ones
    - [ ] The encryption automatically regenerates a new key

    ---

    - [x] **Correct!** Symmetric security depends entirely on the key staying secret - once it's exposed, all protection from it is gone.
    - [ ] **Not quite.** Think about what a shared secret key actually protects, and what happens the moment it's no longer secret.

- # Before Diffie-Hellman, which of these was a real but limited historical solution to the key distribution problem?

    ---

    - [ ] Publishing the key on a public noticeboard
    - [x] Delivering codebooks in person via a trusted courier
    - [ ] Encrypting the key using the key itself
    - [ ] Making the key public so anyone could read it

    ---

    - [x] **Correct!** Militaries used trusted couriers to physically deliver codebooks - safe, but slow and risky if intercepted.
    - [ ] **Not quite.** The historical fix still required some kind of secure, private way to get the key to the other person.

- # Which of these relies on symmetric encryption to protect bulk data?

    ---

    - [ ] A Diffie-Hellman key exchange
    - [x] Whole-disk encryption like BitLocker or FileVault
    - [ ] An RSA-encrypted key exchange
    - [ ] A digital signature on a document

    ---

    - [x] **Correct!** Disk encryption needs to scramble huge amounts of data quickly, which is exactly what symmetric ciphers like AES are built for.
    - [ ] **Not quite.** Think about which of these actually encrypts large volumes of data, rather than just a small secret or a signature.

- # Why couldn't pre-shared keys alone solve key distribution for the modern internet?

    ---

    - [ ] Pre-shared keys are illegal to use outside of banking
    - [x] They only work practically for small, fixed groups who can exchange keys in advance
    - [ ] Pre-shared keys are always cracked within seconds
    - [ ] They require an internet connection to generate

    ---

    - [x] **Correct!** The internet connects strangers who've never met, so there's no way to pre-share a key with everyone in advance.
    - [ ] **Not quite.** Think about how many people use the internet, and whether they could all have met in advance to swap keys.

</quiz>
