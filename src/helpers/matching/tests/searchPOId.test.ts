import { describe, it, expect } from 'vitest';
import { searchPOId } from '../searchPOId.js';
import { fakePO1, fakePO2, fakeEmail1 } from './fakes.js';
import {
  PO_SUBJECT_BODY_CONFIDENCE,
  PO_MISSMATCH_SUBJECT_BODY,
  PO_SUBJECT_OR_BODY,
} from '../constants.js';

describe('searchPOId', () => {
  it('returns match if PO number is in subject only', () => {
    const email = {
      ...fakeEmail1,
      subject: `Here is your PO: ${fakePO1.po_id}`,
      body: 'No PO here',
    };
    const result = searchPOId([fakePO1, fakePO2], email);
    expect(result).toBeDefined();
    expect(result!.po.po_id).toBe(fakePO1.po_id);
    expect(result!.reasoning.toLowerCase()).toContain('subject');
    expect(result!.confidence).toBe(PO_SUBJECT_OR_BODY);
  });

  it('returns match if PO number is in body only', () => {
    const email = {
      ...fakeEmail1,
      subject: 'Order update',
      body: `Text mentioning ${fakePO2.po_id}`,
    };
    const result = searchPOId([fakePO1, fakePO2], email);
    expect(result).toBeDefined();
    expect(result!.po.po_id).toBe(fakePO2.po_id);
    expect(result!.reasoning.toLowerCase()).toContain('body');
    expect(result!.confidence).toBe(PO_SUBJECT_OR_BODY);
  });

  it('returns match if PO number is in both subject and body (and same)', () => {
    const email = {
      ...fakeEmail1,
      subject: `Shipment ${fakePO2.po_id}`,
      body: `Details about order ${fakePO2.po_id}`,
    };
    const result = searchPOId([fakePO1, fakePO2], email);
    expect(result).toBeDefined();
    expect(result!.po.po_id).toBe(fakePO2.po_id);
    expect(result!.reasoning).toMatch(/subject.*body|body.*subject/i);
    expect(result!.confidence).toBe(PO_SUBJECT_BODY_CONFIDENCE);
  });

  it('returns mismatch if PO numbers in subject and body are different', () => {
    const email = {
      ...fakeEmail1,
      subject: `Your PO: ${fakePO1.po_id}`,
      body: `And a different PO: ${fakePO2.po_id}`,
    };
    const result = searchPOId([fakePO1, fakePO2], email);
    expect(result).toBeDefined();
    expect(result!.po.po_id).toBe(fakePO1.po_id);
    expect(result!.reasoning).toMatch(/mismatch/i);
    expect(result!.confidence).toBe(PO_MISSMATCH_SUBJECT_BODY);
  });

  it('returns undefined if no PO number in subject or body', () => {
    const email = { ...fakeEmail1, subject: 'No PO here', body: 'Still no PO.' };
    const result = searchPOId([fakePO1, fakePO2], email);
    expect(result).toBeUndefined();
  });
});
