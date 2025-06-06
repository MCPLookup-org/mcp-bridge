# 🎓 Your First MCP Server

This tutorial will guide you through installing and using your first MCP server with the MCP Bridge. We'll start with a simple filesystem server and explore both bridge and direct modes.

## 🎯 What You'll Learn

- How to install your first MCP server
- The difference between bridge and direct modes
- How to use MCP server tools
- Basic server management
- Best practices for getting started

## 📋 Prerequisites

- MCP Bridge installed and running
- Docker installed (for bridge mode)
- Claude Desktop installed (for direct mode)
- Basic familiarity with command-line tools

## 🚀 Step 1: Start the MCP Bridge

First, let's start the MCP Bridge:

```bash
# Start the bridge
mcp-bridge

# Or if using programmatically
node -e "
const { MCPLookupBridge } = require('@mcplookup-org/mcp-bridge');
const bridge = new MCPLookupBridge();
bridge.run();
"
```

You should see output like:
```
🌉 Starting MCPLookup Bridge v1.0.0
🔧 Available tools: 13+ (8 core + 5 management + dynamic tools)
📡 API endpoint: https://mcplookup.org/api/v1
🔌 Listening on stdio...
✅ MCPLookup Bridge started successfully
```

## 🔍 Step 2: Discover Available Servers

Let's discover what MCP servers are available:

```javascript
// Discover filesystem-related servers
await callTool('discover_mcp_servers', {
  query: 'file management filesystem'
});
```

**Expected Response:**
```json
{
  "servers": [
    {
      "id": "filesystem-server",
      "name": "Filesystem MCP Server",
      "description": "Read, write, and manage files and directories",
      "npm_package": "@modelcontextprotocol/server-filesystem",
      "tools": ["read_file", "write_file", "list_directory"],
      "category": "productivity"
    }
  ]
}
```

## 🔧 Step 3: Install Your First Server (Bridge Mode)

Let's start with bridge mode for instant testing:

```javascript
// Install the filesystem server in bridge mode
await callTool('install_mcp_server', {
  name: 'my-filesystem',
  type: 'npm',
  command: '@modelcontextprotocol/server-filesystem',
  mode: 'bridge',
  auto_start: true
});
```

**Expected Response:**
```
✅ Installed my-filesystem (npm, bridge mode)
Server started and tools available with prefix: my-filesystem_
```

## 🛠️ Step 4: Use Your First MCP Tools

Now you can use the filesystem tools:

### **List Directory Contents**

```javascript
await callTool('my-filesystem_list_directory', {
  path: '/home/user/documents'
});
```

### **Read a File**

```javascript
await callTool('my-filesystem_read_file', {
  path: '/home/user/documents/example.txt'
});
```

### **Write a File**

```javascript
await callTool('my-filesystem_write_file', {
  path: '/home/user/documents/mcp-test.txt',
  content: 'Hello from MCP Bridge! This file was created using an MCP server.'
});
```

## 📊 Step 5: Monitor Your Server

Check the status of your installed server:

```javascript
// List all managed servers
await callTool('list_managed_servers');
```

**Expected Response:**
```json
[
  {
    "name": "my-filesystem",
    "type": "npm",
    "status": "running",
    "tools": ["read_file", "write_file", "list_directory"],
    "endpoint": undefined
  }
]
```

## 🎛️ Step 6: Server Lifecycle Management

Learn to control your server:

### **Stop the Server**

```javascript
await callTool('control_mcp_server', {
  name: 'my-filesystem',
  action: 'stop'
});
```

### **Start the Server**

```javascript
await callTool('control_mcp_server', {
  name: 'my-filesystem',
  action: 'start'
});
```

### **Restart the Server**

```javascript
await callTool('control_mcp_server', {
  name: 'my-filesystem',
  action: 'restart'
});
```

## 📝 Step 7: Try Direct Mode

Now let's install the same server in direct mode for permanent use:

### **Install in Direct Mode**

```javascript
await callTool('install_mcp_server', {
  name: 'filesystem-direct',
  type: 'npm',
  command: '@modelcontextprotocol/server-filesystem',
  mode: 'direct',
  env: {
    'ALLOWED_DIRS': '/home/user/documents,/home/user/projects'
  }
});
```

**Expected Response:**
```
✅ Installed filesystem-direct in Claude Desktop config (direct mode)
📋 Config updated at: /home/user/.config/Claude/claude_desktop_config.json
🔄 Please restart Claude Desktop to use the server.

Server will be available as: filesystem-direct
```

### **Check Claude Desktop Configuration**

```javascript
await callTool('list_claude_servers');
```

**Expected Response:**
```json
[
  {
    "name": "filesystem-direct",
    "command": "npx",
    "args": ["@modelcontextprotocol/server-filesystem"],
    "env": {
      "ALLOWED_DIRS": "/home/user/documents,/home/user/projects"
    },
    "mode": "direct"
  }
]
```

### **Restart Claude Desktop**

**Important:** You must manually restart Claude Desktop for direct mode servers to become available.

