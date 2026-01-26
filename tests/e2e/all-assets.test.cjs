/**
 * E2E Tests for All Asset Types - Comprehensive testing of each asset type
 */

const { describe, it } = require('node:test');
const assert = require('node:assert');
const schemas = require('../../dist/zod/zod.gen.cjs');
const { expectSuccess, expectUnrecognizedKeysError, expectInvalidEnumError } = require('../setup.cjs');

describe('E2E - Video Asset', () => {

  it('accepts minimal video asset', () => {
    const asset = { type: 'video', src: 'https://example.com/video.mp4' };
    expectSuccess(schemas.videoassetVideoAssetSchema.safeParse(asset));
  });

  it('accepts video asset with all optional properties', () => {
    const asset = {
      type: 'video',
      src: 'https://example.com/video.mp4',
      trim: 5,
      volume: 0.5,
      volumeEffect: 'fadeIn',
      speed: 1.5,
      crop: { top: 0.1, bottom: 0.1, left: 0.1, right: 0.1 }
    };
    expectSuccess(schemas.videoassetVideoAssetSchema.safeParse(asset));
  });

  it('rejects video asset with missing src', () => {
    const asset = { type: 'video' };
    const result = schemas.videoassetVideoAssetSchema.safeParse(asset);
    assert.strictEqual(result.success, false);
  });

  it('rejects video asset with extra property', () => {
    const asset = { type: 'video', src: 'https://example.com/video.mp4', extra: 'fail' };
    expectUnrecognizedKeysError(schemas.videoassetVideoAssetSchema.safeParse(asset));
  });

  it('rejects video asset with wrong type', () => {
    const asset = { type: 'audio', src: 'https://example.com/video.mp4' };
    expectInvalidEnumError(schemas.videoassetVideoAssetSchema.safeParse(asset));
  });
});

describe('E2E - Image Asset', () => {

  it('accepts minimal image asset', () => {
    const asset = { type: 'image', src: 'https://example.com/image.jpg' };
    expectSuccess(schemas.imageassetImageAssetSchema.safeParse(asset));
  });

  it('accepts image asset with crop', () => {
    const asset = {
      type: 'image',
      src: 'https://example.com/image.jpg',
      crop: { top: 0.2, bottom: 0.2 }
    };
    expectSuccess(schemas.imageassetImageAssetSchema.safeParse(asset));
  });

  it('rejects image asset with missing src', () => {
    const asset = { type: 'image' };
    const result = schemas.imageassetImageAssetSchema.safeParse(asset);
    assert.strictEqual(result.success, false);
  });

  it('rejects image asset with extra property', () => {
    const asset = { type: 'image', src: 'https://example.com/image.jpg', extra: 'fail' };
    expectUnrecognizedKeysError(schemas.imageassetImageAssetSchema.safeParse(asset));
  });
});

describe('E2E - Text Asset', () => {

  it('accepts minimal text asset', () => {
    const asset = { type: 'text', text: 'Hello World' };
    expectSuccess(schemas.textassetTextAssetSchema.safeParse(asset));
  });

  it('accepts text asset with all styling options', () => {
    const asset = {
      type: 'text',
      text: 'Styled Text',
      font: {
        family: 'Arial',
        size: 24,
        color: '#ffffff',
        weight: 700
      },
      alignment: { horizontal: 'center', vertical: 'center' },
      background: {
        color: '#000000',
        opacity: 0.5
      }
    };
    expectSuccess(schemas.textassetTextAssetSchema.safeParse(asset));
  });

  it('accepts text asset with empty text', () => {
    const asset = { type: 'text', text: '' };
    expectSuccess(schemas.textassetTextAssetSchema.safeParse(asset));
  });

  it('rejects text asset with missing text', () => {
    const asset = { type: 'text' };
    const result = schemas.textassetTextAssetSchema.safeParse(asset);
    assert.strictEqual(result.success, false);
  });

  it('rejects text asset with extra property', () => {
    const asset = { type: 'text', text: 'Hello', extra: 'fail' };
    expectUnrecognizedKeysError(schemas.textassetTextAssetSchema.safeParse(asset));
  });
});

