import React, { useEffect, useState } from "react";
import {
    Box, Typography, Button, Sheet, Select, Option, Input, Chip, Stack, Table,
    FormControl, List, ListItem, ListItemContent, ColorPaletteProp
} from "@mui/joy";
import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined';
import PaidOutlinedIcon from '@mui/icons-material/PaidOutlined';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { connect, useDispatch } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import branding from "../../../config/branding";
import { STATUS } from "../../../constant";
import {
    parentStudentsRequest, parentStudentsReset,
    depositRequest, depositRequestReset,
    depositListRequest, depositListReset,
} from "../../../store/actions";
import { LoadingView, NotFoundMessage } from "../../../components";
import { formatDate, thousandSeparator } from "../../../utils";

const getCardId = (item) => String(item?.rfid_card?.id ?? item?.rfid_card?.card_id ?? "")
const getStatusColor = (status) => (
    { "pending": "neutral", "processed": "success", "successful": "success", "failed": "danger", "processing": "warning" }[status] ?? "neutral"
) as ColorPaletteProp
const getStatusText = (t, status) => (
    {
        "pending": t("status.pending"),
        "processed": t("status.processed"),
        "successful": t("status.processed"),
        "failed": t("status.failed"),
        "processing": t("status.progress"),
    }[status] ?? status
)

