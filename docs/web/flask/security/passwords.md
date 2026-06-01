# Passwords

Do not store password as plain text.
Store only hashed version.

## Good password policy

- minimum length 8+
- include mixed character types
- block common leaked passwords where possible

## Flask workflow

1. user enters password
2. app hashes password before saving
3. login checks entered password against stored hash

This protects accounts if database is leaked.
