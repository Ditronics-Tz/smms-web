/**
 * FE-16/17/18 (analytics) + FE-19 (insights) mock data.
 *
 * Shaped exactly like the BE-42/BE-43 contract so no page or saga changes when
 * Ahmed merges them:
 *   - dates are ISO 8601 (date-only where the contract shows a day, full
 *     timestamp where it shows a moment)
 *   - every amount is a decimal string ("600.00"), never a JS number
 *
 * Nothing here is random: the numbers are generated from fixed formulas over
 * the last 30 days so screenshots, tests and charts stay reproducible, while
 * still landing on "today" so the Today / 7 days / 30 days presets all show
 * data instead of an empty screen.
 *
 * The sales records are stored as one row per day + meal type + item, and
 * `filterSales` aggregates them for whichever group_by the endpoint was asked
 * for — the same three groupings BE-42 exposes (day | item | hour).
 */

export const MEAL_TYPES = ['breakfast', 'lunch', 'dinner'] as const;
export type MealType = (typeof MEAL_TYPES)[number];

// ---------------------------------------------------------------------------
// Contract types
// ---------------------------------------------------------------------------

export type SalesSeriesPoint = { label: string; revenue: string; count: number };
export type SalesTotals = { revenue: string; count: number; penalty_amount: string };
export type SalesResponse = { series: SalesSeriesPoint[]; totals: SalesTotals };

export type SalesFilters = {
    from?: string;
    to?: string;
    meal_type?: string | string[];
    group_by?: 'day' | 'item' | 'hour' | string;
};

export type WalletHealthCountKey = 'below_threshold' | 'at_floor' | 'near_strike_limit';

export type WalletHealthResponse = {
    float_total: string;
    avg_balance: string;
    below_threshold: number;
    at_floor: number;
    near_strike_limit: number;
    deposits_vs_spend: { date: string; deposits: string; spend: string }[];
};

export type WalletStudentRow = {
    student_id: string;
    name: string;
    class_room: string;
    balance: string;
    strikes?: number;
};

export type OperatorRow = {
    operator_id: string;
    operator: string;
    sessions: number;
    revenue: string;
    variance_total: string;
    reversals: number;
};

export type ClassRow = {
    class_room: string;
    meals: number;
    spend: string;
    penalties: number;
};

export type PenaltyStudentRow = {
    student_id: string;
    name: string;
    class_room: string;
    strikes: number;
};

export type PenaltiesResponse = {
    count: number;
    amount: string;
    students_near_limit: PenaltyStudentRow[];
};

export type ForecastRow = {
    meal_type: MealType;
    expected_meals: number;
    weeks_used: number;
};

export type AtRiskReason = 'dropped_scans' | 'repeated_penalties' | 'near_strike_limit';

export type AtRiskRow = {
    student_id: string;
    name: string;
    class_room: string;
    reasons: AtRiskReason[];
    detail: string;
};

export type AnomalyStatus = 'open' | 'resolved';

export type AnomalyRow = {
    id: string;
    kind: string;
    reference_type: string;
    reference_id: string;
    detail: string;
    status: AnomalyStatus;
    created_at: string;
};

export type DormantCardRow = {
    card_id: string;
    card_number: string;
    student: string;
    last_scan: string;
};

// ---------------------------------------------------------------------------
// Date helpers (local time, so "Today" means the user's today)
// ---------------------------------------------------------------------------

const DAY_MS = 24 * 60 * 60 * 1000;
const pad2 = (value: number) => String(value).padStart(2, '0');

export const isoDate = (date: Date): string =>
    `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`;

const startOfToday = (): Date => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    return date;
};

const daysAgo = (days: number): Date => new Date(startOfToday().getTime() - days * DAY_MS);

/** Amounts are decimal strings in the contract, never numbers. */
const money = (value: number): string => value.toFixed(2);

const daysSince = (isoDateValue: string): number =>
    Math.floor((startOfToday().getTime() - new Date(isoDateValue).getTime()) / DAY_MS);

// ---------------------------------------------------------------------------
// FE-16 — sales
// ---------------------------------------------------------------------------

type SaleRecord = {
    date: string;
    hour: number;
    meal_type: MealType;
    item: string;
    count: number;
    revenue: string;
    penalty_amount: string;
};

