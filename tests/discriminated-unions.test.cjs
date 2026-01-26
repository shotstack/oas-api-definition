/**
 * Discriminated Union Tests - Verify that discriminated unions work correctly
 * Tests that the correct schema is selected based on the discriminator field
 */

const { describe, it } = require('node:test');
const assert = require('node:assert');
const schemas = require('../dist/zod/zod.gen.cjs');
const { expectSuccess, expectUnrecognizedKeysError } = require('./setup.cjs');

describe('Discriminated Unions - Asset Type Discrimination', () => {

  describe('assetAssetSchema (main asset union)', () => {

    it('correctly parses video asset', () => {
      const result = schemas.assetAssetSchema.safeParse({
        type: 'video',
        src: 'https://example.com/video.mp4'
      });
      expectSuccess(result);
      assert.strictEqual(result.data.type, 'video');
    });

    it('correctly parses image asset', () => {
      const result = schemas.assetAssetSchema.safeParse({
        type: 'image',
        src: 'https://example.com/image.jpg'
      });
      expectSuccess(result);
      assert.strictEqual(result.data.type, 'image');
    });

    it('correctly parses text asset', () => {
      const result = schemas.assetAssetSchema.safeParse({
        type: 'text',
        text: 'Hello World'
      });
      expectSuccess(result);
      assert.strictEqual(result.data.type, 'text');
    });

    it('correctly parses audio asset', () => {
      const result = schemas.assetAssetSchema.safeParse({
        type: 'audio',
        src: 'https://example.com/audio.mp3'
      });
      expectSuccess(result);
      assert.strictEqual(result.data.type, 'audio');
    });

    it('correctly parses caption asset', () => {
      const result = schemas.assetAssetSchema.safeParse({
        type: 'caption',
        src: 'https://example.com/captions.srt'
      });
      expectSuccess(result);
      assert.strictEqual(result.data.type, 'caption');
    });

    it('correctly parses html asset', () => {
      const result = schemas.assetAssetSchema.safeParse({
        type: 'html',
        html: '<p>Hello</p>'
      });
      expectSuccess(result);
      assert.strictEqual(result.data.type, 'html');
    });

    it('correctly parses title asset', () => {
      const result = schemas.assetAssetSchema.safeParse({
        type: 'title',
        text: 'My Title',
        style: 'minimal'
      });
      expectSuccess(result);
      assert.strictEqual(result.data.type, 'title');
    });

    it('correctly parses shape asset', () => {
      const result = schemas.assetAssetSchema.safeParse({
        type: 'shape',
        shape: 'rectangle'
      });
      expectSuccess(result);
      assert.strictEqual(result.data.type, 'shape');
    });

    it('correctly parses luma asset', () => {
      const result = schemas.assetAssetSchema.safeParse({
        type: 'luma',
        src: 'https://example.com/luma.mp4'
      });
      expectSuccess(result);
      assert.strictEqual(result.data.type, 'luma');
    });

    it('correctly parses svg asset with shape', () => {
      const result = schemas.assetAssetSchema.safeParse({
        type: 'svg',
        shape: {
          type: 'rectangle',
          width: 100,
          height: 100
        }
      });
      expectSuccess(result);
      assert.strictEqual(result.data.type, 'svg');
    });

    it('correctly parses svg asset with src', () => {
      const result = schemas.assetAssetSchema.safeParse({
        type: 'svg',
        src: '<svg></svg>'
      });
      expectSuccess(result);
      assert.strictEqual(result.data.type, 'svg');
    });

    it('rejects unknown asset type', () => {
      const result = schemas.assetAssetSchema.safeParse({
        type: 'unknown',
        src: 'https://example.com/file.dat'
      });
      assert.strictEqual(result.success, false);
    });

    it('rejects asset with extra properties', () => {
      const result = schemas.assetAssetSchema.safeParse({
        type: 'video',
        src: 'https://example.com/video.mp4',
        extraProp: 'should fail'
      });
      expectUnrecognizedKeysError(result);
    });
  });

  describe('destinationsDestinationsSchema (destination union)', () => {

    it('correctly parses shotstack destination', () => {
      const result = schemas.destinationsDestinationsSchema.safeParse({
        provider: 'shotstack'
      });
      expectSuccess(result);
      assert.strictEqual(result.data.provider, 'shotstack');
    });

    it('correctly parses s3 destination', () => {
      const result = schemas.destinationsDestinationsSchema.safeParse({
        provider: 's3',
        options: {
          bucket: 'my-bucket',
          region: 'us-east-1'
        }
      });
      expectSuccess(result);
      assert.strictEqual(result.data.provider, 's3');
    });

    it('correctly parses mux destination', () => {
      const result = schemas.destinationsDestinationsSchema.safeParse({
        provider: 'mux'
      });
      expectSuccess(result);
      assert.strictEqual(result.data.provider, 'mux');
    });

    it('rejects unknown destination provider', () => {
      const result = schemas.destinationsDestinationsSchema.safeParse({
        provider: 'unknown'
      });
      assert.strictEqual(result.success, false);
    });

    it('rejects destination with extra properties', () => {
      const result = schemas.destinationsDestinationsSchema.safeParse({
        provider: 'shotstack',
        extraProp: 'should fail'
      });
      expectUnrecognizedKeysError(result);
    });
  });

  describe('svgshapesSvgShapeSchema (SVG shape union)', () => {

    it('correctly parses rectangle shape', () => {
      const result = schemas.svgshapesSvgShapeSchema.safeParse({
        type: 'rectangle',
        width: 100,
        height: 100
      });
      expectSuccess(result);
      assert.strictEqual(result.data.type, 'rectangle');
    });

    it('correctly parses circle shape', () => {
      const result = schemas.svgshapesSvgShapeSchema.safeParse({
        type: 'circle',
        radius: 50
      });
      expectSuccess(result);
      assert.strictEqual(result.data.type, 'circle');
    });

    it('correctly parses ellipse shape', () => {
      const result = schemas.svgshapesSvgShapeSchema.safeParse({
        type: 'ellipse',
        radiusX: 50,
        radiusY: 30
      });
      expectSuccess(result);
      assert.strictEqual(result.data.type, 'ellipse');
    });

    it('correctly parses line shape', () => {
      const result = schemas.svgshapesSvgShapeSchema.safeParse({
        type: 'line',
        length: 100,
        thickness: 2
      });
      expectSuccess(result);
      assert.strictEqual(result.data.type, 'line');
    });

    it('correctly parses star shape', () => {
      const result = schemas.svgshapesSvgShapeSchema.safeParse({
        type: 'star',
        points: 5,
        outerRadius: 50,
        innerRadius: 25
      });
      expectSuccess(result);
      assert.strictEqual(result.data.type, 'star');
    });

    it('correctly parses heart shape', () => {
      const result = schemas.svgshapesSvgShapeSchema.safeParse({
        type: 'heart',
        size: 100
      });
      expectSuccess(result);
      assert.strictEqual(result.data.type, 'heart');
    });

    it('correctly parses cross shape', () => {
      const result = schemas.svgshapesSvgShapeSchema.safeParse({
        type: 'cross',
        width: 100,
        height: 100,
        thickness: 10
      });
      expectSuccess(result);
      assert.strictEqual(result.data.type, 'cross');
    });

    it('correctly parses ring shape', () => {
      const result = schemas.svgshapesSvgShapeSchema.safeParse({
        type: 'ring',
        outerRadius: 50,
        innerRadius: 25
      });
      expectSuccess(result);
      assert.strictEqual(result.data.type, 'ring');
    });

    it('rejects unknown shape type', () => {
      const result = schemas.svgshapesSvgShapeSchema.safeParse({
        type: 'hexagon',
        sides: 6
      });
      assert.strictEqual(result.success, false);
    });

    it('rejects shape with extra properties', () => {
      const result = schemas.svgshapesSvgShapeSchema.safeParse({
        type: 'rectangle',
        width: 100,
        height: 100,
        extraProp: 'should fail'
      });
      expectUnrecognizedKeysError(result);
    });
  });
});

