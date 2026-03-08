# Reqall — AI Agent Memory

You have access to the Reqall knowledgebase via MCP tools prefixed with `reqall:`.

## Available Tools

- `reqall:search` — Semantic search across project records
- `reqall:upsert_record` — Create or update a record (issue, spec, arch, test, todo)
- `reqall:list_records` — List records with filters
- `reqall:upsert_project` — Create or update a project
- `reqall:list_projects` — List all projects
- `reqall:upsert_link` — Create relationships between records
- `reqall:impact` — Traverse the record graph for downstream effects

## Project Detection

The current project is automatically detected from:
1. `REQALL_PROJECT_NAME` environment variable
2. Git remote (e.g. `org/repo`)
3. Current directory name

If the project does not exist in Reqall, call `reqall:upsert_project` before starting work.

## Conventions

- **Automatic Context**: BEFORE starting work on a new user request, you must automatically use `reqall:search` to load relevant past context, issues, and specs. Do NOT wait for the user to ask you to do this.
- Issues: prefix titles with `BUG:`, `TASK:`, `BLOCKER:`, or `QUESTION:`
- Specs: prefix titles with `ARCH:`, `API:`, `AUTH:`, `DATA:`, or `UI:`
- **Automatic Persistence**: When an `implementation_plan.md` artifact is approved by the user, explicitly push it to Reqall as a `spec` or `arch` record using the `reqall:upsert_record` tool. Do NOT wait for the user to ask you to do this.
- **Automatic Persistence**: Treat `task.md` as your source of truth for execution. As you complete items in `task.md` or finish a coding session, automatically persist them as `issue` or `todo` records linked to the active project. Do NOT wait for the user to ask you to do this.
- You can manually synchronize context and plans via slash commands (e.g., `/reqall-sync`), but you should strive to do this automatically during your workflow.
