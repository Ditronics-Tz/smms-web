import React, { useEffect, useMemo, useState } from "react";
import { connect, useDispatch } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
    Box,
    Button,
    Chip,
    Divider,
    Drawer,
    FormControl,
    FormLabel,
    IconButton,
    Input,
    Option,
    Select,
    Sheet,
    Skeleton,
    Stack,
    Table,
    Typography,
    iconButtonClasses,
} from "@mui/joy";
import SearchIcon from "@mui/icons-material/Search";
import FilterAltOffRounded from "@mui/icons-material/FilterAltOffRounded";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import RefreshRounded from "@mui/icons-material/RefreshRounded";
import CheckCircleRounded from "@mui/icons-material/CheckCircleRounded";
import ErrorOutlineRounded from "@mui/icons-material/ErrorOutlineRounded";
import OpenInNewRounded from "@mui/icons-material/OpenInNewRounded";
import CloseRounded from "@mui/icons-material/CloseRounded";

import { STATUS } from "../../../constant";
import { journalRequest, journalReset } from "../../../store/actions";
import { PageTitle } from "../../../components";
import branding from "../../../config/branding";
import {
    formatDate,
    formatMoney,
    ledgerEventLabel,
    LEDGER_EVENT_COLORS,
    LEDGER_EVENT_TYPES,
    isEntryBalanced,
    sumLines,
} from "../../../utils";
import {
    NAVIGATE_TO_BANKDEPOSITPAGE,
    NAVIGATE_TO_CARDPAGE,
    NAVIGATE_TO_TRANSACTIONPAGE,
} from "../../../route/types";

type JournalEntry = {
    id: string;
    event_type: string;
    memo: string;
    created_at: string;
    ref_transaction: string | null;
    ref_deposit: string | null;
    card_number?: string | null;
    lines: any[];
};

const EMPTY_PAGINATION = { count: 0, page: 1, totalPages: 0 };

/**
 * The value worth showing in the "total" column: money that left the wallet.
 * A credit-only entry (a deposit) has no wallet debit, so it shows 0 rather than
 * a misleading number — the drawer has the full picture either way.
 */
const walletDebit = (entry: JournalEntry) => {
    const walletLines = (entry?.lines ?? []).filter(
        (line: any) => line?.direction === "debit" && line?.rfid_card
    );
    if (walletLines.length) return sumLines(walletLines, "debit");
    return sumLines(entry?.lines, "debit");
};

const EventChip = ({ eventType, t }: { eventType: string; t: (k: string) => string }) => (
    <Chip
        size="sm"
        variant="soft"
        color={LEDGER_EVENT_COLORS[eventType as keyof typeof LEDGER_EVENT_COLORS] ?? "neutral"}
    >
        {ledgerEventLabel(t, eventType)}
    </Chip>
);

/**
 * FE-11 — Ledger journal (admin).
 *
 * Read-only by design: the ledger is append-only on the backend, so this screen
 * offers no edit or delete - only a drawer that inspects the lines of one entry.
 *
 * The filters live in the URL query string, so a filtered view can be shared,
 * bookmarked and reloaded and comes back exactly as it was. useSearchParams is
 * the source of truth; no filter is kept in component state that the URL does
 * not already carry.
 */
