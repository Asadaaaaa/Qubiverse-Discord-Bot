import { ChatInputCommandInteraction, SlashCommandBuilder, Collection } from 'discord.js';

class PingCommand {
	public data = new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with Pong!');

	constructor(commands: Collection<string, any>) {
		commands.set(this.data.name, this);
	}

	public async execute(interaction: ChatInputCommandInteraction) {
		await interaction.reply('Pong!');
	}
}

export default PingCommand;