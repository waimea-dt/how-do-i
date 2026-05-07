# Number Base Converter

Interactive converter for learning binary, decimal, and hexadecimal number systems.

## Decimal to Binary

<convertor from="dec" to="bin" value="123" bits="8"></convertor>

## Binary to Decimal

<convertor from="bin" to="dec" value="11010110" bits="8"></convertor>

## Decimal to Hexadecimal

<convertor from="dec" to="hex" value="255" bits="8"></convertor>

## Hexadecimal to Decimal

<convertor from="hex" to="dec" value="7F" bits="8"></convertor>

## Binary to Hexadecimal

<convertor from="bin" to="hex" value="10101111" bits="8"></convertor>

## Hexadecimal to Binary

<convertor from="hex" to="bin" value="C5" bits="8"></convertor>

## Small Values (4-bit)

<convertor from="dec" to="hex" value="15" bits="4"></convertor>

## Interactive Features

- **Edit any value**: Click on the input fields to change values and see conversions update in real-time
- **Place value breakdown**: See how each digit contributes to the final value
- **Step-by-step conversion**: Follow the mathematical process for each conversion
- **Swap direction**: Use the "Swap Direction" button to reverse the conversion
- **Multiple bit widths**: Supports 4-bit and 8-bit representations

## How Conversions Work

### Decimal to Binary
1. Divide the decimal number by 2
2. Record the remainder (0 or 1)
3. Repeat with the quotient until it becomes 0
4. Read the remainders from bottom to top

### Binary to Decimal
1. Multiply each bit by its place value (power of 2)
2. Sum all the contributions

### Binary to Hexadecimal
1. Group binary digits into sets of 4 (nibbles) from right to left
2. Convert each nibble to its hexadecimal equivalent (0-F)
3. Concatenate the hex digits

### Hexadecimal to Binary
1. Convert each hex digit to its 4-bit binary equivalent
2. Concatenate all the binary groups

## Try It Yourself

Experiment with different values and conversions. Some interesting numbers to try:

- **Powers of 2**: 1, 2, 4, 8, 16, 32, 64, 128, 256
- **Pattern numbers**: 85 (binary: 01010101), 170 (binary: 10101010)
- **Max 8-bit**: 255 (binary: 11111111, hex: FF)
- **Common values**: 127, 192, 168 (IP address components)
