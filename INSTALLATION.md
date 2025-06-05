# 🚀 Dead Simple Installation

## Install the Package

```bash
npm install @mcplookup-org/mcp-bridge
```

## Use It

```javascript
const { MCPHttpBridge } = require('@mcplookup-org/mcp-bridge');

const bridge = new MCPHttpBridge();
await bridge.run();
```

## That's It!

The bridge is now running as an MCP server that other MCP clients can connect to.

### What You Get

- **8 bridge tools** with API parity to mcplookup.org
- **Universal MCP client** via `invoke_tool`
- **Discovery and registration** capabilities
- **Type-safe** implementations

### Connect From Claude Desktop

Add to your Claude Desktop MCP config:

```json
{
  "mcpServers": {
    "mcplookup-bridge": {
      "command": "node",
      "args": ["/path/to/your/bridge-script.js"]
    }
  }
}
```

Where `bridge-script.js` contains:
```javascript
const { MCPHttpBridge } = require('@mcplookup-org/mcp-bridge');
const bridge = new MCPHttpBridge();
bridge.run();
```

### Done!

You now have access to all mcplookup.org functionality plus universal MCP connectivity.
