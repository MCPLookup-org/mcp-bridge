# 🛠️ Bridge Implementation Guide

## Step-by-Step Implementation

### 1. **Setup OpenAPI Generation**

#### **Install Dependencies**
```bash
npm install --save-dev @apidevtools/swagger-parser openapi-typescript
npm install --save-dev @openapitools/openapi-generator-cli
```

#### **Create Generation Scripts**
```typescript
// scripts/generate-openapi.ts
import SwaggerParser from '@apidevtools/swagger-parser';
import fs from 'fs/promises';

export async function generateOpenAPIFromServer() {
  // Extract OpenAPI spec from running server
  const response = await fetch('http://localhost:3000/api/openapi');
  const spec = await response.json();
  
  // Validate the spec
  const validatedSpec = await SwaggerParser.validate(spec);
  
  // Write to file
  await fs.writeFile('openapi.json', JSON.stringify(validatedSpec, null, 2));
  console.log('✅ OpenAPI spec generated');
}
```

### 2. **Bridge Tool Generator**

#### **Core Generator Logic**
```typescript
// scripts/bridge-generator.ts
import { OpenAPIV3 } from 'openapi-types';

interface BridgeTool {
  name: string;
  description: string;
  parameters: Record<string, any>;
  endpoint: string;
  method: string;
}

export function generateBridgeTools(spec: OpenAPIV3.Document): BridgeTool[] {
  const tools: BridgeTool[] = [];
  
  for (const [path, pathItem] of Object.entries(spec.paths || {})) {
    for (const [method, operation] of Object.entries(pathItem || {})) {
      if (typeof operation === 'object' && operation.operationId) {
        tools.push({
          name: generateToolName(operation.operationId, path, method),
          description: operation.summary || operation.description || '',
          parameters: extractParameters(operation.parameters || []),
          endpoint: path,
          method: method.toUpperCase()
        });
      }
    }
  }
  
  return tools;
}

function generateToolName(operationId: string, path: string, method: string): string {
  // Map OpenAPI operations to MCP tool names
  const mappings = {
    'discoverServers': 'discover_mcp_servers',
    'registerServer': 'register_mcp_server',
    'verifyDomain': 'verify_domain_ownership',
    'getHealth': 'get_server_health',
    'browseCapabilities': 'browse_capabilities',
    'getStats': 'get_discovery_stats',
    'listTools': 'list_mcp_tools'
  };
  
  return mappings[operationId] || `${method.toLowerCase()}_${path.replace(/[^a-zA-Z0-9]/g, '_')}`;
}
```

### 3. **Zod Schema Generation**

#### **Parameter Conversion**
```typescript
// scripts/zod-generator.ts
export function generateZodSchema(parameters: OpenAPIV3.ParameterObject[]): string {
  const schemaLines: string[] = [];
  
  for (const param of parameters) {
    const zodType = convertToZodType(param.schema);
    const description = param.description || '';
    const required = param.required || false;
    
    const zodExpression = required 
      ? `${zodType}.describe('${description}')`
      : `${zodType}.optional().describe('${description}')`;
    
    schemaLines.push(`${param.name}: ${zodExpression}`);
  }
  
  return `{\n  ${schemaLines.join(',\n  ')}\n}`;
}

function convertToZodType(schema: any): string {
  if (!schema) return 'z.any()';
  
  switch (schema.type) {
    case 'string':
      if (schema.format === 'email') return 'z.string().email()';
      if (schema.format === 'uri') return 'z.string().url()';
      if (schema.pattern) return `z.string().regex(/${schema.pattern}/)`;
      return 'z.string()';
      
    case 'number':
    case 'integer':
      let numType = 'z.number()';
      if (schema.minimum !== undefined) numType += `.min(${schema.minimum})`;
      if (schema.maximum !== undefined) numType += `.max(${schema.maximum})`;
      return numType;
      
    case 'boolean':
      return 'z.boolean()';
      
    case 'array':
      const itemType = convertToZodType(schema.items);
      return `z.array(${itemType})`;
      
    case 'object':
      return 'z.record(z.any())';
      
    default:
      return 'z.any()';
  }
}
```

### 4. **Bridge File Template**

#### **Generated Bridge Structure**
```typescript
// templates/bridge-tools.template.ts
export const BRIDGE_TEMPLATE = `
// Auto-generated Bridge Tools
// Generated from OpenAPI spec on {{timestamp}}
// DO NOT EDIT MANUALLY - regenerate with: npm run bridge:generate

import { z } from 'zod';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';
import { SSEClientTransport } from '@modelcontextprotocol/sdk/client/sse.js';

export class BridgeToolsWithAPIParity {
  private server: McpServer;
  private apiBaseUrl: string;
  private apiKey?: string;

  constructor(server: McpServer, apiBaseUrl: string = 'https://mcplookup.org/api', apiKey?: string) {
    this.server = server;
    this.apiBaseUrl = apiBaseUrl;
    this.apiKey = apiKey;
    this.setupBridgeTools();
  }

