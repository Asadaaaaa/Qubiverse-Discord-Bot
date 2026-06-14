# Workflow: Local Testing and Verification

This guide outlines how to prepare your environment, start the bot, and verify your changes locally.

---

## 1. Environment Configuration

### Step A: .env File
Copy the example file [.env.example](file:///Users/senja/Documents/Projects/Qubiverse/Qubiverse-Discord-Bot/.env.example) to `.env` if you haven't already:
```bash
cp .env.example .env
```
Fill out the variables inside `.env`:
- `DISCORD_TOKEN` (or `DISCORD_BOT_TOKEN`): Your bot token from the Discord Developer Portal.
- `DISCORD_CLIENT_ID`: Your bot application client ID.

### Step B: config.yml File
The main runtime settings are loaded from `storage/resources/config.yml`.
Ensure your local server/guild ID is set under `server.id`:
```yaml
server:
  id: "YOUR_DEVELOPMENT_GUILD_ID"
```

> [!TIP]
> If `server.id` is configured, the bot registers slash commands only for that specific Guild (Server) instantly. If it is omitted or blank, commands are registered globally across all guilds which can take up to an hour to populate in the Discord client interface. Always use a development guild ID for testing!

---

## 2. Execution Command

Run the bot using the Bun runtime:
```bash
bun .
```
*(Alternative: `bun index.ts`)*

### Console Status Log Check
On a successful boot, you should see logs similar to this:
```
[14/06/20:39:29] (2247): Initializing Server...
[14/06/20:39:29] (2247): Server Started
[14/06/20:39:29] (2247): Started refreshing application (/) commands.
[14/06/20:39:30] (2247): Successfully reloaded application (/) commands.
```

To stop the bot, press `Ctrl+C` (sends `SIGINT`, resulting in exit code `130`).

---

## 3. Verifying Canvas & Font Rendering
If you are modifying canvas code or greeting images (like `Welcome.service.ts`):
1. Test commands manually inside Discord using `/test welcome` or trigger them by inviting/adding dummy users.
2. Confirm the custom fonts render correctly. The system loads Poppins from `storage/resources/fonts/Poppins-SemiBold.ttf` via:
   ```typescript
   GlobalFonts.registerFromPath(resolve(process.cwd(), 'storage/resources/fonts/Poppins-SemiBold.ttf'), 'Poppins');
   ```
3. If text is misaligned or overlaps, check target dimensions/offsets in `Welcome.service.ts` using drawing offsets.
