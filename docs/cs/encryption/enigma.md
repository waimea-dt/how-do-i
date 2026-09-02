# The Enigma Cipher

<aside>

<captioned>

![Enigma Machine](_assets/enigma.png ':size=250')

The Enigma Machine

</captioned>

</aside>

The **Enigma machine** was an electromechanical cipher device used by Germany during WW2. It combined rotating wheels, a plugboard, and electrical wiring to create a cipher so complex that Germany believed it was unbreakable.

The Enigma was a **polyalphabetic substitution cipher**, just like the Vigenère Cipher. However, the keystream was defined by an electromechanical system that resulted in an extremely long, seemingly random keystream.

## How It Worked

- Typing a letter sent an electrical signal through a **plugboard**, then through 3-4 rotating **rotors**, then back through a **reflector**
- Each rotor scrambled the letter differently, and **rotors advanced** after every keypress - like a car odometer
- This meant the same letter typed twice in a row could encrypt to two completely different letters (polyalphabetic)

## Why It Seemed Unbreakable

The number of possible rotor positions, rotor orders, and plugboard combinations created **over 150 million million million** possible settings. Trying them all by hand was impossible.

> [!NOTE]
> Enigma's settings (rotor order, starting positions, plugboard wiring) changed every single day, following a secret codebook. Even capturing a machine didn't help without the day's settings.

## Breaking the Enigma Cipher

Cracking Enigma is one of the most important stories in computer science history - the work done to break it directly led to **the invention of modern computers**!

### Bletchley Park

Britain gathered mathematicians, linguists, and puzzle-solvers at **Bletchley Park** to attack German ciphers. Among them was **Alan Turing**, a mathematician whose work here helped found computer science itself.

### The Bombe Machine

Turing and his colleagues designed the **Bombe**, an electromechanical machine that could test thousands of possible Enigma settings per hour, ruling out impossible combinations far faster than any human.

The Bombe exploited a key weakness: Enigma could never encrypt a letter to itself. Combined with predictable message patterns (like standard greetings or weather reports), this massively reduced the number of settings that needed checking.

> [!IMPORTANT]
> **Human factors mattered as much as the maths.** German operators sometimes reused settings, sent predictable messages, or made careless mistakes - each one gave codebreakers a foothold.

### The Size of the Keyspace

Enigma's keyspace came from three things multiplied together: which rotors were fitted and in what order, their starting positions, and the plugboard wiring. Early in the war, with 3 rotors to choose from, this gave a keyspace of roughly **2<sup>64</sup>**. From 1942, German U-boats added a 4th rotor, pushing the keyspace up to roughly **2<sup>88</sup>**.

> [!NOTE]
> Adding a single extra rotor didn't just make the keyspace a bit bigger - it multiplied it by the number of possible positions and wirings that rotor could have, jumping from 2<sup>64</sup> to 2<sup>88</sup>. This is why the Bombe didn't attack the full keyspace directly - it relied on flaws and cribs to rule out billions of settings at once, rather than trying them one by one.

### The Breakthrough

Despite its complexity, Enigma had exploitable flaws:

- A letter could **never** encrypt to itself - this ruled out huge numbers of possible settings
- Operators often reused predictable phrases (like weather reports), giving codebreakers a way in

These flaws were exploited at Bletchley Park and the Enigma Cipher was eventually broken.

## Key Terms

<flashcards shuffle>

- # The Enigma Machine

    ---

    An **electromechanical cipher device** used by Germany in WW2, combining rotors, a plugboard, and a reflector.

- # Enigma's **rotors**

    ---

    **Rotating wheels** that scrambled each letter differently and **advanced after every keypress**, like a car odometer.

- # Enigma's key **weakness**

    ---

    A letter could **never encrypt to itself**, ruling out huge numbers of possible settings.

- # The **Bombe**

    ---

    An electromechanical machine built at Bletchley Park to **rapidly test and rule out** impossible Enigma settings.

- # Size of Enigma's **keyspace**

    ---

    Roughly **2<sup>64</sup>** with 3 rotors, growing to **2<sup>88</sup>** once a 4th rotor was added in 1942.

- # Alan Turing

    ---

    A mathematician at **Bletchley Park** whose codebreaking work helped **found modern computer science**.

</flashcards>

## Further Reading

<videoembed id="CKdTdT0WdD0"></videoembed>


- [Bletchley Park - The Enigma Machine](https://bletchleypark.org.uk/our-history/enigma/) - history from the museum where it was broken
- [Wikipedia - Bletchley Park](https://en.wikipedia.org/wiki/Bletchley_Park) - the wider codebreaking effort, including its often-overlooked women codebreakers
- [Wikipedia - Alan Turing](https://en.wikipedia.org/wiki/Alan_Turing) - the codebreaker's story
