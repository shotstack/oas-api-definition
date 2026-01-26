/**
 * Strict Mode Tests - Verify that all schemas reject extra properties
 */

const { describe, it, beforeEach } = require('node:test');
const assert = require('node:assert');
const schemas = require('../dist/zod/zod.gen.cjs');
const { expectUnrecognizedKeysError, expectSuccess, withExtraProperty, validFixtures } = require('./setup.cjs');

describe('Strict Mode - Extra Property Rejection', () => {

  describe('Asset Schemas', () => {

    it('videoassetVideoAssetSchema rejects extra properties', () => {
      const valid = validFixtures.videoAsset;
      expectSuccess(schemas.videoassetVideoAssetSchema.safeParse(valid));

      const invalid = withExtraProperty(valid);
      expectUnrecognizedKeysError(schemas.videoassetVideoAssetSchema.safeParse(invalid));
    });

    it('imageassetImageAssetSchema rejects extra properties', () => {
      const valid = validFixtures.imageAsset;
      expectSuccess(schemas.imageassetImageAssetSchema.safeParse(valid));

      const invalid = withExtraProperty(valid);
      expectUnrecognizedKeysError(schemas.imageassetImageAssetSchema.safeParse(invalid));
    });

    it('textassetTextAssetSchema rejects extra properties', () => {
      const valid = validFixtures.textAsset;
      expectSuccess(schemas.textassetTextAssetSchema.safeParse(valid));

      const invalid = withExtraProperty(valid);
      expectUnrecognizedKeysError(schemas.textassetTextAssetSchema.safeParse(invalid));
    });

    it('audioassetAudioAssetSchema rejects extra properties', () => {
      const valid = validFixtures.audioAsset;
      expectSuccess(schemas.audioassetAudioAssetSchema.safeParse(valid));

      const invalid = withExtraProperty(valid);
      expectUnrecognizedKeysError(schemas.audioassetAudioAssetSchema.safeParse(invalid));
    });

    it('captionassetCaptionAssetSchema rejects extra properties', () => {
      const valid = validFixtures.captionAsset;
      expectSuccess(schemas.captionassetCaptionAssetSchema.safeParse(valid));

      const invalid = withExtraProperty(valid);
      expectUnrecognizedKeysError(schemas.captionassetCaptionAssetSchema.safeParse(invalid));
    });

    it('htmlassetHtmlAssetSchema rejects extra properties', () => {
      const valid = validFixtures.htmlAsset;
      expectSuccess(schemas.htmlassetHtmlAssetSchema.safeParse(valid));

      const invalid = withExtraProperty(valid);
      expectUnrecognizedKeysError(schemas.htmlassetHtmlAssetSchema.safeParse(invalid));
    });

    it('titleassetTitleAssetSchema rejects extra properties', () => {
      const valid = validFixtures.titleAsset;
      expectSuccess(schemas.titleassetTitleAssetSchema.safeParse(valid));

      const invalid = withExtraProperty(valid);
      expectUnrecognizedKeysError(schemas.titleassetTitleAssetSchema.safeParse(invalid));
    });

    it('shapeassetShapeAssetSchema rejects extra properties', () => {
      const valid = validFixtures.shapeAsset;
      expectSuccess(schemas.shapeassetShapeAssetSchema.safeParse(valid));

      const invalid = withExtraProperty(valid);
      expectUnrecognizedKeysError(schemas.shapeassetShapeAssetSchema.safeParse(invalid));
    });

    it('lumaassetLumaAssetSchema rejects extra properties', () => {
      const valid = validFixtures.lumaAsset;
      expectSuccess(schemas.lumaassetLumaAssetSchema.safeParse(valid));

      const invalid = withExtraProperty(valid);
      expectUnrecognizedKeysError(schemas.lumaassetLumaAssetSchema.safeParse(invalid));
    });

    it('svgassetSvgAssetSchema rejects extra properties (with shape)', () => {
      const valid = validFixtures.svgAssetWithShape;
      expectSuccess(schemas.svgassetSvgAssetSchema.safeParse(valid));

      const invalid = withExtraProperty(valid);
      expectUnrecognizedKeysError(schemas.svgassetSvgAssetSchema.safeParse(invalid));
    });
  });

  describe('Clip and Track Schemas', () => {

    it('clipClipSchema rejects extra properties', () => {
      const valid = validFixtures.clip;
      expectSuccess(schemas.clipClipSchema.safeParse(valid));

      const invalid = withExtraProperty(valid);
      expectUnrecognizedKeysError(schemas.clipClipSchema.safeParse(invalid));
    });

    it('trackTrackSchema rejects extra properties', () => {
      const valid = validFixtures.track;
      expectSuccess(schemas.trackTrackSchema.safeParse(valid));

      const invalid = withExtraProperty(valid);
      expectUnrecognizedKeysError(schemas.trackTrackSchema.safeParse(invalid));
    });
  });

  describe('Timeline and Output Schemas', () => {

    it('timelineTimelineSchema rejects extra properties', () => {
      const valid = validFixtures.timeline;
      expectSuccess(schemas.timelineTimelineSchema.safeParse(valid));

      const invalid = withExtraProperty(valid);
      expectUnrecognizedKeysError(schemas.timelineTimelineSchema.safeParse(invalid));
    });

    it('outputOutputSchema rejects extra properties', () => {
      const valid = validFixtures.output;
      expectSuccess(schemas.outputOutputSchema.safeParse(valid));

      const invalid = withExtraProperty(valid);
      expectUnrecognizedKeysError(schemas.outputOutputSchema.safeParse(invalid));
    });
  });

  describe('Edit Schema', () => {

    it('editEditSchema rejects extra properties', () => {
      const valid = validFixtures.edit;
      expectSuccess(schemas.editEditSchema.safeParse(valid));

      const invalid = withExtraProperty(valid);
      expectUnrecognizedKeysError(schemas.editEditSchema.safeParse(invalid));
    });

    it('editEditSchema rejects extra properties in nested timeline', () => {
      const invalid = {
        ...validFixtures.edit,
        timeline: withExtraProperty(validFixtures.timeline)
      };
      expectUnrecognizedKeysError(schemas.editEditSchema.safeParse(invalid));
    });

    it('editEditSchema rejects extra properties in nested output', () => {
      const invalid = {
        ...validFixtures.edit,
        output: withExtraProperty(validFixtures.output)
      };
      expectUnrecognizedKeysError(schemas.editEditSchema.safeParse(invalid));
    });

    it('editEditSchema rejects extra properties in nested track', () => {
      const invalid = {
        ...validFixtures.edit,
        timeline: {
          tracks: [withExtraProperty(validFixtures.track)]
        }
      };
      expectUnrecognizedKeysError(schemas.editEditSchema.safeParse(invalid));
    });

    it('editEditSchema rejects extra properties in nested clip', () => {
      const invalid = {
        ...validFixtures.edit,
        timeline: {
          tracks: [
            {
              clips: [withExtraProperty(validFixtures.clip)]
            }
          ]
        }
      };
      expectUnrecognizedKeysError(schemas.editEditSchema.safeParse(invalid));
    });

    it('editEditSchema rejects extra properties in nested asset', () => {
      const invalid = {
        ...validFixtures.edit,
        timeline: {
          tracks: [
            {
              clips: [
                {
                  asset: withExtraProperty(validFixtures.videoAsset),
                  start: 0,
                  length: 5
                }
              ]
            }
          ]
        }
      };
      expectUnrecognizedKeysError(schemas.editEditSchema.safeParse(invalid));
    });
  });

  describe('Destination Schemas', () => {

    it('shotstackDestinationShotstackDestinationSchema rejects extra properties', () => {
      const valid = validFixtures.shotstackDestination;
      expectSuccess(schemas.shotstackDestinationShotstackDestinationSchema.safeParse(valid));

      const invalid = withExtraProperty(valid);
      expectUnrecognizedKeysError(schemas.shotstackDestinationShotstackDestinationSchema.safeParse(invalid));
    });

    it('s3DestinationS3DestinationSchema rejects extra properties', () => {
      const valid = validFixtures.s3Destination;
      expectSuccess(schemas.s3DestinationS3DestinationSchema.safeParse(valid));

      const invalid = withExtraProperty(valid);
      expectUnrecognizedKeysError(schemas.s3DestinationS3DestinationSchema.safeParse(invalid));
    });

    it('muxDestinationMuxDestinationSchema rejects extra properties', () => {
      const valid = validFixtures.muxDestination;
      expectSuccess(schemas.muxDestinationMuxDestinationSchema.safeParse(valid));

      const invalid = withExtraProperty(valid);
      expectUnrecognizedKeysError(schemas.muxDestinationMuxDestinationSchema.safeParse(invalid));
    });
  });

  describe('Property Schemas', () => {

    it('captionpropertiesCaptionFontSchema rejects extra properties', () => {
      const valid = { family: 'Arial', color: '#ffffff' };
      expectSuccess(schemas.captionpropertiesCaptionFontSchema.safeParse(valid));

      const invalid = withExtraProperty(valid);
      expectUnrecognizedKeysError(schemas.captionpropertiesCaptionFontSchema.safeParse(invalid));
    });

    it('captionpropertiesCaptionBackgroundSchema rejects extra properties', () => {
      const valid = { color: '#000000', opacity: 0.5 };
      expectSuccess(schemas.captionpropertiesCaptionBackgroundSchema.safeParse(valid));

      const invalid = withExtraProperty(valid);
      expectUnrecognizedKeysError(schemas.captionpropertiesCaptionBackgroundSchema.safeParse(invalid));
    });

    it('cropCropSchema rejects extra properties', () => {
      const valid = { top: 0.1, bottom: 0.1 };
      expectSuccess(schemas.cropCropSchema.safeParse(valid));

      const invalid = withExtraProperty(valid);
      expectUnrecognizedKeysError(schemas.cropCropSchema.safeParse(invalid));
    });

    it('offsetOffsetSchema rejects extra properties', () => {
      const valid = { x: 0.5, y: 0.5 };
      expectSuccess(schemas.offsetOffsetSchema.safeParse(valid));

      const invalid = withExtraProperty(valid);
      expectUnrecognizedKeysError(schemas.offsetOffsetSchema.safeParse(invalid));
    });
  });

  describe('MergeField Schema', () => {

    it('mergefieldMergeFieldSchema rejects extra properties', () => {
      const valid = { find: 'NAME', replace: 'John' };
      expectSuccess(schemas.mergefieldMergeFieldSchema.safeParse(valid));

      const invalid = withExtraProperty(valid);
      expectUnrecognizedKeysError(schemas.mergefieldMergeFieldSchema.safeParse(invalid));
    });

    it('mergefieldMergeFieldSchema accepts various replace value types', () => {
      expectSuccess(schemas.mergefieldMergeFieldSchema.safeParse({ find: 'A', replace: 'string' }));
      expectSuccess(schemas.mergefieldMergeFieldSchema.safeParse({ find: 'B', replace: 123 }));
      expectSuccess(schemas.mergefieldMergeFieldSchema.safeParse({ find: 'C', replace: true }));
      expectSuccess(schemas.mergefieldMergeFieldSchema.safeParse({ find: 'D', replace: null }));
      expectSuccess(schemas.mergefieldMergeFieldSchema.safeParse({ find: 'E', replace: { key: 'value' } }));
      expectSuccess(schemas.mergefieldMergeFieldSchema.safeParse({ find: 'F', replace: ['a', 'b'] }));
    });
  });
});

