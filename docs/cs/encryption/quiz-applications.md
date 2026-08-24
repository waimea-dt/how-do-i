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
    - [ ] **Not quite.** Data is never sent unencrypted first, and handshakes are essential to HTTPS.

- # What is the key difference between WPA2/WPA3-Personal and Enterprise?

    ---

    - [ ] Enterprise mode doesn't use any encryption at all
    - [x] Personal uses one shared password; Enterprise gives each user their own login checked by a RADIUS server
    - [ ] Personal mode is only ever used by businesses
    - [ ] There is no real difference between the two

    ---

    - [x] **Correct!** Enterprise mode ties network access to individual identities, unlike Personal's single shared password.
    - [ ] **Not quite.** Both use encryption - the difference is entirely about how users authenticate.

- # Why might a school prefer WPA2/WPA3-Enterprise over Personal mode?

    ---

    - [ ] It's cheaper and much simpler for IT staff to configure
    - [x] It lets IT staff disable one person's access without resetting the password for everyone
    - [ ] It doesn't require students to log in at all
    - [ ] It only works over wired network connections

    ---

    - [x] **Correct!** Individual accounts make managing large numbers of users far more practical.
    - [ ] **Not quite.** Enterprise mode requires more setup (a RADIUS server), not less.

- # What does a VPN protect against?

    ---

    - [ ] Viruses that are already on your device
    - [x] Your ISP or others on the network seeing your unencrypted traffic
    - [ ] Websites collecting cookies once you're logged in
    - [ ] You forgetting your own account password

    ---

    - [x] **Correct!** A VPN encrypts traffic between your device and the VPN server, hiding it from your network provider.
    - [ ] **Not quite.** A VPN doesn't remove malware, stop cookies, or manage your passwords.

- # What does BitLocker/FileVault device encryption protect?

    ---

    - [ ] Your files only while you are actively using them
    - [x] Your files "at rest" - if the device is off, locked, or the drive is removed
    - [ ] Only your saved WiFi network password
    - [ ] Nothing at all, once a TPM chip is installed

    ---

    - [x] **Correct!** Device encryption keeps data unreadable to anyone without the key, even if they physically remove the storage drive.
    - [ ] **Not quite.** Once logged in, files are automatically decrypted for use - the TPM chip helps *protect* the key, not disable protection.

- # Why are password managers considered safer than reusing passwords?

    ---

    - [ ] They make it impossible to ever forget a password
    - [x] They let you use a unique, strong password for every site, so one breach doesn't expose all your accounts
    - [ ] They remove the need for any password at all
    - [ ] They automatically report any hackers to the police

    ---

    - [x] **Correct!** Unique passwords per site limit the damage of any single data breach.
    - [ ] **Not quite.** A master password is still required, and password managers don't handle law enforcement reporting.

</quiz>
