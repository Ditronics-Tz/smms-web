import { Avatar, Box, Button, Card, Chip, ColorPaletteProp, Divider, FormControl, FormHelperText, FormLabel, Input, List, ListItem, ListItemContent, Sheet, Table, Typography } from '@mui/joy';
import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import branding from "../../../config/branding";
import { connect, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FILE_BASE, STATUS } from '../../../constant';
import SwipeableViews from 'react-swipeable-views';

import {
    parentStudentsRequest,
    parentStudentsReset,
    transactionsRequest,
    transactionsReset,
    balanceThresholdRequest,
    balanceThresholdReset,
    setBalanceThresholdRequest,
    setBalanceThresholdReset,
} from '../../../store/actions'
import { toast } from 'react-toastify';
import { LoadingView } from '../../../components';
import { formatDate, formatMoney } from '../../../utils';
import { NAVIGATE_TO_TOPUPPAGE, NAVIGATE_TO_SPENDPAGE, NAVIGATE_TO_TRANSACTIONPAGE } from '../../../route/types';
import { BarChartOutlined, AccountBalanceWalletOutlined, NotificationsActiveOutlined } from '@mui/icons-material';

const getChildId = (item) => item?.id ?? item?.student_id ?? item?.user?.id ?? ""
const getCardId = (item) => item?.rfid_card?.id ?? item?.rfid_card?.card_id ?? ""

const toNumberOrNull = (value) => {
    if (value === null || value === undefined || value === '') return null
    const parsed = Number(value)
    return Number.isFinite(parsed) ? parsed : null
}

/**
 * The threshold read shape is confirmed against /api/docs before the reducer is
 * written (see FE-05), so this accepts the names the endpoint may use and reports
 * which reading is in play. A missing custom value means the system default is
 * what actually applies, which is what the card labels as "Default".
 */
export const readBalanceThreshold = (data) => {
    if (!data) return null

    const value = toNumberOrNull(data.balance_threshold ?? data.threshold ?? data.value)
    const defaultValue = toNumberOrNull(
        data.default_threshold ?? data.default ?? data.system_default ?? data.default_value
    )

    return {
        value,
        defaultValue,
        isDefault: value === null,
        // What the parent should see right now: their own level, else the default.
        effective: value === null ? defaultValue : value,
    }
}

