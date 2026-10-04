import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { test } from 'node:test';

const root = fileURLToPath(new URL('../', import.meta.url));
const assets = [
  '_agents/system.md',
  '_agents/hooks/before_request.md',
  '_agents/hooks/before_tool_use.md',
  '_agents/hooks/after_plan.md',
  '_agents/hooks/after_task.md',
  '_agents/workflows/reqall-context.md',
  '_agents/workflows/reqall-sync.md',
];

test('extension loads all packaged instruction templates through documented context imports', () => {
  const manifest = JSON.parse(readFileSync(root + 'gemini-extension.json', 'utf8'));
  assert.equal(manifest.contextFileName, 'GEMINI.md', 'extension must register its instruction entry point');
  const context = readFileSync(root + manifest.contextFileName, 'utf8');
  const imports = [...context.matchAll(/^@\.\/(.+)$/gm)].map(match => match[1]);
  assert.deepEqual(imports, assets);
  const packed = JSON.parse(execFileSync('npm', ['pack', '--dry-run', '--json', '--ignore-scripts'], { cwd: root, encoding: 'utf8' }))[0];
  const files = new Set(packed.files.map(file => file.path));
  for (const file of [manifest.contextFileName, ...imports]) {
    assert.ok(files.has(file), `package missing loaded context ${file}`);
  }
  for (const file of imports) {
    assert.match(readFileSync(root + file, 'utf8'), /## Project naming policy/);
  }
});

test('every variable the MCP server reads is a declared extension setting', () => {
  // Gemini CLI passes extensions only safe variables plus manifest settings[].envVar.
  const manifest = JSON.parse(readFileSync(root + 'gemini-extension.json', 'utf8'));
  const declared = new Set((manifest.settings ?? []).map(setting => setting.envVar));
  const used = [...JSON.stringify(manifest.mcpServers).matchAll(/\$\{([A-Z_][A-Z0-9_]*)/g)].map(match => match[1]);
  assert.ok(used.length > 0);
  for (const name of used) assert.ok(declared.has(name), `undeclared extension setting ${name}`);
  assert.equal(manifest.settings.find(setting => setting.envVar === 'REQALL_API_KEY').sensitive, true);
});

test('context maps reqall:<tool> names to Gemini MCP tool names', () => {
  assert.match(readFileSync(root + 'GEMINI.md', 'utf8'), /mcp_reqall_search/);
});

test('README documents official installation and verification without phantom commands or hooks', () => {
  const readme = readFileSync(root + 'README.md', 'utf8');
  assert.match(readme, /gemini extensions install \/absolute\/path\/to\/gemini-plugin/);
  assert.match(readme, /gemini extensions list/);
  assert.match(readme, /\/memory show/);
  assert.match(readme, /contextFileName/);
  assert.match(readme, /not registered slash commands/);
  assert.match(readme, /not registered executable Gemini CLI hooks/);
  assert.doesNotMatch(readme, /~\/\.gemini\/plugins|Core Workflows \(Slash Commands\)|configures MCP transport only/);
});
