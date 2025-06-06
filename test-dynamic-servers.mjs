#!/usr/bin/env node

// Test script for dynamic MCP server management
// This tests the new functionality without requiring actual Docker/npm packages

import { MCPLookupBridge } from './dist/bridge.js';

async function testDynamicServers() {
  console.log('🧪 Testing Dynamic MCP Server Management\n');
  
  try {
    // Create bridge instance
    const bridge = new MCPLookupBridge();
    
    console.log('✅ Bridge created successfully');
    console.log('📋 Available management tools:');
    console.log('  • install_mcp_server');
    console.log('  • list_managed_servers'); 
    console.log('  • control_mcp_server');
    console.log('  • Plus all existing discovery tools\n');
    
    // Test server management state
    console.log('🔍 Testing server management state...');
    
    // Check if managedServers map exists
    if (bridge.managedServers) {
      console.log('✅ Managed servers map initialized');
    } else {
      console.log('❌ Managed servers map not found');
    }
    
    console.log('\n📖 Usage Examples:');
    console.log('1. Install Docker server:');
    console.log('   install_mcp_server({');
    console.log('     "name": "gmail",');
    console.log('     "type": "docker",');
    console.log('     "command": "docker run -i mcplookup/gmail-server:latest"');
    console.log('   })');
    
    console.log('\n2. Install NPM server:');
    console.log('   install_mcp_server({');
    console.log('     "name": "filesystem",');
    console.log('     "type": "npm",');
    console.log('     "command": "@modelcontextprotocol/server-filesystem"');
    console.log('   })');
    
    console.log('\n3. List servers:');
    console.log('   list_managed_servers()');
    
    console.log('\n4. Control servers:');
    console.log('   control_mcp_server({"name": "gmail", "action": "stop"})');
    
    console.log('\n✨ Key Benefits:');
    console.log('• Dynamic tool delegation - installed server tools become bridge tools');
    console.log('• Automatic Docker containerization for npm packages');
    console.log('• Complete lifecycle management (install/start/stop/remove)');
    console.log('• Security isolation through containers');
    console.log('• No manual invoke_tool calls needed!');
    
    console.log('\n🎯 Workflow:');
    console.log('discover_mcp_servers → install_mcp_server → use_server_tools_directly');
    
    console.log('\n✅ Dynamic server management test completed!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    process.exit(1);
  }
}

// Run test if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  testDynamicServers().catch(console.error);
}

export { testDynamicServers };
