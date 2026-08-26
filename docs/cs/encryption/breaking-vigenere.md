# Breaking the Vigenère Cipher

For 300 years the Vigenère cipher resisted attack. It wasn't for lack of trying - it held out because being **polyalphabetic, it flattens out letter frequencies**, and a long keyword creates a **keyspace** far too large to brute-force by hand.

## Polyalphabetic Ciphers Flatten Frequency

In a Caesar cipher, `E` always becomes the same letter, so counting letter frequencies instantly reveals the shift. In the Vigenère cipher, `E` might become a different letter every time, depending on which letter of the keyword lines up with it - so the ciphertext's letter frequencies get smeared out flat.

This is a chunk of text encrypted with the **Caesar Cipher**...

<frequency title="Caesar Cipertext">

WKH LQYHQWLRQ RI WKH YLJHQUH FLSKHU LV RIWHQ LQFRUUHFWOB DWWULEXWHG WR WK FHQWXUB IUHQFK GLSORPDW FUBSWRJUDSKHU DQG LQYHQWRU EODLVH GH YLJHQUH LQ UHDOLWB LWDOLDQ FUBSWRORJLVW JLRYDQ EDWWLVWD EHOODVR EHDW KLP WR LWDVLGHWKH YLJHQUH FLSKHU LV D SROBDOSKDEHWLF VXEVWLWXWLRQ FLSKHU WKDW XVHV D UHSHDWLQJ NHBZRUG WR VKLIW HDFK OHWWHU EB D GLIIHUHQW DPRXQWIRU  BHDUV LW ZDV FRQVLGHUHG XQEUHDNDEOH HDUQLQJ LW WKH QLFNQDPH OH FKLIIUH LQGHFKLIIUDEOH WKH LQGHFLSKHUDEOH FLSKHU

</frequency>

... and here is the same plaintext encrypted with the  Vigenère  Cipher...

<frequency title="Vigenère Cipertext">

XHG PYZXGXZCS HM XRI TEUVQKI NTHFSL BZ SXAMS BSQFKYIOTEA HBGXTFNMIU HT MO GTYTCER JOXRCJ KTTEHQRH HKFTDSENOGKXV LYV GBPXUXGY JQTNGV WL ZUGXPYM VT CITEMKM NMHPXLN KERTQHPOIPDX ZBSMOS UHXDMQPO SHEPLDG ZSUM OME AW NMFGZWLXTE OKNMAXP GBILVF NL H TDWYIYILXUITKJ DYULXZHZMPSX GGLVVU MLLE MQSM T YIHLIYBSU BXFAARW VV AUOQX XTGY ZJMAIG MY I QBJCXVEPA LQHNRKTTK  FIKVQ EH NDL GZYKGRYKLH MUJWXFYRUSI QAKPPVT OE XAX RZQPGHQT WE KUBJCKI IPKPGABJWFFUSI DLC EBUHVMASWPOVEL GAWPJK

</frequency>

> [!IMPORTANT]
> Note how the very clear peaks (likely for `E`, `T` and `Ā`) in the Caesar ciphertext are not there in the Vigenere ciphertext - instead the frequency pattern is 'smoother', hiding the likely key. This is the strength of polyalphabetic ciphers.
>
> The longer and less repetitive the keyword, the flatter the frequency chart becomes - a keyword as long as the message itself flattens it completely. See [The Vigenère Cipher](/cs/encryption/vigenere.md) for how the keystream is built.

> [!NOTE]
> If the keyword / keystream is totally random, the same length as the message, and only used once, we call this a **one-time pad**


## The Keyspace Explosion

A Caesar cipher only has 26 possible shifts - a tiny **keyspace** you could try by hand. A Vigenère keyword changes this completely: for a keyword of length **N**, there are **26<sup>N</sup>** possible keywords, since each of the N letters could be any of the 26 letters of the alphabet.

| Keyword Length | Keyspace (26<sup>N</sup>)  |
| -------------- | -------------------------- |
| 1 letter       | 26 - just a Caesar cipher! |
| 3 letters      | 17,576                     |
| 6 letters      | ~309,000,000               |
| 10 letters     | ~141,000,000,000,000              |
| 20 letters     | ~2 x 10<sup>28</sup>       |

Brute-forcing the keyspace grows **exponentially** with keyword length and quickly becomes impossible to crack.


## But... Vigenère is Not Secure

If an attacker knows *how long* the keyword is, cracking it collapses to something closer to linear effort - each position can be attacked like a simple Caesar cipher, and is easy to crack.

Finding that length is the real breakthrough, and is possible because short, reused keywords still leave repeating patterns in the ciphertext.

This is why the Vigenère Cipher is no longer used in the modern world - **computers can crack it in seconds**.

> [!IMPORTANT]
> Every cipher based on a repeating pattern can eventually be broken once that pattern is discovered.
>
> This is why modern encryption (like AES) doesn't rely on repeating a short human-chosen keyword - it uses far more complex, mathematically random keys. See [The AES Algorithm](/cs/encryption/aes.md).


## Key Terms

<flashcards shuffle>

- # A polyalphabetic cipher **flattens letter frequencies** because...

    ---

    The same plaintext letter can be shifted by a different amount each time, depending on its position.

    So, no single ciphertext letter dominates the frequency count.

- # **Size of the keyspace** for a Vigenère keyword of length **N**

    ---

    26<sup>N</sup> - every extra letter in the keyword multiplies the number of possible keywords by 26.

- # A huge keyspace means Vigenère is **unbreakable**?

    ---

    **No**... Because short, reused keywords leave repeating patterns in the ciphertext, letting an attacker find the keyword length and attack each position separately.

- # One-time pad

    ---

    A Vigenère cipher where the keyword is **truly random**, used only **once**, and as **long** as the message itself - the only mathematically unbreakable cipher.

</flashcards>

## Further Reading

- [Wikipedia - Kasiski Examination](https://en.wikipedia.org/wiki/Kasiski_examination) - the classical method for finding a repeating keyword's length
