const assert = require('node:assert/strict');
const fs = require('node:fs');
const http = require('node:http');
const net = require('node:net');
const os = require('node:os');
const path = require('node:path');
const { execFile } = require('node:child_process');
const { promisify } = require('node:util');
const widdershins = require('widdershins');

// Runs every code sample in the reference built by `pnpm build:docs` against a local server
// and checks each one sends the request it documents.
const exec = promisify(execFile);
const root = path.resolve(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'build/docs/index.html'), 'utf8');
const api = require(path.join(root, 'build/docs/api.bundled.json'));
const templates = path.join(root, 'templates/code-samples');
const renderId = 'd2b46ed6-998a-4d6b-9d91-b8cf0193a655';
const languageTabs = ['shell', 'http', 'javascript--nodejs', 'php', 'ruby', 'python', 'java', 'go'];

const decode = (code) => code.replace(/<[^>]+>/g, '').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
  .replace(/&quot;/g, '"').replace(/&#x27;|&#39;/g, "'").replace(/&amp;/g, '&');

const samples = (lang) => html.split('<h2 id="').slice(1).flatMap((section) => {
  const id = section.slice(0, section.indexOf('"'));
  const pattern = new RegExp(`<pre class="highlight tab tab-${lang}"><code>([\\s\\S]*?)</code></pre>`, 'g');
  return [...section.matchAll(pattern)].map((match) => ({ id, section, code: match[1] }));
});

// Placeholders a reader fills in: the environment, path ids, and the key the HTTP sample can't read from env.
const fill = (url, origin) => url.replace('https://api.shotstack.io', origin)
  .replace(/\{version\}/g, 'stage').replace(/\{[^}]+\}/g, renderId);

const expectation = ({ id, section }) => {
  const [, method, route] = section.match(/<p><code>(GET|POST|PUT|PATCH|DELETE) (\/[^<]*)<\/code><\/p>/) ?? [];
  const [, base] = section.match(/Base URL:<\/strong> <a href="#">([^<]+)<\/a>/) ?? [];
  assert.ok(method && base, `${id}: no method, path or base URL in the rendered section`);
  const operation = api.paths[route]?.[method.toLowerCase()];
  // A sample that sends an optional header sends its placeholder value, which the API then acts on.
  const optionalHeaders = (operation?.parameters ?? []).filter((p) => p.in === 'header' && !p.required).map((p) => p.name.toLowerCase());
  return { method, path: fill(base.replace(/^https:\/\/[^/]+/, '') + route, ''), body: operation?.requestBody?.content?.['application/json']?.example, operationId: operation?.operationId, optionalHeaders };
};

// Every sample reads the key from SHOTSTACK_API_KEY, so a per-run key ties each request to its sample.
const requests = new Map();
const server = http.createServer((req, res) => {
  const chunks = [];
  req.on('data', (chunk) => chunks.push(chunk)).on('end', () => {
    const key = req.headers['x-api-key'] ?? '';
    requests.set(key, [...(requests.get(key) ?? []), { method: req.method, path: req.url, headers: req.headers, body: Buffer.concat(chunks).toString('utf8') }]);
    res.writeHead(200, { 'Content-Type': 'application/json' }).end('{"success":true}');
  });
});

const phpDir = process.env.CODE_SAMPLES_PHP_DIR;
const runners = {
  shell: { check: ['bash', ['--version']], file: 'sample.sh', run: (file) => ['bash', [file]] },
  'javascript--nodejs': { check: ['node', ['--version']], file: 'sample.js', run: (file) => ['node', [file]] },
  python: { check: ['python3', ['-c', 'import requests']], file: 'sample.py', run: (file) => ['python3', [file]] },
  php: { check: ['php', ['-r', `require '${phpDir}/vendor/autoload.php';`]], file: 'sample.php', run: (file) => ['php', [file]] },
  ruby: { check: ['ruby', ['--version']], file: 'sample.rb', run: (file) => ['ruby', [file]] },
  java: { check: ['java', ['--version']], file: 'Main.java', run: (file) => ['java', [file]] },
  go: { check: ['go', ['version']], file: 'sample.go', run: (file) => ['go', ['run', file]] },
};

