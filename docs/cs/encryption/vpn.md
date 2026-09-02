# Virtual Private Networks (VPNs)

A **VPN** creates an encrypted "tunnel" between your device and a VPN server, hiding your traffic from your internet provider, your school network, or anyone snooping nearby.

<videoembed id="gJWe4YV70kk"></videoembed>

## How a VPN Works

1. Your device encrypts all outgoing traffic before it leaves
2. The encrypted traffic travels to a VPN server, which decrypts it and forwards it to the real destination
3. Responses travel back through the same encrypted tunnel

| Without a VPN | With a VPN |
|---|---|
| Your ISP can see every site you visit | Your ISP only sees encrypted traffic to the VPN server |
| Public WiFi can expose your traffic | Public WiFi only sees encrypted noise |
| Your real location is visible to websites | Websites see the VPN server's location instead |

## The Connection Process

<requests>

- Left: **Your Device**

    <i data-lucide="laptop"></i>

- Middle: **VPN Server**

    <i data-lucide="server"></i>

- Right: **Destination Website**

    <i data-lucide="globe"></i>

- Requests:

    1. L ---> M      R : Login and set up an encrypted tunnel
    2. L ---> M      R : Encrypted traffic travels through the tunnel
    3. L      M ---> R : Decrypted and forwarded to its real destination
    4. L      M <--- R : Response sent back
    5. L <--- M      R : Encrypted again and returned through the tunnel

</requests>

> [!NOTE]
> A VPN protects your traffic **between you and the VPN provider** - but the VPN provider itself can technically see your unencrypted traffic once it leaves their server. Trusting a VPN means trusting *who runs it*.

## Human Factors

- **Convenience vs privacy**: many people skip using a VPN on public WiFi because it's an extra step
- **Trust**: a shady free VPN could log and sell your data - the opposite of what you signed up for
- **Bypassing restrictions**: VPNs are also used to bypass content or country restrictions, which raises legal and ethical questions depending on where you live

## In Your School

- Teachers and IT staff working remotely often connect to a school VPN to securely access internal systems (like the student management system) as if they were on-site
- Some schools use VPNs to let students safely access filtered, monitored internet even off-site
- Schools generally trust their own VPN provider - unlike a random free VPN app, they control (or contract) the server it connects to

## Test Your Knowledge: Connecting to a VPN

Drag these steps into the correct order:

<drag-drop>

1. User opens VPN app and enters login credentials

2. Device authenticates with the VPN server

3. An encrypted tunnel is established

4. Outgoing traffic is encrypted and sent through the tunnel

5. The VPN server decrypts and forwards traffic to its destination

6. Responses travel back through the encrypted tunnel to the user

</drag-drop>

## Key Terms

<flashcards>

- # VPN

    ---

    Creates an **encrypted tunnel** between your device and a server, hiding traffic from your ISP or anyone snooping nearby.

- # What a VPN provider can see

    ---

    Your **unencrypted traffic** once it leaves their server - trusting a VPN means trusting who runs it.

- # Risk of free VPNs

    ---

    They could **log and sell** your browsing data - the opposite of the privacy you wanted.

</flashcards>

## Further Reading

- [freeCodeCamp - How Does a VPN Work?](https://www.freecodecamp.org/news/how-does-a-vpn-work/) - a beginner-friendly technical guide
