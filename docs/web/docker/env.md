# Environment Variables

Environment variables store configuration such as secret keys and database URLs.

## Compose example

```yaml
services:
  web:
    build: .
    environment:
      - FLASK_ENV=development
      - SECRET_KEY=change-me
```

Never commit real secrets to repository.
Use `.env` files for local development.
