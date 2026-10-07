import React, { useEffect, useMemo, useState } from "react";
import {
    Box,
    Button,
    Chip,
    ColorPaletteProp,
    FormControl,
    FormHelperText,
    FormLabel,
    Input,
    Option,
    Select,
    Sheet,
    Stack,
    Table,
    Typography,
    iconButtonClasses,
    IconButton,
} from "@mui/joy";
import AccountBalanceOutlined from "@mui/icons-material/AccountBalanceOutlined";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import SearchIcon from "@mui/icons-material/Search";
import FilterAltOffRounded from "@mui/icons-material/FilterAltOffRounded";
import { connect, useDispatch } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

import branding from "../../../config/branding";
import { STATUS } from "../../../constant";
import {
    depositRequest,
    depositRequestReset,
    depositListRequest,
    depositListReset,
} from "../../../store/actions";
import { LoadingView, PageTitle } from "../../../components";
import { formatDate, formatMoney, parseAmount } from "../../../utils";

const ITEMS_PER_PAGE = 50;

// The deposit states the API reports. Kept next to the colour map so the filter
// options and the row chips cannot drift apart.
const DEPOSIT_STATUSES = ["pending", "processing", "processed", "successful", "failed"] as const;

type DepositStatus = (typeof DEPOSIT_STATUSES)[number];

const getStatusColor = (status: string) =>
    ({
        pending: "neutral",
        processing: "warning",
        processed: "success",
        successful: "success",
        failed: "danger",
    }[status] ?? "neutral") as ColorPaletteProp;

const getStatusText = (t: (k: string) => string, status: string) =>
    t(`status.${status}`) === `status.${status}` ? status ?? "-" : t(`status.${status}`);

/** The row fields the page reads, with the fallbacks for each. */
const rowCardNumber = (row: any) => row?.card_number ?? row?.card?.card_number ?? "-";
const rowAmount = (row: any) => row?.amount ?? row?.deposit_amount ?? 0;
const rowDate = (row: any) => row?.created_at ?? row?.deposit_date ?? row?.date;
const rowStatus = (row: any) => row?.status ?? row?.deposit_status;

