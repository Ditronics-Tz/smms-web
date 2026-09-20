import React, { useEffect, useState } from "react";
import {
    Box, Typography, Button, ButtonGroup, Sheet, Select, Option, Chip, Stack, Alert
} from "@mui/joy";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import CalendarViewWeekRoundedIcon from '@mui/icons-material/CalendarViewWeek';
import CalendarViewMonthRoundedIcon from '@mui/icons-material/CalendarViewMonth';
import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded';
import InboxRoundedIcon from '@mui/icons-material/Inbox';
import { connect, useDispatch } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import branding from "../../../config/branding";
import { STATUS } from "../../../constant";
import {
    childSpendRequest, childSpendReset, parentStudentsRequest, parentStudentsReset
} from "../../../store/actions";
import { LoadingView, NotFoundMessage } from "../../../components";
import { thousandSeparator } from "../../../utils";

const getChildId = (item) => item?.id ?? item?.student_id ?? item?.user?.id ?? ""

const normalizeSpend = (res) => {
    const series = res?.sample ?? res?.items ?? res?.data ?? res?.daily ?? [];
    return {
        total: parseFloat(res?.total_amount ?? res?.total ?? 0) || 0,
        transactionCount: res?.total_transactions ?? res?.count ?? null,
        series: (Array.isArray(series) ? series : []).map((s) => {
            const parsed = new Date(s.date);
            return {
                date: isNaN(parsed.getTime()) ? String(s.date ?? "") : parsed.toLocaleDateString('en-US', { month: 'short', day: '2-digit' }),
                amount: parseFloat(s.amount ?? s.total_amount ?? s.value ?? 0) || 0,
            };
        }),
    };
}

const SpendChart = ({ data }) => {
    return (
        <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
                <defs>
                    <linearGradient id="spendColor" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#4884d8" stopOpacity={0.9} />
                        <stop offset="95%" stopColor="#4884d8" stopOpacity={0.4} />
                    </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="amount" fill="url(#spendColor)" radius={[4, 4, 0, 0]} />
            </BarChart>
        </ResponsiveContainer>
    );
}

