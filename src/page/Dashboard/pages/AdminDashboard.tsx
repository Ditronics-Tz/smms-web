import { ArrowForward, TrendingUp, MonetizationOnOutlined } from "@mui/icons-material"
import { Grid, Card, CardContent, Box, Typography, Button, Divider, CardActions, ButtonGroup, Sheet } from "@mui/joy"
import React, { useEffect, useState } from "react"
import { NAVIGATE_TO_STUDENTPAGE, NAVIGATE_TO_PARENTPAGE, NAVIGATE_TO_TRANSACTIONPAGE } from "../../../route/types"
import { connect, useDispatch } from "react-redux"
import { STATUS } from "../../../constant"
import { useTranslation } from "react-i18next"

import {
    countsRequest,
    countsReset,
    salesSummaryRequest,
    salesSummaryReset,
    salesTrendRequest,
    salesTrendReset
} from "../../../store/actions"
import { toast } from "react-toastify"
import { LoadingView } from "../../../components"
import { thousandSeparator } from "../../../utils"
import LineGraph from "./LineGraph"


const CountsCards = ({ props, data }) => {

    const cardsItems = [
        {
            title: 'Total Students',
            color: '#D1F8EF',
            number: data.students,
            action: NAVIGATE_TO_STUDENTPAGE
        },
        {
            title: 'Total Parents',
            color: '#B6FFA1',
            number: data.parents,
            action: NAVIGATE_TO_PARENTPAGE
        },
        {
            title: 'Total Purchase',
            color: '#D0DDD0',
            number: data.transactions,
            action: NAVIGATE_TO_TRANSACTIONPAGE
        },
        {
            title: 'Available Balance',
            color: '#C4D9FF',
            number: "Tsh. " + thousandSeparator(data.total_balance),
            action: '#'
        }
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
                                <Typography
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
                                    View Details
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>))
            }
        </Grid >
    )
}

