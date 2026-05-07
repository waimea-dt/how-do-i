# File List Demos

## Just Files

<filetree>

- One
- Two
- Three

</filetree>

## Folder and File

<filetree>

- Folder
    - One
    - Two
    - Three

</filetree>

## Nested Folders and Files

<filetree>

- project
    - app
        - __init__.py
        - static
            - css
                - styles.css
            - images
                - icon.svg
                - logo.svg
        - templates
            - components
                - nav.jinja
                - messages.jinja
            - pages
                - base.jinja
                - home.jinja
                - user.jinja
    - README.md
    - requirements.txt

</filetree>

## With Highlighting

<filetree>

- project
    - !! app
        - __init__.py
        - static
            - css
                - styles.css
            - images
                - icon.svg
                - logo.svg
        - templates
            - components
                - nav.jinja
                - messages.jinja
            - pages
                - base.jinja
                - home.jinja
                - user.jinja
    - README.md
    - requirements.txt

</filetree>


<filetree>

- project
    - app
        - __init__.py
        - static
            - !! css
                - styles.css
            - images
                - !! icon.svg
                - logo.svg
        - templates
            - components
                - nav.jinja
                - messages.jinja
            - !! pages
                - base.jinja
                - home.jinja
                - user.jinja
    - README.md
    - requirements.txt

</filetree>

## Nested Highlighting

<filetree>

- project
    - !! app
        - !! __init__.py
        - static
            - !! css
                - styles.css
            - images
                - !! icon.svg
                - logo.svg
        - !! templates
            - components
                - nav.jinja
                - messages.jinja
            - !! pages
                - base.jinja
                - home.jinja
                - user.jinja
    - README.md
    - !! requirements.txt

</filetree>
