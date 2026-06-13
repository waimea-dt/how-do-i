# Docker Commands

Core Docker CLI commands:

```bash
docker --version
docker build -t my-flask-app .
docker run -p 5000:5000 my-flask-app
docker ps
docker stop <container_id>
docker images
docker logs <container_id>
```

Use `docker logs` first when app fails to start.
