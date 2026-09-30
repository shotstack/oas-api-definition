const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

// Reads the package produced by `pnpm build`.
const dist = path.resolve(__dirname, '..', 'dist');
const api = require(path.join(dist, 'api.bundled.json'));
const z = require(path.join(dist, 'zod/zod.gen.cjs'));

// Serve's transfer operation has no generated request validator, so its body is checked against Transfer.
const bodySchema = (operationId) =>
  z[`${operationId}Request`]?.shape.body ?? { postServeAsset: z.transferSchema }[operationId];

// The bundler turns a second use of an example file into a `$ref` pointer, which the reference and the
// published types then show as-is.
const hasPointer = (value) => JSON.stringify(value ?? null).includes('"$ref"');

const failures = [];
let checked = 0;
for (const [route, operations] of Object.entries(api.paths)) {
  for (const [method, operation] of Object.entries(operations)) {
    const content = operation?.requestBody?.content?.['application/json'];
    if (!content) continue;
    const label = `${method.toUpperCase()} ${route}`;
    if (content.example === undefined) {
      failures.push(`${label}: no example`);
      continue;
    }
    if (hasPointer(content.example)) {
      failures.push(`${label}: example is a $ref pointer`);
      continue;
    }
    const schema = bodySchema(operation.operationId);
    assert.ok(schema, `${label}: no body schema for ${operation.operationId}`);
    checked++;
    const result = schema.safeParse(content.example);
    if (!result.success) {
      failures.push(`${label}: ${result.error.issues.map((i) => `${i.path.join('.')} ${i.message}`).join('; ')}`);
    }
  }
}

// openapi-typescript copies examples into JSDoc verbatim, pointers included.
if (/^\s*\*\s+"\$ref":/m.test(fs.readFileSync(path.join(dist, 'schema.d.ts'), 'utf8'))) {
  failures.push('schema.d.ts: an @example shows a $ref pointer');
}

assert.equal(failures.length, 0, `\n${failures.join('\n')}`);
console.log(`Request examples: ${checked} valid`);
