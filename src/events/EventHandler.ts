import { Client } from 'discord.js';
import Server from '../Server';
import GuildMemberAddEvent from './GuildMemberAdd.event';

class EventHandler {
	private server: Server;
	private client: Client;

	constructor(server: Server, client: Client) {
		this.server = server;
		this.client = client;
	}

	/**
	 * Initializes all event listeners for the bot.
	 */
	public init() {
		const guildMemberAddEvent = new GuildMemberAddEvent(this.server);
		this.client.on('guildMemberAdd', (member) => guildMemberAddEvent.execute(member));
	}
}

export default EventHandler;
