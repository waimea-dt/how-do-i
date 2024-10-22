# Loading Views

Now we have our views setup, we need to select the correct view for the route, and load it in the page template.

In your **index.php** routing code, add this to the bottom...

```php
// Select view based on the route
switch ($route) {
    case '':
        $view = 'home.php';
        break;

    case 'about':
        $view = 'about.php';
        break;

    case 'contact':
        $view = 'contact.php';
        break;

    default:
        http_response_code(404);
        $view = '404.php';
}

// Load the layout template and show the view content
require VIEWS . '_layout.php';
```

The routing system should now work, and you should be able to navigate between pages / views.


