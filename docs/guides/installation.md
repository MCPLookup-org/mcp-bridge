# 📦 Installation Guide

**Complete guide to installing and setting up MCPL on your system.**

## 🎯 **Prerequisites**

### **System Requirements**
- **Node.js**: Version 18.0.0 or higher
- **npm**: Version 8.0.0 or higher (comes with Node.js)
- **Docker**: Version 20.0.0 or higher (for containerized servers)
- **Operating System**: Windows 10+, macOS 10.15+, or Linux

### **Check Your System**
```bash
# Check Node.js version
node --version
# Should output: v18.0.0 or higher

# Check npm version
npm --version
# Should output: 8.0.0 or higher

# Check Docker version
docker --version
# Should output: Docker version 20.0.0 or higher
```

## 🚀 **Installation Methods**

### **Method 1: Global Installation (Recommended)**
```bash
# Install globally for system-wide access
npm install -g @mcplookup-org/mcp-bridge

# Verify installation
mcpl --version
# Should output: @mcplookup-org/mcp-bridge@x.x.x

# Test basic functionality
mcpl --help
```

### **Method 2: Direct Execution (No Installation)**
```bash
# Run directly without installing
npx @mcplookup-org/mcp-bridge --help

# Use with commands
npx @mcplookup-org/mcp-bridge search "filesystem tools"
```

### **Method 3: Local Project Installation**
```bash
# Install in a specific project
cd your-project
npm install @mcplookup-org/mcp-bridge

# Run via npm scripts
npx mcpl --help
```

## 🔐 **Authentication Setup**

### **Get Your API Key**
1. Visit [mcplookup.org/dashboard](https://mcplookup.org/dashboard)
2. Sign up or log in to your account
3. Navigate to "API Keys" section
4. Generate a new API key
5. Copy the key (it won't be shown again)

### **Configure Authentication**

#### **Option 1: Environment Variable (Recommended)**
```bash
# Add to your shell profile (.bashrc, .zshrc, etc.)
export MCPLOOKUP_API_KEY=your-api-key-here

# Reload your shell or run:
source ~/.bashrc  # or ~/.zshrc
```

#### **Option 2: CLI Login Command**
```bash
# Store API key securely
mcpl login --key your-api-key-here

# Verify authentication
mcpl auth status
# Should output: ✅ Authenticated as: your-email@example.com
```

#### **Option 3: Per-Command Authentication**
```bash
# Pass API key with each command
mcpl search "tools" --api-key your-api-key-here
```

## ✅ **Verify Installation**

### **Basic Functionality Test**
```bash
# Test CLI access
mcpl --version
# Expected: @mcplookup-org/mcp-bridge@x.x.x

# Test help system
mcpl --help
# Expected: Command help output

# Test authentication
mcpl auth status
# Expected: ✅ Authenticated as: your-email@example.com
```

### **Discovery Test**
```bash
# Test server discovery
mcpl search "filesystem" --limit 3
# Expected: List of filesystem-related servers

# Test smart discovery
mcpl search "I need email automation tools" --smart
# Expected: AI-powered recommendations
```

### **Installation Test**
```bash
# Test server installation (dry run)
mcpl install @modelcontextprotocol/server-filesystem --dry-run
# Expected: Installation plan without actual installation

# Test actual installation
mcpl install @modelcontextprotocol/server-filesystem
# Expected: ✅ Installed filesystem server
```

## 🐳 **Docker Setup**

### **Install Docker**

#### **Windows**
1. Download Docker Desktop from [docker.com](https://www.docker.com/products/docker-desktop)
2. Run the installer
3. Start Docker Desktop
4. Verify: `docker --version`

#### **macOS**
```bash
# Using Homebrew
brew install --cask docker

# Or download from docker.com
# Start Docker Desktop from Applications
```

#### **Linux (Ubuntu/Debian)**
```bash
# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Add user to docker group
sudo usermod -aG docker $USER

# Restart shell or logout/login
newgrp docker

# Verify installation
docker --version
```

### **Configure Docker for MCPL**
```bash
# Test Docker access
docker run hello-world
# Expected: Hello from Docker! message

# Pull Node.js image (used by MCPL)
docker pull node:18-alpine
# Expected: Image download progress

# Verify MCPL can use Docker
mcpl install @modelcontextprotocol/server-filesystem --mode bridge
# Expected: Docker container creation
```

## 🔧 **Configuration**

### **Configuration File**
MCPL stores configuration in platform-specific locations:

- **Windows**: `%APPDATA%\mcpl\config.json`
- **macOS**: `~/Library/Application Support/mcpl/config.json`
- **Linux**: `~/.config/mcpl/config.json`

### **Default Configuration**
```json
{
  "apiKey": "your-api-key",
  "defaultMode": "direct",
  "dockerEnabled": true,
  "autoStart": false,
  "logLevel": "info",
  "bridgePort": 3000,
  "healthCheckInterval": 30000
}
```

### **Configuration Options**
```bash
# View current configuration
mcpl config show

# Set configuration values
mcpl config set defaultMode bridge
mcpl config set autoStart true
mcpl config set logLevel debug

# Reset to defaults
mcpl config reset
```

## 🌉 **Claude Desktop Integration**

### **Bridge Mode Setup**
Add MCPL as an MCP server in Claude Desktop:

```json
{
  "mcpServers": {
    "mcplookup-bridge": {
      "command": "mcpl",
      "args": ["bridge"],
      "env": {
        "MCPLOOKUP_API_KEY": "your-api-key-here"
      }
    }
  }
}
```

### **Configuration File Locations**
- **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`
- **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Linux**: `~/.config/Claude/claude_desktop_config.json`

### **Verify Claude Integration**
1. Restart Claude Desktop
2. Start a new conversation
3. Ask: "What MCP tools are available?"
4. Look for MCPL tools like `discover_mcp_servers`

## 🔍 **Troubleshooting**

### **Common Issues**

#### **"Command not found: mcpl"**
```bash
# Check if globally installed
npm list -g @mcplookup-org/mcp-bridge

# If not installed, install globally
npm install -g @mcplookup-org/mcp-bridge

# Check PATH includes npm global bin
npm config get prefix
# Add to PATH: /path/to/npm/bin
```

#### **"Docker not found"**
```bash
# Check Docker installation
docker --version

# If not installed, follow Docker setup above

# Check Docker daemon is running
docker ps
# Should not error
```

#### **"Authentication failed"**
```bash
# Check API key is set
echo $MCPLOOKUP_API_KEY

# If empty, set it:
export MCPLOOKUP_API_KEY=your-key

# Or use login command:
mcpl login --key your-key

# Verify authentication
mcpl auth status
```

#### **"Permission denied" (Linux/macOS)**
```bash
# Add user to docker group
sudo usermod -aG docker $USER

# Restart shell
newgrp docker

# Or use sudo (not recommended)
sudo mcpl install server-name
```

### **Getting Help**
```bash
# CLI help
mcpl --help
mcpl command --help

# Check logs
mcpl logs

# Debug mode
mcpl --debug command

# Report issues
# Visit: https://github.com/MCPLookup-org/mcp-bridge/issues
```

## 🎉 **Next Steps**

After successful installation:

1. **📖 Read the [Quick Start Tutorial](../tutorials/quick-start.md)**
2. **🌉 Set up [Bridge Mode](./bridge-mode.md) or [Direct Mode](./direct-mode.md)**
3. **🔍 Learn about [Server Discovery](./discovery.md)**
4. **🔧 Explore [Server Management](./server-management.md)**

---

**🌟 You're now ready to use MCPL! Start with the Quick Start Tutorial to install your first MCP server.**
