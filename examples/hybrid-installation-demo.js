// Hybrid MCP Server Installation Demo
// Shows both bridge mode (dynamic) and direct mode (Smithery-style) installation

// import { MCPLookupBridge } from '@mcplookup-org/mcp-bridge';

async function demonstrateHybridInstallation() {
  console.log('🚀 MCP Bridge Hybrid Installation Demo\n');
  
  console.log('📋 Available Installation Modes:');
  console.log('1. Bridge Mode (Dynamic): Runtime management with tool delegation');
  console.log('2. Direct Mode (Smithery-style): Claude Desktop config modification\n');
  
  // ========================================
  // BRIDGE MODE EXAMPLES
  // ========================================
  
  console.log('🔧 BRIDGE MODE EXAMPLES:');
  console.log('========================\n');
  
  console.log('1. Install Docker server in bridge mode:');
  console.log('install_mcp_server({');
  console.log('  "name": "gmail",');
  console.log('  "type": "docker",');
  console.log('  "command": "docker run -i mcplookup/gmail-server:latest",');
  console.log('  "mode": "bridge"  // Dynamic management');
  console.log('})');
  console.log('→ Tools available immediately: gmail_send_email, gmail_read_inbox\n');
  
  console.log('2. Install npm package in bridge mode:');
  console.log('install_mcp_server({');
  console.log('  "name": "files",');
  console.log('  "type": "npm",');
  console.log('  "command": "@modelcontextprotocol/server-filesystem",');
  console.log('  "mode": "bridge"');
  console.log('})');
  console.log('→ Tools available immediately: files_read_file, files_write_file\n');
  
  console.log('3. Use bridge-managed tools:');
  console.log('gmail_send_email({"to": "user@example.com", "subject": "Hello!"})');
  console.log('files_read_file({"path": "/documents/report.txt"})\n');
  
  console.log('4. Manage bridge servers:');
  console.log('list_managed_servers()  // Show running servers');
  console.log('control_mcp_server({"name": "gmail", "action": "stop"})');
  console.log('control_mcp_server({"name": "gmail", "action": "start"})\n');
  
  // ========================================
  // DIRECT MODE EXAMPLES
  // ========================================
  
  console.log('📝 DIRECT MODE EXAMPLES (Smithery-style):');
  console.log('=========================================\n');
  
  console.log('1. Install server in direct mode:');
  console.log('install_mcp_server({');
  console.log('  "name": "github",');
  console.log('  "type": "npm",');
  console.log('  "command": "@company/github-mcp-server",');
  console.log('  "mode": "direct",  // Claude Desktop config');
  console.log('  "env": {"GITHUB_TOKEN": "your-token"}');
  console.log('})');
  console.log('→ Modifies Claude Desktop config');
  console.log('→ Requires Claude Desktop restart');
  console.log('→ Tools available natively (no prefix)\n');
  
  console.log('2. Manage Claude Desktop config:');
  console.log('list_claude_servers()  // Show config servers');
  console.log('remove_claude_server({"name": "github"})  // Remove from config\n');
  
  // ========================================
  // COMPARISON
  // ========================================
  
  console.log('⚖️  MODE COMPARISON:');
  console.log('===================\n');
  
  console.log('| Aspect              | Bridge Mode        | Direct Mode        |');
  console.log('|---------------------|--------------------|--------------------|');
  console.log('| Installation Speed  | Immediate          | Requires restart   |');
  console.log('| Tool Names          | Prefixed           | Native             |');
  console.log('| Performance         | Proxy overhead     | Direct connection  |');
  console.log('| Persistence         | Session-based      | Permanent          |');
  console.log('| Experimentation     | Perfect            | Not ideal          |');
  console.log('| Production Use      | Good               | Excellent          |');
  console.log('| Isolation           | Docker containers  | Process-level      |');
  console.log('| Management          | Runtime control    | Config file        |\n');
  
  // ========================================
  // RECOMMENDED WORKFLOWS
  // ========================================
  
  console.log('🎯 RECOMMENDED WORKFLOWS:');
  console.log('=========================\n');
  
  console.log('1. EXPERIMENTATION WORKFLOW:');
  console.log('   • Use bridge mode to test new servers');
  console.log('   • Try tools with prefixed names');
  console.log('   • If satisfied, install in direct mode for production\n');
  
  console.log('2. DEVELOPMENT WORKFLOW:');
  console.log('   • Bridge mode for development/testing');
  console.log('   • Direct mode for stable, frequently-used servers\n');
  
  console.log('3. HYBRID WORKFLOW:');
  console.log('   • Core servers in direct mode (email, files, etc.)');
  console.log('   • Experimental servers in bridge mode');
  console.log('   • Easy migration between modes\n');
  
  // ========================================
  // EXAMPLE HYBRID SETUP
  // ========================================
  
  console.log('🔄 EXAMPLE HYBRID SETUP:');
  console.log('========================\n');
  
  console.log('// Core servers in direct mode (permanent)');
  console.log('install_mcp_server({');
  console.log('  "name": "filesystem", "type": "npm",');
  console.log('  "command": "@modelcontextprotocol/server-filesystem",');
  console.log('  "mode": "direct"');
  console.log('});\n');
  
  console.log('install_mcp_server({');
  console.log('  "name": "gmail", "type": "docker",');
  console.log('  "command": "docker run -i mcplookup/gmail-server:latest",');
  console.log('  "mode": "direct"');
  console.log('});\n');
  
  console.log('// Experimental servers in bridge mode (temporary)');
  console.log('install_mcp_server({');
  console.log('  "name": "experimental", "type": "npm",');
  console.log('  "command": "@company/new-experimental-server",');
  console.log('  "mode": "bridge"');
  console.log('});\n');
  
  console.log('// After restart, use core servers natively:');
  console.log('read_file({"path": "/docs/readme.txt"})  // Direct');
  console.log('send_email({"to": "team@company.com"})   // Direct\n');
  
  console.log('// Use experimental server with prefix:');
  console.log('experimental_new_feature({...})  // Bridge-managed\n');
  
  console.log('✨ This gives you the best of both worlds!');
  console.log('   • Immediate experimentation with bridge mode');
  console.log('   • Production stability with direct mode');
  console.log('   • Seamless migration between modes');
}

// Configuration examples
function showConfigurationExamples() {
  console.log('\n📁 CONFIGURATION EXAMPLES:');
  console.log('==========================\n');
  
  console.log('Claude Desktop config.json after direct mode installation:');
  console.log(JSON.stringify({
    "mcpServers": {
      "filesystem": {
        "command": "npx",
        "args": ["@modelcontextprotocol/server-filesystem"]
      },
      "gmail": {
        "command": "docker",
        "args": ["run", "-i", "mcplookup/gmail-server:latest"],
        "env": {
          "GMAIL_API_KEY": "your-api-key"
        }
      }
    }
  }, null, 2));
  
  console.log('\nBridge managed servers (runtime only):');
  console.log(JSON.stringify([
    {
      "name": "experimental",
      "type": "npm",
      "mode": "bridge",
      "status": "running",
      "tools": ["new_feature", "test_tool"]
    }
  ], null, 2));
}

// Run the demo
demonstrateHybridInstallation()
  .then(() => showConfigurationExamples())
  .catch(console.error);

// export { demonstrateHybridInstallation, showConfigurationExamples };
