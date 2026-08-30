import { describe, expect, test } from 'bun:test';
import {
  MAX_NECKLINE_ATTACHMENT_ERROR,
  validateNecklineAttachment,
} from '../scripts/cape-trajectory-invariants.mjs';

describe('local cape trajectory validation', () => {
  test('accepts both neckline endpoints within the attachment tolerance', () => {
    expect(() => validateNecklineAttachment({
      scenario: 'forward-start',
      renderer: 'WebGPU',
      maximumError: MAX_NECKLINE_ATTACHMENT_ERROR,
    })).not.toThrow();
  });

  test('rejects a cape whose internally valid cloth has detached from the character', () => {
    expect(() => validateNecklineAttachment({
      scenario: 'forward-start',
      renderer: 'WebGPU',
      maximumError: 1.25,
    })).toThrow('forward-start WebGPU detached its neckline by 1.2500 m');
  });

  test('rejects non-finite attachment diagnostics', () => {
    expect(() => validateNecklineAttachment({
      scenario: 'raised-drop',
      renderer: 'WebGL',
      maximumError: Number.NaN,
    })).toThrow('raised-drop WebGL detached its neckline by NaN');
  });
});
