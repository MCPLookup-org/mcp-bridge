# 🔧 Troubleshooting Guide

This comprehensive guide helps you diagnose and resolve common issues with the MCP Bridge. Issues are organized by category with step-by-step solutions.

## 🚨 Quick Diagnostics

### **Health Check Commands**

```bash
# Check bridge status
curl http://localhost:3000/health

# Check bridge version
mcp-bridge --version

# Check Node.js version
node --version

# Check Docker status
docker ps

# Check Claude Desktop config
cat ~/Library/Application\ Support/Claude/claude_desktop_config.json
```

### **Debug Mode**

```bash
# Start bridge with debug logging
mcp-bridge --debug

# Or set environment variable
DEBUG=mcp-bridge:* mcp-bridge

# View detailed logs
tail -f ~/.mcp-bridge/logs/bridge.log
```

## 🚀 Installation Issues

### **Node.js Version Problems**

#### **Symptoms**
- `node: command not found`
- `Error: Unsupported Node.js version`
- `npm: command not found`

#### **Solutions**

```bash
# Check current version
node --version

# Install/update Node.js (macOS)
brew install node

# Install/update Node.js (Ubuntu)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Use nvm for version management
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 18
nvm use 18
```

### **NPM Permission Issues**

#### **Symptoms**
- `EACCES: permission denied`
- `Error: EPERM: operation not permitted`

#### **Solutions**

```bash
# Fix npm permissions (macOS/Linux)
sudo chown -R $(whoami) ~/.npm
sudo chown -R $(whoami) /usr/local/lib/node_modules

# Use npm prefix (recommended)
npm config set prefix ~/.npm-global
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc
source ~/.bashrc

# Reinstall with correct permissions
npm uninstall -g @mcplookup-org/mcp-bridge
npm install -g @mcplookup-org/mcp-bridge
```

### **Package Installation Failures**

#### **Symptoms**
- `Package not found`
- `Network timeout`
- `Registry error`

#### **Solutions**

```bash
# Clear npm cache
npm cache clean --force

# Use different registry
npm install -g @mcplookup-org/mcp-bridge --registry https://registry.npmjs.org/

# Check network connectivity
ping registry.npmjs.org

# Use proxy if needed
npm config set proxy http://proxy.company.com:8080
npm config set https-proxy http://proxy.company.com:8080
```

## 🐳 Docker Issues

### **Docker Not Running**

#### **Symptoms**
- `Cannot connect to the Docker daemon`
- `Docker command not found`
- Bridge mode installations fail

#### **Solutions**

```bash
# Check Docker status
docker ps

# Start Docker (macOS)
open /Applications/Docker.app

# Start Docker (Linux)
sudo systemctl start docker
sudo systemctl enable docker

# Check Docker daemon
sudo systemctl status docker

# Restart Docker if needed
sudo systemctl restart docker
```

### **Docker Permission Issues**

#### **Symptoms**
- `Permission denied while trying to connect to Docker daemon`
- `Got permission denied while trying to connect to the Docker daemon socket`

#### **Solutions**

```bash
# Add user to docker group (Linux)
sudo usermod -aG docker $USER
newgrp docker

# Verify group membership
groups $USER

# Test Docker access
docker run hello-world

# If still failing, restart session
logout
# Log back in
```

### **Docker Container Issues**

#### **Symptoms**
- Containers fail to start
- `Port already in use`
- `Image not found`

#### **Solutions**

```bash
# Check running containers
docker ps -a

# Check container logs
docker logs mcp-server-name

# Remove problematic containers
docker rm -f mcp-server-name

# Pull latest images
docker pull node:18-alpine

# Check port usage
lsof -i :3000
netstat -tulpn | grep :3000

# Kill process using port
sudo kill -9 $(lsof -t -i:3000)
```

## 🔧 Bridge Startup Issues

### **Port Conflicts**

