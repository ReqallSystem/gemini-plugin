---
description: Prime the agent context by retrieving architectural and specific records from Reqall before diving into implementation
---

# Reqall Initial Context Priming

When the user runs `/reqall-context`, you must explicitly load relevant architecture, specification, and issue records from Reqall to prime your context before starting an implementation task.

1. **Identify Project**: Resolve or reuse the project using the Project naming policy below, then call `reqall:list_projects` to ensure it exists. If not, call `reqall:upsert_project`.
2. **Determine Query**: Ask the user what feature, bug, or context they are about to work on. If they already provided it in the prompt, skip asking.
3. **Semantic Search**: Use `reqall:search` to find relevant records matching that query.
4. **List Filters**: Complement the semantic search with a structured `reqall:list_records` call (filtering by `status: open`) to see what active tasks exist for this project.
5. **Graph Traversal**: Once you spot the relevant record(s), pick the most applicable one and call `reqall:impact` or `reqall:list_links` to see if there are associated specifications, parent records, or dependent blockers.
6. **Plan Construction**: Armed with the full architectural context from Reqall, begin drafting your `implementation_plan.md` or jump into `task.md`. Notify the user of what you found from the knowledgebase before proceeding.

## Project naming policy

Use a host-supplied binding as authoritative: reuse its exact project name through recall, work, persistence, and verification. Do not independently rediscover it in later steps. Preserve deliberate operation arguments (including a manual SLEEP target) and supported session selections; these instructions do not install automatic hooks or invent host settings. If no binding exists, discover locally using the policy below. If required local information is unavailable, ask for an explicit project instead of guessing; do not write to an invented project.

Canonical contract: https://github.com/ReqallSystem/plugins/blob/main/doc/PROJECT_NAMING.md
The following embedded policy works offline.

Reqall project names must agree across clients. This is client-side discovery, not
server-side filesystem inspection. Do not migrate or rename existing records as a
side effect of discovery. Reuse the exact project bound by the host's context hook
through recall, work, persistence, and verification.

## Precedence

Preserve deliberate operation arguments (for example a SLEEP target) and supported
session selections. For automatic discovery use the first available source:

1. Nonempty, trimmed `REQALL_PROJECT_NAME`, or an existing host-scoped project
   setting. Environment wins over settings. Do not invent a new settings mechanism
   in hosts that have none.
2. Actual network Git `origin`, normalized as below.
3. An explicitly labelled `project_name` or `project` selection in the user's
   prompt, or the host's retained session selection. Labels accept `:` or `=` and
   unquoted, single-quoted, double-quoted, or backtick-quoted values. Strip sentence
   punctuation only from unquoted values. Incidental paths, URLs, quoted examples
   in synthetic notifications, and arbitrary slash tokens are not a selection.
4. Nearest valid ancestor `.reqall.yml` or `.reqall.yaml` identity.
5. Nearest valid package identity: `package.json`, `go.mod`, then `Cargo.toml` at
   each directory, before moving to its parent.
6. Exact POSIX-style cwd-relative path within a known workspace root.
7. Reserved `.machine/<short-lower-hostname>/<os-user>`.

Use OS account identity, not `USER`/`USERNAME` environment hints. A nonempty
`REQALL_MACHINE_NAME` replaces the whole hostname segment; sanitize and lowercase
it, but retain dots in this deliberate override. Account-wide preferences may be
routed deliberately to `.user`. Do not use an unconstrained cwd basename.

Explicit names are identifiers, not metadata to repair: preserve them apart from
outer whitespace. The automatic metadata/path checks below do not silently rewrite
manually selected historical names.

## Git compatibility

Accept network HTTP(S), SSH, and Git URLs and SCP-style remotes. Remove trailing
slashes and the terminal `.git` suffix. Retain the final two path segments, e.g.
`https://github.com/acme/widgets.git` becomes `acme/widgets`.

This intentionally retains the existing server/client convention for nested Git
namespaces: `https://gitlab.com/group/sub/repo.git` becomes `sub/repo`. Keeping the
whole namespace requires a separate identity/migration decision; this alignment
must not silently fork existing memory. Local POSIX/Windows paths and `file:`
remotes are not portable naming sources and fall through to local metadata.

## Portable metadata

Read regular, UTF-8 files of at most 64 KiB. Unreadable, oversized, malformed,
unsupported, and non-string values are skipped without crashing. Search nearest
valid ancestors, stopping at a known containing workspace root (inclusive), or at
the filesystem root when no containing workspace boundary is known.

Automatic names use ASCII letters/digits, `_`, `-`, and `.` within slash-separated
segments. Reject absolute POSIX, drive, UNC, backslash, tilde, empty, `.` and `..`
segments before normalization. Never strip a leading slash to make a path appear
portable. Explicit metadata named `src` or `work` is valid; a directory-noise
blacklist must not override intentional metadata.

### Reqall YAML

Use a simple top-level string scalar:

```yaml
project: acme/notes
```

`name` is accepted as an alias; a valid `project` takes precedence. At a directory,
`.reqall.yml` takes precedence over `.reqall.yaml`. Matching single/double quotes
and trailing comments are supported; plain boolean/null/numeric values are not
string identities. Nested mappings, aliases, multiline scalars, and other complex
YAML are not supported. Ambiguous duplicate keys and malformed quoting are rejected.

### Package declarations

- `package.json`: a string `name`. Only a valid npm scoped identity removes one
  leading `@`: `@acme/widgets` becomes `acme/widgets`. Numbers are not coerced.
- `go.mod`: the complete declared `module`, preserving domain, nested path, and
  major-version suffix, e.g. `example.com/acme/widgets/v2`. Comments before the
  declaration are allowed. An empty file is not an error.
- `Cargo.toml`: a simple quoted `name` inside `[package]`, never a `[[bin]]` or
  dependency name. This is a constrained declaration reader, not a full TOML parser.

## Workspace-relative fallback

`REQALL_WORKSPACE_ROOT` supplies the root; relative values are resolved from cwd,
and `~/` uses the current home. Otherwise use the nearest ancestor regular
`.reqall-workspace` marker file. The setting is read from the process environment
when no explicit environment mapping is supplied.

Resolve filesystem paths before containment checks so symlinks cannot escape the
workspace. An invalid or non-containing explicit root does not silently select a
marker instead. Cwd equal to the root produces no relative identity. Preserve all
relative segments, including `src` or `work`; dropping them can merge unrelated
projects. A plain folder without a known root still falls back to machine memory.
