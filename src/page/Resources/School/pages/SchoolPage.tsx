import React, { useEffect, useState } from "react";
import { Typography, Box, List, ListItem, ListItemContent, ListDivider, Sheet, Table, iconButtonClasses, Button, IconButton, Input, ButtonGroup, Modal, ModalDialog, ModalClose, DialogTitle, DialogContent, FormControl, FormLabel, Stack } from "@mui/joy";
import { AlertModal, LoadingView, NotFoundMessage, PageTitle } from "../../../../components";

import SearchIcon from '@mui/icons-material/Search';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';

import { connect, useDispatch } from "react-redux";
import { useMediaQuery } from "@mui/material";
import { DeleteOutline, PersonAddOutlined } from "@mui/icons-material";
import { STATUS } from "../../../../constant";
import { toast } from "react-toastify";

import {
    schoolListRequest,
    schoolListReset,
    createSchoolRequest,
    createSchoolReset,
    deleteSchoolRequest,
    deleteSchoolReset,
} from "../../../../store/actions"
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
                                <Typography level="body-xs" gutterBottom><b>{t("school.location")}:</b> {listItem.location}</Typography>
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
                                {/* <Button color="neutral" onClick={() => null}>{t("school.edit")}</Button> */}
                                <Button color="danger" onClick={() => props.delete(listItem)}><DeleteOutline />{t("school.delete")}</Button>
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
                            <th style={{ width: 70, padding: '10px 6px', }}>{t("school.name")}</th>
                            <th style={{ width: 70, padding: '10px 6px', }}>{t("school.location")}</th>
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
                                    <Typography level="body-sm">{row.location}</Typography>
                                </td>
                                <td>
                                    <ButtonGroup variant="outlined" size="sm">
                                        {/* <Button title={t("school.view")} color="neutral">{t("school.edit")}</Button> */}
                                        <Button title={t("school.delete")} onClick={() => props.delete(row)} color="danger">{t("school.delete")}</Button>
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

