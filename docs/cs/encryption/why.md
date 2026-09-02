# Why Encryption Matters

## The Problem: Untrusted Networks

Every message you send online travels through equipment you don't control - routers, ISPs, WiFi access points. Any of these could be watched by someone else - an eavesdropper. **Encryption** solves this by scrambling data so that only the intended recipient can read it.

Without encryption:

- Passwords sent over WiFi could be read by anyone nearby
- Bank details typed into a website could be stolen mid-transit
- Private messages could be read by your internet provider, or anyone snooping on the network

## The Three Jobs of Encryption

| Goal                | Question It Answers                | Example                           |
| ------------------- | ---------------------------------- | --------------------------------- |
| **Confidentiality** | Can anyone else read this?         | Encrypting a text message         |
| **Integrity**       | Has this been tampered with?       | Checking a downloaded file's hash |
| **Authenticity**    | Is this really from who it claims? | Verifying a digital signature     |

## Human Factors: Why This Isn't Just Maths

Strong encryption can be undone by **weak human choices**:

- **Convenience vs security**: people reuse passwords because remembering 50 unique ones is hard (which is why [password managers](/cs/encryption/password-manager.md) are good!)
- **Trust**: users often can't tell a secure site from a fake one
- **Access vs privacy**: governments and companies debate whether encrypted messages should have "backdoors" for law enforcement to be able to monitor criminal communications
- **Digital divide**: not everyone can afford devices or software that keep encryption up to date

> [!TIP]
> When answering exam questions about the impacts of encryption, always link back to **people** - who benefits, who is put at risk, and what trade-offs are being made.

## Key Terms

Use these flashcards to test if you know what each of these terms or concepts means...

<flashcards>

- # Confidentiality

    ---

    Making sure only the intended recipient can read a message - the core job of encryption.

- # Integrity

    (in security)

    ---

    Proof that data hasn't been changed or tampered with since it was sent or created.

- # Authenticity

    ---

    Proof that a message or file really came from who it claims to be from.

- # Encryption's human & societal impact

    ---

    **Human choices** - reusing passwords, trusting fake sites, ignoring updates - can undo strong encryption.

    Strong encryption enables **privacy** (which is good), but also protects **criminals** (which is bad).

</flashcards>

## Further Reading

- [GCFGlobal - Internet Safety for Beginners](https://www.learnfree.org/en/internetsafety/) - plain-English safety advice
- [Cloudflare - What is Encryption?](https://www.cloudflare.com/learning/ssl/what-is-encryption/) - short, clear technical overview
