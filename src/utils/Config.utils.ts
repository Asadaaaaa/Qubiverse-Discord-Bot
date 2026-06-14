import { readFileSync } from 'fs';
import { resolve } from 'path';

interface Config {
	server?: {
		id?: string;
	};
	developer?: {
		user_id?: string[];
	};
	channel?: {
		welcome?: {
			enabled?: boolean;
			channel_id?: string;
			title_template?: string;
			color?: string;
			invite_link?: string;
			description_lines?: string[];
		};
	};
	flyer?: Record<string, string>;
}

/**
 * Loads and parses the configuration file.
 * 
 * @returns The configuration object.
 */
export function getConfig(): Config {
	try {
		const configPath = resolve(process.cwd(), 'storage/resources/config.yml');
		const fileContent = readFileSync(configPath, 'utf-8');
		return Bun.YAML.parse(fileContent) as Config;
	} catch (error) {
		console.error('Error loading config.yml:', error);
		return {};
	}
}

/**
 * Retrieves the list of developer user IDs from the configuration.
 * 
 * @returns Array of developer user IDs.
 */
export function getDeveloperIds(): string[] {
	const config = getConfig();
	return config.developer?.user_id || [];
}

/**
 * Retrieves the welcome configuration settings.
 * 
 * @returns Welcome configuration settings.
 */
export function getWelcomeConfig() {
	const config = getConfig();
	return config.channel?.welcome || {};
}

/**
 * Retrieves the flyer configuration settings.
 * 
 * @returns Record of flyer names and their markdown contents.
 */
export function getFlyerConfig(): Record<string, string> {
	const config = getConfig();
	return config.flyer || {};
}
