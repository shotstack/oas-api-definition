const fs = require("fs");
const path = require("path");

const zodGenPath = path.join(__dirname, "..", "dist", "zod", "zod.gen.ts");

console.log(
  "Fixing discriminator and adding coercion in generated Zod schemas..."
);

let content = fs.readFileSync(zodGenPath, "utf8");

const assetUnionPattern =
  /export const assetAssetSchema = z\.union\(\[[\s\S]*?\]\);/;

const newAssetSchema = `export const assetAssetSchema = z.discriminatedUnion("type", [
  videoassetVideoAssetSchema,
  imageassetImageAssetSchema,
  textassetTextAssetSchema,
  richtextassetRichTextAssetSchema,
  audioassetAudioAssetSchema,
  lumaassetLumaAssetSchema,
  captionassetCaptionAssetSchema,
  htmlassetHtmlAssetSchema,
  titleassetTitleAssetSchema,
  shapeassetShapeAssetSchema,
  texttoimageassetTextToImageAssetSchema,
  imagetovideoassetImageToVideoAssetSchema,
]);`;

if (assetUnionPattern.test(content)) {
  content = content.replace(assetUnionPattern, newAssetSchema);
  console.log("✓ Fixed assetAssetSchema discriminator");
} else {
  console.log("⚠ Could not find assetAssetSchema to replace");
}

const clipStartPattern =
  /start: z\.union\(\[z\.number\(\), z\.enum\(\["auto"\]\)\]\)/g;
const clipStartReplacement = `start: z.union([z.preprocess((val) => typeof val === 'string' && val !== '' && !isNaN(Number(val)) ? Number(val) : val, z.number()), z.enum(["auto"])])`;

if (clipStartPattern.test(content)) {
  content = content.replace(clipStartPattern, clipStartReplacement);
  console.log("✓ Added coercion for clip start");
} else {
  console.log("⚠ Could not find clip start pattern to add coercion");
}

const clipLengthPattern =
  /length: z\.union\(\[z\.number\(\), z\.literal\("auto"\), z\.literal\("end"\)\]\)/g;
const clipLengthReplacement = `length: z.union([z.preprocess((val) => typeof val === 'string' && val !== '' && !isNaN(Number(val)) ? Number(val) : val, z.number()), z.literal("auto"), z.literal("end")])`;

if (clipLengthPattern.test(content)) {
  content = content.replace(clipLengthPattern, clipLengthReplacement);
  console.log("✓ Added coercion for clip length");
} else {
  console.log("⚠ Could not find clip length pattern to add coercion");
}

const trimPattern = /trim: z\.optional\(z\.number\(\)\)/g;
const trimReplacement = `trim: z.optional(z.preprocess((val) => typeof val === 'string' && val !== '' && !isNaN(Number(val)) ? Number(val) : val, z.number()))`;

const trimCount = (content.match(trimPattern) || []).length;
if (trimCount > 0) {
  content = content.replace(trimPattern, trimReplacement);
  console.log(`✓ Added coercion for trim (${trimCount} occurrences)`);
}

const volumePattern =
  /volume: z\.optional\(z\.number\(\)\.gte\(0\)\.lte\(1\)\)/g;
const volumeReplacement = `volume: z.optional(z.preprocess((val) => typeof val === 'string' && val !== '' && !isNaN(Number(val)) ? Number(val) : val, z.number().gte(0).lte(1)))`;

const volumeCount = (content.match(volumePattern) || []).length;
if (volumeCount > 0) {
  content = content.replace(volumePattern, volumeReplacement);
  console.log(`✓ Added coercion for volume (${volumeCount} occurrences)`);
}

const speedPattern =
  /speed: z\.optional\(z\.number\(\)\.gte\(0\)\.lte\(10\)\)/g;
const speedReplacement = `speed: z.optional(z.preprocess((val) => typeof val === 'string' && val !== '' && !isNaN(Number(val)) ? Number(val) : val, z.number().gte(0).lte(10)))`;

