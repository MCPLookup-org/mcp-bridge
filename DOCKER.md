# 🐳 Docker Deployment Guide

## 🚀 Quick Start

### Option 1: Docker Run (Simple)

```bash
# Run with public API access
docker run -d \
  --name mcp-bridge \
  --restart unless-stopped \
  -p 3000:3000 \
  mcplookup/mcp-bridge:latest

# Run with API key for full functionality
docker run -d \
  --name mcp-bridge \
  --restart unless-stopped \
  -p 3000:3000 \
  -e MCPLOOKUP_API_KEY=mcp_your_api_key_here \
  mcplookup/mcp-bridge:latest
```

### Option 2: Docker Compose (Recommended)

```bash
# Clone and setup
git clone https://github.com/MCPLookup-org/mcp-bridge.git
cd mcp-bridge

# Configure environment
cp .env.example .env
# Edit .env with your API key

# Start the bridge
docker-compose up -d

# View logs
docker-compose logs -f mcp-bridge
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `MCPLOOKUP_API_KEY` | API key for authentication | None | No* |
| `MCPLOOKUP_BASE_URL` | Override base URL | `https://mcplookup.org/api/v1` | No |
| `NODE_ENV` | Node environment | `production` | No |
| `PORT` | HTTP port (if applicable) | `3000` | No |
| `LOG_LEVEL` | Logging level | `info` | No |

**\* Required for management tools (register, verify, onboarding)**

### Volume Mounts

```bash
# Mount configuration
docker run -d \
  --name mcp-bridge \
  -v $(pwd)/config:/app/config:ro \
  -v $(pwd)/logs:/app/logs \
  mcplookup/mcp-bridge:latest
```

## 🏗️ Building from Source

### Build Image

```bash
# Clone repository
git clone https://github.com/MCPLookup-org/mcp-bridge.git
cd mcp-bridge

# Build image
docker build -t mcplookup/mcp-bridge:latest .

# Build with custom tag
docker build -t mcplookup/mcp-bridge:v1.0.0 .
```

### Multi-platform Build

```bash
# Setup buildx
docker buildx create --use

# Build for multiple platforms
docker buildx build \
  --platform linux/amd64,linux/arm64 \
  -t mcplookup/mcp-bridge:latest \
  --push .
```

## 🔒 Security Features

### Non-root User
- Runs as user `mcpbridge` (UID 1001)
- No root privileges inside container
- Read-only root filesystem

### Resource Limits
```yaml
deploy:
  resources:
    limits:
      memory: 512M
      cpus: '0.5'
    reservations:
      memory: 256M
      cpus: '0.25'
```

### Security Options
```yaml
security_opt:
  - no-new-privileges:true
read_only: true
tmpfs:
  - /tmp:noexec,nosuid,size=100m
```

## 📊 Monitoring & Health Checks

### Health Check
```bash
# Check container health
docker ps
# Look for "healthy" status

# Manual health check
docker exec mcp-bridge node -e "console.log('Bridge is healthy')"
```

### Logs
```bash
# View logs
docker logs mcp-bridge

# Follow logs
docker logs -f mcp-bridge

# With docker-compose
docker-compose logs -f mcp-bridge
```

### Metrics
```bash
# Container stats
docker stats mcp-bridge

# Resource usage
docker exec mcp-bridge ps aux
docker exec mcp-bridge free -h
```

## 🌐 Network Configuration

### Standalone Container
```bash
# Create custom network
docker network create mcp-bridge-net

# Run with custom network
docker run -d \
  --name mcp-bridge \
  --network mcp-bridge-net \
  mcplookup/mcp-bridge:latest
```

### With Reverse Proxy (Traefik)
```yaml
labels:
  - "traefik.enable=true"
  - "traefik.http.routers.mcp-bridge.rule=Host(`bridge.mcplookup.org`)"
  - "traefik.http.services.mcp-bridge.loadbalancer.server.port=3000"
```

### With Nginx
```nginx
upstream mcp-bridge {
    server localhost:3000;
}

server {
    listen 80;
    server_name bridge.mcplookup.org;
    
    location / {
        proxy_pass http://mcp-bridge;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## 🔄 Updates & Maintenance

### Update Container
```bash
# Pull latest image
docker pull mcplookup/mcp-bridge:latest

# Recreate container
docker-compose down
docker-compose up -d

# Or with docker run
docker stop mcp-bridge
docker rm mcp-bridge
docker run -d --name mcp-bridge mcplookup/mcp-bridge:latest
```

### Backup & Restore
```bash
# Backup configuration
docker cp mcp-bridge:/app/config ./backup/

# Backup logs
docker cp mcp-bridge:/app/logs ./backup/

# Restore configuration
docker cp ./backup/config mcp-bridge:/app/
```

## 🐛 Troubleshooting

### Common Issues

**Container won't start:**
```bash
# Check logs
docker logs mcp-bridge

# Check configuration
docker exec mcp-bridge env | grep MCP
```

**Permission issues:**
```bash
# Check user
docker exec mcp-bridge id

# Check file permissions
docker exec mcp-bridge ls -la /app
```

**Network connectivity:**
```bash
# Test API connectivity
docker exec mcp-bridge curl -I https://mcplookup.org/api/v1/health

# Test DNS resolution
docker exec mcp-bridge nslookup mcplookup.org
```

### Debug Mode
```bash
# Run with debug logging
docker run -d \
  --name mcp-bridge \
  -e LOG_LEVEL=debug \
  mcplookup/mcp-bridge:latest

# Interactive debugging
docker run -it \
  --entrypoint /bin/sh \
  mcplookup/mcp-bridge:latest
```

## 📈 Production Deployment

### Docker Swarm
```yaml
version: '3.8'
services:
  mcp-bridge:
    image: mcplookup/mcp-bridge:latest
    deploy:
      replicas: 3
      update_config:
        parallelism: 1
        delay: 10s
      restart_policy:
        condition: on-failure
        delay: 5s
        max_attempts: 3
```

### Kubernetes
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: mcp-bridge
spec:
  replicas: 3
  selector:
    matchLabels:
      app: mcp-bridge
  template:
    metadata:
      labels:
        app: mcp-bridge
    spec:
      containers:
      - name: mcp-bridge
        image: mcplookup/mcp-bridge:latest
        ports:
        - containerPort: 3000
        env:
        - name: MCPLOOKUP_API_KEY
          valueFrom:
            secretKeyRef:
              name: mcp-bridge-secret
              key: api-key
        resources:
          limits:
            memory: "512Mi"
            cpu: "500m"
          requests:
            memory: "256Mi"
            cpu: "250m"
```

🐳 **The MCPLookup Bridge is now fully Dockerized for easy deployment!**
