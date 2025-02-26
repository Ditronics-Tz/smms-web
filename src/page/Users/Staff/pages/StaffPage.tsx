import React, { useEffect, useState } from "react";
import { Typography, Box, List, ListItem, ListItemContent, ListDivider, Sheet, Table, iconButtonClasses, Button, IconButton, Input, ButtonGroup, Dropdown, MenuButton, Menu, Modal, ModalDialog, ModalClose, DialogTitle, DialogContent, FormControl, FormLabel, Stack, ListItemDecorator, Avatar, Autocomplete } from "@mui/joy";
import Select from '@mui/joy/Select';
import Option from '@mui/joy/Option';
import { LoadingView, NotFoundMessage, PageTitle } from "../../../../components";
import { formatDate } from "../../../../utils";
import classList from '../../../../assets/data/classess.json'

import SearchIcon from '@mui/icons-material/Search';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';

import { connect, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useMediaQuery } from "@mui/material";
import { DeleteOutline, PersonAddOutlined, RemoveRedEyeOutlined } from "@mui/icons-material";
import { API_BASE, FILE_BASE, STATUS } from "../../../../constant";
import { toast } from "react-toastify";

import {
    userListRequest,
    userListReset,
    createUserRequest,
    createUserReset,
} from "../../../../store/actions"
import { useTranslation } from "react-i18next";
import { NAVIGATE_TO_STAFFDETAILSPAGE } from "../../../../route/types";
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
                            <ListItemDecorator>
                                <Avatar size="sm" src={FILE_BASE + listItem.profile_picture} />
                            </ListItemDecorator>
                            <div>
                                <Typography fontWeight={600} gutterBottom>{listItem.first_name + " " + listItem.middle_name + " " + listItem.last_name}</Typography>
                                <Typography level="body-xs" gutterBottom><b>{t("staff.gender")}:</b> {{ 'M': t("staff.male"), 'F': t("staff.female") }[listItem.gender]}</Typography>
                                <Typography level="body-xs" gutterBottom><b>{t("staff.username")}:</b> {listItem.username}</Typography>
                                <Dropdown>
                                    <MenuButton variant="plain" size="sm">More ...</MenuButton>
                                    <Menu placement="bottom-end" sx={{ p: 1 }}>
                                    <Typography level="body-xs" gutterBottom><b>{t("staff.email")}:</b> {listItem.email}</Typography>
                                    <Typography level="body-xs" gutterBottom><b>{t("staff.mobile")}:</b> {listItem.mobile_number}</Typography>
                                    <Typography level="body-xs" gutterBottom><b>{t("staff.schoolName")}:</b> {listItem.school || ""}</Typography>
                                    <Typography level="body-xs" gutterBottom><b>{t("staff.joined")}:</b> {formatDate(listItem.date_joined)}</Typography>
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
                            <ButtonGroup variant="soft" size="sm">
                                <Button color="primary" onClick={() => props.view(listItem)}><RemoveRedEyeOutlined /></Button>
                                <Button color="danger"><DeleteOutline /></Button>
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
                    // width: '100%',
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
                            bgcolor: 'var(--TableCell-headBackground)',
                        },
                    }}
                >
                    <thead>
                        <tr style={{ textAlign: 'center' }}>
                            <th style={{ width: 40, padding: '10px 6px' }}></th>
                            <th style={{ width: 70, padding: '10px 6px', }}>{t("staff.firstName")}</th>
                            <th style={{ width: 70, padding: '10px 6px', }}>{t("staff.middleName")}</th>
                            <th style={{ width: 70, padding: '10px 6px', }}>{t("staff.lastName")}</th>
                            <th style={{ width: 60, padding: '10px 6px', }}>{t("staff.username")}</th>
                            <th style={{ width: 40, padding: '10px 6px', }}>{t("staff.gender")}</th>
                            <th style={{ width: 90, padding: '10px 6px', }}>{t("staff.email")}</th>
                            <th style={{ width: 80, padding: '10px 6px', }}>{t("staff.mobile")}</th>
                            <th style={{ width: 120, padding: '10px 6px', }}>{t("staff.schoolName")}</th>
                            <th style={{ width: 120, padding: '10px 6px', }}>{t("staff.joined")}</th>
                            <th aria-label="last" style={{ width: 100, padding: '10px 6px', }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((row, index) => (
                            <tr key={index}>
                                <td>
                                    <Avatar size="sm" src={FILE_BASE + row.profile_picture} />
                                </td>
                                <td>
                                    <Typography level="body-sm">{row.first_name}</Typography>
                                </td>
                                <td>
                                    <Typography level="body-sm">{row.middle_name}</Typography>
                                </td>
                                <td>
                                    <Typography level="body-xs">{row.last_name}</Typography>
                                </td>
                                <td>
                                    <Typography level="body-xs">{row.username}</Typography>
                                </td>
                                <td>
                                    <Typography level="body-sm">{{ 'M': t("staff.male"), 'F': t("staff.female") }[row.gender]}</Typography>
                                </td>
                                <td>
                                    <Typography level="body-xs">{row.email}</Typography>
                                </td>
                                <td>
                                    <Typography level="body-xs">{row.mobile_number}</Typography>
                                </td>
                                <td>
                                    <Typography level="body-sm">{row.school || ""}</Typography>
                                </td>
                                <td>
                                    <Typography level="body-sm">{formatDate(row.date_joined)}</Typography>
                                </td>
                                <td>
                                    <ButtonGroup variant="solid" size="sm">
                                        <Button title={t("staff.view")} color="primary" onClick={() => props.view(row)}><RemoveRedEyeOutlined /></Button>
                                        {/* <Button title="Delete" color="danger"><DeleteOutline /></Button> */}
                                        <Button title={t("staff.delete")} color="danger"><DeleteOutline /></Button>
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

const StaffPage = ({
    accessToken,

    createStatus,
    createResult,
    createErrorMessage,

    listStatus,
    listResult,
    listErrorMessage,
}) => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { t } = useTranslation()
    const isDesktop = useMediaQuery("(min-width:600px)");

    const initiatestaffData = {
        staff_id: "",
        first_name: "",
        middle_name: "",
        last_name: "",
        username: "",
        email: "",
        mobile: "",
        gender: "",
        class_room: "",
        school: "",
        profile_picture: null
    }

    const [staffData, setstaffData] = useState(initiatestaffData);
    const [schoolList, setSchoolList] = useState([])

    // function to fetch parents data to fetch staff data
    /* eslint-disable */
    useEffect(() => {
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
    const [totalstaff, setTotalstaff] = useState(0);
    const [nextPage, setNextPage] = useState(null);
    const [previousPage, setPreviousPage] = useState(null);

    const ITEMS_PER_PAGE = 50
    const pageLength = listData.length > 0 ? Math.ceil(totalstaff / ITEMS_PER_PAGE) : 1

    const [formModal, setFormModal] = useState(false)

    useEffect(() => {
        if (listStatus === STATUS.SUCCESS) {
            setListData(listResult.results);
            setNextPage(listResult.next);
            setPreviousPage(listResult.previous);
            setTotalstaff(listResult.count);
        }
        else if (listStatus === STATUS.ERROR) {
            toast.error(listErrorMessage);
            dispatch(userListReset());
        }

        if (createStatus === STATUS.SUCCESS) {
            toast.success(createResult.message);
            setFormModal(false);
            setstaffData(initiatestaffData);
            dispatch(userListRequest(accessToken, { "search": search, "role": "staff" }, page))
            dispatch(createUserReset())
        }
        else if (createStatus === STATUS.ERROR) {
            toast.error(createErrorMessage);
            dispatch(createUserReset())
        }
    }, [listStatus, createStatus])

    useEffect(() => {
        const data = {
            'search': search,
            'role': 'staff'
        }
        dispatch(userListRequest(accessToken, data, page))
    }, [page, search])
    /* eslint-enable */

    // Handle text, select, and RFID input changes
    const handleChange = (e) => {
        if (!e || !e.target) return;
        const { name, value } = e.target;
        setstaffData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    // Handle file input change
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setstaffData((prevData) => ({
            ...prevData,
            profile_picture: file,
        }));
    };

    // ---- Submit function
    const handleSubmit = (event) => {
        event.preventDefault()
        if (staffData.first_name) {
            const formData = new FormData();

            formData.append("first_name", staffData.first_name);
            formData.append("middle_name", staffData.middle_name);
            formData.append("last_name", staffData.last_name);
            formData.append("username", staffData.username);
            formData.append("email", staffData.email);
            formData.append("mobile_number", staffData.mobile);
            formData.append("gender", staffData.gender);
            formData.append("class_room", staffData.class_room);
            formData.append("school", staffData.school);
            formData.append("role", "staff");

            // Append file only if selected
            if (staffData.profile_picture) {
                formData.append("profile_picture", staffData.profile_picture);
            }

            dispatch(createUserRequest(accessToken, formData))
        } else {
            toast.error(t("init.emptyErr"))
        }
    }

    /* -------- actions ----------- */
    const viewstaffDetails = (details) => {
        navigate(NAVIGATE_TO_STAFFDETAILSPAGE, {
            state: {
                id: details.id
            }
        })
    }

    const openAddForm = () => {
        setFormModal(true)
    }

    const checkLoading = () => {
        if (listStatus === STATUS.LOADING || createStatus === STATUS.SUCCESS) {
            return true
        }
        else {
            return false
        }
    }


    return (
        <Box>
            <PageTitle title={t("staff.title") + ` (${totalstaff})`} />

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
                    {t("staff.add")}
                </Button>

                <Input
                    size="sm"
                    placeholder={t("init.search") + "name"}
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
                <MobileViewTable data={listData} props={{ view: viewstaffDetails, delete: null }} />
                <DesktopViewTable data={listData} props={{ view: viewstaffDetails, delete: null }} />

                {/* Pagination */}
                {totalstaff > ITEMS_PER_PAGE
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
                            {t('init.page')} {page} of {Math.ceil(totalstaff / ITEMS_PER_PAGE)}
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

            {/* ------ Modal form for add user details ------ */}
            <Modal open={formModal} >
                <ModalDialog
                    aria-labelledby="nested-modal-title"
                    aria-describedby="nested-modal-description"
                    sx={(theme) => ({
                        [theme.breakpoints.only('xs')]: {
                            top: '60px',
                            bottom: 0,
                            left: 0,
                            right: 0,
                            // borderRadius: 0,
                            borderTopLeftRadius: 20,
                            borderTopRightRadius: 20,
                            transform: 'none',
                            maxWidth: 'unset',
                            overflow: 'auto'
                        },
                    })}>
                    <ModalClose variant="outlined" onClick={() => setFormModal(false)} />
                    <DialogTitle>{t("staff.add")}</DialogTitle>
                    <DialogContent>{t("init.enterDetails")}</DialogContent>
                    <Stack component='form' onSubmit={handleSubmit} gap={2} sx={{ mt: 2 }}>
                        <Stack direction={{ xs: 'column', md: 'row' }} gap={2}>
                            {/* first name */}
                            <FormControl sx={{ flex: 1 }} required>
                                <FormLabel>{t("staff.firstName")}</FormLabel>
                                <Input type="text" name="first_name" value={staffData.first_name} onChange={handleChange} placeholder={t("init.placeholder") + t("staff.firstName")} />
                            </FormControl>

                            {/* second name */}
                            <FormControl sx={{ flex: 1 }} required>
                                <FormLabel>{t("staff.middleName")}</FormLabel>
                                <Input type="text" name="middle_name" value={staffData.middle_name} onChange={handleChange} placeholder={t("init.placeholder") + t("staff.middleName")} />
                            </FormControl>

                            {/* last name */}
                            <FormControl sx={{ flex: 1 }} required>
                                <FormLabel>{t("staff.lastName")}</FormLabel>
                                <Input type="text" name="last_name" value={staffData.last_name} onChange={handleChange} placeholder={t("init.placeholder") + t("staff.lastName")} />
                            </FormControl>
                        </Stack>

                        <Stack direction={{ xs: 'column', md: 'row' }} gap={2}>
                            {/* username */}
                            <FormControl sx={{ flex: 1 }} required>
                                <FormLabel>{t("staff.username")}</FormLabel>
                                <Input type="text" name="username" value={staffData.username} onChange={handleChange} placeholder={t("init.placeholder") + t("staff.username")} />
                            </FormControl>

                            {/* email */}
                            <FormControl sx={{ flex: 1 }} required>
                                <FormLabel>{t("staff.email")}</FormLabel>
                                <Input type="email" name="email" value={staffData.email} onChange={handleChange} placeholder={t("init.placeholder") + t("staff.email")} />
                            </FormControl>

                            {/* last name */}
                            <FormControl sx={{ flex: 1 }} required>
                                <FormLabel>{t("staff.mobile")}</FormLabel>
                                <Input type="tel" name="mobile" value={staffData.mobile} onChange={handleChange} placeholder={t("init.placeholder") + t("staff.mobile")} />
                            </FormControl>
                        </Stack>

                        <Stack direction={{ xs: 'column', md: 'row' }} gap={2}>
                            {/* gender */}
                            <FormControl sx={{ flex: 1 }} required>
                                <FormLabel>{t("staff.gender")}</FormLabel>
                                <Select name="gender" defaultValue={staffData.gender} value={staffData.gender}
                                    placeholder={t("init.select") + t("staff.gender")}
                                    onChange={(e, value) => setstaffData({ ...staffData, gender: value })}>
                                    {[{ value: 'M', label: t("staff.male") }, { value: 'F', label: t("staff.female") }].map((item, index) => (
                                        <Option key={index} value={item.value}>{item.label}</Option>
                                    ))}
                                </Select>
                            </FormControl>

                            {/* school name */}
                            <FormControl sx={{ flex: 1 }} required>
                                <FormLabel>{t("staff.schoolName")}</FormLabel>
                                <Select name="school" defaultValue={staffData.school} value={staffData.school}
                                    placeholder={t("init.select") + t("staff.schoolName")}
                                    onChange={(e, value) => setstaffData({ ...staffData, school: value })}>
                                    {schoolList.length > 0  ? schoolList.map((item, index) => (
                                        <Option key={index} value={item.id}>{item.name}</Option>
                                    )) : <Option value={null}>{t("school.NoList")}</Option>}
                                </Select>
                            </FormControl>
                        </Stack>

                        <Stack direction={{ xs: 'column', md: 'row' }} gap={2}>
                            {/* picture */}
                            <FormControl sx={{ flex: 1 }}>
                                <FormLabel>{t("staff.profile")}</FormLabel>
                                <Input type="file" name="profile_picture" placeholder={t("init.select") + t("staff.profile")} onChange={handleFileChange} />
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

const mapStateToProps = ({ auth, user, resources }) => {
    const { accessToken,
        createUserStatus: createStatus,
        createUserResult: createResult,
        createUserErrorMessage: createErrorMessage,
    } = auth

    const {
        userListStatus: listStatus,
        userListResult: listResult,
        userListErrorMessage: listErrorMessage,
    } = user

    return {
        accessToken,

        createStatus,
        createResult,
        createErrorMessage,

        listStatus,
        listResult,
        listErrorMessage
    }
}
export default connect(mapStateToProps, {})(StaffPage)