#### **Symptoms**
- `Error: listen EADDRINUSE :::3000`
- `Port 3000 is already in use`

#### **Solutions**

```bash
# Find process using port
lsof -i :3000
netstat -tulpn | grep :3000

# Kill process
sudo kill -9 $(lsof -t -i:3000)

# Use different port
mcp-bridge --port 3001

# Set default port
echo "MCP_BRIDGE_PORT=3001" >> ~/.env
```

### **Configuration Issues**

#### **Symptoms**
- `Configuration file not found`
- `Invalid configuration`
- `API key missing`

#### **Solutions**

```bash
# Check config file location
ls -la ~/.mcp-bridge/config.json

# Create default config
mkdir -p ~/.mcp-bridge
cat > ~/.mcp-bridge/config.json << EOF
{
  "apiKey": "your-api-key",
  "port": 3000,
  "debug": false
}
EOF

# Set environment variables
export MCPLOOKUP_API_KEY=your-api-key
export MCP_BRIDGE_PORT=3000

# Validate config
mcp-bridge --validate-config
```

### **Memory Issues**

#### **Symptoms**
- `JavaScript heap out of memory`
- Bridge crashes unexpectedly
- Slow performance

#### **Solutions**

```bash
# Increase Node.js memory limit
node --max-old-space-size=4096 $(which mcp-bridge)

# Set environment variable
export NODE_OPTIONS="--max-old-space-size=4096"

# Monitor memory usage
top -p $(pgrep -f mcp-bridge)

# Restart bridge regularly
# Add to crontab: 0 */6 * * * systemctl restart mcp-bridge
```

## 🔌 Server Management Issues

### **Server Installation Failures**

#### **Symptoms**
- `Failed to install server`
- `Docker image not found`
- `NPM package not found`

#### **Solutions**

```bash
# Check package exists
npm view @modelcontextprotocol/server-filesystem

# Check Docker image exists
docker pull mcplookup/gmail-server:latest

# Verify command syntax
await callTool('install_mcp_server', {
  name: 'test',
  type: 'npm',
  command: '@modelcontextprotocol/server-filesystem',
  mode: 'bridge'
});

# Check bridge logs
mcp-bridge --debug
```

### **Server Won't Start**

#### **Symptoms**
- Server status shows 'error'
- Tools not available
- Connection timeouts

#### **Solutions**

```javascript
// Check server status
await callTool('list_managed_servers');

// Restart server
await callTool('control_mcp_server', {
  name: 'server-name',
  action: 'restart'
});

// Check Docker logs
// docker logs mcp-server-name

// Remove and reinstall
await callTool('control_mcp_server', {
  name: 'server-name',
  action: 'remove'
});

await callTool('install_mcp_server', {
  name: 'server-name',
  type: 'npm',
  command: '@package/name',
  mode: 'bridge'
});
```

### **Tools Not Available**

#### **Symptoms**
- `Tool not found`
- Tools don't appear in list
- Prefixed tools missing

#### **Solutions**

```javascript
// Verify server is running
await callTool('list_managed_servers');

// Check tool names (bridge mode uses prefixes)
// Correct: server-name_tool-name
// Incorrect: tool-name

// Restart server to refresh tools
await callTool('control_mcp_server', {
  name: 'server-name',
  action: 'restart'
});

// Check server logs for tool registration
```

## 📝 Direct Mode Issues

### **Claude Desktop Config Problems**

#### **Symptoms**
- Config file not found
- Permission denied
- Invalid JSON

#### **Solutions**

```bash
# Check config file location
ls -la ~/Library/Application\ Support/Claude/claude_desktop_config.json

# Create config directory
mkdir -p ~/Library/Application\ Support/Claude/

# Fix permissions
chmod 644 ~/Library/Application\ Support/Claude/claude_desktop_config.json

# Validate JSON
cat ~/Library/Application\ Support/Claude/claude_desktop_config.json | jq .

# Backup and recreate if corrupted
cp ~/Library/Application\ Support/Claude/claude_desktop_config.json ~/claude_config_backup.json
echo '{"mcpServers": {}}' > ~/Library/Application\ Support/Claude/claude_desktop_config.json
```

