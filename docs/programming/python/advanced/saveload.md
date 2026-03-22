# Saving and Loading App Data

Most apps need to save data so it persists between runs - high scores, settings, player progress, and so on. Python makes this easy using files.


## Writing to a File

Use the built-in `open()`(python) function with `"w"`(python) mode to write text to a file:

```python
with open("data/scores.txt", "w") as f:
    f.write("Alice\n")
    f.write("12500\n")
```

> [!TIP]
> Always use `with open(...) as f:`(python) - this automatically closes the file when the block ends, even if something goes wrong. Never open files without `with`(python).

The `"w"`(python) mode **creates** the file if it doesn't exist, and **overwrites** it if it does. Use `"a"`(python) to append instead.


## Reading from a File

Use `"r"`(python) mode to read a file:

```python
with open("data/scores.txt", "r") as f:
    lines = f.readlines()     # list of strings, one per line

name  = lines[0].strip()     # strip() removes the trailing \n
score = int(lines[1].strip())

print(f"{name}: {score}")
```


## Saving Simple Data Values

The pattern for saving a few individual values - one per line:

```python
import os

DATA_FILE = "data/app-data.txt"

name  = "Nobody"
level = 0

def save_data() -> None:
    os.makedirs("data", exist_ok=True)     # create folder if needed

    with open(DATA_FILE, "w") as f:
        f.write(f"{name}\n")
        f.write(f"{level}\n")

def load_data() -> None:
    global name, level

    if not os.path.exists(DATA_FILE):
        return                             # no save file yet - use defaults

    with open(DATA_FILE, "r") as f:
        lines = f.readlines()

    name  = lines[0].strip()
    level = int(lines[1].strip())
```

Your `app-data.txt` save file will look like:

```
Dave
42
```


## Saving a List

To save a list of values, write one per line:

```python
import os

DATA_FILE = "data/scores.txt"

names = ["Alice", "Bob", "Charlie"]

def save_data() -> None:
    os.makedirs("data", exist_ok=True)

    with open(DATA_FILE, "w") as f:
        for name in names:
            f.write(f"{name}\n")

def load_data() -> None:
    global names

    if not os.path.exists(DATA_FILE):
        return

    with open(DATA_FILE, "r") as f:
        names = [line.strip() for line in f.readlines()]
```

For a list of integers, convert each line when reading:

```python
    with open(DATA_FILE, "r") as f:
        scores = [int(line.strip()) for line in f.readlines()]
```


## Saving with CSV

For structured data with multiple fields per row (like a leaderboard), **CSV** (comma-separated values) is a natural fit. Python's built-in `csv`(python) module handles quoting and edge cases automatically:

```python
import csv
import os

DATA_FILE = "data/leaderboard.csv"

players = [
    {"name": "Alice",   "score": 14900},
    {"name": "Bob",     "score":  8950},
    {"name": "Charlie", "score":   400},
]

def save_data() -> None:
    os.makedirs("data", exist_ok=True)

    with open(DATA_FILE, "w", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=["name", "score"])
        writer.writeheader()
        writer.writerows(players)

def load_data() -> None:
    global players

    if not os.path.exists(DATA_FILE):
        return

    with open(DATA_FILE, "r") as f:
        reader = csv.DictReader(f)
        players = [
            {"name": row["name"], "score": int(row["score"])}
            for row in reader
        ]
```

The saved `leaderboard.csv` file looks like:

```
name,score
Alice,14900
Bob,8950
Charlie,400
```

> [!NOTE]
> CSV files can be opened in Excel or Google Sheets, which is handy for checking your data.


## Saving with JSON

**JSON** is great for saving structured data like settings or nested objects. Python's built-in `json`(python) module handles it cleanly:

```python
import json
import os

DATA_FILE = "data/settings.json"

settings = {
    "volume":     80,
    "difficulty": "medium",
    "fullscreen": False,
}

def save_data() -> None:
    os.makedirs("data", exist_ok=True)

    with open(DATA_FILE, "w") as f:
        json.dump(settings, f, indent=2)

def load_data() -> None:
    global settings

    if not os.path.exists(DATA_FILE):
        return

    with open(DATA_FILE, "r") as f:
        settings = json.load(f)
```

The saved `settings.json` looks like:

```json
{
  "volume": 80,
  "difficulty": "medium",
  "fullscreen": false
}
```

> [!TIP]
> JSON preserves types (strings, numbers, booleans, lists, dicts) automatically - no manual conversion needed when reading back.


## Handling Missing Files Safely

Always check that the file exists before trying to read it - on the first run there won't be a save file yet:

```python
import os

if os.path.exists(DATA_FILE):
    load_data()
else:
    print("No save file found - starting fresh.")
```

Or wrap the load in a `try`(python)/`except`(python) to handle both a missing file and corrupted data:

```python
try:
    load_data()
except (FileNotFoundError, ValueError, KeyError):
    print("Could not load save data - starting fresh.")
```
