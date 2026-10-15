/**
 * FE-20 — client-side CSV download.
 *
 * Builds the file from plain objects in the browser and triggers the download
 * with a blob URL, so an export works with the mocks on and needs no server.
 *
 * BE-45's real export will answer 202 with a token that is polled at
 * ANALYTICS_EXPORT_URL and stream a server-rendered file; when that lands the
 * buttons keep calling this helper only as a fallback, and the row builders in
 * AnalyticsPage stay as they are.
 */
type CsvRow = Record<string, any>;

/** Quotes a value the way RFC 4180 asks for, and doubles inner quotes. */
const escapeCell = (value: any): string => {
    if (value === null || value === undefined) return '';

    const text = String(value);
    // Strip a leading =, +, - or @ so a spreadsheet does not treat data as a
    // formula (a name like "=SUM(A1)" must never execute).
    const safe = /^[=+\-@]/.test(text) ? `'${text}` : text;

    if (/[",\r\n]/.test(safe)) {
        return `"${safe.replace(/"/g, '""')}"`;
    }
    return safe;
};

/**
 * @param filename  Download name; ".csv" is appended when missing.
 * @param rows      Homogeneous list of objects — the union of every key across
 *                  all rows becomes the header, in first-seen order.
 */
export const downloadCsv = (filename: string, rows: CsvRow[]): void => {
    if (!rows.length) return;

    const headers: string[] = [];
    rows.forEach((row) => {
        Object.keys(row).forEach((key) => {
            if (!headers.includes(key)) headers.push(key);
        });
    });

    const lines = [
        headers.map(escapeCell).join(','),
        ...rows.map((row) => headers.map((key) => escapeCell(row[key])).join(',')),
    ];

    // BOM so Excel opens the file as UTF-8 and names with diacritics survive.
    const blob = new Blob(['\uFEFF' + lines.join('\r\n')], {
        type: 'text/csv;charset=utf-8;',
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename.endsWith('.csv') ? filename : `${filename}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
};

export default downloadCsv;
