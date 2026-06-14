import { ChatInputCommandInteraction, SlashCommandBuilder, Collection, EmbedBuilder, PermissionFlagsBits } from 'discord.js';
import { getFlyerConfig } from '../utils/Config.utils';
import { checkDeveloperPermission } from '../utils/Permission.utils';

class FlyerCommand {
	public data: SlashCommandBuilder;

	constructor(commands: Collection<string, any>) {
		const flyerConfig = getFlyerConfig();
		const choices = Object.keys(flyerConfig).map((key) => ({
			name: key,
			value: key,
		}));

		const builder = new SlashCommandBuilder()
			.setName('flyer')
			.setDescription('Sends a formatted flyer embed message')
			.setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild);

		builder.addStringOption((option) => {
			option
				.setName('name')
				.setDescription('The name of the flyer to display')
				.setRequired(true);

			if (choices.length > 0) {
				option.addChoices(...choices);
			}
			return option;
		});

		this.data = builder as SlashCommandBuilder;
		commands.set(this.data.name, this);
	}

	/**
	 * Executes the flyer command.
	 * Retrieves the flyer content from the configuration and replies with a beautifully styled embed.
	 * 
	 * @param interaction - The chat input command interaction from Discord.
	 */
	public async execute(interaction: ChatInputCommandInteraction) {
		if (!(await checkDeveloperPermission(interaction))) {
			return;
		}

		const name = interaction.options.getString('name', true);
		const flyerConfig = getFlyerConfig();
		const content = flyerConfig[name];

		if (!content) {
			await interaction.reply({
				content: `Flyer "${name}" was not found in the configuration.`,
				ephemeral: true,
			});
			return;
		}

		const embed = new EmbedBuilder()
			.setColor('#6646E3') // Beautiful premium gold/yellow sidebar matching the screenshot
			.setDescription(content)
			.setFooter({ text: 'Qubiverse.com' })
			.setTimestamp();

		await interaction.reply({ embeds: [embed] });
	}
}

export default FlyerCommand;
