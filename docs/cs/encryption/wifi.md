# WiFi Security (WPA2 / WPA3)

WiFi networks broadcast data through the air, meaning anyone nearby with the right equipment could listen in - unless the network is properly encrypted. **WPA2** and **WPA3** are the security protocols that protect modern WiFi.

<videoembed id="ZJS1bWzySxo"></videoembed>

## Key Features

WPA2 uses AES encryption and has protected WiFi networks since 2004. WPA3 is the newer upgrade, fixing WPA2's biggest weaknesses:

| Feature                 | WPA2                                            | WPA3                                   |
| ----------------------- | ----------------------------------------------- | -------------------------------------- |
| Encryption              | AES                                             | AES (stronger implementation)          |
| Handshake               | Vulnerable to offline password-guessing attacks | Resistant to offline password guessing |
| Open network protection | None                                            | Encrypts even "open" public WiFi       |

## Personal vs Enterprise

**Personal** and **Enterprise** are separate from WPA2/WPA3 - they describe *how users log in*, not the encryption itself. Both can use WPA2 or WPA3 encryption.

| | WPA2/WPA3-**Personal** | WPA2/WPA3-**Enterprise** |
|---|---|---|
| Also called | PSK (Pre-Shared Key) | 802.1X |
| Login | One shared password for everyone | Individual username + password (or certificate) per user |
| Who checks your login? | The router itself | A separate **RADIUS authentication server** |
| Best for | Home/small networks | Schools, businesses, large organisations |
| If someone leaves | Everyone must change the shared password | Just disable that one person's account |
| Tracking who's online | Not possible - everyone looks the same | Each connection is tied to a real identity |
| Setup complexity | Simple | Requires extra server infrastructure |

> [!NOTE]
> Schools typically use **Enterprise** mode so each student/staff member logs in with their own credentials - making it easy to revoke access without resetting WiFi for everyone, and letting IT staff see *who* used the network and *when*.

## How WPA2/WPA3-Enterprise Works

<requests>

- Left: **Device**

    <i data-lucide="laptop"></i>

- Middle: **Access Point**

    <i data-lucide="wifi"></i>

- Right: **RADIUS Server**

    <i data-lucide="server"></i>

- Requests:

    1. L ---> M      R : Requests to join the school WiFi network
    2. L      M ---> R : Forwards the entered username and password
    3. L      M <--- R : Confirms the credentials are valid
    4. L <--- M      R : Grants access with a unique session key

</requests>

## Key Takeaways

- An eavesdropper nearby can see that traffic exists, but properly configured WPA2/WPA3 encryption prevents them from reading it
- WPA3 closes off the offline password-guessing attacks that were possible against WPA2
- Enterprise mode ties every connection to a real identity, unlike Personal mode where everyone shares one password

## Key Uses in Schools

- Student and staff WiFi almost always runs **WPA2/WPA3-Enterprise**, so each person logs in with their own school account
- If a student loses their laptop, IT can disable just that account - the WiFi password for everyone else stays the same
- Guest WiFi (for visitors) is often set up separately using **Personal** mode with a shared password, since guests don't have school accounts

## Test Your Knowledge: Connecting to Enterprise WiFi

Drag these steps into the correct order:

<drag-drop>

1. Device detects the school WiFi network

2. User enters their individual school username and password

3. Access point forwards credentials to the RADIUS server

4. RADIUS server verifies the credentials are valid

5. A unique encryption key is generated for that device's session

6. Device joins the encrypted network

</drag-drop>

## Key Terms

<flashcards>

- # WPA2 vs WPA3

    ---

    WPA3 is more resistant to **offline password-guessing** attacks and also encrypts **"open" public WiFi**.

- # Personal vs Enterprise WiFi

    ---

    Personal uses **one shared password** (PSK); Enterprise gives each user their **own login**, checked by a RADIUS server.

- # Why schools prefer Enterprise mode

    ---

    IT staff can **revoke a single user's access** without changing the password for everyone else.

- # RADIUS server

    ---

    A separate server that **checks each user's individual credentials** before granting network access.

</flashcards>

## Further Reading

- [GeeksforGeeks - WPA3 vs WPA2](https://www.geeksforgeeks.org/computer-networks/what-is-wpa3-vs-wpa2/) - detailed comparison
