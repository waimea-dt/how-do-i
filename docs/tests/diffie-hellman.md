# Diffie-Hellman Key Exchange

The Diffie-Hellman key exchange is a method for two parties to establish a shared secret over an insecure channel - even when an eavesdropper can see everything they send.

## How It Works

Alice and Bob want to agree on a secret encryption key, but they can only communicate over a public channel that Eve is monitoring. Here's what happens:

1. **Public Setup** - Alice and Bob agree on two public values: a prime number **p** (the modulus) and a base **g** (the generator)
2. **Private Keys** - Alice secretly picks a number **a**, Bob secretly picks a number **b**
3. **Calculate Public Values** - Alice computes **A = g^a mod p** and sends it publicly. Bob computes **B = g^b mod p** and sends it publicly
4. **Public Exchange** - They swap their public values (Eve sees this!)
5. **Calculate Shared Secret** - Alice computes **s = B^a mod p**, Bob computes **s = A^b mod p**
6. **Magic!** - Both arrive at the same secret **s**, but Eve can't calculate it!

## Interactive Demo (Default: p=23, g=3)

<diffie-hellman intercept></diffie-hellman>

## Smaller Values (p=17, g=5)

Using smaller values makes the calculations easier to follow, but the principle is the same.

<diffie-hellman p="17" g="5"></diffie-hellman>

## Color Mixing Analogy

The same protocol can be visualized using color mixing! Instead of modular arithmetic, we use color mixing to show how the protocol works:

- **Base color** (public) → like **g** and **p**
- **Secret colors** → like private keys **a** and **b**
- **Mixing colors** → like calculating **g^a mod p**
- **Shared secret color** → both arrive at the same color!

<diffie-hellman colour intercept></diffie-hellman>


## Why Is This Secure?

Eve can see:
- The public parameters **p** and **g**
- Alice's public value **A**
- Bob's public value **B**

But she **cannot** easily calculate:
- Alice's private key **a**
- Bob's private key **b**
- The shared secret **s**

Why? Because computing **a** from **A = g^a mod p** requires solving the **discrete logarithm problem**, which is extremely difficult for large primes. It would take even the fastest supercomputers millions of years to crack a properly-sized Diffie-Hellman exchange.

## Key Takeaways

- **Public channel, private result** - Alice and Bob establish a shared secret without ever transmitting it
- **Mathematical one-way function** - Easy to compute **g^a mod p**, extremely hard to reverse
- **Foundation of modern crypto** - Used in HTTPS, SSH, VPNs, and secure messaging
- **Simplified here for learning** - Real implementations use very large primes (2048+ bits)

## Real-World Application

When you visit a website with HTTPS, your browser and the server use a variant of Diffie-Hellman to establish a shared encryption key. This happens in milliseconds, and no eavesdropper (not even your ISP) can decrypt your traffic.
