# 🚀 Installation Guide

This guide will help you install and set up the MCP Bridge on your system. The bridge supports multiple installation methods and operating systems.

## 📋 Prerequisites

### **Required**
- **Node.js** 18+ (for NPM package servers)
- **Claude Desktop** (for direct mode integration)

### **Optional but Recommended**
- **Docker** (for bridge mode isolation and Docker servers)
- **Git** (for development and custom servers)

### **System Requirements**

| OS | Minimum | Recommended |
|----|---------|-------------|
| **macOS** | 10.15+ | 12.0+ |
| **Windows** | 10 | 11 |
| **Linux** | Ubuntu 18.04+ | Ubuntu 22.04+ |
| **Memory** | 4GB RAM | 8GB+ RAM |
| **Storage** | 1GB free | 5GB+ free |

## 🎯 Quick Start

### **Option 1: NPM Global Install (Recommended)**

```bash
# Install globally
npm install -g @mcplookup-org/mcp-bridge

# Start the bridge
mcp-bridge

# Or with custom options
mcp-bridge --port 3000 --api-key your-key
```

### **Option 2: NPX (No Installation)**

```bash
# Run directly without installing
npx @mcplookup-org/mcp-bridge

# With options
npx @mcplookup-org/mcp-bridge --port 3000
```

### **Option 3: Local Project Install**

```bash
# Create new project
mkdir my-mcp-project
cd my-mcp-project
npm init -y

# Install locally
npm install @mcplookup-org/mcp-bridge

# Run via npm script
echo '{"scripts": {"start": "mcp-bridge"}}' > package.json
npm start
```

## 🔧 Detailed Installation

### **Step 1: Install Node.js**

#### **macOS**
```bash
# Using Homebrew (recommended)
brew install node

# Or download from nodejs.org
# https://nodejs.org/en/download/
```

#### **Windows**
```bash
# Using Chocolatey
choco install nodejs

# Using Winget
winget install OpenJS.NodeJS

# Or download from nodejs.org
```

#### **Linux (Ubuntu/Debian)**
```bash
# Using NodeSource repository (recommended)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Or using snap
sudo snap install node --classic
```

#### **Verify Installation**
```bash
node --version  # Should be 18.0.0 or higher
npm --version   # Should be 8.0.0 or higher
```

### **Step 2: Install Docker (Optional)**

Docker is required for:
- Bridge mode server isolation
- Docker-based MCP servers
- Enhanced security features

#### **macOS**
```bash
# Download Docker Desktop from docker.com
# Or using Homebrew
brew install --cask docker
```

#### **Windows**
```bash
# Download Docker Desktop from docker.com
# Or using Chocolatey
choco install docker-desktop
```

#### **Linux (Ubuntu)**
```bash
# Install Docker Engine
sudo apt-get update
sudo apt-get install ca-certificates curl gnupg lsb-release

curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

sudo apt-get update
sudo apt-get install docker-ce docker-ce-cli containerd.io

# Add user to docker group
sudo usermod -aG docker $USER
newgrp docker
```

#### **Verify Docker Installation**
```bash
docker --version
docker run hello-world
```

### **Step 3: Install Claude Desktop**

Claude Desktop is required for direct mode integration.

