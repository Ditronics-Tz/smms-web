import React, { useEffect, useState } from "react";
import { Typography, Box, Table, Divider, Button, Sheet, Modal, ModalDialog, ModalClose, DialogTitle, DialogContent, Stack, FormControl, FormLabel, Input, Select, Option, Avatar, CardContent, ColorPaletteProp, Card } from "@mui/joy";
import { toast } from 'react-toastify';
import { LoadingView, NotFoundMessage } from "../../../../components";
import { useLocation } from "react-router-dom";
import { STATUS } from "../../../../constant";
import { connect, useDispatch } from "react-redux";
import {
    editUserRequest,
    editUserReset,
    operatorDetailsRequest,
} from '../../../../store/actions'
import { EditOutlined, TimerOutlined } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { formatDate } from "../../../../utils";

function CreateItems(
    title: String,
    value: String
) { return { title, value } }


const OperatorDetailsPage = ({
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
    const { t } = useTranslation();

    const { state } = useLocation();
    const { id } = state

    const initiateOperatorData = {
        operator_id: id,
        first_name: "",
        middle_name: "",
        last_name: "",
        gender: "",
        email: "",
        username: "",
        mobile: "",
        school: "",
        school_value: "",
        sessions: []
    }


    const [formModal, setFormModal] = useState(false);

    const [operatorData, setOperatorData] = useState(initiateOperatorData);

    /* eslint-disable */
    useEffect(() => {
        if (detailsStatus === STATUS.SUCCESS) {
            setOperatorData({
                operator_id: detailsResult.id,
                first_name: detailsResult.first_name,
                middle_name: detailsResult.middle_name,
                last_name: detailsResult.last_name,
                gender: detailsResult.gender,
                email: detailsResult.email,
                username: detailsResult.username,
                mobile: detailsResult.mobile_number,
                school: detailsResult.school,
                school_value: detailsResult.school_id,
                sessions: detailsResult.sessions,
            });
        }
        else if (detailsStatus === STATUS.ERROR) {
            // dispatch(operatorDetailsReset());
            toast.error(detailsErrorMessage)
        }

        if (editStatus === STATUS.SUCCESS) {
            toast.success(editResult.message);
            setFormModal(false);
            dispatch(operatorDetailsRequest(accessToken, { "operator_id": operatorData.operator_id }))
            dispatch(editUserReset())
        }
        else if (editStatus === STATUS.ERROR) {
            toast.error(editErrorMessage);
            dispatch(editUserReset())
        }
    }, [detailsStatus, editStatus])


    useEffect(() => {
        if (operatorData.operator_id != "") {
            dispatch(operatorDetailsRequest(accessToken, { "operator_id": operatorData.operator_id }))
        }
    }, [])
    /* eslint-disable */


    // Handle text, select, and RFID input changes
    const handleChange = (e) => {
        if (!e || !e.target) return;
        const { name, value } = e.target;
        setOperatorData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    // ---- Submit function
    const handleSubmit = (event) => {
        event.preventDefault()
        if (operatorData.first_name) {
            const formData = new FormData();

            // Append non-file data
            formData.append("user_id", operatorData.operator_id);
            formData.append("first_name", operatorData.first_name);
            formData.append("middle_name", operatorData.middle_name);
            formData.append("last_name", operatorData.last_name);
            formData.append("gender", operatorData.gender);
            formData.append("email", operatorData.email);
            formData.append("username", operatorData.username);
            formData.append("mobile_number", operatorData.mobile);
            formData.append("school", operatorData.school_value);
            formData.append("role", "operator");

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
        CreateItems(t("operator.username"), operatorData.username),
        CreateItems(t("operator.gender"), { 'M': t("operator.male"), 'F': t("operator.female") }[operatorData.gender]),
        CreateItems(t("operator.email"), operatorData.email),
        CreateItems(t("operator.mobile"), operatorData.mobile),
        CreateItems(t("operator.schoolName"), operatorData.school),
    ]


    return (
        <Box>
            {/* <PageTitle title={t("operator.details") + " - " + operatorData.first_name + " " + operatorData.last_name} /> */}

            <LoadingView loading={checkLoading()} />

            {/* Contents */}
            {operatorData.first_name ?
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
                        {/* operator details */}

                        <Sheet
                            variant="outlined"

                            sx={{
                                display: 'flex',
                                // width: ,
                                flexDirection: {xs: 'column', md: 'row'},
                                alignItems:'center',
                                backgroundColor: 'background.body',
                                p: 2,
                                gap: { xs: 1, md: 3 },
                                borderRadius: 6
                            }}>
                            <Avatar sx={{ height: 120, width: 120, borderRadius: 6 }} />
                            {/* <Divider orientation="horizontal" /> */}
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.6, width: '100%' }}>
                                <Typography level="h3">{operatorData.first_name + " " + operatorData.middle_name + " " + operatorData.last_name}</Typography>
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
                                    {t("operator.edit")}
                                </Button>
                            </Box>
                        </Sheet>


                        {/* Students */}
                        {operatorData.sessions.length > 0 &&
                            <Card
                                sx={{
                                    display: { xs: 'none', md: 'flex' },
                                    justifyContent: 'center',
                                    // alignItems: 'center',
                                    boxShadow: 'sm',
                                    backgroundColor: 'background.body'
                                }}>
                                <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                    <Typography
                                        startDecorator={<TimerOutlined />}
                                        level="title-md">
                                        {t("session.title")}
                                    </Typography>
                                    <Divider />
                                    <Table>
                                        <thead>
                                            <th style={{ padding: "10px 6px", width: 50 }}>{t("session.type")}</th>
                                            <th style={{ padding: "10px 6px", width: 50 }}>{t("session.status")}</th>
                                            <th style={{ padding: "10px 6px", width: 80 }}>{t("session.start_at")}</th>
                                            <th style={{ padding: "10px 6px", width: 80 }}>{t("session.end_at")}</th>
                                        </thead>
                                        <tbody>
                                            {operatorData.sessions.map((item, index) => (
                                                <tr>
                                                    <td>{{
                                                        "lunch": t("session.lunch"),
                                                        "dinner": t("session.dinner"),
                                                        "breakfast": t("session.breakfast")
                                                    }[item.type]}</td>
                                                    <td><Typography
                                                        color={
                                                            {
                                                                "completed": 'success',
                                                                "active": 'neutral',
                                                                "cancelled": 'danger',
                                                            }[item.status] as ColorPaletteProp
                                                        }
                                                    >
                                                        {{
                                                            "active": t("status.active"),
                                                            "completed": t("status.complete"),
                                                            "cancelled": t("status.cancelled")
                                                        }[item.status]}
                                                    </Typography></td>
                                                    <td>{formatDate(item.start_at)}</td>
                                                    <td>{formatDate(item.end_at)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </Table>
                                </CardContent>
                            </Card>}
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
                    <DialogTitle>{t("operator.add")}</DialogTitle>
                    <DialogContent>{t("init.enterDetails")}</DialogContent>
                    <Stack component='form' onSubmit={handleSubmit} gap={2} sx={{ mt: 2 }}>

                        <Stack direction={{ xs: 'column', md: 'row' }} gap={2}>
                            {/* first name */}
                            <FormControl sx={{ flex: 1 }} required>
                                <FormLabel>{t("operator.firstName")}</FormLabel>
                                <Input type="text" name="first_name" value={operatorData.first_name} onChange={handleChange} placeholder={t("init.placeholder") + t("operator.firstName")} />
                            </FormControl>

                            {/* second name */}
                            <FormControl sx={{ flex: 1 }} required>
                                <FormLabel>{t("operator.middleName")}</FormLabel>
                                <Input type="text" name="middle_name" value={operatorData.middle_name} onChange={handleChange} placeholder={t("init.placeholder") + t("operator.middleName")} />
                            </FormControl>

                            {/* last name */}
                            <FormControl sx={{ flex: 1 }} required>
                                <FormLabel>{t("operator.lastName")}</FormLabel>
                                <Input type="text" name="last_name" value={operatorData.last_name} onChange={handleChange} placeholder={t("init.placeholder") + t("operator.lastName")} />
                            </FormControl>
                        </Stack>

                        <Stack direction={{ xs: 'column', md: 'row' }} gap={2}>
                            {/* username */}
                            <FormControl sx={{ flex: 1 }} required>
                                <FormLabel>{t("operator.username")}</FormLabel>
                                <Input type="text" name="username" value={operatorData.username} onChange={handleChange} placeholder={t("init.placeholder") + t("operator.username")} />
                            </FormControl>

                            {/* gender */}
                            <FormControl sx={{ flex: 1 }} required>
                                <FormLabel>{t("operator.gender")}</FormLabel>
                                <Select name="gender" defaultValue={operatorData.gender} value={operatorData.gender}
                                    placeholder={t("init.select") + t("operator.gender")}
                                    onChange={(e, value) => setOperatorData({ ...operatorData, gender: value })}>
                                    {[{ value: 'M', label: t("operator.male") }, { value: 'F', label: t("operator.female") }].map((item, index) => (
                                        <Option key={index} value={item.value}>{item.label}</Option>
                                    ))}
                                </Select>
                            </FormControl>
                        </Stack>

                        <Stack direction={{ xs: 'column', md: 'row' }} gap={2}>

                            {/* email */}
                            <FormControl sx={{ flex: 1 }} required>
                                <FormLabel>{t("operator.email")}</FormLabel>
                                <Input type="text" name="email" value={operatorData.email} onChange={handleChange} placeholder={t("init.placeholder") + t("operator.email")} />
                            </FormControl>

                            {/* mobile */}
                            <FormControl sx={{ flex: 1 }} required>
                                <FormLabel>{t("operator.mobile")}</FormLabel>
                                <Input type="text" name="mobile" value={operatorData.mobile} onChange={handleChange} placeholder={t("init.placeholder") + t("operator.mobile")} />
                            </FormControl>
                        </Stack>

                        <Stack direction={{ xs: 'column', md: 'row' }} gap={2}>
                            {/* school name */}
                            <FormControl sx={{ flex: 1 }} required>
                                <FormLabel>{t("operator.schoolName")}</FormLabel>
                                <Select name="school" defaultValue={operatorData.school_value} value={operatorData.school_value}
                                    placeholder={t("init.select") + t("student.schoolName")}
                                    onChange={(e, value) => setOperatorData({ ...operatorData, school_value: value })}>
                                    {schoolStatus === STATUS.SUCCESS ? schoolList.results.map((item, index) => (
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
        schoolListResult: schoolList,
        schoolListStatus: schoolStatus,
    } = resources

    const {
        operatorDetailsStatus: detailsStatus,
        operatorDetailsResult: detailsResult,
        operatorDetailsErrorMessage: detailsErrorMessage,
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

export default connect(mapStateToProps, {})(OperatorDetailsPage)