const speedCount = (content.match(speedPattern) || []).length;
if (speedCount > 0) {
  content = content.replace(speedPattern, speedReplacement);
  console.log(`✓ Added coercion for speed (${speedCount} occurrences)`);
}

const scalePattern = /scale: z\.optional\(z\.number\(\)\)/g;
const scaleReplacement = `scale: z.optional(z.preprocess((val) => typeof val === 'string' && val !== '' && !isNaN(Number(val)) ? Number(val) : val, z.number()))`;

const scaleCount = (content.match(scalePattern) || []).length;
if (scaleCount > 0) {
  content = content.replace(scalePattern, scaleReplacement);
  console.log(`✓ Added coercion for scale (${scaleCount} occurrences)`);
}

// Global coercion for ALL remaining z.number() patterns not already handled
// This catches font.size, opacity, width, height, etc.
const coerceHelper = `(val) => typeof val === 'string' && val !== '' && !isNaN(Number(val)) ? Number(val) : val`;

// Pattern: z.number() without any chained methods (standalone)
const plainNumberPattern = /z\.number\(\)(?!\.)/g;
const plainNumberReplacement = `z.preprocess(${coerceHelper}, z.number())`;
const plainNumberCount = (content.match(plainNumberPattern) || []).length;
if (plainNumberCount > 0) {
  content = content.replace(plainNumberPattern, plainNumberReplacement);
  console.log(`✓ Added coercion for plain z.number() (${plainNumberCount} occurrences)`);
}

// Pattern: z.number() with chained methods (e.g., .gte(), .lte(), .min(), .max(), .int())
// Match z.number() followed by method chains
const chainedNumberPattern = /z\.number\(\)((?:\.[a-zA-Z]+\([^)]*\))+)/g;
let chainedCount = 0;
content = content.replace(chainedNumberPattern, (match, chain) => {
  // Skip if already preprocessed (from specific patterns above)
  if (match.includes('preprocess')) return match;
  chainedCount++;
  return `z.preprocess(${coerceHelper}, z.number()${chain})`;
});
if (chainedCount > 0) {
  console.log(`✓ Added coercion for chained z.number() (${chainedCount} occurrences)`);
}

// Pattern: z.int() - integers also need coercion from strings
const plainIntPattern = /z\.int\(\)(?!\.)/g;
const plainIntReplacement = `z.preprocess(${coerceHelper}, z.int())`;
const plainIntCount = (content.match(plainIntPattern) || []).length;
if (plainIntCount > 0) {
  content = content.replace(plainIntPattern, plainIntReplacement);
  console.log(`✓ Added coercion for plain z.int() (${plainIntCount} occurrences)`);
}

// Pattern: z.int() with chained methods (e.g., .gte(), .lte())
const chainedIntPattern = /z\.int\(\)((?:\.[a-zA-Z]+\([^)]*\))+)/g;
let chainedIntCount = 0;
content = content.replace(chainedIntPattern, (match, chain) => {
  if (match.includes('preprocess')) return match;
  chainedIntCount++;
  return `z.preprocess(${coerceHelper}, z.int()${chain})`;
});
if (chainedIntCount > 0) {
  console.log(`✓ Added coercion for chained z.int() (${chainedIntCount} occurrences)`);
}

fs.writeFileSync(zodGenPath, content);

