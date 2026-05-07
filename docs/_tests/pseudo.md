# PseudoCode

## Basic Statements

### Output

```pseudo
display "Hello, world!"
print "Hello, world!"
show "Hello, world!"
say "Hello, world!"
output "Hello, world!"
```

### Input

```pseudo
get name
ask "Enter your name: " name
read age
input score
```

### Assignment

```pseudo
score = 0
name = "Steve"
total = price * quantity
average = total / count
```

### Comments

```pseudo
// This is a comment
# This is also a comment
```


## Decisions

### If / Endif

```pseudo
if score > 100 then
    display "High score!"
endif
```

### If / Else / Endif

```pseudo
if age >= 18 then
    display "Adult"
else
    display "Minor"
endif
```

### Nested If

```pseudo
if score >= 90 then
    display "A grade"
elseif score >= 70 then
    display "B grade"
elseif score >= 50 then
    display "C grade"
else
    display "Fail"
endif
```


## Loops

### Repeat / Until

```pseudo
repeat
    get guess
until guess = secret
```

### While / Endwhile

```pseudo
while count < 10
    display count
    count = count + 1
endwhile
```

### For / Next

```pseudo
for i = 1 to 10
    display i
next i
```

### Forever

```pseudo
forever
    get input
    display input
end
```


## Functions and Procedures

### Simple Function

```pseudo
start greet (name)
    display "Hello, " + name
end
```

### With Return

```pseudo
start add (a, b)
    return a + b
end
```

### Calling Functions

```pseudo
start main
    result = call add (10, 5)
    display result
end
```


## Algorithms

### Find the Largest Number

```pseudo
// Find the largest number in a list
start findLargest (list)
    set largest = first value in list

    repeat until end of list
        look at next number in list

        if number > largest then
            set largest = number
        endif
    endrepeat

    return largest
end
```

### Countdown (Recursive)

```pseudo
start countdown (n)
    if n = 0 then
        display "Blast off!"
        return
    endif

    display n

    call countdown (n - 1)
end
```

### Linear Search

```pseudo
start linearSearch (list, target)
    for i = 0 to length of list - 1
        if list[i] = target then
            return i
        endif
    next i

    return -1   // not found
end
```

### Bubble Sort

```pseudo
start bubbleSort (list)
    repeat
        swapped = false

        for i = 0 to length of list - 2
            if list[i] > list[i + 1] then
                swap list[i] and list[i + 1]
                swapped = true
            endif
        next i

    until swapped = false
end
```
