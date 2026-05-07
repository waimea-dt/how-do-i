# Definitions Plugin Test Cases

This page tests the automatic glossary term linking functionality.

## Case Sensitivity Rules

The definitions plugin follows these rules:
- **Lowercase-only terms** (e.g., `algorithm`, `privacy`) match case-insensitively and preserve the original case
- **Terms with ANY uppercase letter** (e.g., `NOT`, `API`, `iOS`, `macOS`, `None`) only match exactly (case-sensitive)
- **Plural matching**: All terms automatically match with an optional trailing 's' (e.g., `algorithm` matches both "algorithm" and "algorithms")

---

## Test: Lowercase Terms (Case-Insensitive Matching)

These terms are defined in lowercase in the glossary, so they should match any case variation:

1. **algorithm** - The word algorithm should be linked
2. **Algorithm** - The word Algorithm (capitalized) should be linked
3. **ALGORITHM** - The word ALGORITHM (all caps) should be linked
4. **variable** - A variable stores data
5. **Variable** - Variable is a fundamental concept
6. **VARIABLE** - VARIABLE should still match
7. **Encryption** - Encryption protects data
8. **encryption** - The encryption method used
9. **ENCRYPTION** - ENCRYPTION is important for security
10. **privacy** - User privacy matters
11. **Privacy** - Privacy is a right
12. **PRIVACY** - PRIVACY must be protected

---

## Test: Terms with Uppercase Letters (Case-Sensitive/Exact Matching)

These terms contain at least one uppercase letter in the glossary, so they should ONLY match exactly:

1. **NOT operator** - The word NOT should be linked, but not should not
2. **not operator** - The word not should NOT be linked here
3. **AND gate** - The word AND should be linked, but and should not
4. **and gate** - The word and should NOT be linked here
5. **OR logic** - The word OR should be linked, but or should not
6. **or logic** - The word or should NOT be linked here
7. **API design** - API should be linked
8. **api design** - The lowercase api should NOT be linked
9. **CPU speed** - CPU should be linked
10. **cpu speed** - The lowercase cpu should NOT be linked
11. **RAM memory** - RAM should be linked
12. **ram memory** - The lowercase ram should NOT be linked
13. **HTML tags** - HTML should be linked
14. **html tags** - The lowercase html should NOT be linked
15. **CSS styles** - CSS should be linked
16. **css styles** - The lowercase css should NOT be linked

---

## Test: Mixed-Case Terms (Case-Sensitive/Exact Matching)

These terms have mixed uppercase and lowercase, so they only match exactly:

1. **iOS** is Apple's mobile OS, but **ios** (lowercase) should NOT match
2. **macOS** is Apple's desktop OS, but **macos** or **MacOS** should NOT match
3. **None** in Python represents absence, but **none** (lowercase) should NOT match
4. **Android** OS should match, but **android** (lowercase) should NOT match
5. **Linux** operating system should match, but **linux** (lowercase) should NOT match
6. **JavaScript** programming language should match, but **javascript** should NOT match
7. Operating systems: **iOS**, **macOS**, **Android**, **Linux**
8. Wrong case variants that should NOT match: ios, macos, android, linux, javascript

---

## Test: Mixed Case in Sentences

Testing natural language usage:

1. In programming, a **variable** is used to store data. The **Variable** declaration is important.
2. The **NOT** operator inverts a boolean value, but **not** every operation needs it.
3. Use **encryption** to protect data. **Encryption** is essential. **ENCRYPTION** standards vary.
4. An **API** provides interfaces. You cannot just say **api** (lowercase) without being specific.
5. The **CPU** and **GPU** are different. We don't refer to them as **cpu** or **gpu** in lowercase.
6. Boolean **AND**, **OR**, and **NOT** gates are fundamental, unlike the words and, or, and not in regular text.

---

## Test: Multiple Occurrences

The same term appearing multiple times:

1. **algorithm algorithm algorithm** - All three should be linked
2. **Algorithm algorithm ALGORITHM** - All three should be linked (different cases)
3. **NOT NOT NOT** - All three should be linked
4. **not not not** - None should be linked
5. **API API API** - All three should be linked
6. **api api api** - None should be linked

---

## Test: Terms in Different Contexts

