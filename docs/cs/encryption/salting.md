# Salting Passwords

If two users have the same password, hashing it alone produces the same hash for both - a huge weakness. **Salting** fixes this by adding random data to each password before hashing it.

## The Problem: Rainbow Tables

Attackers pre-compute huge tables of common passwords and their hashes (a **rainbow table**). If your stored hash matches one in the table, your password is instantly known - no cracking required.

<rainbow></rainbow>

> [!TIP]
> Hash a common password like "password123" using the tool below, then paste the result into the rainbow table attack above to see how fast it's cracked.

<hasher value="password123"></hasher>

## The Fix: Salting

A **salt** is random data added to a password before hashing. Even if two users choose the identical password, their salts differ - so their final hashes are completely different.

<hasher value="password" salted></hasher>

> [!NOTE]
> The salt itself isn't secret - it's stored alongside the hash. Its job isn't to hide the password further, it's to make every hash **unique**, so pre-computed rainbow tables become useless.

## Why This Matters

| | Unsalted Hash | Salted Hash |
|---|---|---|
| Same password → same hash? | Yes | No |
| Vulnerable to rainbow tables? | Yes | No |
| Still vulnerable to brute force? | Yes (slowly) | Yes (slowly) |

## Test Your Knowledge: Storing a Salted Password

Drag these steps into the correct order:

<drag-drop>

1. User creates an account with a chosen password

2. Server generates a random salt for that user

3. Server combines the password with the salt

4. Server hashes the combined value

5. Server stores the salt and the resulting hash together

6. On login, the server repeats the process with the entered password and compares hashes

</drag-drop>

## Key Terms

<flashcards>

- # What is a salt?

    ---

    Random data added to a password before hashing, making every user's hash unique even for identical passwords.

- # Is a salt secret?

    ---

    No - it's stored alongside the hash. Its job is uniqueness, not secrecy.

- # Why do salts defeat rainbow tables?

    ---

    Rainbow tables are pre-computed for unsalted hashes - a unique salt per user makes pre-computed tables useless.

</flashcards>

## Further Reading

- [Wikipedia - Salt (Cryptography)](https://en.wikipedia.org/wiki/Salt_(cryptography)) - technical background on salting
