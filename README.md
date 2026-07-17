# Qubiverse Discord Bot

A high-performance Discord bot built with **Bun**, **TypeScript**, and **Discord.js v14**. It features dynamic welcome banner generation using **@napi-rs/canvas** and flexible configuration via YAML.

---

## 🚀 Features

- **Dynamic Welcome Banners**: Automatically generates personalized welcome images on `guildMemberAdd` by combining a background template, circular user avatar, and custom text utilizing the Poppins font.
- **Slash Commands**:
  - `/ping`: Simple command to check bot responsiveness.
  - `/flyer <name>`: Sends a beautifully styled markdown flyer embed (e.g., server rules) matching key configurations in `config.yml`. Restricted to designated developers.
  - `/test <args1>`: Generates a test welcome banner when running `/test welcome` to verify the canvas engine without needing to simulate a real user join event.
- **Developer Restrictive Mode**: Developer permissions are enforced on command executes like `/flyer` and `/test`.
- **YAML Configuration**: Easily customize server settings, channel IDs, welcome templates, colors, and embedded assets.

---

## 🛠️ Tech Stack

- **Runtime**: [Bun](https://bun.sh/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **API Wrapper**: [Discord.js v14](https://discord.js.org/)
- **Canvas Rendering**: [@napi-rs/canvas](https://github.com/Brooooooklyn/canvas) (Fast Rust-backed canvas implementation)

---

## 📂 Project Structure

```text
├── index.ts                   # Entry point of the application
├── src/
│   ├── Server.ts              # Bootstraps the application & loads environment variables
│   ├── Bot.ts                 # Configures discord client & registers commands/events
│   ├── commands/              # Slash Command definitions
│   │   ├── CommandHandler.ts  # Dynamically loads and registers commands (Guild/Global)
│   │   ├── Ping.command.ts    # /ping command
│   │   ├── Test.command.ts    # /test command (e.g., /test welcome)
│   │   └── Flyer.command.ts   # /flyer command
│   ├── events/                # Discord Event Listeners
│   │   ├── EventHandler.ts    # Binds Discord events to handlers
│   │   └── GuildMemberAdd.event.ts # Welcome flow trigger
│   ├── services/              # Business logic (e.g., welcome image generation)
│   │   └── Welcome.service.ts # Canvas generation code for welcome banners
│   └── utils/                 # Utility files (Logger, Config parser, Permissions)
└── storage/
    └── resources/             # Static assets (fonts, background banners, YAML configurations)
```

---

## ⚙️ Configuration & Setup

### Prerequisites

You must have [Bun](https://bun.sh/) installed on your machine.

### 1. Clone & Install Dependencies

```bash
bun install
```

### 2. Environment Variables

Duplicate the `.env.example` file and rename it to `.env`. Fill in your credentials:

```ini
NODE_ENV = "development"
APP_NAME = "Qubiverse Discord Bot"

# Logging Verbosity ('full' | 'medium' | 'false')
LOG_REQUEST = 'medium'

# Discord API Configuration
DISCORD_BOT_TOKEN = "your_bot_token_here"
DISCORD_CLIENT_ID = "your_bot_client_id_here"
```

### 3. YAML Configuration

Configure your bot settings in [storage/resources/config.yml](file:///Users/senja/Documents/Projects/Qubiverse/Qubiverse-Discord-Bot/storage/resources/config.yml):

- **server.id**: Your server (guild) ID. If provided, commands will be registered instantly to this server instead of globally (which takes up to an hour to cache).
- **developer.user_id**: List of Discord user IDs allowed to run developer commands (`/test` and `/flyer`).
- **channel.welcome**: Toggle welcome banners, set the target channel ID, customize colors, configure embed description lines, or change the welcome title/logo.
- **flyer**: Add custom keys and markdown content for use with the `/flyer` command.

---

## 🏃 Running the Bot

To start the bot in development mode with hot reloading:

```bash
bun --watch index.ts
```

To start the bot normally:

```bash
bun run index.ts
```