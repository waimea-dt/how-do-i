# Game Loops

If you are programming a game, you will generally have some wort of **game loop**. This manages the key events and actions that the game needs to make over and over again.

In a simple one-player game, this might look like:

```mermaid
flowchart TD
    A([Start]) --> B[Initialise the game: setup state, get player info, etc.]
    B --> D[Show the player the current state of the game]
    D --> E[/Get the player action/]
    E --> F[Update the game state]
    F --> G{Win state?}
    G -- Yes --> H([Game Over])
    G -- No --> D
```
