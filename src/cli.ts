#!/usr/bin/env node

// CLI entry point for MCPLookup Bridge
// Usage: npx @mcplookup-org/mcp-bridge

import { MCPLookupBridge } from './bridge.js';

async function main() {
  try {
    // Parse command line arguments
    const args = process.argv.slice(2);
    const httpMode = args.includes('--http') || process.env.MCP_HTTP_MODE === 'true';
    const portArg = args.find(arg => arg.startsWith('--port='));
    const port = portArg ? parseInt(portArg.split('=')[1]) : parseInt(process.env.PORT || '3000');

    // Get API key from environment or command line
    const apiKey = process.env.MCPLOOKUP_API_KEY || process.env.MCP_API_KEY;
    const baseUrl = process.env.MCPLOOKUP_BASE_URL;

    // Create and start the bridge
    const bridge = new MCPLookupBridge(apiKey, baseUrl);

    // Handle graceful shutdown
    process.on('SIGINT', async () => {
      console.log('\n🔌 Shutting down MCPLookup Bridge...');
      await bridge.close();
      process.exit(0);
    });

    process.on('SIGTERM', async () => {
      console.log('\n🔌 Shutting down MCPLookup Bridge...');
      await bridge.close();
      process.exit(0);
    });

    // Start the bridge in appropriate mode
    if (httpMode) {
      await bridge.runHTTP(port);
    } else {
      await bridge.run();
    }

  } catch (error) {
    console.error('❌ Failed to start MCPLookup Bridge:', error);
    console.error('\n📖 Usage:');
    console.error('  npx @mcplookup-org/mcp-bridge              # stdio mode (default)');
    console.error('  npx @mcplookup-org/mcp-bridge --http      # HTTP mode');
    console.error('  npx @mcplookup-org/mcp-bridge --http --port=3001  # HTTP mode on custom port');
    process.exit(1);
  }
}

// Only run if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}