const available = async (lang) => {
  if (lang === 'http') return true;
  if (lang === 'php' && !phpDir) return false;
  const [bin, args] = runners[lang].check;
  return exec(bin, args).then(() => true, () => false);
};

// Raw HTTP samples are sent over a socket exactly as written, with the request line pointed at the mock.
const sendRaw = (code, port) => new Promise((done, fail) => {
  const [head, ...rest] = code.split(/\n\n/);
  const lines = head.split('\n').map((line, index) => (index === 0 ? fill(line, '') : line));
  const socket = net.connect(port, '127.0.0.1', () => socket.end(`${lines.join('\r\n')}\r\n\r\n${rest.join('\n\n')}`));
  socket.on('data', () => socket.destroy()).on('close', done).on('error', fail);
});

let counter = 0;
const runSample = async (lang, code, body, port) => {
  const key = `sample-key-${++counter}`;
  const origin = `http://127.0.0.1:${port}`;
  const source = code.replace(/https:\/\/api\.shotstack\.io[^\s'"`)]*/g, (url) => fill(url, origin))
    .replace(/YOUR_API_KEY/g, key);
  if (lang === 'http') {
    await sendRaw(source, port);
  } else {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'code-sample-'));
    const bodyFile = source.match(/-d @([\w.-]+)/)?.[1];
    if (bodyFile) fs.writeFileSync(path.join(dir, bodyFile), JSON.stringify(body, null, 2));
    if (lang === 'php') fs.symlinkSync(path.join(phpDir, 'vendor'), path.join(dir, 'vendor'));
    fs.writeFileSync(path.join(dir, runners[lang].file), source);
    const [bin, args] = runners[lang].run(runners[lang].file);
    try {
      await exec(bin, args, { cwd: dir, timeout: 120000, env: { ...process.env, SHOTSTACK_API_KEY: key } });
    } catch (error) {
      return { error: (error.stderr || error.stdout || error.message).trim().split('\n').slice(-3).join(' | ') };
    } finally {
      fs.rmSync(dir, { recursive: true, force: true });
    }
  }
  return { received: requests.get(key) ?? [] };
};

const verify = (label, outcome, expected) => {
  if (outcome.error) return `${label}: failed to run: ${outcome.error}`;
  const [request, ...extra] = outcome.received;
  if (!request) return `${label}: no request carried the API key`;
  if (extra.length) return `${label}: sent ${outcome.received.length} requests`;
  if (request.method !== expected.method || request.path !== expected.path) {
    return `${label}: sent ${request.method} ${request.path}, expected ${expected.method} ${expected.path}`;
  }
  const optional = (expected.optionalHeaders ?? []).filter((name) => name in request.headers);
  if (optional.length) return `${label}: sent optional header ${optional.join(', ')}`;
  if (!expected.body) return request.body ? `${label}: sent a body to an operation that takes none` : null;
  try {
    assert.deepEqual(JSON.parse(request.body), expected.body);
    return null;
  } catch {
    return `${label}: body differs from the documented example: ${request.body.slice(0, 120) || '(empty)'}`;
  }
};

