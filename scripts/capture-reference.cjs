const fs = require('node:fs');
const path = require('node:path');
const { createRequire } = require('node:module');
const rendererRequire = createRequire(require.resolve('widdershins'));
const { resolve } = rendererRequire('oas-resolver');

const id = process.argv[2];
if (!id || id === 'current' || !/^[a-z0-9][a-z0-9-]*$/.test(id)) {
  throw new Error('Usage: node scripts/capture-reference.cjs <reference-id>');
}
const input = path.resolve('build/docs/api.bundled.json');
// Example references can survive OpenAPI bundling; resolve them before relocation.
resolve(JSON.parse(fs.readFileSync(input, 'utf8')), input, {})
  .then(({ openapi }) => {
    fs.mkdirSync('docs/reference/snapshots', { recursive: true });
    fs.writeFileSync(`docs/reference/snapshots/${id}.json`, `${JSON.stringify(openapi, null, 2)}\n`, { flag: 'wx' });
  })
  .catch((error) => { console.error(error.message); process.exitCode = 1; });
