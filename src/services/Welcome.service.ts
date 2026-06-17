import { createCanvas, loadImage, GlobalFonts } from '@napi-rs/canvas';
import { resolve } from 'path';
import { EmbedBuilder, AttachmentBuilder } from 'discord.js';
import type { ColorResolvable } from 'discord.js';
import { getWelcomeConfig } from '../utils/Config.utils';

// Register Poppins font
GlobalFonts.registerFromPath(resolve(process.cwd(), 'storage/resources/fonts/Poppins-SemiBold.ttf'), 'Poppins');

export class WelcomeService {
	private static cachedBackground: any = null;

	/**
	 * Loads and caches the welcome banner background image in memory.
	 */
	private static async getBackgroundImage() {
		if (!this.cachedBackground) {
			const backgroundPath = resolve(process.cwd(), 'storage/resources/Welcom-Banner.png');
			this.cachedBackground = await loadImage(backgroundPath);
		}
		return this.cachedBackground;
	}

	/**
	 * Formats a welcome message for a user.
	 * 
	 * @param username - The username of the user.
	 * @param userId - Optional Discord user ID to mention the user.
	 * @returns The formatted welcome message string.
	 */
	public static getWelcomeMessage(username: string, userId?: string): string {
		return `Hello ${userId ? `<@${userId}>` : `@${username}`}`;
	}

	/**
	 * Creates a welcome message payload containing content, embeds, and attachments.
	 * 
	 * @param username - The username of the user.
	 * @param userId - Discord user ID to mention.
	 * @param avatarUrl - The Discord avatar URL of the user.
	 * @param guildName - The name of the server/guild.
	 * @returns The message payload object compatible with Discord.js message sending.
	 */
	public static async getWelcomeMessagePayload(
		username: string,
		userId: string,
		avatarUrl: string,
		guildName: string = 'Qubiverse'
	) {
		const welcomeConfig = getWelcomeConfig();

		// Generate the welcome banner JPEG buffer
		const bannerBuffer = await this.generateWelcomeBanner(avatarUrl, username);
		const bannerAttachment = new AttachmentBuilder(bannerBuffer, { name: 'welcome-banner.jpg' });

		// Check if a hosted CDN URL is provided for the logo to avoid sending 1.5MB on each join
		let logoAttachment: AttachmentBuilder | null = null;
		let thumbnailTarget = 'attachment://LogoAnimation.gif';

		if (welcomeConfig.logo_url) {
			thumbnailTarget = welcomeConfig.logo_url;
		} else {
			const logoPath = resolve(process.cwd(), 'storage/resources/LogoAnimation.gif');
			logoAttachment = new AttachmentBuilder(logoPath, { name: 'LogoAnimation.gif' });
		}

		// Prepare description lines
		const defaultDescriptionLines = [
			'୨୧,, : visit some channels , ⊂✦⊃ ‹3',
			'°ԅ° Come and say hi to everyone! # 🧃┆chat',
			'°ԅ° You can pick roles here! # 🎭┆roles'
		];
		const descriptionLines = welcomeConfig.description_lines || defaultDescriptionLines;
		const description = descriptionLines.join('\n');

		// Format Title Template
		const titleTemplate = welcomeConfig.title_template || '* Welcome to {guild} ⊹';
		const title = titleTemplate.replace('{guild}', guildName);

		// Format Color
		const embedColor = (welcomeConfig.color || '#A8F9D6') as ColorResolvable;

		// Build Welcome Embed
		const embed = new EmbedBuilder()
			.setColor('#6646E3') // Bea
			.setTitle(title)
			.setDescription(description)
			.setThumbnail(thumbnailTarget)
			.setImage('attachment://welcome-banner.jpg')
			.setColor(embedColor)
			.setFooter({ text: welcomeConfig.invite_link || '.gg/qubiverse' })
			.setTimestamp();

		const files: AttachmentBuilder[] = [bannerAttachment];
		if (logoAttachment) {
			files.push(logoAttachment);
		}

		return {
			content: `hello! <@${userId}>`,
			embeds: [embed],
			files
		};
	}

	/**
	 * Generates a welcome banner image buffer for a user.
	 * 
	 * @param avatarUrl - The Discord avatar URL of the user.
	 * @param username - The username of the user.
	 * @returns A promise resolving to a JPEG image buffer of the welcome banner.
	 */
	public static async generateWelcomeBanner(avatarUrl: string, username: string): Promise<Buffer> {
		const background = await this.getBackgroundImage();

		const canvas = createCanvas(background.width, background.height);
		const ctx = canvas.getContext('2d');

		// Ensure the avatar URL uses PNG and has a fallback size for canvas compatibility
		const finalAvatarUrl = avatarUrl.replace('.webp', '.png') + '?size=256';
		const avatar = await loadImage(finalAvatarUrl);

		// Target dimensions and center position for the avatar hole
		const avatarSize = 220;
		const centerX = 490.5;
		const centerY = 241;
		const avatarX = centerX - (avatarSize / 2);
		const avatarY = centerY - (avatarSize / 2);

		// Draw avatar with circular clipping (Layer 1)
		ctx.save();
		ctx.beginPath();
		ctx.arc(
			centerX,
			centerY,
			avatarSize / 2,
			0,
			Math.PI * 2
		);
		ctx.closePath();
		ctx.clip();
		ctx.drawImage(avatar, avatarX, avatarY, avatarSize, avatarSize);
		ctx.restore();

		// Draw background banner on top (Layer 2)
		ctx.drawImage(background, 0, 0, background.width, background.height);

		// Draw username (Layer 3)
		ctx.font = '36px "Poppins"';
		ctx.fillStyle = '#A8F9D6';
		ctx.textAlign = 'center';
		ctx.textBaseline = 'top';

		// Add subtle shadow for text readability
		ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
		ctx.shadowBlur = 6;
		ctx.shadowOffsetX = 0;
		ctx.shadowOffsetY = 2;

		ctx.fillText(username, centerX, 375);

		// Reset shadow settings
		ctx.shadowColor = 'transparent';
		ctx.shadowBlur = 0;
		ctx.shadowOffsetX = 0;
		ctx.shadowOffsetY = 0;

		return canvas.toBuffer('image/jpeg');
	}
}
