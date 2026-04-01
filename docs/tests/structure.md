# Structure Demos

## Web Server

### Simple

<structure>

- Web Server

    - Server Application
    - Programming Language
    - Web Framework
    - Database Management

</structure>

### With Notes

<structure>

- Web Server

    A web server is a computer running software that 'serves up' web pages when it receives requests. These requests come from web browsers, the 'clients'.

    Often, web servers run a combination of applications...

    - Server Application

        Server software does the actual work of listening for **HTTP requests** and then sending back **HTML responses** over **HTTP**.

        Examples of web servers in common use: *Gunicorn, Nginx, Apache*

    - Programming Language

        Web applications often need to **run code** on the '**back-end**' that analyses each HTTP request, checks system state, checks data in a database, etc., before then building the HTML response.

        Examples of back-end languages in common use: *Python, JS, PHP, Go*

    - Web Framework

        A web framework is a **library of code** used by the programming language to perform common tasks such as analysing HTTP requests (e.g. matching routes), handling user authentication, accessing databases, etc.

        Examples of web frameworks in common use: *Flask (Python), Django (Python), Express (JS), React (JS), Laravel (PHP)*

    - Database Management

        Most web applications require data to be stored and later accessed (e.g. user details, items in a to-do list, store products, etc.). A **database management System (DBMS)** provides this functionality. It might run as apart of the web server, or might be running elsewhere.

        Examples of DBMSs in common use: *PostgreSQL, MySQL, SQLite*

</structure>

### Depth Coloured

<structure colouring="depth">

- Web Server

    A web server is a computer running software that 'serves up' web pages when it receives requests. These requests come from web browsers, the 'clients'.

    Often, web servers run a combination of applications...

    - Server Application

        Server software does the actual work of listening for **HTTP requests** and then sending back **HTML responses** over **HTTP**.

        Examples of web servers in common use: *Gunicorn, Nginx, Apache*

    - Programming Language

        Web applications often need to **run code** on the '**back-end**' that analyses each HTTP request, checks system state, checks data in a database, etc., before then building the HTML response.

        Examples of back-end languages in common use: *Python, JS, PHP, Go*

    - Web Framework

        A web framework is a **library of code** used by the programming language to perform common tasks such as analysing HTTP requests (e.g. matching routes), handling user authentication, accessing databases, etc.

        Examples of web frameworks in common use: *Flask (Python), Django (Python), Express (JS), React (JS), Laravel (PHP)*

    - Database Management

        Most web applications require data to be stored and later accessed (e.g. user details, items in a to-do list, store products, etc.). A **database management System (DBMS)** provides this functionality. It might run as apart of the web server, or might be running elsewhere.

        Examples of DBMSs in common use: *PostgreSQL, MySQL, SQLite*

</structure>

## Single Container

<structure>

- One

    Ordering matter was the sole endeavor of Life, whether it was a jumble of self-replicating molecules in the primordial ocean, or a steam-powered English mill turning weeds into clothing.

</structure>

## Single Container, No Notes

<structure>

- Top-Level

</structure>

## Sub-Containers

### Ordered

<structure>

- Top-Level

    1. First Block
    2. Second Block

</structure>

### Unordered

<structure>

- Top-Level

    - First Block
    - Second Block

</structure>

## Sub-Containers, with Notes

### Ordered

<structure>

- Top-Level

    1. First Block

        Isn't it enough to see that a garden is beautiful without having to believe that there are fairies at the bottom of it too?

    2. Second Block

        Man has gone out to explore other worlds and other civilizations without having explored his own labyrinth of dark passages and secret chambers, and without finding what lies behind doorways that he himself has sealed.

</structure>

### Unordered

<structure>

- Top-Level

    - First Block

        Isn't it enough to see that a garden is beautiful without having to believe that there are fairies at the bottom of it too?

    - Second Block

        Man has gone out to explore other worlds and other civilizations without having explored his own labyrinth of dark passages and secret chambers, and without finding what lies behind doorways that he himself has sealed.

</structure>

## Sub-Containers, with Notes Everywhere

<structure>

- Top-Level

    As nightmarishly lethal, memetically programmed death-machines went, these were the nicest you could ever hope to meet.

    - First Block

        Isn't it enough to see that a garden is beautiful without having to believe that there are fairies at the bottom of it too?

    - Second Block

        Man has gone out to explore other worlds and other civilizations without having explored his own labyrinth of dark passages and secret chambers, and without finding what lies behind doorways that he himself has sealed.

</structure>

## Three Deep

### Ordered

<structure>

- Top-Level

    1. First Block

        - Inside Block 1
        - Inside Block 2
        - Inside Block 3

    2. Second Block

        - Inside Block 1

</structure>

### Unordered

<structure>

- Top-Level

    - First Block

        - Inside Block 1
        - Inside Block 2
        - Inside Block 3

    - Second Block

        - Inside Block 1

</structure>

## Four Deep

<structure>

- Top-Level

    - First Block

        - Inside Block 1

        - Inside Block 2

            Men who believe that they are accomplishing something by speaking speak in a different way from men who believe that speaking is a waste of time.

        - Inside Block 3

    - Second Block

        - Inside Block 1

            - Inside Inside Block A

                In this age of enlightenment, the soothsayer and astrologer flourish; as science pushes forward, ignorance and superstition gallop around the flanks and bite science in the rear with big dark teeth.

            - Inside Inside Block B

</structure>

## Five Deep

<structure>

- Top-Level

    - First Block

        - Inside Block 1

        - Inside Block 2

            Men who believe that they are accomplishing something by speaking speak in a different way from men who believe that speaking is a waste of time.

        - Inside Block 3

    - Second Block

        - Inside Block 1

            - Inside Inside Block A

                In this age of enlightenment, the soothsayer and astrologer flourish; as science pushes forward, ignorance and superstition gallop around the flanks and bite science in the rear with big dark teeth.

            - Inside Inside Block B

                - Here
                - There
                - Everywhere

</structure>

## Five Deep (Depth Coloured)

<structure colouring="depth">

- Top-Level

    - First Block

        - Inside Block 1

        - Inside Block 2

            Men who believe that they are accomplishing something by speaking speak in a different way from men who believe that speaking is a waste of time.

        - Inside Block 3

    - Second Block

        - Inside Block 1

            - Inside Inside Block A

                In this age of enlightenment, the soothsayer and astrologer flourish; as science pushes forward, ignorance and superstition gallop around the flanks and bite science in the rear with big dark teeth.

            - Inside Inside Block B

                - Here
                - There
                - Everywhere

</structure>

## With Highlighting

### Inner Item Highlighted

<structure>

- Top-Level

    - First Block

        - !! Inside Block 1

            Men who believe that they are accomplishing something by speaking speak in a different way from men who believe that speaking is a waste of time.

        - Inside Block 2

</structure>

### Outer Item Highlighted

<structure>

- Top-Level

    - !! First Block

        - Inside Block 1

            Men who believe that they are accomplishing something by speaking speak in a different way from men who believe that speaking is a waste of time.

        - Inside Block 2

</structure>
