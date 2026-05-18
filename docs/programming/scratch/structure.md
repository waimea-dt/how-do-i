# Project Structure

Break your project down into bite-size chunks using 'My Blocks'. This way you can work on one piece at a time.

First setup the pieces you need. Most will be in the main game loop...


```scratch
when green flag clicked
Spawn  // Setup the sprite
forever  // This is the main game loop
    Check Keys  // Has the user pressed any keys
    Move  // Move the sprite
    Check for Win  // Finished the game/level?
    Check for Impact  // Have we been hit?
end
```

Then you can work on the blocks one-by-one...


```scratch
define Spawn  // Custom block that sets up the sprite
go to x:(0) y:(0)
point in direction (90)
set size to (100)
set [Speed v] to (0)
show
```

```scratch
define Check Keys  // Custom block that checks for key presses
...
```

```scratch
define Move  // Custom block that moves the sprite
...
```

And so on...