describe('E2E - Audio Asset', () => {

  it('accepts minimal audio asset', () => {
    const asset = { type: 'audio', src: 'https://example.com/audio.mp3' };
    expectSuccess(schemas.audioassetAudioAssetSchema.safeParse(asset));
  });

  it('accepts audio asset with all options', () => {
    const asset = {
      type: 'audio',
      src: 'https://example.com/audio.mp3',
      trim: 10,
      volume: 0.8,
      effect: 'fadeInFadeOut',
      speed: 1.0
    };
    expectSuccess(schemas.audioassetAudioAssetSchema.safeParse(asset));
  });

  it('rejects audio asset with invalid effect', () => {
    const asset = { type: 'audio', src: 'https://example.com/audio.mp3', effect: 'invalid' };
    expectInvalidEnumError(schemas.audioassetAudioAssetSchema.safeParse(asset));
  });

  it('rejects audio asset with extra property', () => {
    const asset = { type: 'audio', src: 'https://example.com/audio.mp3', extra: 'fail' };
    expectUnrecognizedKeysError(schemas.audioassetAudioAssetSchema.safeParse(asset));
  });
});

describe('E2E - Caption Asset', () => {

  it('accepts minimal caption asset', () => {
    const asset = { type: 'caption', src: 'https://example.com/captions.srt' };
    expectSuccess(schemas.captionassetCaptionAssetSchema.safeParse(asset));
  });

  it('accepts caption asset with font styling', () => {
    const asset = {
      type: 'caption',
      src: 'https://example.com/captions.srt',
      font: {
        family: 'Arial',
        size: 16,
        color: '#ffffff'
      },
      background: {
        color: '#000000',
        opacity: 0.7
      }
    };
    expectSuccess(schemas.captionassetCaptionAssetSchema.safeParse(asset));
  });

  it('rejects caption asset with missing src', () => {
    const asset = { type: 'caption' };
    const result = schemas.captionassetCaptionAssetSchema.safeParse(asset);
    assert.strictEqual(result.success, false);
  });

  it('rejects caption asset with extra property', () => {
    const asset = { type: 'caption', src: 'https://example.com/captions.srt', extra: 'fail' };
    expectUnrecognizedKeysError(schemas.captionassetCaptionAssetSchema.safeParse(asset));
  });
});

describe('E2E - HTML Asset', () => {

  it('accepts minimal html asset', () => {
    const asset = { type: 'html', html: '<p>Hello</p>' };
    expectSuccess(schemas.htmlassetHtmlAssetSchema.safeParse(asset));
  });

  it('accepts html asset with complex html', () => {
    const asset = {
      type: 'html',
      html: '<div style="color: red;"><h1>Title</h1><p>Content</p></div>'
    };
    expectSuccess(schemas.htmlassetHtmlAssetSchema.safeParse(asset));
  });

  it('accepts html asset with empty html', () => {
    const asset = { type: 'html', html: '' };
    expectSuccess(schemas.htmlassetHtmlAssetSchema.safeParse(asset));
  });

  it('rejects html asset with missing html', () => {
    const asset = { type: 'html' };
    const result = schemas.htmlassetHtmlAssetSchema.safeParse(asset);
    assert.strictEqual(result.success, false);
  });

  it('rejects html asset with extra property', () => {
    const asset = { type: 'html', html: '<p>Test</p>', extra: 'fail' };
    expectUnrecognizedKeysError(schemas.htmlassetHtmlAssetSchema.safeParse(asset));
  });
});

describe('E2E - Title Asset', () => {

  it('accepts minimal title asset', () => {
    const asset = { type: 'title', text: 'My Title', style: 'minimal' };
    expectSuccess(schemas.titleassetTitleAssetSchema.safeParse(asset));
  });

  it('accepts title asset with all styles', () => {
    const styles = ['minimal', 'blockbuster', 'vogue', 'sketchy', 'skinny'];
    styles.forEach(style => {
      const asset = { type: 'title', text: 'Test', style };
      expectSuccess(schemas.titleassetTitleAssetSchema.safeParse(asset));
    });
  });

  it('rejects title asset with invalid style', () => {
    const asset = { type: 'title', text: 'Test', style: 'invalid' };
    expectInvalidEnumError(schemas.titleassetTitleAssetSchema.safeParse(asset));
  });

  it('rejects title asset with missing text', () => {
    const asset = { type: 'title', style: 'minimal' };
    const result = schemas.titleassetTitleAssetSchema.safeParse(asset);
    assert.strictEqual(result.success, false);
  });

  it('rejects title asset with extra property', () => {
    const asset = { type: 'title', text: 'Test', style: 'minimal', extra: 'fail' };
    expectUnrecognizedKeysError(schemas.titleassetTitleAssetSchema.safeParse(asset));
  });
});

