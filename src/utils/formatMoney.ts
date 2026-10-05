import branding from '../config/branding';

const GROUPED = /\B(?=(\d{3})+(?!\d))/g;

export const parseAmount = (value: number | string | null | undefined): number | null => {
  if (value === null || value === undefined || value === '') {
    return null;
  }

  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : null;
  }

  const cleaned = String(value).replace(/,/g, '').trim();
  if (cleaned === '') {
    return null;
  }

  const parsed = Number(cleaned);
  return Number.isFinite(parsed) ? parsed : null;
};

const groupThousands = (digits: string): string => digits.replace(GROUPED, ',');

/**
 * Formats an amount as Tanzanian shillings.
 *
 * - No decimals for TZS (the smallest circulating unit is the shilling).
 * - Thousand separators: 600 -> "TSh 600", 1234567 -> "TSh 1,234,567".
 * - Negatives render as "-TSh 500" (sign before the symbol, not after).
 * - Accepts numbers or decimal strings from the API, e.g. "600.00".
 * - Unparseable input returns an empty string so callers never show "TSh NaN".
 */
export const formatMoney = (value: number | string | null | undefined): string => {
  const amount = parseAmount(value);

  if (amount === null) {
    return '';
  }

  const symbol = branding.CURRENCY_SYMBOL;
  const rounded = Math.round(Math.abs(amount));
  // Base the sign on the rounded value so -0.4 renders "TSh 0", not "-TSh 0".
  const sign = rounded > 0 && amount < 0 ? '-' : '';

  return `${sign}${symbol} ${groupThousands(String(rounded))}`;
};

/**
 * Same as formatMoney but for inputs where the user is still typing.
 * Keeps the raw text so partial input is not mangled while editing.
 */
export const formatMoneyInput = (value: number | string | null | undefined): string => {
  const amount = parseAmount(value);

  if (amount === null) {
    return '';
  }

  const rounded = Math.round(Math.abs(amount));
  const sign = rounded > 0 && amount < 0 ? '-' : '';

  return `${sign}${groupThousands(String(rounded))}`;
};

export default formatMoney;
