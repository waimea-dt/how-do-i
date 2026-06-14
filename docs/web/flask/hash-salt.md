# Hashing and Salting

Hashing converts password into one-way string.
Salting adds random value before hashing to stop rainbow-table attacks.

## Example with Werkzeug

```python
from werkzeug.security import generate_password_hash, check_password_hash

hashed = generate_password_hash('myStrongPassword123')

is_valid = check_password_hash(hashed, 'myStrongPassword123')
```

## Why this matters

- same password from two users should produce different hashes
- attacker cannot reverse hash to original password easily
- much safer than plain text storage
