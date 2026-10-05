import React, { useEffect, useMemo, useRef, useState } from "react";
import { Typography, Box, List, ListItem, ListItemContent, Sheet, Table, iconButtonClasses, Button, IconButton, Chip, ColorPaletteProp } from "@mui/joy";
import { LoadingView, NotFoundMessage, PageTitle, ReverseTransactionModal, TransactionFilterBar } from "../../../components";
import type { TransactionFiltersValue, TransactionStatus } from "../../../components/molecules/TransactionFilterBar";
import { TRANSACTION_STATUS_COLORS, TRANSACTION_STATUSES, transactionStatusLabel } from "../../../components/molecules/TransactionFilterBar";
import { formatDate, formatMoney } from "../../../utils";

import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';

import { connect, useDispatch } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { useMediaQuery } from "@mui/material";
import { UndoRounded } from "@mui/icons-material";
import { STATUS } from "../../../constant";
import { toast } from "react-toastify";

import {
    transactionsRequest,
    transactionsReset,
    reverseTransactionRequest,
    reverseTransactionReset
} from "../../../store/actions"
import { useTranslation } from "react-i18next";
import branding from "../../../config/branding";

const getTxnId = (row) => row.id ?? row.transaction_id;
const isReversalEntry = (row) => row.transaction_type === 'reversal' || row.reversal_of != null || row.original_transaction_id != null;
const isReversed = (row) => row.transaction_status === 'reversed' || row.is_reversed === true || row.reversed === true || row.reversal != null;
const getOriginalId = (row) => row.reversal_of ?? row.original_transaction_id;

// The ledger drawer links here with ?transaction=<id>. That parameter is not a
// filter the backend understands, so instead of sending it we highlight and
// scroll to the matching row once the list arrives.
const HIGHLIGHT_BG = 'var(--joy-palette-primary-softBg)';
const HIGHLIGHT_OUTLINE = 'var(--joy-palette-primary-solidBg)';

const MobileViewTable = ({ data, props }) => {
    const { t } = useTranslation();
    return (
        <Box sx={{ display: { xs: 'block', md: 'none' } }}>
            {data.map((listItem, index) => {
                const rowId = getTxnId(listItem);
                const highlighted = props.highlightId != null && String(rowId) === String(props.highlightId);
                return (
                <List
                    key={index}
                    size="sm"
                    sx={{
                        '--ListItem-paddingX': 0,
                    }}
                >
                    <ListItem
                        variant="outlined"
                        color={TRANSACTION_STATUS_COLORS[listItem.transaction_status] as ColorPaletteProp}
                        data-transaction-row={rowId}
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'start',
                            p: 1,
                            borderRadius: 4,
                            boxShadow: 'sm',
                            ...(highlighted && {
                                backgroundColor: HIGHLIGHT_BG,
                                outline: `2px solid ${HIGHLIGHT_OUTLINE}`,
                            }),
                        }}
                    >
                        <ListItemContent sx={{ display: 'flex', gap: 1, alignItems: 'start' }}>
                            <div>
                                <Typography fontWeight={600} level="title-md">{listItem.item_name}</Typography>
                                <Typography level="title-sm" >{listItem.student_name}</Typography>
                                <Typography level="body-xs" ><b>{t("transaction.card_number")}:</b> {listItem.card_number}</Typography>
                                <Typography fontSize={11} gutterBottom>{formatDate(listItem.transaction_date)}</Typography>
                            </div>
                        </ListItemContent>
                        <Box sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'flex-end',
                            rowGap: 1
                        }}>
<Typography
                                fontWeight={600}
                                level="title-md"
                                gutterBottom
                                color={isReversalEntry(listItem) ? "danger" : "neutral"}
                            >
                                {formatMoney(isReversalEntry(listItem) ? -(listItem.amount ?? 0) : listItem.amount)}
                            </Typography>
                            {isReversalEntry(listItem) && getOriginalId(listItem) != null &&
                                <Typography level="body-xs" color="neutral">
                                    {t("transaction.linkedOriginal", { id: getOriginalId(listItem) })}
                                </Typography>
                            }
                            <Chip
                                variant="solid"
                                size="sm"
                                color={TRANSACTION_STATUS_COLORS[listItem.transaction_status] as ColorPaletteProp}
                            >
                                {transactionStatusLabel(t, listItem.transaction_status)}
                            </Chip>
                            {props.canReverse(listItem) &&
                                <IconButton
                                    size="sm"
                                    variant="plain"
                                    color="danger"
                                    title={t("transaction.reverse")}
                                    onClick={() => props.onReverse(listItem)}
                                >
                                    <UndoRounded />
                                </IconButton>
                            }
                        </Box>

                    </ListItem>
                </List>
                );
            })}
        </Box>
    )
}

