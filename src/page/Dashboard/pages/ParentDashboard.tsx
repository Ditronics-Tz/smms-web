import { Avatar, Box, Button, Card, Chip, ColorPaletteProp, Divider, List, ListItem, ListItemContent, Sheet, Table, Typography } from '@mui/joy';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { connect, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FILE_BASE, STATUS } from '../../../constant';
import SwipeableViews from 'react-swipeable-views';

import {
    parentStudentsRequest,
    parentStudentsReset,
    transactionsRequest,
    transactionsReset,
} from '../../../store/actions'
import { toast } from 'react-toastify';
import { LoadingView } from '../../../components';
import { formatDate, thousandSeparator } from '../../../utils';
import { NAVIGATE_TO_TRANSACTIONPAGE } from '../../../route/types';

const RenderStudentSlides = ({ data }) => {
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
                                <Typography my={1.5} fontFamily={"Roboto"} textAlign={'center'} level="h2">Tsh. {thousandSeparator(item.rfid_card.balance)}</Typography>
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
                            <Typography fontWeight={600} level="title-md" gutterBottom>Tsh. {thousandSeparator(listItem.amount)}</Typography>
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
                        <th style={{ width: 60, padding: '10px 6px', }}>{t("transaction.amount")} (Tsh)</th>
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
                                <Typography level="body-sm">{thousandSeparator(row.amount)}</Typography>
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
    transactionsErrorMessage
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

    useEffect(() => {
        dispatch(transactionsRequest(accessToken, { search: "" }, 1))
        dispatch(parentStudentsRequest(accessToken, {}))
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
                    {parentStudents.length > 0 && <RenderStudentSlides data={parentStudents} />}

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
        parentStudentsErrorMessage: studentsErrorMessage
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

        transactionsStatus,
        transactionsResult,
        transactionsErrorMessage
    }
}

export default connect(mapStateToProps, {})(ParentDashboard)