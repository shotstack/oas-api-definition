/**
 * Enum Validation Tests - Verify that invalid enum values are rejected with explicit errors
 */

const { describe, it } = require('node:test');
const assert = require('node:assert');
const schemas = require('../dist/zod/zod.gen.cjs');
const { expectInvalidEnumError, expectSuccess } = require('./setup.cjs');

describe('Enum Validation - Invalid Values Rejected', () => {

  describe('Asset Type Enums', () => {

    it('videoAsset rejects invalid type enum', () => {
      const invalid = { type: 'invalid_type', src: 'https://example.com/video.mp4' };
      expectInvalidEnumError(schemas.videoassetVideoAssetSchema.safeParse(invalid));
    });

    it('imageAsset rejects invalid type enum', () => {
      const invalid = { type: 'wrong', src: 'https://example.com/image.jpg' };
      expectInvalidEnumError(schemas.imageassetImageAssetSchema.safeParse(invalid));
    });

    it('textAsset rejects invalid type enum', () => {
      const invalid = { type: 'txt', text: 'Hello' };
      expectInvalidEnumError(schemas.textassetTextAssetSchema.safeParse(invalid));
    });

    it('audioAsset rejects invalid type enum', () => {
      const invalid = { type: 'sound', src: 'https://example.com/audio.mp3' };
      expectInvalidEnumError(schemas.audioassetAudioAssetSchema.safeParse(invalid));
    });

    it('captionAsset rejects invalid type enum', () => {
      const invalid = { type: 'subtitle', src: 'https://example.com/captions.srt' };
      expectInvalidEnumError(schemas.captionassetCaptionAssetSchema.safeParse(invalid));
    });

    it('htmlAsset rejects invalid type enum', () => {
      const invalid = { type: 'markup', html: '<p>Test</p>' };
      expectInvalidEnumError(schemas.htmlassetHtmlAssetSchema.safeParse(invalid));
    });

    it('svgAsset rejects invalid type enum', () => {
      const invalid = { type: 'vector', shape: { type: 'rectangle', width: 100, height: 100 } };
      expectInvalidEnumError(schemas.svgassetSvgAssetSchema.safeParse(invalid));
    });
  });

  describe('Output Format Enum', () => {

    it('output accepts valid format values', () => {
      const validFormats = ['mp4', 'gif', 'mp3', 'jpg', 'png', 'bmp'];
      validFormats.forEach(format => {
        const result = schemas.outputOutputSchema.safeParse({ format });
        expectSuccess(result);
      });
    });

    it('output rejects invalid format value', () => {
      const invalid = { format: 'avi' };
      expectInvalidEnumError(schemas.outputOutputSchema.safeParse(invalid));
    });

    it('output rejects empty format', () => {
      const invalid = { format: '' };
      expectInvalidEnumError(schemas.outputOutputSchema.safeParse(invalid));
    });

    it('output rejects format with wrong case', () => {
      const invalid = { format: 'MP4' };
      expectInvalidEnumError(schemas.outputOutputSchema.safeParse(invalid));
    });
  });

  describe('Output Resolution Enum', () => {

    it('output accepts valid resolution values', () => {
      const validResolutions = ['preview', 'mobile', 'sd', 'hd', '1080', '4k'];
      validResolutions.forEach(resolution => {
        const result = schemas.outputOutputSchema.safeParse({ format: 'mp4', resolution });
        expectSuccess(result);
      });
    });

    it('output rejects invalid resolution value', () => {
      const invalid = { format: 'mp4', resolution: '8k' };
      expectInvalidEnumError(schemas.outputOutputSchema.safeParse(invalid));
    });
  });

  describe('Output Quality Enum', () => {

    it('output accepts valid quality values', () => {
      const validQualities = ['verylow', 'low', 'medium', 'high', 'veryhigh'];
      validQualities.forEach(quality => {
        const result = schemas.outputOutputSchema.safeParse({ format: 'mp4', quality });
        expectSuccess(result);
      });
    });

    it('output rejects invalid quality value', () => {
      const invalid = { format: 'mp4', quality: 'ultra' };
      expectInvalidEnumError(schemas.outputOutputSchema.safeParse(invalid));
    });
  });

  describe('Position Enum', () => {

    it('clip position accepts valid values', () => {
      const validPositions = ['top', 'topRight', 'right', 'bottomRight', 'bottom', 'bottomLeft', 'left', 'topLeft', 'center'];
      validPositions.forEach(position => {
        const clip = {
          asset: { type: 'video', src: 'https://example.com/video.mp4' },
          start: 0,
          length: 5,
          position
        };
        const result = schemas.clipClipSchema.safeParse(clip);
        expectSuccess(result);
      });
    });

    it('clip position rejects invalid value', () => {
      const clip = {
        asset: { type: 'video', src: 'https://example.com/video.mp4' },
        start: 0,
        length: 5,
        position: 'middle'
      };
      expectInvalidEnumError(schemas.clipClipSchema.safeParse(clip));
    });
  });

  describe('Fit Enum', () => {

    it('clip fit accepts valid values', () => {
      const validFits = ['cover', 'contain', 'crop', 'none'];
      validFits.forEach(fit => {
        const clip = {
          asset: { type: 'video', src: 'https://example.com/video.mp4' },
          start: 0,
          length: 5,
          fit
        };
        const result = schemas.clipClipSchema.safeParse(clip);
        expectSuccess(result);
      });
    });

    it('clip fit rejects invalid value', () => {
      const clip = {
        asset: { type: 'video', src: 'https://example.com/video.mp4' },
        start: 0,
        length: 5,
        fit: 'stretch'
      };
      expectInvalidEnumError(schemas.clipClipSchema.safeParse(clip));
    });
  });

  describe('Destination Provider Enum', () => {

    it('shotstack destination accepts valid provider', () => {
      const result = schemas.shotstackDestinationShotstackDestinationSchema.safeParse({ provider: 'shotstack' });
      expectSuccess(result);
    });

    it('shotstack destination rejects invalid provider', () => {
      const result = schemas.shotstackDestinationShotstackDestinationSchema.safeParse({ provider: 's3' });
      expectInvalidEnumError(result);
    });

    it('s3 destination accepts valid provider', () => {
      const result = schemas.s3DestinationS3DestinationSchema.safeParse({
        provider: 's3',
        options: { bucket: 'test', region: 'us-east-1' }
      });
      expectSuccess(result);
    });

    it('s3 destination rejects invalid provider', () => {
      const result = schemas.s3DestinationS3DestinationSchema.safeParse({
        provider: 'aws',
        options: { bucket: 'test', region: 'us-east-1' }
      });
      expectInvalidEnumError(result);
    });
  });

  describe('Shape Type Enum', () => {

    it('shapeAsset accepts valid shape values', () => {
      // ShapeAsset only supports 3 basic shapes
      const validShapes = ['rectangle', 'circle', 'line'];
      validShapes.forEach(shape => {
        const asset = { type: 'shape', shape };
        const result = schemas.shapeassetShapeAssetSchema.safeParse(asset);
        expectSuccess(result);
      });
    });

    it('shapeAsset rejects invalid shape value', () => {
      const asset = { type: 'shape', shape: 'hexagon' };
      expectInvalidEnumError(schemas.shapeassetShapeAssetSchema.safeParse(asset));
    });
  });

  describe('Title Style Enum', () => {

    it('titleAsset accepts valid style values', () => {
      const validStyles = ['minimal', 'blockbuster', 'vogue', 'sketchy', 'skinny'];
      validStyles.forEach(style => {
        const asset = { type: 'title', text: 'Test', style };
        const result = schemas.titleassetTitleAssetSchema.safeParse(asset);
        expectSuccess(result);
      });
    });

    it('titleAsset rejects invalid style value', () => {
      const asset = { type: 'title', text: 'Test', style: 'custom' };
      expectInvalidEnumError(schemas.titleassetTitleAssetSchema.safeParse(asset));
    });
  });

  describe('SVG Shape Type Enum', () => {

    it('svgshapesSvgShapeSchema discriminates on type correctly', () => {
      // Each SVG shape type has specific required fields
      const validTypes = [
        { type: 'rectangle', width: 100, height: 100 },
        { type: 'circle', radius: 50 },
        { type: 'ellipse', radiusX: 50, radiusY: 30 },
        { type: 'line', length: 100, thickness: 2 },
        { type: 'star', points: 5, outerRadius: 50, innerRadius: 25 },
        { type: 'heart', size: 100 },
        { type: 'cross', width: 100, height: 100, thickness: 10 },
        { type: 'ring', outerRadius: 50, innerRadius: 25 }
      ];

      validTypes.forEach(shape => {
        const result = schemas.svgshapesSvgShapeSchema.safeParse(shape);
        if (!result.success) {
          console.log(`Failed for type ${shape.type}:`, result.error.issues);
        }
        expectSuccess(result);
      });
    });

    it('svgshapesSvgShapeSchema rejects invalid type', () => {
      const invalid = { type: 'hexagon', sides: 6 };
      const result = schemas.svgshapesSvgShapeSchema.safeParse(invalid);
      assert.strictEqual(result.success, false, 'Expected parse to fail for invalid shape type');
    });
  });

  describe('Audio Effect Enum', () => {

    it('audioAsset accepts valid effect values', () => {
      const validEffects = ['none', 'fadeIn', 'fadeOut', 'fadeInFadeOut'];
      validEffects.forEach(effect => {
        const asset = { type: 'audio', src: 'https://example.com/audio.mp3', effect };
        const result = schemas.audioassetAudioAssetSchema.safeParse(asset);
        expectSuccess(result);
      });
    });

    it('audioAsset rejects invalid effect value', () => {
      const asset = { type: 'audio', src: 'https://example.com/audio.mp3', effect: 'reverb' };
      expectInvalidEnumError(schemas.audioassetAudioAssetSchema.safeParse(asset));
    });
  });
});

describe('Enum Validation - Error Messages', () => {

  it('provides meaningful error message for invalid enum', () => {
    const result = schemas.outputOutputSchema.safeParse({ format: 'avi' });
    assert.strictEqual(result.success, false);

    // Check that error message mentions the invalid value or expected values
    const errorMessage = JSON.stringify(result.error.issues);
    assert.ok(
      errorMessage.includes('avi') || errorMessage.includes('mp4') || errorMessage.includes('Invalid'),
      `Error message should be descriptive: ${errorMessage}`
    );
  });
});
