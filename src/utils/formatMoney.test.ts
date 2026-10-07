import { formatMoney, formatMoneyInput, parseAmount } from './formatMoney';

describe('formatMoney', () => {
  it('formats zero', () => {
    expect(formatMoney(0)).toBe('TSh 0');
    expect(formatMoney('0.00')).toBe('TSh 0');
  });

  it('formats a plain amount with no decimals', () => {
    expect(formatMoney(600)).toBe('TSh 600');
    expect(formatMoney(600.4)).toBe('TSh 600');
    expect(formatMoney(600.6)).toBe('TSh 601');
  });

  it('formats negatives with the sign before the symbol', () => {
    expect(formatMoney(-500)).toBe('-TSh 500');
    expect(formatMoney('-500.00')).toBe('-TSh 500');
    expect(formatMoney(-0.4)).toBe('TSh 0');
    expect(formatMoney(-0.6)).toBe('-TSh 1');
  });

  it('accepts decimal strings from the API', () => {
    expect(formatMoney('600.00')).toBe('TSh 600');
    expect(formatMoney('1234.56')).toBe('TSh 1,235');
    expect(formatMoney('0.00')).toBe('TSh 0');
  });

  it('accepts strings that already contain thousand separators', () => {
    expect(formatMoney('1,234,567.89')).toBe('TSh 1,234,568');
  });

  it('adds thousand separators to large numbers', () => {
    expect(formatMoney(1000)).toBe('TSh 1,000');
    expect(formatMoney(1234567)).toBe('TSh 1,234,567');
    expect(formatMoney('999999999.99')).toBe('TSh 1,000,000,000');
  });

  it('returns an empty string for unusable input', () => {
    expect(formatMoney(null)).toBe('');
    expect(formatMoney(undefined)).toBe('');
    expect(formatMoney('')).toBe('');
    expect(formatMoney('abc')).toBe('');
    expect(formatMoney(NaN)).toBe('');
    expect(formatMoney(Infinity)).toBe('');
  });
});

describe('parseAmount', () => {
  it('parses numbers and numeric strings', () => {
    expect(parseAmount(600)).toBe(600);
    expect(parseAmount('600.00')).toBe(600);
    expect(parseAmount('  1,234  ')).toBe(1234);
  });

  it('returns null for missing or invalid values', () => {
    expect(parseAmount(null)).toBeNull();
    expect(parseAmount(undefined)).toBeNull();
    expect(parseAmount('')).toBeNull();
    expect(parseAmount('abc')).toBeNull();
    expect(parseAmount(NaN)).toBeNull();
  });
});

describe('formatMoneyInput', () => {
  it('groups digits without the currency symbol', () => {
    expect(formatMoneyInput(1234567)).toBe('1,234,567');
    expect(formatMoneyInput(-500)).toBe('-500');
  });
});