export const SpendPage = ({
    accessToken,
    studentsStatus,
    studentsResult,
    studentsErrorMessage,
    spendStatus,
    spendResult,
    spendErrorMessage,
}) => {
    const { t } = useTranslation()
    const dispatch = useDispatch()
    const [searchParams] = useSearchParams()

    const [filter, setFilter] = useState('week')
    const [children, setChildren] = useState([])
    const [selectedChild, setSelectedChild] = useState(null)
    const [spend, setSpend] = useState({ total: 0, transactionCount: null, series: [] })

    /* eslint-disable */
    useEffect(() => {
        dispatch(parentStudentsRequest(accessToken, {}))
    }, [])

    useEffect(() => {
        if (studentsStatus === STATUS.SUCCESS) {
            setChildren(studentsResult || [])
            const param = searchParams.get("child")
            const preselect = (studentsResult || []).find((item) => String(getChildId(item)) === String(param))
            if (preselect) {
                setSelectedChild(String(getChildId(preselect)))
            } else if (studentsResult && studentsResult.length > 0 && selectedChild === null) {
                setSelectedChild(String(getChildId(studentsResult[0])))
            }
        } else if (studentsStatus === STATUS.ERROR) {
            toast.error(studentsErrorMessage)
            dispatch(parentStudentsReset())
        }
    }, [studentsStatus])

    useEffect(() => {
        if (spendStatus === STATUS.SUCCESS) {
            setSpend(normalizeSpend(spendResult))
        } else if (spendStatus === STATUS.ERROR) {
            toast.error(spendErrorMessage)
            setSpend({ total: 0, transactionCount: null, series: [] })
            dispatch(childSpendReset())
        }
    }, [spendStatus])

    useEffect(() => {
        if (selectedChild) {
            dispatch(childSpendRequest(accessToken, { child_id: selectedChild, filter }))
        }
    }, [selectedChild, filter])

    const changeFilter = (value) => {
        if (value !== filter && value !== undefined) setFilter(value)
    }
    /* eslint-enable */

    const loading = spendStatus === STATUS.LOADING
    const hasSeries = spend.series.length > 0

    return (
        <Box>
            <LoadingView loading={loading} />

            <Sheet variant="soft" sx={{ p: 2, borderRadius: 'md', mb: 2 }}>
                <Typography level="title-lg">{t("spend.title")}</Typography>
                <Typography level="body-sm">{t("spend.desc")}</Typography>
            </Sheet>

            <Stack spacing={2}>
                {/* controls */}
                <Sheet variant="outlined" sx={{ p: 2, borderRadius: 'md' }}>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ alignItems: { sm: 'center' }, justifyContent: 'space-between' }}>
                        <Box sx={{ minWidth: { sm: 260 } }}>
                            <Typography level="body-sm" sx={{ mb: 0.5 }}>{t("spend.selectChild")}</Typography>
                            <Select
                                size="sm"
                                value={selectedChild}
                                placeholder={t("init.select") + t("spend.selectChild")}
                                disabled={studentsStatus !== STATUS.SUCCESS || loading}
                                onChange={(e, value) => setSelectedChild(value)}>
                                {children.map((item) => (
                                    <Option key={String(getChildId(item))} value={String(getChildId(item))}>
                                        {item.first_name} {item.middle_name} {item.last_name} - {item.class_room}
                                    </Option>
                                ))}
                            </Select>
                        </Box>

                        <ButtonGroup variant="soft" size="sm" aria-label="spend period">
                            <Button
                                color={filter === 'week' ? 'primary' : 'neutral'}
                                startDecorator={<CalendarViewWeekRoundedIcon />}
                                onClick={() => changeFilter('week')}>
                                {t("spend.week")}
                            </Button>
                            <Button
                                color={filter === 'month' ? 'primary' : 'neutral'}
                                startDecorator={<CalendarViewMonthRoundedIcon />}
                                onClick={() => changeFilter('month')}>
                                {t("spend.month")}
                            </Button>
                        </ButtonGroup>
                    </Stack>
                </Sheet>

                {/* totals summary */}
                {selectedChild && (
                    <Sheet variant="outlined" sx={{ p: 2, borderRadius: 'md' }}>
                        <Stack direction="row" spacing={2} sx={{ flexWrap: 'wrap' }}>
                            <Chip
                                size="lg"
                                variant="soft"
                                color="primary"
                                startDecorator={<TrendingUpRoundedIcon />}>
                                {t("spend.periodTotal")}: {branding.CURRENCY_SYMBOL} {thousandSeparator(spend.total)}
                            </Chip>
                            {spend.transactionCount !== null && spend.transactionCount !== undefined && (
                                <Chip size="lg" variant="soft" color="neutral">
                                    {t("spend.transactionCount")}: {spend.transactionCount}
                                </Chip>
                            )}
                        </Stack>
                    </Sheet>
                )}

                {/* chart / feedback */}
                {!selectedChild ? (
                    <NotFoundMessage />
                ) : spendStatus === STATUS.ERROR ? (
                    <Alert variant="soft" color="danger">{t("spend.errorTitle")}</Alert>
                ) : !hasSeries ? (
                    <Sheet variant="outlined" sx={{ p: 6, borderRadius: 'md', textAlign: 'center' }}>
                        <InboxRoundedIcon sx={{ fontSize: 48, color: 'neutral.400' }} />
                        <Typography level="title-md" sx={{ mt: 1 }}>{t("spend.emptyTitle")}</Typography>
                        <Typography level="body-sm" color="neutral">{t("spend.emptyDesc")}</Typography>
                    </Sheet>
                ) : (
                    <Sheet variant="outlined" sx={{ p: 2, borderRadius: 'md' }}>
                        <Typography level="title-md" sx={{ mb: 1 }}>{t("spend.chartTitle")}</Typography>
                        <SpendChart data={spend.series} />
                    </Sheet>
                )}
            </Stack>
        </Box>
    )
}

const mapStateToProps = ({ auth, dashboard }) => {
    const { accessToken } = auth

    const {
        parentStudentsStatus: studentsStatus,
        parentStudentsResult: studentsResult,
        parentStudentsErrorMessage: studentsErrorMessage,
    } = dashboard

    const {
        childSpendStatus: spendStatus,
        childSpendResult: spendResult,
        childSpendErrorMessage: spendErrorMessage,
    } = dashboard

    return {
        accessToken,
        studentsStatus,
        studentsResult,
        studentsErrorMessage,
        spendStatus,
        spendResult,
        spendErrorMessage,
    }
}

export default connect(mapStateToProps, {})(SpendPage)