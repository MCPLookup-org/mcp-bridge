# 🎯 Direct Mode Installation Guide

MCPL now supports **two types of direct mode installation** to give you maximum flexibility:

## 🔄 **Installation Methods**

### **1. Default Method (Recommended)**
```bash
# Uses npx - no global install required
mcpl install @modelcontextprotocol/server-filesystem
mcpl install @company/email-server
```

**How it works:**
- ✅ **No global install**: Package doesn't need to be installed globally
- ✅ **Uses npx**: Claude Desktop runs `npx package-name`
- ✅ **Always up-to-date**: Uses latest version automatically
- ✅ **Clean system**: No global packages cluttering your system
- ✅ **Fast**: No npm install step required

**Claude Desktop Config:**
```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["@modelcontextprotocol/server-filesystem"]
    }
  }
}
```

### **2. Smithery-Style Method**
```bash
# Global install like Smithery
mcpl install @modelcontextprotocol/server-filesystem --global
mcpl install @company/email-server --global
```

**How it works:**
- 📦 **Global install**: Runs `npm install -g package-name` first
- 🎯 **Direct command**: Claude Desktop runs the package directly
- 🔒 **Version locked**: Uses the globally installed version
- 🏠 **Smithery compatible**: Exact same behavior as Smithery

**Claude Desktop Config:**
```json
{
  "mcpServers": {
    "filesystem": {
      "command": "server-filesystem",
      "args": []
    }
  }
}
```

## 🆚 **Comparison**

| Feature | Default (npx) | Global (--global) | Smithery |
|---------|---------------|-------------------|----------|
| **Global Install** | ❌ Not required | ✅ Required | ✅ Required |
| **System Clean** | ✅ Clean | ❌ Global packages | ❌ Global packages |
| **Auto-updates** | ✅ Latest version | ❌ Manual updates | ❌ Manual updates |
| **Speed** | ⚡ Instant | 🐌 npm install time | 🐌 npm install time |
| **Compatibility** | ✅ Modern | ✅ Legacy | ✅ Legacy |
| **Disk Usage** | 💾 Minimal | 💾 More storage | 💾 More storage |

## 🎯 **When to Use Each Method**

### **Use Default (npx) When:**
- ✅ You want the latest version automatically
- ✅ You prefer a clean system without global packages
- ✅ You're installing multiple servers
- ✅ You want fast installation
- ✅ You're new to MCP servers

### **Use Global (--global) When:**
- 🔄 Migrating from Smithery
- 🔒 You need a specific version locked
- 🏢 Corporate environment requires global installs
- 📊 You want exact Smithery compatibility
- 🎯 You prefer traditional npm workflow

## 📚 **Examples**

### **Quick Start (Recommended)**
```bash
# Install popular servers with default method
mcpl install @modelcontextprotocol/server-filesystem
mcpl install @modelcontextprotocol/server-git
mcpl install @modelcontextprotocol/server-sqlite

# Check what's installed
mcpl list

# Restart Claude Desktop and you're ready!
```

### **Smithery Migration**
```bash
# If you're coming from Smithery, use --global for familiar behavior
mcpl install @modelcontextprotocol/server-filesystem --global
mcpl install @company/custom-server --global

# This creates the exact same config as Smithery would
```

### **Mixed Approach**
```bash
# Use default for most servers
mcpl install @modelcontextprotocol/server-filesystem
mcpl install @company/email-server

# Use global for specific servers that need it
mcpl install @legacy/old-server --global
```

## 🔧 **Advanced Configuration**

### **With Environment Variables**
```bash
# Default method with env vars
mcpl install @company/server --env '{"API_KEY":"key","DEBUG":"true"}'

# Global method with env vars
mcpl install @company/server --global --env '{"API_KEY":"key"}'
```

### **Testing Before Installation**
```bash
# Test default method
mcpl install @company/server --dry-run

# Test global method
mcpl install @company/server --global --dry-run
```

## 🔍 **Troubleshooting**

### **Default Method Issues**
```bash
# If npx fails, try global method
mcpl install package-name --global

# Check if package exists
npm view package-name

# Verify Claude Desktop config
mcpl list servers
```

### **Global Method Issues**
```bash
# Check if global install worked
npm list -g package-name

# Verify package is in PATH
which package-name

# Check permissions
npm config get prefix
```

## 🎯 **Best Practices**

### **For New Users**
1. **Start with default method** (no --global flag)
2. **Test with dry-run** first
3. **Install one server at a time** initially
4. **Check status** after each install

### **For Smithery Users**
1. **Use --global flag** for familiar behavior
2. **Migrate gradually** from Smithery to MCPL
3. **Keep same server names** for consistency
4. **Backup Claude config** before migration

### **For Production**
1. **Choose one method** and stick with it
2. **Document your choice** for team consistency
3. **Use environment variables** for configuration
4. **Test thoroughly** before deployment

## 🚀 **Migration from Smithery**

### **Step 1: Check Current Setup**
```bash
# See what Smithery installed
cat ~/.config/Claude/claude_desktop_config.json

# Or on macOS
cat ~/Library/Application\ Support/Claude/claude_desktop_config.json
```

### **Step 2: Install with MCPL**
```bash
# Use --global for exact Smithery behavior
mcpl install @modelcontextprotocol/server-filesystem --global
mcpl install @company/custom-server --global
```

### **Step 3: Verify**
```bash
# Check the config matches
mcpl list servers

# Test in Claude Desktop
# (restart Claude Desktop first)
```

## 💡 **Pro Tips**

1. **Default method is recommended** for most users
2. **Use --global only when needed** (Smithery migration, legacy requirements)
3. **Test with --dry-run** before actual installation
4. **Mix methods as needed** - you can use both in the same setup
5. **Check `mcpl list`** to see what's installed and how

---

**🌟 MCPL gives you the best of both worlds: modern npx convenience and classic Smithery compatibility!**
