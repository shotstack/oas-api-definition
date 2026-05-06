#!/usr/bin/env node
/**
 * Splits a bundled OpenAPI spec into per-API JSON files by tag.
 *
 * Usage: node scripts/split-by-api.cjs <bundled.json> <outputDir>
 *
 * Produces api.edit.json, api.serve.json, api.ingest.json — each containing only
 * paths/operations tagged for that API, with the servers and tags arrays trimmed
 * accordingly. Components are kept whole (no unused-ref pruning) for safety.
 */

const fs = require('fs');
const path = require('path');

const [, , inputFile, outputDir] = process.argv;
if (!inputFile || !outputDir) {
  console.error('Usage: split-by-api.cjs <bundled.json> <outputDir>');
  process.exit(1);
}

const APIS = [
  { tag: 'Edit', file: 'api.edit.json', urlSegment: '/edit/' },
  { tag: 'Serve', file: 'api.serve.json', urlSegment: '/serve/' },
  { tag: 'Ingest', file: 'api.ingest.json', urlSegment: '/ingest/' },
];

const spec = JSON.parse(fs.readFileSync(inputFile, 'utf8'));

const isOperation = (value) =>
  value && typeof value === 'object' && Array.isArray(value.tags);

for (const { tag, file, urlSegment } of APIS) {
  const filtered = JSON.parse(JSON.stringify(spec));

  filtered.paths = Object.fromEntries(
    Object.entries(filtered.paths).flatMap(([pathKey, pathItem]) => {
      const kept = Object.fromEntries(
        Object.entries(pathItem).filter(
          ([, op]) => isOperation(op) && op.tags.includes(tag),
        ),
      );
      return Object.keys(kept).length > 0 ? [[pathKey, kept]] : [];
    }),
  );

  if (Array.isArray(filtered.servers)) {
    filtered.servers = filtered.servers.filter(
      (s) => typeof s.url === 'string' && s.url.includes(urlSegment),
    );
  }

  if (Array.isArray(filtered.tags)) {
    filtered.tags = filtered.tags.filter((t) => t.name === tag);
  }

  const outputPath = path.join(outputDir, file);
  fs.writeFileSync(outputPath, JSON.stringify(filtered, null, 2));
  console.log(`Wrote ${file} (${Object.keys(filtered.paths).length} paths)`);
}