const BalanceThresholdCard = ({
    thresholdStatus,
    thresholdResult,
    saveStatus,
    onRetry,
    onSave,
    onUseDefault,
}) => {
    const { t } = useTranslation()

    const loading = thresholdStatus === STATUS.LOADING
    const saving = saveStatus === STATUS.LOADING
    const failed = thresholdStatus === STATUS.ERROR
    const threshold = useMemo(() => readBalanceThreshold(thresholdResult), [thresholdResult])

    const [value, setValue] = useState('')
    const [touched, setTouched] = useState(false)

    // Show what the server currently holds, unless the parent is mid-edit.
    useEffect(() => {
        if (threshold && !touched) setValue(threshold.value === null ? '' : String(threshold.value))
    }, [threshold, touched])

    const parsed = value.trim() === '' ? null : Number(value)
    const invalid = value.trim() !== '' && (!Number.isInteger(parsed) || parsed < 0)
    const unchanged = threshold !== null && (parsed ?? null) === threshold.value

    const handleSave = (e) => {
        e.preventDefault()
        if (invalid || value.trim() === '') return
        onSave(parsed)
        setTouched(false)
    }

    if (failed) {
        return (
            <Card variant="outlined" sx={{ p: { xs: 2, sm: 3 }, borderRadius: 'md' }}>
                <Typography level="title-md" gutterBottom>{t("balanceThreshold.title")}</Typography>
                <Typography level="body-sm" color="danger" sx={{ mb: 1 }}>
                    {t("balanceThreshold.loadError")}
                </Typography>
                <Button size="sm" variant="outlined" color="neutral" onClick={onRetry} loading={loading}>
                    {t("balanceThreshold.retry")}
                </Button>
            </Card>
        )
    }

    return (
        <Card variant="outlined" sx={{ p: { xs: 2, sm: 3 }, borderRadius: 'md' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                <Box sx={{
                    width: 40, height: 40, borderRadius: '50%', backgroundColor: 'primary.softBg',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                    <NotificationsActiveOutlined />
                </Box>
                <Box sx={{ minWidth: 0 }}>
                    <Typography level="title-md">{t("balanceThreshold.title")}</Typography>
                    <Typography level="body-xs" sx={{ color: 'text.secondary' }}>
                        {t("balanceThreshold.desc")}
                    </Typography>
                </Box>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <Typography level="body-sm">{t("balanceThreshold.currentLevel")}:</Typography>
                {loading && threshold === null
                    ? <Typography level="body-sm" sx={{ color: 'text.tertiary' }}>{t("init.loading")}</Typography>
                    : <>
                        <Typography level="title-sm">
                            {threshold?.effective === null || threshold?.effective === undefined
                                ? t("balanceThreshold.defaultValue")
                                : formatMoney(threshold.effective)}
                        </Typography>
                        {threshold?.isDefault && (
                            <Chip size="sm" variant="soft" color="neutral">
                                {t("balanceThreshold.defaultBadge")}
                            </Chip>
                        )}
                    </>}
            </Box>

            <Box component='form' onSubmit={handleSave} noValidate
                sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, alignItems: 'flex-start' }}>
                <FormControl required error={invalid} sx={{ flex: 1, minWidth: 0 }}>
                    <FormLabel>{t("balanceThreshold.amount")} ({branding.CURRENCY_SYMBOL})</FormLabel>
                    <Input
                        type='number'
                        slotProps={{ input: { min: 0, step: 1 } }}
                        value={value}
                        onChange={(e) => { setTouched(true); setValue(e.target.value) }}
                        placeholder={t("balanceThreshold.amountHint")}
                        disabled={saving}
                    />
                    {invalid
                        ? <FormHelperText>{t("balanceThreshold.invalid")}</FormHelperText>
                        : !invalid && value.trim() !== '' && (
                            <FormHelperText>
                                {t("balanceThreshold.amountPreview", { amount: formatMoney(parsed) })}
                            </FormHelperText>
                        )}
                </FormControl>

                <Button
                    type='submit'
                    loading={saving}
                    disabled={saving || invalid || value.trim() === '' || unchanged}
                    sx={{ height: 40, alignSelf: { xs: 'stretch', sm: 'auto' } }}>
                    {t("balanceThreshold.save")}
                </Button>

                <Button
                    type='button'
                    variant='outlined'
                    color='neutral'
                    onClick={() => { onUseDefault(); setTouched(false) }}
                    disabled={saving || loading || threshold === null || threshold.isDefault}
                    sx={{ height: 40, alignSelf: { xs: 'stretch', sm: 'auto' } }}>
                    {t("balanceThreshold.useDefault")}
                </Button>
            </Box>
        </Card>
    )
}

const RenderStudentSlides = ({ data, props }) => {
    const { t } = useTranslation()

    const [currentIndex, setCurrentIndex] = useState(0);

    // Auto slide every 3 seconds
    useEffect(() => {
        if (data.length === 0) return;

        const interval = setInterval(() => {
            setCurrentIndex(prevIndex => (prevIndex + 1) % data.length);
        }, 10000); // Change the slide every 3 seconds

        return () => clearInterval(interval); // Cleanup interval on component unmount
    }, [data.length]);

    const handleChangeIndex = (index) => {
        setCurrentIndex(index);
    };

    return (
        <SwipeableViews
            index={currentIndex}
            onChangeIndex={handleChangeIndex}
            enableMouseEvents>
            {data.map((item, index) => (
                <Box
                    key={index}
                    sx={{
                        backgroundColor: 'inherit',
                        display: 'flex',
                        flexDirection: { xs: "column", md: 'row' },
                        gap: 1.5,
                        p: 1
                    }}>
                    <Sheet sx={{
                        p: 0, borderRadius: 'sm', flex: 1, boxShadow: 'md',
                        backgroundColor: 'background.popup'
                    }}>
                        <Box sx={{
                            display: 'flex',
                            flexDirection: "column",
                            justifyContent: 'center',
                            alignItems: 'center',
                            p: 1,
                        }}>
                            <Typography alignSelf={'flex-start'} level='title-sm'>{t("home.child_details")}</Typography>
                            <Typography alignSelf={'flex-start'} level='body-xs'>{item.first_name} {item.last_name}'s {t("home.details")}</Typography>
                            <Avatar
                                src={FILE_BASE + item.profile_picture}
                                variant='outlined'
                                color='primary'
                                sx={{
                                    width: 130, height: 130,
                                    borderRadius: 100, borderWidth: 3
                                }} />
                            <Box sx={{
                                flex: 1,
                                width: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                p: 1,
                                alignItems: 'center',
                                borderBottomLeftRadius: 'md',
                                borderBottomRightRadius: 'md'
                            }}>
                                <Typography level='title-md'>{item.first_name + " " + item.middle_name + " " + item.last_name}</Typography>
                                <Typography level='body-sm'>{item.school}</Typography>
                                <Typography level='body-sm'>{item.class_room}</Typography>
                            </Box>
                        </Box>
                    </Sheet>
                    {item.rfid_card &&
                        <Sheet
                            variant="plain"
                            sx={{
                                flex: 1,
                                display: 'flex',
                                flexDirection: 'column',
                                backgroundColor: 'background.popup',
                                p: 2,
                                borderRadius: 'sm',
                                boxShadow: 'md',
                                gap: 1
                            }}>
                            <Box>
                                <Typography level='title-sm'>{t("home.account_details")}</Typography>
                                <Typography level='body-xs'>This is {item.first_name}'s details</Typography>
                            </Box>
                            {/* <Divider /> */}
                            <Box>
                                <Typography textAlign={'center'} level="title-sm" >{t("home.available_balance")}</Typography>
                                <Typography my={1.5} fontFamily={"Roboto"} textAlign={'center'} level="h2">{formatMoney(item.rfid_card.balance)}</Typography>
                            </Box>
                            <Divider />
                            <Box sx={{
                                display: 'flex',
                                flexDirection: 'column',
                            }}>

                                <Typography fontSize={13}><b>{t("student.card_number")}:</b> {item.rfid_card.card_number}</Typography>
                                <Typography fontSize={13}><b>{t("student.controlNumber")}:</b> {item.rfid_card.control_number}</Typography>
                                <Typography fontSize={13}><b>{t("student.issue")}:</b> {formatDate(item.rfid_card.issued_date)}</Typography>
                            </Box>
                            <Button
                                size='sm'
                                variant='soft'
                                color='primary'
                                startDecorator={<BarChartOutlined />}
                                disabled={!getChildId(item)}
                                onClick={() => props.navigateToSpend(getChildId(item))}>
                                {t("home.view_spend")}
                            </Button>
                            <Button
                                size='sm'
                                variant='soft'
                                color='success'
                                startDecorator={<AccountBalanceWalletOutlined />}
                                disabled={!getCardId(item)}
                                onClick={() => props.navigateToTopUp(getCardId(item))}>
                                {t("home.top_up")}
                            </Button>
                        </Sheet>}
                </Box>
            ))}
        </SwipeableViews>
    )
}

const MobileViewTable = ({ data, props }) => {
    const { t } = useTranslation();
    return (
        <Box sx={{ display: { xs: 'block', md: 'none' } }}>
            {data.map((listItem, index) => (
                <List
                    key={index}
                    size="sm"
                    sx={{
                        '--ListItem-paddingX': 0,
                    }}
                >
                    <ListItem
                        variant="outlined"
                        color={
                            {
                                "successful": "success",
                                "failed": "danger",
                                "penalt": "warning",
                                "pending": "neutral"
                            }[listItem.transaction_status] as ColorPaletteProp}
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'start',
                            p: 1,
                            borderRadius: 4,
                            boxShadow: 'sm'
                        }}
                    >
                        <ListItemContent sx={{ display: 'flex', gap: 1, alignItems: 'start' }}>
                            <div>
                                <Typography fontWeight={600} level="title-md">{listItem.item_name}</Typography>
                                <Typography level="title-sm" >{listItem.student_name}</Typography>
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
                            <Typography fontWeight={600} level="title-md" gutterBottom>{formatMoney(listItem.amount)}</Typography>
                            <Chip
                                variant="solid"
                                size="sm"
                                color={
                                    {
                                        "successful": "success",
                                        "failed": "danger",
                                        "penalt": "warning",
                                        "pending": "neutral"
                                    }[listItem.transaction_status] as ColorPaletteProp
                                }
                            >
                                {{
                                    "successful": t("status.success"),
                                    "failed": t("status.failed"),
                                    "penalt": t("status.penalt"),
                                    "pending": t("status.pending")
                                }[listItem.transaction_status]}
                            </Chip>
                        </Box>

                    </ListItem>
                </List>
            ))}
        </Box>
    )
}

