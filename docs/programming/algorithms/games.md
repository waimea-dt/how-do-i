# Game Loops

If you are programming a game, you will generally have some wort of **game loop**. This manages the key events and actions that the game needs to make over and over again.

In a simple one-player game, this might look like:

```mermaid
flowchart TD
    %% Define nodes
    start([Start])
    init[Initialise game]
    loop(( ))
    show[Show game state]
    input[/Get player action/]
    update[Update game state]
    win{Won?}
    over([Game Over])

    %% Define links
    start --> init --> loop --> show --> input --> update --> win
    win -- Yes --> over
    win -- No --> loop
```