const SchoolPage = ({
    accessToken,

    createStatus,
    createResult,
    createErrorMessage,

    deleteStatus,
    deleteResult,
    deleteErrorMessage,

    listStatus,
    listResult,
    listErrorMessage,
}) => {
    const dispatch = useDispatch()
    const { t } = useTranslation()
    const isDesktop = useMediaQuery("(min-width:600px)");

    const initiateSchoolData = {
        name: "",
        location: ""
    }

    const [schoolData, setSchoolData] = useState(initiateSchoolData);

    // ---- PAGINATION SETTINGS ----- //
    const [listData, setListData] = useState([]);
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [totalSchool, setTotalSchool] = useState(0);
    const [nextPage, setNextPage] = useState(null);
    const [previousPage, setPreviousPage] = useState(null);

    const ITEMS_PER_PAGE = 50
    const pageLength = listData.length > 0 ? Math.ceil(totalSchool / ITEMS_PER_PAGE) : 1

    const [formModal, setFormModal] = useState(false)
    const [deleteModal, setDeleteModal] = useState(false)

    /* eslint-disable */
    useEffect(() => {
        if (listStatus === STATUS.SUCCESS) {
            setListData(listResult.results);
            setNextPage(listResult.next);
            setPreviousPage(listResult.previous);
            setTotalSchool(listResult.count);
        }
        else if (listStatus === STATUS.ERROR) {
            toast.error(listErrorMessage);
            dispatch(schoolListReset());
        }

        if (createStatus === STATUS.SUCCESS) {
            toast.success(createResult.message);
            setFormModal(false);
            setSchoolData(initiateSchoolData);
            dispatch(schoolListRequest(accessToken, { "search": search }, page))
            dispatch(createSchoolReset())
        }
        else if (createStatus === STATUS.ERROR) {
            toast.error(createErrorMessage);
            dispatch(createSchoolReset())
        }

        if (deleteStatus === STATUS.SUCCESS){
            setDeleteModal(false)
            toast.success(t("status.success"))
            dispatch(schoolListRequest(accessToken, { "search": search }, page))
            dispatch(deleteSchoolReset())
        }
        else if (deleteStatus === STATUS.ERROR){
            setDeleteModal(false)
            toast.error(deleteErrorMessage)
            dispatch(deleteSchoolReset())
        }
    }, [listStatus, createStatus, deleteStatus])

    useEffect(() => {
        const data = {
            'search': search,
        }
        dispatch(schoolListRequest(accessToken, data, page))
    }, [page, search])
    /* eslint-enable */

    // Handle text, select, and RFID input changes
    const handleChange = (e) => {
        if (!e || !e.target) return;
        const { name, value } = e.target;
        setSchoolData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    // ---- Submit function
    const handleSubmit = (event) => {
        event.preventDefault()
        if (schoolData.name && schoolData.location) {
            const data = {
                "name": schoolData.name,
                "location": schoolData.location
            }
            dispatch(createSchoolRequest(accessToken, data))
        } else {
            toast.error(t("init.emptyErr"))
        }
    }

    const [schoolItem, setSchoolItem] = useState({
        id: '',
        name: ''
    })
    // Actions
    const deleteSchool = (item) => {
        setSchoolItem({id: item.id, name: item.name})
        setDeleteModal(true)
    }

    const openAddForm = () => {
        setFormModal(true)
    }

    const checkLoading = () => {
        if (listStatus === STATUS.LOADING || createStatus === STATUS.SUCCESS || deleteStatus === STATUS.LOADING) {
            return true
        }
        else {
            return false
        }
    }


    return (
        <Box>
            <PageTitle title={t("school.title") + ` (${totalSchool})`} />

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
                    maxWidth: '600px',
                    justifyContent: 'space-between',
                }}
            >
                <Button
                    startDecorator={<PersonAddOutlined />}
                    color="success"
                    sx={{ width: 'auto' }}
                    onClick={openAddForm}>
                    {t("school.add")}
                </Button>

                <Input
                    size="sm"
                    placeholder={t("init.search") + "name/ location"}
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
                <MobileViewTable data={listData} props={{ view: null, delete: deleteSchool }} />
                <DesktopViewTable data={listData} props={{ view: null, delete: deleteSchool }} />

                {/* Pagination */}
                {totalSchool > ITEMS_PER_PAGE
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
                            {t('init.page')} {page} of {Math.ceil(totalSchool / ITEMS_PER_PAGE)}
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
                message={t("alert.deleteMessage", { item: `school ${schoolItem.name}` })}
                onClose={() => setDeleteModal(false)}
                onConfirm={() => {
                    dispatch(deleteSchoolRequest(accessToken, { "school_id": schoolItem.id }))
                }}
            />

            {/* ------ Modal form for add school details ------ */}
            <Modal open={formModal} >
                <ModalDialog
                    aria-labelledby="nested-modal-title"
                    aria-describedby="nested-modal-description"
                   >
                    <ModalClose variant="outlined" onClick={() => setFormModal(false)} />
                    <DialogTitle>{t("school.add")}</DialogTitle>
                    <DialogContent>{t("init.enterDetails")}</DialogContent>
                    <Stack component='form' onSubmit={handleSubmit} gap={2} sx={{ mt: 2 }}>
                        <Stack direction={{ xs: 'column', md: 'row' }} gap={2}>
                            {/* name */}
                            <FormControl sx={{ flex: 1 }} required>
                                <FormLabel>{t("school.name")}</FormLabel>
                                <Input type="text" name="name" value={schoolData.name} onChange={handleChange} placeholder={t("init.placeholder") + t("school.name")} />
                            </FormControl>
                        </Stack>

                        <Stack direction={{ xs: 'column', md: 'row' }} gap={2}>
                            {/* location */}
                            <FormControl sx={{ flex: 1 }} required>
                                <FormLabel>{t("school.location")}</FormLabel>
                                <Input type="text" name="location" value={schoolData.location} onChange={handleChange} placeholder={t("init.placeholder") + t("school.location")} />
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

        createSchoolStatus: createStatus,
        createSchoolResult: createResult,
        createSchoolErrorMessage: createErrorMessage,

        deleteSchoolStatus: deleteStatus,
        deleteSchoolResult: deleteResult,
        deleteSchoolErrorMessage: deleteErrorMessage,

        schoolListStatus: listStatus,
        schoolListResult: listResult,
        schoolListErrorMessage: listErrorMessage,
    } = resources

    return {
        accessToken,

        createStatus,
        createResult,
        createErrorMessage,

        deleteStatus,
        deleteResult,
        deleteErrorMessage,

        listStatus,
        listResult,
        listErrorMessage
    }
}
export default connect(mapStateToProps, {})(SchoolPage)