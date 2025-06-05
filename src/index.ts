// MCP Bridge - Universal MCP client with API parity to mcplookup.org
// Provides 8 MCP tools: 7 API tools + 1 invoke_tool for dynamic MCP server calls

import {
  MCPLookupBridge,
  MCPHttpBridge,
  EnhancedMCPBridge,
  MCPDiscoveryBridge
} from './bridge';

export {
  MCPLookupBridge,
  MCPHttpBridge,
  EnhancedMCPBridge,
  MCPDiscoveryBridge
};

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

// Version
export const VERSION = '1.0.0';
