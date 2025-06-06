# 🐳 Dockerization Architecture

MCPL uses a **centralized, DRY dockerization system** that eliminates code duplication and provides consistent Docker command generation across all modes.

## 🏗️ **Architecture Overview**

### **Centralized Docker Management**
All Docker command creation is handled by the `DockerManager` class with a single source of truth for:
- Docker command structure
- Environment variable handling
- Security options
- Resource limits
- Container naming

### **DRY Principle Implementation**
Instead of duplicating Docker command logic, we have:
- ✅ **One method** for creating npm Docker commands
- ✅ **Consistent** container naming and options
- ✅ **Shared** security and resource management
- ✅ **Centralized** environment variable handling

## 🔧 **Docker Command Generation**

### **Core Method: `createNpmDockerCommand`**
```typescript
createNpmDockerCommand(packageName: string, options: {
  containerName?: string;
  mode?: 'bridge' | 'direct';
  env?: Record<string, string>;
  includePortMapping?: boolean;
}): string[]
```

**Features:**
- 🎯 **Mode-aware**: Different optimizations for bridge vs direct
- 🔒 **Security**: Automatic security hardening for direct mode
- 📊 **Resources**: Memory and CPU limits for production
- 🌍 **Environment**: Proper env var injection
- 🏷️ **Naming**: Consistent container naming scheme

### **Bridge Mode Dockerization**
```typescript
// Bridge mode: Optimized for dynamic management
const command = dockerManager.createNpmDockerCommand(packageName, {
  containerName: `mcp-${serverName}`,
  mode: 'bridge',
  env: environmentVars,
  includePortMapping: false // stdio doesn't need ports
});
```

**Generated Command:**
```bash
docker run --rm -i \
  --name mcp-filesystem \
  -e API_KEY=value \
  node:18-alpine \
  sh -c "npm install -g @pkg/server && npx @pkg/server"
```

### **Direct Mode Dockerization**
```typescript
// Direct mode: Hardened for production
const args = dockerManager.createDirectModeDockerArgs(packageName, env);
```

**Generated Command:**
```bash
docker run --rm -i \
  --name mcp-direct-filesystem \
  --memory 512m \
  --cpus 0.5 \
  --pids-limit 100 \
  --read-only \
  --no-new-privileges \
  --security-opt no-new-privileges:true \
  -e API_KEY=value \
  node:18-alpine \
  sh -c "npm install -g @pkg/server && npx @pkg/server"
```

## 🔄 **Mode Differences**

| Feature | Bridge Mode | Direct Mode |
|---------|-------------|-------------|
| **Container Name** | `mcp-{server}` | `mcp-direct-{package}` |
| **Security Options** | Basic | Full hardening |
| **Resource Limits** | None | Memory/CPU/PID limits |
| **Port Mapping** | None (stdio) | None (stdio) |
| **Management** | Dynamic | Static config |

## 🔒 **Security Features**

### **Direct Mode Security (Production)**
```bash
--read-only              # Read-only filesystem
--no-new-privileges      # Prevent privilege escalation
--security-opt no-new-privileges:true
--memory 512m            # Memory limit
--cpus 0.5              # CPU limit
--pids-limit 100        # Process limit
```

### **Bridge Mode Security (Development)**
- Basic container isolation
- No resource limits (for development flexibility)
- Easy debugging and testing

## 🌍 **Environment Variable Handling**

### **Centralized Injection**
```typescript
addEnvironmentVariables(command: string[], env: Record<string, string>): string[]
```

**Features:**
- ✅ Proper escaping and quoting
- ✅ Consistent placement in command
- ✅ Support for complex values
- ✅ Validation and error handling

### **Example with Environment Variables**
```bash
docker run --rm -i \
  --name mcp-server \
  -e DATABASE_URL="postgresql://localhost:5432/db" \
  -e API_KEY="secret-key" \
  -e DEBUG="true" \
  node:18-alpine \
  sh -c "npm install -g @company/server && npx @company/server"
```

## 📊 **Resource Management**

### **Production Limits (Direct Mode)**
```typescript
addResourceLimits(command, {
  memory: '512m',    // 512MB RAM limit
  cpus: '0.5',       // 0.5 CPU cores
  pidsLimit: 100     // Max 100 processes
})
```

### **Benefits**
- 🛡️ **Protection**: Prevents resource exhaustion
- ⚡ **Performance**: Consistent resource allocation
- 🔍 **Monitoring**: Predictable resource usage
- 🏢 **Enterprise**: Production-ready defaults

## 🎯 **Container Naming Strategy**

### **Bridge Mode**
- Pattern: `mcp-{serverName}`
- Example: `mcp-filesystem`, `mcp-email-server`
- Purpose: Easy identification and management

### **Direct Mode**
- Pattern: `mcp-direct-{packageName}`
- Example: `mcp-direct-filesystem`, `mcp-direct-email-server`
- Purpose: Distinguish from bridge containers

### **Benefits**
- 🏷️ **Clear identification** of container purpose
- 🔍 **Easy debugging** with descriptive names
- 🧹 **Simple cleanup** with predictable patterns
- 📊 **Monitoring** and logging integration

## 🔧 **Usage Examples**

### **Bridge Mode Installation**
```typescript
// Automatic dockerization with environment
await dockerManager.dockerizeNpmServer(server, {
  API_KEY: 'secret',
  DEBUG: 'true'
});
```

### **Direct Mode Installation**
```typescript
// Get Docker args for Claude Desktop config
const dockerArgs = dockerManager.createDirectModeDockerArgs(
  '@company/server',
  { API_KEY: 'secret' }
);

// Results in Claude config:
{
  "server": {
    "command": "docker",
    "args": ["run", "--rm", "-i", "--name", "mcp-direct-server", ...]
  }
}
```

## 🎉 **Benefits of DRY Architecture**

### **Code Quality**
- ✅ **No duplication**: Single source of truth
- ✅ **Consistency**: Same behavior across modes
- ✅ **Maintainability**: Changes in one place
- ✅ **Testing**: Easier to test and validate

### **Feature Parity**
- ✅ **Security**: Same security features available
- ✅ **Environment**: Consistent env var handling
- ✅ **Resources**: Shared resource management
- ✅ **Naming**: Predictable container names

### **Developer Experience**
- ✅ **Predictable**: Same Docker patterns everywhere
- ✅ **Debuggable**: Consistent command structure
- ✅ **Extensible**: Easy to add new features
- ✅ **Documented**: Clear architecture and usage

## 🚀 **Future Enhancements**

The centralized architecture enables easy addition of:
- 🔍 **Health checks**: Container health monitoring
- 📊 **Metrics**: Resource usage tracking
- 🔄 **Auto-restart**: Failure recovery
- 🌐 **Networking**: Custom network configurations
- 💾 **Volumes**: Persistent data handling

---

**🌟 The DRY dockerization architecture provides consistent, secure, and maintainable container management across all MCPL modes!**
