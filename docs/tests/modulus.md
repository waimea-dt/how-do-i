# Modulo Arithmetic Visualizer

The modulo operation (written as `a mod n` or `a % n`) finds the **remainder** after division. It's like asking "where do I land on a clock after counting forward?"

## How Modulo Works

When you divide a number by a modulus, you get:
- A **quotient** (how many complete cycles)
- A **remainder** (where you end up)

For example: `23 mod 7`
- 23 ÷ 7 = 3 remainder **2**
- So `23 mod 7 = 2`

## Visualizing with a Clock

Think of the modulus as a clock face with that many positions (0 to n-1). When you count forward, you wrap around the clock. The modulo operation tells you where you land!

## Interactive Demo (Default: 30 mod 12)

<modulus></modulus>

## Try Different Values

### Small Example: 7 mod 3

<modulus value="7" mod="3"></modulus>

### Larger Example: 42 mod 8

<modulus value="42" mod="8"></modulus>

### Zero Remainder: 20 mod 5

<modulus value="20" mod="5"></modulus>

## Real-World Uses

Modulo arithmetic appears everywhere in computing:

- **Clock arithmetic** — What time is it 25 hours from now? (25 mod 12 = 1)
- **Hash tables** — Map keys to array indices: `hash(key) mod table_size`
- **Cryptography** — RSA, Diffie-Hellman, and other algorithms rely on modular arithmetic
- **Circular buffers** — Wrap around when reaching the end: `(index + 1) mod size`
- **Even/odd checking** — `n mod 2 = 0` means even, `= 1` means odd
- **Day of week calculations** — Days cycle every 7
- **Musical notes** — Notes repeat every octave (12 semitones)

## Properties

- **Range:** `a mod n` is always between `0` and `n-1`
- **Repeating pattern:** `(a + n) mod n = a mod n`
- **Zero:** `0 mod n = 0` for any n
- **Less than modulus:** If `a < n`, then `a mod n = a`

## Try It Yourself!

Use the sliders above to explore:
- What happens when the value is less than the modulus?
- What happens when the value is exactly divisible by the modulus?
- How many complete rotations do you make with large values?