#### **Download Links**
- **macOS**: [Claude Desktop for Mac](https://claude.ai/download)
- **Windows**: [Claude Desktop for Windows](https://claude.ai/download)
- **Linux**: [Claude Desktop for Linux](https://claude.ai/download)

#### **Verify Installation**
1. Launch Claude Desktop
2. Sign in with your Anthropic account
3. Verify the application starts successfully

### **Step 4: Install MCP Bridge**

#### **Global Installation (Recommended)**
```bash
# Install globally for system-wide access
npm install -g @mcplookup-org/mcp-bridge

# Verify installation
mcp-bridge --version
mcp-bridge --help
```

#### **Local Installation**
```bash
# In your project directory
npm install @mcplookup-org/mcp-bridge

# Add to package.json scripts
{
  "scripts": {
    "bridge": "mcp-bridge",
    "bridge:dev": "mcp-bridge --debug"
  }
}

# Run locally
npm run bridge
```

## ⚙️ Configuration

### **Environment Variables**

Create a `.env` file or set environment variables:

```bash
# API Configuration
MCPLOOKUP_API_KEY=your-api-key-here
MCPLOOKUP_BASE_URL=https://mcplookup.org/api/v1

# Bridge Configuration
MCP_BRIDGE_PORT=3000
MCP_BRIDGE_DEBUG=false

# Docker Configuration
DOCKER_HOST=unix:///var/run/docker.sock

# Claude Desktop Config Path (optional)
CLAUDE_CONFIG_PATH=/custom/path/to/claude_desktop_config.json
```

### **Configuration File**

Create `mcp-bridge.config.json`:

```json
{
  "apiKey": "your-api-key",
  "baseUrl": "https://mcplookup.org/api/v1",
  "port": 3000,
  "debug": false,
  "docker": {
    "enabled": true,
    "host": "unix:///var/run/docker.sock"
  },
  "claude": {
    "configPath": "auto"
  }
}
```

### **Command Line Options**

```bash
mcp-bridge [options]

Options:
  --port, -p <port>        HTTP server port (default: 3000)
  --api-key <key>          MCPLookup API key
  --base-url <url>         MCPLookup API base URL
  --config <path>          Configuration file path
  --debug                  Enable debug logging
  --no-docker              Disable Docker support
  --claude-config <path>   Claude Desktop config path
  --help, -h               Show help
  --version, -v            Show version
```

## 🔍 Verification

### **Test Basic Functionality**

```bash
# Start the bridge
mcp-bridge

# In another terminal, test the API
curl http://localhost:3000/health

# Expected response:
# {"status": "healthy", "version": "1.0.0"}
```

### **Test MCP Tools**

```javascript
// Test discovery
await callTool('discover_mcp_servers', {
  query: 'filesystem'
});

// Test installation
await callTool('install_mcp_server', {
  name: 'test-fs',
  type: 'npm',
  command: '@modelcontextprotocol/server-filesystem',
  mode: 'bridge'
});

// Test tool usage
await callTool('test-fs_list_directory', {
  path: '/tmp'
});
```

## 🐳 Docker Installation

### **Using Docker Compose**

Create `docker-compose.yml`:

```yaml
version: '3.8'
services:
  mcp-bridge:
    image: mcplookup/mcp-bridge:latest
    ports:
      - "3000:3000"
    environment:
      - MCPLOOKUP_API_KEY=${MCPLOOKUP_API_KEY}
      - MCP_BRIDGE_DEBUG=false
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
      - ./config:/app/config
    restart: unless-stopped
```

```bash
# Start with Docker Compose
docker-compose up -d

# View logs
docker-compose logs -f mcp-bridge
```

### **Using Docker Run**

```bash
# Run MCP Bridge in Docker
docker run -d \
  --name mcp-bridge \
  -p 3000:3000 \
  -e MCPLOOKUP_API_KEY=your-key \
  -v /var/run/docker.sock:/var/run/docker.sock \
  mcplookup/mcp-bridge:latest
```

## 🔧 Development Installation

### **From Source**

```bash
# Clone the repository
git clone https://github.com/MCPLookup-org/mcp-bridge.git
cd mcp-bridge

# Install dependencies
npm install

# Build the project
npm run build

# Run in development mode
npm run dev

# Run tests
npm test
```

### **Development Environment**

```bash
# Install development dependencies
npm install --include=dev

# Set up pre-commit hooks
npm run prepare

# Start development server with hot reload
npm run dev:watch
```

## 🚨 Troubleshooting

### **Common Issues**

#### **Node.js Version Issues**
```bash
# Check Node.js version
node --version

# If version is too old, update Node.js
# Use nvm for version management
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 18
nvm use 18
```

#### **Permission Issues**
```bash
# Fix npm permissions (macOS/Linux)
sudo chown -R $(whoami) ~/.npm
sudo chown -R $(whoami) /usr/local/lib/node_modules

# Or use npm prefix
npm config set prefix ~/.npm-global
export PATH=~/.npm-global/bin:$PATH
```

#### **Docker Issues**
```bash
# Check Docker is running
docker ps

# Fix Docker permissions (Linux)
sudo usermod -aG docker $USER
newgrp docker

# Restart Docker service
sudo systemctl restart docker
```

#### **Port Conflicts**
```bash
# Check what's using port 3000
lsof -i :3000

# Use different port
mcp-bridge --port 3001
```

### **Debug Mode**

```bash
# Enable debug logging
mcp-bridge --debug

# Or set environment variable
DEBUG=mcp-bridge:* mcp-bridge
```

### **Log Files**

```bash
# View logs (if using systemd)
journalctl -u mcp-bridge -f

# View Docker logs
docker logs mcp-bridge -f

# Custom log location
mcp-bridge --log-file /var/log/mcp-bridge.log
```

## 🔄 Updates

### **Update NPM Installation**

```bash
# Update to latest version
npm update -g @mcplookup-org/mcp-bridge

# Or reinstall
npm uninstall -g @mcplookup-org/mcp-bridge
npm install -g @mcplookup-org/mcp-bridge
```

### **Update Docker Installation**

```bash
# Pull latest image
docker pull mcplookup/mcp-bridge:latest

# Restart container
docker-compose down
docker-compose up -d
```

## 🔐 Security Setup

### **API Key Management**

```bash
# Store API key securely
echo "MCPLOOKUP_API_KEY=your-key" >> ~/.bashrc
source ~/.bashrc

# Or use a secrets manager
# AWS Secrets Manager, Azure Key Vault, etc.
```

### **Network Security**

```bash
# Bind to localhost only
mcp-bridge --port 3000 --host 127.0.0.1

# Use reverse proxy for external access
# nginx, Apache, Cloudflare, etc.
```

### **File Permissions**

```bash
# Secure config file
chmod 600 mcp-bridge.config.json

# Secure log files
chmod 640 /var/log/mcp-bridge.log
```

## ✅ Next Steps

After successful installation:

1. **📖 Read the [First Server Tutorial](./tutorials/first-server.md)**
2. **🔍 Explore [API Documentation](./api/)**
3. **🎯 Try [Usage Examples](./examples/)**
4. **🤝 Join [Community Discussions](https://github.com/MCPLookup-org/mcp-bridge/discussions)**

## 📞 Support

If you encounter issues:

- **📚 Check [Troubleshooting Guide](./troubleshooting.md)**
- **🐛 Report [Issues on GitHub](https://github.com/MCPLookup-org/mcp-bridge/issues)**
- **💬 Ask in [Discussions](https://github.com/MCPLookup-org/mcp-bridge/discussions)**
- **📧 Email support@mcplookup.org**

---

**Installation complete!** 🎉 Ready to start managing MCP servers? Begin with the [First Server Tutorial](./tutorials/first-server.md).
