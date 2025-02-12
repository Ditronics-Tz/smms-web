import React, { Fragment, useEffect, useState } from "react";
import { Typography, Box, Table, AspectRatio, Card, CardContent, Divider, ButtonGroup, Button, Sheet, Modal, ModalOverflow, ModalDialog, ModalClose, DialogTitle, DialogContent, Stack, FormControl, FormLabel, Input, Select, Option, Avatar, Chip, ColorPaletteProp, ListDivider } from "@mui/joy";
import { toast } from 'react-toastify';
import { LoadingView, Main, NotFoundMessage, PageTitle } from "../../../../components";
import { useLocation, useNavigate } from "react-router-dom";
import { FILE_BASE, STATUS } from "../../../../constant";
import { connect, useDispatch } from "react-redux";
import { useMediaQuery } from "@mui/material";
import {
    editUserRequest,
    editUserReset,
    adminDetailsRequest,
    adminDetailsReset,
} from '../../../../store/actions'
import { AddCardOutlined, BlockOutlined, CheckCircle, DeleteOutline, DoNotDisturbOn, EditOutlined, FolderOpenOutlined, LocationOn, RemoveRedEyeOutlined, TaskAltOutlined, WarningRounded } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { formatDate, thousandSeparator } from "../../../../utils";

function CreateItems(
    title: String,
    value: String
) { return { title, value } }