describe('E2E - Shape Asset', () => {

  it('accepts minimal shape asset', () => {
    const asset = { type: 'shape', shape: 'rectangle' };
    expectSuccess(schemas.shapeassetShapeAssetSchema.safeParse(asset));
  });

  it('accepts shape asset with all shape types', () => {
    // ShapeAsset only supports 3 basic shapes
    const shapes = ['rectangle', 'circle', 'line'];
    shapes.forEach(shape => {
      const asset = { type: 'shape', shape };
      expectSuccess(schemas.shapeassetShapeAssetSchema.safeParse(asset));
    });
  });

  it('accepts shape asset with styling', () => {
    const asset = {
      type: 'shape',
      shape: 'rectangle',
      fill: { color: '#ff0000' },
      stroke: { color: '#000000', width: 2 }
    };
    expectSuccess(schemas.shapeassetShapeAssetSchema.safeParse(asset));
  });

  it('rejects shape asset with invalid shape', () => {
    const asset = { type: 'shape', shape: 'hexagon' };
    expectInvalidEnumError(schemas.shapeassetShapeAssetSchema.safeParse(asset));
  });

  it('rejects shape asset with extra property', () => {
    const asset = { type: 'shape', shape: 'rectangle', extra: 'fail' };
    expectUnrecognizedKeysError(schemas.shapeassetShapeAssetSchema.safeParse(asset));
  });
});

describe('E2E - Luma Asset', () => {

  it('accepts minimal luma asset', () => {
    const asset = { type: 'luma', src: 'https://example.com/luma.mp4' };
    expectSuccess(schemas.lumaassetLumaAssetSchema.safeParse(asset));
  });

  it('accepts luma asset with trim', () => {
    const asset = { type: 'luma', src: 'https://example.com/luma.mp4', trim: 5 };
    expectSuccess(schemas.lumaassetLumaAssetSchema.safeParse(asset));
  });

  it('rejects luma asset with missing src', () => {
    const asset = { type: 'luma' };
    const result = schemas.lumaassetLumaAssetSchema.safeParse(asset);
    assert.strictEqual(result.success, false);
  });

  it('rejects luma asset with extra property', () => {
    const asset = { type: 'luma', src: 'https://example.com/luma.mp4', extra: 'fail' };
    expectUnrecognizedKeysError(schemas.lumaassetLumaAssetSchema.safeParse(asset));
  });
});

describe('E2E - SVG Asset', () => {

  describe('SVG Asset with Shape', () => {

    it('accepts SVG asset with rectangle shape', () => {
      const asset = {
        type: 'svg',
        shape: { type: 'rectangle', width: 100, height: 100 }
      };
      expectSuccess(schemas.svgassetSvgAssetSchema.safeParse(asset));
    });

    it('accepts SVG asset with circle shape', () => {
      const asset = {
        type: 'svg',
        shape: { type: 'circle', radius: 50 }
      };
      expectSuccess(schemas.svgassetSvgAssetSchema.safeParse(asset));
    });

    it('accepts SVG asset with ellipse shape', () => {
      const asset = {
        type: 'svg',
        shape: { type: 'ellipse', radiusX: 50, radiusY: 30 }
      };
      expectSuccess(schemas.svgassetSvgAssetSchema.safeParse(asset));
    });

    it('accepts SVG asset with line shape', () => {
      const asset = {
        type: 'svg',
        shape: { type: 'line', length: 100, thickness: 2 }
      };
      expectSuccess(schemas.svgassetSvgAssetSchema.safeParse(asset));
    });

    it('accepts SVG asset with star shape', () => {
      const asset = {
        type: 'svg',
        shape: { type: 'star', points: 5, outerRadius: 50, innerRadius: 25 }
      };
      expectSuccess(schemas.svgassetSvgAssetSchema.safeParse(asset));
    });

    it('accepts SVG asset with heart shape', () => {
      const asset = {
        type: 'svg',
        shape: { type: 'heart', size: 100 }
      };
      expectSuccess(schemas.svgassetSvgAssetSchema.safeParse(asset));
    });

    it('accepts SVG asset with cross shape', () => {
      const asset = {
        type: 'svg',
        shape: { type: 'cross', width: 100, height: 100, thickness: 10 }
      };
      expectSuccess(schemas.svgassetSvgAssetSchema.safeParse(asset));
    });

    it('accepts SVG asset with ring shape', () => {
      const asset = {
        type: 'svg',
        shape: { type: 'ring', outerRadius: 50, innerRadius: 25 }
      };
      expectSuccess(schemas.svgassetSvgAssetSchema.safeParse(asset));
    });

    it('rejects SVG asset with shape with extra property in shape', () => {
      const asset = {
        type: 'svg',
        shape: { type: 'rectangle', width: 100, height: 100, extra: 'fail' }
      };
      expectUnrecognizedKeysError(schemas.svgassetSvgAssetSchema.safeParse(asset));
    });
  });

  describe('SVG Asset with Src', () => {

    it('accepts SVG asset with src string', () => {
      const asset = { type: 'svg', src: '<svg></svg>' };
      expectSuccess(schemas.svgassetSvgAssetSchema.safeParse(asset));
    });

    it('accepts SVG asset with complex SVG src', () => {
      const asset = {
        type: 'svg',
        src: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="40"/></svg>'
      };
      expectSuccess(schemas.svgassetSvgAssetSchema.safeParse(asset));
    });
  });

  describe('SVG Asset Mutual Exclusivity', () => {

    it('rejects SVG asset with both shape and src', () => {
      const asset = {
        type: 'svg',
        shape: { type: 'rectangle', width: 100, height: 100 },
        src: '<svg></svg>'
      };
      const result = schemas.svgassetSvgAssetSchema.safeParse(asset);
      assert.strictEqual(result.success, false);
    });

    it('rejects SVG asset with neither shape nor src', () => {
      const asset = { type: 'svg' };
      const result = schemas.svgassetSvgAssetSchema.safeParse(asset);
      assert.strictEqual(result.success, false);
    });
  });

  it('rejects SVG asset with extra property at top level', () => {
    const asset = {
      type: 'svg',
      shape: { type: 'rectangle', width: 100, height: 100 },
      extra: 'fail'
    };
    expectUnrecognizedKeysError(schemas.svgassetSvgAssetSchema.safeParse(asset));
  });
});

