# 🌉 MCPL CLI - Enhanced MCP Server Management

**MCPL** (MCP Lookup) is an enhanced command-line tool for managing Model Context Protocol (MCP) servers. It provides **Smithery parity and beyond** with powerful features backed by mcplookup.org.

## 🚀 **Installation**

```bash
npm install -g @mcplookup-org/mcp-bridge
```

## 🎯 **Quick Start**

```bash
# Search for servers
mcpl search "email automation"

# Install a server
mcpl install @company/email-server

# List installed servers
mcpl list

# Check status
mcpl status

# Get help
mcpl --help
```

## 📋 **Commands**

### **🔍 Discovery & Search**
```bash
# Search with natural language
mcpl search "file management tools"
mcpl search --category productivity --verified

# Smart AI-powered search
mcpl search "I need to automate email" --smart

# List available servers
mcpl list available
```

### **🚀 Installation & Management**
```bash
# Install in direct mode (permanent, requires restart)
mcpl install @company/server --client claude

# Install in bridge mode (dynamic, instant)
mcpl install @company/server --mode bridge --auto-start

# Install Docker servers
mcpl install company/server:latest

# Install with configuration
mcpl install server --config '{"apiKey":"key","path":"/data"}'

# Dry run (see what would be installed)
mcpl install server --dry-run
```

### **🗑️ Removal**
```bash
# Uninstall server
mcpl uninstall server-name

# Force removal with cleanup
mcpl uninstall server-name --force --cleanup

# Remove from specific mode
mcpl uninstall server-name --mode direct
```

### **📊 Status & Monitoring**
```bash
# Show server status
mcpl status

# Real-time monitoring
mcpl status --watch

# Check specific client
mcpl status --client claude

# JSON output
mcpl status --format json
```

### **🔍 Inspection & Testing**
```bash
# Inspect server details
mcpl inspect server-name

# Show available tools
mcpl inspect server-name --tools

# Interactive tool testing
mcpl inspect server-name --interactive

# Health check
mcpl inspect server-name --health
```

### **▶️ Runtime Management**
```bash
# Run server temporarily
mcpl run server-name

# Run with custom config
mcpl run server-name --config '{"debug":true}'

# Run in background
mcpl run server-name --detach
```

### **🏥 Health & Maintenance**
```bash
# System health check
mcpl health

# Check specific server
mcpl health --server server-name

# Auto-fix issues
mcpl health --fix

# Generate health report
mcpl health --report
```

### **🔑 Authentication**
```bash
# Login to MCPLookup
mcpl login

# Login with API key
mcpl login --key your-api-key
```

### **📋 Listing**
```bash
# List installed servers
mcpl list servers

# List available clients
mcpl list clients

# List with status info
mcpl list --status

# Filter by mode
mcpl list --mode bridge
mcpl list --mode direct
```

## 🌟 **Enhanced Features Beyond Smithery**

### **🔍 Smart Discovery**
- **Natural Language Search**: "Find email automation tools"
- **AI-Powered Recommendations**: Smart matching based on intent
- **Category Filtering**: Filter by productivity, development, etc.
- **Verification Status**: Show only verified servers

### **🔄 Hybrid Installation Modes**
- **Direct Mode**: Permanent installation (like Smithery)
- **Bridge Mode**: Dynamic installation with instant availability
- **Auto-restart**: Automatic server recovery
- **Health Monitoring**: Real-time server health checks

### **🐳 Docker Support**
- **Container Management**: Full Docker container support
- **Resource Limits**: CPU and memory constraints
- **Security**: Isolated execution environments
- **Auto-cleanup**: Automatic container cleanup

### **📊 Advanced Monitoring**
- **Real-time Status**: Live server monitoring with `--watch`
- **Health Checks**: Comprehensive system health analysis
- **Auto-fix**: Automatic issue resolution
- **Performance Metrics**: Server performance tracking

### **💾 Configuration Management**
- **Backup/Restore**: Configuration backup and restore
- **Environment Variables**: Advanced environment management
- **Profiles**: Multiple configuration profiles
- **Validation**: Configuration validation and testing

## 🆚 **Smithery Comparison**

| Feature | Smithery | MCPL | Advantage |
|---------|----------|------|-----------|
| **Installation** | Direct only | Direct + Bridge | ✅ Instant testing |
| **Search** | Basic | AI-powered | ✅ Natural language |
| **Docker** | ❌ | ✅ Full support | ✅ Container isolation |
| **Health Checks** | ❌ | ✅ Comprehensive | ✅ Auto-fix issues |
| **Real-time Status** | ❌ | ✅ Live monitoring | ✅ Watch mode |
| **Backup/Restore** | ❌ | ✅ Full backup | ✅ Config management |
| **Auto-restart** | ❌ | ✅ Automatic | ✅ High availability |
| **Registry** | Smithery only | MCPLookup.org | ✅ Larger registry |

## 🔧 **Configuration**

### **API Key Setup**
```bash
# Interactive login
mcpl login

# Direct API key
mcpl login --key your-mcplookup-api-key
```

Get your API key from: https://mcplookup.org/dashboard

### **Global Configuration**
```bash
# View configuration
mcpl config list

# Set default client
mcpl config set defaultClient claude

# Set default mode
mcpl config set defaultMode bridge
```

## 📚 **Examples**

### **Complete Workflow**
```bash
# 1. Search for a server
mcpl search "file system tools"

# 2. Install in bridge mode for testing
mcpl install @company/filesystem --mode bridge

# 3. Test the server
mcpl inspect @company/filesystem --interactive

# 4. Install permanently if satisfied
mcpl install @company/filesystem --mode direct

# 5. Monitor health
mcpl health --server @company/filesystem
```

### **Development Workflow**
```bash
# Install for development
mcpl install ./my-server --mode bridge --auto-start

# Monitor in real-time
mcpl status --watch

# Test tools interactively
mcpl inspect my-server --interactive

# Check health and fix issues
mcpl health --fix
```

## 🔗 **Integration**

### **Claude Desktop**
MCPL automatically manages Claude Desktop configuration for direct mode installations.

### **Docker**
Full Docker support with automatic container management and security.

### **CI/CD**
```bash
# Automated testing
mcpl install server --mode bridge --config '{"test":true}'
mcpl health --server server --report
mcpl uninstall server --force
```

## 🆘 **Troubleshooting**

### **Common Issues**
```bash
# Server not starting
mcpl health --server server-name --fix

# Configuration issues
mcpl inspect server-name --config

# Docker problems
mcpl health --report

# API connectivity
mcpl login --key new-api-key
```

### **Debug Mode**
```bash
# Verbose logging
mcpl install server --verbose

# Watch mode for monitoring
mcpl status --watch

# Health report
mcpl health --report
```

## 🤝 **Contributing**

MCPL is part of the MCPLookup.org ecosystem. Contributions welcome!

- **GitHub**: https://github.com/mcplookup-org/mcp-bridge
- **Registry**: https://mcplookup.org
- **Documentation**: https://docs.mcplookup.org

## 📄 **License**

MIT License - see LICENSE file for details.

---

**🌟 MCPL - Where MCP server management meets excellence!**
