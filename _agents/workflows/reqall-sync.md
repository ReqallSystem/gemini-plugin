---
description: Synchronize local artifacts and plans with Reqall knowledgebase
---

# Syncing with Reqall

When the user runs `/reqall-sync`, you must explicitly read the active task and planning artifacts, then push them to the Reqall server as records.

1. **Read local artifacts**: Read `.gemini/antigravity/brain/<conversation-id>/task.md` and `implementation_plan.md` using the file tools.
2. **Translate to Reqall**: 
   - Parse `implementation_plan.md` into high-level specs/architectural goals. Use `reqall:upsert_record` (kind: `spec` or `arch`).
   - Parse `task.md` into concrete tasks/todos. Use `reqall:upsert_record` (kind: `todo` or `issue`).
3. **Link Records**: Based on what you parsed from the implementation plan and the task plan, call `reqall:upsert_link` to link the `todo` records as children (`parent` relationship) to the main `spec` or `arch` record.
4. **Report back**: Notify the user with a markdown summary of what you successfully persisted to Reqall.
