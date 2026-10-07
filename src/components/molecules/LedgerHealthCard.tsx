import React, { useEffect, useState } from "react";
import { connect, useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import {
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    Divider,
    Modal,
    ModalDialog,
    Sheet,
    Skeleton,
    Stack,
    Table,
    Typography,
} from "@mui/joy";
import CheckCircleRounded from "@mui/icons-material/CheckCircleRounded";
import ErrorOutlineRounded from "@mui/icons-material/ErrorOutlineRounded";
import RefreshRounded from "@mui/icons-material/RefreshRounded";
import OpenInNewRounded from "@mui/icons-material/OpenInNewRounded";

import { STATUS } from "../../constant";
import {
    integrityRequest,
    integrityReset,
    trialBalanceRequest,
    trialBalanceReset,
} from "../../store/actions";
import { formatDate, formatMoney } from "../../utils";
import { NAVIGATE_TO_CARDPAGE } from "../../route/types";

/**
 * FE-12 — "Ledger health" on the admin dashboard.
 *
 * Two independent calls, and they are treated as independent on purpose: the
 * integrity check and the trial balance are separate requests with separate
 * status, so a failure in one shows an inline message inside this card and never
 * stops the counts, the sales trend or anything else on the dashboard from
 * rendering.
 */
const LedgerHealthCard = ({
    integrityStatus,
    integrityResult,
    integrityErrorMessage,
    trialBalanceStatus,
    trialBalanceResult,
}) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const [showDetails, setShowDetails] = useState(false);

    const load = () => {
        dispatch(integrityRequest());
        dispatch(trialBalanceRequest());
    };

    /* eslint-disable */
    useEffect(() => {
        load();
        return () => {
            // Leaving stale ledger state on a dashboard that re-mounts would show
            // a balance from the last visit as if it were current.
            dispatch(integrityReset());
            dispatch(trialBalanceReset());
        };
    }, []);
    /* eslint-enable */

    const loading = integrityStatus === STATUS.LOADING;
    const failed = integrityStatus === STATUS.ERROR;
    const integrity = integrityResult;

    const mismatches = integrity?.mismatched_cards ?? [];
    const healthy = integrity?.status === "ok" || integrity?.global_balanced;

    const trialRows = Array.isArray(trialBalanceResult) ? trialBalanceResult : [];
    const globalDebit = trialRows.reduce(
        (sum: number, row: any) => sum + (Number(row?.total_debit) || 0),
        0
    );
    const globalCredit = trialRows.reduce(
        (sum: number, row: any) => sum + (Number(row?.total_credit) || 0),
        0
    );

    return (
        <Card variant="outlined" sx={{ width: "100%" }}>
            <CardContent sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                <Stack
                    direction={{ xs: "column", sm: "row" }}
                    justifyContent="space-between"
                    alignItems={{ xs: "flex-start", sm: "center" }}
                    gap={1}
                >
                    <Typography level="title-md">{t("ledgerHealth.title")}</Typography>
                    <Stack direction="row" gap={1}>
                        <Button
                            size="sm"
                            variant="outlined"
                            color="neutral"
                            onClick={load}
                            loading={loading}
                            startDecorator={<RefreshRounded />}
                        >
                            {t("ledgerHealth.refresh")}
                        </Button>
                        <Button
                            size="sm"
                            variant="outlined"
                            color="neutral"
                            onClick={() => setShowDetails(true)}
                            disabled={loading || failed}
                        >
                            {t("ledgerHealth.details")}
                        </Button>
                    </Stack>
                </Stack>

                {/* ---- the verdict ---- */}
                {loading ? (
                    <Skeleton level="body-md" />
                ) : failed ? (
                    <Sheet
                        variant="outlined"
                        color="neutral"
                        sx={{ p: 1.5, borderRadius: "sm" }}
                    >
                        <Typography level="title-sm" color="danger">
                            {t("ledgerHealth.errorTitle")}
                        </Typography>
                        <Typography level="body-sm">
                            {integrityErrorMessage || t("ledgerHealth.errorDesc")}
                        </Typography>
                    </Sheet>
                ) : healthy ? (
                    <Stack direction="row" gap={1} alignItems="center" flexWrap="wrap">
                        <Chip
                            color="success"
                            variant="soft"
                            startDecorator={<CheckCircleRounded />}
                        >
                            {t("ledgerHealth.allBalanced")}
                        </Chip>
                        {integrity?.checked_at && (
                            <Typography level="body-xs" sx={{ color: "text.tertiary" }}>
                                {t("ledgerHealth.lastChecked")}:{" "}
                                {formatDate(integrity.checked_at)}
                            </Typography>
                        )}
                    </Stack>
                ) : (
                    <Stack direction="row" gap={1} alignItems="center" flexWrap="wrap">
                        <Chip color="danger" variant="soft" startDecorator={<ErrorOutlineRounded />}>
                            {t("ledgerHealth.mismatchFound", { count: mismatches.length })}
                        </Chip>
                        <Typography level="body-xs" sx={{ color: "text.tertiary" }}>
                            {integrity?.checked_at
                                ? `${t("ledgerHealth.lastChecked")}: ${formatDate(
                                      integrity.checked_at
                                  )}`
                                : null}
                        </Typography>
                    </Stack>
                )}

                <Divider />

                {/* ---- trial balance ---- */}
                <Box>
                    <Typography level="title-sm" sx={{ mb: 0.5 }}>
                        {t("ledgerHealth.trialBalance")}
                    </Typography>

                    {trialBalanceStatus === STATUS.LOADING ? (
                        <Skeleton level="body-md" />
                    ) : trialBalanceStatus === STATUS.ERROR ? (
                        // Separate error: the integrity verdict above stays valid.
                        <Typography level="body-sm" color="danger">
                            {t("ledgerHealth.trialBalanceError")}
                        </Typography>
                    ) : trialRows.length === 0 ? (
                        <Typography level="body-sm" sx={{ color: "text.tertiary" }}>
                            {t("ledgerHealth.trialBalanceEmpty")}
                        </Typography>
                    ) : (
                        <Sheet
                            variant="outlined"
                            sx={{ borderRadius: "sm", overflow: "auto" }}
                        >
                            <Table size="sm" sx={{ minWidth: 360 }}>
                                <thead>
                                    <tr>
                                        <th>{t("ledger.columns.account")}</th>
                                        <th style={{ textAlign: "right" }}>
                                            {t("ledgerHealth.totalDebit")}
                                        </th>
                                        <th style={{ textAlign: "right" }}>
                                            {t("ledgerHealth.totalCredit")}
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {trialRows.map((row: any) => (
                                        <tr key={row.account}>
                                            <td>
                                                <Typography level="body-sm">
                                                    {row.account} · {row.account_name}
                                                </Typography>
                                            </td>
                                            <td style={{ textAlign: "right" }}>
                                                <Typography level="body-sm">
                                                    {formatMoney(row.total_debit)}
                                                </Typography>
                                            </td>
                                            <td style={{ textAlign: "right" }}>
                                                <Typography level="body-sm">
                                                    {formatMoney(row.total_credit)}
                                                </Typography>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </Sheet>
                    )}
                </Box>
            </CardContent>

            {/* ---- details modal ---- */}
            <Modal open={showDetails} onClose={() => setShowDetails(false)}>
                <ModalDialog size="lg" aria-labelledby="ledger-health-title">
                    <Typography id="ledger-health-title" level="h2">
                        {t("ledgerHealth.detailsTitle")}
                    </Typography>

                    <Stack gap={2} sx={{ mt: 1 }}>
                        <Stack direction="row" gap={2} flexWrap="wrap">
                            <Box>
                                <Typography level="body-xs" sx={{ color: "text.tertiary" }}>
                                    {t("ledgerHealth.totalDebit")}
                                </Typography>
                                <Typography level="title-md">
                                    {formatMoney(globalDebit)}
                                </Typography>
                            </Box>
                            <Box>
                                <Typography level="body-xs" sx={{ color: "text.tertiary" }}>
                                    {t("ledgerHealth.totalCredit")}
                                </Typography>
                                <Typography level="title-md">
                                    {formatMoney(globalCredit)}
                                </Typography>
                            </Box>
                        </Stack>

                        {mismatches.length === 0 ? (
                            <Chip
                                color="success"
                                variant="soft"
                                startDecorator={<CheckCircleRounded />}
                                sx={{ alignSelf: "flex-start" }}
                            >
                                {t("ledgerHealth.allBalanced")}
                            </Chip>
                        ) : (
                            <Sheet
                                variant="outlined"
                                sx={{ borderRadius: "sm", overflow: "auto" }}
                            >
                                <Table size="sm" sx={{ minWidth: 520 }}>
                                    <thead>
                                        <tr>
                                            <th>{t("ledger.columns.cardNumber")}</th>
                                            <th style={{ textAlign: "right" }}>
                                                {t("ledgerHealth.ledgerBalance")}
                                            </th>
                                            <th style={{ textAlign: "right" }}>
                                                {t("ledgerHealth.cardBalance")}
                                            </th>
                                            <th style={{ textAlign: "right" }}>
                                                {t("ledgerHealth.difference")}
                                            </th>
                                            <th />
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {mismatches.map((card: any) => {
                                            const difference =
                                                (Number(card.card_balance) || 0) -
                                                (Number(card.ledger_balance) || 0);
                                            return (
                                                <tr key={card.card_id}>
                                                    <td>
                                                        <Typography level="body-sm">
                                                            {card.card_number}
                                                        </Typography>
                                                    </td>
                                                    <td style={{ textAlign: "right" }}>
                                                        <Typography level="body-sm">
                                                            {formatMoney(card.ledger_balance)}
                                                        </Typography>
                                                    </td>
                                                    <td style={{ textAlign: "right" }}>
                                                        <Typography level="body-sm">
                                                            {formatMoney(card.card_balance)}
                                                        </Typography>
                                                    </td>
                                                    <td style={{ textAlign: "right" }}>
                                                        <Typography
                                                            level="body-sm"
                                                            color={
                                                                difference === 0
                                                                    ? "success"
                                                                    : "danger"
                                                            }
                                                        >
                                                            {formatMoney(difference)}
                                                        </Typography>
                                                    </td>
                                                    <td style={{ textAlign: "right" }}>
                                                        <Button
                                                            size="sm"
                                                            variant="plain"
                                                            color="neutral"
                                                            component="a"
                                                            href={`${NAVIGATE_TO_CARDPAGE}?card_number=${encodeURIComponent(
                                                                card.card_number ?? ""
                                                            )}`}
                                                            endDecorator={<OpenInNewRounded />}
                                                        >
                                                            {t("ledgerHealth.openCard")}
                                                        </Button>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </Table>
                            </Sheet>
                        )}
                    </Stack>

                    <Button
                        onClick={() => setShowDetails(false)}
                        variant="outlined"
                        color="neutral"
                        sx={{ mt: 2, alignSelf: "flex-end" }}
                    >
                        {t("alert.cancel")}
                    </Button>
                </ModalDialog>
            </Modal>
        </Card>
    );
};

const mapStateToProps = ({ ledger }) => ({
    integrityStatus: ledger?.integrityStatus,
    integrityResult: ledger?.integrityResult,
    integrityErrorMessage: ledger?.integrityErrorMessage,
    trialBalanceStatus: ledger?.trialBalanceStatus,
    trialBalanceResult: ledger?.trialBalanceResult,
    trialBalanceErrorMessage: ledger?.trialBalanceErrorMessage,
});

export default connect(mapStateToProps, {})(LedgerHealthCard);
