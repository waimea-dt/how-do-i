# Including and Requiring Other PHP Files

TODO: Finish this page with some examples

## Include

Use `include` or `include_once` for scripts that **should** be included, but it is not critical if they are missing...

```php
include 'another-script.php';
include_once 'another-script.php';
```

## Require

Use `require` or `require_once` for scripts that **must** be included...

```php
require 'another-script.php';
require_once 'another-script.php';
```

