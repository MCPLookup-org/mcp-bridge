# 🔍 Troubleshooting Guide

**Comprehensive guide to diagnosing and fixing common MCPL issues.**

## 🎯 **Quick Diagnostics**

### **Health Check Commands**
```bash
# Check MCPL installation
mcpl --version

# Check authentication
mcpl auth status

# Check server status
mcpl status

# Check system health
mcpl health

# View recent logs
mcpl logs --lines 50
```

### **System Requirements Check**
```bash
# Check Node.js
node --version  # Should be 18.0.0+

# Check npm
npm --version   # Should be 8.0.0+

# Check Docker
docker --version  # Should be 20.0.0+

# Check Docker daemon
docker ps  # Should not error
```

## 🚨 **Common Issues**

### **Installation Issues**

#### **"Command not found: mcpl"**

**Symptoms:**
```bash
$ mcpl --version
bash: mcpl: command not found
```

**Diagnosis:**
```bash
# Check if globally installed
npm list -g @mcplookup-org/mcp-bridge

# Check npm global bin path
npm config get prefix
```

**Solutions:**
```bash
# Solution 1: Install globally
npm install -g @mcplookup-org/mcp-bridge

# Solution 2: Fix PATH
export PATH="$(npm config get prefix)/bin:$PATH"
echo 'export PATH="$(npm config get prefix)/bin:$PATH"' >> ~/.bashrc

# Solution 3: Use npx
npx @mcplookup-org/mcp-bridge --version
```

#### **"Permission denied" (Linux/macOS)**

**Symptoms:**
```bash
$ npm install -g @mcplookup-org/mcp-bridge
EACCES: permission denied
```

**Solutions:**
```bash
# Solution 1: Use npm prefix (recommended)
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
export PATH=~/.npm-global/bin:$PATH
npm install -g @mcplookup-org/mcp-bridge

# Solution 2: Fix npm permissions
sudo chown -R $(whoami) $(npm config get prefix)/{lib/node_modules,bin,share}

# Solution 3: Use sudo (not recommended)
sudo npm install -g @mcplookup-org/mcp-bridge
```

### **Authentication Issues**

#### **"Authentication failed"**

**Symptoms:**
```bash
$ mcpl search "tools"
❌ Error: Authentication failed - Invalid API key
```

**Diagnosis:**
```bash
# Check current auth status
mcpl auth status

# Check environment variable
echo $MCPLOOKUP_API_KEY

# Check stored credentials
mcpl config get apiKey
```

**Solutions:**
```bash
# Solution 1: Set API key via login
mcpl login --key your-api-key-here

# Solution 2: Set environment variable
export MCPLOOKUP_API_KEY=your-api-key-here
echo 'export MCPLOOKUP_API_KEY=your-api-key' >> ~/.bashrc

# Solution 3: Pass key with command
mcpl search "tools" --api-key your-api-key

# Solution 4: Get new API key
# Visit https://mcplookup.org/dashboard
```

#### **"API key expired"**

**Symptoms:**
```bash
$ mcpl search "tools"
❌ Error: API key has expired
```

**Solutions:**
```bash
# Get new API key from dashboard
# Visit https://mcplookup.org/dashboard

# Update stored key
mcpl login --key new-api-key

# Clear old credentials
mcpl auth clear
mcpl login --key new-api-key
```

### **Docker Issues**

#### **"Docker not found"**

**Symptoms:**
```bash
$ mcpl install @company/server
❌ Error: Docker not found - please install Docker
```

**Solutions:**
```bash
# Install Docker (Ubuntu/Debian)
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Install Docker (macOS with Homebrew)
brew install --cask docker

# Install Docker (Windows)
# Download from https://www.docker.com/products/docker-desktop

# Verify installation
docker --version
```

#### **"Permission denied" (Docker)**

**Symptoms:**
```bash
$ mcpl install @company/server
❌ Error: permission denied while trying to connect to Docker daemon
```

**Solutions:**
```bash
# Add user to docker group (Linux)
sudo usermod -aG docker $USER
newgrp docker

# Restart Docker service
sudo systemctl restart docker

# Test Docker access
docker run hello-world

# Alternative: Use sudo (not recommended)
sudo mcpl install @company/server
```

#### **"Docker daemon not running"**

**Symptoms:**
```bash
$ docker ps
Cannot connect to the Docker daemon
```

**Solutions:**
```bash
# Start Docker service (Linux)
sudo systemctl start docker
sudo systemctl enable docker

# Start Docker Desktop (macOS/Windows)
# Open Docker Desktop application

# Check Docker status
sudo systemctl status docker
```

### **Server Installation Issues**

#### **"Server not found"**

**Symptoms:**
```bash
$ mcpl install @nonexistent/server
❌ Error: Server not found in registry
```

**Solutions:**
```bash
# Search for similar servers
mcpl search "server name"

# Check exact package name
mcpl search "@company" --limit 20

# Verify package exists on npm
npm view @company/server

# Try different search terms
mcpl search "functionality you need"
```

#### **"Installation failed"**

**Symptoms:**
```bash
$ mcpl install @company/server
❌ Error: Installation failed - npm install failed
```

**Diagnosis:**
```bash
# Check detailed logs
mcpl logs --level error

# Try manual npm install
npm install -g @company/server

# Check npm registry
npm view @company/server
```

