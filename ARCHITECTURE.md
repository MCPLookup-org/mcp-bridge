# 🏗️ MCP Bridge Architecture

## System Overview

The MCP Bridge provides **API parity** with the main mcplookup.org server through automated OpenAPI generation and bridge tool synthesis.

```mermaid
graph TB
    subgraph "Main Server"
        MS[mcplookup.org Server]
        API[REST API Endpoints]
        DB[(Database)]
        SVC[Services Layer]
        
        MS --> API
        API --> SVC
        SVC --> DB
    end
    
    subgraph "OpenAPI Generation"
        SPEC[OpenAPI Spec]
        GEN[Bridge Generator]
        TOOLS[Generated Tools]
        
        API --> SPEC
        SPEC --> GEN
        GEN --> TOOLS
    end
    
    subgraph "MCP Bridge Package"
        BRIDGE[Bridge Classes]
        CLIENT[MCP Client]
        STDIO[Stdio Transport]
        
        TOOLS --> BRIDGE
        BRIDGE --> CLIENT
        CLIENT --> STDIO
    end
    
    subgraph "External Clients"
        CLAUDE[Claude Desktop]
        OTHER[Other MCP Clients]
        
        CLAUDE --> STDIO
        OTHER --> STDIO
    end
    
    BRIDGE -.->|HTTP Calls| API
```

## 🔧 Core Components

### **1. OpenAPI Specification**
- **Source**: Generated from main server code
- **Format**: OpenAPI 3.0 JSON/YAML
- **Content**: All REST API endpoints with schemas
- **Updates**: Automatic on API changes

### **2. Bridge Generator**
- **Input**: OpenAPI specification
- **Output**: TypeScript bridge tools
- **Process**: Automated code generation
- **Validation**: Schema and type checking

### **3. Bridge Tools**
- **Count**: 7 main tools + 1 bridge tool
- **Parity**: Identical to main server tools
- **Transport**: HTTP REST API calls
- **Authentication**: API key support

### **4. MCP Server**
- **Protocol**: Model Context Protocol
- **Transport**: Stdio (primary), HTTP (optional)
- **Interface**: Standard MCP tool interface
- **Clients**: Claude Desktop, other MCP clients

## 📋 Tool Architecture

### **Main Server Tools (7)**

#### **Discovery Tools**
```typescript
// discover_mcp_servers
{
  endpoint: 'GET /v1/discover',
  parameters: {
    query?: string,
    domain?: string,
    capability?: string,
    limit?: number
  },
  response: ServerDiscoveryResult[]
}

// browse_capabilities  
{
  endpoint: 'GET /v1/capabilities',
  parameters: {
    category?: string,
    search?: string,
    popular?: boolean
  },
  response: CapabilityInfo[]
}

// list_mcp_tools
{
  endpoint: 'GET /v1/tools',
  parameters: {},
  response: ToolInfo[]
}
```

#### **Registration Tools**
```typescript
// register_mcp_server
{
  endpoint: 'POST /v1/register',
  parameters: {
    domain: string,
    endpoint: string,
    capabilities?: string[],
    category?: string,
    auth_type?: string,
    contact_email?: string,
    description?: string,
    user_id: string
  },
  response: RegistrationResult
}

// verify_domain_ownership
{
  endpoint: 'POST /v1/verify',
  parameters: {
    domain: string,
    challenge_id?: string
  },
  response: VerificationResult
}
```

#### **Monitoring Tools**
```typescript
// get_server_health
{
  endpoint: 'GET /v1/health',
  parameters: {
    domain?: string,
    domains?: string[]
  },
  response: HealthMetrics[]
}

// get_discovery_stats
{
  endpoint: 'GET /v1/stats',
  parameters: {
    timeframe?: 'hour' | 'day' | 'week' | 'month',
    metric?: 'discoveries' | 'registrations' | 'health_checks' | 'popular_domains'
  },
  response: AnalyticsData
}
```

### **Bridge Tool (1)**

#### **Universal MCP Client**
```typescript
// invoke_tool
{
  functionality: 'Call any tool on any streaming HTTP MCP server',
  parameters: {
    endpoint: string,      // Target MCP server URL
    tool_name: string,     // Tool to call
    arguments?: object,    // Tool arguments
    auth_headers?: object  // Authentication headers
  },
  transport: ['StreamableHTTP', 'SSE'],
  response: ToolResult
}
```

## 🔄 Data Flow

### **1. Bridge Tool Execution**

```mermaid
sequenceDiagram
    participant Client as MCP Client
    participant Bridge as Bridge Server
    participant API as mcplookup.org API
    participant DB as Database
    
    Client->>Bridge: Call bridge tool
    Bridge->>Bridge: Validate parameters
    Bridge->>API: HTTP request
    API->>DB: Query/Update data
    DB->>API: Return data
    API->>Bridge: HTTP response
    Bridge->>Bridge: Format MCP response
    Bridge->>Client: Return tool result
```

### **2. Universal Tool Invocation**

```mermaid
sequenceDiagram
    participant Client as MCP Client
    participant Bridge as Bridge Server
    participant Target as Target MCP Server
    
    Client->>Bridge: invoke_tool request
    Bridge->>Bridge: Create MCP client
    Bridge->>Target: Connect via HTTP/SSE
    Bridge->>Target: Call target tool
    Target->>Bridge: Tool result
    Bridge->>Target: Disconnect
    Bridge->>Client: Return result
```

## 🏛️ Class Architecture

### **Core Classes**

