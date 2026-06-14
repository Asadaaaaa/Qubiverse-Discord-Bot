# Project Rules & Architecture

Welcome! This document outlines the technology stack, project directory structure, and general coding guidelines for the Qubiverse Discord Bot. Follow these patterns closely when modifying or extending this repository.

---

## 1. Technology Stack

- **Runtime**: [Bun](https://bun.sh/) (Fast all-in-one JavaScript/TypeScript runtime).
- **Language**: [TypeScript](https://www.typescriptlang.org/) (Strict mode enabled, target ESNext).
- **Core Library**: [Discord.js v14](https://discord.js.org/) (Used to interact with the Discord API).
- **Canvas Rendering**: `@napi-rs/canvas` (High-performance canvas implementation in Rust).

---

## 2. Directory Structure

- `index.ts` - Entry point of the application. Instantiates and boots the `Server` class.
- `src/` - Contains all application source code:
  - [Server.ts](file:///Users/senja/Documents/Projects/Qubiverse/Qubiverse-Discord-Bot/src/Server.ts) - Bootstraps the application, loads environment variables, and initializes the bot.
  - [Bot.ts](file:///Users/senja/Documents/Projects/Qubiverse/Qubiverse-Discord-Bot/src/Bot.ts) - Configures the `Client` instance, registers intents/partials, and initializes command and event handlers.
  - `commands/` - Contains slash commands. Format: `[CommandName].command.ts`.
  - `events/` - Contains event listeners. Format: `[EventName].event.ts`.
  - `services/` - Contains business logic, third-party API integration, or heavy processing (e.g. canvas greeting generation). Format: `[ServiceName].service.ts`.
  - `utils/` - Shared helper utilities. Format: `[UtilityName].utils.ts`.
- `storage/` - Holds local data, assets, config templates, and media files:
  - `storage/resources/` - Holds configurations (`config.yml`), custom fonts (e.g., Poppins-SemiBold.ttf), banners, and animations.

---

## 3. General Coding Standards & Style

### TypeScript & Module Imports
- **Strict Mode**: The compiler has strict mode enabled. Always type your variables, function arguments, and return types explicitly. Avoid `any` where possible.
- **Import Suffixes**: Because of bundler module resolution, you can import `.ts` files with or without the `.ts` suffix (e.g., `import Bot from './Bot.ts'` and `import Server from './Server'` are both present). Check adjacent imports in the target file and maintain consistency.

### Logger Utility
- Avoid standard `console.log` for status messages. Use the central logging utility `sendLogs` (exposed on the `Server` class instance or imported from `src/utils/Logger.utils.ts`) to ensure logs format correctly and log to files if configured.
- For stack traces or errors, use `console.error` as standard.

### Config and Settings
- Global config details are stored in `storage/resources/config.yml`.
- Never hardcode dynamic values. Load config parameters using functions in `src/utils/Config.utils.ts`, such as `getConfig()`, `getWelcomeConfig()`, or `getDeveloperIds()`.
- Use Bun's built-in YAML parser for reading `.yml` configuration files:
  ```typescript
  import { readFileSync } from 'fs';
  const fileContent = readFileSync(configPath, 'utf-8');
  Bun.YAML.parse(fileContent);
  ```
