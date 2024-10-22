# Initial Setup

In the directory that you have created for your website, create a file called **.htaccess**

?> A **.htaccess** file is a configuration file for the **Apache web server**. It contains rules for how Apache should server files. Other web servers, such as Nginx, Tomcat, NodeJS, etc. use different methods for configuration.

Inside the .htaccess file, add the following instrustions...

```apacheconf
RewriteEngine On

RewriteBase /~username/path/to/your/website

RewriteCond %{REQUEST_FILENAME} !-d
RewriteCond %{REQUEST_FILENAME} !-f

RewriteRule ^.*$ index.php

Satisfy any
```

!> Replace **username** with your username, and the rest of the **path** should match your website directory

## What This Does

The above file tells Apache to do the following...

1. Enable **URL rewriting** - so that a file different to the one in the URL request can be returned
2. Adds conditions: If the request directory (**-d**) or file (**-f**) does not exist, then run the rules below
3. Rewrite any request that matches **^.\*$** to instead return index.php (**^** means *start* of URL, **.\*** means *any* characters, **$** means *end* of URL)
4. Finally, allow requests from all users

In other words, **all request for all URLs will be directed to the index.php file** - This will be where we put our routing code.

