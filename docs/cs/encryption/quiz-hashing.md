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
    - [ ] **Not quite.** Hashing uses no key at all, and works on any data, not just numbers.

- # What is the avalanche effect?

    ---

    - [ ] Hashes get longer the more times you hash something
    - [x] Changing one character of input completely changes the resulting hash
    - [ ] Hash functions gradually slow down the more you use them
    - [ ] Multiple files can share the same hash safely

    ---

    - [x] **Correct!** Even a tiny change produces a completely different, unpredictable hash.
    - [ ] **Not quite.** Hash length stays fixed regardless of input, and speed doesn't change with repetition.

- # Why do rainbow tables threaten unsalted password hashes?

    ---

    - [ ] They guess passwords completely at random until one works
    - [x] They pre-compute hashes for common passwords, letting attackers instantly match a stolen hash
    - [ ] They only work against hashes that are salted
    - [ ] They physically break into servers to steal databases

    ---

    - [x] **Correct!** If your hash matches a pre-computed entry, your password is revealed instantly.
    - [ ] **Not quite.** Rainbow tables specifically fail against salted hashes - that's the whole point of salting.

- # What does salting actually protect against?

    ---

    - [ ] Slow or unreliable internet connections
    - [x] Identical passwords producing identical, easily-attacked hashes
    - [ ] Viruses and other forms of malware
    - [ ] Users simply forgetting their passwords

    ---

    - [x] **Correct!** A unique salt per user ensures identical passwords still produce different stored hashes.
    - [ ] **Not quite.** Salting is unrelated to malware, connection speed, or password recovery.

- # What two things does a digital signature prove together?

    ---

    - [ ] Speed and the overall file size
    - [x] Authenticity (who sent it) and integrity (it hasn't changed)
    - [ ] Only that a file is virus-free
    - [ ] Only that a file was encrypted

    ---

    - [x] **Correct!** Combining hashing and asymmetric encryption proves both at once.
    - [ ] **Not quite.** Digital signatures say nothing about viruses or file size - they confirm origin and integrity.

</quiz>
