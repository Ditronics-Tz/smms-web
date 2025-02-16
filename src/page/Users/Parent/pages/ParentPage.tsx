import React, { useEffect, useState } from "react";
import { Typography, Box, List, ListItem, ListItemContent, ListDivider, Sheet, Table, iconButtonClasses, Button, IconButton, Input, ButtonGroup, Dropdown, MenuButton, Menu, Modal, ModalDialog, ModalClose, DialogTitle, DialogContent, FormControl, FormLabel, Stack, Autocomplete } from "@mui/joy";
import Select from '@mui/joy/Select';
import Option from '@mui/joy/Option';
import { LoadingView, NotFoundMessage, PageTitle } from "../../../../components";
import { formatDate } from "../../../../utils";

import SearchIcon from '@mui/icons-material/Search';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';

import { connect, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useMediaQuery } from "@mui/material";
import { DeleteOutline, PersonAddOutlined, RemoveRedEyeOutlined } from "@mui/icons-material";
import { API_BASE, STATUS } from "../../../../constant";
import { toast } from "react-toastify";

import {
    userListRequest,
    userListReset,
    createUserRequest,
    createUserReset,
} from "../../../../store/actions"
import { useTranslation } from "react-i18next";
import { NAVIGATE_TO_PARENTDETAILSPAGE } from "../../../../route/types";
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
                            {/* <ListItemDecorator>
                                <Avatar size="sm" src={FILE_BASE + listItem.profile_picture} />
                            </ListItemDecorator> */}
                            <div>
                                <Typography fontWeight={600} gutterBottom>{
                                    listItem.first_name + " " +
                                    listItem.middle_name + " " +
                                    listItem.last_name +
                                    `(${{
                                        'mother': t("parent.mother"),
                                        'father': t("parent.father"),
                                        'guardian': t("parent.guardian")
                                    }[listItem.parent_type]})`}</Typography>
                                <Typography level="body-xs" gutterBottom><b>{t("parent.gender")}:</b> {{ 'M': t("parent.male"), 'F': t("parent.female") }[listItem.gender]}</Typography>
                                <Typography level="body-xs" gutterBottom><b>{t("parent.email")}:</b> {listItem.email}</Typography>
                                <Typography level="body-xs" gutterBottom><b>{t("parent.mobile")}:</b> {listItem.mobile_number}</Typography>
                                {/* <Typography level="body-xs" gutterBottom><b>{t("parent.schoolName")}:</b> {listItem.school}</Typography> */}
                                <Dropdown>
                                    <MenuButton variant="plain" size="sm">More ...</MenuButton>
                                    <Menu placement="bottom-end" sx={{ p: 1 }}>
                                        <Typography level="body-sm" gutterBottom><b>{t("parent.joined")}:</b> {formatDate(listItem.date_joined)}</Typography>
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
                            {/* <Chip
                                variant="solid"
                                size="sm"
                                // startDecorator={
                                //     {
                                //         Paid: <CheckRoundedIcon />,
                                //         Refunded: <AutorenewRoundedIcon />,
                                //         Cancelled: <BlockIcon />,
                                //     }['Paid']
                                // }
                                color={
                                    {
                                        Paid: 'success',
                                        Refunded: 'neutral',
                                        Cancelled: 'danger',
                                    }['Paid'] as ColorPaletteProp
                                }
                            >
                                {'Active'}
                            </Chip> */}
                            <ButtonGroup variant="outlined" size="sm">
                                <Button color="neutral" onClick={() => props.view(listItem)}><RemoveRedEyeOutlined /></Button>
                                <Button color="danger"><DeleteOutline /></Button>
                                {/* <Button color="warning"><BlockOutlined /></Button> */}
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
                            // bgcolor: 'var(--TableCell-headBackground)',
                        },
                    }}
                >
                    <thead>
                        <tr style={{ textAlign: 'center' }}>
                            {/* <th style={{ width: 50, padding: '10px 6px' }}></th> */}
                            <th style={{ width: 70, padding: '10px 6px', }}>{t("parent.firstName")}</th>
                            <th style={{ width: 70, padding: '10px 6px', }}>{t("parent.middleName")}</th>
                            <th style={{ width: 70, padding: '10px 6px', }}>{t("parent.lastName")}</th>
                            <th style={{ width: 50, padding: '10px 6px', }}>{t("parent.type")}</th>
                            <th style={{ width: 40, padding: '10px 6px', }}>{t("parent.gender")}</th>
                            <th style={{ width: 130, padding: '10px 6px', }}>{t("parent.email")}</th>
                            <th style={{ width: 90, padding: '10px 6px', }}>{t("parent.mobile")}</th>
                            <th style={{ width: 120, padding: '10px 6px', }}>{t("parent.joined")}</th>
                            <th style={{ width: 80, padding: '10px 6px', }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((row, index) => (
                            <tr key={index}>
                                {/* <td>
                                    <Avatar size="sm" src={FILE_BASE + row.profile_picture} />
                                </td> */}
                                <td>
                                    <Typography level="body-sm">{row.first_name}</Typography>
                                </td>
                                <td>
                                    <Typography level="body-sm">{row.middle_name}</Typography>
                                </td>
                                <td>
                                    <Typography level="body-sm">{row.last_name}</Typography>
                                </td>
                                <td>
                                    <Typography level="body-sm">{{
                                        'mother': t("parent.mother"),
                                        'father': t("parent.father"),
                                        'guardian': t("parent.guardian")
                                    }[row.parent_type]}</Typography>
                                </td>
                                <td>
                                    <Typography level="body-sm">{{ 'M': t("parent.male"), 'F': t("parent.female") }[row.gender]}</Typography>
                                </td>
                                <td>
                                    <Typography level="body-sm">{row.email}</Typography>
                                </td>
                                <td>
                                    <Typography level="body-sm">{row.mobile_number}</Typography>
                                </td>
                                <td>
                                    <Typography level="body-sm">{formatDate(row.date_joined)}</Typography>
                                </td>
                                {/* <td>
                                    <Chip
                                        variant="solid"
                                        size="sm"
                                        // startDecorator={
                                        //     {
                                        //         Paid: <CheckRoundedIcon />,
                                        //         Refunded: <AutorenewRoundedIcon />,
                                        //         Cancelled: <BlockIcon />,
                                        //     }['Paid']
                                        // }
                                        color={
                                            {
                                                Paid: 'success',
                                                Refunded: 'neutral',
                                                Cancelled: 'danger',
                                            }['Paid'] as ColorPaletteProp
                                        }
                                    >
                                        {'Active'}
                                    </Chip>
                                </td> */}
                                <td>
                                    <ButtonGroup variant="outlined" size="sm">
                                        <Button title={t("parent.view")} color="neutral" onClick={() => props.view(row)}><RemoveRedEyeOutlined /></Button>
                                        <Button title={t("parent.delete")} color="danger"><DeleteOutline /></Button>
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

const ParentPage = ({
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

    const initiateParentData = {
        parent_id: "",
        first_name: "",
        middle_name: "",
        last_name: "",
        parent_type: "",
        gender: "",
        email: "",
        username: "",
        mobile: "",
        school: "",
        student_ids: null
    }

    const [parentData, setParentData] = useState(initiateParentData);
    const [studentList, setStudentList] = useState([]);

    // function to fetch student data to fetch student data
    /* eslint-disable */
    useEffect(() => {
        axios.get(API_BASE + "/list/students", {
            timeout: 30000,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'multipart/form-data',
                'Authorization': 'Bearer ' + accessToken,

            }
        }).then((res) => setStudentList(res.data.results)).catch((e) => console.error(e)) 
    }, [])

    // ---- PAGINATION SETTINGS ----- //
    const [listData, setListData] = useState([]);
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [totalParent, setTotalParent] = useState(0);
    const [nextPage, setNextPage] = useState(null);
    const [previousPage, setPreviousPage] = useState(null);

    const ITEMS_PER_PAGE = 50
    const pageLength = listData.length > 0 ? Math.ceil(totalParent / ITEMS_PER_PAGE) : 1

    const [formModal, setFormModal] = useState(false)

    useEffect(() => {
        if (listStatus === STATUS.SUCCESS) {
            setListData(listResult.results);
            setNextPage(listResult.next);
            setPreviousPage(listResult.previous);
            setTotalParent(listResult.count);
        }
        else if (listStatus === STATUS.ERROR) {
            toast.error(listErrorMessage);
            dispatch(userListReset());
        }

        if (createStatus === STATUS.SUCCESS) {
            toast.success(createResult.message);
            setFormModal(false);
            setParentData(initiateParentData);
            dispatch(userListRequest(accessToken, { "search": search, "role": "parent" }, page))
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
            'role': 'parent'
        }
        dispatch(userListRequest(accessToken, data, page))
    }, [page, search])
    /* eslint-enable */

    // Handle text, select, and RFID input changes
    const handleChange = (e) => {
        if (!e || !e.target) return;
        const { name, value } = e.target;
        setParentData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    // ---- Submit function
    const handleSubmit = (event) => {
        event.preventDefault()
        if (parentData.first_name) {
            const formData = new FormData();

            // Append non-file data
            // formData.append("parent_id", parentData.parent_id);
            formData.append("first_name", parentData.first_name);
            formData.append("middle_name", parentData.middle_name);
            formData.append("last_name", parentData.last_name);
            formData.append("gender", parentData.gender);
            formData.append("email", parentData.email);
            formData.append("username", parentData.username);
            formData.append("mobile_number", parentData.mobile);
            formData.append("parent_type", parentData.parent_type);
            formData.append("role", "parent");

            if (parentData.student_ids) {
                formData.append("student_ids", parentData.student_ids.map(v => v.id))
            }

            dispatch(createUserRequest(accessToken, formData))
        } else {
            toast.error(t("init.emptyErr"))
        }
    }

    /* -------- actions ----------- */
    const viewParentDetails = (details) => {
        navigate(NAVIGATE_TO_PARENTDETAILSPAGE, {
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
            <PageTitle title={t("parent.title") + ` (${totalParent})`} />

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
                    {t("parent.add")}
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
                <MobileViewTable data={listData} props={{ view: viewParentDetails, delete: null }} />
                <DesktopViewTable data={listData} props={{ view: viewParentDetails, delete: null }} />

                {/* Pagination */}
                {totalParent > ITEMS_PER_PAGE
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
                            {t('init.page')} {page} of {Math.ceil(totalParent / ITEMS_PER_PAGE)}
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
                    <DialogTitle>{t("parent.add")}</DialogTitle>
                    <DialogContent>{t("init.enterDetails")}</DialogContent>
                    <Stack component='form' onSubmit={handleSubmit} gap={2} sx={{ mt: 2 }}>
                        <Stack direction={{ xs: 'column', md: 'row' }} gap={2}>
                            {/* first name */}
                            <FormControl sx={{ flex: 1 }} required>
                                <FormLabel>{t("parent.firstName")}</FormLabel>
                                <Input type="text" name="first_name" value={parentData.first_name} onChange={handleChange} placeholder={t("init.placeholder") + t("parent.firstName")} />
                            </FormControl>

                            {/* second name */}
                            <FormControl sx={{ flex: 1 }} required>
                                <FormLabel>{t("parent.middleName")}</FormLabel>
                                <Input type="text" name="middle_name" value={parentData.middle_name} onChange={handleChange} placeholder={t("init.placeholder") + t("parent.middleName")} />
                            </FormControl>

                            {/* last name */}
                            <FormControl sx={{ flex: 1 }} required>
                                <FormLabel>{t("parent.lastName")}</FormLabel>
                                <Input type="text" name="last_name" value={parentData.last_name} onChange={handleChange} placeholder={t("init.placeholder") + t("parent.lastName")} />
                            </FormControl>
                        </Stack>

                        <Stack direction={{ xs: 'column', md: 'row' }} gap={2}>
                            {/* username */}
                            <FormControl sx={{ flex: 1 }} required>
                                <FormLabel>{t("parent.username")}</FormLabel>
                                <Input type="text" name="username" value={parentData.username} onChange={handleChange} placeholder={t("init.placeholder") + t("parent.username")} />
                            </FormControl>

                            {/* gender */}
                            <FormControl sx={{ flex: 1 }} required>
                                <FormLabel>{t("parent.gender")}</FormLabel>
                                <Select name="gender" defaultValue={parentData.gender} value={parentData.gender}
                                    placeholder={t("init.select") + t("parent.gender")}
                                    onChange={(e, value) => setParentData({ ...parentData, gender: value })}>
                                    {[{ value: 'M', label: t("parent.male") }, { value: 'F', label: t("parent.female") }].map((item, index) => (
                                        <Option key={index} value={item.value}>{item.label}</Option>
                                    ))}
                                </Select>
                            </FormControl>
                        </Stack>

                        <Stack direction={{ xs: 'column', md: 'row' }} gap={2}>
                            {/* studentr */}
                            <FormControl sx={{ flex: 1 }}>
                                <FormLabel>{t("parent.student")} <small>({t("parent.alertStudent")})</small></FormLabel>
                                <Autocomplete
                                    multiple
                                    options={studentList}
                                    // value={parentData.student_ids}
                                    // defaultValue={parentData.student_ids}
                                    getOptionLabel={(option) => `${option.first_name} ${option.last_name}`}
                                    onChange={(e, value) => setParentData({ ...parentData, student_ids: value })}
                                    placeholder={t("init.select") + t("parent.student")}
                                />
                            </FormControl>

                            {/* type */}
                            <FormControl sx={{ flex: 1 }} required>
                                <FormLabel>{t("parent.type")}</FormLabel>
                                <Select name="parent_type" defaultValue={parentData.parent_type} value={parentData.parent_type}
                                    placeholder={t("init.select") + t("parent.type")}
                                    onChange={(e, value) => setParentData({ ...parentData, parent_type: value })}>
                                    {[
                                        { value: 'mother', label: t("parent.mother") },
                                        { value: 'father', label: t("parent.father") },
                                        { value: 'guardian', label: t("parent.guardian") }]
                                        .map((item, index) => (
                                            <Option key={index} value={item.value}>{item.label}</Option>
                                        ))}
                                </Select>
                            </FormControl>
                        </Stack>

                        <Stack direction={{ xs: 'column', md: 'row' }} gap={2}>
                            {/* email */}
                            <FormControl sx={{ flex: 1 }} required>
                                <FormLabel>{t("parent.email")}</FormLabel>
                                <Input type="email" name="email" value={parentData.email} onChange={handleChange} placeholder={t("init.placeholder") + t("parent.email")} />
                            </FormControl>

                            {/* class room */}
                            <FormControl sx={{ flex: 1 }} required>
                                <FormLabel>{t("parent.mobile")}</FormLabel>
                                <Input type="tel" name="mobile" value={parentData.mobile} onChange={handleChange} placeholder={t("init.placeholder") + t("parent.mobile") + " Eg: 0612******"} />
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

const mapStateToProps = ({ auth, user }) => {
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
export default connect(mapStateToProps, {})(ParentPage)