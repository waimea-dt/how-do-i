# Password Managers

Remembering dozens of strong, unique passwords is practically impossible for a human - which is exactly why **password managers** exist.

<videoembed id="DVekqK25UzQ"></videoembed>

## How They Work

1. You create one strong **master password**
2. The password manager uses it to encrypt (and decrypt) a vault of all your other passwords
3. It can generate long, random, unique passwords for every site you use

> [!NOTE]
> A good password manager encrypts your vault using **zero-knowledge** design - meaning even the company that made the app cannot read your stored passwords, only you can (via your master password).

## Logging In With a Password Manager

<requests>

- Left: **User**

    <i data-lucide="user"></i>

- Middle: **Password Manager**

    <i data-lucide="vault"></i>

- Right: **Website**

    <i data-lucide="globe"></i>

- Requests:

    1. L ---> M      R : Unlocks the vault with the master password
    2. L      M i)   R : Recognises the site being visited
    3. L      M ---> R : Autofills and submits the saved credentials
    4. L      M <--- R : Confirms the login was successful

</requests>

## Why Reusing Passwords is Dangerous

If you reuse the same password across multiple sites, a single data breach at *any* one of them exposes your account everywhere else too. Password managers make it realistic to use a different password for every account.

<hasher value="MyPassword123" history></hasher>

> [!TIP]
> Notice how similar passwords hash to completely different values. This is exactly why a leaked hash from one site can't easily be reused to guess your password on a different site - *unless* you reused the same password.

## Human Factors

- **The master password is a single point of failure** - if it's weak or stolen, everything is exposed
- **Convenience drives adoption** - many people avoid password managers because setup feels like a hassle, despite the security benefit
- **Trust in the provider** - you're trusting a company (or open-source project) with your most sensitive information

## In Your School

- Many schools issue students a single sign-on (SSO) account, effectively acting like a simplified password manager for multiple school systems
- IT departments often recommend or provide password manager access for staff, who need dozens of separate logins for school software
- Teaching students to use a password manager is a practical way to build good digital citizenship habits before they leave school

## Key Terms

<flashcards>

- # Master password

    ---

    The single strong password used to **unlock** a password manager's encrypted vault.

- # Zero-knowledge design

    ---

    Even the company that made the app **cannot read** your stored passwords - only you can, via your master password.

- # Risk of reusing passwords

    ---

    A single data breach at one site can expose your account **everywhere else** you reused that password.

- # Single point of failure

    ---

    The master password - if it's **weak or stolen**, everything in the vault is exposed.

</flashcards>

## Further Reading

- [Dashlane - How Password Managers Work: A Beginner's Guide](https://www.dashlane.com/blog/how-password-managers-work-beginners-guide) - practical, beginner-friendly explanation
