import React, { useEffect, useMemo } from "react";
import {
    Box,
    Button,
    Chip,
    ColorPaletteProp,
    FormControl,
    FormLabel,
    IconButton,
    Input,
    Option,
    Select,
    Sheet,
    Stack,
    Table,
    Typography,
    iconButtonClasses,
} from "@mui/joy";
import FilterAltOffRounded from "@mui/icons-material/FilterAltOffRounded";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import { connect, useDispatch } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { STATUS } from "../../../constant";
import { parentStudentsRequest, parentStudentsReset } from "../../../store/dashboard/actions";
import { cardStatementRequest, cardStatementReset } from "../../../store/ledger/actions";
import { LoadingView, PageTitle } from "../../../components";
import { formatDate, formatMoney, ledgerEventLabel, LEDGER_EVENT_COLORS } from "../../../utils";

/**
 * FE-14 - the parent statement.
 *
 * The sidebar's "Statement" entry pointed at /statement, but no route and no
 * page existed behind it, so a parent clicking it landed on the 404. This is
 * that page.
 *
 * Read-only by design: the ledger offers no edits anywhere in this app, and a
 * parent must never be able to change a balance from here.
 *
 * A parent only ever sees their own children. The child list comes from
 * /dashboard/parent-students, and a card that is not one of those children comes
 * back 403 from the backend, which is shown as a plain message rather than an
 * empty table.
 *
 * Filters live in the query string, like the admin journal, so a statement can be
 * bookmarked or sent to the canteen in a message.
 */

interface StatementRow {
    id: string;
    event_type?: string | null;
    memo?: string | null;
    created_at?: string | null;
    /** The ledger reports one amount and which side it hit. */
    direction?: "debit" | "credit" | string | null;
    amount?: string | number | null;
    balance_after?: string | number | null;
}

interface ParentStudent {
    id?: string;
    first_name?: string;
    middle_name?: string;
    last_name?: string;
    rfid_card?: {
        id?: string | number;
        card_id?: string | number;
        card_number?: string;
        balance?: string | number | null;
    } | null;
}

const cardIdOf = (student: ParentStudent): string =>
    String(student?.rfid_card?.id ?? student?.rfid_card?.card_id ?? "");

const cardNumberOf = (student: ParentStudent): string => student?.rfid_card?.card_number ?? "-";

const nameOf = (student: ParentStudent): string =>
    [student?.first_name, student?.middle_name, student?.last_name].filter(Boolean).join(" ") || "-";

const rowDate = (row: StatementRow) => row?.created_at ?? "";

/** Money in is green, money out is red, matching the rest of the app. */
const amountColor = (direction?: string | null): ColorPaletteProp =>
    direction === "credit" ? "success" : "danger";

/**
 * Signed display amount. The ledger gives an amount plus a direction, so the sign
 * is applied here rather than sent as a second value.
 */
const signedAmount = (row: StatementRow): number => {
    const amount = Number(row?.amount ?? 0);
    const value = Number.isFinite(amount) ? amount : 0;
    return row?.direction === "debit" ? -Math.abs(value) : Math.abs(value);
};

/** A 403 means the card is not one of this parent's children. */
const isForbidden = (message?: string) => !!message && /\b403\b|forbidden|not\s+allowed/i.test(message);