const AdminDashboard = ({
    accessToken,

    countsStatus,
    countsResult,
    countsErrorMessage,

    salesSummaryStatus,
    salesSummaryResult,
    salesSummaryErrorMessage,

    salesTrendStatus,
    salesTrendResult,
    salesTrendErrorMessage
}) => {
    const dispatch = useDispatch();
    const { t } = useTranslation();

    const [countsData, setCountsData] = useState({
        students: 0,
        parents: 0,
        total_balance: 0,
        transactions: 0
    })

    const [salesSummary, setSalesSummary] = useState({
        penalts: 0,
        success: 0,
        penalts_amount: 0,
        success_amount: 0,
        filter_by: ""
    })

    const [salesTrend, setSalesTrend] = useState([{
        date: "",
        amount: 0,
    }])

    // ----- Set data from reducer ----
    /* eslint-disable */
    useEffect(() => {
        // set counts
        if (countsStatus === STATUS.SUCCESS) {
            setCountsData({
                students: countsResult.total_students,
                parents: countsResult.total_parents,
                total_balance: countsResult.total_available_balance,
                transactions: countsResult.total_transactions
            })
        }
        else if (countsStatus === STATUS.ERROR) {
            toast.error(countsErrorMessage)
            dispatch(countsReset())
        }

        // set sales summary
        if (salesSummaryStatus === STATUS.SUCCESS) {
            setSalesSummary({
                penalts: salesSummaryResult.total_penalts,
                success: salesSummaryResult.total_success,
                penalts_amount: salesSummaryResult.total_penalts_amount,
                success_amount: salesSummaryResult.total_success_amount,
                filter_by: salesSummaryResult.filter_type
            })
        }
        else if (salesSummaryResult === STATUS.ERROR) {
            toast.error(salesSummaryErrorMessage)
            dispatch(salesSummaryReset())
        }

        // set sales trend
        if (salesTrendStatus === STATUS.SUCCESS) {
            setSalesTrend(
                salesTrendResult.map((item) => ({
                    date: new Date(item.date).toLocaleDateString('en-US', {
                        month: 'short', // Abbreviated month
                        day: '2-digit', // Two-digit day
                    }),
                    amount: parseFloat(item.sales_amount),
                }))
            );
        }
        else if (salesTrendStatus === STATUS.ERROR) {
            toast.error(salesTrendErrorMessage)
            dispatch(salesTrendReset())
        }
    }, [countsStatus, salesSummaryStatus, salesTrendResult])

    // fetch data from backend
    useEffect(() => {
        dispatch(countsRequest(accessToken, {}))
        dispatch(salesSummaryRequest(accessToken, { "filter": "day" }))
        dispatch(salesTrendRequest(accessToken, {}))
    }, [accessToken])
    /* eslint-enable */

    const requestSummary = (filter) => {
        dispatch(salesSummaryRequest(accessToken, { "filter": filter }))
    }

    const checkLoading = () => {
        if (countsStatus === STATUS.LOADING || salesSummaryStatus === STATUS.LOADING ||
            salesTrendStatus === STATUS.LOADING
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
                {/* Render Sales Trend Chart */}
                <Card
                    sx={{
                        display: 'flex',
                        width: { xs: 'auto', md: '75%' },
                        justifyContent: 'center',
                        // alignItems: 'center',
                        boxShadow: 'sm',
                        backgroundColor: 'background.body'
                    }}>
                    <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        <Typography
                            startDecorator={<TrendingUp />}
                            level="title-md">
                            Sales Trend
                        </Typography>
                        <Typography level="body-sm">This is the sales trend of the week to show total transactions amount per day</Typography>
                        <Divider />
                        <LineGraph data={salesTrend} />
                    </CardContent>
                </Card>

                {/* Render Sales Summary */}
                <Card
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
                            Total Sales Amount
                        </Typography>
                        <Typography level="body-sm">This is the total sales amount in day, month and year</Typography>
                        <Divider />
                        <ButtonGroup >
                            {["day", "month", "year"].map((item, index) => (
                                <Button
                                    key={index}
                                    variant={item===salesSummary.filter_by ? "solid" : "outlined"}
                                    onClick={() => requestSummary(item)}>
                                    {{
                                        "day": "Day",
                                        "month": "Month",
                                        "year": "Year"
                                    }[item]}
                                </Button>)
                            )}
                        </ButtonGroup>
                    </CardActions>
                    <Divider />
                    <CardContent sx={{ display: 'flex', flexDirection: 'column', width: '100%', gap: 1 }}>
                        <Typography level="title-sm">
                            {{
                                "day": "Today",
                                "month": "This Month",
                                "year": "This Year"
                            }[salesSummary.filter_by]} Summary
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1,}}>
                            {[
                                { title: "Transactions", count: salesSummary.success },
                                { title: "Penalts", count: salesSummary.penalts }].map((item, index) => (
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
                            <Typography level="title-md">Total Amount</Typography>
                            <Typography fontSize={23}>Tsh. {thousandSeparator(salesSummary.success_amount)}</Typography>
                            <Typography level="title-sm" color="danger" mt={1}>Total Penalts Amount</Typography>
                            <Typography fontSize={14} color="danger">Tsh. {thousandSeparator(salesSummary.penalts_amount)}</Typography>
                        </Sheet>

                    </CardContent>
                </Card>
            </Box>
        </Box >
    )
}

const mapStateToProps = ({ auth, dashboard }) => {
    const { accessToken } = auth

    const {
        countsStatus,
        countsResult,
        countsErrorMessage,

        salesSummaryStatus,
        salesSummaryResult,
        salesSummaryErrorMessage,

        salesTrendStatus,
        salesTrendResult,
        salesTrendErrorMessage
    } = dashboard

    return {
        accessToken,

        countsStatus,
        countsResult,
        countsErrorMessage,

        salesSummaryStatus,
        salesSummaryResult,
        salesSummaryErrorMessage,

        salesTrendStatus,
        salesTrendResult,
        salesTrendErrorMessage
    }
}

export default connect(mapStateToProps, {})(AdminDashboard)