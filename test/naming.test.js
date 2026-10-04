import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { test } from 'node:test';
const root = fileURLToPath(new URL('../', import.meta.url));
const assets = ["_agents/system.md", "_agents/hooks/before_request.md", "_agents/hooks/before_tool_use.md", "_agents/hooks/after_plan.md", "_agents/hooks/after_task.md", "_agents/workflows/reqall-context.md", "_agents/workflows/reqall-sync.md"];
for (const asset of assets) test(`${asset}: offline project naming contract`, () => {
  assert.ok(existsSync(root + asset), `missing installed instruction ${asset}`);
  const text = readFileSync(root + asset, 'utf8');
  const chain = ['REQALL_PROJECT_NAME', 'Actual network Git', 'explicitly labelled', '.reqall.yml', 'package.json', 'Exact POSIX-style', '.machine/'];
  const policy = text.slice(text.indexOf('## Precedence'));
  let pos = -1;
  for (const token of chain) { const next = policy.indexOf(token); assert.ok(next > pos, `missing/out-of-order ${token}`); pos = next; }
  for (const token of ['host-supplied binding', 'SLEEP target', '.user', '64 KiB', 'final two path segments', 'file:', 'complete declared', '[package]', 'duplicate keys', 'symlinks', 'REQALL_MACHINE_NAME', 'OS account identity', 'not metadata to repair', 'https://github.com/ReqallSystem/plugins/blob/main/doc/PROJECT_NAMING.md']) assert.ok(text.includes(token), `missing ${token}`);
  assert.doesNotMatch(text, /Current directory name|use the folder name|an `org\/repo`\s+mention in the prompt|Never upsert from|Never treat `\$HOME`/);
});
test('npm package includes instructions and valid JSON configuration', () => {
  const packed = JSON.parse(execFileSync('npm', ['pack', '--dry-run', '--json', '--ignore-scripts'], {cwd: root, encoding: 'utf8'}))[0];
  const files = new Set(packed.files.map(f => f.path));
  for (const asset of [...assets, ...["gemini-extension.json"]]) assert.ok(files.has(asset), `package missing ${asset}`);
  for (const file of packed.files.filter(f => f.path.endsWith('.json'))) JSON.parse(readFileSync(root + file.path, 'utf8'));
});
