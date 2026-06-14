# Volumes

Volumes keep data outside container lifecycle.

## Compose example

```yaml
services:
  db:
    image: postgres:16
    volumes:
      - pg_data:/var/lib/postgresql/data

volumes:
  pg_data:
```

Without volume, container deletion removes stored data.
