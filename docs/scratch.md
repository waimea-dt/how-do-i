# The Stage

```scratch-stage
stage axes #036
    sprite ufo -100 -100 100  90 1.0 ''
    sprite ufo -100  100 100 135 0.5 ''
    sprite ufo  100  100 100   0 0.5 ''
    sprite ufo  100 -100 100  45 0.5 ''

    line  -100 -100 200   0 #fff 1.0
    line  -100  100 200  90 #fff 1.0
    arrow  100  100 200 180 #fff 1.0
endstage
```

It's a strange thing: We humans pride ourselves on being ruled by reason, yet with human civilization at stake, we chose ideology and ignorance.

```scratch-stage
stage axes #036
    square -100 -100 100  30 #fff 1.0
    square -100  100 100   0 #fff 0.5
    circle  100 -100 100     #ff0 1.0
endstage
```

What is beauty, or goodness, or art, or love, or God? We are forever teetering on the brink of the unknowable, and trying to understand what can't be understood.

```scratch-stage
stage grid #ccc
    line                     0    0  60 -90 #fff 1.0
    spriteinfo robot         0    0  50  90      1.0 ''
    sprite     strawberry -120   60  50  90      1.0 'Hey, robot! Come here and eat Me!'
    line                   -60    0  60 -90 #fff 1.0
    arrow                 -120    0  50   0 #fff 1.0

    number     3          -150  -30         #f00 1.0
    label      'START HERE'  0  -90         #369 1.0
endstage
```

Stuff your eyes with wonder, he said, live as if you'd drop dead in 10 seconds... See the world; it's more fantastic than any dream made or paid for in factories.

```scratch-stage
stage space #123
    sprite rocket2 0 0 100 45 1.0 ""
endstage
```

One of the most frightening things about your true nerd, for may people, is not that he's socially inept - because everybody's been there - but rather his complete lack of embarrassment about it.


```scratch-stage
stage water #369
    sprite turtle 0 0 100 45 1.0 ""
endstage
```

Well, all information looks like noise until you break the code.


```scratch-stage
stage none #f07
    sprite dog 0 0 100 90 1.0 'What is your name?'
    question 'Jimmy Tickles'
endstage
```



# Scratch Demos

Here is some:

```scratch
when green flag clicked
forever
    turn cw (15) degrees
    say [Hello!] for (2) seconds
    if <mouse down?> then
        change [mouse clicks v] by (1)
    end
end
```

Look at that `turn right (10) degrees`(scratch) block!

```scratch
when [space v] key pressed
say [Hello!] for (2) seconds
set [time v] to (0)
go to x:(0) y:(0)
point in direction (45)
if <mouse down?> then
    go to x:(100) y:(100)
    point in direction (0)
    if <<mouse down?> and <mouse down?>> then
        go to x:(100) y:(100)
        point in direction (0)
    else
        say [Yay!]
    end
else
    say [Boo!]
    forever
        start sound [Whoop v]
    end
end
```

Look at that `if <> then`(scratch) block!

Look at that `<(A) = (B)>`(scratch) block!

Yet across the gulf of space, minds that are to our minds as ours are to those of the beasts that perish, intellects vast and cool and unsympathetic, regarded this earth with envious eyes, and slowly and surely drew their plans against us. Look at that `repeat (10)`(scratch) block! What is beauty, or goodness, or art, or love, or God? We are forever teetering on the brink of the unknowable, and trying to understand what can't be understood. What is beauty, or goodness, or art, or love, or God? We are forever teetering on the brink of the unknowable, and trying to understand what can't be understood.



```scratch
MOTION

move (10) steps
turn cw (15) degrees
turn ccw (15) degrees

go to x:(0) y:(0)
go to [random position v]
go to [mouse-pointer v]
go to [sprite v]

glide (1) secs to x:(0) y:(0)
glide (1) secs to [random position v]
glide (1) secs to [mouse-pointer v]
glide (1) secs to [sprite v]

point in direction (90)
point towards [mouse-pointer v]
point towards [sprite v]

change x by (10)
set x to (0)
change y by (10)
set y to (0)

if on edge, bounce

set rotation style [left-right v]
set rotation style [don't rotate v]
set rotation style [all around v]

x position
y position
direction


LOOKS

say [Hello!] for (2) seconds
say [Hello!]
think [Hmm...] for (2) seconds
think [Hmm...]

switch costume to (costume v)
next costume

switch backdrop to (backdrop v)
next backdrop

change size by (10)
set size to (100)

change [color v] effect by (25)
set [color v] effect to (0)
clear graphic effects

show
hide

go to [front v] layer
go [forward v] (1) layers

costume [number v]
backdrop [number v]
size


SOUND

play sound (Meow v) until done
start sound (Meow v)
stop all sounds

change [pitch v] effect by (10)
set [pitch v] effect to (100)
clear sound effects

change volume by (-10)
set volume to (100)

volume


EVENTS

when green flag clicked

when [space v] key pressed

when this sprite clicked
when stage clicked

when backdrop switches to [backdrop1 v]
when [loudness v] > (10)
when [timer v] > (10)

when I receive [message1 v]
broadcast (message1 v)
broadcast (message1 v) and wait


CONTROL

wait (1) seconds

repeat (10)
end

forever
end

if <> then
end

if <> then
else
end

wait until <>

repeat until <>
end

stop [all v]
stop [this script v]
stop [other scripts in sprite v]

when I start as a clone
create clone of (myself v)
delete this clone


SENSING

touching (mouse-pointer)?
touching color (#ff0)?
color (#f00) is touching (#369)?

distance to (mouse-pointer v)

ask [What's your name?] and wait
answer

key (space v) pressed?
mouse down?
mouse x
mouse y

set drag mode [draggable v]

loudness
timer

reset timer

[backdrop# v] of (Stage v)

current [year v]
days since 2000

username


OPERATORS

() + ()
() - ()
() * ()
() / ()

pick random (1) to (10)

() > (50)
() = (50)
() < (50)

<> and <>
<> or <>
not <>

join [apple] [banana]
letter (1) of [apple]
length of [apple]
[apple] contains [a]?

() mod ()
round ()
[abs v] of ()


VARIABLES

(my variable)

set [my variable v] to (0)
change [my variable v] by (1)

show variable [my variable v]
hide variable [my variable v]


LISTS

(my list)

add [thing] to [my list v]

delete (1) of [my list v]
delete all of [my list v]

insert [thing] at (1) of [my list v]
replace item (1) of [my list v] with [thing]

show list [my list v]
hide list [my list v]

item (1) of [my list v]
item # of [thing] in [my list v]
length of [my list v]
[my list v] contains [thing]?


MY BLOCKS

define My Block

My Block

define My Block (number) <test> [message]
if <test> then
    say (message)
else
    say (number)
end


PEN

erase all

stamp

pen down
pen up

set pen color to (#0f0)
set pen (color v) to (50)
change pen (color v) by (10)

set pen size to (1)
change pen size by (1)


VIDEO

when video motion > (10)

video (motion v) on (sprite v)
video (direction v) on (sprite v)

turn video (on v)

set video transparency to (50)


TTS

speak [Hello]

set voice to (alto v)

set language to (English v)


MUSIC

play drum (snare drum v) for (0.25) beats

rest for (0.25) beats

play note (60) for (0.25) beats

set instrument to (piano v)

set tempo to (60)

change tempo by (20)

tempo


TRANSLATE

translate [Hello] to (French v)

language



MISC


...


say [Hello!] // Greet the user

```

