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
import { NAVIGATE_TO_STUDENTDETAILSPAGE } from "../../../../route/types";
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
                                <Typography level="body-xs" gutterBottom><b>{t("student.gender")}:</b> {{ 'M': t("student.male"), 'F': t("student.female") }[listItem.gender]}</Typography>
                                <Typography level="body-xs" gutterBottom><b>{t("student.schoolName")}:</b> {listItem.school || ""}</Typography>
                                <Typography level="body-xs" gutterBottom><b>{t("student.classRoom")}:</b> {listItem.class_room}</Typography>
                                <Dropdown>
                                    <MenuButton variant="plain" size="sm">More ...</MenuButton>
                                    <Menu placement="bottom-end" sx={{ p: 1 }}>
                                        <Typography level="body-sm" gutterBottom><b>{t("student.joined")}:</b> {formatDate(listItem.date_joined)}</Typography>
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
                            <ButtonGroup variant="soft" size="sm">
                                <Button color="primary" onClick={() => props.view(listItem)}><RemoveRedEyeOutlined /></Button>
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
                            bgcolor: 'var(--TableCell-headBackground)',
                        },
                    }}
                >
                    <thead>
                        <tr style={{ textAlign: 'center' }}>
                            <th style={{ width: 50, padding: '10px 6px' }}></th>
                            <th style={{ width: 70, padding: '10px 6px', }}>{t("student.firstName")}</th>
                            <th style={{ width: 70, padding: '10px 6px', }}>{t("student.middleName")}</th>
                            <th style={{ width: 70, padding: '10px 6px', }}>{t("student.lastName")}</th>
                            <th style={{ width: 50, padding: '10px 6px', }}>{t("student.gender")}</th>
                            <th style={{ width: 150, padding: '10px 6px', }}>{t("student.schoolName")}</th>
                            <th style={{ width: 60, padding: '10px 6px', }}>{t("student.classRoom")}</th>
                            <th style={{ width: 120, padding: '10px 6px', }}>{t("student.joined")}</th>
                            {/* <th style={{ width: 40, padding: '10px 6px', textAlign: 'center' }}>Status</th> */}
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
                                    <Typography level="body-sm">{{ 'M': t("student.male"), 'F': t("student.female") }[row.gender]}</Typography>
                                </td>
                                <td>
                                    <Typography level="body-sm">{row.school || ""}</Typography>
                                </td>
                                <td>
                                    <Typography level="body-xs">{row.class_room}</Typography>
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
                                    <ButtonGroup variant="solid" size="sm">
                                        <Button title={t("student.view")} color="primary" onClick={() => props.view(row)}><RemoveRedEyeOutlined /></Button>
                                        {/* <Button title="Delete" color="danger"><DeleteOutline /></Button> */}
                                        <Button title={t("student.delete")} color="danger"><DeleteOutline /></Button>
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

