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

  check("Parse videoAsset with prompt + seed", () => {
    const result = zodCjs.videoAssetSchema.parse({
      type: "video",
      prompt: "Slowly zoom out and orbit left around the object",
      seed: "https://example.com/seed-image.jpg",
    });
    assert.strictEqual(result.prompt, "Slowly zoom out and orbit left around the object");
    assert.strictEqual(result.seed, "https://example.com/seed-image.jpg");
  });

  check("Parse videoAsset with prompt + seed + model", () => {
    const result = zodCjs.videoAssetSchema.parse({
      type: "video",
      prompt: "Camera pans right",
      seed: "https://example.com/seed.jpg",
      model: "luma-ray-3",
    });
    assert.strictEqual(result.model, "luma-ray-3");
  });

  check("Parse audioAsset with prompt + voice", () => {
    const result = zodCjs.audioAssetSchema.parse({
      type: "audio",
      prompt: "This is a text-to-speech example",
      voice: "Matthew",
    });
    assert.strictEqual(result.prompt, "This is a text-to-speech example");
    assert.strictEqual(result.voice, "Matthew");
  });

  check("Parse audioAsset with prompt + voice + language + newscaster", () => {
    const result = zodCjs.audioAssetSchema.parse({
      type: "audio",
      prompt: "Breaking news from around the world",
      voice: "Matthew",
      language: "en-US",
      newscaster: true,
    });
    assert.strictEqual(result.language, "en-US");
    assert.strictEqual(result.newscaster, true);
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

  // At-least-one: src OR prompt required on image/video/audio. Both allowed.
  // Neither → rejected. seed/voice are modifiers and never satisfy the rule.

  check("image with src only is valid", () => {
    zodCjs.imageAssetSchema.parse({ type: "image", src: "https://example.com/a.jpg" });
  });

  check("image with both src and prompt is valid (src wins downstream)", () => {
    zodCjs.imageAssetSchema.parse({
      type: "image",
      src: "https://example.com/a.jpg",
      prompt: "a serene lake",
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

  check("REJECT video with seed but no src and no prompt (seed is a modifier)", () => {
    assert.throws(() =>
      zodCjs.videoAssetSchema.parse({ type: "video", seed: "https://example.com/seed.jpg" })
    );
  });

  check("REJECT audio with voice but no src and no prompt (voice is a modifier)", () => {
    assert.throws(() => zodCjs.audioAssetSchema.parse({ type: "audio", voice: "Matthew" }));
  });

  check("audio with prompt + voice is valid (text-to-speech shape)", () => {
    zodCjs.audioAssetSchema.parse({ type: "audio", prompt: "hello", voice: "Matthew" });
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
