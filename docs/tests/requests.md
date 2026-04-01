# Request Sequence Demos

## Static

### Simple LR

<requests>

- Left: **A**

- Right: **B**

- Requests:

    1. L ---> R : Hello!
    2. L <--- R : Hello!
    3. L ---> R : How are you?
    4. L <--- R : I'm good, thanks

</requests>

### Simple LR with Info

<requests>

- Left: **A**

- Right: **B**

- Requests:

    1. L ---> R : Hello!
    2. L   (i R : Thinks...
    3. L <--- R : Hello!
    4. L i)   R : Happy!
    5. L ---> R : How are you?
    6. L <--- R : I'm good, thanks

</requests>

### HTTP Requests

<requests>

- Left: **Web Browser**

    <i data-lucide="square-mouse-pointer" class="x-large"></i>

    The web browser is the *client*

- Right: **Web Server**

    <i data-lucide="server" class="x-large"></i>

    The web *server* services requests from the client

- Requests:

    1. L ---> R : **GET Request:** index.html
    2. L <--- R : **Response (200):** index.html
    3. L i)   R : Parses HTML
    4. L ---> R : **GET Request:** styles.css
    5. L <--- R : **Response (200):** styles.css
    6. L i)   R : Renders the page

</requests>

### Simple LMR

<requests>

- Left: **A**

- Middle: **B**

- Right: **C**

- Requests:

    1. L ---> M      R : Hello!
    2. L      M ---> R : Hello!
    3. L      M <--- R : How are you?
    4. L <--- M      R : How you are?

</requests>

### Simple LMR with Info

<requests>

- Left: **A**

- Middle: **B**

- Right: **C**

- Requests:

    1. L ---> M      R : Hello!
    2. L   (i M      R : Ponders on this
    2. L      M ---> R : Hello!
    4. L      M   (i R : Is excited!
    3. L      M <--- R : How are you?
    4. L <--- M      R : How you are?

</requests>

### Web App

<requests>

- Left: **Web Browser**

    <i data-lucide="square-mouse-pointer" class="x-large"></i>

    The web browser is the *client*

- Middle: **Web Server**

    <i data-lucide="server" class="x-large"></i>

    The *web server* services requests from the client

- Right: **DB Server**

    <i data-lucide="database" class="x-large"></i>

    The *DB server* services database requests from the web server

- Requests:

    1.  L ---> M      R : HTTP **GET** /
    2.  L   (i M      R : Matches route
    3.  L      M ---> R : SQL **SELECT**
    4.  L      M <--- R : DB **Data**
    5.  L   (i M      R : Builds page
    6.  L <--- M      R : HTTP **Response** HTML
    7.  L i)   M      R : Parses HTML
    8.  L ---> M      R : HTTP **GET** styles.css
    9.  L <--- M      R : HTTP **Response** CSS
    10. L i... M      R : Renders page

</requests>

## Animated

### Simple LR

<requests animated="true">

- Left: **A**

- Right: **B**

- Requests:

    1. L ---> R : Hello!
    2. L <--- R : Hello!
    3. L ---> R : How are you?
    4. L <--- R : I'm good, thanks

</requests>

### Simple LR with Info

<requests animated="true">

- Left: **A**

- Right: **B**

- Requests:

    1. L ---> R : Hello!
    2. L   (i R : Thinks...
    3. L <--- R : Hello!
    4. L i)   R : Happy!
    5. L ---> R : How are you?
    6. L <--- R : I'm good, thanks

</requests>

### Web App (Simple)

<requests animated="true">

- Left: **Web Browser**

    <i data-lucide="square-mouse-pointer" class="x-large"></i>

    The web browser is the *client*

- Middle: **Web Server**

    <i data-lucide="server" class="x-large"></i>

    The *web server* services requests from the client

- Right: **DB Server**

    <i data-lucide="database" class="x-large"></i>

    The *DB server* services database requests from the web server

- Requests:

    1. L ---> M      R : HTTP **GET:** route /
    2. L      M ---> R : SQL **SELECT:** required data
    3. L      M <--- R : DB **Data**
    4. L <--- M      R : HTTP **Response:** HTML of home page
    5. L ---> M      R : HTTP **GET:** styles.css
    6. L <--- M      R : HTTP **Response:** styles.css

</requests>

### Web App (Full)

<requests animated="true">

- Left: **Web Browser**

    <i data-lucide="square-mouse-pointer" class="x-large"></i>

    The web browser is the *client*

- Middle: **Web Server**

    <i data-lucide="server" class="x-large"></i>

    The *web server* services requests from the client

- Right: **DB Server**

    <i data-lucide="database" class="x-large"></i>

    The *DB server* services database requests from the web server

- Requests:

    1.  L ---> M      R : HTTP **GET** /
    2.  L   (i M      R : Matches route
    3.  L      M ---> R : SQL **SELECT**
    4.  L      M   (i R : Retrieves data
    4.  L      M <--- R : DB **Data**
    5.  L   (i M      R : Builds page
    6.  L <--- M      R : HTTP **Response** HTML
    7.  L i)   M      R : Parses HTML
    8.  L ---> M      R : HTTP **GET** styles.css
    9.  L <--- M      R : HTTP **Response** CSS
    10. L i)   M      R : Renders page

</requests>
