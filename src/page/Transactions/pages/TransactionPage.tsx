import React, { useEffect, useRef, useState } from "react";
import { Typography, Box, List, ListItem, ListItemContent, Sheet, Table, iconButtonClasses, Button, IconButton, Input, Chip, ColorPaletteProp } from "@mui/joy";
import { LoadingView, NotFoundMessage, PageTitle } from "../../../components";
import { formatDate, thousandSeparator } from "../../../utils";

import SearchIcon from '@mui/icons-material/Search';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';

import { connect, useDispatch } from "react-redux";
import { useMediaQuery } from "@mui/material";
import { CalendarMonthRounded } from "@mui/icons-material";
import { STATUS } from "../../../constant";
import { toast } from "react-toastify";

import {
    transactionsRequest,
    transactionsReset
} from "../../../store/actions"
import { useTranslation } from "react-i18next";

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
                            <th style={{ width: 70, padding: '10px 6px', }}>{t("transaction.amount")} (Tsh)</th>
                            <th style={{ width: 50, padding: '10px 6px', }}>{t("transaction.status")}</th>
                            <th style={{ width: 70, padding: '10px 6px', }}>{t("transaction.date")}</th>
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
                                    <Typography level="body-sm">{row.card_number}</Typography>
                                </td>
                                <td>
                                    <Typography level="body-sm">{thousandSeparator(row.amount)}</Typography>
                                </td>
                                <td>
                                    <Chip
                                        variant="solid"
                                        size="sm"
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
                                    </Chip>
                                </td>
                                <td>
                                    <Typography level="body-sm">{formatDate(row.transaction_date)}</Typography>
                                </td>
                            </tr>
                        ))}
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
}) => {
    const dispatch = useDispatch()
    const { t } = useTranslation()
    const isDesktop = useMediaQuery("(min-width:600px)");

    // ---- PAGINATION SETTINGS ----- //
    const [listData, setListData] = useState([]);
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [totalTransactions, setTotalTransactions] = useState(0);
    const [nextPage, setNextPage] = useState(null);
    const [previousPage, setPreviousPage] = useState(null);

    const ITEMS_PER_PAGE = 50
    const pageLength = listData.length > 0 ? Math.ceil(totalTransactions / ITEMS_PER_PAGE) : 1

    /* eslint-disable */
    useEffect(() => {
        if (listStatus === STATUS.SUCCESS) {
            setListData(listResult.results);
            setNextPage(listResult.next);
            setPreviousPage(listResult.previous);
            setTotalTransactions(listResult.count);
        }
        else if (listStatus === STATUS.ERROR) {
            toast.error(listErrorMessage);
            dispatch(transactionsReset());
        }
    }, [listStatus])

    useEffect(() => {
        const data = {
            'search': search,
        }
        dispatch(transactionsRequest(accessToken, data, page))
    }, [page, search])
    /* eslint-enable */

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
            <PageTitle title={t("transaction.title")} />

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
                    placeholder={t("init.search") + t("transaction.date") + "/ "+ t("transaction.status")}
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
        </Box>
    )
}

const mapStateToProps = ({ auth, session }) => {
    const { accessToken
    } = auth

    const {
        transactionsStatus: listStatus,
        transactionsResult: listResult,
        transactionsErrorMessage: listErrorMessage,
    } = session

    return {
        accessToken,

        listStatus,
        listResult,
        listErrorMessage
    }
}
export default connect(mapStateToProps, {})(TransactionPage)