export const JournalPage = ({
    accessToken,
    isSuperuser,
    journalStatus,
    journalResult,
    journalErrorMessage,
    journalPagination,
}) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const [searchParams, setSearchParams] = useSearchParams();

    const [openEntry, setOpenEntry] = useState<JournalEntry | null>(null);
    const [cardSearch, setCardSearch] = useState(searchParams.get("card_number") ?? "");

    // ---- filters, read straight out of the URL ----
    const from = searchParams.get("from") ?? "";
    const to = searchParams.get("to") ?? "";
    const account = searchParams.get("account") ?? "";
    const cardNumber = searchParams.get("card_number") ?? "";
    const eventTypes = useMemo(
        () => (searchParams.get("event_type") ?? "").split(",").filter(Boolean),
        [searchParams]
    );
    const page = Math.max(1, Number(searchParams.get("page") ?? 1) || 1);

    const loading = journalStatus === STATUS.LOADING;
    const failed = journalStatus === STATUS.ERROR;
    const rows: JournalEntry[] = journalResult ?? [];
    const pagination = journalPagination ?? EMPTY_PAGINATION;
    const totalPages = pagination.totalPages ?? 0;
    const hasFilters = !!(from || to || account || cardNumber || eventTypes.length);

    /** Writes filters back to the URL. Any filter change returns to page 1. */
    const applyFilters = (patch: Record<string, string>) => {
        const next = new URLSearchParams(searchParams);
        Object.entries(patch).forEach(([key, value]) => {
            if (value) next.set(key, value);
            else next.delete(key);
        });
        next.delete("page");
        setSearchParams(next);
    };

    // Only the filters the backend understands are passed on; an empty string
    // would go out as a real filter value and match nothing.
    const filters = useMemo(() => {
        const value: Record<string, string> = {};
        if (from) value.from = from;
        if (to) value.to = to;
        if (account) value.account = account;
        if (cardNumber) value.card_number = cardNumber;
        if (eventTypes.length) value.event_type = eventTypes.join(",");
        return value;
    }, [from, to, account, cardNumber, eventTypes]);

    const filterKey = JSON.stringify(filters);

    useEffect(() => {
        dispatch(journalRequest(accessToken, filters, page));
        return () => {
            dispatch(journalReset());
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [accessToken, page, filterKey]);

    // The card search is a text field, so it is debounced rather than firing a
    // request per keystroke.
    useEffect(() => {
        if (cardSearch === cardNumber) return;
        const timer = setTimeout(() => applyFilters({ card_number: cardSearch.trim() }), 400);
        return () => clearTimeout(timer);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [cardSearch]);

    const retry = () => dispatch(journalRequest(accessToken, filters, page));

    const setPage = (next: number) => {
        const params = new URLSearchParams(searchParams);
        if (next <= 1) params.delete("page");
        else params.set("page", String(next));
        setSearchParams(params);
    };

    const handleClear = () => {
        setCardSearch("");
        setSearchParams(new URLSearchParams());
    };

    return (
        <Box>
            <PageTitle title={t("ledger.title")} />

            <Typography level="body-sm" sx={{ mb: 1 }}>
                {t("ledger.description")}
            </Typography>

            {/* ---------------- filters ---------------- */}
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
                <FormControl sx={{ flex: "0 1 160px", minWidth: 0 }}>
                    <FormLabel>{t("ledger.filters.from")}</FormLabel>
                    <Input
                        size="sm"
                        type="date"
                        value={from}
                        onChange={(e) => applyFilters({ from: e.target.value })}
                        slotProps={{ input: { max: to || undefined } }}
                    />
                </FormControl>

                <FormControl sx={{ flex: "0 1 160px", minWidth: 0 }}>
                    <FormLabel>{t("ledger.filters.to")}</FormLabel>
                    <Input
                        size="sm"
                        type="date"
                        value={to}
                        onChange={(e) => applyFilters({ to: e.target.value })}
                        slotProps={{ input: { min: from || undefined } }}
                    />
                </FormControl>

                <FormControl sx={{ flex: "1 1 190px", minWidth: 0 }}>
                    <FormLabel>{t("ledger.filters.eventType")}</FormLabel>
                    <Select
                        size="sm"
                        multiple
                        value={eventTypes}
                        onChange={(e, newValue) =>
                            applyFilters({
                                event_type: (newValue as unknown as string[]).join(","),
                            })
                        }
                        renderValue={(selected) =>
                            selected.length === 0 ? (
                                t("ledger.filters.allTypes")
                            ) : (
                                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                                    {(selected as unknown as string[]).map((type) => (
                                        <EventChip key={type} eventType={type} t={t} />
                                    ))}
                                </Box>
                            )
                        }
                        sx={{ minHeight: "36px" }}
                    >
                        {LEDGER_EVENT_TYPES.map((type) => (
                            <Option key={type} value={type}>
                                {ledgerEventLabel(t, type)}
                            </Option>
                        ))}
                    </Select>
                </FormControl>

                <FormControl sx={{ flex: "1 1 170px", minWidth: 0 }}>
                    <FormLabel>{t("ledger.filters.cardNumber")}</FormLabel>
                    <Input
                        size="sm"
                        value={cardSearch}
                        onChange={(e) => setCardSearch(e.target.value)}
                        placeholder={t("ledger.filters.cardPlaceholder")}
                        startDecorator={<SearchIcon />}
                    />
                </FormControl>

                <FormControl sx={{ flex: "0 1 130px", minWidth: 0 }}>
                    <FormLabel>{t("ledger.filters.account")}</FormLabel>
                    <Input
                        size="sm"
                        value={account}
                        onChange={(e) =>
                            // Account codes are numeric; strip anything else so a
                            // typo cannot silently return an empty page.
                            applyFilters({ account: e.target.value.replace(/\D/g, "") })
                        }
                        placeholder={t("ledger.filters.accountPlaceholder")}
                    />
                </FormControl>

                <Button
                    size="sm"
                    variant="outlined"
                    color="neutral"
                    onClick={handleClear}
                    disabled={!hasFilters || loading}
                    startDecorator={<FilterAltOffRounded />}
                    sx={{ flex: "0 0 auto" }}
                >
                    {t("ledger.filters.clear")}
                </Button>
            </Sheet>

            {/* ---------------- results ---------------- */}
            {loading ? (
                <JournalSkeleton />
            ) : failed ? (
                <Sheet variant="outlined" sx={{ p: 3, borderRadius: "md", textAlign: "center" }}>
                    <ErrorOutlineRounded sx={{ fontSize: 40, color: "danger.plainColor" }} />
                    <Typography level="title-md">{t("ledger.errorTitle")}</Typography>
                    <Typography level="body-sm" sx={{ color: "text.tertiary", mb: 2 }}>
                        {journalErrorMessage || t("ledger.errorDesc")}
                    </Typography>
                    <Button onClick={retry} startDecorator={<RefreshRounded />}>
                        {t("init.retry")}
                    </Button>
                </Sheet>
            ) : rows.length === 0 ? (
                <Sheet variant="outlined" sx={{ p: 3, borderRadius: "md", textAlign: "center" }}>
                    <Typography level="title-md">
                        {hasFilters ? t("ledger.emptyFiltered") : t("ledger.empty")}
                    </Typography>
                    {hasFilters && (
                        <Button
                            variant="outlined"
                            color="neutral"
                            onClick={handleClear}
                            sx={{ mt: 2 }}
                        >
                            {t("ledger.filters.clear")}
                        </Button>
                    )}
                </Sheet>
            ) : (
                <>
                    <JournalTable
                        rows={rows}
                        isSuperuser={isSuperuser}
                        onOpen={setOpenEntry}
                    />

                    {totalPages > 1 && (
                        <Box
                            sx={{
                                pt: 1,
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
                                disabled={page <= 1 || loading}
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
                                textAlign="center"
                                sx={{ display: { xs: "flex", md: "none" } }}
                            >
                                {t("init.page")} {page} {t("init.of")} {totalPages}
                            </Typography>

                            <Box sx={{ flex: 1 }} />

                            <Button
                                size="sm"
                                variant="outlined"
                                color="neutral"
                                endDecorator={<KeyboardArrowRightIcon />}
                                onClick={() => setPage(page + 1)}
                                disabled={page >= totalPages || loading}
                            >
                                {t("init.next")}
                            </Button>
                        </Box>
                    )}
                </>
            )}

            <EntryDrawer
                entry={openEntry}
                onClose={() => setOpenEntry(null)}
                isSuperuser={isSuperuser}
            />
        </Box>
    );
};

/** Skeleton rows: the table shape is known, so the wait is not a blank screen. */
const JournalSkeleton = () => (
    <Sheet variant="outlined" sx={{ borderRadius: "sm", overflow: "hidden" }}>
        <Table sx={{ minWidth: 720 }}>
            <thead>
                <tr>
                    <th>
                        <Skeleton level="title-sm" />
                    </th>
                    <th>
                        <Skeleton level="title-sm" />
                    </th>
                    <th>
                        <Skeleton level="title-sm" />
                    </th>
                    <th>
                        <Skeleton level="title-sm" />
                    </th>
                    <th>
                        <Skeleton level="title-sm" />
                    </th>
                    <th>
                        <Skeleton level="title-sm" />
                    </th>
                </tr>
            </thead>
            <tbody>
                {Array.from({ length: 8 }).map((_, rowIndex) => (
                    <tr key={rowIndex}>
                        {Array.from({ length: 6 }).map((__, cellIndex) => (
                            <td key={cellIndex}>
                                <Skeleton level="body-sm" />
                            </td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </Table>
    </Sheet>
);

const JournalTable = ({
    rows,
    isSuperuser,
    onOpen,
}: {
    rows: JournalEntry[];
    isSuperuser: boolean;
    onOpen: (entry: JournalEntry) => void;
}) => {
    const { t } = useTranslation();

    return (
        <>
            {/* Desktop: the full table. */}
            <Sheet
                variant="outlined"
                sx={{
                    borderRadius: "sm",
                    overflow: "auto",
                    display: { xs: "none", md: "block" },
                }}
            >
                <Table stickyHeader sx={{ minWidth: 720 }}>
                    <thead>
                        <tr>
                            <th>{t("ledger.columns.dateTime")}</th>
                            <th>{t("ledger.columns.eventType")}</th>
                            <th>{t("ledger.columns.memo")}</th>
                            <th>{t("ledger.columns.cardNumber")}</th>
                            <th style={{ textAlign: "right" }}>
                                {t("ledger.columns.total")} ({branding.CURRENCY_SYMBOL})
                            </th>
                            <th style={{ textAlign: "center" }}>
                                {t("ledger.columns.lines")}
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((entry) => (
                            <tr
                                key={entry.id}
                                onClick={() => onOpen(entry)}
                                style={{ cursor: "pointer" }}
                            >
                                <td>
                                    <Typography level="body-sm" sx={{ whiteSpace: "nowrap" }}>
                                        {formatDate(entry.created_at)}
                                    </Typography>
                                </td>
                                <td>
                                    <EventChip eventType={entry.event_type} t={t} />
                                </td>
                                <td>
                                    <Typography level="body-sm">{entry.memo || "-"}</Typography>
                                </td>
                                <td>
                                    <CardLink
                                        cardNumber={entry.card_number}
                                        isSuperuser={isSuperuser}
                                    />
                                </td>
                                <td style={{ textAlign: "right" }}>
                                    <Typography level="body-sm">
                                        {formatMoney(walletDebit(entry))}
                                    </Typography>
                                </td>
                                <td style={{ textAlign: "center" }}>
                                    <Typography level="body-sm">
                                        {entry.lines?.length ?? 0}
                                    </Typography>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </Sheet>

            {/* Mobile: cards, so a 360px screen is not a horizontally scrolled
                table with the memo cut off. */}
            <Stack gap={1} sx={{ display: { xs: "flex", md: "none" } }}>
                {rows.map((entry) => (
                    <Sheet
                        key={entry.id}
                        variant="outlined"
                        onClick={() => onOpen(entry)}
                        sx={{ p: 1.5, borderRadius: "sm", cursor: "pointer" }}
                    >
                        <Stack
                            direction="row"
                            justifyContent="space-between"
                            alignItems="center"
                            gap={1}
                        >
                            <EventChip eventType={entry.event_type} t={t} />
                            <Typography level="title-sm">
                                {formatMoney(walletDebit(entry))}
                            </Typography>
                        </Stack>
                        <Typography level="body-sm" sx={{ mt: 0.5 }}>
                            {entry.memo || "-"}
                        </Typography>
                        <Typography level="body-xs" sx={{ color: "text.tertiary" }}>
                            {formatDate(entry.created_at)}
                            {entry.card_number ? ` · ${entry.card_number}` : ""}
                        </Typography>
                    </Sheet>
                ))}
            </Stack>
        </>
    );
};

/**
 * Card number as a link where there is somewhere to go, plain text otherwise.
 * Card details live behind the superuser-only card page, so for a plain admin
 * this is text rather than a link that would bounce them to the dashboard.
 */
const CardLink = ({
    cardNumber,
    isSuperuser,
}: {
    cardNumber?: string | null;
    isSuperuser: boolean;
}) => {
    if (!cardNumber) return <Typography level="body-sm">-</Typography>;
    if (!isSuperuser) return <Typography level="body-sm">{cardNumber}</Typography>;

    return (
        <Typography
            level="body-sm"
            component="a"
            href={`${NAVIGATE_TO_CARDPAGE}?card_number=${encodeURIComponent(cardNumber)}`}
            onClick={(event: React.MouseEvent) => event.stopPropagation()}
            sx={{
                color: "primary.plainColor",
                textDecoration: "underline",
                cursor: "pointer",
            }}
        >
            {cardNumber}
        </Typography>
    );
};

/**
 * The drawer: every line of one entry, a totals row, and the balanced check.
 *
 * The check is computed in the browser from the lines shown, not taken from the
 * response: seeing a red "does not balance" here is the entire point of the
 * screen.
 */
const EntryDrawer = ({
    entry,
    onClose,
    isSuperuser,
}: {
    entry: JournalEntry | null;
    onClose: () => void;
    isSuperuser: boolean;
}) => {
    const { t } = useTranslation();

    const lines = entry?.lines ?? [];
    const debit = sumLines(lines, "debit");
    const credit = sumLines(lines, "credit");
    const balanced = isEntryBalanced(lines);

    return (
        <Drawer
            open={!!entry}
            onClose={onClose}
            anchor="right"
            size="lg"
            slotProps={{ backdrop: { sx: { backgroundColor: "rgba(0,0,0,0.5)" } } }}
        >
            {/* This version of @mui/joy has no DrawerContent / DrawerHeader
                sub-components, so the panel is a Sheet inside the Drawer. */}
            <Sheet
                variant="outlined"
                sx={{
                    p: 2,
                    height: "100%",
                    overflow: "auto",
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                }}
            >
                {entry ? (
                    <>
                        <Stack
                            direction="row"
                            justifyContent="space-between"
                            alignItems="center"
                            gap={1}
                            sx={{ width: "100%" }}
                        >
                            <Stack direction="row" gap={1} alignItems="center">
                                <EventChip eventType={entry.event_type} t={t} />
                                <Typography level="title-md">
                                    {ledgerEventLabel(t, entry.event_type)}
                                </Typography>
                            </Stack>
                            <IconButton onClick={onClose} size="sm">
                                <CloseRounded />
                            </IconButton>
                        </Stack>

                        <Typography level="body-xs" sx={{ color: "text.tertiary" }}>
                            {formatDate(entry.created_at)}
                        </Typography>
                    </>
                ) : (
                    <Typography level="title-md">{t("ledger.drawer.title")}</Typography>
                )}

                {entry && (
                    <>
                        <Stack gap={2}>
                                <Sheet variant="soft" sx={{ p: 1.5, borderRadius: "sm" }}>
                                    <Typography level="body-sm">
                                        {t("ledger.drawer.memo")}: {entry.memo || "-"}
                                    </Typography>
                                    {entry.card_number && (
                                        <Stack
                                            direction="row"
                                            alignItems="center"
                                            gap={0.5}
                                            sx={{ mt: 0.5 }}
                                        >
                                            <Typography level="body-sm">
                                                {t("ledger.columns.cardNumber")}:{" "}
                                                <CardLink
                                                    cardNumber={entry.card_number}
                                                    isSuperuser={isSuperuser}
                                                />
                                            </Typography>
                                        </Stack>
                                    )}
                                </Sheet>

                                {/* lines */}
                                <Sheet
                                    variant="outlined"
                                    sx={{ borderRadius: "sm", overflow: "auto" }}
                                >
                                    <Table sx={{ minWidth: 420 }}>
                                        <thead>
                                            <tr>
                                                <th>{t("ledger.columns.account")}</th>
                                                <th>{t("ledger.columns.card")}</th>
                                                <th style={{ textAlign: "right" }}>
                                                    {t("ledger.columns.debit")}
                                                </th>
                                                <th style={{ textAlign: "right" }}>
                                                    {t("ledger.columns.credit")}
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {lines.map((line: any, index: number) => (
                                                <tr key={`${line.account}-${index}`}>
                                                    <td>
                                                        <Typography level="body-sm">
                                                            {line.account} · {line.account_name}
                                                        </Typography>
                                                    </td>
                                                    <td>
                                                        <Typography level="body-sm">
                                                            {line.rfid_card
                                                                ? line.rfid_card.slice(-6)
                                                                : "-"}
                                                        </Typography>
                                                    </td>
                                                    <td style={{ textAlign: "right" }}>
                                                        <Typography
                                                            level="body-sm"
                                                            sx={{
                                                                color:
                                                                    line.direction === "debit"
                                                                        ? "danger.plainColor"
                                                                        : undefined,
                                                            }}
                                                        >
                                                            {line.direction === "debit"
                                                                ? formatMoney(line.amount)
                                                                : "-"}
                                                        </Typography>
                                                    </td>
                                                    <td style={{ textAlign: "right" }}>
                                                        <Typography
                                                            level="body-sm"
                                                            sx={{
                                                                color:
                                                                    line.direction === "credit"
                                                                        ? "success.plainColor"
                                                                        : undefined,
                                                            }}
                                                        >
                                                            {line.direction === "credit"
                                                                ? formatMoney(line.amount)
                                                                : "-"}
                                                        </Typography>
                                                    </td>
                                                </tr>
                                            ))}
                                            <tr>
                                                <td colSpan={2}>
                                                    <Typography level="body-sm">
                                                        {t("ledger.drawer.totals")}
                                                    </Typography>
                                                </td>
                                                <td style={{ textAlign: "right" }}>
                                                    <Typography level="title-sm">
                                                        {formatMoney(debit)}
                                                    </Typography>
                                                </td>
                                                <td style={{ textAlign: "right" }}>
                                                    <Typography level="title-sm">
                                                        {formatMoney(credit)}
                                                    </Typography>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </Table>
                                </Sheet>

                                {/* the balance check */}
                                {balanced ? (
                                    <Chip
                                        color="success"
                                        variant="soft"
                                        startDecorator={<CheckCircleRounded />}
                                        sx={{ alignSelf: "flex-start" }}
                                    >
                                        {t("ledger.drawer.balanced")}
                                    </Chip>
                                ) : (
                                    <Sheet
                                        variant="outlined"
                                        color="danger"
                                        sx={{ p: 1.5, borderRadius: "sm" }}
                                    >
                                        <Stack direction="row" gap={1} alignItems="center">
                                            <ErrorOutlineRounded color="error" />
                                            <Box>
                                                <Typography level="title-sm" color="danger">
                                                    {t("ledger.drawer.notBalancedTitle")}
                                                </Typography>
                                                <Typography level="body-sm">
                                                    {t("ledger.drawer.notBalancedDesc", {
                                                        debit: formatMoney(debit),
                                                        credit: formatMoney(credit),
                                                    })}
                                                </Typography>
                                            </Box>
                                        </Stack>
                                    </Sheet>
                                )}

                                {/* related records */}
                                {entry.ref_transaction && (
                                    <RelatedLink
                                        label={t("ledger.drawer.relatedTransaction")}
                                        href={`${NAVIGATE_TO_TRANSACTIONPAGE}?transaction=${encodeURIComponent(
                                            entry.ref_transaction
                                        )}`}
                                    />
                                )}
                                {entry.ref_deposit && (
                                    <RelatedLink
                                        label={t("ledger.drawer.relatedDeposit")}
                                        href={`${NAVIGATE_TO_BANKDEPOSITPAGE}?deposit=${encodeURIComponent(
                                            entry.ref_deposit
                                        )}`}
                                    />
                                )}

                                <Divider />

                                <Typography level="body-xs" sx={{ color: "text.tertiary" }}>
                                    {t("ledger.drawer.entryId")}: {entry.id}
                                </Typography>
                            </Stack>
                        </>
                    )}
            </Sheet>
        </Drawer>
    );
};

const RelatedLink = ({ label, href }: { label: string; href: string }) => (
    <Button
        component="a"
        href={href}
        variant="outlined"
        color="neutral"
        size="sm"
        endDecorator={<OpenInNewRounded />}
        sx={{ alignSelf: "flex-start" }}
    >
        {label}
    </Button>
);

const mapStateToProps = ({ auth, ledger }) => {
    const { accessToken, loginResult } = auth;

    return {
        accessToken,
        isSuperuser: !!loginResult?.user?.is_superuser,
        journalStatus: ledger?.journalStatus,
        journalResult: ledger?.journalResult,
        journalErrorMessage: ledger?.journalErrorMessage,
        journalPagination: ledger?.journalPagination,
    };
};

export default connect(mapStateToProps, {})(JournalPage);
