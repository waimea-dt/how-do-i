# Game Loops

If you are programming a game, you will generally have some sort of **game loop**. This manages the key events and actions that the game needs to make over and over again.


## Turn-Based Games

The simplest type of computer games are turn-based. These involve the player deciding what action to take each time round the game loop - the main loop is **blocking** and waits for the user input...

### One-Player Game

In a simple one-player game, this might look like:

```mermaid
flowchart TD
    %% Define nodes
    start([Start])
    init[Initialise game]
    loop(( ))
    show[Show game state]
    input[Get player action]
    update[Update game state]
    win{Won?}
    over([Game Over])

    %% Define links
    start --> init --> loop --> show --> input --> update --> win
    win -- Yes --> over
    win -- No --> loop
```

### Two-Player Game

When two players are playing against each other, they will **take turns** - the game needs to switch from one to the other...

```mermaid
flowchart TD
    %% Define nodes
    start([Start])
    init[Initialise game]
    player[Select first player]
    loop(( ))
    show[Show game state]
    input[Get player action]
    update[Update game state]
    switch[Switch player]
    win{Won?}
    over([Game Over])

    %% Define links
    start --> init --> player --> loop --> show --> input --> update --> win
    win -- Yes ---> over
    win -- No --> switch --> loop
```

## Real-Time Games

This type of game has a main loop that **constantly runs**, updating the game state.

User action **events** can trigger updates to the game, but the main loop **doesn't wait** for these to occur - the main loop is **non-blocking**...

```mermaid
flowchart TD
    %% Define nodes
    start([Start])
    init[Initialise game]
    loop(( ))
    event{Event?}
    process[Process event]
    update[Update game state]
    show[Show game state]
    win{Won?}
    over([Game Over])

    %% Define links
    start --> init --> loop --> update --> show --> event -- Yes --> process --> win
    event -- No --> win
    win -- Yes --> over
    win -- No --> loop
```

