const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');

const { versions } = JSON.parse(fs.readFileSync('docs/reference/versions.json', 'utf8'));
if (!Array.isArray(versions) || versions.filter((v) => v?.id === 'current').length !== 1) {
  throw new Error('The catalogue must contain exactly one current reference.');
}
const ids = new Set();
for (const version of versions) {
  if (!version || typeof version.id !== 'string' || !/^[a-z0-9][a-z0-9-]*$/.test(version.id) || typeof version.label !== 'string' || !version.label.trim()) {
    throw new Error('Each reference needs a valid id and label.');
  }
  if (ids.has(version.id)) throw new Error(`Duplicate reference id: ${version.id}`);
  ids.add(version.id);
  if (version.id === 'current') {
    if (version.spec !== null) throw new Error('The current reference must use the live schema.');
  } else {
    if (typeof version.spec !== 'string' || !/^[a-f0-9]{40}$/.test(version.sourceCommit)) {
      throw new Error('Archived references need a snapshot path and sourceCommit.');
    }
    const snapshots = fs.realpathSync('docs/reference/snapshots');
    const relative = path.relative(snapshots, fs.realpathSync(version.spec));
    if (relative.startsWith('..') || path.isAbsolute(relative) || !relative.endsWith('.json')) {
      throw new Error('Reference snapshots must be JSON files within docs/reference/snapshots.');
    }
    JSON.parse(fs.readFileSync(version.spec, 'utf8'));
  }
}

const directory = (v) => v.id === 'current' ? 'build/docs' : `build/docs/versions/${v.id}`;
const url = (v) => v.id === 'current' ? '/docs/api/' : `/docs/api/versions/${v.id}/`;
const escape = (value) => value.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const navigation = process.env.DOCS_VERSIONS_ENABLED === '1' && versions.length > 1;

// Shins writes shared scratch files, so references must render sequentially.
for (const version of versions.filter((v) => v.id !== 'current')) {
  execFileSync('bash', ['build-docs.sh', version.spec, directory(version)], { stdio: 'inherit' });
}

for (const version of versions) {
  if (!navigation && version.id === 'current') continue;
  const options = versions.map((v) => `<option value="${url(v)}"${v.id === version.id ? ' selected' : ''}>${escape(v.label)}</option>`).join('');
  const selector = navigation ? `<form onsubmit="location.assign(this.elements.version.value);return false">
    <label for="reference-version">Reference version</label>
    <div class="reference-controls"><select id="reference-version" name="version">${options}</select><button type="submit">View</button></div>
    </form>` : `<strong>${escape(version.label)}</strong>`;
  const panel = `<section class="reference-version" aria-label="Reference documentation">
    ${selector}
    <p>${version.id === 'current' ? 'You are viewing the current reference.' : 'You are viewing an archived reference.'} Selecting a reference does not change your API behaviour.</p>
    <nav aria-label="Reference links"><a href="/docs/api/">Current reference</a><a href="api.bundled.json">OpenAPI JSON</a><a href="api.edit.json">Edit</a><a href="api.serve.json">Serve</a><a href="api.ingest.json">Ingest</a></nav>
    </section>`;
  const style = `<style>
    .reference-version { margin-right:50%; padding:24px 28px; background:#f3f7f9; border-bottom:1px solid #dce6eb; color:#24343e; }
    .reference-version label { display:block; margin-bottom:8px; font-weight:600; }
    .reference-controls { display:flex; gap:8px; }
    .reference-controls select { min-width:0; flex:1; }
    .reference-controls select,.reference-controls button { font:inherit; padding:9px 12px; border:1px solid #71838d; border-radius:4px; background:white; color:#24343e; }
    .reference-controls button { cursor:pointer; }
    .reference-version p { font-size:14px; line-height:1.5; margin:12px 0; }
    .reference-version nav { display:flex; flex-wrap:wrap; gap:8px 16px; font-size:14px; }
    .reference-version a { color:#176d76; text-decoration:underline; }
    .reference-version :focus-visible { outline:3px solid #176d76; outline-offset:3px; }
    @media(max-width:700px) { .reference-version { margin-right:0; padding:64px 20px 24px; } }
    </style>`;
  const file = `${directory(version)}/index.html`;
  const html = fs.readFileSync(file, 'utf8');
  if (!html.includes('<div class="content">') || !html.includes('</head>')) {
    throw new Error(`Reference layout markers missing: ${file}`);
  }
  fs.writeFileSync(file, html.replace('</head>', `${style}</head>`).replace('<div class="content">', `<div class="content">${panel}`));
}
