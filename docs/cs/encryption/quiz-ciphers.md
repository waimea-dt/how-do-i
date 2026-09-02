# Quiz: Historical Substitution Ciphers

Test your understanding of Caesar, Vigenère, and Enigma ciphers - and how each was eventually broken.

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
    - [ ] **Not quite.** Think about whether the Caesar cipher ever uses more than one substitution alphabet, and whether it uses any keys at all.

- # Why is the Caesar cipher so easy to break?

    ---

    - [ ] It uses a 256-bit key, making brute-force attacks impractical
    - [x] There are only 25 possible shifts, and frequency analysis reveals the pattern instantly
    - [ ] It requires a private key that only the recipient possesses
    - [ ] It was never actually used historically, so nobody bothers cracking it

    ---

    - [x] **Correct!** Both brute force (25 shifts) and frequency analysis make it trivial to crack today.
    - [ ] **Not quite.** Consider how small the Caesar keyspace really is, and whether that has anything to do with private keys or history.

- # Who actually invented the cipher we now call the "Vigenère" cipher?

    ---

    - [ ] Blaise de Vigenère, a 16th century French diplomat
    - [x] Giovan Battista Bellaso, an Italian cryptologist
    - [ ] Julius Caesar, reusing his earlier shift cipher
    - [ ] Alan Turing, while working at Bletchley Park

    ---

    - [x] **Correct!** The cipher was named after Vigenère by mistake - Bellaso described it decades earlier.
    - [ ] **Not quite.** The person the cipher is named after isn't the person history credits with inventing it.

- # What makes the Vigenère cipher stronger than Caesar?

    ---

    - [ ] It uses a public and private asymmetric key pair
    - [x] It uses a repeating keyword to vary the shift, defeating simple frequency analysis
    - [ ] It hashes the message before it's ever sent
    - [ ] It replaces letters with numbers instead of the alphabet

    ---

    - [x] **Correct!** Different shifts at different positions flatten the letter-frequency pattern.
    - [ ] **Not quite.** Vigenère is still a classical substitution cipher - think about what changes between each letter's shift.

- # What method finally broke the Vigenère cipher?

    ---

    - [ ] Brute-forcing every possible 256-bit key combination by hand
    - [x] The Kasiski examination, which finds the keyword length from repeated ciphertext patterns
    - [ ] Checking the message's digital signature for authenticity
    - [ ] Running the message through the Bombe machine

    ---

    - [x] **Correct!** Once the keyword length is known, each position can be attacked like a simple Caesar cipher.
    - [ ] **Not quite.** The technique looks for repeated patterns in the ciphertext to reveal something about the keyword itself.

- # A 6-letter Vigenère keyword gives a keyspace of about 309 million. Why does keyspace grow so fast with keyword length?

    ---

    - [ ] Each extra letter adds a fixed 26 more possible keys
    - [x] The keyspace is 26 raised to the power of the keyword length, so it grows exponentially
    - [ ] Longer keywords use a completely different alphabet
    - [ ] It doesn't grow - all keyword lengths have the same keyspace

    ---

    - [x] **Correct!** Keyspace is 26<sup>N</sup>, so every extra letter multiplies the possibilities by 26.
    - [ ] **Not quite.** Think about what happens when you multiply, rather than add, an extra factor of 26 for each new letter.

- # Which cipher is considered mathematically unbreakable?

    ---

    - [ ] The Caesar cipher, if the shift is kept secret
    - [ ] The Vigenère cipher, if the keyword is long enough
    - [x] A one-time pad, using a truly random key as long as the message, used only once
    - [ ] Enigma, once all rotor settings are known

    ---

    - [x] **Correct!** A one-time pad's key is random, message-length, and single-use, so there's no pattern left to attack.
    - [ ] **Not quite.** The unbreakable option relies on randomness and length matching the message, not on keeping a short keyword or shift secret.

- # Which Enigma component scrambled letters and physically advanced after every keypress?

    ---

    - [ ] The plugboard
    - [x] The rotors
    - [ ] The reflector
    - [ ] The crib

    ---

    - [x] **Correct!** The rotors advanced like a car odometer, changing the substitution for every single letter typed.
    - [ ] **Not quite.** Think about which part of Enigma actually moved between keypresses, rather than the parts that stayed fixed.

- # What was the key weakness that let codebreakers crack Enigma?

    ---

    - [ ] Enigma's rotors never actually rotated during use
    - [x] A letter could never encrypt to itself, ruling out huge numbers of settings
    - [ ] Enigma used the same key every day, forever
    - [ ] Enigma transmitted messages using a purely digital signal

    ---

    - [x] **Correct!** Combined with predictable messages, this flaw let the Bombe rule out impossible settings fast.
    - [ ] **Not quite.** Enigma's settings changed daily and it was electromechanical - the real flaw is about what a letter could never become.

- # What did the Bombe machine actually do?

    ---

    - [ ] It encrypted Allied messages using the Enigma design
    - [x] It rapidly tested and ruled out impossible rotor settings using known cribs
    - [ ] It physically intercepted German radio signals
    - [ ] It calculated frequency analysis tables for Caesar ciphers

    ---

    - [x] **Correct!** By testing thousands of settings per hour and using predictable phrases (cribs), the Bombe massively cut down the search.
    - [ ] **Not quite.** The Bombe's job was about testing settings at speed, using guesses about likely plaintext - not encrypting or intercepting messages itself.

</quiz>
