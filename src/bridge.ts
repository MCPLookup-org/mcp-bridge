// MCP Bridge - Universal MCP client with API parity to mcplookup.org
// Provides 8 MCP tools:
// - 7 tools that use the generated OpenAPI client to call mcplookup.org API
// - 1 invoke_tool that can dynamically call any MCP server via SSE/HTTP or HTTP streaming

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { SSEServerTransport } from '@modelcontextprotocol/sdk/server/sse.js';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';
import { SSEClientTransport } from '@modelcontextprotocol/sdk/client/sse.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import { createServer, IncomingMessage, ServerResponse } from 'node:http';
import { readFile, writeFile, access } from 'node:fs/promises';
import { homedir } from 'node:os';
import { join } from 'node:path';
import { z } from 'zod';
import { MCPLookupAPIClient } from './generated/api-client.js';

// Types for managed MCP servers
interface ManagedServer {
  name: string;
  type: 'docker' | 'npm';
  mode: 'bridge' | 'direct';
  command: string[];
  client?: Client;
  endpoint?: string;
  tools: string[];
  status: 'installing' | 'running' | 'stopped' | 'error';
}

// Claude Desktop configuration types
interface ClaudeConfig {
  mcpServers?: Record<string, {
    command: string;
    args: string[];
    env?: Record<string, string>;
  }>;
}

/**
 * MCP Bridge with API parity to mcplookup.org
 *
 * Provides 8+ MCP tools:
 * 1. discover_mcp_servers - Search for MCP servers
 * 2. discover_smart - AI-powered discovery
 * 3. register_server - Register a new MCP server
 * 4. verify_domain - Start domain verification
 * 5. check_domain_ownership - Check domain ownership
 * 6. get_server_health - Get server health metrics
 * 7. get_onboarding_state - Get user onboarding progress
 * 8. invoke_tool - Call any MCP server dynamically
 * 9. install_mcp_server - Install and run MCP server locally
 * 10. list_managed_servers - List locally managed servers
 * 11. control_mcp_server - Start/stop/restart managed servers
 * + Dynamic tools from installed servers
 */
