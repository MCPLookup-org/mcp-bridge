// Install command - Enhanced Smithery parity with mcplookup.org integration

import { BaseCommand } from './base-command.js';

export interface InstallOptions {
  client: string;
  mode: 'direct' | 'bridge';
  config?: string;
  env?: string;
  autoStart: boolean;
  force: boolean;
  dryRun: boolean;
  verbose?: boolean;
}

export interface ResolvedPackage {
  packageName: string;
  displayName: string;
  description?: string;
  type: 'npm' | 'docker';
  source: 'direct' | 'smart_search' | 'registry_search';
  verified?: boolean;
}

export class InstallCommand extends BaseCommand {
  async execute(packageName: string, options: InstallOptions): Promise<void> {
    this.setVerbose(options.verbose || false);

    try {
      this.info(`Installing MCP server: ${packageName}`);
      this.debug(`Options: ${JSON.stringify(options, null, 2)}`);

      // Parse configuration
      const config = options.config ? this.parseJSON(options.config) : {};
      const env = options.env ? this.parseJSON(options.env) : {};

      // Resolve the actual package to install
      const resolvedPackage = await this.resolvePackage(packageName);
      this.debug(`Resolved package: ${JSON.stringify(resolvedPackage, null, 2)}`);

      // Dry run mode
      if (options.dryRun) {
        await this.performDryRun(resolvedPackage, options, config, env);
        return;
      }

      // Install based on mode
      if (options.mode === 'bridge') {
        await this.installBridgeMode(resolvedPackage, config, env, options);
      } else {
        await this.installDirectMode(resolvedPackage, config, env, options);
      }

      this.success(`Successfully installed ${resolvedPackage.displayName || resolvedPackage.packageName}`);

      // Post-installation instructions
      this.showPostInstallInstructions(options.mode, options.client);

    } catch (error) {
      this.handleError(error, 'Installation failed');
    }
  }

  /**
   * Resolve package name to actual installable package
   * Handles: NPM packages, Docker images, natural language queries
   */
  private async resolvePackage(input: string): Promise<ResolvedPackage> {
    // 1. Direct NPM package (e.g., @npmorg/package, package-name)
    if (this.isNpmPackage(input)) {
      return {
        packageName: input,
        displayName: input,
        type: 'npm',
        source: 'direct'
      };
    }

    // 2. Docker image (e.g., company/server:latest)
    if (this.isDockerImage(input)) {
      return {
        packageName: input,
        displayName: input,
        type: 'docker',
        source: 'direct'
      };
    }

    // 3. Natural language or server name - search mcplookup.org
    this.info(`🔍 Searching for: "${input}"`);
    return await this.searchForPackage(input);
  }

  private isNpmPackage(input: string): boolean {
    // NPM package patterns: @scope/name, package-name, etc.
    return /^(@[a-z0-9-~][a-z0-9-._~]*\/)?[a-z0-9-~][a-z0-9-._~]*$/.test(input) &&
           !input.includes(':') &&
           !input.includes(' ');
  }

  private isDockerImage(input: string): boolean {
    // Docker image patterns: name:tag, registry/name:tag, etc.
    return input.includes(':') && !input.includes(' ') && !input.startsWith('@');
  }

