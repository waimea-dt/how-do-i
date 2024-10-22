# Route Parameters

In a URL, the **route** is the first part of the URL after the base URL of the site...

So, if your site base is **dt.waimea.school.nz/~cpy/routing**, and the requested URL is **dt.waimea.school.nz/~cpy/routing/about**, then the route is **about**.

Any other parts to the URL are considered **parameters**, or data values to be used by the view...

To extract the parameter parts, update the code in **index.php**..

```php
// Get the first term from this URL - this defines the route
$route = strtok($relativeURL, '/');

// Other terms define any parameters
$params = [];
$param = strtok('/');
while ($param !== false) {
    $params[] = $param;
    $param = strtok('/');
}
```
