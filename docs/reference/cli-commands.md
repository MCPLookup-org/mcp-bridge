# 📋 CLI Commands Reference

**Complete reference for all MCPL command-line interface commands.**

## 📋 **Command Overview**

```bash
mcpl <command> [options]
```

### **Available Commands**
- [`search`](#search) - Search for MCP servers
- [`install`](#install) - Install MCP servers
- [`uninstall`](#uninstall) - Remove MCP servers
- [`list`](#list) - List servers and information
- [`status`](#status) - Check server status
- [`control`](#control) - Control server lifecycle
- [`health`](#health) - Health monitoring
- [`bridge`](#bridge) - Start bridge server
- [`login`](#login) - Authentication management
- [`config`](#config) - Configuration management
- [`logs`](#logs) - View logs
- [`help`](#help) - Get help

## 🔍 **search**

Search for MCP servers in the registry.

### **Syntax**
```bash
mcpl search <query> [options]
```

### **Options**
- `--smart, -s` - Use AI-powered search
- `--limit, -l <number>` - Maximum results (default: 10)
- `--category, -c <category>` - Filter by category
- `--transport, -t <transport>` - Filter by transport (stdio, sse, websocket)
- `--capability <capability>` - Filter by capability
- `--domain <domain>` - Filter by domain
- `--api-key <key>` - API key for authentication

### **Examples**
```bash
# Basic search
mcpl search "filesystem tools"

# AI-powered search
mcpl search "I need email automation" --smart

# Search with filters
mcpl search "database" --category productivity --limit 5

# Search by transport
mcpl search "tools" --transport stdio

# Search with API key
mcpl search "servers" --api-key your-key
```

### **Output Format**
```
🔍 Found 3 servers matching "filesystem":

📦 @modelcontextprotocol/server-filesystem
   📝 File system operations (read, write, list)
   🏷️  filesystem, files, storage
   ⭐ 4.8/5 (1,234 installs)
   📋 npm install @modelcontextprotocol/server-filesystem

📦 @company/advanced-filesystem
   📝 Advanced file operations with permissions
   🏷️  filesystem, permissions, security  
   ⭐ 4.6/5 (567 installs)
   📋 npm install @company/advanced-filesystem
```

## 📦 **install**

Install MCP servers locally.

### **Syntax**
```bash
mcpl install <package> [options]
```

### **Options**
- `--mode, -m <mode>` - Installation mode (bridge, direct) (default: direct)
- `--global, -g` - Install on host system (Smithery-style)
- `--auto-start, -a` - Auto-start server (bridge mode only)
- `--env <key=value>` - Set environment variables
- `--config <file>` - Configuration file
- `--name <name>` - Custom server name
- `--dry-run` - Show installation plan without executing
- `--force, -f` - Force reinstallation

### **Examples**
```bash
# Basic installation (direct mode, Docker isolated)
mcpl install @modelcontextprotocol/server-filesystem

# Bridge mode with auto-start
mcpl install @company/server --mode bridge --auto-start

# Global installation (host execution)
mcpl install @company/server --global

# With environment variables
mcpl install @company/server --env API_KEY=secret --env DEBUG=true

# With custom name
mcpl install @company/server --name my-custom-server

# Dry run to see what would happen
mcpl install @company/server --dry-run

# Force reinstallation
mcpl install @company/server --force
```

### **Installation Modes**

#### **Direct Mode (Default)**
```bash
mcpl install @company/server
# Adds to Claude Desktop config, Docker isolated
```

#### **Bridge Mode**
```bash
mcpl install @company/server --mode bridge
# Managed by bridge server, dynamic tools
```

#### **Global Mode**
```bash
mcpl install @company/server --global
# Installs on host system (Smithery-style)
```

## 🗑️ **uninstall**

Remove installed MCP servers.

### **Syntax**
```bash
mcpl uninstall <server-name> [options]
```

### **Options**
- `--force, -f` - Force removal without confirmation
- `--keep-data` - Keep server data/configuration
- `--all` - Remove all servers

### **Examples**
```bash
# Remove specific server
mcpl uninstall filesystem-server

# Force removal
mcpl uninstall filesystem-server --force

# Remove all servers
mcpl uninstall --all

# Remove but keep data
mcpl uninstall filesystem-server --keep-data
```

## 📋 **list**

List servers and information.

### **Syntax**
```bash
mcpl list [type] [options]
```

### **Types**
- `servers` - List installed servers (default)
- `available` - List available servers from registry
- `bridge` - List bridge mode servers only
- `direct` - List direct mode servers only

### **Options**
- `--mode, -m <mode>` - Filter by mode (bridge, direct, all) (default: all)
- `--status, -s` - Show status information
- `--health, -h` - Show health information
- `--tools, -t` - Show available tools
- `--json` - Output in JSON format
- `--limit, -l <number>` - Limit results

### **Examples**
```bash
# List all installed servers
mcpl list

# List only bridge mode servers
mcpl list --mode bridge

# List with status information
mcpl list --status

# List available servers from registry
mcpl list available --limit 20

# JSON output
mcpl list --json

# List with tools
mcpl list --tools
```

### **Output Format**
```
📋 Installed Servers (3):

🌉 Bridge Mode:
├── 📦 filesystem-server (@modelcontextprotocol/server-filesystem)
│   ├── 🟢 Status: Running (PID: 12345)
│   ├── 🏥 Health: Healthy (last check: 2m ago)
│   └── 🔧 Tools: read_file, write_file, list_directory (3 total)

📋 Direct Mode:
├── 📦 email-server (@company/email-server)
│   ├── 🟡 Status: Configured (restart Claude to activate)
│   └── 🔧 Tools: send_email, read_inbox, manage_contacts (5 total)
```

## 📊 **status**

Check server status and health.

### **Syntax**
```bash
mcpl status [server-name] [options]
```

### **Options**
- `--watch, -w` - Watch status in real-time
- `--refresh, -r <seconds>` - Refresh interval for watch (default: 5)
- `--json` - Output in JSON format
- `--detailed, -d` - Show detailed information

### **Examples**
```bash
# Check all servers
mcpl status

# Check specific server
mcpl status filesystem-server

# Watch in real-time
mcpl status --watch

# Detailed status
mcpl status --detailed

# JSON output
mcpl status --json
```

### **Output Format**
```
📊 Server Status:

🌉 Bridge Mode Servers:
├── 📦 filesystem-server
│   ├── 🟢 Status: Running (PID: 12345)
│   ├── 🏥 Health: Healthy
│   ├── 💾 Memory: 45.2 MB
│   ├── ⚡ CPU: 0.1%
│   └── 🕐 Uptime: 2h 15m

📋 Direct Mode Servers:
├── 📦 email-server
│   ├── 🟡 Status: Configured
│   └── 📝 Note: Restart Claude Desktop to activate
```

## 🎮 **control**

Control server lifecycle (bridge mode only).

### **Syntax**
```bash
mcpl control <server-name> <action> [options]
```

### **Actions**
- `start` - Start server
- `stop` - Stop server
- `restart` - Restart server
- `reload` - Reload configuration

### **Options**
- `--force, -f` - Force action
- `--timeout, -t <seconds>` - Timeout for action (default: 30)

### **Examples**
```bash
# Start server
mcpl control filesystem-server start

# Stop server
mcpl control filesystem-server stop

# Restart server
mcpl control filesystem-server restart

# Force restart
mcpl control filesystem-server restart --force

# Reload configuration
mcpl control filesystem-server reload
```

## 🏥 **health**

Health monitoring and diagnostics.

### **Syntax**
```bash
mcpl health [server-name] [options]
```

### **Options**
- `--watch, -w` - Watch health in real-time
- `--report, -r` - Generate health report
- `--fix` - Attempt to fix unhealthy servers
- `--json` - Output in JSON format

### **Examples**
```bash
# Check health of all servers
mcpl health

# Check specific server
mcpl health filesystem-server

# Watch health in real-time
mcpl health --watch

# Generate health report
mcpl health --report

# Attempt to fix issues
mcpl health --fix
```

### **Output Format**
```
🏥 Health Status:

✅ Healthy Servers (2):
├── 📦 filesystem-server (response: 45ms)
└── 📦 database-server (response: 67ms)

⚠️  Warning Servers (1):
├── 📦 email-server (high memory usage: 89%)

❌ Unhealthy Servers (0):

📊 Overall Health: 85% (3/3 servers responding)
```

## 🌉 **bridge**

Start the MCPL bridge server.

### **Syntax**
```bash
mcpl bridge [options]
```

### **Options**
- `--http` - Start HTTP server instead of stdio
- `--port, -p <port>` - HTTP server port (default: 3000)
- `--host <host>` - HTTP server host (default: localhost)
- `--log-level, -l <level>` - Log level (debug, info, warn, error)
- `--config, -c <file>` - Configuration file

### **Examples**
```bash
# Start as MCP server (stdio)
mcpl bridge

# Start as HTTP server
mcpl bridge --http --port 3000

# With debug logging
mcpl bridge --log-level debug

# With custom configuration
mcpl bridge --config bridge-config.json
```

## 🔐 **login**

Authentication management.

### **Syntax**
```bash
mcpl login [options]
mcpl logout
mcpl auth <subcommand>
```

### **Options**
- `--key, -k <api-key>` - Set API key
- `--interactive, -i` - Interactive login

### **Subcommands**
- `status` - Check authentication status
- `refresh` - Refresh authentication
- `clear` - Clear stored credentials

### **Examples**
```bash
# Login with API key
mcpl login --key your-api-key

# Interactive login
mcpl login --interactive

# Check auth status
mcpl auth status

# Logout
mcpl logout

# Clear credentials
mcpl auth clear
```

## ⚙️ **config**

Configuration management.

### **Syntax**
```bash
mcpl config <subcommand> [options]
```

### **Subcommands**
- `show` - Show current configuration
- `set <key> <value>` - Set configuration value
- `get <key>` - Get configuration value
- `reset` - Reset to defaults
- `edit` - Edit configuration file

### **Examples**
```bash
# Show configuration
mcpl config show

# Set values
mcpl config set defaultMode bridge
mcpl config set autoStart true

# Get value
mcpl config get defaultMode

# Reset to defaults
mcpl config reset

# Edit configuration file
mcpl config edit
```

## 📝 **logs**

View logs and debugging information.

### **Syntax**
```bash
mcpl logs [server-name] [options]
```

### **Options**
- `--follow, -f` - Follow log output
- `--lines, -n <number>` - Number of lines to show (default: 100)
- `--level, -l <level>` - Filter by log level
- `--since <time>` - Show logs since time
- `--json` - Output in JSON format

### **Examples**
```bash
# View all logs
mcpl logs

# View specific server logs
mcpl logs filesystem-server

# Follow logs in real-time
mcpl logs --follow

# Show last 50 lines
mcpl logs --lines 50

# Filter by level
mcpl logs --level error

# Show logs since 1 hour ago
mcpl logs --since 1h
```

## ❓ **help**

Get help information.

### **Syntax**
```bash
mcpl help [command]
mcpl <command> --help
mcpl --help
```

### **Examples**
```bash
# General help
mcpl help

# Command-specific help
mcpl help install
mcpl install --help

# Version information
mcpl --version
```

## 🌐 **Global Options**

These options work with all commands:

- `--api-key <key>` - API key for authentication
- `--config <file>` - Configuration file path
- `--debug` - Enable debug output
- `--quiet, -q` - Suppress output
- `--json` - JSON output format
- `--no-color` - Disable colored output
- `--help, -h` - Show help
- `--version, -v` - Show version

### **Examples**
```bash
# Debug mode
mcpl install @company/server --debug

# Quiet mode
mcpl list --quiet

# JSON output
mcpl status --json

# No colors
mcpl list --no-color
```

---

**🌟 This reference covers all MCPL CLI commands. Use `mcpl help <command>` for detailed help on any specific command.**
