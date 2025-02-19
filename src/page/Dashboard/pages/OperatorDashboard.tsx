import { MonetizationOnOutlined, TimerOutlined } from "@mui/icons-material"
import { Grid, Card, CardContent, Box, Typography, Divider, CardActions, Sheet, Table, Chip, ColorPaletteProp } from "@mui/joy"
import React, { useEffect, useState } from "react"
import { connect, useDispatch } from "react-redux"
import { STATUS } from "../../../constant"
import { useTranslation } from "react-i18next"

import {
    countsRequest,
    countsReset,
    lastSessionRequest,
    lastSessionReset,
    sessionListRequest,
    sessionListReset
} from "../../../store/actions"
import { toast } from "react-toastify"
import { LoadingView } from "../../../components"
import { formatDate, thousandSeparator } from "../../../utils"


const CountsCards = ({ props, data }) => {
    const { t } = useTranslation()

    const cardsItems = [
        {
            title: t("home.session"),
            color: '#D1F8EF',
            number: data.sessions
        },
        {
            title: t("home.this") + " " + t("home.week") + " " + t("home.sales"),
            color: '#B6FFA1',
            number: 'Tsh. ' + thousandSeparator(data.price_week || 0)
        },
        {
            title: t("home.today") + " " + t("home.sales"),
            color: '#D0DDD0',
            number: 'Tsh. ' + thousandSeparator(data.price_today || 0)
        },
        // {
        //     title: t("home.available"),
        //     color: '#C4D9FF',
        //     number: "Tsh. " + thousandSeparator(data.total_balance)
        // }
    ]
    return (
        // {/* card counts */ }
        < Grid container
            spacing={{ xs: 1, md: 1 }
            }
            columns={{ xs: 4, sm: 8, md: 12 }}
            sx={{ flexGrow: 1 }}>
            {
                cardsItems.map((item, index) => (
                    <Grid xs={2} sm={3} md={3} key={index}>
                        <Card
                            variant="soft"
                            sx={{
                                display: 'flex',
                                flex: 1,
                                backgroundColor: `${item.color}`,
                                borderRadius: "lg",
                                p: 1.5
                            }}>
                            <CardContent>
                                <Box>
                                    <Typography
                                        fontSize={12}
                                        sx={{ color: 'black' }}>
                                        {item.title}
                                    </Typography>
                                    <Typography
                                        fontWeight='600'
                                        fontFamily="roboto"
                                        sx={{ color: 'black', fontSize: { xs: 20, md: 25 } }}>
                                        {item.number}
                                    </Typography>
                                </Box>
                                {/* <Typography
                                    component='a'
                                    // startDecorator={<RemoveRedEyeOutlined color="success" />}
                                    endDecorator={<ArrowForward sx={{ fontSize: 11 }} />}
                                    href={item.action}
                                    sx={{
                                        textDecoration: "none",
                                        fontSize: { xs: 8, md: 10 },
                                        mt: 2,
                                        py: 0.3,
                                        px: 1.3,
                                        borderRadius: 20,
                                        backgroundColor: 'white',
                                        fontWeight: '500',
                                        fontFamily: 'sans-serif',
                                        color: 'black',
                                        alignSelf: 'flex-end',
                                        // boxShadow: 'sm'
                                    }}>
                                    {t("home.view")}
                                </Typography> */}
                            </CardContent>
                        </Card>
                    </Grid>))
            }
        </Grid >
    )
}

