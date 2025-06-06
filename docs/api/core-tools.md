# 🔍 Core Tools API

The MCP Bridge provides 8 core tools for discovering, registering, and invoking MCP servers. These tools form the foundation of the bridge's functionality.

## 📋 Overview

| Tool | Purpose | Category |
|------|---------|----------|
| `discover_mcp_servers` | Search for MCP servers | Discovery |
| `discover_smart` | AI-powered server discovery | Discovery |
| `register_server` | Register a new MCP server | Registry |
| `verify_domain` | Start domain verification | Registry |
| `check_domain_ownership` | Check domain ownership | Registry |
| `get_server_health` | Get server health metrics | Monitoring |
| `get_onboarding_state` | Get user onboarding progress | User Management |
| `invoke_tool` | Call any MCP server dynamically | Invocation |

## 🔍 Discovery Tools

### discover_mcp_servers

Search for MCP servers in the mcplookup.org registry.

#### **Syntax**

```javascript
await callTool('discover_mcp_servers', {
  query: string,           // Required: Search query
  limit?: number,          // Optional: Max results (default: 10)
  category?: string,       // Optional: Filter by category
  tags?: string[]         // Optional: Filter by tags
});
```

#### **Parameters**

- **query** (required): Natural language search query
- **limit** (optional): Maximum number of results (1-50, default: 10)
- **category** (optional): Filter by server category
- **tags** (optional): Array of tags to filter by

#### **Examples**

```javascript
// Basic search
await callTool('discover_mcp_servers', {
  query: 'email management tools'
});

// Advanced search with filters
await callTool('discover_mcp_servers', {
  query: 'file operations',
  limit: 5,
  category: 'productivity',
  tags: ['filesystem', 'storage']
});
```

#### **Response Format**

```javascript
{
  content: [{
    type: 'text',
    text: JSON.stringify({
      servers: [
        {
          id: 'gmail-server',
          name: 'Gmail MCP Server',
          description: 'Manage Gmail emails via MCP',
          author: 'example-org',
          version: '1.0.0',
          category: 'communication',
          tags: ['email', 'gmail', 'google'],
          docker_image: 'mcplookup/gmail-server:latest',
          npm_package: '@mcplookup/gmail-server',
          tools: ['send_email', 'read_inbox', 'search_emails'],
          health_score: 95,
          usage_count: 1250
        }
      ],
      total: 1,
      query: 'email management tools'
    }, null, 2)
  }]
}
```

### discover_smart

AI-powered discovery that understands context and provides intelligent recommendations.

#### **Syntax**

```javascript
await callTool('discover_smart', {
  query: string,           // Required: Natural language query
  context?: string,        // Optional: Additional context
  limit?: number          // Optional: Max results (default: 5)
});
```

#### **Examples**

```javascript
// Smart discovery with context
await callTool('discover_smart', {
  query: 'I need to automate my email workflow',
  context: 'I use Gmail and want to integrate with my task management',
  limit: 3
});
```

## 📝 Registry Tools

### register_server

Register a new MCP server in the mcplookup.org registry.

#### **Syntax**

```javascript
await callTool('register_server', {
  name: string,            // Required: Server name
  description: string,     // Required: Server description
  repository_url: string,  // Required: GitHub repository URL
  category: string,        // Required: Server category
  tags: string[],         // Required: Server tags
  docker_image?: string,   // Optional: Docker image
  npm_package?: string    // Optional: NPM package
});
```

#### **Examples**

```javascript
await callTool('register_server', {
  name: 'My Custom Server',
  description: 'A custom MCP server for my workflow',
  repository_url: 'https://github.com/user/my-mcp-server',
  category: 'productivity',
  tags: ['custom', 'workflow', 'automation'],
  npm_package: '@user/my-mcp-server'
});
```

### verify_domain

Start domain verification process for server registration.

#### **Syntax**

```javascript
await callTool('verify_domain', {
  domain: string          // Required: Domain to verify
});
```

### check_domain_ownership

Check the status of domain ownership verification.

#### **Syntax**

```javascript
await callTool('check_domain_ownership', {
  domain: string          // Required: Domain to check
});
```

## 📊 Monitoring Tools

### get_server_health

Get health metrics and status for registered servers.

#### **Syntax**

```javascript
await callTool('get_server_health', {
  server_id?: string,     // Optional: Specific server ID
  limit?: number         // Optional: Max results
});
```

#### **Examples**

```javascript
// Get health for all servers
await callTool('get_server_health');

// Get health for specific server
await callTool('get_server_health', {
  server_id: 'gmail-server'
});
```

#### **Response Format**

```javascript
{
  content: [{
    type: 'text',
    text: JSON.stringify({
      servers: [
        {
          id: 'gmail-server',
          name: 'Gmail MCP Server',
          status: 'healthy',
          health_score: 95,
          last_check: '2024-01-15T10:30:00Z',
          response_time: 150,
          uptime_percentage: 99.9,
          error_rate: 0.1
        }
      ]
    }, null, 2)
  }]
}
```