const SALES_ITEMS: { name: string; price: number }[] = [
    { name: 'Ugali', price: 600 },
    { name: 'Rice', price: 700 },
    { name: 'Beans', price: 500 },
    { name: 'Chips', price: 1000 },
    { name: 'Chicken', price: 1500 },
    { name: 'Fish', price: 1400 },
    { name: 'Vegetables', price: 500 },
    { name: 'Fruits', price: 400 },
    { name: 'Milk', price: 300 },
    { name: 'Eggs', price: 400 },
    { name: 'Porridge', price: 350 },
    { name: 'Samosa', price: 500 },
];

/** Service hours per meal type — drives the group_by=hour chart. */
const MEAL_HOURS: Record<MealType, number[]> = {
    breakfast: [6, 7, 8, 9],
    lunch: [11, 12, 13, 14],
    dinner: [17, 18, 19, 20],
};

const buildSalesRecords = (): SaleRecord[] => {
    const records: SaleRecord[] = [];
    const today = startOfToday();

    // 30 days ending today, oldest first so day-grouped series come out
    // in chronological order without an extra sort.
    for (let dayIndex = 0; dayIndex < 30; dayIndex += 1) {
        const date = new Date(today.getTime() - (29 - dayIndex) * DAY_MS);
        const dateStr = isoDate(date);
        const weekday = date.getDay();
        // Deterministic weekend dip: fewer meals served on Saturday, far fewer
        // on Sunday, so the trend chart looks like a school calendar.
        const dayFactor = weekday === 0 ? 0.35 : weekday === 6 ? 0.7 : 1;

        MEAL_TYPES.forEach((mealType, mealIndex) => {
            SALES_ITEMS.forEach((item, itemIndex) => {
                // Not every item sells every day — a fixed skip pattern keeps
                // the item ranking varied without Math.random().
                if ((dayIndex + mealIndex * 2 + itemIndex * 3) % 11 === 0) return;

                const base = 2 + ((dayIndex * 3 + mealIndex * 5 + itemIndex * 7) % 9);
                const count = Math.max(1, Math.round(base * dayFactor));
                const hour = MEAL_HOURS[mealType][(dayIndex + itemIndex) % 4];
                const penalty =
                    (dayIndex + mealIndex + itemIndex) % 6 === 0
                        ? (((dayIndex + itemIndex) % 3) + 1) * 100
                        : 0;

                records.push({
                    date: dateStr,
                    hour,
                    meal_type: mealType,
                    item: item.name,
                    count,
                    revenue: money(count * item.price),
                    penalty_amount: money(penalty),
                });
            });
        });
    }

    return records;
};

const SALE_RECORDS: SaleRecord[] = buildSalesRecords();

/** Accepts "breakfast", "breakfast,lunch" or an array; null means "all meals". */
const normalizeMeals = (value?: string | string[] | null): MealType[] | null => {
    if (!value) return null;
    const list = (Array.isArray(value) ? value : String(value).split(','))
        .map((entry) => entry.trim())
        .filter(Boolean);
    if (!list.length || list.length === MEAL_TYPES.length) return null;

    const meals = list.filter((entry) =>
        MEAL_TYPES.includes(entry as MealType)
    ) as MealType[];
    return meals.length ? meals : null;
};

/**
 * The mock body of GET /analytics/sales?from&to&meal_type&group_by.
 * Filters and grouping behave the way the contract describes; the totals are
 * always over the same filtered rows the series are built from, so the KPI
 * cards can never disagree with the charts.
 */
export const filterSales = (filters: SalesFilters = {}): SalesResponse => {
    const { from, to, meal_type, group_by = 'day' } = filters;
    const meals = normalizeMeals(meal_type);
    const fromDate = from ? from.slice(0, 10) : '';
    const toDate = to ? to.slice(0, 10) : '';

    const rows = SALE_RECORDS.filter((record) => {
        if (fromDate && record.date < fromDate) return false;
        if (toDate && record.date > toDate) return false;
        if (meals && !meals.includes(record.meal_type)) return false;
        return true;
    });

    const buckets = new Map<string, { revenue: number; count: number; penalty: number }>();
    const insertionOrder: string[] = [];

    rows.forEach((record) => {
        const key =
            group_by === 'item' ? record.item : group_by === 'hour' ? String(record.hour) : record.date;
        if (!buckets.has(key)) {
            buckets.set(key, { revenue: 0, count: 0, penalty: 0 });
            insertionOrder.push(key);
        }
        const bucket = buckets.get(key)!;
        bucket.revenue += Number(record.revenue);
        bucket.count += record.count;
        bucket.penalty += Number(record.penalty_amount);
    });

    const pointOf = (key: string): SalesSeriesPoint => {
        const bucket = buckets.get(key);
        return {
            label: key,
            revenue: money(bucket?.revenue ?? 0),
            count: bucket?.count ?? 0,
        };
    };

    let series: SalesSeriesPoint[];
    if (group_by === 'hour') {
        // Always 0..23 so the axis keeps its shape when a range has no sales.
        series = Array.from({ length: 24 }, (_, hour) => pointOf(String(hour)));
    } else if (group_by === 'item') {
        series = insertionOrder
            .map(pointOf)
            .sort((a, b) => Number(b.revenue) - Number(a.revenue));
    } else {
        series = insertionOrder.map(pointOf);
    }

    const totals = rows.reduce(
        (acc, record) => ({
            revenue: acc.revenue + Number(record.revenue),
            count: acc.count + record.count,
            penalty: acc.penalty + Number(record.penalty_amount),
        }),
        { revenue: 0, count: 0, penalty: 0 }
    );

    return {
        series,
        totals: {
            revenue: money(totals.revenue),
            count: totals.count,
            penalty_amount: money(totals.penalty),
        },
    };
};

