# 🚀 Quick Start Tutorial

**Get up and running with MCPL in 5 minutes. Install your first MCP server and start using it with Claude.**

## 🎯 **What You'll Learn**

In this tutorial, you'll:
- ✅ Install MCPL
- ✅ Set up authentication
- ✅ Discover and install your first MCP server
- ✅ Use the server with Claude Desktop
- ✅ Understand the difference between bridge and direct modes

**Time Required**: 5-10 minutes

## 📋 **Prerequisites**

- Node.js 18+ installed
- Docker installed (for containerized servers)
- Claude Desktop installed
- 5 minutes of your time

## 🚀 **Step 1: Install MCPL**

```bash
# Install MCPL globally
npm install -g @mcplookup-org/mcp-bridge

# Verify installation
mcpl --version
# Expected output: @mcplookup-org/mcp-bridge@x.x.x
```

## 🔐 **Step 2: Set Up Authentication**

### **Get Your API Key**
1. Visit [mcplookup.org/dashboard](https://mcplookup.org/dashboard)
2. Sign up or log in
3. Generate an API key
4. Copy the key

### **Configure Authentication**
```bash
# Set your API key
mcpl login --key your-api-key-here

# Verify authentication
mcpl auth status
# Expected output: ✅ Authenticated as: your-email@example.com
```

## 🔍 **Step 3: Discover MCP Servers**

```bash
# Search for filesystem tools
mcpl search "filesystem"
# Expected output: List of filesystem-related servers

# Try AI-powered search
mcpl search "I need to read and write files" --smart
# Expected output: AI recommendations with explanations
```

**Example Output:**
```
🔍 Found 5 servers matching "filesystem":

📦 @modelcontextprotocol/server-filesystem
   📝 File system operations (read, write, list)
   🏷️  filesystem, files, storage
   ⭐ 4.8/5 (1,234 installs)

📦 @company/advanced-filesystem  
   📝 Advanced file operations with permissions
   🏷️  filesystem, permissions, security
   ⭐ 4.6/5 (567 installs)
```

## 📦 **Step 4: Install Your First Server**

### **Option A: Direct Mode (Recommended for Beginners)**
```bash
# Install filesystem server in direct mode
mcpl install @modelcontextprotocol/server-filesystem

# Check installation
mcpl list
# Expected output: List showing installed server
```

### **Option B: Bridge Mode (Advanced)**
```bash
# Install in bridge mode with auto-start
mcpl install @modelcontextprotocol/server-filesystem --mode bridge --auto-start

# Check server status
mcpl status
# Expected output: Server status and health information
```

## 🌉 **Step 5: Configure Claude Desktop**

### **For Direct Mode**
The server is automatically added to your Claude Desktop configuration. Just restart Claude Desktop.

### **For Bridge Mode**
Add the MCPL bridge to your Claude Desktop config:

**File Location:**
- **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`
- **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Linux**: `~/.config/Claude/claude_desktop_config.json`

**Configuration:**
```json
{
  "mcpServers": {
    "mcplookup-bridge": {
      "command": "mcpl",
      "args": ["bridge"],
      "env": {
        "MCPLOOKUP_API_KEY": "your-api-key-here"
      }
    }
  }
}
```

## ✅ **Step 6: Test with Claude**

1. **Restart Claude Desktop**
2. **Start a new conversation**
3. **Test the installation:**

### **For Direct Mode:**
```
You: "What files are in my home directory?"
Claude: I'll help you list the files in your home directory using the filesystem server.
[Uses read_directory tool]
```

### **For Bridge Mode:**
```
You: "What MCP servers are available?"
Claude: I can see several MCP tools available, including filesystem operations.
[Shows available tools including filesystem_read_directory]

You: "List files in my home directory"
Claude: I'll use the filesystem server to list your files.
[Uses filesystem_read_directory tool]
```

## 🎯 **Understanding the Modes**

### **📋 Direct Mode**
- ✅ **Permanent**: Survives Claude restarts
- ✅ **Native**: Tools appear with original names (`read_file`)
- ✅ **Fast**: No proxy overhead
- ⚠️ **Restart Required**: Need to restart Claude when adding servers

### **🌉 Bridge Mode**
- ✅ **Dynamic**: Add/remove servers without restarting Claude
- ✅ **Management**: Start/stop/restart servers on demand
- ✅ **Monitoring**: Health checks and auto-recovery
- ⚠️ **Prefixed**: Tools appear with prefixes (`filesystem_read_file`)

## 🔧 **Next Steps**

### **Explore More Servers**
```bash
# Search for different types of servers
mcpl search "email automation"
mcpl search "database tools"
mcpl search "productivity apps"

# Install more servers
mcpl install @company/email-server
mcpl install @company/database-server
```

### **Manage Your Servers**
```bash
# List all installed servers
mcpl list

# Check server health
mcpl health

# Control bridge mode servers
mcpl control server-name start
mcpl control server-name stop
mcpl control server-name restart
```

### **Advanced Usage**
```bash
# Install with environment variables
mcpl install @company/server --env API_KEY=secret --env DEBUG=true

# Install with custom configuration
mcpl install @company/server --config config.json

# Install in global mode (host execution)
mcpl install @company/server --global
```

## 🔍 **Troubleshooting**

### **Common Issues**

#### **"Server not found in Claude"**
- **Direct Mode**: Restart Claude Desktop
- **Bridge Mode**: Check bridge is running with `mcpl status`

#### **"Authentication failed"**
```bash
# Check API key
mcpl auth status

# Re-authenticate if needed
mcpl login --key your-api-key
```

#### **"Docker permission denied"**
```bash
# Linux/macOS: Add user to docker group
sudo usermod -aG docker $USER
newgrp docker
```

#### **"Command not found: mcpl"**
```bash
# Reinstall globally
npm install -g @mcplookup-org/mcp-bridge

# Or use npx
npx @mcplookup-org/mcp-bridge --help
```

## 🎉 **Congratulations!**

You've successfully:
- ✅ Installed MCPL
- ✅ Set up authentication
- ✅ Discovered and installed an MCP server
- ✅ Configured Claude Desktop
- ✅ Tested the integration

### **What's Next?**

1. **📖 Read the [Installation Guide](../guides/installation.md)** for detailed setup
2. **🌉 Learn about [Bridge Mode](../guides/bridge-mode.md)** for dynamic server management
3. **📋 Explore [Direct Mode](../guides/direct-mode.md)** for permanent installations
4. **🔍 Master [Server Discovery](../guides/discovery.md)** to find the perfect servers
5. **🔧 Dive into [Server Management](../guides/server-management.md)** for advanced control

## 💡 **Pro Tips**

### **Efficient Workflow**
```bash
# Search, install, and test in one flow
mcpl search "email" --smart
mcpl install @best/email-server --auto-start
mcpl test @best/email-server
```

### **Batch Operations**
```bash
# Install multiple servers
mcpl install @company/server1 @company/server2 @company/server3

# Check health of all servers
mcpl health --all --watch
```

### **Development Workflow**
```bash
# Install in development mode
mcpl install ./my-local-server --dev --watch

# Test with specific environment
mcpl install @company/server --env NODE_ENV=development
```

---

**🌟 You're now ready to explore the full power of MCPL! Check out the guides for deeper dives into specific features.**