export const BankDepositPage = ({
    accessToken,
    depositStatus,
    depositResult,
    depositErrorMessage,
    depositRequestsStatus,
    depositRequestsResult,
    depositRequestsErrorMessage,
}) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const [searchParams, setSearchParams] = useSearchParams();

    const [cardNumber, setCardNumber] = useState("");
    const [amount, setAmount] = useState("");

    const [rows, setRows] = useState<any[]>([]);
    const [totalDeposits, setTotalDeposits] = useState(0);
    const [nextPage, setNextPage] = useState(null);
    const [previousPage, setPreviousPage] = useState(null);
    const [listFailed, setListFailed] = useState(false);

    // ---- filters, read straight out of the URL so a filtered history can be
    // shared, bookmarked and reloaded. Param names match the ledger convention.
    const filters = useMemo(() => ({
        search: searchParams.get("search") ?? "",
        from: searchParams.get("from") ?? "",
        to: searchParams.get("to") ?? "",
        status: (searchParams.get("status") ?? "")
            .split(",")
            .filter((s): s is DepositStatus => (DEPOSIT_STATUSES as readonly string[]).includes(s)),
    }), [searchParams]);

    const page = Math.max(1, Number(searchParams.get("page") ?? 1) || 1);

    // Only keys the user filled in are sent. GET /wallet/deposit/list takes
    // these as query params, and an empty string or empty list would go out as a
    // real filter value and match nothing.
    const query = useMemo(() => {
        const value: Record<string, string> = {};
        if (filters.search) value.search = filters.search;
        if (filters.from) value.from = filters.from;
        if (filters.to) value.to = filters.to;
        if (filters.status.length) value.status = filters.status.join(",");
        return value;
    }, [filters]);

    const queryKey = JSON.stringify(query);
    const hasFilters = !!(filters.search || filters.from || filters.to || filters.status.length);

    const amountValue = parseAmount(amount);
    const amountValid = Number.isFinite(amountValue) && amountValue > 0;
    const cardValue = cardNumber.trim();

    const submitting = depositStatus === STATUS.LOADING;
    const listing = depositRequestsStatus === STATUS.LOADING;

    /** Writes the filter bar back to the URL. Any change returns to page 1. */
    const applyFilters = (patch: Record<string, string>) => {
        const next = new URLSearchParams(searchParams);
        Object.entries(patch).forEach(([key, value]) => {
            if (value) next.set(key, value);
            else next.delete(key);
        });
        next.delete("page");
        setSearchParams(next);
    };

    const setPage = (next: number) => {
        const params = new URLSearchParams(searchParams);
        if (next <= 1) params.delete("page");
        else params.set("page", String(next));
        setSearchParams(params);
    };

    useEffect(() => {
        setListFailed(false);
        dispatch(depositListRequest(accessToken, query, page));
        return () => {
            dispatch(depositListReset());
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [accessToken, page, queryKey]);

    /* eslint-disable */
    useEffect(() => {
        if (depositStatus === STATUS.SUCCESS) {
            toast.success(depositResult?.message ?? t("bankDeposit.success"));
            setAmount("");
            dispatch(depositRequestReset());
        } else if (depositStatus === STATUS.ERROR) {
            toast.error(depositErrorMessage);
            dispatch(depositRequestReset());
        }
    }, [depositStatus])

    useEffect(() => {
        if (depositRequestsStatus === STATUS.SUCCESS) {
            setRows(depositRequestsResult?.results ?? []);
            setTotalDeposits(depositRequestsResult?.count ?? 0);
            setNextPage(depositRequestsResult?.next ?? null);
            setPreviousPage(depositRequestsResult?.previous ?? null);
            setListFailed(false);
        } else if (depositRequestsStatus === STATUS.ERROR) {
            toast.error(depositRequestsErrorMessage);
            // Keep the previous rows and show an error panel with a retry, rather
            // than clearing to a generic "not found" that hides the failure.
            setListFailed(true);
        }
    }, [depositRequestsStatus])
    /* eslint-enable */

    // A new deposit invalidates whatever filter/page is showing, so go back to
    // the top of the unfiltered list to confirm it landed.
    useEffect(() => {
        if (depositStatus === STATUS.SUCCESS) {
            setSearchParams(new URLSearchParams());
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [depositStatus]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!cardValue || !amountValid) return;
        dispatch(depositRequest(accessToken, { card_number: cardValue, amount: amountValue }));
    };

    const retry = () => {
        setListFailed(false);
        dispatch(depositListRequest(accessToken, query, page));
    };

    // Only the current page is loaded, so the amount is a page subtotal, not a
    // grand total. It is labelled as such rather than presented as a balance.
    const pageSubtotal = rows.reduce((sum, row) => {
        const value = Number(rowAmount(row) || 0);
        return sum + (Number.isFinite(value) ? value : 0);
    }, 0);

    const pageLength = totalDeposits > ITEMS_PER_PAGE ? Math.ceil(totalDeposits / ITEMS_PER_PAGE) : 1;

    return (
        <Box>
            <PageTitle title={t("bankDeposit.title")} />

            <LoadingView loading={listing || submitting} />

            <Sheet variant="soft" sx={{ p: 2, borderRadius: "md", mb: 2 }}>
                <Typography level="title-lg">{t("bankDeposit.title")}</Typography>
                <Typography level="body-sm">{t("bankDeposit.desc")}</Typography>
            </Sheet>

            <Stack gap={2}>
                {/* ---------- record a deposit ---------- */}
                <Sheet variant="outlined" sx={{ p: 2, borderRadius: "md" }}>
                    <Typography level="title-md" sx={{ mb: 1 }}>
                        {t("bankDeposit.recordTitle")}
                    </Typography>

                    <Box
                        component="form"
                        onSubmit={handleSubmit}
                        noValidate
                        sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, gap: 2, alignItems: "flex-start" }}
                    >
                        <FormControl required sx={{ flex: 1, minWidth: 0 }}>
                            <FormLabel>{t("bankDeposit.cardNumber")}</FormLabel>
                            <Input
                                value={cardNumber}
                                onChange={(e) => setCardNumber(e.target.value)}
                                placeholder={t("bankDeposit.cardPlaceholder")}
                                startDecorator={<AccountBalanceOutlined />}
                            />
                        </FormControl>

                        <FormControl required error={amount !== "" && !amountValid} sx={{ flex: 1, minWidth: 0 }}>
                            <FormLabel>
                                {t("bankDeposit.amount")} ({branding.CURRENCY_SYMBOL})
                            </FormLabel>
                            <Input
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                placeholder={t("bankDeposit.amountPlaceholder")}
                                type="text"
                                inputMode="decimal"
                            />
                            {amount !== "" && !amountValid ? (
                                <FormHelperText>{t("bankDeposit.amountInvalid")}</FormHelperText>
                            ) : null}
                        </FormControl>

                        <Button
                            type="submit"
                            loading={submitting}
                            disabled={!cardValue || !amountValid || submitting}
                            sx={{ height: 40, alignSelf: { xs: "stretch", sm: "auto" } }}
                        >
                            {t("bankDeposit.submit")}
                        </Button>
                    </Box>
                </Sheet>

                {/* ---------- summary ---------- */}
                <Stack direction={{ xs: "column", sm: "row" }} gap={2}>
                    <SummaryTile
                        icon={<AccountBalanceOutlined />}
                        label={t("bankDeposit.totalDeposits")}
                        value={String(totalDeposits)}
                    />
                    <SummaryTile
                        icon={<AccountBalanceOutlined />}
                        label={t("bankDeposit.pageSubtotal")}
                        value={formatMoney(pageSubtotal)}
                    />
                </Stack>

                {/* ---------- history ---------- */}
                <Typography level="title-md">{t("bankDeposit.history")}</Typography>

                {/* ---------- filters ---------- */}
                <Sheet
                    variant="outlined"
                    sx={{
                        p: { xs: 1, sm: 1.5 },
                        borderRadius: "sm",
                        display: "flex",
                        flexWrap: "wrap",
                        alignItems: "flex-end",
                        gap: 1.5,
                    }}
                >
                    <FormControl sx={{ flex: "1 1 200px", minWidth: 0 }}>
                        <FormLabel>{t("transaction.filters.search")}</FormLabel>
                        <Input
                            size="sm"
                            type="text"
                            placeholder={t("bankDeposit.searchPlaceholder")}
                            value={filters.search}
                            onChange={(e) => applyFilters({ search: e.target.value.trim() })}
                            startDecorator={<SearchIcon />}
                        />
                    </FormControl>

                    <FormControl sx={{ flex: "0 1 160px", minWidth: 0 }}>
                        <FormLabel>{t("transaction.filters.from")}</FormLabel>
                        <Input
                            size="sm"
                            type="date"
                            value={filters.from}
                            onChange={(e) => applyFilters({ from: e.target.value })}
                            slotProps={{ input: { max: filters.to || undefined } }}
                        />
                    </FormControl>

                    <FormControl sx={{ flex: "0 1 160px", minWidth: 0 }}>
                        <FormLabel>{t("transaction.filters.to")}</FormLabel>
                        <Input
                            size="sm"
                            type="date"
                            value={filters.to}
                            onChange={(e) => applyFilters({ to: e.target.value })}
                            slotProps={{ input: { min: filters.from || undefined } }}
                        />
                    </FormControl>

                    <FormControl sx={{ flex: "1 1 190px", minWidth: 0 }}>
                        <FormLabel>{t("bankDeposit.status")}</FormLabel>
                        <Select
                            size="sm"
                            multiple
                            value={filters.status}
                            onChange={(_, newValue) =>
                                applyFilters({ status: (newValue as DepositStatus[]).join(",") })
                            }
                            renderValue={(selected) =>
                                selected.length === 0 ? (
                                    t("transaction.filters.allStatuses")
                                ) : (
                                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                                        {selected.map((opt: any) => (
                                            <Chip key={String(opt.value)} size="sm" variant="soft" color="primary">
                                                {opt.label}
                                            </Chip>
                                        ))}
                                    </Box>
                                )
                            }
                            sx={{ minHeight: "36px" }}
                        >
                            {DEPOSIT_STATUSES.map((s) => (
                                <Option key={s} value={s}>
                                    {getStatusText(t, s)}
                                </Option>
                            ))}
                        </Select>
                    </FormControl>

                    <Button
                        size="sm"
                        variant="outlined"
                        color="neutral"
                        onClick={() => setSearchParams(new URLSearchParams())}
                        disabled={!hasFilters || listing}
                        startDecorator={<FilterAltOffRounded />}
                        sx={{ flex: "0 0 auto" }}
                    >
                        {t("transaction.filters.clear")}
                    </Button>
                </Sheet>

                {/* A failed read keeps the previous rows visible but says so, so an
                    admin never mistakes stale rows for a live ledger. */}
                {listFailed && (
                    <Sheet
                        variant="outlined"
                        color="danger"
                        sx={{
                            p: 1.5,
                            borderRadius: "sm",
                            display: "flex",
                            flexWrap: "wrap",
                            alignItems: "center",
                            gap: 1,
                        }}
                    >
                        <Typography level="body-sm" sx={{ flex: "1 1 240px" }}>
                            {t("bankDeposit.loadError")}
                        </Typography>
                        <Button size="sm" variant="outlined" color="danger" onClick={retry}>
                            {t("transaction.retry")}
                        </Button>
                    </Sheet>
                )}

                {rows.length > 0 ? (
                    <>
                        {/* Card list on phones: a 560px-wide table has to be
                            side-scrolled on a 360px screen, which hid the amount. */}
                        <Stack gap={1} sx={{ display: { xs: "flex", md: "none" } }}>
                            {rows.map((row, index) => (
                                <Sheet
                                    key={row?.id ?? index}
                                    variant="outlined"
                                    sx={{ p: 1.5, borderRadius: "sm" }}
                                >
                                    <Stack
                                        direction="row"
                                        justifyContent="space-between"
                                        alignItems="flex-start"
                                        gap={1}
                                    >
                                        <Box sx={{ minWidth: 0 }}>
                                            <Typography level="body-sm" fontWeight="md">
                                                {rowCardNumber(row)}
                                            </Typography>
                                            <Typography level="body-xs" sx={{ color: "text.secondary" }}>
                                                {formatDate(rowDate(row))}
                                            </Typography>
                                        </Box>
                                        <Stack alignItems="flex-end" gap={0.5}>
                                            <Typography level="title-sm">
                                                {formatMoney(rowAmount(row))}
                                            </Typography>
                                            <Chip
                                                size="sm"
                                                variant="solid"
                                                color={getStatusColor(rowStatus(row))}
                                            >
                                                {getStatusText(t, rowStatus(row))}
                                            </Chip>
                                        </Stack>
                                    </Stack>
                                </Sheet>
                            ))}
                        </Stack>

                        <Sheet
                            variant="outlined"
                            sx={{ borderRadius: "sm", overflow: "auto", display: { xs: "none", md: "block" } }}
                        >
                            <Table
                                stickyHeader
                                sx={{
                                    "--TableCell-headBackground": "var(--joy-palette-background-level1)",
                                    minWidth: 560,
                                }}
                            >
                                <thead>
                                    <tr>
                                        <th>{t("bankDeposit.date")}</th>
                                        <th>{t("bankDeposit.cardNumber")}</th>
                                        <th style={{ textAlign: "right" }}>
                                            {t("bankDeposit.amount")} ({branding.CURRENCY_SYMBOL})
                                        </th>
                                        <th>{t("bankDeposit.status")}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {rows.map((row, index) => (
                                        <tr key={row?.id ?? index}>
                                            <td>
                                                <Typography level="body-sm">{formatDate(rowDate(row))}</Typography>
                                            </td>
                                            <td>
                                                <Typography level="body-sm">{rowCardNumber(row)}</Typography>
                                            </td>
                                            <td style={{ textAlign: "right" }}>
                                                <Typography level="body-sm">{formatMoney(rowAmount(row))}</Typography>
                                            </td>
                                            <td>
                                                <Chip size="sm" variant="solid" color={getStatusColor(rowStatus(row))}>
                                                    {getStatusText(t, rowStatus(row))}
                                                </Chip>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </Sheet>

                        {totalDeposits > ITEMS_PER_PAGE && (
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
                                    disabled={!previousPage || listing}
                                >
                                    {t("init.previous")}
                                </Button>

                                <Box sx={{ flex: 1 }} />

                                {Array.from({ length: pageLength }).map((_, currPage) => (
                                    <IconButton
                                        key={currPage}
                                        size="sm"
                                        variant="outlined"
                                        color="neutral"
                                        onClick={() => setPage(currPage + 1)}
                                        disabled={page === currPage + 1}
                                        sx={{ display: { xs: "none", md: "flex" } }}
                                    >
                                        {currPage + 1}
                                    </IconButton>
                                ))}

                                <Typography
                                    level="body-sm"
                                    mx="auto"
                                    textAlign="center"
                                    sx={{ display: { xs: "flex", md: "none" } }}
                                >
                                    {t("init.page")} {page} of {pageLength}
                                </Typography>

                                <Box sx={{ flex: 1 }} />

                                <Button
                                    size="sm"
                                    variant="outlined"
                                    color="neutral"
                                    endDecorator={<KeyboardArrowRightIcon />}
                                    onClick={() => setPage(page + 1)}
                                    disabled={!nextPage || listing}
                                >
                                    {t("init.next")}
                                </Button>
                            </Box>
                        )}
                    </>
                ) : (
                    // The generic NotFoundMessage said "resource not found",
                    // which reads as a bug. A purpose-built message says whether
                    // this is an empty ledger or just an empty filter.
                    <Sheet variant="outlined" sx={{ p: 3, borderRadius: "sm", textAlign: "center" }}>
                        <Typography level="body-sm" sx={{ color: "text.secondary" }}>
                            {hasFilters ? t("bankDeposit.noDepositsFiltered") : t("bankDeposit.noDeposits")}
                        </Typography>
                        {hasFilters && (
                            <Button
                                size="sm"
                                variant="outlined"
                                color="neutral"
                                sx={{ mt: 1.5 }}
                                onClick={() => setSearchParams(new URLSearchParams())}
                                startDecorator={<FilterAltOffRounded />}
                            >
                                {t("transaction.filters.clear")}
                            </Button>
                        )}
                    </Sheet>
                )}
            </Stack>
        </Box>
    );
};

const SummaryTile = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) => (
    <Sheet variant="outlined" sx={{ p: 2, borderRadius: "md", flex: 1 }}>
        <Stack direction="row" gap={1.5} alignItems="center">
            <Box
                sx={{
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    backgroundColor: "primary.softBg",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                }}
            >
                {icon}
            </Box>
            <Box sx={{ minWidth: 0 }}>
                <Typography level="body-xs" sx={{ color: "text.secondary" }}>
                    {label}
                </Typography>
                <Typography level="title-md">{value}</Typography>
            </Box>
        </Stack>
    </Sheet>
);

const mapStateToProps = ({ auth, session }) => {
    const { accessToken } = auth;

    const {
        depositStatus,
        depositResult,
        depositErrorMessage,
        depositRequestsStatus,
        depositRequestsResult,
        depositRequestsErrorMessage,
    } = session;

    return {
        accessToken,
        depositStatus,
        depositResult,
        depositErrorMessage,
        depositRequestsStatus,
        depositRequestsResult,
        depositRequestsErrorMessage,
    };
};

export default connect(mapStateToProps, {})(BankDepositPage);
