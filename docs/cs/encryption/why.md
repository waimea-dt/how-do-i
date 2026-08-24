# Why Encryption Matters

## The Problem: Untrusted Networks

Every message you send online travels through equipment you don't control - routers, ISPs, WiFi access points. Any of these could be watched by someone else. **Encryption** solves this by scrambling data so that only the intended recipient can read it.

Without encryption:

- Passwords sent over WiFi could be read by anyone nearby
- Bank details typed into a website could be stolen mid-transit
- Private messages could be read by your internet provider, or anyone snooping on the network

> [!NOTE]
> Cryptographers usually imagine three characters: **Alice** (sender), **Bob** (receiver), and **Eve** (eavesdropper). Every diagram in this section uses these names!

## The Three Jobs of Encryption

| Goal | Question It Answers | Example |
|---|---|---|
| **Confidentiality** | Can anyone else read this? | Encrypting a text message |
| **Integrity** | Has this been tampered with? | Checking a downloaded file's hash |
| **Authenticity** | Is this really from who it claims? | Verifying a digital signature |

## Human Factors: Why This Isn't Just Maths

Strong encryption can be undone by weak human choices. This is the focus of the 2026 assessment - not just *how* encryption works, but *who* it affects and *why* people bypass it.

- **Convenience vs security**: people reuse passwords because remembering 50 unique ones is hard
- **Trust**: users often can't tell a secure site from a fake one
- **Access vs privacy**: governments and companies debate whether encrypted messages should have "backdoors" for law enforcement
- **Digital divide**: not everyone can afford devices or software that keep encryption up to date

> [!TIP]
> When answering exam questions about impacts, always link back to **people** - who benefits, who is put at risk, and what trade-offs are being made.

## Key Terms

<flashcards>

- # What is confidentiality?

    ---

    Making sure only the intended recipient can read a message - the core job of encryption.

- # What is integrity (in security)?

    ---

    Proof that data hasn't been changed or tampered with since it was sent or created.

- # What is authenticity?

    ---

    Proof that a message or file really came from who it claims to be from.

- # Who are Alice, Bob, and Eve?

    ---

    Standard cryptography characters: **Alice** sends a message, **Bob** receives it, and **Eve** eavesdrops on the channel between them.

- # Why is encryption not "just maths"?

    ---

    Because human choices - reusing passwords, trusting fake sites, ignoring updates - can undo strong encryption. The 2026 assessment focuses on these human and social factors.

</flashcards>

## Further Reading

- [GCFGlobal - Internet Safety for Beginners](https://www.learnfree.org/en/internetsafety/) - plain-English safety advice
- [Cloudflare - What is Encryption?](https://www.cloudflare.com/learning/ssl/what-is-encryption/) - short, clear technical overview
