# Big-O Algorithm Complexity Explorer

Compare the computational effort of different algorithms as N increases.

## Interactive Comparison

Toggle algorithms on/off to see how their complexity grows with N. Notice how factorial and exponential algorithms become impractical very quickly, while logarithmic and linear algorithms remain manageable.

<big-o></big-o>

## Extended Range (N up to 25)

<big-o algos="search" max="25"></big-o>

## Sorting Algorithms Only

Focus on comparing different sorting approaches:

<big-o algos="sort"></big-o>

## Search Comparisons

Compare linear vs binary search performance:

<big-o algos="search" enabled="search-linear" max="15"></big-o>

## Using Category IDs

You can use category IDs instead of listing individual algorithms. Mix categories and specific algorithm IDs:

<big-o algos="search sort array" max="20"></big-o>

Available category IDs: `array`, `stack`, `search`, `sort`, `graph`, `tsp`, `knap`, `pack`, `crypt`

## Complex Problems

Comparing brute force vs heuristic approaches:

<big-o algos="tsp knap" enabled="tsp-nearest knap-greedy"></big-o>

## Step Feature: Incremental

Using `step="5"` to show N values at intervals of 5 (1, 5, 10, 15, 20, ...):

<big-o algos="search sort" step="5" max="50"></big-o>

## Step Feature: Doubling

Using `step="x2"` to show exponentially increasing N values (1, 2, 4, 8, 16, 32, ...):

<big-o algos="search sort" step="x2" max="1024"></big-o>

## Step Feature: Quintupling

Using `step="x5"` for rapid growth (1, 5, 25, 125, ...):

<big-o algos="search-linear sort-merge knap-dynamic" step="x5" max="1000"></big-o>

## Intractable Problems

Prime factorisation, AES brute force, and TSP brute force - notice how quickly they become intractable:

<big-o algos="crypt-rsa-gnfs crypt-aes tsp-brute" step="5" max="100"></big-o>

## Cryptography Evolution

Compare classical ciphers (trivial to break) with modern encryption (intractable):

<big-o algos="crypt-cae crypt-vigenere crypt-vigenere-freq crypt-enigma crypt-enigma-late crypt-des crypt-rsa crypt-rsa-gnfs crypt-aes" max="128" step="8"></big-o>

## DES to AES: Why Key Length Matters

DES (56-bit) was cracked in 1998. AES (128/256-bit) remains secure. Same algorithm complexity, vastly different security:

<big-o algos="crypt-des crypt-aes" max="128" step="8"></big-o>

## RSA vs AES Security

Cracking RSA uses sub-exponential factorization (easier than AES brute force), which is why RSA needs larger keys:

<big-o algos="crypt-rsa-gnfs crypt-aes" max="2048" step="x2"></big-o>

## Cryptography at Scale

Comparing cryptographic brute force attacks with doubling steps:

<big-o algos="crypt-rsa crypt-aes" max="128" step="x2"></big-o>

## Best, Average, and Worst Case Complexity

Understanding how algorithms behave in different scenarios. Notice how some algorithms (like Binary Search) have the same best and worst case, while others (like Insertion Sort) vary dramatically:

<big-o best-worst algos="array" max="100" step="10"></big-o>

<big-o best-worst algos="search" max="100" step="10"></big-o>

<big-o best-worst algos="sort" max="100" step="10"></big-o>
