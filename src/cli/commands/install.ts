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

export class InstallCommand extends BaseCommand {
  async execute(packageName: string, options: InstallOptions): Promise<void> {
    this.setVerbose(options.verbose || false);
    
    try {
      this.info(`Installing MCP server: ${packageName}`);
      this.debug(`Options: ${JSON.stringify(options, null, 2)}`);

      // Parse configuration
      const config = options.config ? this.parseJSON(options.config) : {};
      const env = options.env ? this.parseJSON(options.env) : {};

      // Dry run mode
      if (options.dryRun) {
        await this.performDryRun(packageName, options, config, env);
        return;
      }

      // Check if package exists (if not a direct package name)
      if (!this.isDirectPackage(packageName)) {
        await this.searchAndSelectPackage(packageName);
      }

      // Determine installation type
      const installType = this.determineInstallType(packageName);
      this.debug(`Detected installation type: ${installType}`);

      // Install based on mode
      if (options.mode === 'bridge') {
        await this.installBridgeMode(packageName, installType, config, env, options);
      } else {
        await this.installDirectMode(packageName, installType, config, env, options);
      }

      this.success(`Successfully installed ${packageName}`);
      
      // Post-installation instructions
      this.showPostInstallInstructions(options.mode, options.client);

    } catch (error) {
      this.handleError(error, 'Installation failed');
    }
  }

  private async performDryRun(
    packageName: string, 
    options: InstallOptions, 
    config: any, 
    env: any
  ): Promise<void> {
    this.info('🔍 Dry run mode - showing what would be installed:');
    
    const installType = this.determineInstallType(packageName);
    
    console.log(`
📦 Package: ${packageName}
🎯 Client: ${options.client}
🔧 Mode: ${options.mode}
📋 Type: ${installType}
⚙️ Config: ${Object.keys(config).length} keys
🌍 Environment: ${Object.keys(env).length} variables
🚀 Auto-start: ${options.autoStart}
    `);

    if (options.mode === 'direct') {
      this.warn('Direct mode installation would require Claude Desktop restart');
    }

    this.info('Use --force to proceed with actual installation');
  }

  private isDirectPackage(packageName: string): boolean {
    // Check if it's a direct NPM package or Docker image
    return packageName.includes('/') || packageName.startsWith('@') || packageName.includes(':');
  }

  private async searchAndSelectPackage(query: string): Promise<string> {
    this.info(`Searching for servers matching: ${query}`);
    
    try {
      // Use smart discovery to find matching servers
      const searchResult = await this.bridge.components.coreTools['smartDiscovery']({
        query,
        limit: 5
      });

      const servers = JSON.parse(searchResult.content[0].text);
      
      if (!servers.servers || servers.servers.length === 0) {
        throw new Error(`No servers found matching: ${query}`);
      }

      if (servers.servers.length === 1) {
        const server = servers.servers[0];
        this.info(`Found server: ${server.name}`);
        return server.npm_package || server.docker_image || query;
      }

      // Multiple results - let user choose
      const choices = servers.servers.map((server: any) => ({
        name: `${server.name} - ${server.description}`,
        value: server.npm_package || server.docker_image || server.name
      }));

      const selected = await this.select('Select a server to install:', choices);
      return selected;

    } catch (error) {
      this.warn(`Search failed, proceeding with original package name: ${error instanceof Error ? error.message : String(error)}`);
      return query;
    }
  }

  private determineInstallType(packageName: string): 'npm' | 'docker' {
    if (packageName.includes(':') && !packageName.startsWith('@')) {
      return 'docker';
    }
    return 'npm';
  }

  private async installBridgeMode(
    packageName: string,
    type: 'npm' | 'docker',
    config: any,
    env: any,
    options: InstallOptions
  ): Promise<void> {
    this.info('Installing in bridge mode (dynamic, no restart required)');

    await this.withSpinner('Installing server...', async () => {
      const result = await this.bridge.components.serverManagementTools['installServer']({
        name: this.generateServerName(packageName),
        type,
        command: packageName,
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
    packageName: string,
    type: 'npm' | 'docker',
    config: any,
    env: any,
    options: InstallOptions
  ): Promise<void> {
    this.info('Installing in direct mode (permanent, requires restart)');

    await this.withSpinner('Adding to Claude Desktop configuration...', async () => {
      const result = await this.bridge.components.serverManagementTools['installServer']({
        name: this.generateServerName(packageName),
        type,
        command: packageName,
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