const DesktopViewTable = ({ data, props }) => {
    const { t } = useTranslation()
    return (
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
            }}>
            <Table >
                <thead>
                    <tr style={{ textAlign: 'center' }}>
                        <th style={{ width: 70, padding: '10px 6px' }}>{t("transaction.item_name")}</th>
                        <th style={{ width: 70, padding: '10px 6px', }}>{t("transaction.student_name")}</th>
                        <th style={{ width: 60, padding: '10px 6px', }}>{t("transaction.amount")} ({branding.CURRENCY_SYMBOL})</th>
                        <th style={{ width: 50, padding: '10px 6px', }}>{t("transaction.status")}</th>
                        <th style={{ width: 100, padding: '10px 6px', }}>{t("transaction.date")}</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((row, index) => (
                        <tr key={index}>
                            <td>
                                <Typography level="body-sm">{row.item_name}</Typography>
                            </td>
                            <td>
                                <Typography level="body-sm">{row.student_name}</Typography>
                            </td>
                            <td>
                                <Typography level="body-sm">{formatMoney(row.amount)}</Typography>
                            </td>
                            <td>
                                <Typography
                                    level='title-sm'
                                    color={
                                        {
                                            "successful": "success",
                                            "failed": "danger",
                                            "penalt": "warning",
                                            "pending": "neutral"
                                        }[row.transaction_status] as ColorPaletteProp
                                    }
                                >
                                    {{
                                        "successful": t("status.success"),
                                        "failed": t("status.failed"),
                                        "penalt": t("status.penalt"),
                                        "pending": t("status.pending")
                                    }[row.transaction_status]}
                                </Typography>
                            </td>
                            <td>
                                <Typography level="body-sm">{formatDate(row.transaction_date)}</Typography>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </Sheet>
    );
}


