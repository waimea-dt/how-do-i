# What is Docker Compose?

Docker Compose runs multi-container apps from one YAML file.

## Example

```yaml
services:
  web:
    build: .
    ports:
      - "5000:5000"
```

Run with:

```bash
docker compose up --build
```
