import React, { useEffect, useState } from "react";
import { Typography, Box, List, ListItem, ListItemContent, ListDivider, Sheet, Table, Option, iconButtonClasses, Button, IconButton, Input, ButtonGroup, Dropdown, MenuButton, Menu, Modal, ModalDialog, ModalClose, DialogTitle, DialogContent, FormControl, FormLabel, Stack, Chip, ColorPaletteProp, Autocomplete, Select } from "@mui/joy";
import { AlertModal, LoadingView, NotFoundMessage, PageTitle } from "../../../../components";
import { formatDate, thousandSeparator } from "../../../../utils";

import SearchIcon from '@mui/icons-material/Search';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';

import { connect, useDispatch } from "react-redux";
import { useMediaQuery } from "@mui/material";
import { BlockOutlined, EditOutlined, PersonAddOutlined, TaskAltOutlined } from "@mui/icons-material";
import { API_BASE, STATUS } from "../../../../constant";
import { toast } from "react-toastify";

import {
    cardListRequest,
    cardListReset,
    createCardRequest,
    createCardReset,

    editCardRequest,
    editCardReset,

    activateCardRequest,
    activateCardReset,
} from "../../../../store/actions"
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
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'start',
                        }}
                    >
                        <ListItemContent sx={{ display: 'flex', gap: 2, alignItems: 'start' }}>
                            <div>
                                <Typography fontWeight={600} gutterBottom>{listItem.card_number}</Typography>
                                <Typography level="body-xs" gutterBottom><b>{t("card.student")}:</b> {listItem.student_or_staff.first_name + " " + listItem.student_or_staff.last_name}</Typography>
                                <Typography level="body-xs" gutterBottom><b>{t("card.control_number")}:</b> {listItem.control_number}</Typography>
                                <Typography level="body-xs" gutterBottom><b>{t("card.balance")}:</b> Tsh. {thousandSeparator(listItem.balance)}</Typography>
                                <Dropdown>
                                    <MenuButton variant="plain" size="sm">More ...</MenuButton>
                                    <Menu placement="bottom-end" sx={{ p: 1 }}>
                                        <Typography level="body-sm" gutterBottom><b>{t("card.issued")}:</b> {formatDate(listItem.issued_date)}</Typography>
                                        <Typography level="body-sm" gutterBottom><b>{t("card.created")}:</b> {formatDate(listItem.created_at)}</Typography>
                                    </Menu>
                                </Dropdown>
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
                                        true: 'success',
                                        false: 'danger',
                                    }[listItem.is_active] as ColorPaletteProp
                                }
                            >
                                {{
                                    true: t("card.active"),
                                    false: t("card.inactive")
                                }[listItem.is_active]}
                            </Chip>
                            <ButtonGroup variant="outlined" size="sm">
                                <Button color="neutral" onClick={() => props.edit(listItem)}><EditOutlined /></Button>
                                <Button color="warning" onClick={() => props.activate(listItem)}>{listItem.is_active ? <BlockOutlined /> : <TaskAltOutlined />}</Button>
                            </ButtonGroup>
                        </Box>

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
                            <th style={{ width: 70, padding: '10px 6px' }}>{t("card.card_number")}</th>
                            <th style={{ width: 100, padding: '10px 6px', }}>{t("card.student")}</th>
                            <th style={{ width: 70, padding: '10px 6px', }}>{t("card.control_number")}</th>
                            <th style={{ width: 70, padding: '10px 6px', }}>{t("card.balance")} (Tsh)</th>
                            <th style={{ width: 70, padding: '10px 6px', }}>{t("card.issued")}</th>
                            <th style={{ width: 50, padding: '10px 6px', }}>{t("card.status")}</th>
                            <th style={{ width: 70, padding: '10px 6px', }}>{t("card.created")}</th>
                            <th style={{ width: 80, padding: '10px 6px', }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((row, index) => (
                            <tr key={index}>
                                <td>
                                    <Typography level="body-sm">{row.card_number}</Typography>
                                </td>
                                <td>
                                    <Typography level="body-sm">{row.student_or_staff.first_name + " " + row.student_or_staff.last_name}</Typography>
                                </td>
                                <td>
                                    <Typography level="body-sm">{row.control_number}</Typography>
                                </td>
                                <td>
                                    <Typography level="body-sm">{thousandSeparator(row.balance)}</Typography>
                                </td>
                                <td>
                                    <Typography level="body-sm">{formatDate(row.issued_date)}</Typography>
                                </td>
                                <td>
                                    <Chip
                                        variant="solid"
                                        size="sm"
                                        color={
                                            {
                                                true: 'success',
                                                false: 'danger',
                                            }[row.is_active] as ColorPaletteProp
                                        }
                                    >
                                        {{
                                            true: t("card.active"),
                                            false: t("card.inactive")
                                        }[row.is_active]}
                                    </Chip>
                                </td>
                                <td>
                                    <Typography level="body-sm">{formatDate(row.created_at)}</Typography>
                                </td>
                                <td>
                                    <ButtonGroup variant="outlined" size="sm">
                                        <Button color="neutral" onClick={() => props.edit(row)}><EditOutlined /></Button>
                                        <Button color="warning" onClick={() => props.activate(row)}>{row.is_active ? t("card.deactivate") : t("card.activate")}</Button>
                                    </ButtonGroup>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </Sheet>
        </React.Fragment>
    );
}

const CardPage = ({
    accessToken,

    createStatus,
    createResult,
    createErrorMessage,

    editStatus,
    editResult,
    editErrorMessage,

    activateStatus,
    activateResult,
    activateErrorMessage,

    listStatus,
    listResult,
    listErrorMessage,
}) => {
    const dispatch = useDispatch()
    const { t } = useTranslation()
    const isDesktop = useMediaQuery("(min-width:600px)");

    const initiateCardData = {
        card_id: "",
        card_number: "",
        student: null,
        balance: 0.0,
        issued_date: null,
        school_number: ''
    }

    const [cardData, setCardData] = useState(initiateCardData);
    const [studentList, setStudentList] = useState([]);
    const [schoolList, setSchoolList] = useState([]);

    // function to fetch student data to fetch student data
    useEffect(() => {
        axios.get(API_BASE + "/list/students", {
            timeout: 30000,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + accessToken,

            }
        }).then((res) => setStudentList(res.data.results)).catch((e) => console.error(e))

        axios.get(API_BASE + "/list/schools", {
            timeout: 30000,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + accessToken,

            }
        }).then((res) => setSchoolList(res.data.results)).catch((e) => console.error(e))
    }, [accessToken])

    // ---- PAGINATION SETTINGS ----- //
    const [listData, setListData] = useState([]);
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [totalCard, setTotalCard] = useState(0);
    const [nextPage, setNextPage] = useState(null);
    const [previousPage, setPreviousPage] = useState(null);

    const ITEMS_PER_PAGE = 50
    const pageLength = listData.length > 0 ? Math.ceil(totalCard / ITEMS_PER_PAGE) : 1

    const [formModal, setFormModal] = useState(false)
    const [activateModal, setActivateModal] = useState(false)

    /* eslint-disable */
    useEffect(() => {
        if (listStatus === STATUS.SUCCESS) {
            setListData(listResult.results);
            setNextPage(listResult.next);
            setPreviousPage(listResult.previous);
            setTotalCard(listResult.count);
        }
        else if (listStatus === STATUS.ERROR) {
            toast.error(listErrorMessage);
            dispatch(cardListReset());
        }

        if (createStatus === STATUS.SUCCESS) {
            toast.success(createResult.message);
            setFormModal(false);
            setCardData(initiateCardData);
            dispatch(cardListRequest(accessToken, { "search": search }, page))
            dispatch(createCardReset())
        }
        else if (createStatus === STATUS.ERROR) {
            toast.error(createErrorMessage);
            dispatch(createCardReset())
        }

        if (editStatus === STATUS.SUCCESS) {
            toast.success(editResult.message);
            setFormModal(false);
            setCardData(initiateCardData);
            dispatch(cardListRequest(accessToken, { "search": search }, page))
            dispatch(editCardReset())
        }
        else if (editStatus === STATUS.ERROR) {
            toast.error(editErrorMessage);
            dispatch(editCardReset())
        }

        if (activateStatus === STATUS.SUCCESS) {
            setActivateModal(false)
            toast.success(t("status.success"))
            dispatch(cardListRequest(accessToken, { "search": search }, page))
            dispatch(activateCardReset())
        }
        else if (activateStatus === STATUS.ERROR) {
            setActivateModal(false)
            toast.error(activateErrorMessage)
            dispatch(activateCardReset())
        }
    }, [listStatus, createStatus, activateStatus, editStatus]) // eslint-disable-next-line

    useEffect(() => {
        const data = {
            'search': search,
        }
        dispatch(cardListRequest(accessToken, data, page))
    }, [page, search])
    /* eslint-enable */

    // Handle text, select, and RFID input changes
    const handleChange = (e) => {
        if (!e || !e.target) return;
        const { name, value } = e.target;
        setCardData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    // ---- Submit function
    const handleSubmit = (event) => {
        event.preventDefault()
        if (cardData.card_number && cardData.student) {
            const data = {
                "card_number": cardData.card_number,
                "student_or_staff": cardData.student.id,
                "issued_date": cardData.issued_date,
                "balance": cardData.balance,
                "school_number": cardData.school_number
            }
            if (cardData.card_id) {
                dispatch(editCardRequest(accessToken, { ...data, "card_id": cardData.card_id }))
            } else {
                dispatch(createCardRequest(accessToken, data))
            }

        } else {
            toast.error(t("init.emptyErr"))
        }
    }

    const [cardItem, setCardItem] = useState({
        id: '',
        card_number: '',
        status: false
    })
    // Actions
    const activateCard = (item) => {
        setCardItem({ id: item.id, card_number: item.card_number, status: item.is_active })
        setActivateModal(true)
    }

    const openAddForm = () => {
        setFormModal(true)
    }

    const editCard = (item) => {
        setCardData({
            card_id: item.id,
            card_number: item.card_number,
            student: item.student_or_staff,
            balance: item.balance,
            issued_date: item.issued_date,
            school_number: item.school_number
        })

        setFormModal(true)
    }

    const checkLoading = () => {
        if (listStatus === STATUS.LOADING ||
            createStatus === STATUS.SUCCESS ||
            activateStatus === STATUS.LOADING ||
            editStatus === STATUS.LOADING) {
            return true
        }
        else {
            return false
        }
    }


    return (
        <Box>
            <PageTitle title={t("card.title") + ` (${totalCard})`} />

            <LoadingView loading={checkLoading()} />

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
                <Button
                    startDecorator={<PersonAddOutlined />}
                    color="success"
                    sx={{ width: 'auto' }}
                    onClick={openAddForm}>
                    {t("card.add")}
                </Button>

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

            {listData.length > 0 ? <>
                {/* ------ render different view depend on plafform -------- */}
                <MobileViewTable data={listData} props={{ edit: editCard, activate: activateCard }} />
                <DesktopViewTable data={listData} props={{ edit: editCard, activate: activateCard }} />

                {/* Pagination */}
                {totalCard > ITEMS_PER_PAGE
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
                            {t('init.page')} {page} of {Math.ceil(totalCard / ITEMS_PER_PAGE)}
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

            {/* ----- Activate Modal ---- */}
            <AlertModal
                visibility={activateModal}
                message={t("alert.activateMessage", { item: `card ${cardItem.card_number}`, action: cardItem.status ? t("card.deactivate") : t("card.activate") })}
                onClose={() => setActivateModal(false)}
                onConfirm={() => {
                    const data = {
                        "card_id": cardItem.id,
                        "action": cardItem.status ? "deactivate" : "activate"
                    }
                    dispatch(activateCardRequest(accessToken, data))
                }}
            />

            {/* ------ Modal form for add card details ------ */}
            <Modal open={formModal} >
                <ModalDialog
                    aria-labelledby="nested-modal-title"
                    aria-describedby="nested-modal-description"
                >
                    <ModalClose variant="outlined" onClick={() => setFormModal(false)} />
                    <DialogTitle>{t("card.add")}</DialogTitle>
                    <DialogContent>{t("init.enterDetails")}</DialogContent>
                    <Stack component='form' onSubmit={handleSubmit} gap={2} sx={{ mt: 2 }}>
                        <Stack direction={{ xs: 'column', md: 'row' }} gap={2}>
                            {/* card number */}
                            <FormControl sx={{ flex: 1 }} required>
                                <FormLabel>{t("card.card_number")}</FormLabel>
                                <Input type="number" name="card_number" value={cardData.card_number} onChange={handleChange} placeholder={t("init.placeholder") + t("card.card_number")} />
                            </FormControl>

                            {/* studentr */}
                            <FormControl sx={{ flex: 1 }} required>
                                <FormLabel>{t("card.student")}</FormLabel>
                                <Autocomplete
                                    options={studentList}
                                    value={cardData.student}
                                    defaultValue={cardData.student}
                                    getOptionLabel={(option) => `${option.first_name} ${option.last_name}`}
                                    onChange={(e, value) => setCardData({ ...cardData, student: value })}
                                    placeholder={t("init.select") + t("card.student")}
                                />
                            </FormControl>
                        </Stack>

                        <Stack direction={{ xs: 'column', md: 'row' }} gap={2}>
                            {/* school name */}
                            <FormControl sx={{ flex: 1 }} required>
                                <FormLabel>{t("student.schoolName")}</FormLabel>
                                <Select name="school" defaultValue={cardData.school_number} value={cardData.school_number}
                                    placeholder={t("init.select") + t("student.schoolName")}
                                    onChange={(e, value) => setCardData({ ...cardData, school_number: value })}>
                                    {schoolList.length > 0 ? schoolList.map((item, index) => (
                                        <Option key={index} value={item.number}>{item.name}</Option>
                                    )) : <Option value={null}>{t("school.NoList")}</Option>}
                                </Select>
                            </FormControl>
                        </Stack>


                        <Stack direction={{ xs: 'column', md: 'row' }} gap={2}>
                            {/* balance */}
                            <FormControl sx={{ flex: 1 }}>
                                <FormLabel>{t("card.balance")}</FormLabel>
                                <Input type="number" name="balance" value={cardData.balance} onChange={handleChange} placeholder={t("init.placeholder") + t("card.balance")} />
                            </FormControl>

                            {/* issued date */}
                            <FormControl sx={{ flex: 1 }}>
                                <FormLabel>{t("card.issued")}</FormLabel>
                                <Input type="datetime-local" name="issued_date" value={cardData.issued_date} onChange={handleChange} placeholder={t("init.placeholder") + t("card.issued")} />
                            </FormControl>
                        </Stack>

                        <Stack gap={4} sx={{ mt: 2 }}>
                            <Button color="success" type="submit" fullWidth>
                                {createStatus === STATUS.LOADING ? t("init.loading") : t("init.submit")}
                            </Button>
                        </Stack>
                    </Stack>
                </ModalDialog>
            </Modal>
        </Box>
    )
}

const mapStateToProps = ({ auth, resources }) => {
    const { accessToken
    } = auth

    const {

        createCardStatus: createStatus,
        createCardResult: createResult,
        createCardErrorMessage: createErrorMessage,

        activateCardStatus: activateStatus,
        activateCardResult: activateResult,
        activateCardErrorMessage: activateErrorMessage,

        cardListStatus: listStatus,
        cardListResult: listResult,
        cardListErrorMessage: listErrorMessage,

        editCardStatus: editStatus,
        editCardResult: editResult,
        editCardErrorMessage: editErrorMessage
    } = resources

    return {
        accessToken,

        createStatus,
        createResult,
        createErrorMessage,

        editStatus,
        editResult,
        editErrorMessage,

        activateStatus,
        activateResult,
        activateErrorMessage,

        listStatus,
        listResult,
        listErrorMessage
    }
}
export default connect(mapStateToProps, {})(CardPage)