# Reference website versions

`versions.json` controls the public reference website. The `current` entry uses
the live schema at `/docs/api/`. Package exports, SDK generation and the existing
public JSON URLs continue to use the live schema.

Run `pnpm build:docs` with the repository's Node version and installed Shins
runtime dependencies. `DOCS_VERSIONS_ENABLED=1 pnpm build:docs` exposes version
navigation when the catalogue contains more than one entry. Archived pages are
built in both modes so disabling navigation preserves their URLs.

## Capture a reference

Before changing a supported API contract, build the agreed source revision with
`pnpm build:docs`, then run `node scripts/capture-reference.cjs <reference-id>`.
This writes `docs/reference/snapshots/<reference-id>.json` and refuses to overwrite
an existing snapshot. It resolves example file references that can survive the
normal OpenAPI bundle, so the archive does not depend on live source files.
Add an entry with:

- `id`: a unique lowercase name containing letters, digits or hyphens.
- `label`: the reference version customers should see.
- `spec`: the snapshot's repository-relative path.
- `sourceCommit`: the full 40-character source commit SHA.

Use an agreed contract version for the label; capturing documentation does not
create a runtime API version. Do not edit the bundled snapshot's `info.version`
to control the website label. Review the snapshot and catalogue together.

Each archive is rendered at `/docs/api/versions/<reference-id>/`, including its
own assets and bundled, Edit, Serve and Ingest JSON downloads. Rendering is
sequential because Shins shares scratch files. A clean build includes every
catalogued reference before deployment.

Keep references available while their contracts are supported. Compatible
additions or corrections may require an intentional snapshot update using a
schema that still describes that contract. Removing a catalogue entry removes
its output on the next deployment; confirm the contract has no remaining users
before retiring its reference.

Selecting a reference changes documentation only, not an account's API behaviour.
The initial catalogue contains only the current reference. Tests use temporary
sample versions and do not publish a fictional API version.