describe('E2E - Asset Integration in Clip', () => {

  it('each asset type works within a clip', () => {
    const assets = [
      { type: 'video', src: 'https://example.com/video.mp4' },
      { type: 'image', src: 'https://example.com/image.jpg' },
      { type: 'text', text: 'Hello' },
      { type: 'audio', src: 'https://example.com/audio.mp3' },
      { type: 'caption', src: 'https://example.com/captions.srt' },
      { type: 'html', html: '<p>Test</p>' },
      { type: 'title', text: 'Title', style: 'minimal' },
      { type: 'shape', shape: 'rectangle' },
      { type: 'luma', src: 'https://example.com/luma.mp4' },
      { type: 'svg', shape: { type: 'circle', radius: 50 } }
    ];

    assets.forEach(asset => {
      const clip = { asset, start: 0, length: 5 };
      const result = schemas.clipClipSchema.safeParse(clip);
      expectSuccess(result);
    });
  });

  it('each asset type works within full edit schema', () => {
    const assets = [
      { type: 'video', src: 'https://example.com/video.mp4' },
      { type: 'image', src: 'https://example.com/image.jpg' },
      { type: 'text', text: 'Hello' },
      { type: 'audio', src: 'https://example.com/audio.mp3' },
      { type: 'caption', src: 'https://example.com/captions.srt' },
      { type: 'html', html: '<p>Test</p>' },
      { type: 'title', text: 'Title', style: 'minimal' },
      { type: 'shape', shape: 'rectangle' },
      { type: 'luma', src: 'https://example.com/luma.mp4' },
      { type: 'svg', src: '<svg></svg>' }
    ];

    assets.forEach(asset => {
      const edit = {
        timeline: {
          tracks: [{
            clips: [{ asset, start: 0, length: 5 }]
          }]
        },
        output: { format: 'mp4' }
      };
      const result = schemas.editEditSchema.safeParse(edit);
      expectSuccess(result);
    });
  });
});

describe('E2E - Asset Type Boundaries', () => {

  it('video asset rejects image-only properties', () => {
    // This tests that video-specific schema is properly isolated
    const asset = {
      type: 'video',
      src: 'https://example.com/video.mp4',
      style: 'minimal' // This is a title property
    };
    expectUnrecognizedKeysError(schemas.videoassetVideoAssetSchema.safeParse(asset));
  });

  it('text asset rejects video-only properties', () => {
    const asset = {
      type: 'text',
      text: 'Hello',
      trim: 5 // This is a video property
    };
    expectUnrecognizedKeysError(schemas.textassetTextAssetSchema.safeParse(asset));
  });

  it('audio asset rejects text-only properties', () => {
    const asset = {
      type: 'audio',
      src: 'https://example.com/audio.mp3',
      text: 'This should not be here' // This is a text property
    };
    expectUnrecognizedKeysError(schemas.audioassetAudioAssetSchema.safeParse(asset));
  });
});
