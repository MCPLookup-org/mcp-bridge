// MCP Bridge - Universal MCP client with API parity to mcplookup.org
// Provides 8 MCP tools:
// - 7 tools that use the generated OpenAPI client to call mcplookup.org API
// - 1 invoke_tool that can dynamically call any MCP server via SSE/HTTP or HTTP streaming

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';
import { SSEClientTransport } from '@modelcontextprotocol/sdk/client/sse.js';
import { z } from 'zod';
import { MCPLookupAPIClient } from './generated/api-client.js';

/**
 * MCP Bridge with API parity to mcplookup.org
 *
 * Provides 8 MCP tools:
 * 1. discover_mcp_servers - Search for MCP servers
 * 2. discover_smart - AI-powered discovery
 * 3. register_server - Register a new MCP server
 * 4. verify_domain - Start domain verification
 * 5. check_domain_ownership - Check domain ownership
 * 6. get_server_health - Get server health metrics
 * 7. get_onboarding_state - Get user onboarding progress
 * 8. invoke_tool - Call any MCP server dynamically
 */
export class MCPLookupBridge {
  private server: McpServer;
  private apiClient: MCPLookupAPIClient;

  constructor(apiKey?: string, baseUrl?: string) {
    this.server = new McpServer({
      name: 'mcplookup-bridge',
      version: '1.0.0',
    });

    // Initialize API client with optional authentication
    this.apiClient = new MCPLookupAPIClient(
      baseUrl || 'https://mcplookup.org/api/v1',
      apiKey || process.env.MCPLOOKUP_API_KEY
    );

    this.setupTools();
  }

