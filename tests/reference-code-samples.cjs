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
