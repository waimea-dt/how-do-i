# What is Modulo Arithmetic?

The modulo operation (written as `a mod n` or `a % n`) finds the **remainder after division**...

For example: `23 mod 7`
- 23 ÷ 7 = 3 **remainder 2**
- So `23 mod 7 = 2`

## Why is Modulo Arithmetic Important?

Most importantly for the topic of **Cryptography**: [RSA](/cs/encryption/rsa.md), [Diffie-Hellman Key Exchange](/cs/encryption/diffie-hellman.md), and other algorithms rely on modular arithmetic

But modulo arithmetic appears everywhere in computing...

| Where                        | Modulus  | How                                                                                                                 |
| ---------------------------- | -------- | ------------------------------------------------------------------------------------------------------------------- |
| **Even / Odd checking**        | 2        | If `n mod 2 = 0` then n is even, if `= 1` then n is odd                                                             |
| **Time calculations**        | 12 or 24 | What time of day will it be 67 hours from 3AM? `(3 + 67) mod 24 = 22`. 22 hours is 10PM                             |
| **Day of week calculations** | 7        | Mon = 0, Tue = 1, Wed = 2, etc. If today is Wed, what day will it be in 67 days? `(2 + 67) mod 7 = 6`. Day 6 is Sun |
| **Musical notes**            | 12       | Notes repeat every octave (12 semitones)                                                                            |

## How Does Modulo Arithmetic Work?

### Visualizing with a Clock

You already know how do do modulo arithmetic! Think of counting hours on a **clock face**... When you count forward, you wrap around the clock, again and again. The modulo operation tells you where you eventually land.

For example, let's **count forward 31 hours** on a **12 hour clock face** (we're doing `31 mod 12`)...

<modulus value="31" mod="12"></modulus>

> [!NOTE]
> It's for this reason that modulo arithmetic is often called **Clock Arithmetic**

### Modulus M Means a Clock with M numbers

We can do this for any modulus by changing the clock face. Let's try `99 mod 17`. We need a clock face with **17 numbers**...

<modulus value="99" mod="17"></modulus>

## Some Examples

### Time of Day (mod 24)

Here we can see the time calculation mentioned above: What time of day will it be **67 hours from 3AM**? We need to do `(3 + 67) mod 24`...

<modulus value="70" mod="24"></modulus>

... it's `22`, or **10PM**

### Even / Odd (mod 2)

And here we can see use a modulus of 2 to check is a value is even or odd: `n mod 2 = 0` if **even** and `= 1` if **odd**. Is **27 even or odd**? Let's try `27 mod 2`...

<modulus value="27" mod="2"></modulus>

... it's `1`, so 27 must be **odd**!

