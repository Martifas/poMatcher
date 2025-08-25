import { describe, it, expect } from 'vitest';
import { itemPartlyInText } from '../itemPartlyInText.js';

describe('itemPartlyInText', () => {
  it('returns false if description is missing', () => {
    expect(itemPartlyInText('', 'any text')).toBe(false);
    expect(itemPartlyInText(undefined as never, 'any text')).toBe(false);
  });

  it('returns false if fewer than 2 keywords match', () => {
    const description = 'Super Widget XL';
    const text = 'Looking for a widget.';
    expect(itemPartlyInText(description, text)).toBe(false);
  });

  it('returns true if at least 2 keywords match', () => {
    const description = 'Super Widget XL';
    const text = 'Hi, I am interested in your super Widget device called XL.';
    expect(itemPartlyInText(description, text)).toBe(true);
  });

  it('ignores stopwords in the description', () => {
    const description = 'Sales Manager Widget Device';
    const text = 'Device is a type of widget in stock.';

    expect(itemPartlyInText(description, text)).toBe(true);
  });

  it('returns false if keywords do not exist in text', () => {
    const description = 'Gizmo Pro 3000';
    const text = 'Looking for a different item.';
    expect(itemPartlyInText(description, text)).toBe(false);
  });

  it('is case insensitive', () => {
    const description = 'Super Widget XL';
    const text = 'super widget xl';
    expect(itemPartlyInText(description, text)).toBe(true);
    const text2 = 'SuPeR WiDgEt xL';
    expect(itemPartlyInText(description, text2)).toBe(true);
  });
});
