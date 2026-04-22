# Rainbow Table Attack Demo

A rainbow table is a pre-computed lookup table that maps common passwords to their hashes. If an attacker steals a database of password hashes, they can use one to reverse-engineer the original passwords - in seconds.

## How It Works

The table below contains 15 common passwords. Their hashes are shown, but the passwords are blurred. To try the attack:

1. Hash a word using the widget below - try something simple like `password` or `monkey`
2. Copy the 64-character hash
3. Paste it into the **Stolen hash** field and hit **Start**

<hasher value="password"></hasher>

<rainbow></rainbow>

## Defeating the Attack with Salting

A **salt** is a random value added to the password before hashing. Even if the attacker has your rainbow table, the salted hash won't appear in it.

Hash `password` below with the salt enabled, then try to crack it with the rainbow table above.

<hasher value="password" salted></hasher>

## Try an Unknown Password

The rainbow table only works on passwords it already knows. Hash something not in the list (e.g. `tr0ub4dor&3`) and paste it in - the search will fail.

## Key Takeaways

- **Weak passwords are instantly crackable** - if your password appears in a rainbow table, a stolen hash gives it away immediately
- **Rainbow tables are huge** - real ones cover billions of password/hash combinations
- **The fix is salting** - adding a unique random value before hashing means the pre-computed table is useless (coming soon)