  private async searchForPackage(query: string): Promise<ResolvedPackage> {
    try {
      // First try smart discovery for better matching
      const smartResult = await this.bridge.components.coreTools['smartDiscovery']({
        query,
        limit: 5
      });

      const smartResponse = JSON.parse(smartResult.content[0].text);

      if (smartResponse.servers && smartResponse.servers.length > 0) {
        const server = smartResponse.servers[0]; // Take the best match

        // Prefer NPM package if available
        if (server.npm_package) {
          return {
            packageName: server.npm_package,
            displayName: server.name,
            description: server.description,
            type: 'npm',
            source: 'smart_search',
            verified: server.verified
          };
        }

        // Fall back to Docker if available
        if (server.docker_image) {
          return {
            packageName: server.docker_image,
            displayName: server.name,
            description: server.description,
            type: 'docker',
            source: 'smart_search',
            verified: server.verified
          };
        }
      }

      // Fall back to regular discovery
      const regularResult = await this.bridge.components.coreTools['discoverServers']({
        query,
        limit: 5
      });

      const regularResponse = JSON.parse(regularResult.content[0].text);

      if (regularResponse.servers && regularResponse.servers.length > 0) {
        const server = regularResponse.servers[0];

        if (server.npm_package) {
          return {
            packageName: server.npm_package,
            displayName: server.name,
            description: server.description,
            type: 'npm',
            source: 'registry_search',
            verified: server.verified
          };
        }

        if (server.docker_image) {
          return {
            packageName: server.docker_image,
            displayName: server.name,
            description: server.description,
            type: 'docker',
            source: 'registry_search',
            verified: server.verified
          };
        }
      }

      throw new Error(`No installable package found for: "${query}"`);

    } catch (error) {
      throw new Error(`Search failed for "${query}": ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  private async performDryRun(
    resolvedPackage: ResolvedPackage,
    options: InstallOptions,
    config: any,
    env: any
  ): Promise<void> {
    this.info('🔍 Dry run mode - showing what would be installed:');

    console.log(`
📦 Package: ${resolvedPackage.packageName}
🏷️  Display Name: ${resolvedPackage.displayName}
📝 Description: ${resolvedPackage.description || 'N/A'}
🎯 Client: ${options.client}
🔧 Mode: ${options.mode}
📋 Type: ${resolvedPackage.type}
🔍 Source: ${resolvedPackage.source}
${resolvedPackage.verified ? '✅ Verified' : '⚠️  Unverified'}
⚙️ Config: ${Object.keys(config).length} keys
🌍 Environment: ${Object.keys(env).length} variables
🚀 Auto-start: ${options.autoStart}
    `);

    if (options.mode === 'direct') {
      this.warn('Direct mode installation would require Claude Desktop restart');
    }

    this.info('Use --force to proceed with actual installation');
  }



  private async installBridgeMode(
    resolvedPackage: ResolvedPackage,
    config: any,
    env: any,
    options: InstallOptions
  ): Promise<void> {
    this.info('Installing in bridge mode (dynamic, no restart required)');

    // Show what we're installing
    if (resolvedPackage.source !== 'direct') {
      this.info(`📦 Installing: ${resolvedPackage.displayName}`);
      if (resolvedPackage.description) {
        this.info(`📝 ${resolvedPackage.description}`);
      }
      if (resolvedPackage.verified) {
        this.info('✅ This is a verified server');
      }
    }

    await this.withSpinner('Installing server...', async () => {
      const result = await this.bridge.components.serverManagementTools['installServer']({
        name: this.generateServerName(resolvedPackage.packageName),
        type: resolvedPackage.type,
        command: resolvedPackage.packageName,
        mode: 'bridge',
        auto_start: options.autoStart,
        env: { ...env, ...config }
      });

      if (result.isError) {
        throw new Error(result.content[0].text);
      }
    });

    this.success('Server installed and ready to use immediately!');

    if (options.autoStart) {
      this.info('Server is running and tools are available with prefix');
    }
  }

  private async installDirectMode(
    resolvedPackage: ResolvedPackage,
    config: any,
    env: any,
    options: InstallOptions
  ): Promise<void> {
    this.info('Installing in direct mode (permanent, requires restart)');

    // Show what we're installing
    if (resolvedPackage.source !== 'direct') {
      this.info(`📦 Installing: ${resolvedPackage.displayName}`);
      if (resolvedPackage.description) {
        this.info(`📝 ${resolvedPackage.description}`);
      }
      if (resolvedPackage.verified) {
        this.info('✅ This is a verified server');
      }
    }

    await this.withSpinner('Adding to Claude Desktop configuration...', async () => {
      const result = await this.bridge.components.serverManagementTools['installServer']({
        name: this.generateServerName(resolvedPackage.packageName),
        type: resolvedPackage.type,
        command: resolvedPackage.packageName,
        mode: 'direct',
        env: { ...env, ...config }
      });

      if (result.isError) {
        throw new Error(result.content[0].text);
      }
    });

    this.success('Server added to Claude Desktop configuration');
  }

  private generateServerName(packageName: string): string {
    // Generate a clean server name from package name
    return packageName
      .replace(/[@\/]/g, '-')
      .replace(/[^a-zA-Z0-9-]/g, '')
      .toLowerCase();
  }

  private showPostInstallInstructions(mode: string, client: string): void {
    console.log('\n📋 Next Steps:');
    
    if (mode === 'direct') {
      this.warn(`Please restart ${client} to use the installed server`);
      this.info('After restart, tools will be available with their native names');
    } else {
      this.info('Server is ready to use immediately!');
      this.info('Tools are available with the server name prefix');
      this.info('Use "mcpl status" to see running servers');
    }

    console.log('\n💡 Useful commands:');
    console.log('  mcpl status          - Check server status');
    console.log('  mcpl inspect <name>  - Inspect server details');
    console.log('  mcpl health          - Run health checks');
  }
}
