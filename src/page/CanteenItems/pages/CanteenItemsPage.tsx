import React, { useEffect, useState } from "react";
import { Typography, Box, List, ListItem, ListItemContent, ListDivider, Sheet, Table, iconButtonClasses, Button, IconButton, Input, ButtonGroup, Dropdown, MenuButton, Menu, Modal, ModalDialog, ModalClose, DialogTitle, DialogContent, FormControl, FormLabel, Stack, ListItemDecorator, Avatar, MenuItem, Divider, Alert, CircularProgress } from "@mui/joy";
import Select from '@mui/joy/Select';
import Option from '@mui/joy/Option';
import { AlertModal, LoadingView, NotFoundMessage, PageTitle } from "../../../components";
import { formatDate, thousandSeparator } from "../../../utils";

import SearchIcon from '@mui/icons-material/Search';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import MoreHorizRoundedIcon from '@mui/icons-material/MoreHorizRounded';

import { connect, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useMediaQuery } from "@mui/material";
import { DeleteOutline, PersonAddOutlined, RemoveRedEyeOutlined, Warning } from "@mui/icons-material";
import { FILE_BASE, STATUS } from "../../../constant";
import { toast } from "react-toastify";

import {
    itemListRequest,
    itemListReset,

    editItemRequest,
    editItemReset,

    createItemRequest,
    createItemReset,

    deleteItemRequest,
    deleteItemReset,
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
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'start',
                        }}
                    >
                        <ListItemContent sx={{ display: 'flex', gap: 2, alignItems: 'start' }}>
                            <div>
                                <Typography fontWeight={600} gutterBottom>{listItem.name}</Typography>
                                <Typography level="body-xs" gutterBottom><b>{t("item.price")}:</b> Tsh.{thousandSeparator(listItem.price)}</Typography>
                            </div>
                        </ListItemContent>
                        <Box sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'flex-end',
                            rowGap: 1
                        }}>
                            <ButtonGroup variant="outlined" size="sm">
                                <Button color="neutral" onClick={() => props.edit(listItem)}>{t("item.edit")}</Button>
                                <Button color="danger" onClick={() => props.delete(listItem)}><DeleteOutline />{t("item.delete")}</Button>
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
                    maxWidth: '600px',
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
                            {/* <th style={{ width: 50, padding: '10px 6px' }}></th> */}
                            <th style={{ width: 70, padding: '10px 6px', }}>{t("item.name")}</th>
                            <th style={{ width: 70, padding: '10px 6px', }}>{t("item.price")} (Tsh)</th>
                            <th style={{ width: 80, padding: '10px 6px', }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((row, index) => (
                            <tr key={index}>
                                <td>
                                    <Typography level="body-sm">{row.name}</Typography>
                                </td>
                                <td>
                                    <Typography level="body-sm">{thousandSeparator(row.price)}</Typography>
                                </td>
                                <td>
                                    <ButtonGroup variant="outlined" size="sm">
                                        <Button title={t("item.edit")} onClick={() => props.edit(row)} color="neutral">{t("item.edit")}</Button>
                                        <Button title={t("item.delete")} onClick={() => props.delete(row)} color="danger">{t("item.delete")}</Button>
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

const ItemPage = ({
    accessToken,

    createStatus,
    createResult,
    createErrorMessage,

    editStatus,
    editResult,
    editErrorMessage,

    deleteStatus,
    deleteResult,
    deleteErrorMessage,

    listStatus,
    listResult,
    listErrorMessage,
}) => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { t } = useTranslation()
    const isDesktop = useMediaQuery("(min-width:600px)");

    const initiateItemData = {
        id: "",
        name: "",
        price: ""
    }

    const [itemData, setItemData] = useState(initiateItemData);

    // ---- PAGINATION SETTINGS ----- //
    const [listData, setListData] = useState([]);
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [totalItem, setTotalItem] = useState(0);
    const [nextPage, setNextPage] = useState(null);
    const [previousPage, setPreviousPage] = useState(null);

    const ITEMS_PER_PAGE = 50
    const pageLength = listData.length > 0 ? Math.ceil(totalItem / ITEMS_PER_PAGE) : 1

    const [formModal, setFormModal] = useState(false)
    const [deleteModal, setDeleteModal] = useState(false)

    useEffect(() => {
        if (listStatus === STATUS.SUCCESS) {
            setListData(listResult.results);
            setNextPage(listResult.next);
            setPreviousPage(listResult.previous);
            setTotalItem(listResult.count);
        }
        else if (listStatus === STATUS.ERROR) {
            toast.error(listErrorMessage);
            dispatch(itemListReset());
        }

        if (createStatus == STATUS.SUCCESS) {
            toast.success(createResult.message);
            setFormModal(false);
            setItemData(initiateItemData);
            dispatch(itemListRequest(accessToken, { "search": search }, page))
            dispatch(createItemReset())
        }
        else if (createStatus === STATUS.ERROR) {
            toast.error(createErrorMessage);
            dispatch(createItemReset())
        }

        if (editStatus == STATUS.SUCCESS) {
            toast.success(editResult.message);
            setFormModal(false);
            setItemData(initiateItemData);
            dispatch(itemListRequest(accessToken, { "search": search }, page))
            dispatch(editItemReset())
        }
        else if (editStatus === STATUS.ERROR) {
            toast.error(editErrorMessage);
            dispatch(editItemReset())
        }

        if (deleteStatus === STATUS.SUCCESS) {
            setDeleteModal(false)
            toast.success(t("status.success"))
            dispatch(itemListRequest(accessToken, { "search": search }, page))
            dispatch(deleteItemReset())
        }
        else if (deleteStatus === STATUS.ERROR) {
            setDeleteModal(false)
            toast.error(deleteErrorMessage)
            dispatch(deleteItemReset())
        }
    }, [listStatus, createStatus, deleteStatus, editStatus])

    useEffect(() => {
        const data = {
            'search': search,
        }
        dispatch(itemListRequest(accessToken, data, page))
    }, [page, search])

    // Handle text, select, and RFID input changes
    const handleChange = (e) => {
        if (!e || !e.target) return;
        const { name, value } = e.target;
        setItemData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    // ---- Submit function
    const handleSubmit = (event) => {
        event.preventDefault()
        if (itemData.name && itemData.price) {
            const data = {
                "name": itemData.name,
                "price": itemData.price
            }
            if (itemData.id) {
                dispatch(editItemRequest(accessToken, { ...data, "item_id": itemData.id }))
            } else {
                dispatch(createItemRequest(accessToken, data))
            }


        } else {
            toast.error(t("init.emptyErr"))
        }
    }

    const [itemItem, setItemItem] = useState({
        id: '',
        name: ''
    })

    // Actions delete
    const deleteItem = (item) => {
        setItemItem({ id: item.id, name: item.name })
        setDeleteModal(true)
    }

    // action edit
    const editItem = (item) => {
        setItemData({ id: item.id, name: item.name, price: item.price })
        setFormModal(true)
    }

    const openAddForm = () => {
        setFormModal(true)
    }

    const checkLoading = () => {
        if (listStatus === STATUS.LOADING || createStatus === STATUS.SUCCESS
            || deleteStatus === STATUS.LOADING || editStatus === STATUS.LOADING) {
            return true
        }
        else {
            return false
        }
    }


    return (
        <Box>
            <PageTitle title={t("item.title") + ` (${totalItem})`} />

            <LoadingView loading={checkLoading()} />

            {/* search */}
            <Sheet
                className="SearchAndFilters"
                sx={{
                    display: 'flex',
                    my: 1,
                    gap: 1,
                    flexDirection: { xs: 'column', sm: 'row' },
                    maxWidth: '600px',
                    // width: { xs: 'auto', md: '30%' },
                    justifyContent: 'space-between',
                }}
            >
                <Button
                    startDecorator={<PersonAddOutlined />}
                    color="success"
                    sx={{ width: 'auto' }}
                    onClick={openAddForm}>
                    {t("item.add")}
                </Button>

                <Input
                    size="sm"
                    placeholder={t("init.search") + "name/price"}
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
                <MobileViewTable data={listData} props={{ edit: editItem, delete: deleteItem }} />
                <DesktopViewTable data={listData} props={{ edit: editItem, delete: deleteItem }} />

                {/* Pagination */}
                {totalItem > ITEMS_PER_PAGE
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
                            {t('init.page')} {page} of {Math.ceil(totalItem / ITEMS_PER_PAGE)}
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

            {/* ----- Delete Modal ---- */}
            <AlertModal
                visibility={deleteModal}
                message={t("alert.deleteMessage", { item: `item ${itemItem.name}` })}
                onClose={() => setDeleteModal(false)}
                onConfirm={() => {
                    dispatch(deleteItemRequest(accessToken, { "item_id": itemItem.id }))
                }}
            />

            {/* ------ Modal form for add item details ------ */}
            <Modal open={formModal} >
                <ModalDialog
                    aria-labelledby="nested-modal-title"
                    aria-describedby="nested-modal-description"
                >
                    <ModalClose variant="outlined" onClick={() => setFormModal(false)} />
                    <DialogTitle>{t("item.add")}</DialogTitle>
                    <DialogContent>{t("init.enterDetails")}</DialogContent>
                    <Stack component='form' onSubmit={handleSubmit} gap={2} sx={{ mt: 2 }}>
                        <Stack direction={{ xs: 'column', md: 'row' }} gap={2}>
                            {/* name */}
                            <FormControl sx={{ flex: 1 }} required>
                                <FormLabel>{t("item.name")}</FormLabel>
                                <Input type="text" name="name" value={itemData.name} onChange={handleChange} placeholder={t("init.placeholder") + t("item.name")} />
                            </FormControl>
                        </Stack>

                        <Stack direction={{ xs: 'column', md: 'row' }} gap={2}>
                            {/* price */}
                            <FormControl sx={{ flex: 1 }} required>
                                <FormLabel>{t("item.price")}</FormLabel>
                                <Input type="number" name="price" value={itemData.price} onChange={handleChange} placeholder={t("init.placeholder") + t("item.price")} />
                            </FormControl>
                        </Stack>

                        <Stack gap={4} sx={{ mt: 2 }}>
                            <Button color="success" type="submit" fullWidth>
                                {(createStatus === STATUS.LOADING || editStatus === STATUS.LOADING) ? t("init.loading") : t("init.submit")}
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
        editItemStatus: editStatus,
        editItemResult: editResult,
        editItemErrorMessage: editErrorMessage,

        createItemStatus: createStatus,
        createItemResult: createResult,
        createItemErrorMessage: createErrorMessage,

        deleteItemStatus: deleteStatus,
        deleteItemResult: deleteResult,
        deleteItemErrorMessage: deleteErrorMessage,

        itemListStatus: listStatus,
        itemListResult: listResult,
        itemListErrorMessage: listErrorMessage,
    } = resources

    return {
        accessToken,

        createStatus,
        createResult,
        createErrorMessage,

        editStatus,
        editResult,
        editErrorMessage,

        deleteStatus,
        deleteResult,
        deleteErrorMessage,

        listStatus,
        listResult,
        listErrorMessage
    }
}
export default connect(mapStateToProps, {})(ItemPage)