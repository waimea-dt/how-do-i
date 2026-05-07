# Logical Operations

## Logic Gates

### Simple

```logic
gate 10   AND  A B ''
gate ON   OR   A B ''
gate TF   NOT  A   ''
gate YN   XOR  A B ''
gate 5V   NAND A B ''
gate Tick NOR  A B ''
```

### Simple with Initial Values

```logic
gate 10   AND  A+ B+ ''
gate ON   OR   A  B+ ''
gate TF   NOT  A+    ''
gate YN   XOR  A  B+ ''
gate 5V   NAND A+ B+ ''
gate Tick NOR  A+ B  ''
gate Tick NOR  +  '' ''
```

### No Style Values (style 'None')

```logic
gate None AND
gate None AND A B Out
gate None AND A B ''
gate None AND '' '' ''
```

### Raw Gate (style 'Raw')

```logic
gate Raw AND
gate Raw AND A B Out
gate Raw AND A B ''
gate Raw AND '' '' ''
```

### Hidden Gate (style 'Hide')

```logic
gate Hide AND
gate Hide AND A B Out
gate Hide AND A B ''
gate Hide AND '' '' ''
```

### Code Logic Demo

```logic
gate YN AND 'age >= 18' 'sober?' 'Allowed In'
```

## Logic Tables

### Simple

```logic
table 10 AND
table 10 OR
table 10 NOT
table 10 XOR
table 10 NAND
table 10 NOR
table 10 NOP1
table 10 NOP2
table 10 NOP3
```

### Three Inputs

```logic
table 10 AND3
table 10 OR3
table 10 XOR3
```

### Named Inputs / Output

```logic
table 10 AND In1 In2 Out
table 10 OR  In1 In2 Out
table 10 NOT In Out
table 10 AND3 In1 In2 In3 Out
table YN AND 'age >= 18' 'sober?' 'Allowed In'
```

### Different Styles

```logic
table YN    XOR
table ON    XOR
table TF    XOR
table 5V    XOR
table HL    XOR
table Cross XOR
table Tick  XOR
table Dot   XOR
```

## Gate and Table (with Table Highlighting)

```logic
gate  ON AND  A B Out
table ON AND  A B Out
```

```logic
gate  ON NOT  A Out
table ON NOT  A Out
```

```logic
gate  ON AND  A+ B+ Out
table ON AND  A  B  Out
```

```logic
gate  ON NOT  A+ Out
table ON NOT  A  Out
```
