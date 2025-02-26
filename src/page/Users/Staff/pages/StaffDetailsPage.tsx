import React, { useEffect, useState } from "react";
import { Typography, Box, Divider, Button, Sheet, Modal, ModalDialog, ModalClose, DialogTitle, DialogContent, Stack, FormControl, FormLabel, Input, Select, Option, Avatar, Chip, ColorPaletteProp, ListDivider, Autocomplete, Table, ListItem, List, ListItemContent } from "@mui/joy";
import { toast } from 'react-toastify';
import { LoadingView, NotFoundMessage } from "../../../../components";
import { useLocation, useNavigate } from "react-router-dom";
import { API_BASE, FILE_BASE, STATUS } from "../../../../constant";
import { connect, useDispatch } from "react-redux";
import classList from '../../../../assets/data/classess.json'

import {
    editUserRequest,
    editUserReset,
    staffDetailsRequest,
    staffDetailsReset,
} from '../../../../store/actions'
import { EditOutlined, RemoveRedEyeOutlined } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { formatDate, thousandSeparator } from "../../../../utils";
import axios from "axios";
import { NAVIGATE_TO_STAFFDETAILSPAGE, NAVIGATE_TO_TRANSACTIONPAGE } from "../../../../route/types";

function CreateItems(
    title: String,
    value: String
) {
    return { title, value }
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


const StaffDetailsPage = ({
    accessToken,
    editStatus,
    editResult,
    editErrorMessage,
    detailsStatus,
    detailsErrorMessage,
    detailsResult


}) => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { t } = useTranslation();

    const { state } = useLocation();
    const { id } = state

    const initiatestaffData = {
        staff_id: id,
        first_name: "",
        middle_name: "",
        last_name: "",
        username: "",
        email: "",
        mobile: "",
        gender: "",
        school: null,
        school_value: "",
        rfid_card: null,
        profile_picture: null,
        profile_picture_url: "",
        transactions: []
    }


    const [formModal, setFormModal] = useState(false);

    const [staffData, setstaffData] = useState(initiatestaffData);
    const [schoolList, setSchoolList] = useState([])

    // function to fetch staffs data to fetch staff data
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

    useEffect(() => {
        if (detailsStatus === STATUS.SUCCESS) {
            setstaffData({
                staff_id: detailsResult.id,
                first_name: detailsResult.first_name,
                middle_name: detailsResult.middle_name,
                last_name: detailsResult.last_name,
                username:  detailsResult.username,
                email: detailsResult.email,
                mobile: detailsResult.mobile_number,
                gender: detailsResult.gender,
                school: detailsResult.school,
                school_value: detailsResult.school_id,
                profile_picture: null,
                rfid_card: detailsResult.rfid_card,
                profile_picture_url: detailsResult.profile_picture,
                transactions: detailsResult.transactions,
            });
        }
        else if (detailsStatus === STATUS.ERROR) {
            dispatch(staffDetailsReset());
            toast.error(detailsErrorMessage)
        }

        if (editStatus === STATUS.SUCCESS) {
            toast.success(editResult.message);
            setFormModal(false);
            dispatch(staffDetailsRequest(accessToken, { "staff_id": staffData.staff_id }))
            dispatch(editUserReset())
        }
        else if (editStatus === STATUS.ERROR) {
            toast.error(editErrorMessage);
            dispatch(editUserReset())
        }
    }, [detailsStatus, editStatus])


    useEffect(() => {
        if (staffData.staff_id != "") {
            dispatch(staffDetailsRequest(accessToken, { "staff_id": staffData.staff_id }))
        }
    }, [])
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
            profile_picture_url: URL.createObjectURL(file)
        }));
    };

    // ---- Submit function
    const handleSubmit = (event) => {
        event.preventDefault()
        if (staffData.first_name) {
            const formData = new FormData();

            // Append non-file data
            formData.append("user_id", staffData.staff_id);
            formData.append("first_name", staffData.first_name);
            formData.append("middle_name", staffData.middle_name);
            formData.append("last_name", staffData.last_name);
            formData.append("username", staffData.username);
            formData.append("email", staffData.email);
            formData.append("mobile_number", staffData.mobile);
            formData.append("gender", staffData.gender);
            formData.append("school", staffData.school_value);
            formData.append("role", "staff");

            // Append file only if selected
            if (staffData.profile_picture) {
                formData.append("profile_picture", staffData.profile_picture);
            }

            dispatch(editUserRequest(accessToken, formData))
        } else {
            toast.error(t("init.emptyErr"))
        }
    }


    const checkLoading = () => {
        if (detailsStatus === STATUS.LOADING || editStatus === STATUS.LOADING) {
            return true
        } else {
            return false
        }
    }

    const rows = [
        CreateItems(t("staff.username"), staffData.username),
        CreateItems(t("staff.email"), staffData.email),
        CreateItems(t("staff.mobile"), staffData.mobile),
        CreateItems(t("staff.gender"), { 'M': t("staff.male"), 'F': t("staff.female") }[staffData.gender]),
        CreateItems(t("staff.schoolName"), staffData.school && staffData.school),
    ]


    return (
        <Box>
            {/* <PageTitle title={t("staff.details") + " - " + staffData.first_name + " " + staffData.last_name} /> */}

            <LoadingView loading={checkLoading()} />

            {/* Contents */}
            {staffData.first_name ?
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    width: '100%',
                    maxWidth: "1200px",
                    gap: 2
                }}>

                    {/* Details */}
                    <Box sx={{ display: 'flex', gap: 1, flexDirection: { xs: 'column', md: 'row' } }}>
                        {/* staff details */}
                        <Sheet
                            variant="outlined"

                            sx={{
                                display: 'flex',
                                flexDirection: { xs: 'column', md: 'row' },
                                justifyContent: 'center',
                                alignItems: 'center',
                                minWidth: { xs: '100%', md: '600px' },
                                backgroundColor: 'background.body',
                                p: 2,
                                gap: { xs: 1, md: 3 },
                                borderRadius: 6
                            }}>
                            <Avatar
                                src={FILE_BASE + staffData.profile_picture_url}
                                sx={{ height: 140, width: 140, borderRadius: 100 }} />

                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, width: '100%' }}>
                                <Typography level="h3">{staffData.first_name + " " + staffData.middle_name + " " + staffData.last_name}</Typography>
                                {/* <Divider /> */}
                                {rows.map((item, index) => (
                                    <Typography level="body-sm" key={index}><b>{item.title}:</b> {item.value}</Typography>
                                ))}
                                <Divider />
                                <Button
                                    size="sm"
                                    color="neutral"
                                    variant="outlined"
                                    sx={{ borderRadius: 100, mt: 2 }}
                                    startDecorator={<EditOutlined />}
                                    onClick={() => setFormModal(true)}>
                                    {t("staff.edit")}
                                </Button>
                            </Box>
                        </Sheet>

                        {/* Card */}
                        {staffData.rfid_card &&
                            <Sheet
                                variant="outlined"
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    minWidth: { xs: 'unset', md: '400px' },
                                    backgroundColor: 'background.popup',
                                    p: 2,
                                    boxShadow: 'md',
                                    // borderRadius: 'sm',
                                    gap: 0.5
                                }}>

                                <Typography level='title-md'>{t("staff.card")}</Typography>
                                <ListDivider sx={{ mb: 1 }} />

                                <Typography level="title-sm" textAlign={"center"}>{t("staff.balance")}</Typography>
                                <Typography level="h3" textAlign={"center"}>Tsh. {thousandSeparator(staffData.rfid_card.balance)}</Typography>
                                <Chip
                                    variant="solid"
                                    size="sm"
                                    sx={{ alignSelf: 'center', mb: 1 }}
                                    color={
                                        {
                                            true: 'success',
                                            false: 'danger'
                                        }[staffData.rfid_card.is_active] as ColorPaletteProp
                                    }
                                >
                                    {{
                                        true: t("status.active"),
                                        false: t("status.inactive")
                                    }[staffData.rfid_card.is_active]}
                                </Chip>

                                <Divider />
                                <Typography ><b>{t("staff.card_number")}:</b> {staffData.rfid_card.card_number}</Typography>
                                <Typography ><b>{t("staff.controlNumber")}:</b> {staffData.rfid_card.control_number}</Typography>
                                <Typography ><b>{t("staff.issue")}:</b> {formatDate(staffData.rfid_card.issued_date)}</Typography>
                            </Sheet>}
                    </Box>


                    <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: "column", md: "row" } }}>

                        {staffData.transactions.length > 0 &&
                            <Sheet>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Box>
                                        <Typography level='title-md'>{t("transaction.title")}</Typography>
                                    </Box>
                                    <Button size='sm' color='neutral' variant='plain' onClick={() => navigate(NAVIGATE_TO_TRANSACTIONPAGE)}>
                                        {t("home.view_more")}
                                    </Button>
                                </Box>
                                <MobileViewTable props={null} data={staffData.transactions} />
                                <DesktopViewTable props={null} data={staffData.transactions} />
                            </Sheet>}

                    </Box>

                </Box>
                :
                <NotFoundMessage />}


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

                        {/* Edit staff profile */}
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignSelf: 'center', gap: 1, alignItems: 'center' }}>
                            <Avatar
                                size="lg"
                                sx={{ width: 100, height: 100, borderRadius: 4 }}
                                src={staffData.profile_picture ? staffData.profile_picture_url : FILE_BASE + staffData.profile_picture_url} />
                            <input type="file" hidden id="profile_picture" style={{ display: 'None' }} onChange={handleFileChange} />

                            <Button
                                size="sm"
                                variant="outlined"
                                color='neutral'
                                sx={{ borderRadius: 100 }}>
                                <label htmlFor="profile_picture" style={{ width: '100%', alignItems: 'center' }}>{t("staff.changeProfile")}</label>
                            </Button>

                        </Box>

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
                                <Select name="school" defaultValue={staffData.school_value} value={staffData.school_value}
                                    placeholder={t("init.select") + t("staff.schoolName")}
                                    onChange={(e, value) => setstaffData({ ...staffData, school_value: value })}>
                                    {schoolList.length > 0 ? schoolList.map((item, index) => (
                                        <Option key={index} value={item.id}>{item.name}</Option>
                                    )) : <Option value={null}>{t("school.NoList")}</Option>}
                                </Select>
                            </FormControl>
                        </Stack>

                        <Stack gap={4} sx={{ mt: 2 }}>
                            <Button color="success" type="submit" fullWidth>
                                {editStatus === STATUS.LOADING ? t("init.loading") : t("init.submit")}
                            </Button>
                        </Stack>
                    </Stack>
                </ModalDialog>
            </Modal>
        </Box>
    )
}

const mapStateToProps = ({ user, auth, resources }) => {
    const {
        accessToken,

        editUserStatus: editStatus,
        editUserResult: editResult,
        editUserErrorMEessage: editErrorMessage,
    } = auth
    const {
        staffDetailsStatus: detailsStatus,
        staffDetailsResult: detailsResult,
        staffDetailsErrorMessage: detailsErrorMessage,
    } = user

    return {
        accessToken,
        editStatus,
        editResult,
        editErrorMessage,
        detailsStatus,
        detailsErrorMessage,
        detailsResult
    }
}

export default connect(mapStateToProps, {})(StaffDetailsPage)