# Reqall Target: hook(after_task)

When completing an item in `task.md`, concluding a `task_boundary`, or ending a debugging session, you MUST invoke the persistence step:
1. Treat `task.md` as your source of truth. Classify the completed work items.
2. Call `reqall:upsert_record` to persist them as `issue` or `todo` records linked to the active project.
3. Call `reqall:upsert_link` to create relationships between related records (e.g., tying a task to the parent specification record).
4. Verify nothing significant was missed before proceeding.
