import { describe, it, expect } from 'vitest';
import { resultsToCSV } from '../resultsToCSV.js';
import type { EmailPoMatchResult } from '../../../types/types.js';

describe('resultsToCSV', () => {
  it('converts results array to CSV string (basic)', () => {
    const results: EmailPoMatchResult[] = [
      { email_id: 0, po_id: 'PO-1', confidence: 0.85, reasoning: 'PO number found in subject' },
      { email_id: 1, po_id: '', confidence: 0.05, reasoning: 'Classified as spam/irrelevant' },
    ];
    const csv = resultsToCSV(results);
    expect(csv).toContain('email_id,po_id,confidence,reasoning');
    expect(csv).toContain('0,PO-1,0.85,"PO number found in subject"');
    expect(csv).toContain('1,,0.05,"Classified as spam/irrelevant"');
  });

  it('handles double quotes in reasoning', () => {
    const results: EmailPoMatchResult[] = [
      { email_id: 2, po_id: 'PO-2', confidence: 0.95, reasoning: 'Found "quoted" PO number' },
    ];
    const csv = resultsToCSV(results);
    expect(csv).toContain('"Found ""quoted"" PO number"');
  });

  it('handles empty input', () => {
    const csv = resultsToCSV([]);
    expect(csv).toBe('email_id,po_id,confidence,reasoning');
  });

  it('handles single result', () => {
    const results: EmailPoMatchResult[] = [
      { email_id: 7, po_id: 'PO-99', confidence: 1, reasoning: 'Exact PO' },
    ];
    const csv = resultsToCSV(results);
    expect(csv).toContain('7,PO-99,1,"Exact PO"');
  });
});
