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

  check("Parse rich-text font style italic", () => {
    const result = zodCjs.richTextAssetSchema.parse({
      type: "rich-text",
      text: "Hello world",
      font: { style: "italic" },
    });
    assert.strictEqual(result.font.style, "italic");
  });

  check("Reject unsupported rich-text font style", () => {
    assert.throws(() => {
      zodCjs.richTextAssetSchema.parse({
        type: "rich-text",
        text: "Hello world",
        font: { style: "oblique" },
      });
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

  check("Parse rich-caption font style italic", () => {
    const result = zodCjs.richCaptionAssetSchema.parse({
      type: "rich-caption",
      src: "https://example.com/captions.srt",
      font: { style: "italic" },
    });
    assert.strictEqual(result.font.style, "italic");
  });

  check("Reject unsupported rich-caption font style", () => {
    assert.throws(() => {
      zodCjs.richCaptionAssetSchema.parse({
        type: "rich-caption",
        src: "https://example.com/captions.srt",
        font: { style: "oblique" },
      });
    });
  });

  console.log("\n--- Unified asset schema: existing shape (regression guard) ---\n");

  check("Parse imageAsset with src only (existing shape)", () => {
    const result = zodCjs.imageAssetSchema.parse({
      type: "image",
      src: "https://example.com/image.jpg",
    });
    assert.strictEqual(result.type, "image");
    assert.strictEqual(result.src, "https://example.com/image.jpg");
  });

  check("Parse videoAsset with src only (existing shape)", () => {
    const result = zodCjs.videoAssetSchema.parse({
      type: "video",
      src: "https://example.com/video.mp4",
    });
    assert.strictEqual(result.type, "video");
    assert.strictEqual(result.src, "https://example.com/video.mp4");
  });

  check("Parse audioAsset with src only (existing shape)", () => {
    const result = zodCjs.audioAssetSchema.parse({
      type: "audio",
      src: "https://example.com/audio.mp3",
    });
    assert.strictEqual(result.type, "audio");
    assert.strictEqual(result.src, "https://example.com/audio.mp3");
  });

  console.log("\n--- Unified asset schema: prompt-based shape (new) ---\n");

  check("Parse imageAsset with prompt only", () => {
    const result = zodCjs.imageAssetSchema.parse({
      type: "image",
      prompt: "A serene mountain lake at sunrise",
    });
    assert.strictEqual(result.type, "image");
    assert.strictEqual(result.prompt, "A serene mountain lake at sunrise");
  });

  check("Parse imageAsset with prompt + model", () => {
    const result = zodCjs.imageAssetSchema.parse({
      type: "image",
      prompt: "A serene landscape",
      model: "flux-schnell",
    });
    assert.strictEqual(result.prompt, "A serene landscape");
    assert.strictEqual(result.model, "flux-schnell");
  });

  check("Parse videoAsset with prompt + options.startSrc", () => {
    const result = zodCjs.videoAssetSchema.parse({
      type: "video",
      prompt: "Slowly zoom out and orbit left around the object",
      options: { startSrc: "https://example.com/input-image.jpg" },
    });
    assert.strictEqual(result.prompt, "Slowly zoom out and orbit left around the object");
    assert.strictEqual(result.options.startSrc, "https://example.com/input-image.jpg");
  });

  check("Parse videoAsset with prompt + model + options", () => {
    const result = zodCjs.videoAssetSchema.parse({
      type: "video",
      prompt: "Camera pans right",
      model: "seedance-2.0-text-to-video",
      options: { resolution: "720p", aspectRatio: "16:9" },
    });
    assert.strictEqual(result.model, "seedance-2.0-text-to-video");
  });

  check("REJECT videoAsset with removed `seed` field (generation inputs live in options)", () => {
    assert.throws(() =>
      zodCjs.videoAssetSchema.parse({
        type: "video",
        prompt: "Camera pans right",
        seed: "https://example.com/seed.jpg",
      })
    );
  });

  check("Parse audioAsset with prompt + options.voice", () => {
    const result = zodCjs.audioAssetSchema.parse({
      type: "audio",
      prompt: "This is a text-to-speech example",
      options: { voice: "Matthew" },
    });
    assert.strictEqual(result.prompt, "This is a text-to-speech example");
    assert.strictEqual(result.options.voice, "Matthew");
  });

  check("Parse audioAsset with speech options (voice, language, newscaster)", () => {
    const result = zodCjs.audioAssetSchema.parse({
      type: "audio",
      prompt: "Breaking news from around the world",
      options: { voice: "Matthew", language: "en-US", newscaster: true },
    });
    assert.strictEqual(result.options.language, "en-US");
    assert.strictEqual(result.options.newscaster, true);
  });

  check("Parse audioAsset with prompt only (music/SFX generator)", () => {
    const result = zodCjs.audioAssetSchema.parse({
      type: "audio",
      prompt: "Upbeat synthwave background music",
    });
    assert.strictEqual(result.prompt, "Upbeat synthwave background music");
  });

  console.log("\n--- Deprecated asset schemas (must still parse for back-compat) ---\n");

  check("Parse deprecated textToImageAsset", () => {
    const result = zodCjs.textToImageAssetSchema.parse({
      type: "text-to-image",
      prompt: "A serene landscape",
    });
    assert.strictEqual(result.type, "text-to-image");
    assert.strictEqual(result.prompt, "A serene landscape");
  });

  check("Parse deprecated imageToVideoAsset", () => {
    const result = zodCjs.imageToVideoAssetSchema.parse({
      type: "image-to-video",
      src: "https://example.com/image.jpg",
      prompt: "Pan slowly",
    });
    assert.strictEqual(result.type, "image-to-video");
  });

  check("Parse deprecated textToSpeechAsset", () => {
    const result = zodCjs.textToSpeechAssetSchema.parse({
      type: "text-to-speech",
      text: "Hello world",
      voice: "Matthew",
    });
    assert.strictEqual(result.type, "text-to-speech");
  });

  console.log("\n--- Unified asset: src-or-prompt rule (ADR 0001) ---\n");

  // At-least-one: src OR prompt required on image/video/audio. Both allowed:
  // src is a preview placeholder, prompt regenerates at render.
  // Neither → rejected. The options object never satisfies the rule.

  check("image with src only is valid", () => {
    zodCjs.imageAssetSchema.parse({ type: "image", src: "https://example.com/a.jpg" });
  });

  check("image with both src and prompt is valid (src previews; prompt regenerates at render)", () => {
    zodCjs.imageAssetSchema.parse({
      type: "image",
      src: "https://example.com/a.jpg",
      prompt: "a serene lake",
    });
  });

  check("image accepts model-scoped options object", () => {
    zodCjs.imageAssetSchema.parse({
      type: "image",
      prompt: "a serene lake",
      model: "flux-schnell",
      options: { resolution: "2K", aspectRatio: "16:9" },
    });
  });

  check("video accepts model-scoped options object", () => {
    zodCjs.videoAssetSchema.parse({
      type: "video",
      prompt: "slow orbit",
      options: { duration: "8", generateAudio: true },
    });
  });

  check("REJECT removed flat generation field on video", () => {
    assert.throws(() => zodCjs.videoAssetSchema.parse({
      type: "video",
      prompt: "slow orbit",
      resolution: "720p",
    }));
  });

  check("audio accepts speech options", () => {
    zodCjs.audioAssetSchema.parse({
      type: "audio",
      prompt: "Welcome to the show",
      model: "polly-neural",
      options: { voice: "Matthew", language: "en-US" },
    });
  });

  check("REJECT image with neither src nor prompt", () => {
    assert.throws(() => zodCjs.imageAssetSchema.parse({ type: "image" }));
  });

  check("REJECT image with empty-string prompt and no src", () => {
    assert.throws(() => zodCjs.imageAssetSchema.parse({ type: "image", prompt: "" }));
  });

  check("REJECT video with neither src nor prompt", () => {
    assert.throws(() => zodCjs.videoAssetSchema.parse({ type: "video" }));
  });

  check("REJECT video with only options and no src/prompt (options never satisfies the rule)", () => {
    assert.throws(() =>
      zodCjs.videoAssetSchema.parse({ type: "video", options: { startSrc: "https://example.com/input.jpg" } })
    );
  });

  check("REJECT video with removed `seed` field and no src/prompt (seed no longer recognized)", () => {
    assert.throws(() =>
      zodCjs.videoAssetSchema.parse({ type: "video", seed: "https://example.com/seed.jpg" })
    );
  });

  check("REJECT audio with only options and no src/prompt (options never satisfies the rule)", () => {
    assert.throws(() => zodCjs.audioAssetSchema.parse({ type: "audio", options: { voice: "Matthew" } }));
  });

  check("audio with prompt + options voice is valid (text-to-speech shape)", () => {
    zodCjs.audioAssetSchema.parse({ type: "audio", prompt: "hello", options: { voice: "Matthew" } });
  });

  console.log("\n--- Deprecation markers in bundled spec ---\n");

  const bundledSpec = JSON.parse(
    fs.readFileSync(path.join(distDir, "api.bundled.json"), "utf8")
  );

  check("TextToImageAsset has deprecated: true in bundled spec", () => {
    assert.strictEqual(
      bundledSpec.components.schemas.TextToImageAsset.deprecated,
      true,
      "TextToImageAsset is not marked deprecated in api.bundled.json"
    );
  });

  check("ImageToVideoAsset has deprecated: true in bundled spec", () => {
    assert.strictEqual(
      bundledSpec.components.schemas.ImageToVideoAsset.deprecated,
      true,
      "ImageToVideoAsset is not marked deprecated in api.bundled.json"
    );
  });

  check("TextToSpeechAsset has deprecated: true in bundled spec", () => {
    assert.strictEqual(
      bundledSpec.components.schemas.TextToSpeechAsset.deprecated,
      true,
      "TextToSpeechAsset is not marked deprecated in api.bundled.json"
    );
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

  console.log("\n--- JSON barrel bundler-safety checks ---\n");

  // Regression: createRequire(import.meta.url) in the ESM barrel crashed
  // esbuild CJS Lambda bundles (import.meta.url is undefined there). The
  // barrels must be pure data modules — no runtime module machinery.
  for (const barrel of ["json-schema/index.js", "json-schema/index.cjs"]) {
    check(`${barrel} is a pure data module`, () => {
      const src = fs.readFileSync(path.join(distDir, barrel), "utf8");
      assert.ok(!src.includes("import.meta"), "contains import.meta");
      assert.ok(!src.includes("require("), "contains runtime require()");
    });
  }

  console.log("\n--- JSON Schema validation checks ---\n");

  const Ajv2020 = require("ajv/dist/2020");
  const ajv = new Ajv2020({ strict: true, validateFormats: false });
  const editJsonSchema = require(path.join(distDir, "json-schema/edit.json"));
  let validateEdit;

  check("edit.json compiles under ajv strict (2020-12)", () => {
    validateEdit = ajv.compile(editJsonSchema);
  });

  const baseEdit = (asset) => ({
    timeline: { tracks: [{ clips: [{ asset, start: 0, length: 3 }] }] },
    output: { format: "mp4", resolution: "hd" },
  });

  const schemaCases = [
    ["accepts a valid rich-text edit", baseEdit({ type: "rich-text", text: "Hello" }), true],
    ["accepts a valid video edit", baseEdit({ type: "video", src: "https://x.com/a.mp4" }), true],
    ["accepts deprecated title asset", baseEdit({ type: "title", text: "Old" }), true],
    ["rejects unknown asset property", baseEdit({ type: "video", src: "https://x.com/a.mp4", bogus: 1 }), false],
    ["rejects missing output", { timeline: { tracks: [] } }, false],
  ];

  const sepiaEdit = baseEdit({ type: "video", src: "https://x.com/a.mp4" });
  sepiaEdit.timeline.tracks[0].clips[0].filter = "sepia";
  schemaCases.push(["rejects invalid filter enum value", sepiaEdit, false]);

  const soundtrackEdit = baseEdit({ type: "video", src: "https://x.com/a.mp4" });
  soundtrackEdit.timeline.soundtrack = { src: "https://x.com/a.mp3", effect: "fadeIn" };
  schemaCases.push(["accepts deprecated soundtrack", soundtrackEdit, true]);

  for (const [label, edit, expected] of schemaCases) {
    check(label, () => {
      assert.ok(validateEdit, "schema did not compile");
      const ok = validateEdit(edit);
      assert.strictEqual(
        ok,
        expected,
        expected
          ? `Expected valid, got: ${JSON.stringify((validateEdit.errors || []).slice(0, 2))}`
          : "Expected validation to fail but it passed"
      );
    });
  }

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