export const StatementPage = ({
    accessToken,
    studentsStatus,
    studentsResult,
    statementStatus,
    statementErrorMessage,
    statementPagination,
}: any) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const [searchParams, setSearchParams] = useSearchParams();

    // Held in a memo because `studentsResult ?? []` builds a fresh array on
    // every render, which would invalidate the lookups below each time.
    const students: ParentStudent[] = useMemo(() => studentsResult ?? [], [studentsResult]);
    const pagination = statementPagination ?? {};

    // Which child is being viewed. Defaults to the first one so the page says
    // something useful immediately instead of showing an empty picker.
    const requestedCardId = searchParams.get("card") ?? "";
    const activeCardId = useMemo(
        () => requestedCardId || cardIdOf(students[0] ?? {}),
        [requestedCardId, students]
    );
    const activeStudent = useMemo(
        () => students.find((student) => cardIdOf(student) === activeCardId),
        [students, activeCardId]
    );

    const from = searchParams.get("from") ?? "";
    const to = searchParams.get("to") ?? "";
    const page = Math.max(1, Number(searchParams.get("page") ?? 1) || 1);
    const hasFilters = !!(from || to);

    // An empty string would go out as a real filter value and match nothing, so
    // only the parameters that are actually set are sent.
    const filters = useMemo(() => {
        const value: Record<string, string> = {};
        if (from) value.from = from;
        if (to) value.to = to;
        return value;
    }, [from, to]);
    const filterKey = JSON.stringify(filters);

    const loadingStudents = studentsStatus === STATUS.LOADING;
    const loadingStatement = statementStatus === STATUS.LOADING;
    const failedStatement = statementStatus === STATUS.ERROR;
    const forbidden = failedStatement && isForbidden(statementErrorMessage);

    useEffect(() => {
        dispatch(parentStudentsRequest(accessToken, {}));
        return () => {
            dispatch(parentStudentsReset());
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [accessToken]);

    useEffect(() => {
        if (!activeCardId) return undefined;
        dispatch(cardStatementRequest(accessToken, activeCardId, filters, page));
        return () => {
            dispatch(cardStatementReset());
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [accessToken, activeCardId, page, filterKey]);

    const applyFilters = (patch: Record<string, string>) => {
        const next = new URLSearchParams(searchParams);
        Object.entries(patch).forEach(([key, value]) => {
            if (value) next.set(key, value);
            else next.delete(key);
        });
        // Any filter change invalidates the current page number.
        next.delete("page");
        setSearchParams(next);
    };

    const selectChild = (cardId: string) => {
        const next = new URLSearchParams(searchParams);
        next.set("card", cardId);
        next.delete("page");
        setSearchParams(next);
    };

    const setPage = (next: number) => {
        const params = new URLSearchParams(searchParams);
        if (next <= 1) params.delete("page");
        else params.set("page", String(next));
        setSearchParams(params);
    };

    const retry = () => dispatch(cardStatementRequest(accessToken, activeCardId, filters, page));

    const rows: StatementRow[] = pagination.results ?? [];
    const totalPages = pagination.totalPages ?? 0;
    const totalRows = pagination.count ?? rows.length;

    return (
        <Box>
            <PageTitle title={t("statement.title")} />

            <Typography level="body-sm" sx={{ mb: 1, color: "text.secondary" }}>
                {t("statement.description")}
            </Typography>

            {/* ---------- child + date filters ---------- */}
            <Sheet
                variant="outlined"
                sx={{
                    p: { xs: 1, sm: 1.5 },
                    mb: 1,
                    borderRadius: "sm",
                    display: "flex",
                    flexWrap: "wrap",
                    alignItems: "flex-end",
                    gap: 1.5,
                }}
            >
                <FormControl sx={{ flex: "1 1 220px", minWidth: 0 }}>
                    <FormLabel>{t("statement.child")}</FormLabel>
                    <Select
                        size="sm"
                        value={activeCardId || null}
                        onChange={(_, value) => selectChild(String(value))}
                        placeholder={t("statement.selectChild")}
                        disabled={loadingStudents || !students.length}
                        sx={{ minHeight: "36px" }}
                    >
                        {students.map((student) => (
                            <Option key={cardIdOf(student)} value={cardIdOf(student)}>
                                {nameOf(student)} ({cardNumberOf(student)})
                            </Option>
                        ))}
                    </Select>
                </FormControl>

                <FormControl sx={{ flex: "0 1 160px", minWidth: 0 }}>
                    <FormLabel>{t("transaction.filters.from")}</FormLabel>
                    <Input
                        size="sm"
                        type="date"
                        value={from}
                        onChange={(e) => applyFilters({ from: e.target.value })}
                        slotProps={{ input: { max: to || undefined } }}
                    />
                </FormControl>

                <FormControl sx={{ flex: "0 1 160px", minWidth: 0 }}>
                    <FormLabel>{t("transaction.filters.to")}</FormLabel>
                    <Input
                        size="sm"
                        type="date"
                        value={to}
                        onChange={(e) => applyFilters({ to: e.target.value })}
                        slotProps={{ input: { min: from || undefined } }}
                    />
                </FormControl>

                <Button
                    size="sm"
                    variant="outlined"
                    color="neutral"
                    onClick={() => setSearchParams(new URLSearchParams())}
                    disabled={!hasFilters || loadingStatement}
                    startDecorator={<FilterAltOffRounded />}
                    sx={{ flex: "0 0 auto" }}
                >
                    {t("ledger.filters.clear")}
                </Button>
            </Sheet>

            {/* ---------- child list states ---------- */}
            <LoadingView loading={loadingStudents} />

            {studentsStatus === STATUS.ERROR && (
                <Sheet
                    variant="outlined"
                    color="danger"
                    sx={{
                        p: 2,
                        mb: 1,
                        borderRadius: "sm",
                        display: "flex",
                        flexWrap: "wrap",
                        alignItems: "center",
                        gap: 1,
                    }}
                >
                    <Typography level="body-sm" sx={{ flex: "1 1 240px" }}>
                        {t("statement.childrenError")}
                    </Typography>
                    <Button
                        size="sm"
                        variant="outlined"
                        color="danger"
                        onClick={() => dispatch(parentStudentsRequest(accessToken, {}))}
                    >
                        {t("transaction.retry")}
                    </Button>
                </Sheet>
            )}

            {!loadingStudents && studentsStatus !== STATUS.ERROR && !students.length && (
                <Sheet variant="outlined" sx={{ p: 3, mb: 1, borderRadius: "sm", textAlign: "center" }}>
                    <Typography level="body-sm" sx={{ color: "text.secondary" }}>
                        {t("statement.noChildren")}
                    </Typography>
                </Sheet>
            )}

            {/* ---------- statement states ---------- */}
            {activeCardId && <LoadingView loading={loadingStatement} />}

            {activeCardId && failedStatement && (
                <Sheet
                    variant="outlined"
                    color="danger"
                    sx={{
                        p: 2,
                        mb: 1,
                        borderRadius: "sm",
                        display: "flex",
                        flexWrap: "wrap",
                        alignItems: "center",
                        gap: 1,
                    }}
                >
                    <Typography level="body-sm" sx={{ flex: "1 1 240px" }}>
                        {forbidden ? t("statement.forbidden") : t("statement.loadError")}
                    </Typography>
                    <Button size="sm" variant="outlined" color="danger" onClick={retry}>
                        {t("transaction.retry")}
                    </Button>
                </Sheet>
            )}

            {activeCardId && !loadingStatement && !failedStatement && (
                <StatementTable
                    rows={rows}
                    cardNumber={activeStudent?.rfid_card?.card_number}
                    balance={activeStudent?.rfid_card?.balance}
                    filtered={hasFilters}
                    totalRows={totalRows}
                />
            )}

            {/* ---------- pagination ---------- */}
            {totalPages > 1 && (
                <Box
                    sx={{
                        pt: 2,
                        gap: 1,
                        [`& .${iconButtonClasses.root}`]: { borderRadius: "50%" },
                        display: "flex",
                        alignItems: "center",
                    }}
                >
                    <Button
                        size="sm"
                        variant="outlined"
                        color="neutral"
                        startDecorator={<KeyboardArrowLeftIcon />}
                        onClick={() => setPage(page - 1)}
                        disabled={page <= 1 || loadingStatement}
                    >
                        {t("init.previous")}
                    </Button>

                    <Box sx={{ flex: 1 }} />

                    {Array.from({ length: totalPages }).map((_, index) => (
                        <IconButton
                            key={index}
                            size="sm"
                            variant="outlined"
                            color="neutral"
                            onClick={() => setPage(index + 1)}
                            disabled={page === index + 1}
                            sx={{ display: { xs: "none", md: "flex" } }}
                        >
                            {index + 1}
                        </IconButton>
                    ))}

                    <Typography
                        level="body-sm"
                        mx="auto"
                        textAlign="center"
                        sx={{ display: { xs: "flex", md: "none" } }}
                    >
                        {page} / {totalPages}
                    </Typography>

                    <Box sx={{ flex: 1 }} />

                    <Button
                        size="sm"
                        variant="outlined"
                        color="neutral"
                        endDecorator={<KeyboardArrowRightIcon />}
                        onClick={() => setPage(page + 1)}
                        disabled={page >= totalPages || loadingStatement}
                    >
                        {t("init.next")}
                    </Button>
                </Box>
            )}
        </Box>
    );
};

/**
 * One row per ledger entry on the card, with the running balance the ledger
 * recorded at the time.
 *
 * Mobile-first: the card list is what a 360px phone actually gets, and the wide
 * table is only rendered from `md` up. The same table side-scrolled on a phone
 * pushed the amount off screen.
 */
const StatementTable = ({ rows, cardNumber, balance, filtered, totalRows }: any) => {
    const { t } = useTranslation();

    if (!rows?.length) {
        return (
            <Sheet variant="outlined" sx={{ p: 3, borderRadius: "sm", textAlign: "center" }}>
                <Typography level="body-sm" sx={{ color: "text.secondary" }}>
                    {filtered ? t("statement.emptyFiltered") : t("statement.empty")}
                </Typography>
            </Sheet>
        );
    }

    return (
        <Box>
            <Sheet
                variant="soft"
                sx={{ p: 1.5, mb: 1, borderRadius: "sm", display: "flex", flexWrap: "wrap", gap: 1 }}
            >
                <Typography level="body-sm">
                    <b>{t("student.card_number")}:</b> {cardNumber ?? "-"}
                </Typography>
                <Typography level="body-sm">
                    <b>{t("statement.currentBalance")}:</b>{" "}
                    {balance === null || balance === undefined ? "-" : formatMoney(balance)}
                </Typography>
                <Typography level="body-sm" sx={{ color: "text.secondary" }}>
                    <b>{t("statement.entries")}:</b> {totalRows}
                </Typography>
            </Sheet>

            {/* phones */}
            <Stack gap={1} sx={{ display: { xs: "flex", md: "none" } }}>
                {rows.map((row: StatementRow) => (
                    <Sheet key={row.id} variant="outlined" sx={{ p: 1.5, borderRadius: "sm" }}>
                        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" gap={1}>
                            <Box sx={{ minWidth: 0 }}>
                                <Chip
                                    size="sm"
                                    variant="soft"
                                    color={LEDGER_EVENT_COLORS[(row.event_type as any) ?? "adjustment"] ?? "neutral"}
                                >
                                    {ledgerEventLabel(t, row.event_type)}
                                </Chip>
                                <Typography level="body-xs" sx={{ color: "text.secondary", mt: 0.5 }}>
                                    {formatDate(rowDate(row))}
                                </Typography>
                                {row.memo && (
                                    <Typography level="body-sm" sx={{ color: "text.secondary" }}>
                                        {row.memo}
                                    </Typography>
                                )}
                            </Box>
                            <Stack alignItems="flex-end" gap={0.25}>
                                <Typography level="title-sm" color={amountColor(row.direction)}>
                                    {formatMoney(signedAmount(row))}
                                </Typography>
                                {row.balance_after !== null && row.balance_after !== undefined && (
                                    <Typography level="body-xs" sx={{ color: "text.secondary" }}>
                                        {t("statement.balance")} {formatMoney(row.balance_after)}
                                    </Typography>
                                )}
                            </Stack>
                        </Stack>
                    </Sheet>
                ))}
            </Stack>

            {/* desktop */}
            <Sheet
                variant="outlined"
                sx={{ borderRadius: "sm", overflow: "auto", display: { xs: "none", md: "block" } }}
            >
                <Table
                    stickyHeader
                    sx={{ "--TableCell-headBackground": "var(--joy-palette-background-level1)" }}
                >
                    <thead>
                        <tr>
                            <th>{t("bankDeposit.date")}</th>
                            <th>{t("ledger.columns.eventType")}</th>
                            <th>{t("ledger.columns.memo")}</th>
                            <th style={{ textAlign: "right" }}>{t("statement.amount")}</th>
                            <th style={{ textAlign: "right" }}>{t("statement.balance")}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((row: StatementRow) => (
                            <tr key={row.id}>
                                <td>
                                    <Typography level="body-sm">{formatDate(rowDate(row))}</Typography>
                                </td>
                                <td>
                                    <Chip
                                        size="sm"
                                        variant="soft"
                                        color={LEDGER_EVENT_COLORS[(row.event_type as any) ?? "adjustment"] ?? "neutral"}
                                    >
                                        {ledgerEventLabel(t, row.event_type)}
                                    </Chip>
                                </td>
                                <td>
                                    <Typography level="body-sm">{row.memo ?? "-"}</Typography>
                                </td>
                                <td style={{ textAlign: "right" }}>
                                    <Typography level="body-sm" color={amountColor(row.direction)}>
                                        {formatMoney(signedAmount(row))}
                                    </Typography>
                                </td>
                                <td style={{ textAlign: "right" }}>
                                    <Typography level="body-sm">
                                        {row.balance_after === null || row.balance_after === undefined
                                            ? "-"
                                            : formatMoney(row.balance_after)}
                                    </Typography>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </Sheet>
        </Box>
    );
};

const mapStateToProps = ({ auth, dashboard, ledger }: any) => ({
    accessToken: auth.accessToken,
    studentsStatus: dashboard.parentStudentsStatus,
    studentsResult: dashboard.parentStudentsResult,
    statementStatus: ledger.cardStatementStatus,
    statementErrorMessage: ledger.cardStatementErrorMessage,
    statementPagination: ledger.cardStatementPagination,
});

export default connect(mapStateToProps, {})(StatementPage);