const StudentPage = ({
    accessToken,

    createStatus,
    createResult,
    createErrorMessage,

    schoolList,
    schoolStatus,

    listStatus,
    listResult,
    listErrorMessage,
}) => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { t } = useTranslation()
    const isDesktop = useMediaQuery("(min-width:600px)");

    const initiateStudentData = {
        student_id: "",
        first_name: "",
        middle_name: "",
        last_name: "",
        gender: "",
        class_room: "",
        school: "",
        profile_picture: null,
        parent_ids: null
    }

    const [studentData, setStudentData] = useState(initiateStudentData);
    const [parentList, setParentList] = useState([])

    // function to fetch parents data to fetch student data
    /* eslint-disable */
    useEffect(() => {
        axios.get(API_BASE + "/list/parents", {
            timeout: 30000,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'multipart/form-data',
                'Authorization': 'Bearer ' + accessToken,

            }
        }).then((res) => setParentList(res.data.results)).catch((e) => console.error(e))
    }, [])

    // ---- PAGINATION SETTINGS ----- //
    const [listData, setListData] = useState([]);
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [totalStudent, setTotalStudent] = useState(0);
    const [nextPage, setNextPage] = useState(null);
    const [previousPage, setPreviousPage] = useState(null);

    const ITEMS_PER_PAGE = 50
    const pageLength = listData.length > 0 ? Math.ceil(totalStudent / ITEMS_PER_PAGE) : 1

    const [formModal, setFormModal] = useState(false)

    useEffect(() => {
        if (listStatus === STATUS.SUCCESS) {
            setListData(listResult.results);
            setNextPage(listResult.next);
            setPreviousPage(listResult.previous);
            setTotalStudent(listResult.count);
        }
        else if (listStatus === STATUS.ERROR) {
            toast.error(listErrorMessage);
            dispatch(userListReset());
        }

        if (createStatus === STATUS.SUCCESS) {
            toast.success(createResult.message);
            setFormModal(false);
            setStudentData(initiateStudentData);
            dispatch(userListRequest(accessToken, { "search": search, "role": "student" }, page))
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
            'role': 'student'
        }
        dispatch(userListRequest(accessToken, data, page))
    }, [page, search])
    /* eslint-enable */

    // Handle text, select, and RFID input changes
    const handleChange = (e) => {
        if (!e || !e.target) return;
        const { name, value } = e.target;
        setStudentData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    // Handle file input change
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setStudentData((prevData) => ({
            ...prevData,
            profile_picture: file,
        }));
    };

    // ---- Submit function
    const handleSubmit = (event) => {
        event.preventDefault()
        if (studentData.first_name) {
            const formData = new FormData();

            // Append non-file data
            // formData.append("student_id", studentData.student_id);
            formData.append("first_name", studentData.first_name);
            formData.append("middle_name", studentData.middle_name);
            formData.append("last_name", studentData.last_name);
            formData.append("gender", studentData.gender);
            formData.append("class_room", studentData.class_room);
            formData.append("school", studentData.school);
            formData.append("role", "student");

            studentData.parent_ids.forEach(value => formData.append('parent_ids', value.id));

            // Append file only if selected
            if (studentData.profile_picture) {
                formData.append("profile_picture", studentData.profile_picture);
            }

            dispatch(createUserRequest(accessToken, formData))
        } else {
            toast.error(t("init.emptyErr"))
        }
    }

    /* -------- actions ----------- */
    const viewStudentDetails = (details) => {
        navigate(NAVIGATE_TO_STUDENTDETAILSPAGE, {
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
            <PageTitle title={t("student.title") + ` (${totalStudent})`} />

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
                    {t("student.add")}
                </Button>

                <Input
                    size="sm"
                    placeholder={t("init.search") + "name"}
                    type='text'
                    defaultValue={search}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    startDecorator={<SearchIcon />}
                    // endDecorator={
                    //     <Dropdown>
                    //         <MenuButton variant="plain">
                    //             {/* <Typography level="body-sm">Filter</Typography> */}
                    //             <FilterAltOutlined />
                    //         </MenuButton>
                    //         <Menu sx={{ minWidth: '120px', fontSize: '14px' }}>
                    //             <MenuItem onClick={() => setFilterBy('name')} selected={filterBy == 'name'}>Name</MenuItem>
                    //         </Menu>
                    //     </Dropdown>
                    // }
                    sx={{ width: { xs: 'auto', md: '30%' }, textTransform: 'capitalize' }}
                />
            </Sheet>

            {listData.length > 0 ? <>
                {/* ------ render different view depend on plafform -------- */}
                <MobileViewTable data={listData} props={{ view: viewStudentDetails, delete: null }} />
                <DesktopViewTable data={listData} props={{ view: viewStudentDetails, delete: null }} />

                {/* Pagination */}
                {totalStudent > ITEMS_PER_PAGE
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
                            {t('init.page')} {page} of {Math.ceil(totalStudent / ITEMS_PER_PAGE)}
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
                    <DialogTitle>{t("student.add")}</DialogTitle>
                    <DialogContent>{t("init.enterDetails")}</DialogContent>
                    <Stack component='form' onSubmit={handleSubmit} gap={2} sx={{ mt: 2 }}>
                        <Stack direction={{ xs: 'column', md: 'row' }} gap={2}>
                            {/* first name */}
                            <FormControl sx={{ flex: 1 }} required>
                                <FormLabel>{t("student.firstName")}</FormLabel>
                                <Input type="text" name="first_name" value={studentData.first_name} onChange={handleChange} placeholder={t("init.placeholder") + t("student.firstName")} />
                            </FormControl>

                            {/* second name */}
                            <FormControl sx={{ flex: 1 }} required>
                                <FormLabel>{t("student.middleName")}</FormLabel>
                                <Input type="text" name="middle_name" value={studentData.middle_name} onChange={handleChange} placeholder={t("init.placeholder") + t("student.middleName")} />
                            </FormControl>

                            {/* last name */}
                            <FormControl sx={{ flex: 1 }} required>
                                <FormLabel>{t("student.lastName")}</FormLabel>
                                <Input type="text" name="last_name" value={studentData.last_name} onChange={handleChange} placeholder={t("init.placeholder") + t("student.lastName")} />
                            </FormControl>
                        </Stack>

                        <Stack direction={{ xs: 'column', md: 'row' }} gap={2}>
                            {/* gender */}
                            <FormControl sx={{ flex: 1 }} required>
                                <FormLabel>{t("student.gender")}</FormLabel>
                                <Select name="gender" defaultValue={studentData.gender} value={studentData.gender}
                                    placeholder={t("init.select") + t("student.gender")}
                                    onChange={(e, value) => setStudentData({ ...studentData, gender: value })}>
                                    {[{ value: 'M', label: t("student.male") }, { value: 'F', label: t("student.female") }].map((item, index) => (
                                        <Option key={index} value={item.value}>{item.label}</Option>
                                    ))}
                                </Select>
                            </FormControl>

                            {/* select parent */}
                            <FormControl sx={{ flex: 1 }}>
                                <FormLabel>{t("student.parents")} <small>({t("student.alertParent")})</small></FormLabel>
                                <Autocomplete
                                    multiple
                                    options={parentList}
                                    // value={studentData.parent_ids}
                                    // defaultValue={studentData.parent_ids}
                                    getOptionLabel={(option) => `${option.first_name} ${option.last_name}`}
                                    onChange={(e, value) => setStudentData({ ...studentData, parent_ids: value })}
                                    placeholder={t("init.select") + t("student.parents")}
                                />
                            </FormControl>
                        </Stack>

                        <Stack direction={{ xs: 'column', md: 'row' }} gap={2}>
                            {/* school name */}
                            <FormControl sx={{ flex: 1 }} required>
                                <FormLabel>{t("student.schoolName")}</FormLabel>
                                <Select name="school" defaultValue={studentData.school} value={studentData.school}
                                    placeholder={t("init.select") + t("student.schoolName")}
                                    onChange={(e, value) => setStudentData({ ...studentData, school: value })}>
                                    {schoolStatus === STATUS.SUCCESS ? schoolList.results.map((item, index) => (
                                        <Option key={index} value={item.id}>{item.name}</Option>
                                    )) : <Option value={null}>{t("school.NoList")}</Option>}
                                </Select>
                            </FormControl>

                            {/* class room */}
                            <FormControl sx={{ flex: 1 }} required>
                                <FormLabel>{t("student.classRoom")}</FormLabel>
                                <Select name="class_room" defaultValue={studentData.class_room} value={studentData.class_room}
                                    placeholder={t("init.select") + t("student.classRoom")}
                                    onChange={(e, value) => setStudentData({ ...studentData, class_room: value })}>
                                    {classList.map((item, index) => (
                                        <Option key={index} value={item}>{item}</Option>
                                    ))}
                                </Select>
                            </FormControl>
                        </Stack>

                        <Stack direction={{ xs: 'column', md: 'row' }} gap={2}>
                            {/* picture */}
                            <FormControl sx={{ flex: 1 }}>
                                <FormLabel>{t("student.profile")}</FormLabel>
                                <Input type="file" name="profile_picture" placeholder={t("init.select") + t("student.profile")} onChange={handleFileChange} />
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
        schoolListResult: schoolList,
        schoolListStatus: schoolStatus,
    } = resources

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

        schoolList,
        schoolStatus,

        listStatus,
        listResult,
        listErrorMessage
    }
}
export default connect(mapStateToProps, {})(StudentPage)