const ParentDashboard = ({
    accessToken,
    loginResult,

    studentsStatus,
    studentsResult,
    studentsErrorMessage,

    transactionsStatus,
    transactionsResult,
    transactionsErrorMessage,

    thresholdStatus,
    thresholdResult,

    setThresholdStatus,
    setThresholdErrorMessage
}) => {
    const { t } = useTranslation()
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const [transactionList, setTransactionList] = useState([]);
    const [parentStudents, setParentStudents] = useState([]);
    const [userDetails, setUserDetails] = useState({
        name: "",
        email: '',
        mobile: "",
    })

    // Distinguishes the two writes that share one status, so the success toast
    // says which one the server actually confirmed.
    const saveIntent = React.useRef<'save' | 'default'>('save')

    useEffect(() => {
        if (loginResult) {
            setUserDetails({
                name: `${loginResult.user.first_name || ""} ${loginResult.user.middle_name || ""} ${loginResult.user.last_name || ""}`,
                email: loginResult.user.email || "",
                mobile: loginResult.user.mobile_number || ""
            })
        }
    }, [loginResult])


    /* eslint-disable */
    useEffect(() => {
        if (studentsStatus === STATUS.SUCCESS) {
            setParentStudents(studentsResult)
        }
        else if (studentsStatus === STATUS.ERROR) {
            toast.error(studentsErrorMessage)
            dispatch(parentStudentsReset())
        }

        if (transactionsStatus === STATUS.SUCCESS) {
            setTransactionList(transactionsResult.results)
        }
        else if (transactionsStatus === STATUS.ERROR) {
            toast.error(transactionsErrorMessage)
            dispatch(transactionsReset())
        }
    }, [studentsStatus, transactionsStatus])

    // The card owns its own error state so a failed read shows a retry next to
    // the card instead of a toast that disappears.
    useEffect(() => {
        if (thresholdStatus === STATUS.ERROR) {
            dispatch(balanceThresholdReset())
        }
    }, [thresholdStatus])

    useEffect(() => {
        if (setThresholdStatus === STATUS.SUCCESS) {
            toast.success(saveIntent.current === 'default'
                ? t("balanceThreshold.resetDone")
                : t("balanceThreshold.saved"))
            dispatch(setBalanceThresholdReset())
            dispatch(balanceThresholdRequest(accessToken))
        }
        else if (setThresholdStatus === STATUS.ERROR) {
            toast.error(setThresholdErrorMessage || t("balanceThreshold.saveError"))
            dispatch(setBalanceThresholdReset())
        }
    }, [setThresholdStatus])

    useEffect(() => {
        dispatch(transactionsRequest(accessToken, { search: "" }, 1))
        dispatch(parentStudentsRequest(accessToken, {}))
        dispatch(balanceThresholdRequest(accessToken))
    }, [accessToken])
    /* eslint-enable */


    // Check loading status
    const checkLoading = () => {
        if (studentsStatus === STATUS.LOADING || transactionsStatus === STATUS.LOADING) {
            return true
        } else {
            return false
        }
    }

    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2
        }}>
            <LoadingView loading={checkLoading()} />

            <Box sx={{
                display: 'flex',
                flexDirection: 'row',
                gap: 1
            }}>
                {/* Left Side */}
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1,
                    width: { xs: 'auto', md: '70%' }
                }}>
                    {/* render parent's kids details */}
                    {parentStudents.length > 0 && <RenderStudentSlides data={parentStudents} props={{
                        navigateToSpend: (childId) => navigate(NAVIGATE_TO_SPENDPAGE + '?child=' + childId),
                        navigateToTopUp: (cardId) => navigate(NAVIGATE_TO_TOPUPPAGE + '?card=' + cardId)
                    }} />}

                    {/* Low-balance alert level */}
                    <BalanceThresholdCard
                        thresholdStatus={thresholdStatus}
                        thresholdResult={thresholdResult}
                        saveStatus={setThresholdStatus}
                        onRetry={() => dispatch(balanceThresholdRequest(accessToken))}
                        onSave={(value) => {
                            saveIntent.current = 'save'
                            dispatch(setBalanceThresholdRequest(accessToken, { balance_threshold: value }))
                        }}
                        onUseDefault={() => {
                            saveIntent.current = 'default'
                            dispatch(setBalanceThresholdRequest(accessToken, { balance_threshold: null }))
                        }}
                    />

                    {/* Transactions */}
                    {transactionList.length > 0 &&
                        <Card
                            sx={{ display: 'flex', flexDirection: 'column' }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Box>
                                    <Typography level='title-sm'>{t("home.meal_history")}</Typography>
                                    <Typography level='body-xs'>{t("home.meal_history_desc")}</Typography>
                                </Box>
                                <Button size='sm' color='neutral' variant='plain' onClick={() => navigate(NAVIGATE_TO_TRANSACTIONPAGE)}>
                                    {t("home.view_more")}
                                </Button>
                            </Box>
                            <List
                                size="sm"
                                sx={{
                                    '--ListItem-paddingX': 0,
                                }}
                            >
                                <MobileViewTable data={transactionList.slice(0, 5)} props={null} />
                                <DesktopViewTable data={transactionList.slice(0, 10)} props={null} />
                            </List>
                        </Card>}
                </Box>

                {/* Right Side */}
                <Sheet
                    sx={{
                        display: { xs: 'none', md: 'flex' },
                        flexDirection: 'column',
                        width: '25%',
                        backgroundColor: 'background.popup',
                        borderRadius: 'sm',
                        p: 1,
                        pt: 4,
                        justifyContent: 'flex-start',
                        alignItems: 'center',
                        gap: 1,
                        boxShadow: 'sm'
                    }}>
                    <Typography level="title-lg">{t("home.my_details")}</Typography>

                    <Avatar size="lg" sx={{ width: '100px', height: '100px' }} />
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}>
                        <Typography level="title-md">{userDetails.name}</Typography>
                        <Typography level="body-sm">{userDetails.email}</Typography>
                        <Typography level="body-sm">{userDetails.mobile}</Typography>
                    </Box>
                    {/* <Button variant="solid" color="success" size="sm" onClick={() => navigate(NAVIGATE_TO_PROFILEPAGE)}>{t("dashboard.viewProfile")}</Button> */}
                </Sheet>
            </Box>


        </Box>
    )
}

const mapStateToProps = ({ auth, dashboard, session }) => {
    const { accessToken, loginResult } = auth

    const {
        parentStudentsStatus: studentsStatus,
        parentStudentsResult: studentsResult,
        parentStudentsErrorMessage: studentsErrorMessage,

        balanceThresholdStatus: thresholdStatus,
        balanceThresholdResult: thresholdResult,
        balanceThresholdErrorMessage: thresholdErrorMessage,

        setBalanceThresholdStatus: setThresholdStatus,
        setBalanceThresholdErrorMessage: setThresholdErrorMessage
    } = dashboard

    const {
        transactionsStatus,
        transactionsResult,
        transactionsErrorMessage
    } = session

    return {
        accessToken,
        loginResult,

        studentsStatus,
        studentsResult,
        studentsErrorMessage,

        thresholdStatus,
        thresholdResult,
        thresholdErrorMessage,

        setThresholdStatus,
        setThresholdErrorMessage,

        transactionsStatus,
        transactionsResult,
        transactionsErrorMessage
    }
}

export default connect(mapStateToProps, {})(ParentDashboard)