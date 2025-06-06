// MCP Bridge - Universal MCP client with hybrid server management
// Provides 13+ MCP tools: 8 core tools + 5 management tools + dynamic tools

import {
  MCPLookupBridge,
  MCPHttpBridge,
  EnhancedMCPBridge,
  MCPDiscoveryBridge
} from './bridge.js';

// Export types
export * from './types.js';

// Export main bridge classes
export {
  MCPLookupBridge,
  MCPHttpBridge,
  EnhancedMCPBridge,
  MCPDiscoveryBridge
};

// Export component classes for advanced usage
export { CoreTools } from './tools/core-tools.js';
export { ServerManagementTools } from './tools/server-management-tools.js';
export { DynamicToolRegistry } from './tools/dynamic-tool-registry.js';
export { ToolInvoker } from './tools/tool-invoker.js';
export { ServerRegistry } from './server-management/server-registry.js';
export { ClaudeConfigManager } from './server-management/claude-config-manager.js';
export { DockerManager } from './server-management/docker-manager.js';

// Import classes for factory functions
import { ServerRegistry } from './server-management/server-registry.js';
import { ClaudeConfigManager } from './server-management/claude-config-manager.js';
import { DockerManager } from './server-management/docker-manager.js';
import { ToolInvoker } from './tools/tool-invoker.js';

// Simple utility functions
export function createBridge(apiKey?: string, baseUrl?: string) {
  return new MCPLookupBridge(apiKey, baseUrl);
}

// Legacy compatibility
export function createEnhancedBridge(apiKey?: string, baseUrl?: string) {
  return new MCPLookupBridge(apiKey, baseUrl);
}

export function createDiscoveryBridge(apiKey?: string, baseUrl?: string) {
  return new MCPLookupBridge(apiKey, baseUrl);
}

// Advanced factory functions
export function createServerRegistry() {
  return new ServerRegistry();
}

export function createClaudeConfigManager() {
  return new ClaudeConfigManager();
}

export function createDockerManager() {
  return new DockerManager();
}

export function createToolInvoker() {
  return new ToolInvoker();
}

// Version
export const VERSION = '1.0.0';
