/**
 * E2E Tests for All Destination Types - Comprehensive testing of each destination type
 */

const { describe, it } = require('node:test');
const assert = require('node:assert');
const schemas = require('../../dist/zod/zod.gen.cjs');
const { expectSuccess, expectUnrecognizedKeysError, expectInvalidEnumError } = require('../setup.cjs');

describe('E2E - Shotstack Destination', () => {

  it('accepts minimal shotstack destination', () => {
    const destination = { provider: 'shotstack' };
    expectSuccess(schemas.shotstackDestinationShotstackDestinationSchema.safeParse(destination));
  });

  it('accepts shotstack destination with exclude option', () => {
    const destination = { provider: 'shotstack', exclude: true };
    expectSuccess(schemas.shotstackDestinationShotstackDestinationSchema.safeParse(destination));
  });

  it('rejects shotstack destination with wrong provider', () => {
    const destination = { provider: 's3' };
    expectInvalidEnumError(schemas.shotstackDestinationShotstackDestinationSchema.safeParse(destination));
  });

  it('rejects shotstack destination with extra property', () => {
    const destination = { provider: 'shotstack', extra: 'fail' };
    expectUnrecognizedKeysError(schemas.shotstackDestinationShotstackDestinationSchema.safeParse(destination));
  });
});

describe('E2E - S3 Destination', () => {

  it('accepts minimal s3 destination', () => {
    const destination = {
      provider: 's3',
      options: { bucket: 'my-bucket', region: 'us-east-1' }
    };
    expectSuccess(schemas.s3DestinationS3DestinationSchema.safeParse(destination));
  });

  it('accepts s3 destination with all options', () => {
    const destination = {
      provider: 's3',
      options: {
        bucket: 'my-bucket',
        region: 'us-east-1',
        prefix: 'videos/',
        filename: 'output.mp4',
        acl: 'public-read'
      }
    };
    expectSuccess(schemas.s3DestinationS3DestinationSchema.safeParse(destination));
  });

  it('rejects s3 destination with missing bucket', () => {
    const destination = {
      provider: 's3',
      options: { region: 'us-east-1' }
    };
    const result = schemas.s3DestinationS3DestinationSchema.safeParse(destination);
    assert.strictEqual(result.success, false);
  });

  it('rejects s3 destination with missing region', () => {
    const destination = {
      provider: 's3',
      options: { bucket: 'my-bucket' }
    };
    const result = schemas.s3DestinationS3DestinationSchema.safeParse(destination);
    assert.strictEqual(result.success, false);
  });

  it('rejects s3 destination with wrong provider', () => {
    const destination = {
      provider: 'shotstack',
      options: { bucket: 'my-bucket', region: 'us-east-1' }
    };
    expectInvalidEnumError(schemas.s3DestinationS3DestinationSchema.safeParse(destination));
  });

  it('rejects s3 destination with extra property at top level', () => {
    const destination = {
      provider: 's3',
      options: { bucket: 'my-bucket', region: 'us-east-1' },
      extra: 'fail'
    };
    expectUnrecognizedKeysError(schemas.s3DestinationS3DestinationSchema.safeParse(destination));
  });

  it('rejects s3 destination with extra property in options', () => {
    const destination = {
      provider: 's3',
      options: { bucket: 'my-bucket', region: 'us-east-1', extra: 'fail' }
    };
    expectUnrecognizedKeysError(schemas.s3DestinationS3DestinationSchema.safeParse(destination));
  });
});

describe('E2E - Mux Destination', () => {

  it('accepts minimal mux destination', () => {
    const destination = { provider: 'mux' };
    expectSuccess(schemas.muxDestinationMuxDestinationSchema.safeParse(destination));
  });

  it('accepts mux destination with options', () => {
    const destination = {
      provider: 'mux',
      options: {
        playbackPolicy: ['public']
      }
    };
    expectSuccess(schemas.muxDestinationMuxDestinationSchema.safeParse(destination));
  });

  it('rejects mux destination with wrong provider', () => {
    const destination = { provider: 'youtube' };
    expectInvalidEnumError(schemas.muxDestinationMuxDestinationSchema.safeParse(destination));
  });

  it('rejects mux destination with extra property', () => {
    const destination = { provider: 'mux', extra: 'fail' };
    expectUnrecognizedKeysError(schemas.muxDestinationMuxDestinationSchema.safeParse(destination));
  });
});

