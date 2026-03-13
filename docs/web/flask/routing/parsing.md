# Parsing the URL

This coode should be placed into your **index.php** file. It breaks apart the request URL to work out which route the user is requesting...

```php
// From the URL of this script, obtain the base URL for all links
define('SITE_BASE', dirname($_SERVER['SCRIPT_NAME']));

// Trim off the base URL from the start of request to give a realtive URL
$relativeURL = substr($_SERVER['REQUEST_URI'], strlen(SITE_BASE));

// Get the first term from this URL - this defines the route
$route = strtok($relativeURL, '/');
```

If you add the following debug code, you should see what is happening...

```php
echo '<p>URL requested: '        . $_SERVER['REQUEST_URI'];
echo '<p>Base part of URL: '     . SITE_BASE;
echo '<p>Relative part of URL: ' . $relativeURL;
echo '<p>Route requested: '      . $route;
```

You can hopefully see how the URL has been proken up ready to use for routing.