1. **Data types** include int, string, boolean, char, and float.
2. **Control flow** uses if statements, loops, and recursion.
3. **Object-oriented programming** (OOP) includes concepts like class, object, method, and inheritance.
4. **Networking** involves IP addresses, DNS, HTTP, and HTTPS protocols.
5. **Security** requires authentication, encryption, and two-factor authentication (2FA).

---

## Test: Compound Terms

1. **floating-point** numbers vs floating point without hyphen
2. **two-factor authentication** is also known as 2FA
3. **cross-site scripting** is abbreviated as XSS
4. **machine code** is the lowest level
5. **big-O notation** describes complexity

---

## Test: Acronyms

All these should match (uppercase only):

1. **2FA** provides extra security (not 2fa)
2. **XSS** attacks are dangerous (not xss)
3. **DDoS** overwhelms servers (not ddos)
4. **SQL** is a database language (not sql in regular context)
5. **CRUD** operations: Create, Read, Update, Delete
6. **HTTP** and **HTTPS** for web
7. **URL** and **URI** identifiers
8. **LAN** and **WAN** networks
9. **CPU**, **GPU**, **NPU**, and **TPU** processors
10. **RAM**, **ROM**, **SSD**, and **HDD** storage

---

## Test: Plural Matching

Terms should match with an optional trailing 's' for plural forms:

1. **algorithm** and **algorithms** - Both should be linked
2. **variable** and **variables** - Both should be linked
3. **function** and **functions** - Both should be linked
4. **loop** and **loops** - Both should be linked
5. **class** and **classes** - Both should be linked (note: "classes" has different plural ending, won't match)
6. **array** and **arrays** - Both should be linked
7. **object** and **objects** - Both should be linked
8. **CPU** and **CPUs** - Both should be linked
9. **API** and **APIs** - Both should be linked
10. **LAN** and **LANs** - Both should be linked
11. **WAN** and **WANs** - Both should be linked
12. **if statement** and **if statements** - Both should be linked
13. **for loop** and **for loops** - Both should be linked
14. **data type** and **data types** - Both should be linked

**Note:** Irregular plurals won't be matched automatically (e.g., "classes" as plural of "class", "queries" as plural of "query").

---

## Test: Edge Cases

1. Should not match inside code blocks: `algorithm` `NOT` `API` `variable`
2. Should not match partial words: algorithmic, variable-length, notification
3. Should match at start of sentence: Algorithm is important. NOT is a boolean operator.
4. Should match at end of sentence: This is an algorithm. Use the NOT operator.
5. Should match with punctuation: algorithm, variable; CPU: processor.

---

## Test: Special Language Terms

### Kotlin Terms
1. **companion object** in Kotlin
2. **Elvis operator** uses ?:
3. **safe-call operator** uses ?.
4. **nullable** types with ?
5. **val** and **var** keywords

### Python Terms
1. **None** represents absence (should only match None, not none)

---

## Expected Results Summary

✅ **Should be linked:**
- **All-lowercase terms** match case-insensitively:
  - algorithm, Algorithm, ALGORITHM (any case variation)
  - variable, Variable, VARIABLE (any case variation)
  - encryption, Encryption, ENCRYPTION (any case variation)
- **Terms with ANY uppercase** match exactly (case-sensitive):
  - NOT, AND, OR (exact match only)
  - API, CPU, GPU, RAM, ROM, SSD, HDD (exact match only)
  - HTML, CSS, JSON, SQL (exact match only)
  - 2FA, XSS, DDoS (exact match only)
  - iOS, macOS, Android, Linux (exact match only)
  - JavaScript, None (exact match only)
- **Plurals** are automatically matched:
  - algorithm → algorithms, variable → variables
  - CPU → CPUs, API → APIs, LAN → LANs
  - All terms match with optional trailing 's'
  - Note: Only simple 's' plurals work (not "es", "ies", etc.)

❌ **Should NOT be linked:**
- **Wrong case for terms with uppercase:**
  - not, and, or (when term is NOT, AND, OR)
  - api, cpu, gpu, ram (when term is API, CPU, GPU, RAM)
  - html, css, json, sql (when term is HTML, CSS, JSON, SQL)
  - ios, macos, android, linux (when term is iOS, macOS, Android, Linux)
  - javascript, none (when term is JavaScript, None)
- Terms inside code blocks
- Partial word matches
- Irregular plurals (e.g., "classes" when term is "class", "queries" when term is "query")
