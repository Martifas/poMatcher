import type { Email, EmailPoMatchResult, PurchaseOrder } from '../../types/types.js';
import { checkBodyAndEmails } from './checkBodyAndEmails.js';
import { searchPOId } from './searchPOId.js';

export function matchEmailsToPOs(emails: Email[], pos: PurchaseOrder[]): EmailPoMatchResult[] {
  return emails.map((email, idx) => {
    const poMatch = searchPOId(pos, email);
    if (poMatch) {
      return {
        email_id: idx,
        po_id: poMatch.po.po_id,
        confidence: poMatch.confidence,
        reasoning: poMatch.reasoning,
      };
    }

    const bodyMatch = checkBodyAndEmails(pos, email);
    if (bodyMatch) {
      return {
        email_id: idx,
        po_id: bodyMatch.po.po_id,
        confidence: bodyMatch.confidence,
        reasoning: bodyMatch.reasoning,
      };
    }

    return {
      email_id: idx,
      po_id: '',
      confidence: 0.05,
      reasoning: 'Classified as spam/irrelevant',
    };
  });
}
