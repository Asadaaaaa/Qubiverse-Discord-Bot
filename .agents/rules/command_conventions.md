# Slash Command Conventions

All commands in this bot are slash commands built using `discord.js`. They are organized in the `src/commands/` directory.

---

## 1. Class Structure

Every command must be defined as a TypeScript class with:
1. A `data` property of type `SlashCommandBuilder` (or compatible Discord.js builder type) containing metadata like name, description, options, and permissions.
2. A constructor accepting the global commands collection to register itself.
3. An `execute` method that handles the command interaction.

### Example Template

```typescript
import { ChatInputCommandInteraction, SlashCommandBuilder, Collection } from 'discord.js';
import { checkDeveloperPermission } from '../utils/Permission.utils';

class ExampleCommand {
	public data = new SlashCommandBuilder()
		.setName('example')
		.setDescription('An example command description')
		.addStringOption((option) =>
			option
				.setName('input')
				.setDescription('Input argument')
				.setRequired(true)
		);

	constructor(commands: Collection<string, any>) {
		commands.set(this.data.name, this);
	}

	public async execute(interaction: ChatInputCommandInteraction) {
		// 1. (Optional) Check developer permission if it is a dev-only command
		if (!(await checkDeveloperPermission(interaction))) {
			return;
		}

		// 2. Fetch options
		const input = interaction.options.getString('input', true);

		// 3. Process & Reply
		await interaction.reply({ content: `You entered: ${input}`, ephemeral: true });
	}
}

export default ExampleCommand;
```

---

## 2. Rules & Best Practices

1. **Naming**: File naming should be `[CommandName].command.ts` (PascalCase for filename like `Ping.command.ts`, but lowercase for slash command register name, e.g. `ping`).
2. **Registration**: You **MUST** register the command manually in [CommandHandler.ts](file:///Users/senja/Documents/Projects/Qubiverse/Qubiverse-Discord-Bot/src/commands/CommandHandler.ts).
   - Import the command class at the top:
     ```typescript
     import ExampleCommand from "./Example.command";
     ```
   - Instantiation in `loadCommands()`:
     ```typescript
     private loadCommands() {
         new PingCommand(this.commands);
         new TestCommand(this.commands);
         new FlyerCommand(this.commands);
         new ExampleCommand(this.commands); // Add here
     }
     ```
3. **Deferred Replies**: If a command performs asynchronous actions (like canvas generation, external API fetches) that can take more than 3 seconds, call `await interaction.deferReply();` immediately, then use `await interaction.editReply(payload);`.
4. **Permissions**: Use `setDefaultMemberPermissions` on the `SlashCommandBuilder` to restrict commands for general server members, and/or use `checkDeveloperPermission(interaction)` for developer-exclusive controls.
5. **Errors**: Let the try-catch block inside `CommandHandler.ts` handle general command-level exceptions, or catch them in the command itself if you need customized recovery.
