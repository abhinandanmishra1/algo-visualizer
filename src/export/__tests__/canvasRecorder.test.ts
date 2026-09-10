import { describe, it, expect } from 'vitest';
import { getSupportedMimeType, downloadBlob } from '../canvasRecorder';

describe('canvasRecorder mime type helper', () => {
  it('returns a video mime type string or fallback', () => {
    const mime = getSupportedMimeType();
    expect(typeof mime).toBe('string');
    expect(mime).toContain('video');
  });

  it('downloadBlob creates an anchor and triggers download', () => {
    const blob = new Blob(['test-video-content'], { type: 'video/webm' });
    // In node/jsdom environment, verify it does not throw
    expect(() => downloadBlob(blob, 'test.webm')).not.toThrow();
  });
});
