// MCP Bridge - Universal MCP client with API parity
// Simple exports for programmatic use

export { default as BridgeToolsWithAPIParity } from './bridge-tools';
export { IntegratedBridge, setupIntegratedBridge } from './bridge-integration';
export {
  MCPHttpBridge,
  EnhancedMCPBridge,
  MCPDiscoveryBridge
} from './bridge';

// Simple utility functions
export function createBridge(httpEndpoint = '', authHeaders = {}) {
  return new MCPHttpBridge(httpEndpoint, authHeaders);
}

export function createEnhancedBridge(httpEndpoint = '', authHeaders = {}) {
  return new EnhancedMCPBridge(httpEndpoint, authHeaders);
}

export function createDiscoveryBridge(discoveryEndpoint?: string) {
  return new MCPDiscoveryBridge(discoveryEndpoint);
}

// Version
export const VERSION = '1.0.0';
