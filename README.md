# @mcplookup-org/mcp-bridge

Universal MCP bridge with API parity to mcplookup.org discovery service.

## 🚀 Dead Simple Installation

```bash
npm install @mcplookup-org/mcp-bridge
```

## 🎯 Usage

### Basic Bridge
```typescript
import { MCPHttpBridge } from '@mcplookup-org/mcp-bridge';

const bridge = new MCPHttpBridge();
await bridge.run(); // Starts MCP server on stdio
```

### Enhanced Bridge
```typescript
import { EnhancedMCPBridge } from '@mcplookup-org/mcp-bridge';

const bridge = new EnhancedMCPBridge();
await bridge.run(); // Starts with all 8 tools
```

### With API Key
```typescript
import { createBridge } from '@mcplookup-org/mcp-bridge';

const bridge = createBridge('https://api.example.com/mcp', {
  'Authorization': 'Bearer your-api-key'
});
await bridge.run();
```

### Discovery Bridge
```typescript
import { MCPDiscoveryBridge } from '@mcplookup-org/mcp-bridge';

const discoveryBridge = new MCPDiscoveryBridge();
const bridge = await discoveryBridge.createBridgeForDomain('gmail.com');
await bridge.run();
```

## 🛠️ Available Tools

The bridge provides 8 tools with API parity to the main mcplookup.org server:

### Main Tools (7)
1. **`discover_mcp_servers`** - Flexible MCP server discovery
2. **`register_mcp_server`** - Register a new MCP server  
3. **`verify_domain_ownership`** - Check DNS verification status
4. **`get_server_health`** - Get server health metrics
5. **`browse_capabilities`** - Browse MCP capabilities
6. **`get_discovery_stats`** - Get discovery analytics
7. **`list_mcp_tools`** - List available MCP tools

### Bridge Tool (1)
8. **`invoke_tool`** - Call tools on any streaming HTTP MCP server

## 🔧 API Parity

The bridge tools call the REST API instead of services directly:

- **Main Server**: Direct service calls, database access
- **Bridge**: REST API calls with authentication
- **Same functionality**: Identical tool names, schemas, responses

## 🌐 Universal MCP Client

Use `invoke_tool` to call any tool on any streaming HTTP MCP server:

```typescript
// Example: Call Gmail MCP server
await callTool('invoke_tool', {
  endpoint: 'https://api.gmail.com/mcp',
  tool_name: 'send_email',
  arguments: {
    to: 'user@example.com',
    subject: 'Hello!',
    body: 'Sent via MCP bridge'
  },
  auth_headers: {
    'Authorization': 'Bearer gmail-token'
  }
});
```

## 📦 What's Included

- **MCPHttpBridge** - Basic bridge with 8 tools
- **EnhancedMCPBridge** - Enhanced bridge with tool exploration
- **MCPDiscoveryBridge** - Auto-discovery of MCP servers
- **BridgeToolsWithAPIParity** - Core bridge tools class
- **Utility functions** - Simple creation helpers

## 🎯 Perfect For

- **MCP clients** that need discovery and registration tools
- **Universal MCP connectivity** to any streaming HTTP server
- **API-based access** to mcplookup.org functionality
- **Bridge workflows** between different MCP servers

## 📄 License

MIT

## 🔗 Links

- [GitHub](https://github.com/mcplookup-org/mcp-bridge)
- [mcplookup.org](https://mcplookup.org)
- [MCP Specification](https://modelcontextprotocol.io)
