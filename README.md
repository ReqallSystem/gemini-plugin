# Reqall Gemini Plugin

Persistent, artifact-driven semantic memory for Gemini agents. This Gemini CLI extension provides MCP configuration and model instructions for memory workflows.

## Installation

1. Install using the official Gemini CLI extension manager (replace the example path with your checkout or extracted npm package):
   ```bash
   gemini extensions install /absolute/path/to/gemini-plugin
   gemini extensions list
   ```
2. Set your Reqall API key before launching Gemini CLI:
   ```bash
   export REQALL_API_KEY="your-api-key"
   # Optional: export REQALL_URL="https://reqall.net"
   ```
3. Restart Gemini CLI. In the interactive session, run `/memory show` and check for `Reqall — AI Agent Memory`, `Project naming policy`, and the imported workflow/hook instructions. An MCP server listing alone does not verify instruction activation.

`gemini-extension.json` registers `GEMINI.md` via the supported `contextFileName` field. That packaged entry point imports all seven `_agents` Markdown files with relative `@./path.md` imports, loading the naming policy and workflow guidance as model context. Installation copies the extension; editing the source checkout does not update an installed copy. For development, use the official `gemini extensions link /absolute/path/to/gemini-plugin` command instead and restart the session after changes.

Official references: [extension installation, contextFileName, custom commands and hooks](https://geminicli.com/docs/extensions/reference/) and [GEMINI.md imports and /memory show](https://geminicli.com/docs/cli/gemini-md/). Context loading is separate from MCP authentication; these instructions do not verify API connectivity.

## How it Works

The loaded instructions guide the model to synchronize artifacts such as `task.md` and `implementation_plan.md` when those artifacts are used. Gemini CLI does not automatically generate them on this extension's behalf.

### Workflow templates

These are loaded Markdown templates, not registered slash commands. Ask Gemini in ordinary language to follow the relevant workflow:

- `_agents/workflows/reqall-context.md` — Recall relevant architecture, issues, and specifications before a complex task.
- `_agents/workflows/reqall-sync.md` — Persist current task/plan artifacts as linked Reqall records.

No `commands/*.toml` registrations are shipped, so `/reqall-context` and `/reqall-sync` are not available commands from this extension.

### Hooks

The `_agents/hooks/` Markdown files are instruction templates, not registered executable Gemini CLI hooks. They are imported into model context through `GEMINI.md`, not wired to host events. No `hooks/hooks.json` is shipped: model adherence is not guaranteed lifecycle execution. The templates guide these steps:

1. **`before_request` (Context)**: Recall relevant context, specs, and open issues before new work.
2. **`before_tool_use` (Guardrails)**: Consult constraints and architectural specifications before modifications.
3. **`after_plan` (Specification)**: Persist an approved plan as a `spec` or `arch` record.
4. **`after_task` (Persistence)**: Persist task outcomes as linked records.

## Future Roadmap / Planned Capabilities

- **Inline Code Linking**: Instructing Gemini to embed inline Reqall ID anchors (e.g., `// REQALL:ISSUE-45`) into the raw source code, making it fully searchable to the agent via `grep`.
- **Cross-Project Impact UI**: A `/reqall-impact` slash command that traverses outgoing connections from your current project, outputting an `impact_analysis.md` artifact highlighting dependencies that need attention.
- **Local KI (Knowledge Item) Synchronization**: Utilizing the agent's local `.gemini/knowledge` cache to sync Reqall projects directly to the fast local KI storage for blazing-fast retrieval without API calls.

## License

MIT
## Project naming

Reuse a host-bound project throughout recall and persistence; explicit operation arguments (including SLEEP) remain authoritative. Otherwise use `REQALL_PROJECT_NAME` / existing host setting → network Git origin → explicitly labelled `project_name` or `project` → nearest `.reqall.yml` / `.reqall.yaml` → nearest `package.json` / `go.mod` / `Cargo.toml` → exact path relative to a known workspace → `.machine/<short-lower-hostname>/<os-user>`. Preserve explicit identifiers; never guess from a basename or an unlabelled slash token. Route account-wide preferences deliberately to `.user`.

The installed instruction assets embed the full offline policy, including metadata limits and Git compatibility. Canonical reference: https://github.com/ReqallSystem/plugins/blob/main/doc/PROJECT_NAMING.md

Every `_agents` system, hook, and workflow file embeds the policy and reuses the current binding. These assets and `gemini-extension.json` are included in the npm package. Run `npm test` for naming and package coverage.
