import { Client, Collection, GatewayIntentBits, Partials, REST, Routes } from 'discord.js';
import Server from './Server.ts';
import CommandHandler from './commands/CommandHandler.ts';
import EventHandler from './events/EventHandler.ts';

class Bot {
	public client: Client;
	public server: Server;
	public clientId: string;
	public token: string;

	constructor(server: Server, clientId: string, token: string) {
		this.server = server;
		this.clientId = clientId;
		this.token = token;

		this.client = new Client({
			intents: [
				GatewayIntentBits.Guilds,
				GatewayIntentBits.GuildMessages,
				GatewayIntentBits.MessageContent,
				GatewayIntentBits.GuildMembers,
			],
			partials: [Partials.Channel, Partials.Message, Partials.User],
		});

		this.init();
	}

	public async init() {
		const commandHandler = new CommandHandler(this.server, this);
		await commandHandler.init();

		const eventHandler = new EventHandler(this.server, this.client);
		eventHandler.init();
		
		await this.client.login(this.token);
	}
}

export default Bot;