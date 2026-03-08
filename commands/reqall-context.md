---
description: Prime the agent context by retrieving architectural and specific records from Reqall before diving into implementation
---

# Reqall Initial Context Priming

When the user runs `/reqall-context`, you must explicitly load relevant architecture, specification, and issue records from Reqall to prime your context before starting an implementation task.

1. **Identify Project**: Check the local git repository and directory to determine the Project name, then call `reqall:list_projects` to ensure it exists. If not, call `reqall:upsert_project`.
2. **Determine Query**: Ask the user what feature, bug, or context they are about to work on. If they already provided it in the prompt, skip asking.
3. **Semantic Search**: Use `reqall:search` to find relevant records matching that query.
4. **List Filters**: Complement the semantic search with a structured `reqall:list_records` call (filtering by `status: open`) to see what active tasks exist for this project.
5. **Graph Traversal**: Once you spot the relevant record(s), pick the most applicable one and call `reqall:impact` or `reqall:list_links` to see if there are associated specifications, parent records, or dependent blockers.
6. **Plan Construction**: Armed with the full architectural context from Reqall, begin drafting your `implementation_plan.md` or jump into `task.md`. Notify the user of what you found from the knowledgebase before proceeding.
