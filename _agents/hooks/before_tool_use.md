# Reqall Target: hook(before_tool_use)

Before you execute any editing tools (`write_to_file`, `replace_file_content`, `multi_replace_file_content`, or running bash modifications):
1. Think if the target file or component was covered by any known context, specs, or issues in Reqall.
2. If you are modifying a major component and haven't checked its specifications in Reqall, call `reqall:search` on the file path or component name to check for architecture decisions or constraints. If results are found, consider them before proceeding.
