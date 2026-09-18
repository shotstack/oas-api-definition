const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const root = path.resolve(__dirname, '..');
const workspace = fs.mkdtempSync(path.join(os.tmpdir(), 'reference versions-'));
const write = (file, data) => fs.writeFileSync(path.join(workspace, file), data);
const read = (file) => fs.readFileSync(path.join(workspace, file), 'utf8');
const run = (command, args, enabled = '0') => spawnSync(command, args, {
  cwd: workspace, encoding: 'utf8', maxBuffer: 10 * 1024 * 1024,
  env: { ...process.env, DOCS_VERSIONS_ENABLED: enabled },
});
const succeeds = (result) => assert.equal(result.status, 0, result.stdout + result.stderr);
const spec = (name) => ({
  openapi: '3.0.3', info: { title: 'Reference fixture', version: 'v1' },
  servers: [{ url: 'https://example.com/edit/v1' }],
  tags: [{ name: 'Edit' }],
  paths: { [`/${name}`]: { get: {
    tags: ['Edit'], operationId: name, summary: `${name} operation`,
    responses: { 200: { description: 'OK' } },
  } } },
});
const versions = [
  { id: 'current', label: 'Current reference', spec: null },
  { id: 'earlier', label: 'Earlier <reference>', spec: 'docs/reference/snapshots/earlier.json', sourceCommit: 'a'.repeat(40) },
];
const catalogue = (entries) => write('docs/reference/versions.json', JSON.stringify({ versions: entries }));

try {
  for (const file of ['build-docs.sh', 'scripts', 'assets', '.shins']) {
    fs.cpSync(path.join(root, file), path.join(workspace, file), {
      recursive: true, filter: (source) => path.basename(source) !== 'node_modules',
    });
  }
  fs.symlinkSync(path.join(root, 'node_modules'), path.join(workspace, 'node_modules'));
  fs.symlinkSync(path.join(root, '.shins/node_modules'), path.join(workspace, '.shins/node_modules'));
  fs.mkdirSync(path.join(workspace, 'docs/reference/snapshots'), { recursive: true });
  write('.tags', '');
  write('api.oas3.yaml', JSON.stringify(spec('current')));
  catalogue(versions);
  fs.mkdirSync(path.join(workspace, 'build/docs'), { recursive: true });
  const archived = spec('archived');
  archived.components = { schemas: {
    Message: { type: 'object', properties: { message: { type: 'string' } } },
    Example: { $ref: '#/components/schemas/Message', example: { $ref: '../../example.json' } },
  } };
  write('build/docs/api.bundled.json', JSON.stringify(archived));
  write('example.json', '{"message":"Archived example"}');
  succeeds(run(process.execPath, ['scripts/capture-reference.cjs', 'earlier']));
  assert.doesNotMatch(read('docs/reference/snapshots/earlier.json'), /\.\.\/\.\.\/example.json/);
  assert.match(read('docs/reference/snapshots/earlier.json'), /Archived example/);
  fs.unlinkSync(path.join(workspace, 'example.json'));
  write('build/docs/stale.txt', 'obsolete');

  succeeds(run('bash', ['build-docs.sh']));
  assert.ok(fs.existsSync(path.join(workspace, 'build/docs/versions/earlier/index.html')), 'build every archive with navigation disabled');
  assert.ok(!fs.existsSync(path.join(workspace, 'build/docs/stale.txt')), 'remove stale build output');
  assert.doesNotMatch(read('build/docs/index.html'), /aria-label="Reference versions"/);
  const currentJson = read('build/docs/api.bundled.json');

  succeeds(run('bash', ['build-docs.sh'], '1'));
  assert.equal(read('build/docs/api.bundled.json'), currentJson, 'navigation must not alter schemas');
  for (const [directory, operation, selected] of [
    ['build/docs', 'current', '/docs/api/'],
    ['build/docs/versions/earlier', 'archived', '/docs/api/versions/earlier/'],
  ]) {
    const html = read(`${directory}/index.html`);
    assert.ok(html.includes(`href="${selected}" aria-current="page"`));
    assert.match(html, /aria-label="Reference versions"/);
    assert.doesNotMatch(html, /<form onsubmit=/);
    assert.match(html, /Earlier &lt;reference&gt;/);
    assert.ok(html.includes(`${operation} operation`));
    assert.ok(!html.includes(`${operation === 'current' ? 'archived' : 'current'} operation`));
    const bundled = JSON.parse(read(`${directory}/api.bundled.json`));
    assert.deepEqual(Object.keys(bundled.paths), [`/${operation}`]);
    assert.deepEqual(Object.keys(JSON.parse(read(`${directory}/api.edit.json`)).paths), [`/${operation}`]);
    for (const file of ['api.serve.json', 'api.ingest.json', 'pub/css/screen.css', 'pub/js/shins.js', 'pub/css/reference.css', 'pub/js/reference.js', 'source/images/custom_logo.svg']) {
      assert.ok(fs.existsSync(path.join(workspace, directory, file)), `${directory}/${file}`);
    }
    assert.doesNotMatch(html, /href="api\.(bundled|edit|serve|ingest)\.json"/);
  }

  for (const [entries, message] of [
    [[...versions, versions[1]], /duplicate/i],
    [[versions[1]], /current/i],
    [[versions[0], { ...versions[1], id: '../escape' }], /id/i],
    [[versions[0], { ...versions[1], spec: 'api.oas3.yaml' }], /snapshot/i],
    [[versions[0], { ...versions[1], spec: 'docs/reference/snapshots/missing.json' }], /ENOENT|missing/i],
  ]) {
    catalogue(entries);
    const result = run(process.execPath, ['scripts/build-reference-versions.cjs']);
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, message);
  }
  catalogue([versions[0]]);
  succeeds(run('bash', ['build-docs.sh'], '1'));
  assert.doesNotMatch(read('build/docs/index.html'), /aria-label="Reference versions"/);
  console.log('Reference version checks passed (rendering, downloads, flags, validation, assets).');
} finally {
  fs.rmSync(workspace, { recursive: true, force: true });
}
