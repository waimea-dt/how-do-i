# Quiz: Applications Using Encryption

Test your understanding of HTTPS, VPNs, WiFi security, device encryption, and password managers.

<quiz>

## Applications Quiz

- # What happens during a TLS handshake?

    ---

    - [ ] The website sends its data unencrypted first, then encrypts afterwards
    - [x] The browser and server agree encryption methods, verify identity, and exchange a shared key
    - [ ] The browser automatically generates a new password for the user
    - [ ] Nothing happens - HTTPS connections skip handshakes entirely

    ---

    - [x] **Correct!** The handshake sets up trust and a shared secret before any real data is sent.
    - [ ] **Not quite.** Think about what needs to be agreed and verified before any actual data can safely be sent.

- # What is the key difference between WPA2/WPA3-Personal and Enterprise?

    ---

    - [ ] Enterprise mode doesn't use any encryption at all
    - [x] Personal uses one shared password; Enterprise gives each user their own login checked by a RADIUS server
    - [ ] Personal mode is only ever used by businesses
    - [ ] There is no real difference between the two

    ---

    - [x] **Correct!** Enterprise mode ties network access to individual identities, unlike Personal's single shared password.
    - [ ] **Not quite.** Both modes use encryption - think about how each one checks who's allowed to connect.

- # Why might a school prefer WPA2/WPA3-Enterprise over Personal mode?

    ---

    - [ ] It's cheaper and much simpler for IT staff to configure
    - [x] It lets IT staff disable one person's access without resetting the password for everyone
    - [ ] It doesn't require students to log in at all
    - [ ] It only works over wired network connections

    ---

    - [x] **Correct!** Individual accounts make managing large numbers of users far more practical.
    - [ ] **Not quite.** Enterprise mode requires more setup, not less - think about what individual logins let IT staff do that a single shared password can't.

- # What does a VPN protect against?

    ---

    - [ ] Viruses that are already on your device
    - [x] Your ISP or others on the network seeing your unencrypted traffic
    - [ ] Websites collecting cookies once you're logged in
    - [ ] You forgetting your own account password

    ---

    - [x] **Correct!** A VPN encrypts traffic between your device and the VPN server, hiding it from your network provider.
    - [ ] **Not quite.** Think about who is watching the network between your device and the VPN server, and what a VPN hides from them.

- # What does BitLocker/FileVault device encryption protect?

    ---

    - [ ] Your files only while you are actively using them
    - [x] Your files "at rest" - if the device is off, locked, or the drive is removed
    - [ ] Only your saved WiFi network password
    - [ ] Nothing at all, once a TPM chip is installed

    ---

    - [x] **Correct!** Device encryption keeps data unreadable to anyone without the key, even if they physically remove the storage drive.
    - [ ] **Not quite.** Once logged in, files are decrypted for use - think about what state the device needs to be in for encryption to matter.

- # Why are password managers considered safer than reusing passwords?

    ---

    - [ ] They make it impossible to ever forget a password
    - [x] They let you use a unique, strong password for every site, so one breach doesn't expose all your accounts
    - [ ] They remove the need for any password at all
    - [ ] They automatically report any hackers to the police

    ---

    - [x] **Correct!** Unique passwords per site limit the damage of any single data breach.
    - [ ] **Not quite.** Think about what happens to your other accounts if one site you use gets breached, with and without unique passwords.

- # Why is TLS 1.3 considered an improvement over TLS 1.2?

    ---

    - [ ] It removes the need for a digital certificate entirely
    - [x] It uses fewer handshake steps, making connections faster and more secure
    - [ ] It only works on WiFi networks, not wired connections
    - [ ] It stops browsers from ever showing a padlock icon

    ---

    - [x] **Correct!** TLS 1.3 (2018) streamlined the handshake, reducing steps while improving security.
    - [ ] **Not quite.** Think about what changed in how many steps the handshake takes, and what that means for speed and security.

- # Once your encrypted traffic reaches the VPN server, who can see it in its original, unencrypted form?

    ---

    - [ ] Nobody - not even the VPN provider
    - [x] The VPN provider, once it decrypts the traffic to forward it on
    - [ ] Your ISP, even though the VPN is active
    - [ ] Only the original website you're visiting

    ---

    - [x] **Correct!** A VPN hides traffic from your ISP, but the VPN provider itself can see it once decrypted - trust in that provider matters.
    - [ ] **Not quite.** Think about where the encrypted tunnel actually ends, and what happens to the traffic immediately after that point.

- # What role does the TPM chip play in device encryption?

    ---

    - [ ] It stores a backup copy of every file on the device
    - [x] It checks the system hasn't been tampered with, then releases the encryption key so the device can boot
    - [ ] It generates the user's login password automatically
    - [ ] It permanently disables encryption if the device is stolen

    ---

    - [x] **Correct!** The TPM verifies system integrity during boot before releasing the key needed to decrypt the drive.
    - [ ] **Not quite.** Think about what needs to be checked during boot-up before a device is allowed to unlock its encrypted drive.

- # What does a password manager's "zero-knowledge" design mean?

    ---

    - [ ] The company can read your passwords but promises not to
    - [x] Even the company running the password manager cannot read your stored passwords
    - [ ] The password manager doesn't know your master password either
    - [ ] Passwords are never encrypted, only hidden from view

    ---

    - [x] **Correct!** Only you, using your master password, can unlock your vault - the provider has no way to access what's inside.
    - [ ] **Not quite.** Think about who actually holds the one password capable of unlocking the encrypted vault.

</quiz>