describe('E2E - Google Drive Destination', () => {

  it('accepts google drive destination with required options', () => {
    const destination = {
      provider: 'google-drive',
      options: { folderId: 'folder123' }
    };
    expectSuccess(schemas.googleDriveDestinationGoogleDriveDestinationSchema.safeParse(destination));
  });

  it('accepts google drive destination with all options', () => {
    const destination = {
      provider: 'google-drive',
      options: {
        folderId: 'folder123',
        filename: 'output.mp4'
      }
    };
    expectSuccess(schemas.googleDriveDestinationGoogleDriveDestinationSchema.safeParse(destination));
  });

  it('rejects google drive destination with missing folderId', () => {
    const destination = {
      provider: 'google-drive',
      options: {}
    };
    const result = schemas.googleDriveDestinationGoogleDriveDestinationSchema.safeParse(destination);
    assert.strictEqual(result.success, false);
  });

  it('rejects google drive destination without options', () => {
    const destination = {
      provider: 'google-drive'
    };
    const result = schemas.googleDriveDestinationGoogleDriveDestinationSchema.safeParse(destination);
    assert.strictEqual(result.success, false);
  });

  it('rejects google drive destination with extra property', () => {
    const destination = {
      provider: 'google-drive',
      options: { folderId: 'folder123' },
      extra: 'fail'
    };
    expectUnrecognizedKeysError(schemas.googleDriveDestinationGoogleDriveDestinationSchema.safeParse(destination));
  });
});

describe('E2E - Google Cloud Destination', () => {

  it('accepts minimal google cloud destination', () => {
    const destination = {
      provider: 'google-cloud-storage',
      options: { bucket: 'my-bucket' }
    };
    expectSuccess(schemas.googleCloudStorageDestinationGoogleCloudStorageDestinationSchema.safeParse(destination));
  });

  it('accepts google cloud destination with all options', () => {
    const destination = {
      provider: 'google-cloud-storage',
      options: {
        bucket: 'my-bucket',
        prefix: 'videos/',
        filename: 'output.mp4'
      }
    };
    expectSuccess(schemas.googleCloudStorageDestinationGoogleCloudStorageDestinationSchema.safeParse(destination));
  });

  it('rejects google cloud destination with missing bucket', () => {
    const destination = {
      provider: 'google-cloud-storage',
      options: {}
    };
    const result = schemas.googleCloudStorageDestinationGoogleCloudStorageDestinationSchema.safeParse(destination);
    assert.strictEqual(result.success, false);
  });

  it('rejects google cloud destination with extra property', () => {
    const destination = {
      provider: 'google-cloud-storage',
      options: { bucket: 'my-bucket' },
      extra: 'fail'
    };
    expectUnrecognizedKeysError(schemas.googleCloudStorageDestinationGoogleCloudStorageDestinationSchema.safeParse(destination));
  });
});

describe('E2E - Vimeo Destination', () => {

  it('accepts minimal vimeo destination', () => {
    const destination = { provider: 'vimeo' };
    expectSuccess(schemas.vimeoDestinationVimeoDestinationSchema.safeParse(destination));
  });

  it('accepts vimeo destination with options', () => {
    const destination = {
      provider: 'vimeo',
      options: {
        name: 'My Video',
        description: 'Video description',
        privacy: { view: 'anybody' }
      }
    };
    expectSuccess(schemas.vimeoDestinationVimeoDestinationSchema.safeParse(destination));
  });

  it('rejects vimeo destination with wrong provider', () => {
    const destination = { provider: 'youtube' };
    expectInvalidEnumError(schemas.vimeoDestinationVimeoDestinationSchema.safeParse(destination));
  });

  it('rejects vimeo destination with extra property', () => {
    const destination = { provider: 'vimeo', extra: 'fail' };
    expectUnrecognizedKeysError(schemas.vimeoDestinationVimeoDestinationSchema.safeParse(destination));
  });
});