### **Claude Desktop Not Recognizing Servers**

#### **Symptoms**
- Servers in config but not available
- Tools not showing up
- Connection errors

#### **Solutions**

```bash
# Verify config format
cat ~/Library/Application\ Support/Claude/claude_desktop_config.json

# Expected format:
{
  "mcpServers": {
    "server-name": {
      "command": "npx",
      "args": ["@package/name"],
      "env": {}
    }
  }
}

# Restart Claude Desktop (required)
# Close and reopen Claude Desktop application

# Check Claude Desktop logs
# macOS: ~/Library/Logs/Claude/
# Windows: %APPDATA%/Claude/logs/
# Linux: ~/.config/Claude/logs/
```

### **Environment Variable Issues**

#### **Symptoms**
- Servers start but can't access APIs
- Authentication failures
- Missing configuration

#### **Solutions**

```javascript
// Check environment variables in config
await callTool('list_claude_servers');

// Verify environment variables are set
console.log(process.env.API_KEY);

// Update server with correct env vars
await callTool('remove_claude_server', {
  name: 'server-name'
});

await callTool('install_mcp_server', {
  name: 'server-name',
  type: 'npm',
  command: '@package/name',
  mode: 'direct',
  env: {
    'API_KEY': process.env.YOUR_API_KEY,
    'DEBUG': 'true'
  }
});
```

## 🌐 Network Issues

### **API Connection Problems**

#### **Symptoms**
- `Connection refused`
- `Network timeout`
- `DNS resolution failed`

#### **Solutions**

```bash
# Test network connectivity
ping mcplookup.org
curl -I https://mcplookup.org/api/v1/health

# Check proxy settings
echo $HTTP_PROXY
echo $HTTPS_PROXY

# Configure proxy if needed
export HTTP_PROXY=http://proxy.company.com:8080
export HTTPS_PROXY=http://proxy.company.com:8080

# Test with different DNS
nslookup mcplookup.org 8.8.8.8

# Check firewall
sudo ufw status
```

### **SSL/TLS Issues**

#### **Symptoms**
- `Certificate verification failed`
- `SSL handshake failed`
- `UNABLE_TO_VERIFY_LEAF_SIGNATURE`

#### **Solutions**

```bash
# Update certificates
sudo apt-get update && sudo apt-get install ca-certificates

# Disable SSL verification (temporary)
export NODE_TLS_REJECT_UNAUTHORIZED=0

# Use custom CA bundle
export SSL_CERT_FILE=/path/to/ca-bundle.crt

# Check certificate
openssl s_client -connect mcplookup.org:443
```

## 🔍 Performance Issues

### **Slow Tool Calls**

#### **Symptoms**
- High latency
- Timeouts
- Slow responses

#### **Solutions**

```bash
# Monitor bridge performance
top -p $(pgrep -f mcp-bridge)

# Check Docker container resources
docker stats

# Increase timeout
export MCP_TIMEOUT=30000

# Use direct mode for better performance
await callTool('install_mcp_server', {
  mode: 'direct'  // Instead of 'bridge'
});

# Monitor network latency
ping mcplookup.org
```

### **Memory Leaks**

#### **Symptoms**
- Increasing memory usage
- Bridge becomes unresponsive
- System slowdown

#### **Solutions**

```bash
# Monitor memory usage
ps aux | grep mcp-bridge

# Restart bridge regularly
sudo systemctl restart mcp-bridge

# Increase memory limit
export NODE_OPTIONS="--max-old-space-size=4096"

# Remove unused servers
await callTool('control_mcp_server', {
  name: 'unused-server',
  action: 'remove'
});
```

