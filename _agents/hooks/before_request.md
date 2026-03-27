# Reqall Target: hook(before_request)

When resolving a new user request, you MUST automatically initialize context:
1. Identify the project name (from `REQALL_PROJECT_NAME`, git remote origin, or cwd). E.g., if git remote is `ReqallSystem/gemini-plugin`, use that. If not, use the folder name.
2. Call `reqall:upsert_project` with the detected `name` to ensure it exists.
3. Call `reqall:search` using keywords from the user's prompt to find relevant existing context (specs, open issues, architecture decisions).
4. List open records for the project context to see what track items are currently active.

Do NOT wait for the user to ask you to do this. Review the returned context before formulating a response or starting work.