describe('E2E - TikTok Destination', () => {

  it('accepts minimal tiktok destination', () => {
    const destination = { provider: 'tiktok' };
    expectSuccess(schemas.tiktokDestinationTiktokDestinationSchema.safeParse(destination));
  });

  it('accepts tiktok destination with options', () => {
    const destination = {
      provider: 'tiktok',
      options: {
        title: 'My TikTok Video',
        privacyLevel: 'private',
        disableDuet: true,
        disableStitch: false,
        disableComment: false
      }
    };
    expectSuccess(schemas.tiktokDestinationTiktokDestinationSchema.safeParse(destination));
  });

  it('rejects tiktok destination with wrong provider', () => {
    const destination = { provider: 'vimeo' };
    expectInvalidEnumError(schemas.tiktokDestinationTiktokDestinationSchema.safeParse(destination));
  });

  it('rejects tiktok destination with extra property', () => {
    const destination = { provider: 'tiktok', extra: 'fail' };
    expectUnrecognizedKeysError(schemas.tiktokDestinationTiktokDestinationSchema.safeParse(destination));
  });
});

describe('E2E - Destinations Union Schema', () => {

  it('correctly discriminates all destination types', () => {
    const destinations = [
      { provider: 'shotstack' },
      { provider: 's3', options: { bucket: 'b', region: 'r' } },
      { provider: 'mux' },
      { provider: 'google-cloud-storage' },
      { provider: 'google-drive', options: { folderId: 'folder123' } },
      { provider: 'vimeo' },
      { provider: 'tiktok' }
    ];

    destinations.forEach(destination => {
      const result = schemas.destinationsDestinationsSchema.safeParse(destination);
      expectSuccess(result);
    });
  });

  it('rejects unknown destination provider', () => {
    const destination = { provider: 'unknown' };
    const result = schemas.destinationsDestinationsSchema.safeParse(destination);
    assert.strictEqual(result.success, false);
  });

  it('rejects destination with extra properties through union', () => {
    const destination = { provider: 'shotstack', extra: 'fail' };
    expectUnrecognizedKeysError(schemas.destinationsDestinationsSchema.safeParse(destination));
  });
});

describe('E2E - Destinations in Output Schema', () => {

  it('accepts output with single destination', () => {
    const output = {
      format: 'mp4',
      destinations: [{ provider: 'shotstack' }]
    };
    expectSuccess(schemas.outputOutputSchema.safeParse(output));
  });

  it('accepts output with multiple destinations', () => {
    const output = {
      format: 'mp4',
      destinations: [
        { provider: 'shotstack' },
        { provider: 's3', options: { bucket: 'my-bucket', region: 'us-east-1' } },
        { provider: 'mux' }
      ]
    };
    expectSuccess(schemas.outputOutputSchema.safeParse(output));
  });

  it('accepts output with all destination types', () => {
    const output = {
      format: 'mp4',
      destinations: [
        { provider: 'shotstack' },
        { provider: 's3', options: { bucket: 'b', region: 'r' } },
        { provider: 'mux' },
        { provider: 'google-cloud-storage' },
        { provider: 'google-drive', options: { folderId: 'folder123' } },
        { provider: 'vimeo' },
        { provider: 'tiktok' }
      ]
    };
    expectSuccess(schemas.outputOutputSchema.safeParse(output));
  });

  it('rejects output with invalid destination in array', () => {
    const output = {
      format: 'mp4',
      destinations: [
        { provider: 'shotstack' },
        { provider: 'invalid' }
      ]
    };
    const result = schemas.outputOutputSchema.safeParse(output);
    assert.strictEqual(result.success, false);
  });

  it('rejects output with destination with extra property', () => {
    const output = {
      format: 'mp4',
      destinations: [
        { provider: 'shotstack', extra: 'fail' }
      ]
    };
    expectUnrecognizedKeysError(schemas.outputOutputSchema.safeParse(output));
  });
});