```typescript
// Main bridge implementation
class BridgeToolsWithAPIParity {
  private server: McpServer;
  private apiBaseUrl: string;
  private apiKey?: string;
  
  constructor(server, apiBaseUrl, apiKey?)
  private setupBridgeTools(): void
  private makeApiRequest(path, method, params): Promise<any>
}

// Integration helper
class IntegratedBridge {
  private server: McpServer;
  private bridgeTools: BridgeToolsWithAPIParity;
  
  constructor(server, apiKey?)
  getAvailableTools(): ToolMetadata[]
  getToolsByCategory(category): string[]
  hasToolAvailable(toolName): boolean
}

// Main bridge classes
class MCPHttpBridge {
  private server: McpServer;
  private integratedBridge: IntegratedBridge;
  
  constructor(httpEndpoint?, authHeaders?)
  async run(): Promise<void>
  async close(): Promise<void>
}

class EnhancedMCPBridge extends MCPHttpBridge {
  getAvailableTools(): ToolMetadata[]
  getToolsByCategory(category): string[]
  hasToolAvailable(toolName): boolean
  getToolMetadata(toolName): ToolMetadata
}
```

### **Type Definitions**

```typescript
interface ToolMetadata {
  name: string;
  description: string;
  category: string;
  source: 'bridge';
}

interface BridgeConfig {
  apiBaseUrl?: string;
  apiKey?: string;
  httpEndpoint?: string;
  authHeaders?: Record<string, string>;
}

interface InvokeToolArgs {
  endpoint: string;
  tool_name: string;
  arguments?: Record<string, any>;
  auth_headers?: Record<string, string>;
}
```

## 🔧 Generation Architecture

### **OpenAPI to Bridge Pipeline**

```mermaid
graph LR
    subgraph "Source"
        CODE[Server Code]
        ROUTES[API Routes]
    end
    
    subgraph "Extraction"
        EXTRACT[Extract Schemas]
        VALIDATE[Validate Spec]
        SPEC[OpenAPI Spec]
    end
    
    subgraph "Generation"
        PARSE[Parse Endpoints]
        MAP[Map to Tools]
        ZOD[Generate Zod Schemas]
        IMPL[Generate Implementations]
    end
    
    subgraph "Output"
        TOOLS[Bridge Tools]
        TYPES[TypeScript Types]
        DOCS[Documentation]
    end
    
    CODE --> EXTRACT
    ROUTES --> EXTRACT
    EXTRACT --> VALIDATE
    VALIDATE --> SPEC
    
    SPEC --> PARSE
    PARSE --> MAP
    MAP --> ZOD
    ZOD --> IMPL
    
    IMPL --> TOOLS
    IMPL --> TYPES
    IMPL --> DOCS
```

### **Tool Generation Logic**

```typescript
interface ToolGenerator {
  // Extract endpoint information
  extractEndpoints(spec: OpenAPIV3.Document): EndpointInfo[];
  
  // Generate tool names
  generateToolName(endpoint: EndpointInfo): string;
  
  // Convert OpenAPI parameters to Zod schemas
  generateZodSchema(parameters: ParameterInfo[]): ZodSchema;
  
  // Generate tool implementation
  generateImplementation(endpoint: EndpointInfo): string;
  
  // Render complete bridge file
  renderBridgeFile(tools: ToolInfo[]): string;
}
```

## 🚀 Deployment Architecture

### **Package Distribution**

```mermaid
graph TB
    subgraph "Development"
        DEV[Developer Changes]
        BUILD[Build Process]
        TEST[Testing]
    end
    
    subgraph "CI/CD"
        GH[GitHub Actions]
        GEN[Generate Bridge]
        PUB[Publish NPM]
    end
    
    subgraph "Distribution"
        NPM[NPM Registry]
        CDN[CDN Distribution]
    end
    
    subgraph "Usage"
        INSTALL[npm install]
        IMPORT[Import Bridge]
        RUN[Run Bridge]
    end
    
    DEV --> BUILD
    BUILD --> TEST
    TEST --> GH
    
    GH --> GEN
    GEN --> PUB
    PUB --> NPM
    NPM --> CDN
    
    CDN --> INSTALL
    INSTALL --> IMPORT
    IMPORT --> RUN
```

### **Runtime Architecture**

```mermaid
graph TB
    subgraph "User Environment"
        APP[User Application]
        BRIDGE[Bridge Instance]
        CLIENT[MCP Client]
    end
    
    subgraph "MCP Protocol"
        STDIO[Stdio Transport]
        TOOLS[Tool Calls]
        RESP[Responses]
    end
    
    subgraph "External Services"
        API[mcplookup.org API]
        MCP[Other MCP Servers]
    end
    
    APP --> BRIDGE
    BRIDGE --> CLIENT
    CLIENT --> STDIO
    
    STDIO --> TOOLS
    TOOLS --> RESP
    
    BRIDGE -.->|HTTP| API
    BRIDGE -.->|MCP| MCP
```

## 🎯 Design Principles

### **API Parity**
- Bridge tools provide identical functionality to main server
- Same tool names, parameters, and response formats
- Transparent switching between direct and API access

### **Automatic Sync**
- Bridge tools automatically updated when API changes
- No manual maintenance required
- Single source of truth (OpenAPI spec)

### **Type Safety**
- Generated TypeScript interfaces
- Compile-time validation
- Runtime schema validation with Zod

### **Universal Connectivity**
- Bridge can connect to any MCP server
- Support for multiple transport protocols
- Flexible authentication mechanisms

### **Developer Experience**
- Simple installation and usage
- Clear documentation and examples
- Comprehensive error handling

---

**This architecture ensures robust, maintainable, and scalable bridge functionality with perfect API parity!** 🚀
