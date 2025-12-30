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
  svgassetSvgAssetSchema,
  texttoimageassetTextToImageAssetSchema,
  imagetovideoassetImageToVideoAssetSchema,
]);`;

if (assetUnionPattern.test(content)) {
  content = content.replace(assetUnionPattern, newAssetSchema);
  console.log("✓ Fixed assetAssetSchema discriminator");
} else {
  console.log("⚠ Could not find assetAssetSchema to replace");
}

const svgShapeUnionPattern =
  /export const svgshapesSvgShapeSchema = z\.union\(\[[\s\S]*?\]\);/;

const newSvgShapeSchema = `export const svgshapesSvgShapeSchema = z.discriminatedUnion("type", [
  svgshapesSvgRectangleShapeSchema,
  svgshapesSvgCircleShapeSchema,
  svgshapesSvgEllipseShapeSchema,
  svgshapesSvgLineShapeSchema,
  svgshapesSvgPolygonShapeSchema,
  svgshapesSvgStarShapeSchema,
  svgshapesSvgArrowShapeSchema,
  svgshapesSvgHeartShapeSchema,
  svgshapesSvgCrossShapeSchema,
  svgshapesSvgRingShapeSchema,
  svgshapesSvgPathShapeSchema,
]);`;

if (svgShapeUnionPattern.test(content)) {
  content = content.replace(svgShapeUnionPattern, newSvgShapeSchema);
  console.log("✓ Fixed svgshapesSvgShapeSchema discriminator");
} else {
  console.log("⚠ Could not find svgshapesSvgShapeSchema to replace");
}

const svgFillUnionPattern =
  /export const svgpropertiesSvgFillSchema = z\.union\(\[[\s\S]*?\]\);/;

const newSvgFillSchema = `export const svgpropertiesSvgFillSchema = z.discriminatedUnion("type", [
  svgpropertiesSvgSolidFillSchema,
  svgpropertiesSvgLinearGradientFillSchema,
  svgpropertiesSvgRadialGradientFillSchema,
]);`;

if (svgFillUnionPattern.test(content)) {
  content = content.replace(svgFillUnionPattern, newSvgFillSchema);
  console.log("✓ Fixed svgpropertiesSvgFillSchema discriminator");
} else {
  console.log("⚠ Could not find svgpropertiesSvgFillSchema to replace");
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
  exports.svgassetSvgAssetSchema,
  exports.texttoimageassetTextToImageAssetSchema,
  exports.imagetovideoassetImageToVideoAssetSchema,
]);`;

  if (cjsAssetUnionPattern.test(cjsContent)) {
    cjsContent = cjsContent.replace(cjsAssetUnionPattern, newCjsAssetSchema);
    console.log("✓ Fixed assetAssetSchema discriminator in CJS");
  }

  const cjsSvgShapeUnionPattern =
    /exports\.svgshapesSvgShapeSchema = zod_1\.z\.union\(\[[\s\S]*?\]\);/;

  const newCjsSvgShapeSchema = `exports.svgshapesSvgShapeSchema = zod_1.z.discriminatedUnion("type", [
  exports.svgshapesSvgRectangleShapeSchema,
  exports.svgshapesSvgCircleShapeSchema,
  exports.svgshapesSvgEllipseShapeSchema,
  exports.svgshapesSvgLineShapeSchema,
  exports.svgshapesSvgPolygonShapeSchema,
  exports.svgshapesSvgStarShapeSchema,
  exports.svgshapesSvgArrowShapeSchema,
  exports.svgshapesSvgHeartShapeSchema,
  exports.svgshapesSvgCrossShapeSchema,
  exports.svgshapesSvgRingShapeSchema,
  exports.svgshapesSvgPathShapeSchema,
]);`;

  if (cjsSvgShapeUnionPattern.test(cjsContent)) {
    cjsContent = cjsContent.replace(cjsSvgShapeUnionPattern, newCjsSvgShapeSchema);
    console.log("✓ Fixed svgshapesSvgShapeSchema discriminator in CJS");
  }

  const cjsSvgFillUnionPattern =
    /exports\.svgpropertiesSvgFillSchema = zod_1\.z\.union\(\[[\s\S]*?\]\);/;

  const newCjsSvgFillSchema = `exports.svgpropertiesSvgFillSchema = zod_1.z.discriminatedUnion("type", [
  exports.svgpropertiesSvgSolidFillSchema,
  exports.svgpropertiesSvgLinearGradientFillSchema,
  exports.svgpropertiesSvgRadialGradientFillSchema,
]);`;

  if (cjsSvgFillUnionPattern.test(cjsContent)) {
    cjsContent = cjsContent.replace(cjsSvgFillUnionPattern, newCjsSvgFillSchema);
    console.log("✓ Fixed svgpropertiesSvgFillSchema discriminator in CJS");
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

  if (svgShapeUnionPattern.test(jsContent)) {
    jsContent = jsContent.replace(svgShapeUnionPattern, newSvgShapeSchema);
    console.log("✓ Fixed svgshapesSvgShapeSchema discriminator in ESM JS");
  }

  if (svgFillUnionPattern.test(jsContent)) {
    jsContent = jsContent.replace(svgFillUnionPattern, newSvgFillSchema);
    console.log("✓ Fixed svgpropertiesSvgFillSchema discriminator in ESM JS");
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

  fs.writeFileSync(zodGenJsPath, jsContent);
}

console.log("Done!");