After restarting, you can use the tools with their native names:

```javascript
// No prefix needed in direct mode!
await callTool('read_file', {
  path: '/home/user/documents/example.txt'
});

await callTool('write_file', {
  path: '/home/user/documents/direct-mode-test.txt',
  content: 'This file was created using direct mode!'
});
```

## 🔄 Step 8: Compare the Modes

Let's compare what we've learned:

### **Bridge Mode**
- ✅ **Instant**: No restart required
- ✅ **Isolated**: Runs in Docker container
- ✅ **Temporary**: Perfect for testing
- ❌ **Prefixed**: Tools have server name prefix
- ❌ **Proxy**: Slight performance overhead

### **Direct Mode**
- ✅ **Permanent**: Survives restarts
- ✅ **Native**: Original tool names
- ✅ **Fast**: Direct connection
- ❌ **Restart**: Requires Claude Desktop restart
- ❌ **Config**: Modifies system configuration

## 🧹 Step 9: Cleanup

When you're done experimenting, clean up your installations:

### **Remove Bridge Mode Server**

```javascript
await callTool('control_mcp_server', {
  name: 'my-filesystem',
  action: 'remove'
});
```

### **Remove Direct Mode Server**

```javascript
await callTool('remove_claude_server', {
  name: 'filesystem-direct'
});
```

**Remember:** Restart Claude Desktop after removing direct mode servers.

## 🎯 Step 10: Real-World Example

Let's create a practical workflow using what we've learned:

### **Document Processing Workflow**

```javascript
// 1. Install filesystem server for file operations
await callTool('install_mcp_server', {
  name: 'docs',
  type: 'npm',
  command: '@modelcontextprotocol/server-filesystem',
  mode: 'bridge',
  env: {
    'ALLOWED_DIRS': '/home/user/documents'
  }
});

// 2. Read a document
const content = await callTool('docs_read_file', {
  path: '/home/user/documents/input.txt'
});

// 3. Process the content (example: convert to uppercase)
const processedContent = content.toUpperCase();

// 4. Write the processed content
await callTool('docs_write_file', {
  path: '/home/user/documents/output.txt',
  content: processedContent
});

// 5. List the directory to confirm
await callTool('docs_list_directory', {
  path: '/home/user/documents'
});

// 6. Clean up when done
await callTool('control_mcp_server', {
  name: 'docs',
  action: 'remove'
});
```

## 🚀 Next Steps

Congratulations! You've successfully:
- ✅ Installed your first MCP server
- ✅ Used MCP tools in both modes
- ✅ Managed server lifecycle
- ✅ Created a practical workflow

### **What to Try Next:**

1. **Explore More Servers**: Try email, database, or API servers
2. **Build Custom Workflows**: Combine multiple servers
3. **Learn Advanced Features**: Environment variables, Docker options
4. **Production Setup**: Use direct mode for daily workflows

### **Recommended Tutorials:**

- [🔧 Building a Custom Server](./custom-server.md)
- [🔄 Hybrid Setup](./hybrid-setup.md)
- [🏭 Enterprise Deployment](./enterprise.md)

### **Useful Resources:**

- [🔧 Bridge Mode Guide](../guides/bridge-mode.md)
- [📝 Direct Mode Guide](../guides/direct-mode.md)
- [📋 API Reference](../api/)
- [🔧 Troubleshooting](../troubleshooting.md)

## 💡 Pro Tips

### **Development Workflow**
```javascript
// Use bridge mode for development
await callTool('install_mcp_server', {
  name: 'dev-server',
  mode: 'bridge'  // Quick testing
});

// Move to direct mode for production
await callTool('install_mcp_server', {
  name: 'prod-server',
  mode: 'direct'  // Permanent use
});
```

### **Environment Variables**
```javascript
// Use environment variables for configuration
await callTool('install_mcp_server', {
  name: 'configured-server',
  type: 'npm',
  command: '@company/server',
  mode: 'bridge',
  env: {
    'API_KEY': process.env.MY_API_KEY,
    'DEBUG': 'true'
  }
});
```

### **Error Handling**
```javascript
try {
  await callTool('my-filesystem_read_file', {
    path: '/nonexistent/file.txt'
  });
} catch (error) {
  console.log('File not found, creating default content...');
  
  await callTool('my-filesystem_write_file', {
    path: '/home/user/documents/default.txt',
    content: 'Default content'
  });
}
```

## 🎉 Congratulations!

You've completed your first MCP server tutorial! You now understand the basics of:

- Server discovery and installation
- Bridge vs. direct mode differences
- Tool usage and server management
- Practical workflow creation

Ready to explore more advanced features? Check out the [Building a Custom Server](./custom-server.md) tutorial next!

---

**Need Help?**
- [🔧 Troubleshooting Guide](../troubleshooting.md)
- [💬 Community Discussions](https://github.com/MCPLookup-org/mcp-bridge/discussions)
- [🐛 Report Issues](https://github.com/MCPLookup-org/mcp-bridge/issues)
