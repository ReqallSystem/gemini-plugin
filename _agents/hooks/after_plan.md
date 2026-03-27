# Reqall Target: hook(after_plan)

When an `implementation_plan.md` artifact is approved by the user, you MUST explicitly save the plan as a specification record in Reqall.
1. Call `reqall:upsert_project` to ensure the project exists.
2. Call `reqall:upsert_record` with `kind` set to `spec` or `arch`, `status` set to `open`. Use the plan's title as the record title, and the full plan content as the body.
