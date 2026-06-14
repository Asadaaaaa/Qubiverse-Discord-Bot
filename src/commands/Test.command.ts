import { ChatInputCommandInteraction, SlashCommandBuilder, Collection } from 'discord.js';
import { WelcomeService } from '../services/Welcome.service';
import { checkDeveloperPermission } from '../utils/Permission.utils';

class TestCommand {
	public data = new SlashCommandBuilder()
		.setName('test')
		.setDescription('Test Command')
		.addStringOption((option) =>
			option
				.setName('args1')
				.setDescription('The first argument')
				.setRequired(true)
		);

	constructor(commands: Collection<string, any>) {
		commands.set(this.data.name, this);
	}

	/**
	 * Executes the test command.
	 * If the 'args1' argument is 'welcome', it generates a welcome banner and sends it as a reply.
	 * Otherwise, it echoes back the received argument.
	 * 
	 * @param interaction - The chat input command interaction from Discord.
	 */
	public async execute(interaction: ChatInputCommandInteraction) {
		if (!(await checkDeveloperPermission(interaction))) {
			return;
		}

		const args1 = interaction.options.getString('args1');

		if (args1 === 'welcome') {
			await interaction.deferReply();

			try {
				const avatarUrl = interaction.user.displayAvatarURL({ extension: 'png', size: 256 });
				const guildName = interaction.guild?.name || 'Qubiverse';

				const welcomePayload = await WelcomeService.getWelcomeMessagePayload(
					interaction.user.username,
					interaction.user.id,
					avatarUrl,
					guildName
				);

				await interaction.editReply(welcomePayload);
			} catch (error) {
				console.error('Error generating welcome banner:', error);
				await interaction.editReply('There was an error while generating the welcome banner.');
			}
		} else {
			await interaction.reply({ content: `Received argument: ${args1}`, ephemeral: true });
		}
	}
}

export default TestCommand;