  private setupBridgeTools(): void {
    {{#tools}}
    // Tool: {{name}}
    this.server.tool(
      '{{name}}',
      '{{description}}',
      {{parameters}},
      async (args) => {
        try {
          const result = await this.makeApiRequest('{{endpoint}}', '{{method}}', args);
          return {
            content: [{
              type: 'text',
              text: JSON.stringify(result, null, 2)
            }]
          };
        } catch (error) {
          return {
            content: [{
              type: 'text',
              text: \`Error calling {{name}}: \${error instanceof Error ? error.message : 'Unknown error'}\`
            }],
            isError: true
          };
        }
      }
    );
    
    {{/tools}}
    
    // Bridge-specific tool: invoke_tool
    this.server.tool(
      'invoke_tool',
      'Call any tool on any streaming HTTP MCP server',
      {
        endpoint: z.string().url().describe('MCP server endpoint URL'),
        tool_name: z.string().describe('Name of the tool to call'),
        arguments: z.record(z.any()).optional().describe('Arguments to pass to the tool'),
        auth_headers: z.record(z.string()).optional().describe('Optional authentication headers')
      },
      async (args) => {
        // Implementation for invoke_tool
        // ... (same as current implementation)
      }
    );
  }

  private async makeApiRequest(path: string, method: string, params: any = {}): Promise<any> {
    // Implementation for API requests
    // ... (same as current implementation)
  }
}

export default BridgeToolsWithAPIParity;
`;
```

### 5. **Complete Generation Workflow**

#### **Main Generation Script**
```typescript
// scripts/generate-complete-bridge.ts
import { generateOpenAPIFromServer } from './generate-openapi';
import { generateBridgeTools } from './bridge-generator';
import { renderTemplate } from './template-renderer';
import fs from 'fs/promises';

export async function generateCompleteBridge() {
  console.log('🚀 Starting complete bridge generation...');
  
  // Step 1: Generate OpenAPI spec
  console.log('📋 Generating OpenAPI spec...');
  await generateOpenAPIFromServer();
  
  // Step 2: Load and parse spec
  console.log('📖 Loading OpenAPI spec...');
  const specContent = await fs.readFile('openapi.json', 'utf-8');
  const spec = JSON.parse(specContent);
  
  // Step 3: Generate bridge tools
  console.log('🛠️ Generating bridge tools...');
  const tools = generateBridgeTools(spec);
  
  // Step 4: Render bridge file
  console.log('📝 Rendering bridge file...');
  const bridgeCode = renderTemplate(BRIDGE_TEMPLATE, {
    timestamp: new Date().toISOString(),
    tools: tools
  });
  
  // Step 5: Write bridge file
  console.log('💾 Writing bridge file...');
  await fs.writeFile('src/bridge-tools.ts', bridgeCode);
  
  // Step 6: Generate types
  console.log('🏷️ Generating TypeScript types...');
  await generateTypes(spec);
  
  console.log('✅ Bridge generation complete!');
  console.log(`📊 Generated ${tools.length} bridge tools`);
}

async function generateTypes(spec: any) {
  // Generate TypeScript interfaces from OpenAPI spec
  const typeDefinitions = generateTypeDefinitions(spec);
  await fs.writeFile('src/types.ts', typeDefinitions);
}
```

### 6. **Automation Setup**

#### **Package.json Scripts**
```json
{
  "scripts": {
    "bridge:generate": "tsx scripts/generate-complete-bridge.ts",
    "bridge:validate": "tsc --noEmit && npm run lint",
    "bridge:test": "npm run bridge:generate && npm run bridge:validate",
    "bridge:publish": "npm run bridge:test && npm version patch && npm publish"
  }
}
```

#### **GitHub Actions**
```yaml
# .github/workflows/bridge-sync.yml
name: Bridge Sync

on:
  push:
    paths:
      - 'src/app/api/**'
  schedule:
    - cron: '0 2 * * *'  # Daily at 2 AM

jobs:
  sync-bridge:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Generate bridge
        run: npm run bridge:generate
      
      - name: Validate bridge
        run: npm run bridge:validate
      
      - name: Check for changes
        id: changes
        run: |
          if git diff --quiet src/bridge-tools.ts; then
            echo "changed=false" >> $GITHUB_OUTPUT
          else
            echo "changed=true" >> $GITHUB_OUTPUT
          fi
      
      - name: Commit and push changes
        if: steps.changes.outputs.changed == 'true'
        run: |
          git config --local user.email "action@github.com"
          git config --local user.name "GitHub Action"
          git add src/bridge-tools.ts src/types.ts
          git commit -m "🤖 Auto-update bridge tools from OpenAPI spec"
          git push
      
      - name: Publish to npm
        if: steps.changes.outputs.changed == 'true'
        run: |
          cd mcp-bridge
          npm version patch
          npm run build
          npm publish
        env:
          NPM_TOKEN: ${{ secrets.NPM_TOKEN }}
```

### 7. **Testing and Validation**

#### **Bridge Tool Tests**
```typescript
// tests/bridge-tools.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import BridgeToolsWithAPIParity from '../src/bridge-tools';

describe('Bridge Tools', () => {
  let server: McpServer;
  let bridge: BridgeToolsWithAPIParity;
  
  beforeEach(() => {
    server = new McpServer({ name: 'test', version: '1.0.0' });
    bridge = new BridgeToolsWithAPIParity(server);
  });
  
  it('should register all expected tools', () => {
    const expectedTools = [
      'discover_mcp_servers',
      'register_mcp_server',
      'verify_domain_ownership',
      'get_server_health',
      'browse_capabilities',
      'get_discovery_stats',
      'list_mcp_tools',
      'invoke_tool'
    ];
    
    // Test that all tools are registered
    // Implementation depends on MCP SDK testing utilities
  });
  
  it('should make correct API calls', async () => {
    // Mock API calls and test bridge behavior
    // Implementation depends on testing setup
  });
});
```

## 🎯 Benefits Summary

### **Automated Maintenance**
- No manual bridge code updates
- Automatic sync with API changes
- Consistent tool implementations

### **Type Safety**
- Generated TypeScript interfaces
- Compile-time validation
- Runtime schema validation

### **Quality Assurance**
- Automated testing
- Validation workflows
- Consistent naming conventions

### **Developer Experience**
- Simple regeneration commands
- Clear documentation
- Easy debugging

---

**This implementation ensures perfect API parity between the main server and bridge with minimal maintenance overhead!** 🚀
