# Reqall extension instructions

The following files supply model guidance, not executable lifecycle hooks or
registered slash commands. Apply workflow guidance when relevant to the task;
reuse the same project binding throughout recall and persistence.

The files name Reqall tools as `reqall:<tool>`. Gemini CLI registers MCP tools as
`mcp_<server>_<tool>`, so call `mcp_reqall_<tool>` (for example, `reqall:search`
is `mcp_reqall_search` and `reqall:upsert_project` is `mcp_reqall_upsert_project`).

@./_agents/system.md
@./_agents/hooks/before_request.md
@./_agents/hooks/before_tool_use.md
@./_agents/hooks/after_plan.md
@./_agents/hooks/after_task.md
@./_agents/workflows/reqall-context.md
@./_agents/workflows/reqall-sync.md
