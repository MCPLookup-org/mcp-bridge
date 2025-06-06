# 🌉 MCP Bridge - Hybrid Server Management

**The Universal Gateway for Model Context Protocol (MCP) Server Management**

[![npm version](https://badge.fury.io/js/@mcplookup-org%2Fmcp-bridge.svg)](https://www.npmjs.com/package/@mcplookup-org/mcp-bridge)
[![Docker](https://img.shields.io/docker/v/mcplookup/mcp-bridge?label=docker)](https://hub.docker.com/r/mcplookup/mcp-bridge)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

The MCP Bridge is a revolutionary platform that provides **hybrid MCP server management**, combining dynamic runtime management with static configuration approaches. It serves as a universal gateway for discovering, installing, and managing MCP servers with unprecedented flexibility.

## 🎯 What Makes MCP Bridge Special?

### **🔄 Hybrid Installation Modes**
- **Bridge Mode**: Dynamic runtime management with Docker isolation
- **Direct Mode**: Smithery-compatible Claude Desktop configuration
- **Seamless Migration**: Move between modes effortlessly

### **🚀 Universal Server Management**
- **Instant Installation**: No restart required (bridge mode)
- **Production Ready**: Permanent installations (direct mode)
- **Docker Isolation**: Secure container execution
- **Tool Delegation**: Automatic tool registration and routing

### **🔍 Comprehensive Discovery**
- **Natural Language Search**: Find servers using plain English
- **AI-Powered Recommendations**: Smart server suggestions
- **Registry Integration**: Access to mcplookup.org ecosystem
- **Health Monitoring**: Real-time server status tracking

## 🚀 Quick Start

### **Installation**

```bash
# Install globally
npm install -g @mcplookup-org/mcp-bridge

# Start the bridge
mcp-bridge
```

### **Your First Server (Bridge Mode)**

```javascript
// Install a filesystem server instantly
await callTool('install_mcp_server', {
  name: 'filesystem',
  type: 'npm',
  command: '@modelcontextprotocol/server-filesystem',
  mode: 'bridge'  // Dynamic management
});

// Use tools immediately (no restart needed!)
await callTool('filesystem_read_file', {
  path: '/documents/example.txt'
});
```

### **Production Installation (Direct Mode)**

```javascript
// Install for permanent use
await callTool('install_mcp_server', {
  name: 'production-email',
  type: 'npm',
  command: '@company/email-server',
  mode: 'direct',  // Claude Desktop config
  env: {
    'API_KEY': 'your-production-key'
  }
});

// Restart Claude Desktop, then use with native names:
await callTool('send_email', {  // No prefix needed
  to: 'team@company.com',
  subject: 'Production Ready!'
});
```

## 🛠️ Available Tools

### **🔍 Core Discovery & Invocation (8 tools)**
- `discover_mcp_servers` - Search for MCP servers
- `discover_smart` - AI-powered server discovery
- `register_server` - Register new MCP servers
- `verify_domain` - Domain verification for registration
- `check_domain_ownership` - Check domain ownership status
- `get_server_health` - Server health metrics
- `get_onboarding_state` - User onboarding progress
- `invoke_tool` - Call any MCP server dynamically

### **🔧 Server Management (5 tools)**
- `install_mcp_server` - Install servers (bridge or direct mode)
- `list_managed_servers` - List bridge-managed servers
- `control_mcp_server` - Start/stop/restart/remove servers
- `list_claude_servers` - List Claude Desktop config servers
- `remove_claude_server` - Remove servers from Claude config

### **⚡ Dynamic Tools**
- **Auto-generated tools** from installed servers
- **Prefixed naming** (bridge mode): `server-name_tool-name`
- **Native naming** (direct mode): `tool-name`

## 🎯 Use Cases

### **🧪 Development & Testing**
```javascript
// Test multiple email servers
await callTool('install_mcp_server', {
  name: 'gmail-test',
  type: 'docker',
  command: 'docker run -i gmail-server:latest',
  mode: 'bridge'
});

await callTool('install_mcp_server', {
  name: 'outlook-test',
  type: 'docker', 
  command: 'docker run -i outlook-server:latest',
  mode: 'bridge'
});

// Compare performance
await callTool('gmail-test_send_email', {...});
await callTool('outlook-test_send_email', {...});
```

### **🏭 Production Deployment**
```javascript
// Core production servers
const productionServers = [
  '@modelcontextprotocol/server-filesystem',
  '@company/database-server',
  '@company/email-server'
];

for (const server of productionServers) {
  await callTool('install_mcp_server', {
    name: server.replace(/[@\/]/g, '-'),
    type: 'npm',
    command: server,
    mode: 'direct'  // Permanent installation
  });
}
```

### **🔄 Hybrid Workflow**
```javascript
// 1. Experiment in bridge mode
await callTool('install_mcp_server', {
  name: 'experimental',
  type: 'npm',
  command: '@company/new-server',
  mode: 'bridge'
});

// 2. Test thoroughly
await callTool('experimental_new_feature', {...});

// 3. If satisfied, deploy permanently
await callTool('control_mcp_server', {
  name: 'experimental',
  action: 'remove'
});

await callTool('install_mcp_server', {
  name: 'production-feature',
  type: 'npm',
  command: '@company/new-server',
  mode: 'direct'
});
```

## 📊 Bridge vs Direct Mode Comparison

| Aspect | Bridge Mode | Direct Mode |
|--------|-------------|-------------|
| **Installation Speed** | Instant | Restart required |
| **Tool Names** | Prefixed | Native |
| **Performance** | +5-10ms overhead | Native speed |
| **Persistence** | Session-based | Permanent |
| **Isolation** | Docker containers | OS processes |
| **Best For** | Development, testing | Production, daily use |

## 🔧 Advanced Usage

### **Environment Variables**
```javascript
await callTool('install_mcp_server', {
  name: 'secure-api',
  type: 'docker',
  command: 'docker run -i secure/api:latest',
  mode: 'bridge',
  env: {
    'API_KEY': process.env.SECURE_API_KEY,
    'DEBUG': 'true',
    'TIMEOUT': '30000'
  }
});
```

### **Server Lifecycle Management**
```javascript
// Monitor servers
await callTool('list_managed_servers');

// Control lifecycle
await callTool('control_mcp_server', {
  name: 'api-server',
  action: 'restart'  // start, stop, restart, remove
});

// Health monitoring
setInterval(async () => {
  const servers = await callTool('list_managed_servers');
  for (const server of servers) {
    if (server.status === 'error') {
      await callTool('control_mcp_server', {
        name: server.name,
        action: 'restart'
      });
    }
  }
}, 60000);
```

### **Discovery and Installation Pipeline**
```javascript
// 1. Discover servers
const discovery = await callTool('discover_mcp_servers', {
  query: 'productivity automation tools'
});

// 2. Install top results
for (const server of discovery.servers.slice(0, 3)) {
  await callTool('install_mcp_server', {
    name: server.name.toLowerCase().replace(/\s+/g, '-'),
    type: 'npm',
    command: server.npm_package,
    mode: 'bridge'
  });
}

// 3. Test and evaluate
// 4. Promote best ones to direct mode
```

## 🐳 Docker Support

### **Run Bridge in Docker**
```bash
docker run -d \
  --name mcp-bridge \
  -p 3000:3000 \
  -v /var/run/docker.sock:/var/run/docker.sock \
  -e MCPLOOKUP_API_KEY=your-key \
  mcplookup/mcp-bridge:latest
```

### **Docker Compose**
```yaml
version: '3.8'
services:
  mcp-bridge:
    image: mcplookup/mcp-bridge:latest
    ports:
      - "3000:3000"
    environment:
      - MCPLOOKUP_API_KEY=${MCPLOOKUP_API_KEY}
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
    restart: unless-stopped
```

## 📚 Documentation

### **📖 Getting Started**
- [🚀 Installation Guide](./docs/installation.md)
- [🎓 Your First Server Tutorial](./docs/tutorials/first-server.md)
- [🔄 Installation Modes](./docs/installation-modes.md)

### **📋 API Reference**
- [🔍 Core Tools API](./docs/api/core-tools.md)
- [🔧 Server Management API](./docs/api/server-management.md)
- [⚡ Dynamic Tools](./docs/api/dynamic-tools.md)

### **🎯 Usage Guides**
- [🔧 Bridge Mode Guide](./docs/guides/bridge-mode.md)
- [📝 Direct Mode Guide](./docs/guides/direct-mode.md)
- [🔄 Hybrid Workflows](./docs/guides/hybrid-workflows.md)

### **⚖️ Comparisons**
- [🆚 MCP Bridge vs Smithery](./docs/comparisons/smithery.md)
- [📊 Mode Comparison](./docs/comparisons/modes.md)

### **🔧 Advanced Topics**
- [🏗️ Architecture Overview](./docs/architecture.md)
- [🔒 Security Model](./docs/security.md)
- [🐳 Docker Integration](./docs/docker-setup.md)
- [🔧 Troubleshooting](./docs/troubleshooting.md)

## 🤝 Contributing

We welcome contributions! See our [Contributing Guide](./CONTRIBUTING.md) for details.

### **Development Setup**
```bash
git clone https://github.com/MCPLookup-org/mcp-bridge.git
cd mcp-bridge
npm install
npm run build
npm run dev
```

## 📞 Support

- **🐛 Bug Reports**: [GitHub Issues](https://github.com/MCPLookup-org/mcp-bridge/issues)
- **💬 Questions**: [GitHub Discussions](https://github.com/MCPLookup-org/mcp-bridge/discussions)
- **📧 Email**: support@mcplookup.org
- **📚 Documentation**: [Complete Docs](./docs/)

## 🎉 What's New

### **v1.0.0 - Hybrid Server Management**
- ✅ **Bridge Mode**: Dynamic runtime server management
- ✅ **Direct Mode**: Smithery-compatible static configuration
- ✅ **Tool Delegation**: Automatic tool registration and routing
- ✅ **Docker Integration**: Secure container isolation
- ✅ **Comprehensive API**: 13+ tools for complete server management
- ✅ **Production Ready**: Enterprise-grade reliability and security

## 📄 License

MIT License - see [LICENSE](./LICENSE) for details.

---

**Ready to revolutionize your MCP workflow?** 🚀

[📖 Get Started](./docs/installation.md) | [🎓 First Tutorial](./docs/tutorials/first-server.md) | [📋 API Docs](./docs/api/) | [💬 Community](https://github.com/MCPLookup-org/mcp-bridge/discussions)
