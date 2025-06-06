# 🌉 MCPLookup Bridge
### *The Universal MCP Client That Eliminates Hardcoded Server Lists Forever*

<div align="center">

[![npm version](https://img.shields.io/npm/v/@mcplookup-org/mcp-bridge?style=for-the-badge&logo=npm&color=CB3837)](https://www.npmjs.com/package/@mcplookup-org/mcp-bridge)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://hub.docker.com/r/mcplookup/mcp-bridge)
[![MCP Protocol](https://img.shields.io/badge/MCP-Compatible-4A90E2?style=for-the-badge&logo=protocol&logoColor=white)](https://modelcontextprotocol.io)
[![TypeScript](https://img.shields.io/badge/TypeScript-100%25-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)
[![API Parity](https://img.shields.io/badge/API%20Parity-100%25-success?style=for-the-badge)](https://mcplookup.org/api/v1)
[![Production Ready](https://img.shields.io/badge/Production-Ready-brightgreen?style=for-the-badge&logo=checkmarx)](https://github.com/MCPLookup-org/mcp-bridge)

</div>

---

## 🚀 **The Revolution Starts Here**

**Stop hardcoding MCP servers.** The MCPLookup Bridge is the **first and only** universal MCP client that provides dynamic discovery and connection to **any MCP server in the ecosystem**.

### **🔥 Before vs After**

<table>
<tr>
<td width="50%">

**😤 BEFORE: The Old Way**
```json
{
  "mcpServers": {
    "gmail": { "command": "node", "args": ["/path/to/gmail"] },
    "github": { "command": "node", "args": ["/path/to/github"] },
    "slack": { "command": "node", "args": ["/path/to/slack"] },
    "notion": { "command": "node", "args": ["/path/to/notion"] },
    "calendar": { "command": "node", "args": ["/path/to/calendar"] },
    "drive": { "command": "node", "args": ["/path/to/drive"] }
    // ... manually configure 50+ servers
  }
}
```
❌ **50+ manual configurations**  
❌ **Constant maintenance**  
❌ **No discovery**  
❌ **Static, brittle setup**

</td>
<td width="50%">

**🎉 AFTER: The Bridge Way**
```json
{
  "mcpServers": {
    "mcplookup-bridge": {
      "command": "npx",
      "args": ["@mcplookup-org/mcp-bridge"]
    }
  }
}
```
✅ **ONE configuration**  
✅ **Zero maintenance**  
✅ **Dynamic discovery**  
✅ **Infinite scalability**

</td>
</tr>
</table>

### **🎯 What This Means**

> **"Find email servers"** → Claude discovers Gmail, Outlook, ProtonMail...  
> **"I need document tools"** → Claude finds Notion, Google Docs, Obsidian...  
> **"Connect to my company's MCP server"** → Claude discovers and connects automatically  

**Result**: Access to **every MCP server ever created** through **one bridge connection**.

---

## ⚡ **Quick Start: 3 Ways to Deploy**

### 🔧 **Option 1: NPM** (Development)
```bash
npx @mcplookup-org/mcp-bridge
```

### 🐳 **Option 2: Docker** (Recommended)
```bash
docker run -d --name mcp-bridge \
  -e MCPLOOKUP_API_KEY=your_key_here \
  mcplookup/mcp-bridge:latest
```

### 🌐 **Option 3: Remote** (Production)
```bash
# Deploy remotely
docker run -d -p 3000:3000 \
  -e MCPLOOKUP_API_KEY=your_key_here \
  -e MCP_HTTP_MODE=true \
  mcplookup/mcp-bridge:latest

# Connect from Claude Desktop
{
  "mcpServers": {
    "mcplookup-bridge": {
      "command": "npx",
      "args": ["@modelcontextprotocol/cli", "client", "sse://your-server.com:3000/mcp"]
    }
  }
}
```

---

## 🎯 **Claude Desktop Integration**

Choose your deployment pattern:

| Pattern | Use Case | Configuration |
|---------|----------|---------------|
| **🔧 Local NPM** | Development, Testing | `"command": "npx", "args": ["@mcplookup-org/mcp-bridge"]` |
| **🐳 Local Docker** | Daily Use, Reliability | `"command": "docker", "args": ["run", "--rm", "-i", "mcplookup/mcp-bridge"]` |
| **🌐 Remote HTTP** | Teams, Enterprise | `"command": "npx", "args": ["@modelcontextprotocol/cli", "client", "sse://server:3000/mcp"]` |

**Now Claude can:**
- 🔍 **"Find email servers"** → Discovers Gmail, Outlook, ProtonMail
- 📝 **"I need document tools"** → Finds Notion, Google Docs, Obsidian  
- 🏢 **"Connect to my company's server"** → Auto-discovers and connects
- 🔧 **"Call the search tool on GitHub"** → Dynamic tool invocation

---

## 🛠️ **8 Powerful MCP Tools**

### **🔍 Discovery**
- **`discover_mcp_servers`** - Natural language server search
- **`discover_smart`** - AI-powered recommendations

### **⚙️ Management**  
- **`register_server`** - Add new servers to the directory
- **`verify_domain`** - DNS ownership verification
- **`check_domain_ownership`** - Verification status

### **📊 Monitoring**
- **`get_server_health`** - Real-time health metrics
- **`get_onboarding_state`** - User analytics

### **🌐 Universal**
- **`invoke_tool`** - Call ANY MCP server dynamically

---

## 🔐 **Authentication**

| Feature | Free | With API Key |
|---------|------|--------------|
| Discovery | ✅ Basic | ✅ Enhanced |
| Smart Search | ✅ Limited | ✅ Advanced AI |
| Registration | ❌ | ✅ Full Access |
| Health Monitoring | ✅ Basic | ✅ Real-time |
| Rate Limits | 100/hour | 1,000/hour |

**Get your API key**: [mcplookup.org](https://mcplookup.org) → Dashboard → API Keys

---

## 📈 **By the Numbers**

<div align="center">

| Metric | Value | Impact |
|:-------|:------|:-------|
| **🔧 Configuration Reduction** | 50+ → 1 | 98% less setup |
| **⚡ Discovery Speed** | < 100ms | Real-time results |
| **🌐 Server Coverage** | Unlimited | Infinite scalability |
| **🔒 Security Features** | 5+ layers | Enterprise-grade |
| **📦 Deployment Options** | 3 patterns | Maximum flexibility |
| **🛠️ MCP Tools** | 8 powerful | Complete API parity |

</div>

---

## 🏗️ **Architecture**

```mermaid
graph TB
    A[Claude Desktop] --> B[MCPLookup Bridge]
    B --> C[MCPLookup.org API]
    B --> D[Gmail MCP Server]
    B --> E[GitHub MCP Server]
    B --> F[Slack MCP Server]
    B --> G[Any MCP Server]
    
    style A fill:#e1f5fe
    style B fill:#f3e5f5
    style C fill:#e8f5e8
    style D fill:#fff3e0
    style E fill:#fff3e0
    style F fill:#fff3e0
    style G fill:#fff3e0
```

**One bridge → Infinite possibilities**

---

## ✨ **Key Features**

<div align="center">

| 🎯 **Smart Discovery** | 🔐 **Enterprise Security** | 🚀 **Production Ready** |
|:---:|:---:|:---:|
| AI-powered server matching | API key authentication | Docker containerization |
| Natural language queries | Rate limiting & monitoring | Health checks & logging |
| Intent-based recommendations | Domain verification | Multi-transport support |

| 🌐 **Universal Access** | 📊 **Real-time Monitoring** | 🔧 **Developer Friendly** |
|:---:|:---:|:---:|
| Call any MCP server | Live health metrics | TypeScript support |
| Dynamic tool invocation | Performance analytics | OpenAPI generated client |
| Multiple transport protocols | Uptime tracking | Comprehensive documentation |

</div>

---

## 🔧 **Tool Examples**

### **🔍 Discovery in Action**

```typescript
// Natural language search
await callTool('discover_mcp_servers', {
  query: "email management tools",
  limit: 5
});

// AI-powered smart discovery
await callTool('discover_smart', {
  query: "I need tools for customer emails and scheduling",
  include_reasoning: true
});
```

### **🌐 Universal Tool Invocation**

```typescript
// Call ANY MCP server dynamically
await callTool('invoke_tool', {
  endpoint: "https://gmail.com/mcp",
  tool_name: "send_email",
  arguments: {
    to: "user@example.com",
    subject: "Hello from Claude!",
    body: "Sent via dynamic MCP discovery!"
  },
  auth_headers: {
    "Authorization": "Bearer gmail_token"
  }
});
```

### **⚙️ Server Management**

```typescript
// Register your company's MCP server
await callTool('register_server', {
  domain: "mycompany.com",
  endpoint: "https://mycompany.com/mcp",
  contact_email: "admin@mycompany.com"
});

// Check server health
await callTool('get_server_health', {
  domain: "gmail.com",
  realtime: true
});
```

## 📚 **Documentation**

- 📖 **[Complete API Reference](./docs/API.md)** - All 8 tools documented
- 🐳 **[Docker Deployment Guide](./DOCKER.md)** - Production deployment
- 🔐 **[Authentication Examples](./examples/auth-examples.md)** - Security patterns
- 🔧 **[Development Guide](./docs/DEVELOPMENT.md)** - Contributing

---

## 🌟 **Why MCPLookup Bridge?**

### **🚀 For Developers**
- **Zero Integration Effort** - Works with any MCP client
- **Type-Safe** - Full TypeScript support
- **Production Ready** - Docker, health checks, monitoring

### **🎯 For Users**
- **One Configuration** - Replace 50+ server configs
- **Auto-Discovery** - New servers work automatically
- **Always Updated** - No manual maintenance

### **🏢 For Teams**
- **Scalable** - Remote deployment options
- **Secure** - Authentication and rate limiting
- **Reliable** - Health monitoring and failover

---

## 🎭 **Real-World Use Cases**

<div align="center">

### **📧 Email Management**
*"Find email servers" → Claude discovers Gmail, Outlook, ProtonMail*
```
User: "I need to send a newsletter to my customers"
Claude: Discovering email servers... Found Gmail MCP server
Claude: Calling send_bulk_email tool...
```

### **📝 Document Workflow**
*"I need document tools" → Claude finds Notion, Google Docs, Obsidian*
```
User: "Create a project proposal document"
Claude: Discovering document servers... Found Notion MCP server
Claude: Creating document with template...
```

### **🏢 Enterprise Integration**
*"Connect to our CRM" → Claude auto-discovers company MCP servers*
```
User: "Get customer data for ACME Corp"
Claude: Discovering company.com MCP servers... Found CRM server
Claude: Retrieving customer records...
```

</div>

---

## 🤝 **Contributing**

We welcome contributions! See our [Contributing Guide](./CONTRIBUTING.md) for details.

### **Quick Development Setup**
```bash
git clone https://github.com/MCPLookup-org/mcp-bridge.git
cd mcp-bridge
npm install
npm run build
npm run dev
```

---

## 🗺️ **Roadmap**

### **✅ Completed (v1.0)**
- ✅ Universal MCP bridge with 8 tools
- ✅ Docker containerization & production deployment
- ✅ Three deployment patterns (NPM, Docker, Remote)
- ✅ Authentication & rate limiting
- ✅ Real-time health monitoring
- ✅ TypeScript support & OpenAPI client

### **🚧 In Progress (v1.1)**
- 🔄 WebSocket transport support
- 🔄 Advanced caching & performance optimization
- 🔄 Kubernetes deployment manifests
- 🔄 Prometheus metrics integration

### **🔮 Planned (v2.0)**
- 🎯 GraphQL API support
- 🎯 Multi-region deployment
- 🎯 Advanced AI-powered server recommendations
- 🎯 Plugin system for custom tools

---

## ❓ **Frequently Asked Questions**

<details>
<summary><strong>🤔 How does this eliminate hardcoded server lists?</strong></summary>

Instead of manually configuring each MCP server in Claude Desktop, you configure **one bridge** that can dynamically discover and connect to **any MCP server** in the ecosystem. The bridge acts as a universal proxy.

</details>

<details>
<summary><strong>🔒 Is it secure to use one bridge for everything?</strong></summary>

Yes! The bridge uses the same security model as individual MCP servers:
- API key authentication for mcplookup.org
- Per-server authentication headers for external servers
- Rate limiting and monitoring
- Docker isolation and security hardening

</details>

<details>
<summary><strong>⚡ What's the performance impact?</strong></summary>

Minimal! Discovery calls are cached, and the bridge adds only ~10-20ms latency. The universal `invoke_tool` connects directly to target servers, so there's no performance penalty for actual tool calls.

</details>

<details>
<summary><strong>🌐 Can I use this with my company's private MCP servers?</strong></summary>

Absolutely! Register your company's MCP servers with mcplookup.org (with domain verification), and the bridge will discover them automatically. Perfect for enterprise environments.

</details>

<details>
<summary><strong>🔧 What if a server isn't registered with mcplookup.org?</strong></summary>

You can still use the `invoke_tool` to call any MCP server directly by providing its endpoint URL. The bridge works with **any MCP server**, registered or not.

</details>

---

## 📄 **License**

MIT License - see [LICENSE](./LICENSE) for details.

---

<div align="center">

**🌉 Built with ❤️ by the MCPLookup.org team**

[Website](https://mcplookup.org) • [Documentation](https://docs.mcplookup.org) • [Discord](https://discord.gg/mcplookup) • [Twitter](https://twitter.com/mcplookup)

</div>