export const TopUpPage = ({
    accessToken,
    studentsStatus,
    studentsResult,
    studentsErrorMessage,
    depositStatus,
    depositResult,
    depositErrorMessage,
    depositRequestsStatus,
    depositRequestsResult,
    depositRequestsErrorMessage,
}) => {
    const { t } = useTranslation()
    const dispatch = useDispatch()
    const [searchParams] = useSearchParams()

    const [children, setChildren] = useState([])
    const [selectedCard, setSelectedCard] = useState<string | null>(null)
    const [amount, setAmount] = useState("")

    const [depList, setDepList] = useState<any[]>([])
    const [page, setPage] = useState(1)
    const [totalDeposits, setTotalDeposits] = useState(0)
    const [nextPage, setNextPage] = useState(null)
    const [previousPage, setPreviousPage] = useState(null)

    const selectedChild = children.find((item) => getCardId(item) === String(selectedCard))

    /* eslint-disable */
    useEffect(() => {
        dispatch(parentStudentsRequest(accessToken, {}))
        dispatch(depositListRequest(accessToken, {}, 1))
    }, [])

    useEffect(() => {
        if (studentsStatus === STATUS.SUCCESS) {
            setChildren(studentsResult || [])
            const param = searchParams.get("card")
            const preselect = (studentsResult || []).find((item) => getCardId(item) === String(param))
            if (preselect) {
                setSelectedCard(getCardId(preselect))
            } else {
                const first = (studentsResult || []).find((item) => getCardId(item) !== "")
                if (first && selectedCard === null) setSelectedCard(getCardId(first))
            }
        } else if (studentsStatus === STATUS.ERROR) {
            toast.error(studentsErrorMessage)
            dispatch(parentStudentsReset())
        }
    }, [studentsStatus])

    useEffect(() => {
        if (depositStatus === STATUS.SUCCESS) {
            toast.success(depositResult?.message ?? t("topUp.success"))
            setAmount("")
            setPage(1)
            dispatch(depositListRequest(accessToken, {}, 1))
            dispatch(depositRequestReset())
        } else if (depositStatus === STATUS.ERROR) {
            toast.error(depositErrorMessage)
            dispatch(depositRequestReset())
        }
    }, [depositStatus])

    useEffect(() => {
        if (depositRequestsStatus === STATUS.SUCCESS) {
            setDepList(depositRequestsResult?.results ?? [])
            setTotalDeposits(depositRequestsResult?.count ?? 0)
            setNextPage(depositRequestsResult?.next ?? null)
            setPreviousPage(depositRequestsResult?.previous ?? null)
        } else if (depositRequestsStatus === STATUS.ERROR) {
            toast.error(depositRequestsErrorMessage)
            dispatch(depositListReset())
        }
    }, [depositRequestsStatus])

    // pagination change
    useEffect(() => {
        if (page > 0 && depList) {
            dispatch(depositListRequest(accessToken, {}, page))
        }
    }, [page])
    /* eslint-enable */

    const amountValue = parseFloat(amount)
    const amountValid = !isNaN(amountValue) && amountValue > 0
    const submitting = depositStatus === STATUS.LOADING
    const loading = studentsStatus === STATUS.LOADING || depositRequestsStatus === STATUS.LOADING

    const handleSubmit = (e) => {
        e.preventDefault()
        if (!selectedCard || !amountValid) return
        dispatch(depositRequest(accessToken, { card_id: selectedCard, amount: amountValue }))
    }

    return (
        <Box>
            <LoadingView loading={loading || submitting} />

            <Sheet variant="soft" sx={{ p: 2, borderRadius: 'md', mb: 2 }}>
                <Typography level="title-lg">{t("topUp.title")}</Typography>
                <Typography level="body-sm">{t("topUp.desc")}</Typography>
            </Sheet>

            <Stack spacing={2}>
                {/* top-up form */}
                <Sheet variant="outlined" sx={{ p: 2, borderRadius: 'md' }}>
                    <Stack component="form" onSubmit={handleSubmit} spacing={2}>
                        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ alignItems: { sm: 'center' }, justifyContent: 'space-between' }}>
                            <Box sx={{ minWidth: { sm: 260 }, flex: 1 }}>
                                <Typography level="body-sm" sx={{ mb: 0.5 }}>{t("topUp.selectChild")}</Typography>
                                <Select
                                    size="sm"
                                    value={selectedCard}
                                    placeholder={t("init.select") + t("topUp.selectChild")}
                                    disabled={studentsStatus !== STATUS.SUCCESS || submitting}
                                    onChange={(e, value) => setSelectedCard(value)}>
                                    {children.map((item) => getCardId(item) !== "" && (
                                        <Option key={getCardId(item)} value={getCardId(item)}>
                                            {item.first_name} {item.middle_name} {item.last_name} - {item.class_room}
                                        </Option>
                                    ))}
                                </Select>
                            </Box>
                            <Chip
                                size="lg"
                                variant="soft"
                                color="primary"
                                startDecorator={<AccountBalanceWalletOutlinedIcon />}>
                                {t("topUp.currentBalance")}: {branding.CURRENCY_SYMBOL} {thousandSeparator(selectedChild?.rfid_card?.balance ?? 0)}
                            </Chip>
                        </Stack>

                        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ alignItems: { sm: 'center' } }}>
                            <FormControl style={{ flex: 1 }}>
                                <Typography level="body-sm" sx={{ mb: 0.5 }}>{t("topUp.amount")}</Typography>
                                <Input
                                    type="number"
                                    size="sm"
                                    value={amount}
                                    disabled={!selectedCard || submitting}
                                    placeholder={t("topUp.amountPlaceholder")}
                                    onChange={(e) => setAmount(e.target.value)}
                                />
                            </FormControl>
                            <Button
                                size="sm"
                                color="success"
                                startDecorator={<PaidOutlinedIcon />}
                                disabled={!selectedCard || !amountValid || submitting}>
                                {submitting ? t("init.loading") : t("topUp.submit")}
                            </Button>
                        </Stack>
                    </Stack>
                </Sheet>

                {/* history */}
                <Sheet variant="outlined" sx={{ borderRadius: 'md', overflow: 'auto' }}>
                    <Stack spacing={1} sx={{ p: 2 }}>
                        <Typography level="title-md">{t("topUp.history")}</Typography>

                        {depList.length === 0 ? (
                            depositRequestsStatus === STATUS.ERROR
                                ? <Typography level="body-sm" color="danger">{t("topUp.historyError")}</Typography>
                                : <NotFoundMessage />
                        ) : (<>
                            {/* mobile */}
                            <List size="sm">
                                {depList.map((row, index) => (
                                    <ListItem key={index} sx={{ display: { xs: 'flex', md: 'none' } }}>
                                        <ListItemContent>
                                            <Typography level="title-sm">{row.student_name ?? t("topUp.unknownStudent")}</Typography>
                                            <Typography level="body-xs"><b>{t("student.card_number")}:</b> {row.card_number}</Typography>
                                            <Typography level="body-xs">{formatDate(row.created_at ?? row.request_date ?? row.date)}</Typography>
                                        </ListItemContent>
                                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', rowGap: 0.5 }}>
                                            <Typography fontWeight={600}>{branding.CURRENCY_SYMBOL} {thousandSeparator(row.amount)}</Typography>
                                            <Chip size="sm" variant="solid" color={getStatusColor(row.status ?? row.deposit_status)}>
                                                {getStatusText(t, row.status ?? row.deposit_status)}
                                            </Chip>
                                        </Box>
                                    </ListItem>
                                ))}
                            </List>

                            {/* desktop */}
                            <Table size="sm" sx={{ display: { xs: 'none', md: 'table' } }}>
                                <thead>
                                    <tr>
                                        <th>{t("topUp.student")}</th>
                                        <th>{t("student.card_number")}</th>
                                        <th>{t("topUp.amount")} ({branding.CURRENCY_SYMBOL})</th>
                                        <th>{t("topUp.status")}</th>
                                        <th>{t("topUp.date")}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {depList.map((row, index) => (
                                        <tr key={index}>
                                            <td>{row.student_name ?? "-"}</td>
                                            <td>{row.card_number ?? "-"}</td>
                                            <td>{thousandSeparator(row.amount)}</td>
                                            <td>
                                                <Chip size="sm" variant="solid" color={getStatusColor(row.status ?? row.deposit_status)}>
                                                    {getStatusText(t, row.status ?? row.deposit_status)}
                                                </Chip>
                                            </td>
                                            <td>{formatDate(row.created_at ?? row.request_date ?? row.date)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>

                            {/* pagination */}
                            {totalDeposits > 0 && (
                                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', pt: 1 }}>
                                    <Button
                                        size="sm" variant="outlined" color="neutral"
                                        startDecorator={<KeyboardArrowLeftIcon />}
                                        disabled={!previousPage}
                                        onClick={() => setPage(page - 1)}>
                                        {t("init.previous")}
                                    </Button>
                                    <Typography level="body-sm" sx={{ flex: 1, textAlign: 'center' }}>
                                        {t('init.page')} {page} of {Math.ceil(totalDeposits / 10) || 1}
                                    </Typography>
                                    <Button
                                        size="sm" variant="outlined" color="neutral"
                                        endDecorator={<KeyboardArrowRightIcon />}
                                        disabled={!nextPage}
                                        onClick={() => setPage(page + 1)}>
                                        {t("init.next")}
                                    </Button>
                                </Box>
                            )}
                        </>)}
                    </Stack>
                </Sheet>
            </Stack>
        </Box>
    )
}

const mapStateToProps = ({ auth, dashboard, session }) => {
    const { accessToken } = auth

    const {
        parentStudentsStatus: studentsStatus,
        parentStudentsResult: studentsResult,
        parentStudentsErrorMessage: studentsErrorMessage,
    } = dashboard

    const {
        depositStatus,
        depositResult,
        depositErrorMessage,
        depositRequestsStatus,
        depositRequestsResult,
        depositRequestsErrorMessage,
    } = session

    return {
        accessToken,
        studentsStatus,
        studentsResult,
        studentsErrorMessage,
        depositStatus,
        depositResult,
        depositErrorMessage,
        depositRequestsStatus,
        depositRequestsResult,
        depositRequestsErrorMessage,
    }
}

export default connect(mapStateToProps, {})(TopUpPage)