**Solutions:**
```bash
# Clear npm cache
npm cache clean --force

# Try different registry
npm install -g @company/server --registry https://registry.npmjs.org/

# Force reinstall
mcpl install @company/server --force

# Install with verbose logging
mcpl install @company/server --debug
```

### **Claude Desktop Integration Issues**

#### **"Server not appearing in Claude"**

**Symptoms:**
- Server installed successfully
- Claude doesn't show MCP tools

**Diagnosis:**
```bash
# Check installation mode
mcpl list --status

# Check Claude config
mcpl config show

# Check server status
mcpl status
```

**Solutions:**

**For Direct Mode:**
```bash
# Restart Claude Desktop (required for direct mode)
# Close Claude completely and reopen

# Check Claude config file location:
# Windows: %APPDATA%\Claude\claude_desktop_config.json
# macOS: ~/Library/Application Support/Claude/claude_desktop_config.json
# Linux: ~/.config/Claude/claude_desktop_config.json

# Verify server in config
cat "$(mcpl config get claudeConfigPath)"
```

**For Bridge Mode:**
```bash
# Check bridge is running
mcpl status

# Start bridge if not running
mcpl bridge

# Check bridge configuration in Claude
# Should have mcplookup-bridge entry in config
```

#### **"Tools have wrong names"**

**Symptoms:**
- Tools appear as `server_toolName` instead of `toolName`

**Explanation:**
This is normal for bridge mode. Tools are prefixed to avoid conflicts.

**Solutions:**
```bash
# Use prefixed names in bridge mode
# Example: filesystem_read_file instead of read_file

# Or switch to direct mode for native names
mcpl uninstall server-name
mcpl install @company/server --mode direct
# Restart Claude Desktop
```

### **Performance Issues**

#### **"Slow server discovery"**

**Symptoms:**
```bash
$ mcpl search "tools"
# Takes >10 seconds to respond
```

**Solutions:**
```bash
# Check network connectivity
ping mcplookup.org

# Use smaller result limits
mcpl search "tools" --limit 5

# Check API rate limits
mcpl auth status

# Clear local cache
mcpl config reset
```

#### **"High memory usage"**

**Symptoms:**
- System running slowly
- High memory usage from MCPL processes

**Diagnosis:**
```bash
# Check server resource usage
mcpl status --detailed

# Check Docker container stats
docker stats --format "table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}"
```

**Solutions:**
```bash
# Restart resource-heavy servers
mcpl control server-name restart

# Set resource limits
mcpl config set maxMemory 512m
mcpl config set maxCpu 0.5

# Remove unused servers
mcpl uninstall unused-server
```

## 🔧 **Advanced Diagnostics**

### **Debug Mode**
```bash
# Enable debug logging
mcpl --debug command

# Set debug log level
mcpl config set logLevel debug

# View debug logs
mcpl logs --level debug --follow
```

### **Network Diagnostics**
```bash
# Test API connectivity
curl -H "Authorization: Bearer $MCPLOOKUP_API_KEY" \
     https://mcplookup.org/api/v1/health

# Test DNS resolution
nslookup mcplookup.org

# Test with different DNS
dig @8.8.8.8 mcplookup.org
```

### **Configuration Diagnostics**
```bash
# Show all configuration
mcpl config show

# Check configuration file
cat ~/.config/mcpl/config.json

# Validate configuration
mcpl config validate

# Reset configuration
mcpl config reset
```

### **Docker Diagnostics**
```bash
# List MCPL containers
docker ps --filter "name=mcp-"

# Check container logs
docker logs mcp-server-name

# Inspect container
docker inspect mcp-server-name

# Check Docker system info
docker system info
```

## 📝 **Log Analysis**

### **Log Locations**
- **MCPL Logs**: `~/.config/mcpl/logs/`
- **Docker Logs**: `docker logs <container>`
- **System Logs**: `/var/log/` (Linux), Console.app (macOS)

### **Common Log Patterns**

#### **Authentication Errors**
```
ERROR: Authentication failed - Invalid API key
ERROR: API key expired
ERROR: Rate limit exceeded
```

#### **Network Errors**
```
ERROR: Connection timeout to mcplookup.org
ERROR: DNS resolution failed
ERROR: SSL certificate verification failed
```

#### **Docker Errors**
```
ERROR: Docker daemon not accessible
ERROR: Container failed to start
ERROR: Image pull failed
```

## 🆘 **Getting Help**

### **Self-Help Resources**
```bash
# Built-in help
mcpl help
mcpl help <command>

# Check documentation
mcpl docs

# Run diagnostics
mcpl doctor
```

### **Community Support**
- **GitHub Issues**: [github.com/MCPLookup-org/mcp-bridge/issues](https://github.com/MCPLookup-org/mcp-bridge/issues)
- **Documentation**: [docs.mcplookup.org](https://docs.mcplookup.org)
- **Discord**: [discord.gg/mcplookup](https://discord.gg/mcplookup)

### **Bug Reports**
When reporting bugs, include:

```bash
# System information
mcpl --version
node --version
docker --version
uname -a

# Configuration
mcpl config show

# Logs
mcpl logs --lines 100

# Error reproduction steps
mcpl install @company/server --debug
```

### **Feature Requests**
- Use GitHub Issues with "enhancement" label
- Describe use case and expected behavior
- Include examples and mockups if applicable

---

**🌟 Most issues can be resolved with the solutions above. If you're still stuck, don't hesitate to reach out to the community!**
