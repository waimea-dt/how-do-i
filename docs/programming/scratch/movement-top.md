# Top-Down Movement

This type of movement is great for space games, boat games, or any other game that shows the player from above.


```scratch-stage
stage water #036
    arrow 0 0 140 225 #ff0 1.0
    arrow 0 0 120  45 #fff 0.6
    arrow 0 0 100 170 #fff 0.6
    arrow 0 0 100 280 #fff 0.6

    sprite turtle 0 0 100 225 1.0 ''

    keys arrows-up 1.0
endstage
```


## Simple Movement

In this style of movement, the player can go **forwards/back** and **turn left/right**...

```scratch
define Check Keys and Move
if <key [up arrow v] pressed> then
    move (10) steps  // Move the sprite forwards
end
if <key [down arrow v] pressed> then
    move (-10) steps  // Move it backwards
end
if <key [left arrow v] pressed> then
    turn ccw (15) degrees
end
if <key [right arrow v] pressed> then
    turn cw (15) degrees
end
```

A press of the key makes the sprite move...


This has the effect of giving the sprite a 'boost' upwards...


```scratch-stage
stage space #036
    arrow 50 50 120 225 #39f 1.0
    label 'Move: 10 steps' -50 -70 #369 1.0
    sprite rocket2 50 50 100 225 1.0 ''
    keys arrows-up 1.0
endstage
```


## More Realistic Movement with 'Weight'

If you want your sprite to feel like it has some '**weight**' and doesn't start/stop instantly, you will need to define a **variable** to track its **speed** - this will allow it to keep moving even when the user is not pressing any keys.


```scratch
(Speed)
```

Make sure you set the variable to zero when the player starts...

```scratch
define Spawn
...
set [Speed v] to (0)
```

Instead of moving the sprite forward/back with the keys directly, you will instead **adjust the speed variable**...

```scratch
define Check Keys
if <key [up arrow v] pressed> then
    change [Speed v] by (1)  // No movement, just change speed variable
end
if <key [down arrow v] pressed> then
    change [Speed v] by (-1)  // Negative change to slow down
end
if <key [left arrow v] pressed> then
    turn ccw (15) degrees
end
if <key [right arrow v] pressed> then
    turn cw (15) degrees
end
```

... and do that actual sprite movement in a **separate move block**...

```scratch
define Move
move (Speed) steps  // Use the variable for moving
```

The amount of steps the sprite moves forward is controlled by the Speed variable...


```scratch-stage
stage space #036
    arrow 50 50 120 225 #fb0 1.0
    label 'Move: Speed steps' -80 -70 #d90 1.0
    sprite rocket2 50 50 100 225 1.0 ''
    keys arrows-up 1.0
    label 'Speed: +1' 150 -40 #c60 1.0
endstage
```


### Adding Friction to Make Things Slow Down
You can add some '**friction**' to the movement by making the speed variable get a little smaller each step - this has the effect of gradually bringing the sprite to a stop...

```scratch
define Move
move (Speed) steps
set [Speed v] to ((Speed) * (0.9))  // Friction reduces speed
```

The Speed value gradually reduces...

```scratch-stage
stage space #036
    sprite rocket2  100  100 80 225 0.3 ''
    sprite rocket2   40   40 80 225 0.3 ''
    sprite rocket2  -10  -10 80 225 0.3 ''
    sprite rocket2  -50  -50 80 225 0.3 ''
    sprite rocket2  -80  -80 80 225 0.3 ''
    sprite rocket2 -100 -100 80 225 0.3 ''
    sprite rocket2 -110 -110 80 225 1.0 ''
endstage
```


