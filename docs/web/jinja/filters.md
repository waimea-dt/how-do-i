# Filters

Filters transform values in templates. They are used by adding the filter name after a data value, with a '|' symbol between:

```jinja2
<p>{{ username | upper }}</p>
<p>{{ bio | truncate(80) }}</p>
<p>{{ created_at | default('Unknown') }}</p>
```

The full set of filters available can be found in the [Jinja Docs](https://jinja.palletsprojects.com/en/stable/templates/#builtin-filters), but some common ones are shown below...

## Common Filters

### Filters for Single Values:

In these examples:
- `text = "for the LOLZ"`(python)
- `spaces = "   for the LOLZ   "`(python)
- `tagged = "for the <em>LOLZ</em>"`(python)
- `nothing = None`(python)

| Filter              | Action                             | Value                               | Result         |
| ------------------- | ---------------------------------- | ----------------------------------- | -------------- |
| `upper`             | uppercase all                      | `{{ text \| upper }}`(jinja2)       | `"FOR THE LOLZ"`(python) |
| `lower`             | lowercase all                      | `{{ text \| lower }}`(jinja2)       | `for the lolz` |
| `capitalize`        | capitalise first letter            | `{{ text \| capitalize }}`(jinja2)  | `For the lolz` |
| `title`             | capitalise first letters of words  | `{{ text \| title }}`(jinja2)       | `For The Lolz` |
| `length`            | the number of characters           | `{{ text \| length }}`(jinja2)      | `12`           |
| `trim`              | remove leading/trailing whitespace | `{{ long \| trim }}`(jinja2)   | `for the LOLZ` |
| `truncate(n)`       | return first n chars               | `{{ text \| truncate(6) }}`(jinja2) | `for th`       |
| `striptags`         | remove all HTML tags               | `{{ tags \| striptags }}`(jinja2)       |                |
| `replace(old, new)` | replace a sub-string with another  | `{{ text \| replace("the LOLZ", "fun") }}`(jinja2)       | `"for fun"`(python)               |
| `default(value)`    | default if value is missing / None | `{{ none \| default("???") }}`(jinja2)       |  `"???"`(python)              |

### Filters for Lists:
- `length` - the number of items in a list
- `join(separator)` - join the list items into a single string, optional separator
- `first` - the first item of a list
- `last` - the last item of a list


## Custom Filters

In the Flask project templates that you will use at school, some additional filters have been provided:

### Text filters:
- `paragraphs` - convert newlines in text to <br> and double newlines to <p>

### Date/Time filters:
- `local` - convert datetime object to the local timezone
- `timezone(timezone)` - convert date/time object to a specific timezone
- `format(format)` - format datetime object, optional format string - defaults to `ddd, DD MMM YYYY [at] h:mmA`
- `format_date(format)` - format datetime object as a date only - defaults to `ddd, DD MMM YYYY`
- `format_time(format)` - format datetime object as a time only - defaults to `h:mmA`
- `format_human(granularity)` - format datetime object as a human-readable relative time like '2 hours ago', optional granularity, e.g. 'hour' (see [here](https://arrow.readthedocs.io/en/latest/guide.html#humanize))

> [!TIP]
> The above date/time filters use the Arrow library and the available formatting tokens (YYYY, MM, DD, HH, mm, ss, etc.) can be found in the [Arrow library docs](https://arrow.readthedocs.io/en/latest/guide.html#supported-tokens)

