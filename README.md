# MCP Bridge for mcplookup.org

Universal MCP bridge that provides API parity with [mcplookup.org](https://mcplookup.org) discovery service. This bridge exposes 8 MCP tools that allow any MCP client to discover and interact with MCP servers through the mcplookup.org API.

## Features

### 🔧 8 MCP Tools Available

1. **`discover_mcp_servers`** - Search for MCP servers using natural language queries
2. **`discover_smart`** - AI-powered discovery with intelligent recommendations  
3. **`register_server`** - Register a new MCP server with the directory
4. **`verify_domain`** - Start domain ownership verification
5. **`check_domain_ownership`** - Check domain ownership status
6. **`get_server_health`** - Get real-time server health metrics
7. **`get_onboarding_state`** - Get user onboarding progress
8. **`invoke_tool`** - Dynamically call any MCP server (SSE/HTTP streaming support)

### 🌐 Universal Compatibility

- **Generated API Client**: Uses OpenAPI-generated TypeScript client for type safety
- **Multiple Transports**: Supports SSE, HTTP streaming, and stdio protocols
- **Dynamic Server Calls**: Can connect to any MCP server on-demand
- **Authentication**: Optional API key support for authenticated endpoints

## Installation

```bash
npm install @mcplookup-org/mcp-bridge
```

## Usage

### As a Standalone MCP Server

```bash
# Run the bridge as an MCP server on stdio
npx @mcplookup-org/mcp-bridge

# Or with API key for authenticated endpoints
MCPLOOKUP_API_KEY=your_key_here npx @mcplookup-org/mcp-bridge
```

### Programmatic Usage

```typescript
import { MCPLookupBridge } from '@mcplookup-org/mcp-bridge';

// Create and start the bridge
const bridge = new MCPLookupBridge('your_api_key_here');
await bridge.run();
```

### MCP Client Configuration

Add to your MCP client configuration:

```json
{
  "mcpServers": {
    "mcplookup-bridge": {
      "command": "npx",
      "args": ["@mcplookup-org/mcp-bridge"],
      "env": {
        "MCPLOOKUP_API_KEY": "your_key_here"
      }
    }
  }
}
```

## Tool Examples

### Discover MCP Servers

```typescript
// Natural language search
await callTool('discover_mcp_servers', {
  query: "I need tools for managing customer emails and scheduling meetings",
  limit: 5
});

// Technical requirements
await callTool('discover_mcp_servers', {
  intent: "data_processing",
  transport: "streamable_http",
  limit: 10
});
```

### Smart AI Discovery

```typescript
await callTool('discover_smart', {
  query: "Find me the best tools for building a customer support system",
  max_results: 5,
  include_reasoning: true
});
```

### Dynamic Server Invocation

```typescript
// Call any MCP server dynamically
await callTool('invoke_tool', {
  endpoint: "https://api.example.com/mcp",
  tool_name: "search_files",
  arguments: {
    query: "*.pdf",
    limit: 10
  }
});
```

## Environment Variables

- `MCPLOOKUP_API_KEY` - Optional API key for authenticated endpoints
- `MCPLOOKUP_BASE_URL` - Override base URL (default: https://mcplookup.org/api/v1)

## Development

```bash
# Clone and install
git clone https://github.com/MCPLookup-org/mcp-bridge.git
cd mcp-bridge
npm install

# Build
npm run build

# Run locally
npm run bridge

# Test
npm test
```

## API Parity

This bridge provides complete API parity with mcplookup.org:

- ✅ Discovery endpoints (`/discover`, `/discover/smart`)
- ✅ Registration endpoints (`/register`, `/verify`)
- ✅ Health monitoring (`/health/{domain}`)
- ✅ User management (`/onboarding`)
- ✅ Dynamic MCP server invocation

## License

MIT - See [LICENSE](LICENSE) file for details.

## Links

- [mcplookup.org](https://mcplookup.org) - Main discovery service
- [MCP Protocol](https://modelcontextprotocol.io) - Model Context Protocol specification
- [GitHub Issues](https://github.com/MCPLookup-org/mcp-bridge/issues) - Bug reports and feature requests