## 👤 User Management Tools

### get_onboarding_state

Get the current user's onboarding progress and recommendations.

#### **Syntax**

```javascript
await callTool('get_onboarding_state');
```

#### **Response Format**

```javascript
{
  content: [{
    type: 'text',
    text: JSON.stringify({
      user_id: 'user123',
      onboarding_complete: false,
      completed_steps: ['account_created', 'first_discovery'],
      next_steps: ['install_first_server', 'try_bridge_mode'],
      recommended_servers: ['filesystem', 'gmail'],
      progress_percentage: 40
    }, null, 2)
  }]
}
```

## 🚀 Invocation Tools

### invoke_tool

Dynamically call tools on any MCP server without pre-installation.

#### **Syntax**

```javascript
await callTool('invoke_tool', {
  endpoint: string,        // Required: Server endpoint URL
  tool_name: string,       // Required: Tool name to call
  arguments: object,       // Required: Tool arguments
  headers?: object        // Optional: HTTP headers
});
```

#### **Parameters**

- **endpoint**: HTTP endpoint of the MCP server
- **tool_name**: Name of the tool to invoke
- **arguments**: Arguments to pass to the tool
- **headers**: Optional HTTP headers for authentication

#### **Examples**

```javascript
// Call a tool on a remote server
await callTool('invoke_tool', {
  endpoint: 'https://api.example.com/mcp',
  tool_name: 'send_email',
  arguments: {
    to: 'user@example.com',
    subject: 'Hello from MCP Bridge!',
    body: 'This email was sent via invoke_tool'
  },
  headers: {
    'Authorization': 'Bearer your-token'
  }
});
```

#### **How It Works**

1. **Discovery**: Use `discover_mcp_servers` to find servers
2. **Connection**: Bridge connects to the server endpoint
3. **Protocol Negotiation**: Tries Streamable HTTP, falls back to SSE
4. **Tool Invocation**: Calls the specified tool with arguments
5. **Response**: Returns the tool's response

#### **Supported Protocols**

- **Streamable HTTP**: Modern, efficient protocol
- **Server-Sent Events (SSE)**: Fallback for compatibility

#### **Error Handling**

```javascript
// Example error response
{
  content: [{
    type: 'text',
    text: '❌ Failed to invoke send_email: Server not responding'
  }],
  isError: true
}
```

## 🔄 Workflow Examples

### **Complete Discovery → Invocation Workflow**

```javascript
// 1. Discover servers
const discovery = await callTool('discover_mcp_servers', {
  query: 'email automation'
});

// 2. Get server details from discovery response
const server = discovery.servers[0];
const endpoint = server.endpoint || 'https://api.example.com/mcp';

// 3. Invoke tool directly
await callTool('invoke_tool', {
  endpoint: endpoint,
  tool_name: 'send_email',
  arguments: {
    to: 'team@company.com',
    subject: 'Weekly Report'
  }
});
```

### **Smart Discovery → Installation Workflow**

```javascript
// 1. Smart discovery
const smart = await callTool('discover_smart', {
  query: 'I need to manage my files and emails efficiently'
});

// 2. Install recommended servers
for (const server of smart.recommendations) {
  await callTool('install_mcp_server', {
    name: server.name,
    type: 'npm',
    command: server.npm_package,
    mode: 'bridge'
  });
}
```

## 🔒 Authentication & Security

### **API Key Authentication**

Some tools require authentication with mcplookup.org:

```javascript
// Set API key via environment variable
process.env.MCPLOOKUP_API_KEY = 'your-api-key';

// Or pass during bridge initialization
const bridge = new MCPLookupBridge('your-api-key');
```

### **Server Authentication**

When using `invoke_tool`, servers may require authentication:

```javascript
await callTool('invoke_tool', {
  endpoint: 'https://secure-server.com/mcp',
  tool_name: 'protected_action',
  arguments: {...},
  headers: {
    'Authorization': 'Bearer server-token',
    'X-API-Key': 'api-key'
  }
});
```

## 📊 Rate Limiting

The bridge respects rate limits from mcplookup.org:

- **Discovery**: 100 requests/hour
- **Registration**: 10 requests/hour
- **Health Checks**: 1000 requests/hour
- **Invocation**: No bridge-level limits (server-dependent)

## 🚨 Error Handling

### **Common Error Types**

| Error | Cause | Solution |
|-------|-------|----------|
| `Server not found` | Invalid server ID | Check server exists in registry |
| `Authentication failed` | Invalid API key | Verify API key is correct |
| `Rate limit exceeded` | Too many requests | Wait and retry |
| `Server unreachable` | Network/server issue | Check server status |
| `Tool not found` | Invalid tool name | Check available tools |

### **Error Response Format**

```javascript
{
  content: [{
    type: 'text',
    text: '❌ Error description with helpful context'
  }],
  isError: true
}
```

---

**Next Steps:**
- [🔧 Server Management API](./server-management.md)
- [🎯 Usage Examples](../examples/)
- [🔧 Troubleshooting](../troubleshooting.md)
