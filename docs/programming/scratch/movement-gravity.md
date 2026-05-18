# Gravity Movement

Gravity is a key feature of games like Flappy Bird and any type of platformer. A sprite's vertical (up/down) movement changes because of the **force of gravity** pulling it down.


```scratch-stage
stage sky #036
    arrow 0 50 150 180 #f00 2.0
    label 'Gravity' 70 -40 #f00 1.0
    sprite bird 0 50 100 90 1.0 ''
endstage
```


## Gravity Pulls You Down

To simulate gravity, a sprite needs to keep falling downwards all the time, so you'll need a **variable** to keep track of its downwards speed. We'll call this **Speed Y** since it is the y-direction speed (up/down)...

```scratch
(Speed Y)
```

Make sure you set the variable to zero when the player starts...

```scratch
define Spawn
...
set [Speed Y v] to (0)
```

In an up/down movement block, **Move Y**, we make the speed more and more negative to simulate the **downwards acceleration** due to gravity...

```scratch
define Move Y
move (Speed Y) steps
change [Speed Y v] by (-1)
```

Now the sprite will fall downwards, going quicker and quicker.

```scratch-stage
stage sky #036
    arrow -150 120  50 180 #369 1.0
    arrow  -50  90  70 180 #369 1.0
    arrow   50  40 100 180 #369 1.0
    arrow  150 -40 120 180 #369 1.0

    label '-1' -190   70 #369 1.0
    label '-2'  -90   30 #369 1.0
    label '-3'   10  -50 #369 1.0
    label '-4'  110 -150 #369 1.0

    sprite bird -150 120 100 90 1.0 ''
    sprite bird  -50  90 100 90 1.0 ''
    sprite bird   50  40 100 90 1.0 ''
    sprite bird  150 -40 100 90 1.0 ''

    label 'Speed Y increases' -100 -120 #369 1.0
endstage
```


## Boosting Back Up

In a game like Flappy Bird, or any game where the player can jump (e.g. platformers), we simulate a flap/jump by making **Speed Y** a large, **positive** value...

```scratch
define Check Keys
...
if <key [up arrow v] pressed> then
    set [Speed Y v] to (12)
end
```

This has the effect of giving the sprite a 'boost' upwards...


```scratch-stage
stage sky #036
    arrow 0 -20 120 0 #369 1.0
    label 'Speed Y: 12' 90 60 #369 1.0
    sprite bird 0 -20 100 90 1.0 ''
    keys arrows-up 1.0
endstage
```
