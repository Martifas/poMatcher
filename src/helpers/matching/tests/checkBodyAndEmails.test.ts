import { describe, it, expect } from 'vitest';
import { checkBodyAndEmails } from '../checkBodyAndEmails.js';
import { fakeEmail1, fakeEmail2, fakeSpamEmail, fakePO1, fakePO2 } from './fakes.js';

describe('checkBodyAndEmails', () => {
  it('returns undefined if no clues match', () => {
    expect(checkBodyAndEmails([fakePO1, fakePO2], fakeSpamEmail)).toBeUndefined();
  });

  it('matches on exact item + quantity + contact email', () => {
    const result = checkBodyAndEmails([fakePO1], fakeEmail1);
    expect(result).toBeDefined();
    expect(result?.reasoning.toLowerCase()).toContain('exact item + quantity + contact email');
    expect(result?.confidence).toBeGreaterThanOrEqual(0.5);
    expect(result?.po.po_id).toBe('PO-1');
  });

  it('matches on exact item + quantity + contact email (other PO)', () => {
    const result = checkBodyAndEmails([fakePO2], fakeEmail2);
    expect(result).toBeDefined();

    expect(result?.reasoning.toLowerCase()).toMatch(/exact item|supplier|contact email/);
    expect(result?.po.po_id).toBe('PO-2');
  });

  it('does not match unrelated email/PO', () => {
    expect(checkBodyAndEmails([fakePO2], fakeEmail1)).toBeUndefined();
  });

  it('matches on supplier name only (no contact email)', () => {
    const email = {
      ...fakeEmail1,
      body: 'News from Supplier Ltd.',
      from_: 'x@example.com',
      to: ['y@example.com'],
    };
    const result = checkBodyAndEmails([fakePO1], email);
    expect(result).toBeDefined();
    expect(result?.reasoning.toLowerCase()).toContain('supplier name');
    expect(result?.reasoning.toLowerCase()).not.toContain('contact email');
  });

  it('matches on carrier', () => {
    const email = {
      ...fakeEmail1,
      body: 'Delivery handled by FastCarrier.',
    };
    const result = checkBodyAndEmails([fakePO1], email);
    expect(result).toBeDefined();
    expect(result?.reasoning.toLowerCase()).toContain('carrier');
  });

  it('matches on delivery date', () => {
    const email = {
      ...fakeEmail1,
      body: 'Your shipment is due on 2025-01-15.',
    };
    const result = checkBodyAndEmails([fakePO1], email);
    expect(result).toBeDefined();
    expect(result?.reasoning.toLowerCase()).toContain('delivery date');
  });

  it('matches on exact item (no contact email match)', () => {
    const email = {
      ...fakeEmail1,
      body: 'Order for Super Widget XL placed.',
      from_: 'random@other.com',
      to: ['unknown@other.com'],
    };
    const result = checkBodyAndEmails([fakePO1], email);
    expect(result).toBeDefined();
    expect(result?.reasoning.toLowerCase()).toContain('exact item (no contact email match)');
  });

  it('matches only on buyer/supplier email match', () => {
    const email = {
      ...fakeEmail1,
      body: 'Random unrelated text',
      from_: fakePO1.buyer.contact_email,
      to: [fakePO1.supplier.contact_email],
    };
    const result = checkBodyAndEmails([fakePO1], email);
    expect(result).toBeDefined();
    expect(result?.reasoning.toLowerCase()).toContain('buyer/supplier email match');
  });
});
