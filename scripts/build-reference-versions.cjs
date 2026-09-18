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

const chevron = '<svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="m4 6 4 4 4-4" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>';
for (const version of versions) {
  if (!navigation && version.id === 'current') continue;
  const options = versions.map((v) => `<a href="${url(v)}"${v.id === version.id ? ' aria-current="page"' : ''}>
    <span>${escape(v.label)}</span>${v.id === version.id ? '<span aria-hidden="true">✓</span>' : ''}</a>`).join('');
  const tools = navigation ? `<div class="reference-tools"><details name="reference-tools">
    <summary aria-label="Reference version: ${escape(version.label)}"><span>${escape(version.label)}</span>${chevron}</summary>
    <nav class="reference-menu" aria-label="Reference versions">${options}</nav>
    </details></div>` : '';
  const mobile = navigation ? `<header class="reference-mobile" aria-label="Reference tools">${tools}</header>` : '';
  const notice = version.id === 'current' ? '' : `<div class="reference-archive" role="note">
    <span>${navigation ? 'Archived reference' : escape(version.label)}</span><a href="/docs/api/">View current <span aria-hidden="true">→</span></a></div>`;
  const file = `${directory(version)}/index.html`;
  let html = fs.readFileSync(file, 'utf8');
  const logo = /(<a[^>]*><img[^>]*class="logo"[^>]*><\/a>)/;
  if (!logo.test(html) || !html.includes('<div class="content">') || !html.includes('</head>')) {
    throw new Error(`Reference layout markers missing: ${file}`);
  }
  html = html.replace('<body ', '<body data-reference-versioned ')
    .replace('id="nav-button"', 'id="nav-button" aria-label="Toggle navigation"')
    .replace('</head>', '<link rel="stylesheet" href="pub/css/reference.css"><script src="pub/js/reference.js" defer></script></head>')
    .replace(logo, (match) => `${match}${tools}`)
    .replace('<div class="content">', `<div class="content">${mobile}${notice}`);
  fs.writeFileSync(file, html);
  fs.copyFileSync('assets/reference.css', `${directory(version)}/pub/css/reference.css`);
  fs.copyFileSync('assets/reference.js', `${directory(version)}/pub/js/reference.js`);
}
