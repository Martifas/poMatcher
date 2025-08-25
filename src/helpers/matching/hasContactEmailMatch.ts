import type { Email, PurchaseOrder } from '../../types/types.js';

export function hasContactEmailMatch(email: Email, po: PurchaseOrder): boolean {
  const allEmails = [email.from_, ...email.to];
  return (
    allEmails.includes(po.buyer.contact_email) || allEmails.includes(po.supplier.contact_email)
  );
}
