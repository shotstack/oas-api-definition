const fs = require('node:fs');

// Widdershins shows only a request body's `examples`, and ignores the singular `example` the spec uses (which
// openapi-typescript needs for its @example docs). The copy widdershins reads gets each `example` as `examples`.
const [source, target] = process.argv.slice(2);
const api = JSON.parse(fs.readFileSync(source, 'utf8'));
for (const operations of Object.values(api.paths)) {
  for (const operation of Object.values(operations)) {
    const content = operation?.requestBody?.content?.['application/json'];
    if (content?.example === undefined || content.examples) continue;
    content.examples = { default: { value: content.example } };
    delete content.example;
  }
}
fs.writeFileSync(target, JSON.stringify(api));