const DesktopViewTable = ({ data, props }) => {
    const { t } = useTranslation()
    return (
        <React.Fragment>
            <Sheet
                className="OrderTableContainer"
                variant="outlined"
                sx={{
                    display: { xs: 'none', md: 'flex', lg: 'flex' },
                    // maxWidth: '600px',
                    borderRadius: 'sm',
                    flexShrink: 1,
                    overflow: 'auto',
                    minHeight: 0,
                }}
            >
                <Table
                    aria-labelledby="tableTitle"
                    stickyHeader
                    hoverRow
                    sx={{
                        '--TableCell-headBackground': 'var(--joy-palette-background-level1)',
                        '--Table-headerUnderlineThickness': '1px',
                        '--TableRow-hoverBackground': 'var(--joy-palette-background-level1)',
                        '--TableCell-paddingY': '4px',
                        '--TableCell-paddingX': '8px',
                        '& tr > *:last-child': {
                            position: 'sticky',
                            right: 0,
                            // bgcolor: 'var(--TableCell-headBackground)',
                        },
                    }}
                >
                    <thead>
                        <tr style={{ textAlign: 'center' }}>
                            <th style={{ width: 70, padding: '10px 6px' }}>{t("transaction.item_name")}</th>
                            <th style={{ width: 100, padding: '10px 6px', }}>{t("transaction.student_name")}</th>
                            <th style={{ width: 70, padding: '10px 6px', }}>{t("transaction.card_number")}</th>
                            <th style={{ width: 70, padding: '10px 6px', }}>{t("transaction.amount")} ({branding.CURRENCY_SYMBOL})</th>
                            <th style={{ width: 50, padding: '10px 6px', }}>{t("transaction.status")}</th>
                            <th style={{ width: 70, padding: '10px 6px', }}>{t("transaction.date")}</th>
                            {props.isAdmin && <th style={{ width: 70, padding: '10px 6px', }}>{t("transaction.reverse")}</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((row, index) => {
                            const rowId = getTxnId(row);
                            const highlighted = props.highlightId != null && String(rowId) === String(props.highlightId);
                            return (
                            <tr
                                key={index}
                                data-transaction-row={rowId}
                                style={highlighted ? { backgroundColor: HIGHLIGHT_BG, outline: `2px solid ${HIGHLIGHT_OUTLINE}` } : undefined}
                            >
                                <td>
                                    <Typography level="body-sm">{row.item_name}</Typography>
                                </td>
                                <td>
                                    <Typography level="body-sm">{row.student_name}</Typography>
                                </td>
                                <td>
                                    <Typography level="body-sm">{row.card_number}</Typography>
                                </td>
                                <td>
                                    <Typography level="body-sm" color={isReversalEntry(row) ? "danger" : "neutral"}>
                                        {formatMoney(isReversalEntry(row) ? -(row.amount ?? 0) : row.amount)}
                                    </Typography>
                                    {isReversalEntry(row) && getOriginalId(row) != null &&
                                        <Typography level="body-xs" color="neutral">
                                            {t("transaction.linkedOriginal", { id: getOriginalId(row) })}
                                        </Typography>
                                    }
                                </td>
                                <td>
                                    <Chip
                                        variant="solid"
                                        size="sm"
                                        color={TRANSACTION_STATUS_COLORS[row.transaction_status] as ColorPaletteProp}
                                    >
                                        {transactionStatusLabel(t, row.transaction_status)}
                                    </Chip>
                                </td>
                                <td>
                                    <Typography level="body-sm">{formatDate(row.transaction_date)}</Typography>
                                </td>
                                {props.isAdmin &&
                                    <td>
                                        {props.canReverse(row) &&
                                            <IconButton
                                                size="sm"
                                                variant="plain"
                                                color="danger"
                                                title={t("transaction.reverse")}
                                                onClick={() => props.onReverse(row)}
                                            >
                                                <UndoRounded />
                                            </IconButton>
                                        }
                                    </td>
                                }
                            </tr>
                            );
                        })}
                    </tbody>
                </Table>
            </Sheet>
        </React.Fragment>
    );
}


