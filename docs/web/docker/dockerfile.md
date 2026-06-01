# Dockerfile Basics

Dockerfile defines how image is built.

```dockerfile
FROM python:3.12-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
CMD ["python", "app.py"]
```

Build image:

```bash
docker build -t flask-notes .
```