describe('E2E - Destinations in Full Edit Schema', () => {

  it('accepts edit with destinations', () => {
    const edit = {
      timeline: {
        tracks: [{
          clips: [{
            asset: { type: 'video', src: 'https://example.com/video.mp4' },
            start: 0,
            length: 5
          }]
        }]
      },
      output: {
        format: 'mp4',
        destinations: [
          { provider: 'shotstack' },
          { provider: 's3', options: { bucket: 'my-bucket', region: 'us-east-1' } }
        ]
      }
    };
    expectSuccess(schemas.editEditSchema.safeParse(edit));
  });

  it('rejects edit with invalid destination provider', () => {
    const edit = {
      timeline: {
        tracks: [{
          clips: [{
            asset: { type: 'video', src: 'https://example.com/video.mp4' },
            start: 0,
            length: 5
          }]
        }]
      },
      output: {
        format: 'mp4',
        destinations: [
          { provider: 'invalid-provider' }
        ]
      }
    };
    const result = schemas.editEditSchema.safeParse(edit);
    assert.strictEqual(result.success, false);
  });

  it('rejects edit with destination extra property', () => {
    const edit = {
      timeline: {
        tracks: [{
          clips: [{
            asset: { type: 'video', src: 'https://example.com/video.mp4' },
            start: 0,
            length: 5
          }]
        }]
      },
      output: {
        format: 'mp4',
        destinations: [
          { provider: 'shotstack', unknownProp: 'should fail' }
        ]
      }
    };
    expectUnrecognizedKeysError(schemas.editEditSchema.safeParse(edit));
  });
});

describe('E2E - Destination Option Strictness', () => {

  it('rejects s3 options with extra property', () => {
    const destination = {
      provider: 's3',
      options: {
        bucket: 'my-bucket',
        region: 'us-east-1',
        unknownOption: 'should fail'
      }
    };
    expectUnrecognizedKeysError(schemas.s3DestinationS3DestinationSchema.safeParse(destination));
  });

  it('rejects google drive options with extra property', () => {
    const destination = {
      provider: 'google-drive',
      options: {
        folderId: 'folder123',
        unknownOption: 'should fail'
      }
    };
    expectUnrecognizedKeysError(schemas.googleDriveDestinationGoogleDriveDestinationSchema.safeParse(destination));
  });

  it('rejects google cloud options with extra property', () => {
    const destination = {
      provider: 'google-cloud-storage',
      options: {
        bucket: 'my-bucket',
        unknownOption: 'should fail'
      }
    };
    expectUnrecognizedKeysError(schemas.googleCloudStorageDestinationGoogleCloudStorageDestinationSchema.safeParse(destination));
  });

  it('rejects vimeo options with extra property', () => {
    const destination = {
      provider: 'vimeo',
      options: {
        name: 'My Video',
        unknownOption: 'should fail'
      }
    };
    expectUnrecognizedKeysError(schemas.vimeoDestinationVimeoDestinationSchema.safeParse(destination));
  });

  it('rejects mux options with extra property', () => {
    const destination = {
      provider: 'mux',
      options: {
        playbackPolicy: ['public'],
        unknownOption: 'should fail'
      }
    };
    expectUnrecognizedKeysError(schemas.muxDestinationMuxDestinationSchema.safeParse(destination));
  });

  it('rejects tiktok options with extra property', () => {
    const destination = {
      provider: 'tiktok',
      options: {
        title: 'My TikTok',
        unknownOption: 'should fail'
      }
    };
    expectUnrecognizedKeysError(schemas.tiktokDestinationTiktokDestinationSchema.safeParse(destination));
  });
});