// ---------------------------------------------------------------------------
// FE-17 — wallet health
// ---------------------------------------------------------------------------

const buildDepositsVsSpend = (): WalletHealthResponse['deposits_vs_spend'] => {
    const rows: WalletHealthResponse['deposits_vs_spend'] = [];
    const today = startOfToday();

    for (let dayIndex = 0; dayIndex < 30; dayIndex += 1) {
        const date = isoDate(new Date(today.getTime() - (29 - dayIndex) * DAY_MS));
        const weekday = new Date(today.getTime() - (29 - dayIndex) * DAY_MS).getDay();
        // Deposits cluster at the start of the week, spending follows it.
        const deposits = ((dayIndex * 37) % 12 + 1) * 5000 + (weekday === 1 ? 40000 : 0);
        const spend = ((dayIndex * 53) % 15 + 2) * 3000 * (weekday === 0 ? 0.4 : 1);
        rows.push({ date, deposits: money(deposits), spend: money(spend) });
    }

    return rows;
};

export const WALLET_HEALTH_MOCK: WalletHealthResponse = {
    float_total: money(4825000),
    avg_balance: money(12450),
    below_threshold: 14,
    at_floor: 5,
    near_strike_limit: 9,
    deposits_vs_spend: buildDepositsVsSpend(),
};

/**
 * The students behind each wallet-health count. BE-42 does not return them
 * yet, so the expandable table on FE-17 lists this static subset while the
 * KPI itself still shows the real count from the response.
 */
export const WALLET_HEALTH_STUDENTS_MOCK: Record<WalletHealthCountKey, WalletStudentRow[]> = {
    below_threshold: [
        { student_id: 'stu-201', name: 'Salma Ally', class_room: 'Class 2A', balance: '450.00' },
        { student_id: 'stu-214', name: 'Yusuf Mbaga', class_room: 'Class 4B', balance: '780.00' },
        { student_id: 'stu-233', name: 'Zawadi Kimaro', class_room: 'Class 3C', balance: '620.00' },
        { student_id: 'stu-247', name: 'Emmanuel Mushi', class_room: 'Class 5A', balance: '310.00' },
        { student_id: 'stu-259', name: 'Neema Shirima', class_room: 'Class 1B', balance: '900.00' },
    ],
    at_floor: [
        { student_id: 'stu-265', name: 'Frank Msigwa', class_room: 'Class 6A', balance: '-500.00' },
        { student_id: 'stu-271', name: 'Hawa Omari', class_room: 'Class 4A', balance: '-500.00' },
        { student_id: 'stu-288', name: 'Godfrey Mwakalinga', class_room: 'Class 2B', balance: '-480.00' },
        { student_id: 'stu-292', name: 'Rehema Sanga', class_room: 'Class 3A', balance: '-500.00' },
        { student_id: 'stu-304', name: 'Deo Charles', class_room: 'Class 5C', balance: '-450.00' },
    ],
    near_strike_limit: [
        { student_id: 'stu-310', name: 'Baraka Juma', class_room: 'Class 4B', balance: '8200.00', strikes: 8 },
        { student_id: 'stu-318', name: 'Getruda Nyerere', class_room: 'Class 6B', balance: '15600.00', strikes: 8 },
        { student_id: 'stu-322', name: 'Ibrahim Selemani', class_room: 'Class 3A', balance: '4300.00', strikes: 9 },
        { student_id: 'stu-337', name: 'Lucy Mrema', class_room: 'Class 5A', balance: '11250.00', strikes: 9 },
        { student_id: 'stu-341', name: 'Omary Hassan', class_room: 'Class 2A', balance: '6700.00', strikes: 10 },
    ],
};

