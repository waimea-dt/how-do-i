# Binary Calculator

Interactive calculator for exploring binary arithmetic and bitwise operations with visual feedback.

## Arithmetic Operations

### Addition

<calculator>01100100 + 01111011</calculator>

### Subtraction

<calculator>11001000 - 01001011</calculator>

## Bitwise Operations

### AND Operation

<calculator>10101010 and 01010101</calculator>

### OR Operation

<calculator>10101010 or 01010101</calculator>

### XOR Operation

<calculator>10101010 xor 01010101</calculator>

### NOT Operation

<calculator>not 10101010</calculator>

## Shift Operations

### Left Shift

<calculator>00000101 << 2</calculator>

### Logical Right Shift

<calculator>10100000 >> 2</calculator>

### Arithmetic Right Shift

<calculator>10100000 >>> 2</calculator>

## Two's Complement

### Negation

<calculator>neg 00101010</calculator>

## Interactive Features

- **Edit values**: Click on any input to change values and see results update instantly
- **Binary visualization**: See the bit-by-bit representation of each value
- **Signed/Unsigned**: View both interpretations of the same bit pattern
- **Carry & Overflow flags**: Understand when operations exceed bit limits
- **Step-by-step explanations**: Follow how each operation works

## Understanding the Operations

### Addition & Subtraction
- **Carry flag**: Set when the result exceeds the maximum unsigned value
- **Overflow flag**: Set when signed arithmetic result is incorrect (e.g., positive + positive = negative)
- Addition is bit-by-bit with carry propagation
- Subtraction uses two's complement: A - B = A + (-B)

### Bitwise Operations
- **AND**: Result bit is 1 only if both input bits are 1
- **OR**: Result bit is 1 if either input bit is 1
- **XOR**: Result bit is 1 if input bits are different
- **NOT**: Inverts each bit (0→1, 1→0)

### Shift Operations
- **Left shift**: Multiplies by 2 for each position (fills with 0s on right)
- **Logical right shift**: Divides by 2 (fills with 0s on left)
- **Arithmetic right shift**: Divides by 2 preserving sign (fills with sign bit)

### Two's Complement
Used for representing signed integers:
1. Invert all bits (NOT operation)
2. Add 1 to the result

This gives the negative of a number in signed representation.

## Mixed Format Examples

You can mix decimal and binary formats in the same expression:

### Decimal + Binary

<calculator>127 + 00000001</calculator>

### Binary AND Decimal

<calculator>11111111 and 170</calculator>

### Large Shift Amount

<calculator>00000001 << 7</calculator>

### XOR with Decimal

<calculator>11110000 xor 255</calculator>

## Try These Examples

### Detecting Overflow
Try adding: 127 + 1 (with 8 bits) - See how positive + positive can give a "negative" in signed representation

### Pattern Recognition
- AND with 255 (0xFF): Keeps all bits unchanged
- AND with 0: Clears all bits to 0
- OR with 255: Sets all bits to 1
- XOR with 255: Inverts all bits (same as NOT)

### Powers of Two
Notice how left shifting by N positions multiplies by 2^N
- 1 << 3 = 8
- 5 << 2 = 20

### Signed vs Unsigned
The bit pattern 10000000 (128) represents:
- **Unsigned**: 128
- **Signed**: -128

Both are correct - it depends on interpretation!
