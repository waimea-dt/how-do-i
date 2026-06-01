# Dockerised Flask Starter

Minimal Docker setup for Flask app.

## Dockerfile

```dockerfile
FROM python:3.12-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
CMD ["python", "app.py"]
```

## docker-compose.yml

```yaml
services:
  web:
    build: .
    ports:
      - "5000:5000"
```

## requirements.txt

```text
flask==3.0.3
```

## Run

```bash
docker compose up --build
```
