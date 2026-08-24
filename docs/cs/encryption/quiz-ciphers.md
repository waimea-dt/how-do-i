# Quiz: Historical Substitution Ciphers

Test your understanding of Caesar, Vigenere, and Enigma ciphers - and how each was eventually broken.

<quiz>

## Historical Ciphers Quiz

- # What type of cipher is the Caesar cipher?

    ---

    - [x] Monoalphabetic substitution
    - [ ] Polyalphabetic substitution
    - [ ] Asymmetric encryption
    - [ ] A hash function

    ---

    - [x] **Correct!** Every letter always shifts by the same fixed amount, making it monoalphabetic.
    - [ ] **Not quite.** The Caesar cipher uses a single fixed shift, so it's monoalphabetic, not polyalphabetic.

- # Why is the Caesar cipher so easy to break?

    ---

    - [ ] It uses a 256-bit key, making brute-force attacks impractical
    - [x] There are only 25 possible shifts, and frequency analysis reveals the pattern instantly
    - [ ] It requires a private key that only the recipient possesses
    - [ ] It was never actually used historically, so nobody bothers cracking it

    ---

    - [x] **Correct!** Both brute force (25 shifts) and frequency analysis make it trivial to crack today.
    - [ ] **Not quite.** Caesar ciphers use tiny keyspaces, not large binary keys.

- # What makes the Vigenere cipher stronger than Caesar?

    ---

    - [ ] It uses a public and private asymmetric key pair
    - [x] It uses a repeating keyword to vary the shift, defeating simple frequency analysis
    - [ ] It hashes the message before it's ever sent
    - [ ] It replaces letters with numbers instead of the alphabet

    ---

    - [x] **Correct!** Different shifts at different positions flatten the letter-frequency pattern.
    - [ ] **Not quite.** Vigenere is still a classical substitution cipher, not asymmetric or hash-based.

- # What method finally broke the Vigenere cipher?

    ---

    - [ ] Brute-forcing every possible 256-bit key combination by hand
    - [x] The Kasiski examination, which finds the keyword length from repeated ciphertext patterns
    - [ ] Checking the message's digital signature for authenticity
    - [ ] Running the message through the Bombe machine

    ---

    - [x] **Correct!** Once the keyword length is known, each position can be attacked like a simple Caesar cipher.
    - [ ] **Not quite.** The Bombe was built for Enigma, not Vigenere.

- # What was the key weakness that let codebreakers crack Enigma?

    ---

    - [ ] Enigma's rotors never actually rotated during use
    - [x] A letter could never encrypt to itself, ruling out huge numbers of settings
    - [ ] Enigma used the same key every day, forever
    - [ ] Enigma transmitted messages using a purely digital signal

    ---

    - [x] **Correct!** Combined with predictable messages, this flaw let the Bombe rule out impossible settings fast.
    - [ ] **Not quite.** Enigma's settings changed daily, and it was electromechanical, not digital.

</quiz>
