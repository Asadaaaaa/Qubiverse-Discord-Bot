# Workflow: Adding a New Discord Event Listener

Follow these steps to create, code, register, and configure a new event listener in the Qubiverse Discord Bot.

---

## Step 1: Identify the Discord.js Event
Determine which Discord event you need to listen to (e.g., `messageCreate`, `guildMemberUpdate`, `voiceStateUpdate`). Refer to the [Discord.js documentation](https://discord.js.org/) for event names and callback parameters.

## Step 2: Create the Event File
Create a new file in `src/events/` named `[EventName].event.ts` (e.g. `MessageCreate.event.ts`).
[MessageCreate.event.ts](file:///Users/senja/Documents/Projects/Qubiverse/Qubiverse-Discord-Bot/src/events/MessageCreate.event.ts).

Template code:
```typescript
import { Message } from 'discord.js';
import Server from '../Server';

class MessageCreateEvent {
	private server: Server;

	constructor(server: Server) {
		this.server = server;
	}

	public async execute(message: Message) {
		if (message.author.bot) return;

		this.server.sendLogs(`Captured message from ${message.author.tag}`);
	}
}

export default MessageCreateEvent;
```

## Step 3: Register in EventHandler
Open [EventHandler.ts](file:///Users/senja/Documents/Projects/Qubiverse/Qubiverse-Discord-Bot/src/events/EventHandler.ts):
1. Import the class:
   ```typescript
   import MessageCreateEvent from './MessageCreate.event';
   ```
2. Instantiate it and listen on the Discord Client in `init()`:
   ```typescript
   public init() {
       // ... existing events ...
       const messageCreateEvent = new MessageCreateEvent(this.server);
       this.client.on('messageCreate', (message) => messageCreateEvent.execute(message));
   }
   ```

## Step 4: Verify Gateway Intents
If your event isn't firing, the client might not have requested the required intents from the Discord Gateway.
Open [Bot.ts](file:///Users/senja/Documents/Projects/Qubiverse/Qubiverse-Discord-Bot/src/Bot.ts):
Check if the required intent is in the `Client` configuration:
```typescript
this.client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        // Add additional intents here if needed (e.g., GatewayIntentBits.GuildVoiceStates)
    ],
    // Add required Partials if necessary
    partials: [Partials.Channel, Partials.Message, Partials.User],
});
```

> [!IMPORTANT]
> If you add privileged gateway intents (like `GuildMembers` or `MessageContent`), make sure they are explicitly toggled on/enabled in your **Discord Developer Portal** under the Bot settings tab.

## Step 5: Test the Event
1. Run the bot locally:
   ```bash
   bun .
   ```
2. Trigger the event in Discord (e.g., send a message in a channel).
3. Verify that the event logic executes correctly and look for output in logs.
