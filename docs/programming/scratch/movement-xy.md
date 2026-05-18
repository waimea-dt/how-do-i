# X-Y Movement

This type of movement is common in a lot of games. The player can move up/down/left/right.


```scratch-stage
stage grid #036
    arrow 0 0 120   0 #ff0 1.0
    arrow 0 0 120  90 #fff 0.6
    arrow 0 0 120 180 #fff 0.6
    arrow 0 0 120 270 #fff 0.6
    sprite astronaut 0 0 100 90 1.0 ''
    keys arrows-up 1.0
endstage
```

The sprite is simply moved when the relevant key is pressed...

```scratch
define Check Keys
if <key [up arrow v] pressed> then
    change y by (10)
end
if <key [down arrow v] pressed> then
    change y by (-10)
end
if <key [left arrow v] pressed> then
    change x by (-10)
end
if <key [right arrow v] pressed> then
    change x by (10)
end
```