// ---------------------------------------------------------------------------
// FE-18 — operators, classes, penalties
// ---------------------------------------------------------------------------

export const OPERATORS_MOCK: OperatorRow[] = [
    {
        operator_id: 'op-01',
        operator: 'Neema Mushi',
        sessions: 142,
        revenue: money(1284500),
        variance_total: money(-1200),
        reversals: 3,
    },
    {
        operator_id: 'op-02',
        operator: 'Juma Kessy',
        sessions: 128,
        revenue: money(1157000),
        variance_total: money(0),
        reversals: 0,
    },
    {
        operator_id: 'op-03',
        operator: 'Asha Mwinyi',
        sessions: 151,
        revenue: money(1392300),
        variance_total: money(450),
        reversals: 1,
    },
    {
        operator_id: 'op-04',
        operator: 'Baraka Lyimo',
        sessions: 96,
        revenue: money(845200),
        variance_total: money(-8700),
        reversals: 7,
    },
];

export const CLASSES_MOCK: ClassRow[] = [
    { class_room: 'Class 1A', meals: 640, spend: money(384000), penalties: 9 },
    { class_room: 'Class 1B', meals: 585, spend: money(351000), penalties: 7 },
    { class_room: 'Class 2A', meals: 712, spend: money(441440), penalties: 12 },
    { class_room: 'Class 3C', meals: 668, spend: money(427520), penalties: 15 },
    { class_room: 'Class 4A', meals: 745, spend: money(496050), penalties: 11 },
    { class_room: 'Class 4B', meals: 690, spend: money(452850), penalties: 18 },
    { class_room: 'Class 5A', meals: 801, spend: money(544680), penalties: 10 },
    { class_room: 'Class 6A', meals: 764, spend: money(530580), penalties: 14 },
];

export const PENALTIES_MOCK: PenaltiesResponse = {
    count: 37,
    amount: money(18500),
    students_near_limit: [
        { student_id: 'stu-310', name: 'Baraka Juma', class_room: 'Class 4B', strikes: 8 },
        { student_id: 'stu-322', name: 'Ibrahim Selemani', class_room: 'Class 3A', strikes: 9 },
        { student_id: 'stu-341', name: 'Omary Hassan', class_room: 'Class 2A', strikes: 10 },
        { student_id: 'stu-355', name: 'Sarah Kileo', class_room: 'Class 6A', strikes: 8 },
        { student_id: 'stu-362', name: 'Josphat Mlay', class_room: 'Class 5A', strikes: 9 },
    ],
};

// ---------------------------------------------------------------------------
// FE-19 — insights
// ---------------------------------------------------------------------------

export const FORECAST_MOCK: ForecastRow[] = [
    { meal_type: 'breakfast', expected_meals: 214, weeks_used: 8 },
    { meal_type: 'lunch', expected_meals: 386, weeks_used: 8 },
    { meal_type: 'dinner', expected_meals: 172, weeks_used: 8 },
];

export const AT_RISK_MOCK: AtRiskRow[] = [
    {
        student_id: 'stu-310',
        name: 'Baraka Juma',
        class_room: 'Class 4B',
        reasons: ['dropped_scans', 'near_strike_limit'],
        detail: 'Scans fell from 12 to 3 over the last week and 8 of 10 strikes are used.',
    },
    {
        student_id: 'stu-322',
        name: 'Ibrahim Selemani',
        class_room: 'Class 3A',
        reasons: ['repeated_penalties', 'near_strike_limit'],
        detail: 'Four penalties in two weeks; only 1 strike left before the card locks.',
    },
    {
        student_id: 'stu-341',
        name: 'Omary Hassan',
        class_room: 'Class 2A',
        reasons: ['near_strike_limit'],
        detail: 'All 10 strikes used. The next penalty blocks the card until an admin resets it.',
    },
    {
        student_id: 'stu-355',
        name: 'Sarah Kileo',
        class_room: 'Class 6A',
        reasons: ['dropped_scans'],
        detail: 'No breakfast scan in 6 school days although the wallet still has balance.',
    },
    {
        student_id: 'stu-362',
        name: 'Josphat Mlay',
        class_room: 'Class 5A',
        reasons: ['repeated_penalties', 'dropped_scans'],
        detail: 'Three penalties and a 60 percent drop in scans over the last fortnight.',
    },
    {
        student_id: 'stu-378',
        name: 'Neema Kalinga',
        class_room: 'Class 1B',
        reasons: ['dropped_scans', 'repeated_penalties', 'near_strike_limit'],
        detail: 'Scans collapsed this week, two penalties landed, 9 of 10 strikes are used.',
    },
];