// Characters that end or interpolate a string literal in at least one of the languages.
const tricky = {
  text: 'it\'s "quoted" \\ back\\slash $HOME #{x} `tick` """ end',
  empty: {}, list: [], nested: { a: [{ b: {} }] }, n: 1.5, flag: true, none: null, unicode: 'é ✓',
};
const syntheticSamples = async () => {
  const spec = {
    openapi: '3.0.3', info: { title: 'Samples', version: 'v1' },
    servers: [{ url: 'https://api.shotstack.io/edit/{version}', variables: { version: { default: 'v1' } } }],
    security: [{ DeveloperKey: [] }],
    components: { securitySchemes: { DeveloperKey: { type: 'apiKey', in: 'header', name: 'x-api-key' } } },
    paths: { '/render': { post: {
      operationId: 'postRender',
      requestBody: { content: { 'application/json': { schema: { type: 'object' }, examples: { tricky: { value: tricky } } } } },
      responses: { 201: { description: 'Created', content: { 'application/json': { schema: { type: 'object' } } } } },
    } } },
  };
  const markdown = await widdershins.convert(spec, {
    codeSamples: true, sample: true, user_templates: templates,
    language_tabs: languageTabs.map((lang) => ({ [lang]: lang })),
  });
  return Object.fromEntries(languageTabs.map((lang) => [lang,
    markdown.match(new RegExp('```' + lang.replace(/-/g, '\\-') + '\\n([\\s\\S]*?)\\n```'))?.[1]]));
};

const limit = async (items, size, task) => {
  const results = [];
  for (let i = 0; i < items.length; i += size) results.push(...await Promise.all(items.slice(i, i + size).map(task)));
  return results;
};

(async () => {
  const failures = [];

  const php = samples('php');
  assert.ok(php.length > 0, 'no PHP samples in build/docs/index.html');
  php.filter(({ code }) => !code.startsWith('<span class="hljs-meta">&lt;?php</span>'))
    .forEach(({ id }) => failures.push(`${id} php: sample is missing its opening lines`));

  // Widdershins marks objects it reaches through a $ref; the mark must never reach the page.
  html.split('<h2 id="').slice(1).filter((section) => section.includes('x-widdershins-'))
    .forEach((section) => failures.push(`${section.slice(0, section.indexOf('"'))}: shows a widdershins annotation`));

  // Each request body panel shows the spec's example for that body.
  let shown = 0;
  for (const section of html.split('<h2 id="').slice(1)) {
    const [, method, route] = section.match(/<p><code>(GET|POST|PUT|PATCH|DELETE) (\/[^<]*)<\/code><\/p>/) ?? [];
    const example = api.paths[route]?.[method?.toLowerCase()]?.requestBody?.content?.['application/json']?.example;
    if (example === undefined) continue;
    shown++;
    const panel = section.split('Body parameter')[1]?.match(/<pre class="highlight tab tab-json"><code>([\s\S]*?)<\/code><\/pre>/);
    try {
      assert.deepEqual(JSON.parse(decode(panel[1])), example);
    } catch {
      failures.push(`${section.slice(0, section.indexOf('"'))}: body panel is not the request example`);
    }
  }
  if (!shown) failures.push('no request body panels on the page');

  await new Promise((ready) => server.listen(0, '127.0.0.1', ready));
  const { port } = server.address();

  const skipped = [];
  const langs = [];
  for (const lang of languageTabs) (await available(lang) ? langs : skipped).push(lang);
  if (skipped.length && process.env.CI) failures.push(`runtime missing in CI: ${skipped.join(', ')}`);

  const jobs = langs.flatMap((lang) => samples(lang).map((sample) => ({ lang, sample, expected: expectation(sample) })));
  const results = await limit(jobs, 6, async ({ lang, sample, expected }) =>
    verify(`${sample.id} ${lang}`, await runSample(lang, decode(sample.code), expected.body, port), expected));

  const synthetic = await syntheticSamples();
  const expected = { method: 'POST', path: '/edit/stage/render', body: tricky };
  const trickyResults = await limit(langs, 6, async (lang) => (synthetic[lang]
    ? verify(`quoting ${lang}`, await runSample(lang, synthetic[lang], tricky, port), expected)
    : `quoting ${lang}: no sample generated`));

  server.close();
  failures.push(...results.filter(Boolean), ...trickyResults.filter(Boolean));
  const run = jobs.length + langs.length;
  console.log(`Code samples: ${run - failures.length} of ${run} ran correctly (${langs.join(', ')})`);
  if (skipped.length) console.log(`Skipped, runtime not installed: ${skipped.join(', ')}`);
  assert.equal(failures.length, 0, `\n${failures.join('\n')}`);
})().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
