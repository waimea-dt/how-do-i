# Hash Function Demo

Explore SHA-256 - one of the most widely used cryptographic hash functions.

## Basic Demo

Type anything and watch the hash update instantly. Notice how even a single character change produces a completely different result.

<hasher value="hello"></hasher>

## Avalanche Effect - with History

The history block records each hash as you type. Watch how every single keystroke produces a completely unrelated hash - there is no pattern, no gradual change.

<hasher value="password" history></hasher>

<hasher value="password"></hasher>

<hasher value="Password"></hasher>

## Empty Input

<hasher value=""></hasher>

## Fixed-Length Output

No matter how short or long the input is, SHA-256 always produces exactly 64 hex characters (256 bits).

<hasher value="a"></hasher>

<hasher value="The quick brown fox jumps over the lazy dog"></hasher>

## Key Properties

- **Deterministic** - same input always produces the same hash
- **Fixed length** - always 256 bits (64 hex chars), regardless of input size
- **Avalanche effect** - a tiny change in input completely changes the hash
- **One-way** - it is practically impossible to reverse a hash back to the original input

## Salted Hash

A **salt** is a random value added to the input before hashing. This means two users with the same password get different hashes - defeating rainbow table attacks.

<hasher value="password" salted></hasher>

Click **↺ New** to generate a different salt. Notice the hash changes completely, even though the password hasn't.

## Salt Controls Visible, Unchecked

Use `salted="false"` to show the salt toggle without pre-enabling it. Students can tick it themselves to see the effect.

<hasher value="password" salted="false"></hasher>

## Same Password, Different Salt

Both widgets use `password` but each has a different random salt - so both hashes are completely different.

<hasher value="password" salted></hasher>

<hasher value="password" salted></hasher>


## One Password, Different Salts via History

Try refreshing the salt...

<hasher value="password" salted history></hasher>

## Binary test

Showing binary

<hasher value="password" binary></hasher>
