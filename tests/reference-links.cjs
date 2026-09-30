const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

// Reads the reference produced by `pnpm build:docs`. Every in-page link must land on an element.
const html = fs.readFileSync(path.resolve(__dirname, '..', 'build/docs/index.html'), 'utf8');
const ids = new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1]));
const targets = [...new Set([...html.matchAll(/href="#([^"]+)"/g)].map((match) => decodeURIComponent(match[1])))];
const dead = targets.filter((target) => !ids.has(target));

// A URL with a `{placeholder}` in it (a base URL, a path template) can't be opened, so it's shown as text.
const placeholders = [...new Set([...html.matchAll(/href="(https?:\/\/[^"]*(?:[{}]|%7B|%7D)[^"]*)"/gi)].map((match) => match[1]))];

assert.equal(dead.length, 0, `links to missing sections: ${dead.map((target) => `#${target}`).join(', ')}`);
assert.equal(placeholders.length, 0, `links to placeholder URLs: ${placeholders.join(', ')}`);
console.log(`Reference links: all ${targets.length} in-page targets exist, and no link is a placeholder URL`);
