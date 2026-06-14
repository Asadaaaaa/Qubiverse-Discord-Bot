# Workflow: Adding a New Slash Command

Follow these step-by-step instructions to create, code, register, and sync a new slash command in the Qubiverse Discord Bot.

---

## Step 1: Define Command Specs
Determine the following specifications:
- Command name (e.g., `userinfo`, lowercase).
- Command description.
- Command options (e.g. string inputs, integer selections).
- Target audience (Dev-only vs Public).

## Step 2: Create the File
Create a new file in `src/commands/` named `[CommandName].command.ts`. E.g., for `userinfo`, create:
[UserInfo.command.ts](file:///Users/senja/Documents/Projects/Qubiverse/Qubiverse-Discord-Bot/src/commands/UserInfo.command.ts).

Use the following layout:
```typescript
import { ChatInputCommandInteraction, SlashCommandBuilder, Collection } from 'discord.js';

class UserInfoCommand {
	public data = new SlashCommandBuilder()
		.setName('userinfo')
		.setDescription('Displays information about a user');

	constructor(commands: Collection<string, any>) {
		commands.set(this.data.name, this);
	}

	public async execute(interaction: ChatInputCommandInteraction) {
		await interaction.reply({ content: 'Command executed!', ephemeral: true });
	}
}

export default UserInfoCommand;
```

## Step 3: Implement Options and Logic
- Add options (e.g. `.addUserOption(...)`) to the `data` builder.
- Fetch option values in the `execute` method using `interaction.options`.
- Use services in `src/services/` or helpers in `src/utils/` if complex business logic or canvas rendering is needed.
- If it's developer-only, import `checkDeveloperPermission` and call it:
  ```typescript
  import { checkDeveloperPermission } from '../utils/Permission.utils';
  
  // In execute:
  if (!(await checkDeveloperPermission(interaction))) return;
  ```

## Step 4: Register in CommandHandler
Open [CommandHandler.ts](file:///Users/senja/Documents/Projects/Qubiverse/Qubiverse-Discord-Bot/src/commands/CommandHandler.ts):
1. Import the class:
   ```typescript
   import UserInfoCommand from './UserInfo.command';
   ```
2. Instantiate it inside `loadCommands()`:
   ```typescript
   private loadCommands() {
       // ... existing commands ...
       new UserInfoCommand(this.commands);
   }
   ```

## Step 5: Test and Sync commands
1. Ensure your `.env` contains:
   - `DISCORD_TOKEN`
   - `DISCORD_CLIENT_ID`
2. Ensure your `storage/resources/config.yml` has the correct `server.id` if you want commands to sync instantly to a development server.
3. Start the bot:
   ```bash
   bun .
   ```
4. Verify the console logs:
   - `Started refreshing application (/) commands.`
   - `Successfully reloaded application (/) commands.`
5. Go to your Discord server and try executing `/userinfo`.
