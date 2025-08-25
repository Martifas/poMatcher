import { describe, it, expect } from 'vitest';
import { matchEmailsToPOs } from '../matchEmailsToPOs.js';
import { fakeEmail1, fakeEmail2, fakeSpamEmail, fakePO1, fakePO2 } from './fakes.js';

describe('matchEmailsToPOs', () => {
  it('matches by PO number in subject or body (searchPOId)', () => {
    const emailWithPoId = { ...fakeEmail2, subject: `Order update for ${fakePO2.po_id}` };
    const results = matchEmailsToPOs([emailWithPoId], [fakePO1, fakePO2]);
    expect(results[0]).toBeDefined();
    expect(results[0]!.po_id).toBe(fakePO2.po_id);
    expect(results[0]!.confidence).toBeGreaterThanOrEqual(0.85);
    expect(results[0]!.reasoning.toLowerCase()).toContain('po number');
  });

  it('matches by clues in body and email', () => {
    const emailWithoutPoId = {
      ...fakeEmail1,
      subject: 'Shipment details',
      body: 'Super Widget XL 12 units for alice@buyer.com',
    };
    const results = matchEmailsToPOs([emailWithoutPoId], [fakePO1]);
    expect(results[0]).toBeDefined();
    expect(results[0]!.po_id).toBe(fakePO1.po_id);
    expect(results[0]!.confidence).toBeGreaterThan(0.1);
    expect(results[0]!.reasoning.toLowerCase()).toMatch(/item|contact email|buyer|supplier/);
  });

  it('flags spam/irrelevant email if no match is found', () => {
    const results = matchEmailsToPOs([fakeSpamEmail], [fakePO1, fakePO2]);
    expect(results[0]).toBeDefined();
    expect(results[0]!.po_id).toBe('');
    expect(results[0]!.confidence).toBe(0.05);
    expect(results[0]!.reasoning).toMatch(/spam|irrelevant/i);
  });

  it('handles multiple emails in one batch', () => {
    const emailWithPoId = { ...fakeEmail2, subject: `Order update for ${fakePO2.po_id}` };
    const emailBodyClue = { ...fakeEmail1, body: 'Super Widget XL 12 units for alice@buyer.com' };
    const batch = [emailWithPoId, emailBodyClue, fakeSpamEmail];
    const results = matchEmailsToPOs(batch, [fakePO1, fakePO2]);

    expect(results.length).toBe(3);

    expect(results[0]).toBeDefined();
    expect(results[0]!.po_id).toBe(fakePO2.po_id);
    expect(results[0]!.confidence).toBeGreaterThan(0.5);

    expect(results[1]).toBeDefined();
    expect(results[1]!.po_id).toBe(fakePO1.po_id);
    expect(results[1]!.confidence).toBeGreaterThan(0.1);

    expect(results[2]).toBeDefined();
    expect(results[2]!.po_id).toBe('');
    expect(results[2]!.confidence).toBe(0.05);
  });
});
