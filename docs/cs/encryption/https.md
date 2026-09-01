# HTTPS & TLS

Every time you see a padlock icon in your browser, **TLS** (Transport Layer Security) is protecting that connection. HTTPS is simply HTTP running over TLS.

## Key Features

- **Key exchange** agrees on a shared secret (like [Diffie-Hellman](/cs/encryption/diffie-hellman.md))
- A **digital certificate** proves the website's identity (see [Digital Signatures](/cs/encryption/signatures.md))
- Both sides switch to fast **symmetric encryption** (like [AES](/cs/encryption/aes.md)) for the actual data
- **TLS 1.3** (2018) removed outdated, weaker options and reduced the handshake to fewer steps, making connections both faster and more secure than the older TLS 1.2

## The Handshake, Simplified

<requests>

- Left: **Browser**

    <i data-lucide="globe"></i>

- Right: **Server**

    <i data-lucide="server"></i>

- Requests:

    1. L ---> R : Hello! Here are the encryption methods I support
    2. L <--- R : Hello! Let's use this method - here's my certificate
    3. L i)   R : Check the server certificate
    4. L ---> R : Here's my half of the shared secret
    5. L <--- R : Here's my half
    6. L i)   R : I have the **Shared secret**
    7. L   (i R : I have the **Shared secret**
    8. L ---> R : Encrypted with **fast, symmetric AES** from here on
    9. L <--- R : Encrypted with **fast, symmetric AES** from here on

</requests>

## Key Takeaways

- Even with full network access, an eavesdropper can see *which website* you're connecting to (the domain), but not the contents of your traffic
- Never enter passwords or payment details on a site without HTTPS - browsers actively warn you with a "Not Secure" label if a site lacks it
- A padlock only proves the connection is encrypted, not that the website itself is trustworthy

## Key Uses in Schools

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
