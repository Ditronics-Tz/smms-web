import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next';
import { connect, useDispatch } from "react-redux"
import { API_BASE, STATUS } from '../../../constant';
import { toast } from 'react-toastify';
import SearchIcon from '@mui/icons-material/Search';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';

import {
    startSessionRequest,
    startSessionReset,
    endSessionRequest,
    endSessionReset,
    scanCardRequest,
    scanCardReset,
    scannedListRequest,
    scannedListReset,
} from '../../../store/actions.js'
import { Box, Button, Card, CardContent, Divider, FormControl, FormLabel, IconButton, iconButtonClasses, Input, List, ListDivider, ListItem, ListItemContent, Option, Select, Sheet, Stack, Table, Typography } from '@mui/joy';
import { LoadingView, NotFoundMessage, PageTitle } from '../../../components';
import { InfoOutlined, InfoRounded, PersonAddOutlined, WarningAmber, WarningRounded } from '@mui/icons-material';
import { useMediaQuery } from '@mui/material';
import { formatDate, thousandSeparator } from '../../../utils';


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
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'start',
                        }}
                    >
                        <ListItemContent sx={{ display: 'flex', gap: 2, alignItems: 'start' }}>
                            <div>
                                <Typography fontWeight={600} gutterBottom>{listItem.card_number}</Typography>
                                <Typography level="body-xs" gutterBottom><b>{t("session.studentName")}:</b> {listItem.student_name}</Typography>
                                <Typography level="body-xs" gutterBottom><b>{t("session.card_number")}:</b> {listItem.card_number}</Typography>
                                <Typography level="body-xs" gutterBottom><b>{t("session.item")}:</b> {listItem.item_name} - Tsh. {thousandSeparator(listItem.item_price || 0.0)}</Typography>
                                <Typography level='body-xs'>{formatDate(listItem.scanned_at)}</Typography>
                            </div>
                        </ListItemContent>
                    </ListItem>
                    <ListDivider />
                </List>
            ))}
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
                            <th style={{ width: 70, padding: '10px 6px' }}>{t("session.card_number")}</th>
                            <th style={{ width: 100, padding: '10px 6px', }}>{t("session.studentName")}</th>
                            <th style={{ width: 70, padding: '10px 6px', }}>{t("session.item")}</th>
                            <th style={{ width: 70, padding: '10px 6px', }}>{t("session.price")} (Tsh)</th>
                            <th style={{ width: 70, padding: '10px 6px', }}>{t("session.scanned_at")}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((row, index) => (
                            <tr key={index}>
                                <td>
                                    <Typography level="body-sm">{row.card_number}</Typography>
                                </td>
                                <td>
                                    <Typography level="body-sm">{row.student_name}</Typography>
                                </td>
                                <td>
                                    <Typography level="body-sm">{row.item_name}</Typography>
                                </td>
                                <td>
                                    <Typography level="body-sm">{thousandSeparator(row.item_price || 0.0)}</Typography>
                                </td>
                                <td>
                                    <Typography level="body-sm">{formatDate(row.scanned_at)}</Typography>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </Sheet>
        </React.Fragment>
    );
}

