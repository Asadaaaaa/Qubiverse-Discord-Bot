import { ChatInputCommandInteraction } from 'discord.js';
import { getDeveloperIds } from './Config.utils';

/**
 * Checks if the user who initiated the interaction is configured as a developer.
 * If the user is not a developer, it automatically replies with an ephemeral permission error.
 * 
 * @param interaction - The chat input command interaction from Discord.
 * @returns A promise that resolves to true if the user is a developer, false otherwise.
 */
export async function checkDeveloperPermission(interaction: ChatInputCommandInteraction): Promise<boolean> {
	try {
		const allowedUserIds = getDeveloperIds();

		if (!allowedUserIds.includes(interaction.user.id)) {
			await interaction.reply({
				content: 'You are not allowed to use this command.',
				ephemeral: true
			});
			return false;
		}
		return true;
	} catch (error) {
		console.error('Error verifying user permission:', error);
		
		const errorMessage = {
			content: 'An error occurred while verifying access permissions.',
			ephemeral: true
		};

		if (interaction.replied || interaction.deferred) {
			await interaction.followUp(errorMessage);
		} else {
			await interaction.reply(errorMessage);
		}
		return false;
	}
}