const OperatorDashboard = ({
    accessToken,

    countsStatus,
    countsResult,
    countsErrorMessage,

    sessionStatus,
    sessionResult,
    sessionErrorMessage,

    lastSessionStatus,
    lastSessionResult,
    lastSessionErrorMessage
}) => {
    const dispatch = useDispatch();
    const { t } = useTranslation();

    const [countsData, setCountsData] = useState({
        price_week: 0,
        price_today: 0,
        sessions: 0
    })

    const [lastSession, setLastSession] = useState({
        session_type: "",
        session_status: "",
        start_time: "",
        end_time: "",
        total_price: "",
        student_count: ""
    })

    const [sessionsList, setSessionList] = useState([])

    // ----- Set data from reducer ----
    /* eslint-disable */
    useEffect(() => {
        // set counts
        if (countsStatus === STATUS.SUCCESS) {
            setCountsData({
                sessions: countsResult.sessions,
                price_today: countsResult.price_today,
                price_week: countsResult.price_week
            })
        }
        else if (countsStatus === STATUS.ERROR) {
            toast.error(countsErrorMessage)
            dispatch(countsReset())
        }

        // set sales summary
        if (lastSessionStatus === STATUS.SUCCESS) {
            setLastSession({
                session_type: lastSessionResult.session_type,
                session_status: lastSessionResult.session_status,
                start_time: lastSessionResult.start_time,
                end_time: lastSessionResult.end_time,
                total_price: lastSessionResult.total_price,
                student_count: lastSessionResult.student_count
            })
        }
        else if (lastSessionResult === STATUS.ERROR) {
            toast.error(lastSessionErrorMessage)
            dispatch(lastSessionReset())
        }

        // set session list
        if (sessionStatus === STATUS.SUCCESS) {
            setSessionList(sessionResult)
        }
        else if (sessionStatus === STATUS.ERROR) {
            console.error(sessionErrorMessage)
            dispatch(sessionListReset())
        }

    }, [countsStatus, lastSessionStatus, sessionStatus])

    // fetch data from backend
    useEffect(() => {
        dispatch(countsRequest(accessToken, {}))
        dispatch(lastSessionRequest(accessToken, {}))
        dispatch(sessionListRequest(accessToken, {}))
    }, [accessToken])
    /* eslint-enable */

    const checkLoading = () => {
        if (countsStatus === STATUS.LOADING || lastSessionStatus === STATUS.LOADING ||
            sessionStatus === STATUS.LOADING
        ) {
            return true
        }
        else {
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
            <CountsCards props={null} data={countsData} />

            <Box sx={{
                display: 'flex',
                width: '100%',
                flexDirection: { xs: 'column', md: 'row' },
                gap: 1
            }}>
                {/* Render Previous Session */}
                {sessionsList.length > 0 &&
                    <Card
                        sx={{
                            display: {xs: 'none', md: 'flex'},
                            width: { xs: 'auto', md: '75%' },
                            justifyContent: 'center',
                            // alignItems: 'center',
                            boxShadow: 'sm',
                            backgroundColor: 'background.body'
                        }}>
                        <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                            <Typography
                                startDecorator={<TimerOutlined />}
                                level="title-md">
                                {t("home.previous_sessions")}
                            </Typography>
                            <Typography level="body-sm">{t("home.previous_sessions_desc")}</Typography>
                            <Divider />
                            <Table>
                                <thead>
                                    <th style={{ padding: "10px 6px", width: 50 }}>{t("session.type")}</th>
                                    <th style={{ padding: "10px 6px", width: 50}}>{t("session.status")}</th>
                                    <th style={{ padding: "10px 6px", width: 80 }}>{t("session.start_at")}</th>
                                    <th style={{ padding: "10px 6px", width: 80 }}>{t("session.end_at")}</th>
                                </thead>
                                <tbody>
                                    {sessionsList.map((item, index) => (
                                        <tr>
                                            <td>{{
                                                "lunch": t("session.lunch"),
                                                "dinner": t("session.dinner"),
                                                "breakfast": t("session.breakfast")
                                            }[item.type]}</td>
                                            <td><Chip
                                                variant="outlined"
                                                size="sm"
                                                color={
                                                    {
                                                        "completed": 'success',
                                                        "active": 'neutral',
                                                        "cancelled": 'danger',
                                                    }[item.status] as ColorPaletteProp
                                                }
                                            >
                                                {{
                                                    "active": t("status.active"),
                                                    "completed": t("status.complete"),
                                                    "cancelled": t("status.cancelled")
                                                }[item.status]}
                                            </Chip></td>
                                            <td>{formatDate(item.start_at)}</td>
                                            <td>{formatDate(item.end_at)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </CardContent>
                    </Card>}

                {/* Render Sales Summary */}
                {lastSession.session_status && <Card
                    // variant="soft"
                    color="success"
                    sx={{
                        display: 'flex',
                        width: { xs: 'auto', md: '35%' },
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: "background.popup",
                        boxShadow: 'sm'
                    }}>
                    <CardActions sx={{
                        display: 'flex',
                        flexDirection: 'column',
                    }}>
                        <Typography startDecorator={<MonetizationOnOutlined />} alignSelf="flex-start" level="title-md">
                            {t("home.last_session")}
                        </Typography>
                        <Typography level="body-sm">{t("home.last_session_desc")}</Typography>
                    </CardActions>
                    <Divider />
                    <CardContent sx={{ display: 'flex', flexDirection: 'column', width: '100%', gap: 1 }}>
                        <Typography level="title-sm">
                            {{
                                "lunch": t("session.lunch"),
                                "dinner": t("session.dinner"),
                                "breakfast": t("session.breakfast")
                            }[lastSession.session_type]} {t("home.summary")}
                        </Typography>
                        <Typography level="title-sm">
                            {{
                                "active": t("status.active"),
                                "completed": t("status.complete"),
                                "cancelled": t("status.cancelled")
                            }[lastSession.session_status]} {t("home.summary")}
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1, }}>
                            {[
                                { title: t("session.start_at"), count: formatDate(lastSession.start_time) },
                                { title: t("session.end_at"), count: formatDate(lastSession.end_time) }].map((item, index) => (
                                    <Box
                                        key={index}
                                        sx={{
                                            flex: 1,
                                            backgroundColor: 'background.level1',
                                            borderRadius: 8,
                                            p: 1,
                                            gap: 0.2
                                        }}>
                                        <Typography level="body-sm" >{item.title}</Typography>
                                        <Typography level="title-md">{item.count}</Typography>
                                    </Box>)
                                )}
                        </Box>

                        <Divider />
                        <Sheet
                            variant="soft"
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: "center",
                                alignItems: 'center',
                                borderRadius: 8,
                                p: 1
                            }}>
                            <Typography level="title-sm" color="success" mt={1}>{t("home.number_of_student")}</Typography>
                            <Typography fontSize={18} color="success">{lastSession.student_count}</Typography>
                            <Typography level="title-md">{t("home.total") + " " + t("home.sales") + " " + t("home.amount")}</Typography>
                            <Typography level="h4" fontSize={23}>Tsh. {thousandSeparator(lastSession.total_price)}</Typography>
                        </Sheet>

                    </CardContent>
                </Card>}
            </Box>
        </Box >
    )
}

const mapStateToProps = ({ auth, dashboard, session }) => {
    const { accessToken } = auth

    const {
        sessionListStatus: sessionStatus,
        sessionListResult: sessionResult,
        sessionListErrorMessage: sessionErrorMessage,
    } = session

    const {
        countsStatus,
        countsResult,
        countsErrorMessage,

        lastSessionStatus,
        lastSessionResult,
        lastSessionErrorMessage
    } = dashboard

    return {
        accessToken,

        countsStatus,
        countsResult,
        countsErrorMessage,

        lastSessionStatus,
        lastSessionResult,
        lastSessionErrorMessage,

        sessionStatus,
        sessionResult,
        sessionErrorMessage,
    }
}

export default connect(mapStateToProps, {})(OperatorDashboard)