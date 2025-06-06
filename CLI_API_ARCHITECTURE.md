# 🏗️ CLI API Architecture

The MCPL CLI uses a **clean, layered architecture** that properly separates concerns between remote API operations and local bridge operations.

## 🎯 **Architecture Overview**

### **Three-Layer Design**

```
┌─────────────────────────────────────────┐
│              CLI Commands               │  ← User Interface Layer
├─────────────────────────────────────────┤
│            Bridge API Layer             │  ← Abstraction Layer
├─────────────────────────────────────────┤
│  Generated API Client  │  Local Bridge  │  ← Implementation Layer
│  (mcplookup.org)      │  (Components)   │
└─────────────────────────────────────────┘
```

### **Layer Responsibilities**

#### **1. CLI Commands Layer**
- User interface and command parsing
- Input validation and formatting
- Progress indicators and user feedback
- Error handling and help text

#### **2. Bridge API Layer**
- Unified interface for CLI commands
- Proper abstraction over implementation details
- Consistent response format handling
- Clean separation of remote vs local operations

#### **3. Implementation Layer**
- **Generated API Client**: Remote mcplookup.org operations
- **Local Bridge Components**: Local server management

## 🔄 **Operation Types**

### **Remote API Operations**
Operations that communicate with mcplookup.org:

```typescript
// Search and discovery
await bridge.api.discoverServers({ limit: 20 });
await bridge.api.smartDiscovery({ query: "email tools", limit: 5 });

// Server registration
await bridge.api.registerServer({ name: "my-server", ... });

// User management
await bridge.api.getOnboardingState();
```

**Implementation:**
- Uses **generated API client** internally
- Handles authentication and network requests
- Provides search, discovery, and registration features

### **Local Bridge Operations**
Operations that manage local servers and configuration:

```typescript
// Server installation and management
await bridge.api.installServer({ name: "server", type: "npm", ... });
await bridge.api.listManagedServers();
await bridge.api.controlServer({ name: "server", action: "start" });

// Configuration management
await bridge.api.listClaudeServers();
await bridge.api.getServerHealth("server-name");
```

**Implementation:**
- Uses **local bridge components** directly
- Manages Docker containers and Claude Desktop config
- Provides installation, lifecycle, and health management

## 🎯 **Why This Architecture?**

### **✅ Correct Separation**
```typescript
// ✅ CORRECT: Remote operations use generated API client
const servers = await bridge.api.discoverServers({ query: "filesystem" });

// ✅ CORRECT: Local operations use bridge components  
const result = await bridge.api.installServer({ name: "fs", type: "npm" });
```

### **❌ What We Avoided**
```typescript
// ❌ WRONG: CLI directly accessing components
await bridge.components.coreTools['discoverServers']({ ... });
await bridge.components.serverManagementTools['installServer']({ ... });

// ❌ WRONG: Using API client for local operations
await bridge.apiClient.installServer({ ... }); // This doesn't exist!
```

## 🔧 **Implementation Details**

### **Bridge API Getter**
```typescript
get api() {
  const coreTools = this.coreTools;
  const serverManagementTools = this.serverManagementTools;
  const serverRegistry = this.serverRegistry;
  
  return {
    // Remote operations (delegate to core tools)
    async discoverServers(params) {
      return await coreTools['discoverServers'](params);
    },
    
    // Local operations (delegate to components)
    async installServer(params) {
      return await serverManagementTools.installServer(params);
    }
  };
}
```

### **CLI Command Usage**
```typescript
export class SearchCommand extends BaseCommand {
  async execute(query: string, options: SearchOptions) {
    // Clean, simple API call
    const result = await this.bridge.api.discoverServers({
      query,
      limit: parseInt(options.limit)
    });
    
    const response = JSON.parse(result.content[0].text);
    this.displayResults(response);
  }
}
```

## 📊 **Data Flow**

### **Search Operation Flow**
```
User Input: mcpl search "filesystem"
     ↓
CLI Command: SearchCommand.execute()
     ↓
Bridge API: bridge.api.discoverServers()
     ↓
Core Tools: coreTools['discoverServers']()
     ↓
Generated API Client: apiClient.discover()
     ↓
HTTP Request: → mcplookup.org/api/discover
     ↓
Response: ← Server list JSON
     ↓
CLI Output: Formatted table
```

### **Install Operation Flow**
```
User Input: mcpl install @company/server
     ↓
CLI Command: InstallCommand.execute()
     ↓
Bridge API: bridge.api.installServer()
     ↓
Server Management: serverManagementTools.installServer()
     ↓
Docker Manager: dockerManager.createNpmDockerCommand()
     ↓
Claude Config: claudeConfigManager.addServer()
     ↓
File System: Claude Desktop config updated
```

## 🎯 **Benefits Achieved**

### **1. Clean Abstraction**
- CLI commands don't need to know about implementation details
- Consistent interface regardless of operation type
- Easy to mock and test individual layers

### **2. Proper Separation**
- Remote operations clearly separated from local operations
- Generated API client used only for remote calls
- Local components used only for local operations

### **3. Maintainability**
- Changes to API client don't affect CLI commands
- Changes to local components don't affect CLI commands
- Bridge API layer provides stable interface

### **4. Extensibility**
- Easy to add new remote operations (add to core tools)
- Easy to add new local operations (add to server management)
- CLI commands automatically get new functionality

## 🔍 **Component Relationships**

### **Generated API Client Usage**
```typescript
// Core Tools use the generated API client
class CoreTools {
  async discoverServers(params) {
    return await this.apiClient.discover(params);
  }
}

// CLI accesses via bridge API
const result = await bridge.api.discoverServers(params);
```

### **Local Component Usage**
```typescript
// Server Management Tools are local components
class ServerManagementTools {
  async installServer(params) {
    // Local Docker and config operations
    return await this.dockerManager.dockerizeNpmServer(...);
  }
}

// CLI accesses via bridge API
const result = await bridge.api.installServer(params);
```

## 🚀 **Future Enhancements**

The clean architecture enables easy addition of:

### **New Remote Operations**
```typescript
// Add to core tools
async getServerMetrics(serverId) {
  return await this.apiClient.getMetrics(serverId);
}

// Automatically available in CLI
const metrics = await bridge.api.getServerMetrics("server-123");
```

### **New Local Operations**
```typescript
// Add to server management tools
async backupConfiguration() {
  return await this.claudeConfigManager.createBackup();
}

// Automatically available in CLI
const backup = await bridge.api.backupConfiguration();
```

## 📋 **Summary**

### **✅ What We Have**
- **Clean separation** between remote and local operations
- **Proper abstraction** via bridge API layer
- **Generated API client** used correctly for remote calls
- **Local components** used correctly for local operations
- **Consistent interface** for all CLI commands
- **Maintainable architecture** with clear responsibilities

### **🎯 Key Principle**
**The CLI uses the generated API client indirectly through the bridge API layer, which provides the correct abstraction and ensures proper separation of concerns.**

---

**🌟 The CLI API architecture provides a clean, maintainable, and extensible foundation for all MCPL operations!**
