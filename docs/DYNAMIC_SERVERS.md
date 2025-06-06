# 🔧 Hybrid MCP Server Management

The MCP Bridge now supports **both dynamic and static installation** of MCP servers, combining the best of both Smithery-style and bridge-managed approaches.

## 🎯 Key Features

### **Hybrid Installation Modes**
1. **Bridge Mode** (Dynamic): Runtime server management with tool delegation
2. **Direct Mode** (Smithery-style): Claude Desktop config modification

### **Dynamic Tool Delegation** (Bridge Mode)
- Install MCP servers and their tools become available as bridge tools
- Tools are prefixed with server name (e.g., `gmail_send_email`)
- Automatic delegation to the appropriate running server
- No need to manually use `invoke_tool`!

### **Static Configuration** (Direct Mode)
- Modifies Claude Desktop config directly (like Smithery)
- Permanent installation until manually removed
- Direct connection (no proxy overhead)
- Requires Claude Desktop restart

### **Two Installation Types**
1. **Docker Commands**: Ready-to-run Docker containers
2. **NPM Packages**: Automatically dockerized (bridge) or configured (direct)

### **Complete Lifecycle Management**
- Install, start, stop, restart, and remove servers
- Health monitoring and status tracking
- Graceful shutdown handling
- Config file management for direct mode

## 🚀 Quick Start

### Bridge Mode (Dynamic Management)
```javascript
// Install Gmail MCP server in bridge mode (default)
await callTool('install_mcp_server', {
  name: 'gmail',
  type: 'docker',
  command: 'docker run -i mcplookup/gmail-server:latest',
  mode: 'bridge'  // Dynamic management
});

// Tools are immediately available with prefix:
await callTool('gmail_send_email', {
  to: 'user@example.com',
  subject: 'Hello from MCP!',
  body: 'This email was sent via dynamically managed MCP server!'
});
```

### Direct Mode (Smithery-style)
```javascript
// Install filesystem server in direct mode
await callTool('install_mcp_server', {
  name: 'filesystem',
  type: 'npm',
  command: '@modelcontextprotocol/server-filesystem',
  mode: 'direct'  // Claude Desktop config
});

// Restart Claude Desktop, then tools are available natively:
await callTool('read_file', {  // No prefix needed
  path: '/path/to/document.txt'
});
```

### Hybrid Workflow
```javascript
// Use bridge mode for experimentation
await callTool('install_mcp_server', {
  name: 'test-server',
  type: 'npm',
  command: '@company/experimental-server',
  mode: 'bridge'
});

// Test the server...
await callTool('test-server_some_tool', {...});

// If satisfied, install permanently
await callTool('install_mcp_server', {
  name: 'experimental-server',
  type: 'npm',
  command: '@company/experimental-server',
  mode: 'direct'  // Permanent installation
});
```

## 📋 Available Management Tools

### `install_mcp_server`
Install an MCP server in bridge or direct mode.

**Parameters:**
- `name` (string): Local name for the server
- `type` ('docker' | 'npm'): Installation type
- `command` (string): Docker command or npm package name
- `mode` ('bridge' | 'direct', default: 'bridge'): Installation mode
- `auto_start` (boolean, default: true): Start immediately (bridge mode only)
- `env` (object, optional): Environment variables

### Bridge Mode Tools

### `list_managed_servers`
List all bridge-managed servers with their status and available tools.

### `control_mcp_server`
Control bridge-managed server lifecycle.

**Parameters:**
- `name` (string): Server name
- `action` ('start' | 'stop' | 'restart' | 'remove'): Action to perform

### Direct Mode Tools

### `list_claude_servers`
List all servers in Claude Desktop configuration.

### `remove_claude_server`
Remove a server from Claude Desktop configuration.

**Parameters:**
- `name` (string): Server name to remove

## 🔄 Complete Workflow Example

```javascript
// 1. Discover available servers
const discovery = await callTool('discover_mcp_servers', {
  query: 'email and document tools'
});

// 2. Install servers based on discovery
await callTool('install_mcp_server', {
  name: 'gmail',
  type: 'docker',
  command: 'docker run -i mcplookup/gmail-server:latest'
});

await callTool('install_mcp_server', {
  name: 'docs',
  type: 'npm', 
  command: '@company/document-server'
});

// 3. Use tools directly (no invoke_tool needed!)
await callTool('gmail_send_email', {
  to: 'team@company.com',
  subject: 'Weekly Report',
  body: 'Please find the weekly report attached.'
});

await callTool('docs_create_document', {
  title: 'Weekly Report',
  content: 'This week we accomplished...'
});

// 4. Manage servers as needed
await callTool('list_managed_servers');
await callTool('control_mcp_server', {
  name: 'gmail',
  action: 'restart'
});
```

## 🏗️ Architecture

### Before: Manual Tool Invocation
```
User → Bridge → discover_mcp_servers → invoke_tool(endpoint, tool, args)
                     ↓
               External server (unknown status)
```

### After: Dynamic Tool Delegation
```
User → Bridge → install_mcp_server → gmail_send_email(args)
                     ↓                      ↓
               Managed server         Auto-delegation
```

## 🔒 Security & Isolation

### Docker Isolation
- Each MCP server runs in its own container
- Process isolation from host system
- Controlled resource usage
- Network isolation

### NPM Package Dockerization
- NPM packages automatically containerized
- Consistent runtime environment
- Dependency isolation
- Security scanning (future)

## 🎛️ Server Status Management

Servers can be in one of these states:
- `installing`: Being installed/dockerized
- `running`: Active and serving tools
- `stopped`: Installed but not running
- `error`: Failed to start or crashed

## 🔧 Advanced Usage

### Custom Environment Variables
```javascript
await callTool('install_mcp_server', {
  name: 'custom-server',
  type: 'docker',
  command: 'docker run -i -e API_KEY=secret custom/server:latest'
});
```

### Server Management
```javascript
// Check server status
const servers = await callTool('list_managed_servers');

// Restart a problematic server
await callTool('control_mcp_server', {
  name: 'gmail',
  action: 'restart'
});

// Remove a server completely
await callTool('control_mcp_server', {
  name: 'old-server',
  action: 'remove'
});
```

## 🚧 Current Limitations

1. **Tool Removal**: MCP SDK doesn't support dynamic tool removal (requires bridge restart)
2. **Port Management**: Random port assignment for Docker containers
3. **Persistence**: Server configurations not persisted across bridge restarts
4. **Resource Limits**: No automatic resource limiting (planned)

## 🔮 Future Enhancements

- [ ] Persistent server configurations
- [ ] Resource limits and quotas
- [ ] Health checks and auto-restart
- [ ] Server dependency management
- [ ] Custom networking configurations
- [ ] Security scanning integration
- [ ] Performance monitoring

---

**This transforms the MCP Bridge from a discovery tool into a complete MCP server management platform!** 🚀