// Generated Asset Options tests are skipped as they use a provider-based discriminated union
// with a complex structure that requires provider + options fields rather than a simple type field

describe('Discriminated Unions - Cross-Schema Consistency', () => {

  it('asset in clip uses same discrimination as standalone asset schema', () => {
    const videoAsset = { type: 'video', src: 'https://example.com/video.mp4' };

    // Standalone asset
    const standaloneResult = schemas.assetAssetSchema.safeParse(videoAsset);
    expectSuccess(standaloneResult);

    // Asset in clip
    const clipResult = schemas.clipClipSchema.safeParse({
      asset: videoAsset,
      start: 0,
      length: 5
    });
    expectSuccess(clipResult);
    assert.strictEqual(clipResult.data.asset.type, 'video');
  });

  it('destination in edit uses same discrimination as standalone destination schema', () => {
    const destination = { provider: 'shotstack' };

    // Standalone destination
    const standaloneResult = schemas.destinationsDestinationsSchema.safeParse(destination);
    expectSuccess(standaloneResult);

    // Destination in output
    const outputResult = schemas.outputOutputSchema.safeParse({
      format: 'mp4',
      destinations: [destination]
    });
    expectSuccess(outputResult);
  });

  it('shape in SVG asset uses same discrimination as standalone shape schema', () => {
    const shape = { type: 'rectangle', width: 100, height: 100 };

    // Standalone shape
    const standaloneResult = schemas.svgshapesSvgShapeSchema.safeParse(shape);
    expectSuccess(standaloneResult);

    // Shape in SVG asset
    const svgResult = schemas.svgassetSvgAssetSchema.safeParse({
      type: 'svg',
      shape
    });
    expectSuccess(svgResult);
  });
});

describe('Discriminated Unions - Error Quality', () => {

  it('provides clear error for wrong discriminator value', () => {
    const result = schemas.assetAssetSchema.safeParse({
      type: 'invalid_type',
      src: 'https://example.com/file.mp4'
    });
    assert.strictEqual(result.success, false);

    // Should mention the invalid discriminator value
    const errorJson = JSON.stringify(result.error.issues);
    assert.ok(
      errorJson.includes('invalid_type') ||
      errorJson.includes('Invalid discriminator') ||
      errorJson.includes('type'),
      `Error should mention invalid type: ${errorJson}`
    );
  });

  it('provides clear error for missing discriminator', () => {
    const result = schemas.assetAssetSchema.safeParse({
      src: 'https://example.com/video.mp4'
    });
    assert.strictEqual(result.success, false);

    // Should indicate missing type field
    const errorJson = JSON.stringify(result.error.issues);
    assert.ok(
      errorJson.includes('type') ||
      errorJson.includes('required') ||
      errorJson.includes('Invalid discriminator'),
      `Error should mention missing type: ${errorJson}`
    );
  });
});