const TransactionPage = ({
    accessToken,

    listStatus,
    listResult,
    listErrorMessage,

    reverseStatus,
    reverseErrorMessage,

    loginRole,
}) => {
    const dispatch = useDispatch()
    const { t } = useTranslation()
    const isDesktop = useMediaQuery("(min-width:600px)");
    const [searchParams, setSearchParams] = useSearchParams();

    // ---- FILTERS ----- //
    // The URL query string is the source of truth, so a filtered view can be
    // shared, bookmarked and reloaded and comes back exactly as it was. Params
    // match the ledger convention already used by src/service/ledger.
    // Params sent to POST /sessions/transaction-list (see the note by buildQuery
    // below - the backend still has to confirm these names).
    const filters = useMemo<TransactionFiltersValue>(() => ({
        search: searchParams.get("search") ?? "",
        start_date: searchParams.get("from") ?? "",
        end_date: searchParams.get("to") ?? "",
        status: (searchParams.get("status") ?? "")
            .split(",")
            .filter((s): s is TransactionStatus =>
                (TRANSACTION_STATUSES as readonly string[]).includes(s)
            ),
    }), [searchParams]);

    const page = Math.max(1, Number(searchParams.get("page") ?? 1) || 1);

    // A ledger entry links here as ?transaction=<id>; that is not a backend
    // filter, so it is used to highlight the row and then cleared from the URL.
    const highlightId = searchParams.get("transaction");

    // ---- PAGINATION / LIST STATE ----- //
    const [listData, setListData] = useState([]);
    const [totalTransactions, setTotalTransactions] = useState(0);
    const [nextPage, setNextPage] = useState(null);
    const [previousPage, setPreviousPage] = useState(null);
    const [listFailed, setListFailed] = useState(false);

    // ---- REVERSE SETTINGS ----- //
    const [reverseTarget, setReverseTarget] = useState(null);
    const reversing = reverseStatus === STATUS.LOADING;
    const isAdmin = loginRole === 'admin';

    const canReverse = (row) => isAdmin && !!getTxnId(row) && !isReversalEntry(row) && !isReversed(row);

    const handleCloseReverse = () => {
        if (!reversing) {
            setReverseTarget(null);
        }
    };

    const handleConfirmReverse = (reason) => {
        dispatch(reverseTransactionRequest(accessToken, {
            transaction_id: getTxnId(reverseTarget),
            reason
        }));
    };

    const ITEMS_PER_PAGE = 50
    const pageLength = listData.length > 0 ? Math.ceil(totalTransactions / ITEMS_PER_PAGE) : 1

    // Only keys the user actually filled in are sent. The filters travel in the
    // POST body (see listRequest in src/service/calls.ts), so an empty string or
    // an empty array would go out as a real filter value and match nothing -
    // dropping them keeps an untouched filter bar byte-identical to the request
    // this page made before filters existed.
    const buildQuery = useMemo(() => (f: TransactionFiltersValue) => {
        const query: Record<string, string | string[]> = {};
        if (f.search) query.search = f.search;
        if (f.start_date) query.from = f.start_date;
        if (f.end_date) query.to = f.end_date;
        if (f.status.length) query.status = f.status;
        return query;
    }, []);

    /** Writes the filter bar back to the URL. Any change returns to page 1. */
    const handleFiltersChange = (next: TransactionFiltersValue) => {
        const params = new URLSearchParams(searchParams);
        const setOrDelete = (key: string, value: string) => {
            if (value) params.set(key, value);
            else params.delete(key);
        };
        setOrDelete("search", next.search);
        setOrDelete("from", next.start_date);
        setOrDelete("to", next.end_date);
        setOrDelete("status", next.status.join(","));
        params.delete("page");
        setSearchParams(params);
    };

    const setPage = (next: number) => {
        const params = new URLSearchParams(searchParams);
        if (next <= 1) params.delete("page");
        else params.set("page", String(next));
        setSearchParams(params);
    };

    const query = buildQuery(filters);
    const queryKey = JSON.stringify(query);

    useEffect(() => {
        setListFailed(false);
        dispatch(transactionsRequest(accessToken, query, page));
        return () => {
            dispatch(transactionsReset());
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [accessToken, page, queryKey]);

    /* eslint-disable */
    useEffect(() => {
        if (listStatus === STATUS.SUCCESS) {
            setListData(listResult.results);
            setNextPage(listResult.next);
            setPreviousPage(listResult.previous);
            setTotalTransactions(listResult.count);
            setListFailed(false);
        }
        else if (listStatus === STATUS.ERROR) {
            toast.error(listErrorMessage);
            // Keep the error on screen instead of clearing it straight away, so
            // the page shows a retry rather than only a toast that has gone.
            setListFailed(true);
        }
    }, [listStatus])

    // ?transaction=<id> from the ledger drawer: scroll the row into view once it
    // is rendered, then drop the parameter so a reload does not re-jump.
    useEffect(() => {
        if (!highlightId || listStatus !== STATUS.SUCCESS) return;
        const row = document.querySelector(`[data-transaction-row="${CSS.escape(String(highlightId))}"]`);
        if (row) {
            row.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        const params = new URLSearchParams(searchParams);
        params.delete("transaction");
        setSearchParams(params, { replace: true });
    }, [highlightId, listStatus])

    useEffect(() => {
        if (reverseStatus === STATUS.SUCCESS) {
            toast.success(t("transaction.reverseSuccess"));
            dispatch(reverseTransactionReset());
            setReverseTarget(null);
            dispatch(transactionsRequest(accessToken, query, page));
        }
        else if (reverseStatus === STATUS.ERROR) {
            toast.error(reverseErrorMessage);
            dispatch(reverseTransactionReset());
            setReverseTarget(null);
        }
    }, [reverseStatus])
    /* eslint-enable */


const checkLoading = () => {
        if (listStatus === STATUS.LOADING) {
            return true
        }
        else {
            return false
        }
    }

    const retry = () => {
        setListFailed(false);
        dispatch(transactionsRequest(accessToken, query, page));
    }

    return (
        <Box>
            <PageTitle title={t("transaction.title")} />

            <LoadingView loading={checkLoading()} />

            {/* filters */}
            <TransactionFilterBar
                value={filters}
                onChange={handleFiltersChange}
                loading={checkLoading()}
            />

            {/* A failed read keeps the previous rows visible but says so, so the
                operator never mistakes stale data for a live list. */}
            {listFailed && (
                <Sheet
                    variant="outlined"
                    color="danger"
                    sx={{
                        p: 1.5,
                        mb: 1,
                        borderRadius: 'sm',
                        display: 'flex',
                        flexWrap: 'wrap',
                        alignItems: 'center',
                        gap: 1,
                    }}
                >
                    <Typography level="body-sm" sx={{ flex: '1 1 240px' }}>
                        {t("transaction.loadError")}
                    </Typography>
                    <Button size="sm" variant="outlined" color="danger" onClick={retry}>
                        {t("transaction.retry")}
                    </Button>
                </Sheet>
            )}

            {listData.length > 0 ? <>
                {/* ------ render different view depend on plafform -------- */}
                <MobileViewTable data={listData} props={{ edit: null, activate: null, isAdmin, canReverse, onReverse: setReverseTarget, highlightId }} />
                <DesktopViewTable data={listData} props={{ edit: null, activate: null, isAdmin, canReverse, onReverse: setReverseTarget, highlightId }} />

                {/* Pagination */}
                {totalTransactions > ITEMS_PER_PAGE
                    &&
                    <Box
                        className="Pagination-laptopUp"
                        sx={{
                            pt: 2,
                            gap: 1,
                            [`& .${iconButtonClasses.root}`]: { borderRadius: '50%' },
                            display: 'flex'
                        }}
                    >
                        <Button
                            size="sm"
                            variant="outlined"
                            color="neutral"
                            startDecorator={<KeyboardArrowLeftIcon />}
                            onClick={() => setPage(page - 1)}
                            disabled={!previousPage}
                        >
                            {isDesktop ? t("init.previous") : ""}
                        </Button>


                        <Box sx={{ flex: 1 }} />
                        {/* for desktop to display page number */}
                        {Array.from({ length: pageLength }).map((_, currPage) => (
                            <IconButton
                                key={currPage}
                                size="sm"
                                variant={'outlined'}
                                color="neutral"
                                onClick={() => setPage(currPage + 1)}
                                disabled={page === currPage + 1}
                                sx={{ display: { xs: 'none', md: 'flex' } }}
                            >
                                {currPage + 1}
                            </IconButton>
                        ))}

                        {/* for mobile to display page number */}
                        <Typography level="body-sm" mx="auto" textAlign={'center'} sx={{ display: { xs: 'flex', md: 'none' } }}>
                            {t('init.page')} {page} of {Math.ceil(totalTransactions / ITEMS_PER_PAGE)}
                        </Typography>
                        <Box sx={{ flex: 1 }} />

                        <Button
                            size="sm"
                            variant="outlined"
                            color="neutral"
                            endDecorator={<KeyboardArrowRightIcon />}
                            onClick={() => setPage(page + 1)}
                            disabled={!nextPage}
                        >
                            {isDesktop ? t("init.next") : ""}
                        </Button>
                    </Box>
                }

            </> :
                <NotFoundMessage />
            }

            <ReverseTransactionModal
                open={!!reverseTarget}
                target={reverseTarget}
                loading={reversing}
                onClose={handleCloseReverse}
                onConfirm={handleConfirmReverse}
            />
        </Box>
    )
}

const mapStateToProps = ({ auth, session }) => {
    const { accessToken,
        loginResult
    } = auth

    const {
        transactionsStatus: listStatus,
        transactionsResult: listResult,
        transactionsErrorMessage: listErrorMessage,

        reverseStatus,
        reverseErrorMessage,
    } = session

    return {
        accessToken,

        listStatus,
        listResult,
        listErrorMessage,

        reverseStatus,
        reverseErrorMessage,

        loginRole: loginResult ? loginResult.user.role : ""
    }
}
export default connect(mapStateToProps, {})(TransactionPage)