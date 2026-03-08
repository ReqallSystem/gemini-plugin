# Reqall Gemini Plugin

Persistent, artifact-driven semantic memory for Gemini agents.

Unlike the CLI-focused Claude Plugin, the Gemini plugin leverages the agent's ambient IDE environment, rich markdown artifacts, and slash commands.

## Installation

1. Create a `reqall` directory inside your Gemini plugins folder:
   ```bash
   mkdir -p ~/.gemini/plugins/reqall
   ```
2. Copy the contents of this `gemini-plugin` directory into the new `~/.gemini/plugins/reqall` folder.
3. Set your Reqall API key as an environment variable in your terminal before launching your IDE/Gemini agent:
   ```bash
   export REQALL_API_KEY="your-api-key"
   # Optional: export REQALL_URL="https://reqall.net"
   ```

## How it Works

The Gemini plugin relies on Gemini's continuous generation of artifacts (`task.md`, `implementation_plan.md`) and workflows to synchronize knowledge as you work.

### Core Workflows (Slash Commands)

- `/reqall-context` - Run before starting a complex task. Hydrates the agent's context window with relevant architecture, issues, and specifications from Reqall.
- `/reqall-sync` - Explicitly pushes your current local `task.md` and `implementation_plan.md` outputs up to Reqall as linked semantic records.

### Automatic Behaviors

Instead of a terminal "Stop" hook, Gemini is instructed via its `GEMINI.md` system memory to act proactively:
1. **Automatic Context Retrieval**: BEFORE starting any work on a new prompt, Gemini will automatically query Reqall to load relevant past context, specs, and open issues.
2. **Automatic Project Persistence**: Upon user approval of an `implementation_plan.md`, Gemini will explicitly push it to Reqall as a `SPEC` or `ARCH` record.
3. **Continuous Execution Saving**: As Gemini works through items in `task.md` or finishes a coding session, it will automatically persist them as `TODO` or `TASK` issues under the project, saving the user from having to manually request syncing.

## Future Roadmap / Planned Capabilities

- **Inline Code Linking**: Instructing Gemini to embed inline Reqall ID anchors (e.g., `// REQALL:ISSUE-45`) into the raw source code, making it fully searchable to the agent via `grep`.
- **Cross-Project Impact UI**: A `/reqall-impact` slash command that traverses outgoing connections from your current project, outputting an `impact_analysis.md` artifact highlighting dependencies that need attention.
- **Local KI (Knowledge Item) Synchronization**: Utilizing the agent's local `.gemini/knowledge` cache to sync Reqall projects directly to the fast local KI storage for blazing-fast retrieval without API calls.

## License

MIT