const SessionPage = ({
    accessToken,

    startStatus,
    startResult,
    startErrorMessage,

    endStatus,
    endResult,
    endErrorMessage,

    scanStatus,
    scanResult,
    scanErrorMessage,

    sessionStatus,
    sessionResult,
    sessionErrorMessage,

    scannedStatus,
    scannedResult,
    scannedErrorMessage
}) => {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const isDesktop = useMediaQuery("(min-width:600px)");

    const [scannedList, setScannedList] = useState([]);
    const [sessionData, setSessionData] = useState(null);
    const [items, setItems] = useState([]);
    const [item_id, setItemID] = useState('');
    const [sessionType, setSessionType] = useState('');

    const SessionTypes = [
        { value: "breakfast", label: t("session.breakfast") },
        { value: "lunch", label: t("session.lunch") },
        // {value: "dinner", label: t("session.dinner")},
    ]

    // ----- Fetch canteen list
    async function fetchCanteenList() {
        await axios.get(API_BASE + "/list/canteen-items", {
            timeout: 20000,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + accessToken,

            }
        }).then((res) => setItems(res.data.results))
    }

    // ---- Fetch Session status
    async function fetchSessionStatus() {
        await axios.get(API_BASE + "/sessions/active-session", {
            timeout: 20000,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + accessToken,

            }
        })
            .then((res) => {
                setSessionData(res.data)
            })
            .catch((e) => {
                if (e.response) {
                    toast.error(e.response.data.message)
                } else {
                    console.log(e.message)
                }
            })
    }

    // ----- Effect to call fetch
    useEffect(() => {
        fetchSessionStatus()
        fetchCanteenList()
    }, [accessToken])

    // ---- PAGINATION SETTINGS ----- //
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [totalScan, setTotalScan] = useState(0);
    const [nextPage, setNextPage] = useState(null);
    const [previousPage, setPreviousPage] = useState(null);

    const ITEMS_PER_PAGE = 50
    const pageLength = scannedList.length > 0 ? Math.ceil(totalScan / ITEMS_PER_PAGE) : 1

    // ---- Main Effect
    useEffect(() => {
        //  start scan
        if (startStatus === STATUS.SUCCESS) {
            setSessionData(startResult)
            // toast.success(t("session.success.start"))
        }
        else if (startStatus === STATUS.ERROR) {
            toast.error(startErrorMessage);
            dispatch(startSessionReset())
        }

        // end scan
        if (endStatus === STATUS.SUCCESS) {
            toast.success(t("session.success.end"))
            setSessionData(null)
            dispatch(startSessionReset())
            dispatch(endSessionReset())
        }
        else if (endStatus === STATUS.ERROR) {
            toast.error(endErrorMessage)
            dispatch(endSessionReset())
        }

        // scan card
        if (scanStatus === STATUS.SUCCESS) {
            setCardNumber("")
            toast.success(t("session.success.scan"))
            dispatch(scannedListRequest(accessToken, { "session_id": sessionData.id, "search": "" }, 1))
            dispatch(scanCardReset())
        }
        else if (scanStatus === STATUS.ERROR) {
            setCardNumber("")
            toast.error(scanErrorMessage)
            dispatch(scanCardReset())
        }

        // scanned list
        if (scannedStatus === STATUS.SUCCESS) {
            setScannedList(scannedResult.results);
            setNextPage(scannedResult.next);
            setPreviousPage(scannedResult.previous);
            setTotalScan(scannedResult.count);
            // toast.success(t("session.success.list"))
            // dispatch(scannedListReset())
        }
        else if (scannedStatus === STATUS.ERROR) {
            toast.error(scannedErrorMessage)
            dispatch(scannedListReset())
        }


    }, [startStatus, endStatus, scannedStatus, scanStatus])

    // ---- Effect to update scanned list table
    useEffect(() => {
        if (sessionData) {
            dispatch(scannedListRequest(accessToken, { "session_id": sessionData ? sessionData.id : "", "search": search }, page))
        }
    }, [scanStatus, page, search])

    const [card_number, setCardNumber] = useState('');
    const inputRef = useRef(null);

    // Focus on input when the component mounts
    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    // Start Session
    const startSession = (event) => {
        event.preventDefault();
        const data = {
            'type': sessionType
        }
        if (sessionType) {
            dispatch(startSessionRequest(accessToken, data))
        }
        else {
            toast.error("Please select the sesssion type")
        }

    }

    // End session
    const endSession = () => {
        const data = {
            "session_id": sessionData.id
        }
        dispatch(endSessionRequest(accessToken, data))
    }


    // Handle change in input field
    const handleInputChange = (event) => {
        setCardNumber(event.target.value);
    };

    // Handle send data
    const handleScan = () => {
        const data = {
            "session_id": sessionData ? sessionData.id : "",
            "card_number": card_number,
            "item_id": item_id
        }

        if (card_number && item_id && sessionData) {
            dispatch(scanCardRequest(accessToken, data))
        }
        else if (!card_number) {
            toast.error(t("session.error.noCard"))
            setCardNumber("")
        }
        else if (!item_id) {
            toast.error(t("session.error.noItem"))
            setCardNumber("")
        }
        else if (!sessionData) {
            toast.error(t("session.error.noSession"))
            setCardNumber("")
        }
        else {
            toast.error(t("session.error.other"))
        }
    }

    // Detect Enter key to submit automatically
    const handleKeyDown = (event) => {
        if (event.key === "Enter") {
            handleScan()
        }
    }


    // ----- Render Active Session
    const RenderActiveSession = () => {
        return (
            <CardContent sx={{
                display: 'flex',
                gap: 1,
                justifyContent: 'center',
                alignItems: 'center',
                margin: 'auto'
            }}>

                <Typography level='h3'>{t("session.active")} {t("session.session")}</Typography>
                <Typography
                    level='body-sm'
                    color='danger'
                    variant='outlined'
                    textAlign="center"
                    startDecorator={<InfoOutlined color="info" />}
                    sx={{
                        backgroundColor: "background.level1",
                        p: 1,
                        borderRadius: 5
                    }}>
                    {t("session.activeInst")}
                </Typography>

                {sessionData &&
                    <Box >
                        <Typography
                            level='body-sm'><b>{
                                t("session.type")}:</b> {{
                                    'lunch': t('session.lunch'),
                                    'dinner': t("session.dinner"),
                                    'breakfast': t("session.breakfast")
                                }[sessionData.type]}
                        </Typography>
                        <Typography level='body-sm'><b>{t("session.start_at")}:</b> {formatDate(sessionData.start_at)}</Typography>
                    </Box>}
                <Divider />
                <Stack mt={3} display='flex' gap={2}>
                    <FormControl>
                        <FormLabel>{t("session.item")}</FormLabel>
                        <Select placeholder={t("init.select") + t("session.item")} value={item_id} onChange={(e, v) => setItemID(v)}>
                            {items.length > 0 && items.map((item, index) => (<Option key={index} value={item.id} >{item.name} Tsh. {thousandSeparator(item.price)}</Option>))}
                        </Select>
                    </FormControl>
                    <FormControl required>
                        {/* <FormLabel>{t("init.placeholder") + t("session.")}</FormLabel> */}
                        <Input
                            // ref={inputRef}
                            color='success'
                            type="text"
                            placeholder={t("session.inputPlaceholder")}
                            value={card_number}
                            onChange={handleInputChange}
                            onKeyDown={handleKeyDown}
                            autoFocus
                            sx={{
                                width: '400px',
                                height: "80px",
                                textAlign: 'center'
                            }}
                        />
                    </FormControl>
                    <Button
                        onClick={handleScan}
                        type='submit'
                        variant='solid'
                        color='success'
                        sx={{
                            alignSelf: 'center',
                            width: '200px'
                        }}>
                        {t("session.send")}
                    </Button>
                </Stack>
                <Divider />
                <Button
                    variant='outlined'
                    color='danger'
                    onClick={endSession}
                >
                    {t("session.end")} {t("session.session")}
                </Button>

            </CardContent>
        )
    }

    // ---- Render Start Session
    const RenderStartSession = () => {
        return (
            <CardContent sx={{
                gap: 1,
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                <Typography level='h3'>{t("session.startSession")}</Typography>
                <Typography
                    level='body-sm'
                    color='neutral'
                    variant='outlined'
                    textAlign="center"
                    startDecorator={<InfoOutlined color="info" />}
                    sx={{
                        backgroundColor: "background.level1",
                        p: 1,
                        borderRadius: 5
                    }}>
                    {t("session.instructions")}
                </Typography>
                <Stack mt={3} display='flex' gap={2} component='form' onSubmit={startSession}>
                    <FormControl required>
                        <FormLabel>{t("init.select") + t("session.type")}</FormLabel>
                        <Select placeholder={t("init.select") + t("session.type")} value={sessionType} onChange={(e, v) => setSessionType(v)}>
                            {SessionTypes.map((item, index) => (<Option key={index} value={item.value} >{item.label}</Option>))}
                        </Select>
                    </FormControl>
                    <Button
                        type='submit'
                        variant='solid'
                        color='success'
                        sx={{
                            width: '300px'
                        }}
                    >
                        {t("session.start")} {t("session.session")}
                    </Button>
                </Stack>

            </CardContent>
        )
    }



    // CHECK LOADING
    const checkLoading = () => {
        if (startStatus === STATUS.LOADING || endStatus === STATUS.LOADING
            || scanStatus === STATUS.LOADING) {
            return true
        } else {
            return false
        }
    }

    return (
        <Box>
            {/* <PageTitle title={t("session.title")} /> */}

            <LoadingView loading={checkLoading()} />
            <Box sx={{ width: "100%", display: 'flex', justifyContent: 'center', mt: 2 }}>
                <Card sx={{ backgroundColor: "background.popup", maxWidth: '800px', alignSelf: "center" }}>
                    {sessionData ? RenderActiveSession() : RenderStartSession()}
                    {/* {RenderActiveSession()} */}
                </Card>
            </Box>

            {/* ---- Scanned List View ----- */}
            {scannedList.length > 0 &&
                <Box>
                    {/* search */}
                    <Sheet
                        className="SearchAndFilters"
                        sx={{
                            display: 'flex',
                            my: 1,
                            gap: 1,
                            flexDirection: { xs: 'column', sm: 'row' },
                            // width: { xs: 'auto', md: '30%' },
                            justifyContent: 'space-between',
                        }}
                    >
                        <Typography level='title-md'>{t("session.scannedList")}</Typography>

                        <Input
                            size="sm"
                            placeholder={t("init.search") + t("card.control_number")}
                            type='text'
                            defaultValue={search}
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            startDecorator={<SearchIcon />}
                            sx={{ width: { xs: 'auto', md: '30%' }, textTransform: 'capitalize' }}
                        />
                    </Sheet>

                    {/* ------ Scanned List ----- */}

                    {/* ------ render different view depend on plafform -------- */}
                    <MobileViewTable data={scannedList} props={{ edit: null }} />
                    <DesktopViewTable data={scannedList} props={{ edit: null }} />

                    {/* Pagination */}
                    {totalScan > ITEMS_PER_PAGE
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
                                {t('init.page')} {page} of {Math.ceil(totalScan / ITEMS_PER_PAGE)}
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

                </Box>}
        </Box>
    )
}




const mapStateToProps = ({ auth, session }) => {
    const { accessToken } = auth

    const {
        startSessionStatus: startStatus,
        startSessionResult: startResult,
        startSessionErrorMessage: startErrorMessage,

        endSessionStatus: endStatus,
        endSessionResult: endResult,
        endSessionErrorMessage: endErrorMessage,

        sessionListStatus: sessionStatus,
        sessionListResult: sessionResult,
        sessionListErrorMessage: sessionErrorMessage,

        scanCardStatus: scanStatus,
        scanCardResult: scanResult,
        scanCardErrorMessage: scanErrorMessage,

        scannedListStatus: scannedStatus,
        scannedListResult: scannedResult,
        scannedListErrorMessage: scannedErrorMessage
    } = session

    return {
        accessToken,

        startStatus,
        startResult,
        startErrorMessage,

        endStatus,
        endResult,
        endErrorMessage,

        scanStatus,
        scanResult,
        scanErrorMessage,

        sessionStatus,
        sessionResult,
        sessionErrorMessage,

        scannedStatus,
        scannedResult,
        scannedErrorMessage
    }
}

export default connect(mapStateToProps, {})(SessionPage)