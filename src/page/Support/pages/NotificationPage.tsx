import React, { useEffect, useRef, useState } from "react";
import { Typography, Box, List, ListItem, ListItemContent, ListDivider, Sheet, Table, iconButtonClasses, Button, IconButton, Input, ButtonGroup, Dropdown, MenuButton, Menu, Modal, ModalDialog, ModalClose, DialogTitle, DialogContent, FormControl, FormLabel, Stack, Chip, ColorPaletteProp, Autocomplete } from "@mui/joy";
import { AlertModal, LoadingView, NotFoundMessage, PageTitle } from "../../../components";
import { formatDate, thousandSeparator } from "../../../utils";

import SearchIcon from '@mui/icons-material/Search';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';

import { connect, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useMediaQuery } from "@mui/material";
import { BlockOutlined, CalendarMonthRounded, EditOutlined, PersonAddOutlined, RemoveRedEyeOutlined, TaskAltOutlined } from "@mui/icons-material";
import { API_BASE, STATUS } from "../../../constant";
import { toast } from "react-toastify";

import {
    allNotificationsRequest,
    allNotificationsReset
} from "../../../store/actions"
import { useTranslation } from "react-i18next";
import axios from "axios";

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
                                "sent": "success",
                                "failed": "danger",
                                "pending": "neutral"
                            }[listItem.notification_status] as ColorPaletteProp}
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
                                <Typography fontWeight={600} level="title-md">{
                                    {
                                        "transaction": t("notification.transaction"),
                                        "system": t("notification.system"),
                                        "reminder": t("notification.reminder"),
                                        "message": t("notification.message")
                                    }[listItem.type]}
                                </Typography>
                                <Typography fontSize={12} >{listItem.message}</Typography>
                                <Typography level="title-sm" ><b>{t("notification.recipient")}: </b>{listItem.recipient}</Typography>
                                <Typography fontSize={12} gutterBottom>{formatDate(listItem.created_at)}</Typography>
                            </div>
                        </ListItemContent>
                        <Box sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'flex-end',
                            rowGap: 1
                        }}>
                            <Chip
                                variant="solid"
                                size="sm"
                                color={
                                    {
                                        "sent": "success",
                                        "failed": "danger",
                                        "pending": "neutral"
                                    }[listItem.status] as ColorPaletteProp
                                }
                            >
                                {{
                                    "sent": t("status.sent"),
                                    "failed": t("status.failed"),
                                    "pending": t("status.pending")
                                }[listItem.status]}
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
                            <th style={{ width: 70, padding: '10px 6px' }}>{t("notification.type")}</th>
                            <th style={{ width: 100, padding: '10px 6px', }}>{t("notification.recipient")}</th>
                            <th style={{ width: 250, padding: '10px 6px', }}>{t("notification.message")}</th>
                            <th style={{ width: 50, padding: '10px 6px', }}>{t("notification.status")}</th>
                            <th style={{ width: 100, padding: '10px 6px', }}>{t("notification.date")}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((row, index) => (
                            <tr key={index}>
                                <td>
                                    <Typography level="body-sm">{{
                                        "transaction": t("notification.transaction"),
                                        "system": t("notification.system"),
                                        "reminder": t("notification.reminder"),
                                        "message": t("notification.message")
                                    }[row.type]}</Typography>
                                </td>
                                <td>
                                    <Typography level="body-sm">{row.recipient}</Typography>
                                </td>
                                <td>
                                    <Typography level="body-sm">{row.message}</Typography>
                                </td>
                                <td>
                                    <Chip
                                        variant="solid"
                                        size="sm"
                                        color={
                                            {
                                                "sent": "success",
                                                "failed": "danger",
                                                "pending": "neutral"
                                            }[row.status] as ColorPaletteProp
                                        }
                                    >
                                        {{
                                            "sent": t("status.sent"),
                                            "failed": t("status.failed"),
                                            "pending": t("status.pending")
                                        }[row.status]}
                                    </Chip>
                                </td>
                                <td>
                                    <Typography level="body-sm">{formatDate(row.created_at)}</Typography>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </Sheet>
        </React.Fragment>
    );
}


