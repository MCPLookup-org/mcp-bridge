// Basic usage example for @mcplookup-org/mcp-bridge

const { MCPHttpBridge, EnhancedMCPBridge, createBridge } = require('@mcplookup-org/mcp-bridge');

async function basicExample() {
  console.log('🚀 Starting basic MCP bridge...');
  
  // Create a basic bridge
  const bridge = new MCPHttpBridge();
  
  // Start the bridge (connects via stdio)
  await bridge.run();
  
  // The bridge is now running and other MCP clients can connect to it
  // It provides 8 tools with API parity to mcplookup.org
}

async function enhancedExample() {
  console.log('🚀 Starting enhanced MCP bridge...');
  
  // Create enhanced bridge with tool exploration
  const bridge = new EnhancedMCPBridge();
  
  // Show available tools
  const tools = bridge.getAvailableTools();
  console.log(`Available tools: ${tools.length}`);
  
  // Start the bridge
  await bridge.run();
}

async function withApiKeyExample() {
  console.log('🚀 Starting bridge with API key...');
  
  // Create bridge with API key authentication
  const bridge = createBridge('https://mcplookup.org/api/mcp', {
    'Authorization': 'Bearer your-api-key-here'
  });
  
  await bridge.run();
}

// Run the example you want
if (require.main === module) {
  // Change this to run different examples
  basicExample().catch(console.error);
}
