import type { EmailPoMatchResult } from '../../types/types.js';

export function resultsToCSV(results: EmailPoMatchResult[]): string {
  const header = 'email_id,po_id,confidence,reasoning';
  const rows = results.map(
    (r) => `${r.email_id},${r.po_id},${r.confidence},"${r.reasoning.replace(/"/g, '""')}"`,
  );
  return [header, ...rows].join('\n');
}