const NotificationPage = ({
    accessToken,

    listStatus,
    listResult,
    listErrorMessage,
}) => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { t } = useTranslation()
    const isDesktop = useMediaQuery("(min-width:600px)");

    // ---- PAGINATION SETTINGS ----- //
    const [listData, setListData] = useState([]);
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [totalAllNotifications, setTotalAllNotifications] = useState(0);
    const [nextPage, setNextPage] = useState(null);
    const [previousPage, setPreviousPage] = useState(null);

    const ITEMS_PER_PAGE = 50
    const pageLength = listData.length > 0 ? Math.ceil(totalAllNotifications / ITEMS_PER_PAGE) : 1

    useEffect(() => {
        if (listStatus === STATUS.SUCCESS) {
            setListData(listResult.results);
            setNextPage(listResult.next);
            setPreviousPage(listResult.previous);
            setTotalAllNotifications(listResult.count);
        }
        else if (listStatus === STATUS.ERROR) {
            toast.error(listErrorMessage);
            dispatch(allNotificationsReset());
        }
    }, [listStatus])

    useEffect(() => {
        const data = {
            'search': search,
        }
        dispatch(allNotificationsRequest(accessToken, data, page))
    }, [page, search])

    // for calender open
    const dateInputRef = useRef<HTMLInputElement | null>(null);

    const handleLabelClick = () => {
        if (dateInputRef.current) {
            dateInputRef.current.showPicker?.(); // Use showPicker if available
            dateInputRef.current.focus();
        }
    };


    const checkLoading = () => {
        if (listStatus === STATUS.LOADING) {
            return true
        }
        else {
            return false
        }
    }


    return (
        <Box>
            <PageTitle title={t("notification.title") + ` (${totalAllNotifications})`} />

            <LoadingView loading={checkLoading()} />

            {/* search */}
            <Sheet
                className="SearchAndFilters"
                sx={{
                    display: 'flex',
                    my: 1,
                    gap: 1,
                    // flexDirection: { xs: 'column', sm: 'row' },
                    alignContent: 'center',
                    // width: { xs: '100%', md: 'auto' },
                    justifyContent: 'flex-start',
                }}
            >
                <Input
                    size="sm"
                    placeholder={t("init.search") + t("notification.date") + "/ " + t("notification.status") + "/ " + t("notification.type")}
                    type='text'
                    defaultValue={search}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    startDecorator={<SearchIcon />}
                    sx={{ width: { xs: '100%', md: '30%' }, textTransform: 'capitalize' }}
                />
                <label htmlFor="calendar" style={{ cursor: "pointer" }} onClick={handleLabelClick}>
                    <CalendarMonthRounded />
                    <input
                        ref={dateInputRef}
                        hidden
                        style={{ position: "absolute", opacity: 0, pointerEvents: "none" }}
                        id="calendar"
                        type="date"
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </label>
            </Sheet>

            {listData.length > 0 ? <>
                {/* ------ render different view depend on plafform -------- */}
                <MobileViewTable data={listData} props={{ edit: null, activate: null }} />
                <DesktopViewTable data={listData} props={{ edit: null, activate: null }} />

                {/* Pagination */}
                {totalAllNotifications > ITEMS_PER_PAGE
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
                            {t('init.page')} {page} of {Math.ceil(totalAllNotifications / ITEMS_PER_PAGE)}
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
        </Box>
    )
}

const mapStateToProps = ({ auth, resources }) => {
    const { accessToken
    } = auth

    const {
        allNotificationsStatus: listStatus,
        allNotificationsResult: listResult,
        allNotificationsErrorMessage: listErrorMessage,
    } = resources

    return {
        accessToken,

        listStatus,
        listResult,
        listErrorMessage
    }
}
export default connect(mapStateToProps, {})(NotificationPage)