  /**
   * Set up all 8 MCP tools
   */
  private setupTools(): void {
    // Tool 1: Discover MCP servers
    this.server.tool(
      'discover_mcp_servers',
      {
        query: z.string().optional().describe('Natural language query: "Find email servers like Gmail", "I need document tools"'),
        intent: z.string().optional().describe('Specific intent or use case (e.g., data_processing)'),
        domain: z.string().optional().describe('Specific domain to search for (e.g., gmail.com)'),
        capability: z.string().optional().describe('Specific capability to search for (e.g., email)'),
        category: z.enum(['communication', 'productivity', 'development', 'finance', 'social', 'storage', 'other']).optional().describe('Server category filter'),
        transport: z.enum(['streamable_http', 'sse', 'stdio']).optional().describe('Required transport protocol'),
        verified_only: z.boolean().optional().describe('Only return verified servers (default: false)'),
        limit: z.number().optional().describe('Maximum number of servers to return (default: 10)'),
        offset: z.number().optional().describe('Number of results to skip (default: 0)')
      },
      async ({ query, intent, domain, capability, category, transport, verified_only, limit = 10, offset = 0 }) => {
        try {
          // Build the request body according to the API schema
          const requestBody: any = {};

          if (query) requestBody.query = query;
          if (intent) requestBody.intent = intent;
          if (limit) requestBody.limit = limit;

          // Handle technical requirements
          if (transport) {
            requestBody.technical = { transport };
          }

          // Note: The current API doesn't support domain/capability filters in the discover endpoint
          // These would need to be handled by filtering the results or using query strings
          if (domain) {
            requestBody.query = requestBody.query ? `${requestBody.query} domain:${domain}` : `domain:${domain}`;
          }
          if (capability) {
            requestBody.query = requestBody.query ? `${requestBody.query} capability:${capability}` : `capability:${capability}`;
          }
          if (category) {
            requestBody.query = requestBody.query ? `${requestBody.query} category:${category}` : `category:${category}`;
          }

          const result = await this.apiClient.discover(requestBody);

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
              text: `Error discovering servers: ${error instanceof Error ? error.message : 'Unknown error'}`
            }],
            isError: true
          };
        }
      }
    );

    // Tool 2: Smart AI-powered discovery
    this.server.tool(
      'discover_smart',
      {
        query: z.string().describe('Natural language query for AI-powered discovery'),
        max_results: z.number().optional().describe('Maximum number of results (default: 10)'),
        include_reasoning: z.boolean().optional().describe('Include AI reasoning in response (default: false)')
      },
      async ({ query, max_results = 10, include_reasoning = false }) => {
        try {
          const result = await this.apiClient.discoverSmart({
            query,
            max_results,
            include_reasoning
          });

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
              text: `Error in smart discovery: ${error instanceof Error ? error.message : 'Unknown error'}`
            }],
            isError: true
          };
        }
      }
    );

    // Tool 3: Register a new MCP server
    this.server.tool(
      'register_server',
      {
        domain: z.string().describe('Domain of the MCP server'),
        endpoint: z.string().describe('MCP server endpoint URL'),
        contact_email: z.string().describe('Contact email for verification'),
        description: z.string().optional().describe('Description of the server')
      },
      async ({ domain, endpoint, contact_email, description }) => {
        try {
          const result = await this.apiClient.register({
            domain,
            endpoint,
            contact_email,
            description
          });

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
              text: `Error registering server: ${error instanceof Error ? error.message : 'Unknown error'}`
            }],
            isError: true
          };
        }
      }
    );

    // Tool 4: Start domain verification
    this.server.tool(
      'verify_domain',
      {
        domain: z.string().describe('Domain to verify ownership of')
      },
      async ({ domain }) => {
        try {
          const result = await this.apiClient.startDomainVerification(domain);

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
              text: `Error starting domain verification: ${error instanceof Error ? error.message : 'Unknown error'}`
            }],
            isError: true
          };
        }
      }
    );

    // Tool 5: Check domain ownership
    this.server.tool(
      'check_domain_ownership',
      {
        domain: z.string().describe('Domain to check ownership of')
      },
      async ({ domain }) => {
        try {
          const result = await this.apiClient.checkDomainOwnership(domain);

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
              text: `Error checking domain ownership: ${error instanceof Error ? error.message : 'Unknown error'}`
            }],
            isError: true
          };
        }
      }
    );

    // Tool 6: Get server health metrics
    this.server.tool(
      'get_server_health',
      {
        domain: z.string().describe('Domain of the server to check'),
        realtime: z.boolean().optional().describe('Perform real-time health check (default: false)')
      },
      async ({ domain, realtime = false }) => {
        try {
          const result = await this.apiClient.getServerHealth(domain, realtime);

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
              text: `Error getting server health: ${error instanceof Error ? error.message : 'Unknown error'}`
            }],
            isError: true
          };
        }
      }
    );

    // Tool 7: Get user onboarding state
    this.server.tool(
      'get_onboarding_state',
      {},
      async () => {
        try {
          const result = await this.apiClient.getOnboardingState();

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
              text: `Error getting onboarding state: ${error instanceof Error ? error.message : 'Unknown error'}`
            }],
            isError: true
          };
        }
      }
    );

    // Tool 8: Invoke tool on any MCP server (dynamic client)
    this.server.tool(
      'invoke_tool',
      {
        endpoint: z.string().describe('MCP server endpoint URL'),
        tool_name: z.string().describe('Name of the tool to call'),
        arguments: z.record(z.any()).optional().describe('Arguments to pass to the tool'),
        auth_headers: z.record(z.string()).optional().describe('Optional authentication headers')
      },
      async ({ endpoint, tool_name, arguments: args = {}, auth_headers = {} }) => {
        try {
          // Create a temporary client for this specific server
          const client = new Client({
            name: 'mcplookup-bridge-client',
            version: '1.0.0'
          });

          let transport;
          try {
            // Try Streamable HTTP first (modern)
            transport = new StreamableHTTPClientTransport(new URL(endpoint));
            await client.connect(transport);
          } catch (error) {
            // Fallback to SSE (legacy)
            transport = new SSEClientTransport(new URL(endpoint));
            await client.connect(transport);
          }

          // Call the tool
          const result = await client.callTool({
            name: tool_name,
            arguments: args
          });

          await client.close();

          return {
            content: Array.isArray(result.content) && result.content.length > 0
              ? result.content
              : [{ type: 'text', text: JSON.stringify(result) }]
          };
        } catch (error) {
          return {
            content: [{
              type: 'text',
              text: `Error calling tool '${tool_name}' on ${endpoint}: ${error instanceof Error ? error.message : 'Unknown error'}`
            }],
            isError: true
          };
        }
      }
    );
  }

  /**
   * Start the bridge server on stdio
   */
  async run(): Promise<void> {
    try {
      console.log('🌉 Starting MCPLookup Bridge v1.0.0');
      console.log('🔧 Available tools: 8 (7 API tools + 1 invoke_tool)');
      console.log('📡 API endpoint: https://mcplookup.org/api/v1');
      console.log('🔌 Listening on stdio...');

      const transport = new StdioServerTransport();
      await this.server.connect(transport);

      console.log('✅ MCPLookup Bridge started successfully');
      console.log('🎯 Tools available:');
      console.log('  • discover_mcp_servers - Search for MCP servers');
      console.log('  • discover_smart - AI-powered discovery');
      console.log('  • register_server - Register a new MCP server');
      console.log('  • verify_domain - Start domain verification');
      console.log('  • check_domain_ownership - Check domain ownership');
      console.log('  • get_server_health - Get server health metrics');
      console.log('  • get_onboarding_state - Get user onboarding progress');
      console.log('  • invoke_tool - Call any MCP server dynamically');

    } catch (error) {
      console.error('❌ Failed to start bridge server:', error);
      throw error;
    }
  }

  /**
   * Close the bridge connection
   */
  async close(): Promise<void> {
    console.log('🔌 Bridge connection closed');
  }
}

// Legacy exports for backwards compatibility
export const MCPHttpBridge = MCPLookupBridge;
export const EnhancedMCPBridge = MCPLookupBridge;
export const MCPDiscoveryBridge = MCPLookupBridge;
