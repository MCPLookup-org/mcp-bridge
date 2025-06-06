# 🚀 MCPL Install Examples

The `mcpl install` command now supports **three types of input** and automatically resolves them intelligently:

## 📦 **1. Direct NPM Packages**

```bash
# Official MCP servers
mcpl install @modelcontextprotocol/server-filesystem
mcpl install @modelcontextprotocol/server-git
mcpl install @modelcontextprotocol/server-sqlite

# Third-party NPM packages
mcpl install @company/email-server
mcpl install my-custom-server
mcpl install @org/special-tools
```

**How it works:**
- ✅ Detects NPM package pattern (`@scope/name` or `package-name`)
- ✅ Installs directly without search
- ✅ Fast and reliable

## 🐳 **2. Docker Images**

```bash
# Docker Hub images
mcpl install company/server:latest
mcpl install myorg/mcp-server:v1.0
mcpl install registry.com/user/server:tag

# Local Docker images
mcpl install local-server:dev
```

**How it works:**
- ✅ Detects Docker image pattern (contains `:` for tag)
- ✅ Installs directly without search
- ✅ Full container support with security

## 🧠 **3. Natural Language Descriptions**

```bash
# Natural language queries
mcpl install "The official Gmail server"
mcpl install "file management tools"
mcpl install "email automation server"
mcpl install "database query tools"
mcpl install "weather information"
```

**How it works:**
- 🔍 Searches mcplookup.org registry with AI
- 🎯 Finds best matching server
- 📦 Automatically selects NPM package or Docker image
- ✅ Shows server details before installation

## 🎯 **Installation Modes**

### **Direct Mode (Default - Smithery Parity)**
```bash
# Permanent installation (requires Claude restart)
mcpl install @company/server
mcpl install "gmail server" --mode direct
```

### **Bridge Mode (Enhanced - Beyond Smithery)**
```bash
# Dynamic installation (instant availability)
mcpl install @company/server --mode bridge
mcpl install "gmail server" --mode bridge --auto-start
```

## 🔍 **Dry Run Testing**

Test any installation without actually installing:

```bash
# Test NPM package
mcpl install @modelcontextprotocol/server-filesystem --dry-run

# Test Docker image  
mcpl install company/server:latest --dry-run

# Test natural language
mcpl install "The official Gmail server" --dry-run
```

**Example Output:**
```
📦 Package: @modelcontextprotocol/server-filesystem
🏷️  Display Name: @modelcontextprotocol/server-filesystem
📝 Description: N/A
🎯 Client: claude
🔧 Mode: direct
📋 Type: npm
🔍 Source: direct
⚠️  Unverified
⚙️ Config: 0 keys
🌍 Environment: 0 variables
🚀 Auto-start: true
```

## ⚙️ **Advanced Configuration**

```bash
# With environment variables
mcpl install server --env '{"API_KEY":"key","DEBUG":"true"}'

# With configuration
mcpl install server --config '{"path":"/data","port":8080}'

# Force installation
mcpl install server --force

# Bridge mode with auto-start
mcpl install server --mode bridge --auto-start
```

## 🆚 **Comparison with Smithery**

| Feature | Smithery | MCPL | Example |
|---------|----------|------|---------|
| **NPM Packages** | ✅ Basic | ✅ Enhanced | `mcpl install @org/pkg` |
| **Docker Images** | ❌ None | ✅ Full Support | `mcpl install org/img:tag` |
| **Natural Language** | ❌ None | ✅ AI-Powered | `mcpl install "gmail server"` |
| **Bridge Mode** | ❌ None | ✅ Instant Testing | `--mode bridge` |
| **Dry Run** | ❌ None | ✅ Safe Testing | `--dry-run` |
| **Auto-start** | ❌ None | ✅ Automatic | `--auto-start` |

## 🎯 **Real-World Examples**

### **Quick Testing Workflow**
```bash
# 1. Search for what you need
mcpl search "email tools"

# 2. Test in bridge mode first
mcpl install "email server" --mode bridge --dry-run

# 3. Install for testing
mcpl install "email server" --mode bridge --auto-start

# 4. If satisfied, install permanently
mcpl install "email server" --mode direct
```

### **Development Workflow**
```bash
# Install your local development server
mcpl install ./my-server --mode bridge --auto-start

# Or install from Docker for testing
mcpl install mycompany/server:dev --mode bridge
```

### **Production Workflow**
```bash
# Install verified production servers
mcpl install @verified/production-server --mode direct
mcpl install "The official company server" --mode direct
```

## 🔧 **Error Handling**

The CLI gracefully handles various scenarios:

- **Package not found**: Shows helpful error message
- **Network issues**: Provides fallback options
- **Invalid input**: Suggests correct format
- **Permission issues**: Clear instructions

## 💡 **Pro Tips**

1. **Use `--dry-run`** to test before installing
2. **Use bridge mode** for quick testing
3. **Use natural language** when you don't know exact package names
4. **Check `mcpl list`** to see what's installed
5. **Use `mcpl status`** to monitor running servers

---

**🌟 MCPL makes MCP server installation as easy as describing what you need!**
