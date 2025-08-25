import { CONFIDENCE, MATCH_DENOMINATOR, MUST_HAVE_FULL_CONFIDENCE } from './constants.js';

export function calculateConfidence(bestScore: number, reasons: string[]): number {
  const hasAllMustHave = MUST_HAVE_FULL_CONFIDENCE.every((clue) =>
    reasons.some((reason) => reason.startsWith(clue)),
  );
  let result: number;
  if (hasAllMustHave) {
    result = CONFIDENCE;
  } else {
    result = Math.min(0.95, bestScore / MATCH_DENOMINATOR);
  }

  return Math.round(result * 100) / 100;
}
