import {
  PO_MISSMATCH_SUBJECT_BODY,
  PO_SUBJECT_BODY_CONFIDENCE,
  PO_SUBJECT_OR_BODY,
} from './constants.js';
import type { Email, POIdMatchResult, PurchaseOrder } from '../../types/types.js';

export function searchPOId(pos: PurchaseOrder[], email: Email): POIdMatchResult | undefined {
  const foundInSubject = pos.find((po) => email.subject.includes(po.po_id));
  const foundInBody = pos.find((po) => email.body.includes(po.po_id));

  if (foundInSubject && foundInBody && foundInSubject.po_id === foundInBody.po_id) {
    return {
      po: foundInSubject,

      reasoning: 'Exact PO number found in subject line and email body',
      confidence: PO_SUBJECT_BODY_CONFIDENCE,
    };
  }

  if (foundInSubject && foundInBody && foundInSubject.po_id !== foundInBody.po_id) {
    return {
      po: foundInSubject,
      reasoning: `MISMATCH: PO number in subject (${foundInSubject.po_id}) differs from PO number in body (${foundInBody.po_id})`,
      confidence: PO_MISSMATCH_SUBJECT_BODY,
    };
  }

  if (foundInSubject) {
    return {
      po: foundInSubject,

      reasoning: 'Exact PO number found in subject line',
      confidence: PO_SUBJECT_OR_BODY,
    };
  }

  if (foundInBody) {
    return {
      po: foundInBody,

      reasoning: 'Exact PO number found in email body',
      confidence: PO_SUBJECT_OR_BODY,
    };
  }

  return undefined;
}
