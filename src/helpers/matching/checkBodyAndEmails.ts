import type { Email, PurchaseOrder } from '../../types/types.js';
import { itemPartlyInText } from './itemPartlyInText.js';
import { hasContactEmailMatch } from './hasContactEmailMatch.js';
import { calculateConfidence } from './calculateConfidence.js';

export function checkBodyAndEmails(pos: PurchaseOrder[], email: Email) {
  let bestScore = 0;
  let bestMatch: PurchaseOrder | undefined;
  let bestReasons: string[] = [];

  for (const po of pos) {
    let score = 0;
    const reasons: string[] = [];
    const contactEmailMatched = hasContactEmailMatch(email, po);

    if (email.body.includes(po.supplier.supplier_name)) {
      if (contactEmailMatched) {
        score += 1;
        reasons.push('supplier name + contact email');
      } else {
        score += 0.5;
        reasons.push('supplier name');
      }
    }

    if (po.carrier && email.body.includes(po.carrier)) {
      score += 1;
      reasons.push('carrier');
    }

    if (po.expected_delivery_date && email.body.includes(po.expected_delivery_date)) {
      score += 1;
      reasons.push('delivery date');
    }

    const itemFullMatch = po.lines.description && email.body.includes(po.lines.description);
    const itemPartialMatch =
      po.lines.description && itemPartlyInText(po.lines.description, email.body);

    if (itemFullMatch && contactEmailMatched) {
      if (email.body.includes(String(po.lines.qty))) {
        score += 1.2;
        reasons.push('exact item + quantity + contact email');
      } else {
        score += 1;
        reasons.push('exact item + contact email');
      }
    } else if (itemFullMatch) {
      score += 0.3;
      reasons.push('exact item (no contact email match)');
    } else if (itemPartialMatch && contactEmailMatched) {
      if (email.body.includes(String(po.lines.qty))) {
        score += 1;
        reasons.push('partial item + quantity + contact email');
      } else {
        score += 0.7;
        reasons.push('partial item + contact email');
      }
    } else if (itemPartialMatch) {
      score += 0.1;
      reasons.push('partial item (no contact email match)');
    }

    if (contactEmailMatched) {
      score += 1;
      reasons.push('buyer/supplier email match');
    }

    if (score > bestScore) {
      bestScore = score;
      bestMatch = po;
      bestReasons = [...reasons];
    }
  }

  if (bestMatch && bestScore > 0) {
    const reasonStr = bestReasons.join(' + ');
    const reasoning = reasonStr.charAt(0).toUpperCase() + reasonStr.slice(1) + ' match';

    return {
      po: bestMatch,
      reasoning,
      confidence: calculateConfidence(bestScore, bestReasons),
    };
  }
  return undefined;
}
