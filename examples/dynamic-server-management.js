// Example: Dynamic MCP Server Management
// This demonstrates the new server installation and management capabilities

const { MCPLookupBridge } = require('@mcplookup-org/mcp-bridge');

async function demonstrateServerManagement() {
  console.log('🚀 Starting MCP Bridge with Server Management...');
  
  // Create bridge with API key
  const bridge = new MCPLookupBridge(process.env.MCPLOOKUP_API_KEY);
  
  // Start the bridge
  await bridge.run();
  
  console.log('\n📋 Example Usage:');
  console.log('1. Discover servers:');
  console.log('   discover_mcp_servers("email tools")');
  
  console.log('\n2. Install a Docker-based MCP server:');
  console.log('   install_mcp_server({');
  console.log('     "name": "gmail",');
  console.log('     "type": "docker",');
  console.log('     "command": "docker run -i mcplookup/gmail-server:latest"');
  console.log('   })');
  
  console.log('\n3. Install an npm package MCP server:');
  console.log('   install_mcp_server({');
  console.log('     "name": "filesystem",');
  console.log('     "type": "npm",');
  console.log('     "command": "@modelcontextprotocol/server-filesystem"');
  console.log('   })');
  
  console.log('\n4. List managed servers:');
  console.log('   list_managed_servers()');
  
  console.log('\n5. Use dynamically added tools:');
  console.log('   gmail_send_email({"to": "user@example.com", "subject": "Hello!"})');
  console.log('   filesystem_read_file({"path": "/path/to/file.txt"})');
  
  console.log('\n6. Control servers:');
  console.log('   control_mcp_server({"name": "gmail", "action": "stop"})');
  console.log('   control_mcp_server({"name": "gmail", "action": "start"})');
  
  console.log('\n✨ Dynamic Tool Delegation:');
  console.log('- Tools from installed servers appear as bridge tools');
  console.log('- Prefixed with server name (e.g., gmail_send_email)');
  console.log('- Automatically delegate to the appropriate server');
  console.log('- No need to use invoke_tool manually!');
}

// Workflow example
async function exampleWorkflow() {
  console.log('\n🔄 Example Workflow:');
  
  // This would be the actual workflow when using the bridge:
  /*
  
  // 1. Discover what's available
  const discovery = await callTool('discover_mcp_servers', {
    query: 'email and file management tools'
  });
  
  // 2. Install servers based on discovery
  await callTool('install_mcp_server', {
    name: 'gmail',
    type: 'docker', 
    command: 'docker run -i mcplookup/gmail-server:latest'
  });
  
  await callTool('install_mcp_server', {
    name: 'files',
    type: 'npm',
    command: '@modelcontextprotocol/server-filesystem'
  });
  
  // 3. Now these tools are available directly:
  await callTool('gmail_send_email', {
    to: 'user@example.com',
    subject: 'Report',
    body: 'Please find the report attached.'
  });
  
  await callTool('files_read_file', {
    path: '/reports/monthly.txt'
  });
  
  // 4. Manage servers as needed
  await callTool('control_mcp_server', {
    name: 'gmail',
    action: 'stop'
  });
  
  */
}

if (require.main === module) {
  demonstrateServerManagement().catch(console.error);
}

module.exports = { demonstrateServerManagement, exampleWorkflow };
