import { ColorPaletteProp } from '@mui/joy';

/**
 * FE-11 / FE-13 / FE-14 — shared presentation rules for the ledger.
 *
 * The backend names an event_type in snake_case (card_replacement) and the UI
 * needs a translated label ("Card replacement"). Keeping the mapping here means
 * the journal, the card statement and the parent statement cannot drift apart
 * on wording or colour.
 *
 * These are pure helpers, not a component, so they live in utils rather than in
 * components/.
 */

export const LEDGER_EVENT_TYPES = [
    'purchase',
    'penalty',
    'deposit',
    'reversal',
    'card_replacement',
    'opening',
    'adjustment',
] as const;

export type LedgerEventType = (typeof LEDGER_EVENT_TYPES)[number];

/**
 * Chip colour per event type. Green for money in, red for money out.
 *
 * This version of @mui/joy ships five palettes (primary, neutral, danger,
 * success, warning) for seven event types, so two pairs share a colour. The
 * translation is what distinguishes the rows; the colour is a quick signal only.
 */
export const LEDGER_EVENT_COLORS: Record<LedgerEventType, ColorPaletteProp> = {
    purchase: 'primary',
    penalty: 'danger',
    deposit: 'success',
    reversal: 'neutral',
    card_replacement: 'warning',
    opening: 'neutral',
    adjustment: 'warning',
};

/**
 * Translated label for an event type. Falls back to the raw value if the backend
 * ever sends a type this build does not know, so a new event type shows its own
 * name instead of an empty chip.
 */
export const ledgerEventLabel = (
    t: (key: string) => string,
    eventType: string | null | undefined
): string => {
    if (!eventType) return '-';
    const translated = t(`ledger.events.${eventType}`);
    return translated === `ledger.events.${eventType}` ? eventType : translated;
};

/** Sum of one direction across an entry's lines. */
export const sumLines = (lines: any[], direction: 'debit' | 'credit'): number =>
    (lines ?? []).reduce((sum: number, line: any) => {
        if (line?.direction !== direction) return sum;
        const value = Number(line?.amount ?? 0);
        return sum + (Number.isFinite(value) ? value : 0);
    }, 0);

/**
 * A ledger entry is balanced when its debits equal its credits. This is computed
 * in the browser on purpose: the whole point of the screen is to let an admin
 * see a broken entry rather than trust the response.
 */
export const isEntryBalanced = (lines: any[]): boolean => {
    if (!lines?.length) return false;
    return Math.abs(sumLines(lines, 'debit') - sumLines(lines, 'credit')) < 0.005;
};