const AdminDetailsPage = ({
    accessToken,

    editStatus,
    editResult,
    editErrorMessage,

    schoolList,
    schoolStatus,

    detailsStatus,
    detailsErrorMessage,
    detailsResult
}) => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { t } = useTranslation();

    const { state } = useLocation();
    const { id } = state

    const initiateAdminData = {
        admin_id: id,
        first_name: "",
        middle_name: "",
        last_name: "",
        gender: "",
        email: "",
        username: "",
        mobile: "",
        school: "",
        school_value: "",
        // sessions: []
    }


    const [formModal, setFormModal] = useState(false);

    const [adminData, setAdminData] = useState(initiateAdminData);

    useEffect(() => {
        if (detailsStatus === STATUS.SUCCESS) {
            setAdminData({
                admin_id: detailsResult.id,
                first_name: detailsResult.first_name,
                middle_name: detailsResult.middle_name,
                last_name: detailsResult.last_name,
                gender: detailsResult.gender,
                email: detailsResult.email,
                username: detailsResult.username,
                mobile: detailsResult.mobile_number,
                school: detailsResult.school,
                school_value: detailsResult.school_id,
                // sessions: detailsResult.sessions,
            });
        }
        else if (detailsStatus === STATUS.ERROR) {
            // dispatch(adminDetailsReset());
            toast.error(detailsErrorMessage)
        }

        if (editStatus === STATUS.SUCCESS) {
            toast.success(editResult.message);
            setFormModal(false);
            dispatch(adminDetailsRequest(accessToken, { "admin_id": adminData.admin_id }))
            dispatch(editUserReset())
        }
        else if (editStatus === STATUS.ERROR) {
            toast.error(editErrorMessage);
            dispatch(editUserReset())
        }
    }, [detailsStatus, editStatus])


    useEffect(() => {
        if (adminData.admin_id != "") {
            dispatch(adminDetailsRequest(accessToken, { "admin_id": adminData.admin_id }))
        }
    }, [])


    // Handle text, select, and RFID input changes
    const handleChange = (e) => {
        if (!e || !e.target) return;
        const { name, value } = e.target;
        setAdminData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    // ---- Submit function
    const handleSubmit = (event) => {
        event.preventDefault()
        if (adminData.first_name) {
            const formData = new FormData();

            // Append non-file data
            formData.append("user_id", adminData.admin_id);
            formData.append("first_name", adminData.first_name);
            formData.append("middle_name", adminData.middle_name);
            formData.append("last_name", adminData.last_name);
            formData.append("gender", adminData.gender);
            formData.append("email", adminData.email);
            formData.append("username", adminData.username);
            formData.append("mobile_number", adminData.mobile);
            formData.append("school", adminData.school);
            formData.append("role", "admin");

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
        CreateItems(t("admin.username"), adminData.username),
        CreateItems(t("admin.gender"), { 'M': t("admin.male"), 'F': t("admin.female") }[adminData.gender]),
        CreateItems(t("admin.email"), adminData.email),
        CreateItems(t("admin.mobile"), adminData.mobile),
        CreateItems(t("admin.schoolName"), adminData.school),
    ]


    return (
        <Box>
            {/* <PageTitle title={t("admin.details") + " - " + adminData.first_name + " " + adminData.last_name} /> */}

            <LoadingView loading={checkLoading()} />

            {/* Contents */}
            {adminData.first_name ?
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    // alignItems: 'center',
                    maxWidth: "1200px",
                    gap: 4
                }}>

                    {/* Details */}
                    <Box sx={{ gap: 2, display: 'flex', flexDirection: 'column' }}>
                        {/* admin details */}

                        <Sheet
                            variant="outlined"

                            sx={{
                                display: 'flex',
                                width: { xs: '100%', md: '600px' },
                                flexDirection: 'row',
                                backgroundColor: 'background.body',
                                p: 2,
                                gap: {xs: 1, md: 3},
                                borderRadius: 6
                            }}>
                            <Avatar sx={{height: 160, width: 140, borderRadius: 6}} />
                            {/* <Divider orientation="horizontal" /> */}
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.6, width: '100%' }}>
                                <Typography level="h3">{adminData.first_name + " " + adminData.middle_name + " " + adminData.last_name}</Typography>
                                <Divider />
                                {rows.map((item, index) => (
                                    <Typography key={index} level="body-sm"><b>{item.title}:</b> {item.value}</Typography>
                                ))}
                                <Divider />
                                <Button
                                    size="sm"
                                    color="success"
                                    variant="outlined"
                                    // sx={{ alignSelf: 'flex-end' }}
                                    startDecorator={<EditOutlined />}
                                    onClick={() => setFormModal(true)}>
                                    {t("admin.edit")}
                                </Button>
                            </Box>
                        </Sheet>
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
                    <DialogTitle>{t("admin.add")}</DialogTitle>
                    <DialogContent>{t("init.enterDetails")}</DialogContent>
                    <Stack component='form' onSubmit={handleSubmit} gap={2} sx={{ mt: 2 }}>

                        <Stack direction={{ xs: 'column', md: 'row' }} gap={2}>
                            {/* first name */}
                            <FormControl sx={{ flex: 1 }} required>
                                <FormLabel>{t("admin.firstName")}</FormLabel>
                                <Input type="text" name="first_name" value={adminData.first_name} onChange={handleChange} placeholder={t("init.placeholder") + t("admin.firstName")} />
                            </FormControl>

                            {/* second name */}
                            <FormControl sx={{ flex: 1 }} required>
                                <FormLabel>{t("admin.middleName")}</FormLabel>
                                <Input type="text" name="middle_name" value={adminData.middle_name} onChange={handleChange} placeholder={t("init.placeholder") + t("admin.middleName")} />
                            </FormControl>

                            {/* last name */}
                            <FormControl sx={{ flex: 1 }} required>
                                <FormLabel>{t("admin.lastName")}</FormLabel>
                                <Input type="text" name="last_name" value={adminData.last_name} onChange={handleChange} placeholder={t("init.placeholder") + t("admin.lastName")} />
                            </FormControl>
                        </Stack>

                        <Stack direction={{ xs: 'column', md: 'row' }} gap={2}>
                            {/* username */}
                            <FormControl sx={{ flex: 1 }} required>
                                <FormLabel>{t("admin.username")}</FormLabel>
                                <Input type="text" name="username" value={adminData.username} onChange={handleChange} placeholder={t("init.placeholder") + t("admin.username")} />
                            </FormControl>

                            {/* gender */}
                            <FormControl sx={{ flex: 1 }} required>
                                <FormLabel>{t("admin.gender")}</FormLabel>
                                <Select name="gender" defaultValue={adminData.gender} value={adminData.gender}
                                    placeholder={t("init.select") + t("admin.gender")}
                                    onChange={(e, value) => setAdminData({ ...adminData, gender: value })}>
                                    {[{ value: 'M', label: t("admin.male") }, { value: 'F', label: t("admin.female") }].map((item, index) => (
                                        <Option key={index} value={item.value}>{item.label}</Option>
                                    ))}
                                </Select>
                            </FormControl>
                        </Stack>

                        <Stack direction={{ xs: 'column', md: 'row' }} gap={2}>

                            {/* email */}
                            <FormControl sx={{ flex: 1 }} required>
                                <FormLabel>{t("admin.email")}</FormLabel>
                                <Input type="text" name="email" value={adminData.email} onChange={handleChange} placeholder={t("init.placeholder") + t("admin.email")} />
                            </FormControl>

                            {/* mobile */}
                            <FormControl sx={{ flex: 1 }} required>
                                <FormLabel>{t("admin.mobile")}</FormLabel>
                                <Input type="text" name="mobile" value={adminData.mobile} onChange={handleChange} placeholder={t("init.placeholder") + t("admin.mobile")} />
                            </FormControl>
                        </Stack>

                        <Stack direction={{ xs: 'column', md: 'row' }} gap={2}>
                            {/* school name */}
                            <FormControl sx={{ flex: 1 }} required>
                                <FormLabel>{t("admin.schoolName")}</FormLabel>
                                <Select name="school" defaultValue={adminData.school_value} value={adminData.school_value}
                                    placeholder={t("init.select") + t("student.schoolName")}
                                    onChange={(e, value) => setAdminData({ ...adminData, school_value: value })}>
                                    {schoolStatus === STATUS.SUCCESS ? schoolList.results.map((item, index) => (
                                        <Option key={index} value={item.id}>{item.name}</Option>
                                    )) : <Option value={null}>{t("school.NoList")}</Option>}
                                </Select>                            </FormControl>
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
        schoolListResult: schoolList,
        schoolListStatus: schoolStatus,
    } = resources

    const {
        adminDetailsStatus: detailsStatus,
        adminDetailsResult: detailsResult,
        adminDetailsErrorMessage: detailsErrorMessage,
    } = user

    return {
        accessToken,

        editStatus,
        editResult,
        editErrorMessage,

        schoolList,
        schoolStatus,

        detailsStatus,
        detailsErrorMessage,
        detailsResult
    }
}

export default connect(mapStateToProps, {})(AdminDetailsPage)