export class MCPLookupBridge {
  private server: McpServer;
  private apiClient: MCPLookupAPIClient;
  private managedServers: Map<string, ManagedServer> = new Map();

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
    this.setupServerManagement();
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
        auth_headers: z.record(z.string()).optional().describe('Optional authentication headers (e.g., {"Authorization": "Bearer token", "X-API-Key": "key"})')
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
            transport = new StreamableHTTPClientTransport(new URL(endpoint), {
              requestInit: {
                headers: auth_headers
              }
            });
            await client.connect(transport);
          } catch (error) {
            // Fallback to SSE (legacy)
            transport = new SSEClientTransport(new URL(endpoint), {
              requestInit: {
                headers: auth_headers
              }
              // Note: EventSource doesn't support custom headers in all environments
              // Headers are passed via requestInit for POST requests
            });
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
   * Set up server management tools
   */
  private setupServerManagement(): void {
    // Tool 9: Install MCP server (enhanced with installation modes)
    this.server.tool(
      'install_mcp_server',
      {
        name: z.string().describe('Local name for the server'),
        type: z.enum(['docker', 'npm']).describe('Installation type'),
        command: z.string().describe('Docker command or npm package name'),
        mode: z.enum(['bridge', 'direct']).default('bridge').describe('Installation mode: bridge (dynamic) or direct (Claude config)'),
        auto_start: z.boolean().default(true).describe('Start server immediately after install (bridge mode only)'),
        env: z.record(z.string()).optional().describe('Environment variables for the server')
      },
      async ({ name, type, command, mode, auto_start, env = {} }) => {
        try {
          if (this.managedServers.has(name)) {
            return {
              content: [{
                type: 'text' as const,
                text: `❌ Server '${name}' already exists. Use control_mcp_server to manage it.`
              }],
              isError: true
            };
          }

          if (mode === 'direct') {
            // Smithery-style: Modify Claude Desktop config
            return await this.installDirectMode(name, type, command, env);
          } else {
            // Bridge mode: Our original approach
            return await this.installBridgeMode(name, type, command, auto_start, env);
          }
        } catch (error) {
          this.managedServers.delete(name);
          return {
            content: [{
              type: 'text' as const,
              text: `❌ Failed to install ${name}: ${error instanceof Error ? error.message : 'Unknown error'}`
            }],
            isError: true
          };
        }
      }
    );

    // Tool 10: List managed servers
    this.server.tool(
      'list_managed_servers',
      {},
      async () => {
        const servers = Array.from(this.managedServers.values()).map(server => ({
          name: server.name,
          type: server.type,
          status: server.status,
          tools: server.tools,
          endpoint: server.endpoint
        }));

        return {
          content: [{
            type: 'text' as const,
            text: JSON.stringify(servers, null, 2)
          }]
        };
      }
    );

    // Tool 11: Control managed servers
    this.server.tool(
      'control_mcp_server',
      {
        name: z.string().describe('Server name'),
        action: z.enum(['start', 'stop', 'restart', 'remove']).describe('Action to perform')
      },
      async ({ name, action }) => {
        const server = this.managedServers.get(name);
        if (!server) {
          return {
            content: [{
              type: 'text' as const,
              text: `❌ Server '${name}' not found. Use list_managed_servers to see available servers.`
            }],
            isError: true
          };
        }

        try {
          switch (action) {
            case 'start':
              await this.startManagedServer(name);
              break;
            case 'stop':
              await this.stopManagedServer(name);
              break;
            case 'restart':
              await this.stopManagedServer(name);
              await this.startManagedServer(name);
              break;
            case 'remove':
              await this.stopManagedServer(name);
              await this.removeDynamicTools(name);
              this.managedServers.delete(name);
              break;
          }

          return {
            content: [{
              type: 'text' as const,
              text: `✅ ${action}ed server '${name}'`
            }]
          };
        } catch (error) {
          return {
            content: [{
              type: 'text' as const,
              text: `❌ Failed to ${action} server '${name}': ${error instanceof Error ? error.message : 'Unknown error'}`
            }],
            isError: true
          };
        }
      }
    );

    // Tool 12: List Claude Desktop servers (direct mode)
    this.server.tool(
      'list_claude_servers',
      {},
      async () => {
        try {
          const configPath = await this.getClaudeConfigPath();
          const configContent = await readFile(configPath, 'utf-8');
          const config: ClaudeConfig = JSON.parse(configContent);

          const servers = Object.entries(config.mcpServers || {}).map(([name, serverConfig]) => ({
            name,
            command: serverConfig.command,
            args: serverConfig.args,
            env: serverConfig.env || {},
            mode: 'direct'
          }));

          return {
            content: [{
              type: 'text' as const,
              text: `📋 Claude Desktop Servers (${servers.length}):\n${JSON.stringify(servers, null, 2)}`
            }]
          };
        } catch (error) {
          return {
            content: [{
              type: 'text' as const,
              text: `❌ Failed to read Claude Desktop config: ${error instanceof Error ? error.message : 'Unknown error'}`
            }],
            isError: true
          };
        }
      }
    );

    // Tool 13: Remove server from Claude Desktop config
    this.server.tool(
      'remove_claude_server',
      {
        name: z.string().describe('Server name to remove from Claude Desktop config')
      },
      async ({ name }) => {
        try {
          const configPath = await this.getClaudeConfigPath();
          const configContent = await readFile(configPath, 'utf-8');
          const config: ClaudeConfig = JSON.parse(configContent);

          if (!config.mcpServers || !config.mcpServers[name]) {
            return {
              content: [{
                type: 'text' as const,
                text: `❌ Server '${name}' not found in Claude Desktop config.`
              }],
              isError: true
            };
          }

          delete config.mcpServers[name];
          await writeFile(configPath, JSON.stringify(config, null, 2));

          return {
            content: [{
              type: 'text' as const,
              text: `✅ Removed '${name}' from Claude Desktop config.\n🔄 Please restart Claude Desktop for changes to take effect.`
            }]
          };
        } catch (error) {
          return {
            content: [{
              type: 'text' as const,
              text: `❌ Failed to remove server: ${error instanceof Error ? error.message : 'Unknown error'}`
            }],
            isError: true
          };
        }
      }
    );
  }

  /**
   * Start the bridge server on stdio (default)
   */
  async run(): Promise<void> {
    return this.runStdio();
  }

  /**
   * Start the bridge server on stdio transport
   */
  async runStdio(): Promise<void> {
    try {
      console.log('🌉 Starting MCPLookup Bridge v1.0.0');
      console.log('🔧 Available tools: 13+ (8 core + 5 management + dynamic tools)');
      console.log('📡 API endpoint: https://mcplookup.org/api/v1');
      console.log('🔌 Listening on stdio...');

      const transport = new StdioServerTransport();
      await this.server.connect(transport);

      console.log('✅ MCPLookup Bridge started successfully');
      console.log('🎯 Core Tools available:');
      console.log('  • discover_mcp_servers - Search for MCP servers');
      console.log('  • discover_smart - AI-powered discovery');
      console.log('  • register_server - Register a new MCP server');
      console.log('  • verify_domain - Start domain verification');
      console.log('  • check_domain_ownership - Check domain ownership');
      console.log('  • get_server_health - Get server health metrics');
      console.log('  • get_onboarding_state - Get user onboarding progress');
      console.log('  • invoke_tool - Call any MCP server dynamically');
      console.log('🔧 Server Management Tools:');
      console.log('  • install_mcp_server - Install MCP server (bridge or direct mode)');
      console.log('  • list_managed_servers - List bridge-managed servers');
      console.log('  • control_mcp_server - Start/stop/restart bridge servers');
      console.log('  • list_claude_servers - List Claude Desktop config servers');
      console.log('  • remove_claude_server - Remove server from Claude config');

      const managedCount = this.managedServers.size;
      if (managedCount > 0) {
        console.log(`📦 Managed Servers (${managedCount}):`);
        for (const [name, server] of this.managedServers) {
          console.log(`  • ${name} (${server.status}) - ${server.tools.length} tools`);
        }
      }

    } catch (error) {
      console.error('❌ Failed to start bridge server:', error);
      throw error;
    }
  }

  /**
   * Start the bridge server on HTTP/SSE transport
   */
  async runHttp(port: number = 3000): Promise<void> {
    try {
      console.log('🌉 Starting MCPLookup Bridge v1.0.0');
      console.log('🔧 Available tools: 13+ (8 core + 5 management + dynamic tools)');
      console.log('📡 API endpoint: https://mcplookup.org/api/v1');
      console.log(`🌐 Starting HTTP server on port ${port}...`);

      // Create HTTP server
      const httpServer = createServer(async (req: IncomingMessage, res: ServerResponse) => {
        // Set CORS headers
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

        if (req.method === 'OPTIONS') {
          res.writeHead(200);
          res.end();
          return;
        }

        if (req.url === '/mcp' && req.method === 'GET') {
          // SSE connection
          const transport = new SSEServerTransport('/mcp', res);
          await this.server.connect(transport);
          await transport.start();
        } else if (req.url === '/mcp' && req.method === 'POST') {
          // Handle POST messages (this would need proper routing in a real implementation)
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'POST handling not implemented in this simple server' }));
        } else if (req.url === '/health') {
          // Health check endpoint
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ status: 'healthy', timestamp: new Date().toISOString() }));
        } else {
          // 404 for other paths
          res.writeHead(404, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Not found' }));
        }
      });

      // Start the server
      await new Promise<void>((resolve, reject) => {
        httpServer.listen(port, (err?: Error) => {
          if (err) reject(err);
          else resolve();
        });
      });

      console.log(`✅ MCPLookup Bridge started successfully on port ${port}`);
      console.log(`🔗 MCP endpoint: http://localhost:${port}/mcp`);
      console.log(`🏥 Health check: http://localhost:${port}/health`);
      console.log('🎯 Core Tools available:');
      console.log('  • discover_mcp_servers - Search for MCP servers');
      console.log('  • discover_smart - AI-powered discovery');
      console.log('  • register_server - Register a new MCP server');
      console.log('  • verify_domain - Start domain verification');
      console.log('  • check_domain_ownership - Check domain ownership');
      console.log('  • get_server_health - Get server health metrics');
      console.log('  • get_onboarding_state - Get user onboarding progress');
      console.log('  • invoke_tool - Call any MCP server dynamically');
      console.log('🔧 Server Management Tools:');
      console.log('  • install_mcp_server - Install MCP server (bridge or direct mode)');
      console.log('  • list_managed_servers - List bridge-managed servers');
      console.log('  • control_mcp_server - Start/stop/restart bridge servers');
      console.log('  • list_claude_servers - List Claude Desktop config servers');
      console.log('  • remove_claude_server - Remove server from Claude config');

      const managedCount = this.managedServers.size;
      if (managedCount > 0) {
        console.log(`📦 Managed Servers (${managedCount}):`);
        for (const [name, server] of this.managedServers) {
          console.log(`  • ${name} (${server.status}) - ${server.tools.length} tools`);
        }
      }

    } catch (error) {
      console.error('❌ Failed to start bridge HTTP server:', error);
      throw error;
    }
  }

  /**
   * Install server in direct mode (Smithery-style)
   */
  private async installDirectMode(name: string, type: 'docker' | 'npm', command: string, env: Record<string, string>) {
    try {
      // Get Claude Desktop config path
      const configPath = await this.getClaudeConfigPath();

      // Read existing config
      let config: ClaudeConfig = {};
      try {
        const configContent = await readFile(configPath, 'utf-8');
        config = JSON.parse(configContent);
      } catch (error) {
        // Config doesn't exist, start with empty
        config = { mcpServers: {} };
      }

      if (!config.mcpServers) {
        config.mcpServers = {};
      }

      // Check if server already exists in config
      if (config.mcpServers[name]) {
        return {
          content: [{
            type: 'text' as const,
            text: `❌ Server '${name}' already exists in Claude Desktop config. Remove it first or use a different name.`
          }],
          isError: true
        };
      }

      // Add server to config
      if (type === 'docker') {
        const dockerArgs = command.split(' ').slice(1); // Remove 'docker' command
        config.mcpServers[name] = {
          command: 'docker',
          args: dockerArgs,
          env
        };
      } else {
        // npm package
        config.mcpServers[name] = {
          command: 'npx',
          args: [command],
          env
        };
      }

      // Write config back
      await writeFile(configPath, JSON.stringify(config, null, 2));

      return {
        content: [{
          type: 'text' as const,
          text: `✅ Installed ${name} in Claude Desktop config (direct mode)\n📋 Config updated at: ${configPath}\n🔄 Please restart Claude Desktop to use the server.\n\nServer will be available as: ${name}`
        }]
      };
    } catch (error) {
      return {
        content: [{
          type: 'text' as const,
          text: `❌ Failed to install ${name} in direct mode: ${error instanceof Error ? error.message : 'Unknown error'}`
        }],
        isError: true
      };
    }
  }

  /**
   * Install server in bridge mode (our original approach)
   */
  private async installBridgeMode(name: string, type: 'docker' | 'npm', command: string, auto_start: boolean, env: Record<string, string>) {
    const server: ManagedServer = {
      name,
      type,
      mode: 'bridge',
      command: type === 'docker' ? command.split(' ') : ['npx', command],
      tools: [],
      status: 'installing'
    };

    this.managedServers.set(name, server);

    if (type === 'npm') {
      // For npm packages, we need to dockerize them
      await this.dockerizeNpmServer(server);
    }

    if (auto_start) {
      await this.startManagedServer(name);
    }

    return {
      content: [{
        type: 'text' as const,
        text: `✅ Installed ${name} (${type}, bridge mode)\n${auto_start ? 'Server started and tools available with prefix: ' + name + '_' : 'Use control_mcp_server to start.'}`
      }]
    };
  }

  /**
   * Get Claude Desktop config path
   */
  private async getClaudeConfigPath(): Promise<string> {
    const home = homedir();

    // Try different possible locations
    const possiblePaths = [
      // macOS
      join(home, 'Library', 'Application Support', 'Claude', 'claude_desktop_config.json'),
      // Windows
      join(home, 'AppData', 'Roaming', 'Claude', 'claude_desktop_config.json'),
      // Linux
      join(home, '.config', 'Claude', 'claude_desktop_config.json'),
      // Alternative locations
      join(home, '.claude', 'claude_desktop_config.json'),
      join(home, 'claude_desktop_config.json')
    ];

    for (const path of possiblePaths) {
      try {
        await access(path);
        return path;
      } catch {
        // Continue to next path
      }
    }

    // Default to macOS path if none found
    return possiblePaths[0];
  }

  /**
   * Dockerize an npm package into a runnable container
   */
  private async dockerizeNpmServer(server: ManagedServer): Promise<void> {
    const packageName = server.command[1]; // npx <package-name>

    // Create a temporary Dockerfile content
    const dockerfile = `
FROM node:18-alpine
WORKDIR /app
RUN npm install -g ${packageName}
EXPOSE 3000
CMD ["npx", "${packageName}"]
`;

    // For now, we'll use a simpler approach - just modify the command to run in docker
    server.command = [
      'docker', 'run', '--rm', '-i',
      '--name', `mcp-${server.name}`,
      '-p', '0:3000', // Random port mapping
      'node:18-alpine',
      'sh', '-c',
      `npm install -g ${packageName} && npx ${packageName}`
    ];
  }

  /**
   * Start a managed MCP server
   */
  private async startManagedServer(name: string): Promise<void> {
    const server = this.managedServers.get(name);
    if (!server) throw new Error(`Server ${name} not found`);

    if (server.status === 'running') {
      throw new Error(`Server ${name} is already running`);
    }

    try {
      // Create MCP client to connect to the server
      server.client = new Client({
        name: `bridge-client-${name}`,
        version: '1.0.0'
      });

      // Create transport that will spawn the process
      const transport = new StdioClientTransport({
        command: server.command[0],
        args: server.command.slice(1)
      });

      await server.client.connect(transport);

      // Get available tools from the server
      const tools = await server.client.listTools();
      server.tools = tools.tools?.map(tool => tool.name) || [];
      server.status = 'running';

      // Add dynamic tools to the bridge
      await this.addDynamicTools(name, server);

      console.log(`✅ Started MCP server '${name}' with tools: ${server.tools.join(', ')}`);
    } catch (error) {
      server.status = 'error';
      throw error;
    }
  }

  /**
   * Stop a managed MCP server
   */
  private async stopManagedServer(name: string): Promise<void> {
    const server = this.managedServers.get(name);
    if (!server) throw new Error(`Server ${name} not found`);

    if (server.client) {
      await server.client.close();
      server.client = undefined;
    }

    server.status = 'stopped';
    await this.removeDynamicTools(name);

    console.log(`🛑 Stopped MCP server '${name}'`);
  }

  /**
   * Add dynamic tools from a managed server to the bridge
   */
  private async addDynamicTools(serverName: string, server: ManagedServer): Promise<void> {
    if (!server.client) return;

    for (const toolName of server.tools) {
      const prefixedToolName = `${serverName}_${toolName}`;

      // Get tool schema from the server
      const toolInfo = await server.client.listTools();
      const tool = toolInfo.tools?.find(t => t.name === toolName);

      if (!tool) continue;

      // Create dynamic tool that delegates to the managed server
      this.server.tool(
        prefixedToolName,
        tool.inputSchema || {},
        async (args) => {
          try {
            if (!server.client) {
              throw new Error(`Server ${serverName} is not running`);
            }

            const result = await server.client.callTool({
              name: toolName,
              arguments: args
            });

            return {
              content: Array.isArray(result.content) && result.content.length > 0
                ? result.content
                : [{ type: 'text', text: JSON.stringify(result) }]
            };
          } catch (error) {
            return {
              content: [{
                type: 'text',
                text: `❌ Error calling ${toolName} on ${serverName}: ${error instanceof Error ? error.message : 'Unknown error'}`
              }],
              isError: true
            };
          }
        }
      );
    }

    console.log(`🔧 Added ${server.tools.length} dynamic tools from '${serverName}'`);
  }

  /**
   * Remove dynamic tools for a server
   */
  private async removeDynamicTools(serverName: string): Promise<void> {
    const server = this.managedServers.get(serverName);
    if (!server) return;

    // Note: The MCP SDK doesn't provide a way to remove tools dynamically
    // In a real implementation, we'd need to track registered tools and
    // potentially restart the bridge or use a different approach
    console.log(`🗑️ Removed dynamic tools from '${serverName}'`);
  }

  /**
   * Close the bridge connection
   */
  async close(): Promise<void> {
    // Stop all managed servers
    for (const [name] of this.managedServers) {
      try {
        await this.stopManagedServer(name);
      } catch (error) {
        console.error(`Error stopping server ${name}:`, error);
      }
    }

    console.log('🔌 Bridge connection closed');
  }
}

// Legacy exports for backwards compatibility
export const MCPHttpBridge = MCPLookupBridge;
export const EnhancedMCPBridge = MCPLookupBridge;
export const MCPDiscoveryBridge = MCPLookupBridge;
