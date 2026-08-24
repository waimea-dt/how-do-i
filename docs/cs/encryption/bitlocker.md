# Device Encryption

If your laptop or phone is lost or stolen, **device encryption** ensures nobody can read your files without your password - even if they remove the storage drive and plug it into another computer.

<videoembed id="qzJi6TahOVU"></videoembed>

## How It Works

Device encryption (like Windows **BitLocker**, or Apple's **FileVault**) encrypts your entire storage drive using symmetric encryption (typically [AES](/cs/encryption/aes.md)). The encryption key is protected by your login password and, on supported hardware, a special security chip called a **TPM** (Trusted Platform Module).

| Without Device Encryption | With Device Encryption |
|---|---|
| Removing the drive exposes all files | Files remain scrambled without the key |
| Resetting a password can expose data | Data stays protected even after a factory reset |

> [!IMPORTANT]
> Device encryption only protects data **at rest** (when the device is off or locked). Once you're logged in, files are automatically decrypted for use - so a strong login password still matters.

## The Boot-Up Process

<requests>

- Left: **User**

    <i data-lucide="user"></i>

- Right: **Device**

    <i data-lucide="laptop"></i>

- Requests:

    1. L   (i R : Powers on - the drive is still fully encrypted
    2. L   (i R : TPM chip checks the system hasn't been tampered with
    3. L ---> R : Enters login password or PIN
    4. L <--- R : Encryption key released - drive decrypted for use

</requests>

## Human Factors

- **Lost recovery keys**: if you lose both your password and your recovery key, your own data can become permanently unrecoverable
- **False sense of security**: device encryption doesn't protect against malware or phishing once you're logged in
- **Schools & workplaces**: managed devices often enable this automatically, but personal devices frequently don't - leaving lost phones and laptops exposed

## In Your School

- School-managed laptops and Chromebooks typically have BitLocker/FileVault-style encryption enabled by default via device management software
- IT departments securely store **recovery keys** centrally, so a forgotten password doesn't mean permanently lost data
- If a student loses a school device, the school can be confident that stored assignments, logins, and personal data remain protected

## Test Your Knowledge: Unlocking an Encrypted Device

Drag these steps into the correct order:

<drag-drop>

1. Device is powered on while still fully encrypted

2. The TPM security chip checks the system hasn't been tampered with

3. User is prompted to enter their password or PIN

4. The encryption key is released once the password is verified

5. The drive is decrypted for normal use

</drag-drop>

## Key Terms

<flashcards>

- # What does device encryption protect against?

    ---

    Someone reading your files by removing the drive or bypassing your login - it protects data "at rest".

- # What is a TPM?

    ---

    Trusted Platform Module - a security chip that helps protect the encryption key and verify the system hasn't been tampered with.

- # What happens if you lose both your password and recovery key?

    ---

    Your encrypted data can become permanently unrecoverable - even to you.

</flashcards>

## Further Reading

- [Microsoft - BitLocker Overview](https://learn.microsoft.com/en-us/windows/security/operating-system-security/data-protection/bitlocker/) - official documentation