## 🔐 Security Issues

### **Permission Errors**

#### **Symptoms**
- `Access denied`
- `Permission denied`
- `Unauthorized`

#### **Solutions**

```bash
# Check file permissions
ls -la ~/.mcp-bridge/
ls -la ~/Library/Application\ Support/Claude/

# Fix permissions
chmod 755 ~/.mcp-bridge/
chmod 644 ~/.mcp-bridge/config.json

# Check API key
echo $MCPLOOKUP_API_KEY

# Verify API key is valid
curl -H "Authorization: Bearer $MCPLOOKUP_API_KEY" \
     https://mcplookup.org/api/v1/user
```

### **Docker Security Issues**

#### **Symptoms**
- Container access denied
- Security policy violations
- Privilege escalation errors

#### **Solutions**

```bash
# Check Docker security settings
docker info | grep -i security

# Use rootless Docker
dockerd-rootless-setuptool.sh install

# Add security options
docker run --security-opt no-new-privileges \
           --read-only \
           --tmpfs /tmp \
           image:tag
```

## 📊 Logging and Monitoring

### **Enable Comprehensive Logging**

```bash
# Start with debug logging
DEBUG=mcp-bridge:* mcp-bridge --debug

# Log to file
mcp-bridge --debug > bridge.log 2>&1

# Rotate logs
logrotate -f /etc/logrotate.d/mcp-bridge
```

### **Monitor System Resources**

```bash
# CPU and memory usage
htop

# Docker container stats
docker stats

# Network connections
netstat -tulpn | grep mcp-bridge

# Disk usage
df -h
du -sh ~/.mcp-bridge/
```

## 🆘 Getting Help

### **Collect Diagnostic Information**

```bash
# System information
uname -a
node --version
docker --version
mcp-bridge --version

# Configuration
cat ~/.mcp-bridge/config.json
echo $MCPLOOKUP_API_KEY | head -c 10

# Logs
tail -n 100 ~/.mcp-bridge/logs/bridge.log

# Running processes
ps aux | grep -E "(mcp|docker|claude)"
```

### **Create Support Request**

When reporting issues, include:

1. **System Information**: OS, Node.js version, Docker version
2. **Bridge Version**: `mcp-bridge --version`
3. **Configuration**: Sanitized config file
4. **Error Messages**: Complete error output
5. **Steps to Reproduce**: Detailed reproduction steps
6. **Logs**: Relevant log entries

### **Support Channels**

- **🐛 GitHub Issues**: [Report bugs](https://github.com/MCPLookup-org/mcp-bridge/issues)
- **💬 Discussions**: [Ask questions](https://github.com/MCPLookup-org/mcp-bridge/discussions)
- **📧 Email**: support@mcplookup.org
- **📚 Documentation**: [Complete guides](./README.md)

## 🔄 Recovery Procedures

### **Complete Reset**

```bash
# Stop bridge
pkill -f mcp-bridge

# Remove all containers
docker rm -f $(docker ps -aq --filter "name=mcp-")

# Clear configuration
rm -rf ~/.mcp-bridge/

# Reinstall bridge
npm uninstall -g @mcplookup-org/mcp-bridge
npm install -g @mcplookup-org/mcp-bridge

# Start fresh
mcp-bridge
```

### **Backup and Restore**

```bash
# Backup configuration
tar -czf mcp-bridge-backup.tar.gz ~/.mcp-bridge/ ~/Library/Application\ Support/Claude/

# Restore configuration
tar -xzf mcp-bridge-backup.tar.gz -C /
```

---

**Still having issues?** Don't hesitate to reach out for help:
- [📝 Create an Issue](https://github.com/MCPLookup-org/mcp-bridge/issues/new)
- [💬 Start a Discussion](https://github.com/MCPLookup-org/mcp-bridge/discussions/new)
- [📧 Email Support](mailto:support@mcplookup.org)
