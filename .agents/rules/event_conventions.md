# Event Conventions

All Discord event listeners are organized in the `src/events/` directory.

---

## 1. Class Structure

Every event listener must be defined as a TypeScript class with:
1. A constructor accepting the global `Server` instance (to access global properties like `sendLogs`).
2. An `execute` method that contains the logic triggered when the event fires.

### Example Template

```typescript
import { Message } from 'discord.js';
import Server from '../Server';

class MessageCreateEvent {
	private server: Server;

	constructor(server: Server) {
		this.server = server;
	}

	public async execute(message: Message) {
		// Ignore bot messages
		if (message.author.bot) return;

		// Perform event logic
		this.server.sendLogs(`Message received from ${message.author.tag}: ${message.content}`);
	}
}

export default MessageCreateEvent;
```

---

## 2. Rules & Best Practices

1. **Naming**: File naming should be `[EventName].event.ts` (PascalCase matching the Discord.js ClientEvent name, e.g. `GuildMemberAdd.event.ts` or `MessageCreate.event.ts`).
2. **Registration**: You **MUST** register the event manually in [EventHandler.ts](file:///Users/senja/Documents/Projects/Qubiverse/Qubiverse-Discord-Bot/src/events/EventHandler.ts).
   - Import the event class:
     ```typescript
     import MessageCreateEvent from './MessageCreate.event';
     ```
   - Instantiate it and attach it to the Discord Client event listener in the `init()` method:
     ```typescript
     public init() {
         const guildMemberAddEvent = new GuildMemberAddEvent(this.server);
         this.client.on('guildMemberAdd', (member) => guildMemberAddEvent.execute(member));

         const messageCreateEvent = new MessageCreateEvent(this.server);
         this.client.on('messageCreate', (message) => messageCreateEvent.execute(message));
     }
     ```
3. **Gateway Intents**: Ensure that any events you listen to are enabled in the `Client` intents options inside [Bot.ts](file:///Users/senja/Documents/Projects/Qubiverse/Qubiverse-Discord-Bot/src/Bot.ts). For example, listening to `messageCreate` requires `GatewayIntentBits.GuildMessages` and `GatewayIntentBits.MessageContent`.
4. **Error Handling**: Wrap the execution code inside a try-catch block to prevent uncaught exceptions from crashing the entire bot instance.
5. **Config Filtering**: If the event behavior depends on configuration toggles (like `welcome.enabled`), check these configurations immediately at the start of the `execute` method.
