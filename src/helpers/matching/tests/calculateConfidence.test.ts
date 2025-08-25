import { describe, it, expect } from 'vitest';
import { calculateConfidence } from '../calculateConfidence.js';
import { CONFIDENCE, MATCH_DENOMINATOR, MUST_HAVE_FULL_CONFIDENCE } from '../constants.js';

describe('calculateConfidence', () => {
  it('returns CONFIDENCE if all must-have clues are present', () => {
    const reasons = [...MUST_HAVE_FULL_CONFIDENCE];
    const bestScore = 5;
    expect(calculateConfidence(bestScore, reasons)).toBe(CONFIDENCE);
  });

  it('calculates correctly when not all must-have clues are present', () => {
    const reasons = ['some random reason'];
    const bestScore = 2.5;
    const expected = Math.round(Math.min(0.99, bestScore / MATCH_DENOMINATOR) * 100) / 100;
    expect(calculateConfidence(bestScore, reasons)).toBe(expected);
  });

  it('caps at 0.95 if calculation exceeds it', () => {
    const reasons = ['some reason'];
    const bestScore = 10;
    expect(calculateConfidence(bestScore, reasons)).toBe(0.95);
  });

  it('rounds to two decimals', () => {
    const reasons = ['reason'];
    const bestScore = 1.234;
    const expected = Math.round((bestScore / MATCH_DENOMINATOR) * 100) / 100;
    expect(calculateConfidence(bestScore, reasons)).toBe(expected);
  });
});