const zodGenCjsPath = path.join(__dirname, "..", "dist", "zod", "zod.gen.cjs");
if (fs.existsSync(zodGenCjsPath)) {
  let cjsContent = fs.readFileSync(zodGenCjsPath, "utf8");

  const cjsAssetUnionPattern =
    /exports\.assetAssetSchema = zod_1\.z\.union\(\[[\s\S]*?\]\);/;

  const newCjsAssetSchema = `exports.assetAssetSchema = zod_1.z.discriminatedUnion("type", [
  exports.videoassetVideoAssetSchema,
  exports.imageassetImageAssetSchema,
  exports.textassetTextAssetSchema,
  exports.richtextassetRichTextAssetSchema,
  exports.audioassetAudioAssetSchema,
  exports.lumaassetLumaAssetSchema,
  exports.captionassetCaptionAssetSchema,
  exports.htmlassetHtmlAssetSchema,
  exports.titleassetTitleAssetSchema,
  exports.shapeassetShapeAssetSchema,
  exports.texttoimageassetTextToImageAssetSchema,
  exports.imagetovideoassetImageToVideoAssetSchema,
]);`;

  if (cjsAssetUnionPattern.test(cjsContent)) {
    cjsContent = cjsContent.replace(cjsAssetUnionPattern, newCjsAssetSchema);
    console.log("✓ Fixed assetAssetSchema discriminator in CJS");
  }

  const cjsCoercionPatterns = [
    {
      pattern:
        /start: zod_1\.z\.union\(\[zod_1\.z\.number\(\), zod_1\.z\.enum\(\["auto"\]\)\]\)/g,
      replacement: `start: zod_1.z.union([zod_1.z.preprocess((val) => typeof val === 'string' && val !== '' && !isNaN(Number(val)) ? Number(val) : val, zod_1.z.number()), zod_1.z.enum(["auto"])])`,
      name: "clip start",
    },
    {
      pattern:
        /length: zod_1\.z\.union\(\[zod_1\.z\.number\(\), zod_1\.z\.literal\("auto"\), zod_1\.z\.literal\("end"\)\]\)/g,
      replacement: `length: zod_1.z.union([zod_1.z.preprocess((val) => typeof val === 'string' && val !== '' && !isNaN(Number(val)) ? Number(val) : val, zod_1.z.number()), zod_1.z.literal("auto"), zod_1.z.literal("end")])`,
      name: "clip length",
    },
    {
      pattern: /trim: zod_1\.z\.optional\(zod_1\.z\.number\(\)\)/g,
      replacement: `trim: zod_1.z.optional(zod_1.z.preprocess((val) => typeof val === 'string' && val !== '' && !isNaN(Number(val)) ? Number(val) : val, zod_1.z.number()))`,
      name: "trim",
    },
    {
      pattern:
        /volume: zod_1\.z\.optional\(zod_1\.z\.number\(\)\.gte\(0\)\.lte\(1\)\)/g,
      replacement: `volume: zod_1.z.optional(zod_1.z.preprocess((val) => typeof val === 'string' && val !== '' && !isNaN(Number(val)) ? Number(val) : val, zod_1.z.number().gte(0).lte(1)))`,
      name: "volume",
    },
    {
      pattern:
        /speed: zod_1\.z\.optional\(zod_1\.z\.number\(\)\.gte\(0\)\.lte\(10\)\)/g,
      replacement: `speed: zod_1.z.optional(zod_1.z.preprocess((val) => typeof val === 'string' && val !== '' && !isNaN(Number(val)) ? Number(val) : val, zod_1.z.number().gte(0).lte(10)))`,
      name: "speed",
    },
    {
      pattern: /scale: zod_1\.z\.optional\(zod_1\.z\.number\(\)\)/g,
      replacement: `scale: zod_1.z.optional(zod_1.z.preprocess((val) => typeof val === 'string' && val !== '' && !isNaN(Number(val)) ? Number(val) : val, zod_1.z.number()))`,
      name: "scale",
    },
  ];

  for (const { pattern, replacement, name } of cjsCoercionPatterns) {
    const count = (cjsContent.match(pattern) || []).length;
    if (count > 0) {
      cjsContent = cjsContent.replace(pattern, replacement);
      console.log(`✓ Added coercion for ${name} in CJS (${count} occurrences)`);
    }
  }

  // Global coercion for ALL remaining zod_1.z.number() patterns in CJS
  const cjsCoerceHelper = `(val) => typeof val === 'string' && val !== '' && !isNaN(Number(val)) ? Number(val) : val`;

  const cjsPlainNumberPattern = /zod_1\.z\.number\(\)(?!\.)/g;
  const cjsPlainNumberReplacement = `zod_1.z.preprocess(${cjsCoerceHelper}, zod_1.z.number())`;
  const cjsPlainNumberCount = (cjsContent.match(cjsPlainNumberPattern) || []).length;
  if (cjsPlainNumberCount > 0) {
    cjsContent = cjsContent.replace(cjsPlainNumberPattern, cjsPlainNumberReplacement);
    console.log(`✓ Added coercion for plain z.number() in CJS (${cjsPlainNumberCount} occurrences)`);
  }

  const cjsChainedNumberPattern = /zod_1\.z\.number\(\)((?:\.[a-zA-Z]+\([^)]*\))+)/g;
  let cjsChainedCount = 0;
  cjsContent = cjsContent.replace(cjsChainedNumberPattern, (match, chain) => {
    if (match.includes('preprocess')) return match;
    cjsChainedCount++;
    return `zod_1.z.preprocess(${cjsCoerceHelper}, zod_1.z.number()${chain})`;
  });
  if (cjsChainedCount > 0) {
    console.log(`✓ Added coercion for chained z.number() in CJS (${cjsChainedCount} occurrences)`);
  }

  fs.writeFileSync(zodGenCjsPath, cjsContent);
}

