const fs = require("fs");
const path = require("path");

const zodGenPath = path.join(__dirname, "..", "dist", "zod", "zod.gen.ts");

console.log("Fixing discriminator and adding z.coerce for number fields...");

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

const rejectInvalid = `((v: unknown) => v === '' || Array.isArray(v) ? NaN : v)`;

const plainNumberPattern = /z\.number\(\)(?!\.)/g;
const plainNumberCount = (content.match(plainNumberPattern) || []).length;
if (plainNumberCount > 0) {
  content = content.replace(
    plainNumberPattern,
    `z.preprocess(${rejectInvalid}, z.coerce.number())`
  );
  console.log(
    `✓ Added z.coerce.number() for plain z.number() (${plainNumberCount} occurrences)`
  );
}

const chainedNumberPattern = /z\.number\(\)((?:\.[a-zA-Z]+\([^)]*\))+)/g;
let chainedCount = 0;
content = content.replace(chainedNumberPattern, (match, chain) => {
  chainedCount++;
  return `z.preprocess(${rejectInvalid}, z.coerce.number()${chain})`;
});
if (chainedCount > 0) {
  console.log(
    `✓ Added z.coerce.number() for chained z.number() (${chainedCount} occurrences)`
  );
}

const plainIntPattern = /z\.int\(\)(?!\.)/g;
const plainIntCount = (content.match(plainIntPattern) || []).length;
if (plainIntCount > 0) {
  content = content.replace(
    plainIntPattern,
    `z.preprocess(${rejectInvalid}, z.coerce.number().int())`
  );
  console.log(
    `✓ Added z.coerce.number().int() for plain z.int() (${plainIntCount} occurrences)`
  );
}

const chainedIntPattern = /z\.int\(\)((?:\.[a-zA-Z]+\([^)]*\))+)/g;
let chainedIntCount = 0;
content = content.replace(chainedIntPattern, (match, chain) => {
  chainedIntCount++;
  return `z.preprocess(${rejectInvalid}, z.coerce.number().int()${chain})`;
});
if (chainedIntCount > 0) {
  console.log(
    `✓ Added z.coerce.number().int() for chained z.int() (${chainedIntCount} occurrences)`
  );
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
    cjsContent = cjsContent.replace(
      cjsSvgShapeUnionPattern,
      newCjsSvgShapeSchema
    );
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
    cjsContent = cjsContent.replace(
      cjsSvgFillUnionPattern,
      newCjsSvgFillSchema
    );
    console.log("✓ Fixed svgpropertiesSvgFillSchema discriminator in CJS");
  }

  const cjsRejectInvalid = `((v) => v === '' || Array.isArray(v) ? NaN : v)`;

  const cjsPlainNumberPattern = /zod_1\.z\.number\(\)(?!\.)/g;
  const cjsPlainNumberCount = (cjsContent.match(cjsPlainNumberPattern) || [])
    .length;
  if (cjsPlainNumberCount > 0) {
    cjsContent = cjsContent.replace(
      cjsPlainNumberPattern,
      `zod_1.z.preprocess(${cjsRejectInvalid}, zod_1.z.coerce.number())`
    );
    console.log(
      `✓ Added z.coerce.number() in CJS (${cjsPlainNumberCount} occurrences)`
    );
  }

  const cjsChainedNumberPattern =
    /zod_1\.z\.number\(\)((?:\.[a-zA-Z]+\([^)]*\))+)/g;
  let cjsChainedCount = 0;
  cjsContent = cjsContent.replace(cjsChainedNumberPattern, (match, chain) => {
    cjsChainedCount++;
    return `zod_1.z.preprocess(${cjsRejectInvalid}, zod_1.z.coerce.number()${chain})`;
  });
  if (cjsChainedCount > 0) {
    console.log(
      `✓ Added z.coerce.number() chains in CJS (${cjsChainedCount} occurrences)`
    );
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

  const esmRejectInvalid = `((v) => v === '' || Array.isArray(v) ? NaN : v)`;

  const esmPlainNumberPattern = /z\.number\(\)(?!\.)/g;
  const esmPlainNumberCount = (jsContent.match(esmPlainNumberPattern) || [])
    .length;
  if (esmPlainNumberCount > 0) {
    jsContent = jsContent.replace(
      esmPlainNumberPattern,
      `z.preprocess(${esmRejectInvalid}, z.coerce.number())`
    );
    console.log(
      `✓ Added z.coerce.number() in ESM JS (${esmPlainNumberCount} occurrences)`
    );
  }

  const esmChainedNumberPattern = /z\.number\(\)((?:\.[a-zA-Z]+\([^)]*\))+)/g;
  let esmChainedCount = 0;
  jsContent = jsContent.replace(esmChainedNumberPattern, (match, chain) => {
    esmChainedCount++;
    return `z.preprocess(${esmRejectInvalid}, z.coerce.number()${chain})`;
  });
  if (esmChainedCount > 0) {
    console.log(
      `✓ Added z.coerce.number() chains in ESM JS (${esmChainedCount} occurrences)`
    );
  }

  fs.writeFileSync(zodGenJsPath, jsContent);
}

console.log("Done!");
