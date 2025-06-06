# Authentication Examples for MCPLookup Bridge

## 🔐 Auth Headers Support

The `invoke_tool` now supports authentication headers for secure MCP servers.

## 🚀 Usage Examples

### Example 1: Bearer Token Authentication

```typescript
await bridge.invoke_tool({
  endpoint: "https://secure-server.com/mcp",
  tool_name: "get_user_data",
  arguments: { user_id: "12345" },
  auth_headers: {
    "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
});
```

### Example 2: API Key Authentication

```typescript
await bridge.invoke_tool({
  endpoint: "https://api-server.com/mcp",
  tool_name: "create_resource",
  arguments: { name: "New Resource" },
  auth_headers: {
    "X-API-Key": "your-api-key-here",
    "X-Client-ID": "your-client-id"
  }
});
```

### Example 3: Multiple Headers

```typescript
await bridge.invoke_tool({
  endpoint: "https://enterprise-server.com/mcp",
  tool_name: "admin_action",
  arguments: { action: "backup" },
  auth_headers: {
    "Authorization": "Bearer token",
    "X-API-Key": "api-key",
    "X-Tenant-ID": "tenant-123",
    "User-Agent": "MCPLookup-Bridge/1.0.0"
  }
});
```

### Example 4: OAuth2 with Custom Headers

```typescript
await bridge.invoke_tool({
  endpoint: "https://oauth-server.com/mcp",
  tool_name: "protected_operation",
  arguments: { data: "sensitive" },
  auth_headers: {
    "Authorization": "Bearer oauth2-access-token",
    "X-Scope": "read write admin",
    "X-Client-Version": "1.0.0"
  }
});
```

## 🔧 Technical Implementation

### Streamable HTTP Transport
- Headers passed via `requestInit.headers`
- Supports all standard HTTP headers
- Works with modern MCP servers

### SSE Transport (Legacy)
- Headers passed via `requestInit.headers` for POST requests
- EventSource connections may have limited header support
- Fallback for older MCP servers

## 🛡️ Security Best Practices

### 1. Environment Variables
```bash
export MCP_API_TOKEN="your-secure-token"
export MCP_CLIENT_ID="your-client-id"
```

### 2. Secure Token Storage
```typescript
// Don't hardcode tokens!
const authHeaders = {
  "Authorization": `Bearer ${process.env.MCP_API_TOKEN}`,
  "X-Client-ID": process.env.MCP_CLIENT_ID
};

await bridge.invoke_tool({
  endpoint: "https://secure-server.com/mcp",
  tool_name: "secure_operation",
  auth_headers: authHeaders
});
```

### 3. Token Refresh
```typescript
// Implement token refresh logic
async function callWithAuth(endpoint, toolName, args) {
  let token = await getValidToken();
  
  try {
    return await bridge.invoke_tool({
      endpoint,
      tool_name: toolName,
      arguments: args,
      auth_headers: {
        "Authorization": `Bearer ${token}`
      }
    });
  } catch (error) {
    if (error.message.includes('401') || error.message.includes('Unauthorized')) {
      // Refresh token and retry
      token = await refreshToken();
      return await bridge.invoke_tool({
        endpoint,
        tool_name: toolName,
        arguments: args,
        auth_headers: {
          "Authorization": `Bearer ${token}`
        }
      });
    }
    throw error;
  }
}
```

## 🎯 Common Authentication Patterns

### GitHub API
```typescript
auth_headers: {
  "Authorization": "token ghp_xxxxxxxxxxxx",
  "User-Agent": "MCPLookup-Bridge"
}
```

### Google APIs
```typescript
auth_headers: {
  "Authorization": "Bearer ya29.xxxxxxxxxxxx",
  "X-Goog-User-Project": "project-id"
}
```

### Custom Enterprise APIs
```typescript
auth_headers: {
  "X-API-Key": "enterprise-key",
  "X-Tenant": "tenant-id",
  "X-User-Role": "admin"
}
```

## ✅ Testing Authentication

```typescript
// Test auth headers are working
try {
  const result = await bridge.invoke_tool({
    endpoint: "https://httpbin.org/headers",
    tool_name: "echo_headers",
    auth_headers: {
      "X-Test-Auth": "test-value"
    }
  });
  console.log('Auth headers sent successfully:', result);
} catch (error) {
  console.error('Auth test failed:', error);
}
```

🔐 **Auth headers are now fully supported for secure MCP server connections!**
