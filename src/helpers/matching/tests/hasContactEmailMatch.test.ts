import { describe, it, expect } from 'vitest';
import { hasContactEmailMatch } from '../hasContactEmailMatch.js';
import { fakePO1, fakePO2, fakeEmail1, fakeEmail2, fakeSpamEmail } from './fakes.js';

describe('hasContactEmailMatch', () => {
  it('returns true when from_ matches buyer contact (fakePO1)', () => {
    expect(hasContactEmailMatch(fakeEmail1, fakePO1)).toBe(true);
  });

  it('returns true when "to" matches supplier contact (fakePO1)', () => {
    const email = {
      ...fakeEmail1,
      from_: 'someone@random.com',
      to: [fakePO1.supplier.contact_email],
    };
    expect(hasContactEmailMatch(email, fakePO1)).toBe(true);
  });

  it('returns false when neither from_ nor to match PO contacts (fakePO2)', () => {
    expect(hasContactEmailMatch(fakeSpamEmail, fakePO2)).toBe(false);
  });

  it('returns true if both buyer and supplier contacts are present (fakePO2)', () => {
    const email = {
      ...fakeEmail2,
      from_: fakePO2.buyer.contact_email,
      to: [fakePO2.supplier.contact_email, 'someone@else.com'],
    };
    expect(hasContactEmailMatch(email, fakePO2)).toBe(true);
  });
});