describe('Strict Mode - Nested Depth Testing', () => {

  it('rejects extra properties at depth 1 (timeline)', () => {
    const edit = {
      timeline: { ...validFixtures.timeline, deepExtra1: 'fail' },
      output: validFixtures.output
    };
    expectUnrecognizedKeysError(schemas.editEditSchema.safeParse(edit));
  });

  it('rejects extra properties at depth 2 (track)', () => {
    const edit = {
      timeline: {
        tracks: [{ ...validFixtures.track, deepExtra2: 'fail' }]
      },
      output: validFixtures.output
    };
    expectUnrecognizedKeysError(schemas.editEditSchema.safeParse(edit));
  });

  it('rejects extra properties at depth 3 (clip)', () => {
    const edit = {
      timeline: {
        tracks: [{
          clips: [{ ...validFixtures.clip, deepExtra3: 'fail' }]
        }]
      },
      output: validFixtures.output
    };
    expectUnrecognizedKeysError(schemas.editEditSchema.safeParse(edit));
  });

  it('rejects extra properties at depth 4 (asset)', () => {
    const edit = {
      timeline: {
        tracks: [{
          clips: [{
            asset: { ...validFixtures.videoAsset, deepExtra4: 'fail' },
            start: 0,
            length: 5
          }]
        }]
      },
      output: validFixtures.output
    };
    expectUnrecognizedKeysError(schemas.editEditSchema.safeParse(edit));
  });
});
