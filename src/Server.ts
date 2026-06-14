import sendLogs from './utils/Logger.utils';
import Bot from './Bot';

class Server {
	public sendLogs: (...args: any[]) => void;
	private bot: Bot;

	constructor() {
		this.sendLogs = sendLogs;

		const token = process.env.DISCORD_TOKEN as string || process.env.DISCORD_BOT_TOKEN as string;
		const clientId = process.env.DISCORD_CLIENT_ID as string;

		if (!token || !clientId) {
			throw new Error("Missing DISCORD_TOKEN (or DISCORD_BOT_TOKEN) or DISCORD_CLIENT_ID in .env");
		}

		this.bot = new Bot(this, clientId, token);

		this.init();
	}

	async init() {
		this.sendLogs('Initializing Server...');
		this.run();
	}

	async run() {
		this.sendLogs('Server Started');
	}
}

export default Server;