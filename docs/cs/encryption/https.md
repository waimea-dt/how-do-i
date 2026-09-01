# HTTPS & TLS

Every time you see a padlock icon in your browser, **TLS** (Transport Layer Security) is protecting that connection. HTTPS is simply HTTP running over TLS.

## The Handshake

Before any data is sent, your browser and the website perform a **TLS handshake** - a mini version of everything you've already learned:

1. Key exchange agrees on a shared secret (like [Diffie-Hellman](/cs/encryption/diffie-hellman.md))
2. The website proves its identity using a **digital certificate** (see [Digital Signatures](/cs/encryption/signatures.md))
3. Both sides switch to fast **symmetric encryption** (like [AES](/cs/encryption/aes.md)) for the actual data

<tls domain="portal.school.nz"></tls>

## The Handshake, Visualised

<requests>

- Left: **Browser**

    <i data-lucide="globe"></i>

- Right: **Server**

    <i data-lucide="server"></i>

- Requests:

    1. L ---> R : Hello! Here are the encryption methods I support
    2. L <--- R : Hello! Let's use this method - here's my certificate
    3. L ---> R : Here's my half of the shared secret
    4. L <--- R : Here's my half - we now share a secret
    5. L ---> R : **Encrypted with AES from here on**
    6. L <--- R : **Encrypted with AES from here on**

</requests>

## TLS 1.2 vs TLS 1.3

<tls version="1.3"></tls>

> [!NOTE]
> TLS 1.3 (2018) removed outdated, weaker options and reduced the handshake to fewer steps, making connections both faster and more secure than TLS 1.2.

## What an Eavesdropper Can and Can't See

<tls domain="payments.school.nz" intercept></tls>

Even with full network access, an eavesdropper can see *which website* you're connecting to (the domain), but not the contents of your traffic.

> [!TIP]
> Never enter passwords or payment details on a site without HTTPS. Browsers now actively warn you with a "Not Secure" label if a site lacks it.

## In Your School

- The school's learning management system (e.g. Google Classroom) and student portal all rely on HTTPS to protect logins and grades in transit
- School-managed devices often only allow HTTPS connections, blocking plain HTTP sites for safety
- IT staff monitor for expired or invalid certificates, which would otherwise show students a security warning

## Test Your Knowledge: The TLS Handshake

Drag these steps into the correct order:

<drag-drop>

1. Browser requests a secure connection to the website

2. Server sends its digital certificate

3. Browser checks the certificate is valid and trusted

4. Browser and server use key exchange to agree a shared secret

5. Both sides switch to fast symmetric encryption for the rest of the session

</drag-drop>

## Key Terms

<flashcards>

- # What does TLS stand for?

    ---

    Transport Layer Security.

- # What is HTTPS?

    ---

    HTTP (the web's normal protocol) running over TLS for encryption and authentication.

- # What does a digital certificate prove during the handshake?

    ---

    That the server is genuinely who it claims to be, verified by a trusted certificate authority.

- # What can an eavesdropper still see on an HTTPS connection?

    ---

    Which website/domain you're connecting to - but not the contents of your traffic.

</flashcards>

## Further Reading

- [Cloudflare - What is HTTPS?](https://www.cloudflare.com/learning/ssl/what-is-https/) - clear overview of HTTPS
- [Cloudflare - Transport Layer Security (TLS)](https://www.cloudflare.com/learning/ssl/transport-layer-security-tls/) - deeper technical dive