const anomalyCreatedAt = (daysBack: number, hour: number): string => {
    const date = daysAgo(daysBack);
    date.setHours(hour, 15, 0, 0);
    return date.toISOString();
};

export const ANOMALIES_MOCK: AnomalyRow[] = [
    {
        id: 'anomaly-01',
        kind: 'negative_balance',
        reference_type: 'card',
        reference_id: 'A-0007',
        detail: 'A card scanned while its balance was already below the floor.',
        status: 'open',
        created_at: anomalyCreatedAt(1, 9),
    },
    {
        id: 'anomaly-02',
        kind: 'variance_spike',
        reference_type: 'operator',
        reference_id: 'op-04',
        detail: 'Operator variance passed the daily tolerance twice this week.',
        status: 'open',
        created_at: anomalyCreatedAt(2, 15),
    },
    {
        id: 'anomaly-03',
        kind: 'reversal_burst',
        reference_type: 'operator',
        reference_id: 'op-04',
        detail: 'Seven reversals recorded against one operator inside 24 hours.',
        status: 'open',
        created_at: anomalyCreatedAt(3, 12),
    },
    {
        id: 'anomaly-04',
        kind: 'duplicate_scan',
        reference_type: 'card',
        reference_id: 'B-0021',
        detail: 'Two scans on the same card less than 20 seconds apart.',
        status: 'open',
        created_at: anomalyCreatedAt(5, 8),
    },
    {
        id: 'anomaly-05',
        kind: 'stale_terminal',
        reference_type: 'session',
        reference_id: 'ses-4471',
        detail: 'A terminal stopped syncing for more than three days.',
        status: 'resolved',
        created_at: anomalyCreatedAt(12, 10),
    },
    {
        id: 'anomaly-06',
        kind: 'negative_balance',
        reference_type: 'card',
        reference_id: 'C-0033',
        detail: 'Penalty pushed a balance below the floor outside the clamp rule.',
        status: 'resolved',
        created_at: anomalyCreatedAt(16, 14),
    },
    {
        id: 'anomaly-07',
        kind: 'variance_spike',
        reference_type: 'operator',
        reference_id: 'op-01',
        detail: 'Session closed with a variance above the daily tolerance.',
        status: 'resolved',
        created_at: anomalyCreatedAt(21, 16),
    },
];

/** POST /insights/anomalies/{id}/resolve — flips the row, returns it. */
export const resolveAnomalyMock = (id: string): AnomalyRow | null => {
    const anomaly = ANOMALIES_MOCK.find((row) => row.id === id);
    if (!anomaly) return null;
    anomaly.status = 'resolved';
    return anomaly;
};

export const filterAnomalies = (status?: string): AnomalyRow[] => {
    if (status === 'open' || status === 'resolved') {
        return ANOMALIES_MOCK.filter((row) => row.status === status);
    }
    return [...ANOMALIES_MOCK];
};

export const DORMANT_MOCK: DormantCardRow[] = [
    { card_id: 'card-051', card_number: 'D-0051', student: 'Anna Mwakasege', last_scan: daysAgo(34).toISOString() },
    { card_id: 'card-063', card_number: 'D-0063', student: 'Kelvin Macha', last_scan: daysAgo(41).toISOString() },
    { card_id: 'card-078', card_number: 'D-0078', student: 'Fatuma Rajabu', last_scan: daysAgo(52).toISOString() },
    { card_id: 'card-084', card_number: 'D-0084', student: 'Peter Nyembe', last_scan: daysAgo(63).toISOString() },
    { card_id: 'card-092', card_number: 'D-0092', student: 'Gift Mgaya', last_scan: daysAgo(77).toISOString() },
    { card_id: 'card-105', card_number: 'D-0105', student: 'Sauda Mkumbwa', last_scan: daysAgo(90).toISOString() },
];

/** GET /insights/dormant-cards?days= — cards with no scan for `days` days. */
export const filterDormantCards = (days: number = 30): DormantCardRow[] =>
    DORMANT_MOCK.filter((row) => daysSince(row.last_scan) >= days);
