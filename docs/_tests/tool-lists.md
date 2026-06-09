# Tool Lists Test

Test page for the tool-lists plugin that adds semantic classes to lists of tools and resources.

## Usage

Add `<!-- tools -->` comment before any heading that precedes a tool list:

```markdown
<!-- tools -->
## Python IDEs

- [Thonny](https://thonny.org/)
    - **Recommended**
    - **Beginner friendly**
    - Simple interface
```

## Metadata Keywords

The following bold keywords are automatically converted to classes:

| Keyword | Class | Styling |
|---------|-------|---------|
| **Recommended** | `recommended` | Green border + star icon |
| **Free** | `free` | Blue border |
| **Paid** / **Premium** / **Pro** | `paid` / `premium` / `pro` | Amber border |
| **Beginner friendly** | `beginner-friendly` | Teal border |
| **Open Source** | `open-source` | - |
| **Beta** / **Alpha** / **Experimental** | `beta` / `alpha` / `experimental` | Purple border |
| **Deprecated** | `deprecated` | Red border + badge |
| **Commercial** / **Enterprise** | `commercial` / `enterprise` | - |
| **Community Edition** | `community-edition` | - |

---

<!-- tools -->
## Example: Code Editors

- [Visual Studio Code](https://code.visualstudio.com/)
    - **Recommended**
    - **Free**
    - **Open Source**
    - Very popular and powerful
    - 1000s of extensions to customise it
    - Built-in Git support

- [Sublime Text](https://www.sublimetext.com/)
    - **Paid**
    - Fast and lightweight
    - Great for quick edits
    - Purchase required for continued use

- [Atom](https://atom.io/)
    - **Deprecated**
    - **Free**
    - Open source editor by GitHub
    - Archived in 2022

- [Nova](https://nova.app/)
    - **Paid**
    - Mac only
    - Beautiful native design
    - $99 one-time purchase

---

<!-- tools -->
## Example: Python IDEs

- [Thonny](https://thonny.org/)
    - **Recommended**
    - **Beginner friendly**
    - **Free**
    - Simple interface
    - Built-in debugger with variable view
    - Perfect for learning Python

- [PyCharm Community Edition](https://www.jetbrains.com/pycharm/)
    - **Free**
    - Professional IDE from JetBrains
    - Free Community Edition available
    - Excellent for larger Python projects

- [PyCharm Professional](https://www.jetbrains.com/pycharm/)
    - **Paid**
    - **Pro**
    - Full-featured professional version
    - Web development support
    - Database tools included

- [Spyder](https://www.spyder-ide.org/)
    - **Free**
    - Scientific Python IDE
    - Good for data analysis
    - Variable explorer
    - Integrated with Anaconda

---

<!-- tools -->
## Example: Experimental Tools

- [Zed Editor](https://zed.dev/)
    - **Beta**
    - Clean, fast and modern
    - GPU-accelerated
    - Collaborative editing
    - Still in active development

- [Helix](https://helix-editor.com/)
    - **Experimental**
    - **Free**
    - Terminal-based modal editor
    - Built in Rust
    - Vim-like but modernized

---

<!-- tools -->
## Example: Game Engines

- [Unity](https://unity.com/)
    - **Recommended**
    - **Free**
    - Cross-platform 3D engine
    - Free for students and hobbyists
    - Industry standard for mobile games

- [Unreal Engine](https://www.unrealengine.com/)
    - **Free**
    - Cutting-edge graphics
    - AAA game quality
    - 5% royalty after $1M revenue

- [Godot](https://godotengine.org/)
    - **Recommended**
    - **Free**
    - **Open Source**
    - Lightweight and efficient
    - MIT licensed
    - Great for 2D games

- [GameMaker Studio 2](https://gamemaker.io/)
    - **Beginner friendly**
    - **Paid**
    - Excellent for 2D games
    - Drag-and-drop interface
    - GML scripting language

- [CryEngine](https://www.cryengine.com/)
    - **Free**
    - Known for stunning graphics
    - Steep learning curve
    - 5% royalty on revenue

---

## Regular List (no marker)

This list should NOT be styled as a tool list:

- Regular list item
    - Sub-item one
    - Sub-item two
- Another item
    - **Bold text** here won't create classes
    - Because this isn't marked as a tool list

---

## CSS Classes Reference

### List Container Classes
- `.tool-list` - Added to UL elements following `<!-- tools -->` comments

### List Item Classes
- `.has-metadata` - Added to LI elements that have metadata badges
- `.recommended` - Recommended tools (green border, star icon)
- `.free` - Free tools (blue border)
- `.paid`, `.premium`, `.pro` - Paid tools (amber border)
- `.beginner-friendly` - Beginner-friendly tools (teal border)
- `.open-source` - Open source tools
- `.beta`, `.alpha`, `.experimental` - Experimental tools (purple border)
- `.deprecated` - Deprecated tools (red border, badge)
- `.commercial`, `.enterprise` - Commercial/enterprise tools
- `.community-edition` - Community edition tools

### Sub-list Classes
- `.metadata-badge` - Added to sub-list items that contain metadata keywords
