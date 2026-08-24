# The Enigma Cipher

The **Enigma machine** was an electromechanical cipher device used by Germany during WW2. It combined rotating wheels, a plugboard, and electrical wiring to create a cipher so complex that Germany believed it was unbreakable.

<videoembed id="CKdTdT0WdD0"></videoembed>

## How It Worked

- Typing a letter sent an electrical signal through a **plugboard**, then through 3-4 rotating **rotors**, then back through a **reflector**
- Each rotor scrambled the letter differently, and rotors advanced after every keypress - like a car odometer
- This meant the same letter typed twice in a row could encrypt to two completely different letters

## Why It Seemed Unbreakable

The number of possible rotor positions, rotor orders, and plugboard combinations created **over 150 million million million** possible settings. Trying them all by hand was impossible.

> [!NOTE]
> Enigma's settings (rotor order, starting positions, plugboard wiring) changed every single day, following a secret codebook. Even capturing a machine didn't help without the day's settings.

## The Breakthrough

Despite its complexity, Enigma had exploitable flaws:

- A letter could **never** encrypt to itself - this ruled out huge numbers of possible settings
- Operators often reused predictable phrases (like weather reports), giving codebreakers a way in

These flaws were exploited at Bletchley Park - see [Breaking the Enigma Cipher](/cs/encryption/breaking-enigma.md).

## Test Your Knowledge: How a Letter Gets Encrypted

Drag these steps into the order a keypress travels through an Enigma machine:

<drag-drop>

1. Operator presses a letter key

2. Electrical signal passes through the plugboard

3. Signal passes through each rotor in turn

4. Signal bounces back off the reflector

5. Signal passes back through the rotors in reverse

6. Encrypted letter lights up on the lamp board

7. Rotors advance ready for the next keypress

</drag-drop>

## Key Terms

<flashcards>

- # What were Enigma's main components?

    ---

    A plugboard, a set of rotating rotors, and a reflector.

- # Why did rotors advance after every keypress?

    ---

    So the same letter typed twice would encrypt to two different letters, unlike a simple substitution cipher.

- # How many possible Enigma settings were there?

    ---

    Over 150 million million million - far too many to try by hand.

</flashcards>

## Further Reading

- [Bletchley Park - The Enigma Machine](https://bletchleypark.org.uk/our-history/enigma/) - history from the museum where it was broken
