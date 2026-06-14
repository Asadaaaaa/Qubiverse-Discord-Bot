import { Collection, REST, Routes, MessageFlags } from "discord.js";
import Server from "../Server";
import Bot from "../Bot";
import PingCommand from "./Ping.command";
import TestCommand from "./Test.command";
import FlyerCommand from "./Flyer.command";
import { getConfig } from "../utils/Config.utils";
class CommandHandler {
	private server: Server;
	private bot: Bot;
	public commands: Collection<string, any>;

	constructor(server: Server, bot: Bot) {
		this.server = server;
		this.bot = bot;
		this.commands = new Collection();
	}

	public async init() {
		this.loadCommands();
		await this.registerCommands();
		this.listen();
	}

	private loadCommands() {
		new PingCommand(this.commands);
		new TestCommand(this.commands);
		new FlyerCommand(this.commands);
	}

	private async registerCommands() {
		try {
			const commandData = this.commands.map((command) => command.data.toJSON());
			const rest = new REST({ version: "10" }).setToken(this.bot.token);

			this.server.sendLogs("Started refreshing application (/) commands.");

			const config = getConfig();
			const guildId = config.server?.id;

			if (guildId) {
				// Bersihkan global commands lama agar tidak terduplikasi dengan guild commands
				await rest.put(
					Routes.applicationCommands(this.bot.clientId),
					{ body: [] },
				);

				// Daftarkan guild commands baru
				await rest.put(
					Routes.applicationGuildCommands(this.bot.clientId, guildId),
					{ body: commandData },
				);
			} else {
				await rest.put(
					Routes.applicationCommands(this.bot.clientId),
					{ body: commandData },
				);
			}

			this.server.sendLogs("Successfully reloaded application (/) commands.");
		} catch (error) {
			console.error(error);
		}
	}

	private listen() {
		this.bot.client.on("interactionCreate", async (interaction) => {
			if (!interaction.isChatInputCommand()) return;

			const command = this.commands.get(interaction.commandName);

			if (!command) {
				console.error(`No command matching ${interaction.commandName} was found.`);
				return;
			}

			try {
				await command.execute(interaction);
			} catch (error) {
				console.error(error);
				if (interaction.replied || interaction.deferred) {
					await interaction.followUp({ content: 'There was an error while executing this command!', flags: MessageFlags.Ephemeral });
				} else {
					await interaction.reply({ content: 'There was an error while executing this command!', flags: MessageFlags.Ephemeral });
				}
			}
		});
	}
}

export default CommandHandler;