const { describe, it } = require("node:test");
const assert = require("node:assert");
const fs = require("node:fs");
const path = require("node:path");

const distDir = path.resolve(__dirname, "..", "dist");

let passed = 0;
let failed = 0;

function check(label, fn) {
  try {
    fn();
    passed++;
    console.log(`  PASS  ${label}`);
  } catch (err) {
    failed++;
    console.log(`  FAIL  ${label}`);
    console.log(`        ${err.message}`);
  }
}

function fileExists(relativePath) {
  const fullPath = path.join(distDir, relativePath);
  check(`dist/${relativePath} exists`, () => {
    assert.ok(fs.existsSync(fullPath), `Missing: ${fullPath}`);
  });
}

async function run() {
  console.log("\n--- File existence checks ---\n");

  fileExists("index.js");
  fileExists("index.d.ts");
  fileExists("schema.d.ts");
  fileExists("zod/zod.gen.js");
  fileExists("zod/zod.gen.cjs");
  fileExists("zod/zod.gen.d.ts");
  fileExists("json-schema/index.js");
  fileExists("json-schema/index.cjs");

  console.log("\n--- CJS require checks ---\n");

  check("CJS zod module loads", () => {
    const mod = require(path.join(distDir, "zod/zod.gen.cjs"));
    assert.ok(mod, "Module is falsy");
  });

  check("CJS zod exports richTextAssetSchema", () => {
    const mod = require(path.join(distDir, "zod/zod.gen.cjs"));
    assert.ok(typeof mod.richTextAssetSchema === "object", "richTextAssetSchema not found");
  });

  check("CJS zod exports editSchema", () => {
    const mod = require(path.join(distDir, "zod/zod.gen.cjs"));
    assert.ok(typeof mod.editSchema === "object", "editSchema not found");
  });

  check("CJS zod exports svgAssetSchema", () => {
    const mod = require(path.join(distDir, "zod/zod.gen.cjs"));
    assert.ok(typeof mod.svgAssetSchema === "object", "svgAssetSchema not found");
  });

  check("CJS zod exports richCaptionAssetSchema", () => {
    const mod = require(path.join(distDir, "zod/zod.gen.cjs"));
    assert.ok(typeof mod.richCaptionAssetSchema === "object", "richCaptionAssetSchema not found");
  });

  console.log("\n--- ESM import checks ---\n");

  try {
    const esmMod = await import(
      "file://" + path.join(distDir, "zod/zod.gen.js").replace(/\\/g, "/")
    );

    check("ESM zod module loads", () => {
      assert.ok(esmMod, "Module is falsy");
    });

    check("ESM zod exports richTextAssetSchema", () => {
      assert.ok(typeof esmMod.richTextAssetSchema === "object", "richTextAssetSchema not found");
    });

    check("ESM zod exports editSchema", () => {
      assert.ok(typeof esmMod.editSchema === "object", "editSchema not found");
    });

    check("ESM zod exports svgAssetSchema", () => {
      assert.ok(typeof esmMod.svgAssetSchema === "object", "svgAssetSchema not found");
    });

    check("ESM zod exports richCaptionAssetSchema", () => {
      assert.ok(
        typeof esmMod.richCaptionAssetSchema === "object",
        "richCaptionAssetSchema not found"
      );
    });
  } catch (err) {
    failed++;
    console.log(`  FAIL  ESM zod module loads`);
    console.log(`        ${err.message}`);
  }

  console.log("\n--- Zod parse checks ---\n");

  const zodCjs = require(path.join(distDir, "zod/zod.gen.cjs"));

  check("Parse valid rich-text asset", () => {
    const result = zodCjs.richTextAssetSchema.parse({
      type: "rich-text",
      text: "Hello world",
    });
    assert.strictEqual(result.type, "rich-text");
    assert.strictEqual(result.text, "Hello world");
  });

  check("Reject invalid rich-text asset (missing text)", () => {
    assert.throws(() => {
      zodCjs.richTextAssetSchema.parse({ type: "rich-text" });
    });
  });

  check("Parse valid svg asset", () => {
    const result = zodCjs.svgAssetSchema.parse({
      type: "svg",
      src: "<svg></svg>",
    });
    assert.strictEqual(result.type, "svg");
  });

  check("Reject invalid svg asset (missing src)", () => {
    assert.throws(() => {
      zodCjs.svgAssetSchema.parse({ type: "svg" });
    });
  });

  check("Parse valid rich-caption asset", () => {
    const result = zodCjs.richCaptionAssetSchema.parse({
      type: "rich-caption",
      src: "https://example.com/captions.srt",
    });
    assert.strictEqual(result.type, "rich-caption");
  });

  check("Reject invalid rich-caption asset (wrong type value)", () => {
    assert.throws(() => {
      zodCjs.richCaptionAssetSchema.parse({ type: "not-a-type", src: 123 });
    });
  });

  console.log("\n--- JSON schema checks ---\n");

  const jsonSchemaDir = path.join(distDir, "json-schema");
  const jsonFiles = fs.readdirSync(jsonSchemaDir).filter((f) => f.endsWith(".json"));

  check("JSON schema directory has .json files", () => {
    assert.ok(jsonFiles.length > 0, "No .json files found in json-schema directory");
  });

  for (const jsonFile of jsonFiles) {
    check(`${jsonFile} is valid JSON`, () => {
      const content = fs.readFileSync(path.join(jsonSchemaDir, jsonFile), "utf8");
      JSON.parse(content);
    });
  }

  check("JSON schema CJS module loads", () => {
    const mod = require(path.join(distDir, "json-schema/index.cjs"));
    assert.ok(mod, "Module is falsy");
    assert.ok(typeof mod.edit === "object", "edit export not found");
  });

  console.log("\n========================================");
  console.log(`  Results: ${passed} passed, ${failed} failed`);
  console.log("========================================\n");

  if (failed > 0) {
    process.exit(1);
  }
}

run().catch((err) => {
  console.error("Smoke test runner failed:", err);
  process.exit(1);
});
