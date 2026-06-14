import { GuildMember, TextChannel } from 'discord.js';
import { WelcomeService } from '../services/Welcome.service';
import { getWelcomeConfig } from '../utils/Config.utils';
import Server from '../Server';

class GuildMemberAddEvent {
	private server: Server;

	constructor(server: Server) {
		this.server = server;
	}

	/**
	 * Executes the guildMemberAdd event logic.
	 * 
	 * @param member - The guild member who joined.
	 */
	public async execute(member: GuildMember) {
		const config = getWelcomeConfig();
		if (!config.enabled) return;

		try {
			// Determine the target welcome channel
			const channelId = config.channel_id;
			const channel = channelId 
				? await member.guild.channels.fetch(channelId).catch(() => null)
				: member.guild.systemChannel;

			if (channel && channel.isTextBased()) {
				const avatarUrl = member.user.displayAvatarURL({ extension: 'png', size: 256 });
				const guildName = member.guild.name;

				const payload = await WelcomeService.getWelcomeMessagePayload(
					member.user.username,
					member.user.id,
					avatarUrl,
					guildName
				);

				await (channel as TextChannel).send(payload);
				this.server.sendLogs(`Sent welcome message to ${member.user.tag} in #${channel.name}`);
			}
		} catch (error) {
			console.error('Error handling guildMemberAdd:', error);
		}
	}
}

export default GuildMemberAddEvent;
