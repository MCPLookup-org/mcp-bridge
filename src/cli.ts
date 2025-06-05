#!/usr/bin/env node

// CLI entry point for MCPLookup Bridge
// Usage: npx @mcplookup-org/mcp-bridge

import { MCPLookupBridge } from './bridge.js';

async function main() {
  try {
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

    // Start the bridge
    await bridge.run();
    
  } catch (error) {
    console.error('❌ Failed to start MCPLookup Bridge:', error);
    process.exit(1);
  }
}

// Only run if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}