const zodGenJsPath = path.join(__dirname, "..", "dist", "zod", "zod.gen.js");
if (fs.existsSync(zodGenJsPath)) {
  let jsContent = fs.readFileSync(zodGenJsPath, "utf8");

  const jsAssetUnionPattern =
    /export const assetAssetSchema = z\.union\(\[[\s\S]*?\]\);/;

  if (jsAssetUnionPattern.test(jsContent)) {
    jsContent = jsContent.replace(jsAssetUnionPattern, newAssetSchema);
    console.log("✓ Fixed assetAssetSchema discriminator in ESM JS");
  }

  const esmCoercionPatterns = [
    {
      pattern: clipStartPattern,
      replacement: clipStartReplacement,
      name: "clip start",
    },
    {
      pattern: clipLengthPattern,
      replacement: clipLengthReplacement,
      name: "clip length",
    },
    { pattern: trimPattern, replacement: trimReplacement, name: "trim" },
    { pattern: volumePattern, replacement: volumeReplacement, name: "volume" },
    { pattern: speedPattern, replacement: speedReplacement, name: "speed" },
    { pattern: scalePattern, replacement: scaleReplacement, name: "scale" },
  ];

  for (const { pattern, replacement, name } of esmCoercionPatterns) {
    const count = (jsContent.match(pattern) || []).length;
    if (count > 0) {
      jsContent = jsContent.replace(pattern, replacement);
      console.log(
        `✓ Added coercion for ${name} in ESM JS (${count} occurrences)`
      );
    }
  }

  // Global coercion for ALL remaining z.number() patterns in ESM JS
  const esmPlainNumberCount = (jsContent.match(plainNumberPattern) || []).length;
  if (esmPlainNumberCount > 0) {
    jsContent = jsContent.replace(plainNumberPattern, plainNumberReplacement);
    console.log(`✓ Added coercion for plain z.number() in ESM JS (${esmPlainNumberCount} occurrences)`);
  }

  let esmChainedCount = 0;
  jsContent = jsContent.replace(chainedNumberPattern, (match, chain) => {
    if (match.includes('preprocess')) return match;
    esmChainedCount++;
    return `z.preprocess(${coerceHelper}, z.number()${chain})`;
  });
  if (esmChainedCount > 0) {
    console.log(`✓ Added coercion for chained z.number() in ESM JS (${esmChainedCount} occurrences)`);
  }

  fs.writeFileSync(zodGenJsPath, jsContent);
}

console.log("Done!");
