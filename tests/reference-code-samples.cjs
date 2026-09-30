const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

// Reads the reference produced by `pnpm build:docs`.
const html = fs.readFileSync(path.resolve(__dirname, '..', 'build/docs/index.html'), 'utf8');

const samples = (lang) => html.split('<h2 id="').slice(1).flatMap((section) => {
  const id = section.slice(0, section.indexOf('"'));
  const pattern = new RegExp(`<pre class="highlight tab tab-${lang}"><code>([\\s\\S]*?)</code></pre>`, 'g');
  return [...section.matchAll(pattern)].map((match) => ({ id, code: match[1] }));
});

const php = samples('php');
assert.ok(php.length > 0, 'no PHP samples in build/docs/index.html');
const truncated = php.filter(({ code }) => !code.startsWith('<span class="hljs-meta">&lt;?php</span>'));
assert.equal(truncated.length, 0,
  `PHP samples missing their opening lines: ${truncated.map(({ id }) => id).join(', ')}`);
console.log(`PHP samples: ${php.length} complete`);

// Widdershins marks objects it reaches through a $ref; the mark must never reach the page.
const annotated = html.split('<h2 id="').slice(1).filter((section) => section.includes('x-widdershins-'))
  .map((section) => section.slice(0, section.indexOf('"')));
assert.equal(annotated.length, 0, `widdershins annotations shown in: ${annotated.join(', ')}`);

// Each request body panel shows the spec's example for that body.
const api = require(path.resolve(__dirname, '..', 'build/docs/api.bundled.json'));
const decode = (code) => code.replace(/<[^>]+>/g, '').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
  .replace(/&quot;/g, '"').replace(/&#x27;|&#39;/g, "'").replace(/&amp;/g, '&');
const panels = html.split('<h2 id="').slice(1).flatMap((section) => {
  const [, method, route] = section.match(/<p><code>(GET|POST|PUT|PATCH|DELETE) (\/[^<]*)<\/code><\/p>/) ?? [];
  const operation = api.paths[route]?.[method?.toLowerCase()];
  const example = operation?.requestBody?.content?.['application/json']?.example;
  const panel = section.split('Body parameter')[1]?.match(/<pre class="highlight tab tab-json"><code>([\s\S]*?)<\/code><\/pre>/);
  return example === undefined ? [] : [{ operationId: operation.operationId, example, shown: panel && decode(panel[1]) }];
});
const stale = panels.filter(({ example, shown }) => {
  try {
    assert.deepEqual(JSON.parse(shown), example);
    return false;
  } catch {
    return true;
  }
});
assert.ok(panels.length > 0, 'no request body panels on the page');
assert.equal(stale.length, 0, `body panels not showing the spec's example: ${stale.map(({ operationId }) => operationId).join(', ')}`);
console.log(`Request body panels: ${panels.length} show their example`);
