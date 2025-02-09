import React, { Fragment, lazy, useEffect, useState } from "react";
import { Typography, Box, Table, AspectRatio, Card, CardContent, Divider, ButtonGroup, Button, Sheet, Modal, ModalOverflow, ModalDialog, ModalClose, DialogTitle, DialogContent, Stack, FormControl, FormLabel, Input, Select, Option, Avatar, Chip, ColorPaletteProp, ListDivider } from "@mui/joy";
import { toast } from 'react-toastify';
import { LoadingView, Main, NotFoundMessage, PageTitle } from "../../../components";
import { useLocation, useNavigate } from "react-router-dom";
import { FILE_BASE, STATUS } from "../../../constant";
import { connect, useDispatch } from "react-redux";
import { useMediaQuery } from "@mui/material";
import {
    editUserRequest,
    editUserReset,
    studentDetailsRequest,
    studentDetailsReset,
} from '../../../store/actions'
import { AddCardOutlined, BlockOutlined, CheckCircle, DeleteOutline, DoNotDisturbOn, EditOutlined, FolderOpenOutlined, LocationOn, RemoveRedEyeOutlined, TaskAltOutlined, WarningRounded } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { formatDate, thousandSeparator } from "../../../utils";
import image from "../../../constant/image";

function CreateItems(
    title: String,
    value: String
) {
    return { title, value }
}



const StudentDetailsPage = ({
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

    const initiateStudentData = {
        student_id: id,
        first_name: "",
        middle_name: "",
        last_name: "",
        gender: "",
        class_room: "",
        school: null,
        school_value: "",
        rfid_card: null,
        parents: [],
        profile_picture: null,
        profile_picture_url: ""
    }


    const [formModal, setFormModal] = useState(false);

    const [studentData, setStudentData] = useState(initiateStudentData);

    useEffect(() => {
        if (detailsStatus === STATUS.SUCCESS) {
            setStudentData({
                student_id: detailsResult.id,
                first_name: detailsResult.first_name,
                middle_name: detailsResult.middle_name,
                last_name: detailsResult.last_name,
                gender: detailsResult.gender,
                class_room: detailsResult.class_room,
                school: detailsResult.school,
                school_value: detailsResult.school_id,
                profile_picture: null,
                rfid_card: detailsResult.rfid_card,
                parents: detailsResult.parents,
                profile_picture_url: detailsResult.profile_picture,
            });
        }
        else if (detailsStatus === STATUS.ERROR) {
            dispatch(studentDetailsReset());
            toast.error(detailsErrorMessage)
        }

        if (editStatus === STATUS.SUCCESS) {
            toast.success(editResult.message);
            setFormModal(false);
            dispatch(studentDetailsRequest(accessToken, { "student_id": studentData.student_id }))
            dispatch(editUserReset())
        }
        else if (editStatus === STATUS.ERROR) {
            toast.error(editErrorMessage);
            dispatch(editUserReset())
        }
    }, [detailsStatus, editStatus])


    useEffect(() => {
        if (studentData.student_id != "") {
            dispatch(studentDetailsRequest(accessToken, { "student_id": studentData.student_id }))
        }
    }, [])


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
            profile_picture_url: URL.createObjectURL(file)
        }));
    };

    // ---- Submit function
    const handleSubmit = (event) => {
        event.preventDefault()
        if (studentData.first_name) {
            const formData = new FormData();

            // Append non-file data
            formData.append("user_id", studentData.student_id);
            formData.append("first_name", studentData.first_name);
            formData.append("middle_name", studentData.middle_name);
            formData.append("last_name", studentData.last_name);
            formData.append("gender", studentData.gender);
            formData.append("class_room", studentData.class_room);
            formData.append("school", studentData.school_value);
            formData.append("role", "student");

            // Append file only if selected
            if (studentData.profile_picture) {
                formData.append("profile_picture", studentData.profile_picture);
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
        CreateItems(t("student.gender"), { 'M': t("student.male"), 'F': t("student.female") }[studentData.gender]),
        CreateItems(t("student.schoolName"), studentData.school && studentData.school),
        CreateItems(t("student.classRoom"), studentData.class_room),
    ]

    const parentDetails = (item) => [
        CreateItems(t("student.gender"), { 'M': t("student.male"), 'F': t("student.female") }[item.gender]),
        CreateItems(t("parent.email"), item.email),
        CreateItems(t("parent.mobile"), item.mobile_number),
    ]


    return (
        <Box>
            {/* <PageTitle title={t("student.details") + " - " + studentData.first_name + " " + studentData.last_name} /> */}

            <LoadingView loading={checkLoading()} />

            {/* Contents */}
            {studentData.first_name ?
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'flex-start',
                    maxWidth: "1200px",
                    gap: 4
                }}>

                    {/* Details */}
                    <Box sx={{ display: 'flex', gap: 2, flexDirection: 'column' }}>
                        {/* student details */}
                        <Sheet
                            variant="outlined"

                            sx={{
                                display: 'flex',
                                flexDirection: 'row',
                                width: { xs: '100%', md: '800px' },
                                backgroundColor: 'background.body',
                                p: 2,
                                gap: {xs: 1, md: 3},
                                borderRadius: 6
                            }}>
                            <Avatar
                                src={FILE_BASE + studentData.profile_picture_url}
                                sx={{ height: 160, width: 140, borderRadius: 6 }} />

                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, width: '100%' }}>
                                <Typography level="h3">{studentData.first_name + " " + studentData.middle_name + " " + studentData.last_name}</Typography>
                                <Divider />
                                {rows.map((item, index) => (
                                    <Typography level="body-sm" key={index}><b>{item.title}:</b> {item.value}</Typography>
                                ))}
                                <Divider />
                                <Button
                                    size="sm"
                                    color="neutral"
                                    variant="outlined"
                                    sx={{ alignSelf: 'flex-start', borderRadius: 100 }}
                                    startDecorator={<EditOutlined />}
                                    onClick={() => setFormModal(true)}>
                                    {t("student.edit")}
                                </Button>
                            </Box>
                        </Sheet>
                        <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: "column", md: "row" } }}>
                            {studentData.rfid_card &&
                                <Sheet
                                    variant="outlined"
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        maxWidth: { xs: 'unset', md: '400px' },
                                        backgroundColor: 'background.level1',
                                        p: 2,
                                        borderRadius: 'sm',
                                        gap: 0.5
                                    }}>

                                    <Typography level='title-md'>{t("student.card")}</Typography>
                                    <ListDivider sx={{ mb: 1 }} />

                                    <Typography level="title-sm" textAlign={"center"}>{t("student.balance")}</Typography>
                                    <Typography level="h3" textAlign={"center"}>Tsh. {thousandSeparator(studentData.rfid_card.balance)}</Typography>
                                    <Chip
                                        variant="solid"
                                        size="sm"
                                        sx={{ alignSelf: 'center', mb: 1 }}
                                        color={
                                            {
                                                true: 'success',
                                                false: 'danger'
                                            }[studentData.rfid_card.is_active] as ColorPaletteProp
                                        }
                                    >
                                        {{
                                            true: t("status.active"),
                                            false: t("status.inactive")
                                        }[studentData.rfid_card.is_active]}
                                    </Chip>

                                    <Divider />
                                    <Typography ><b>{t("student.card_number")}:</b> {studentData.rfid_card.card_number}</Typography>
                                    <Typography ><b>{t("student.controlNumber")}:</b> {studentData.rfid_card.control_number}</Typography>
                                    <Typography ><b>{t("student.issue")}:</b> {formatDate(studentData.rfid_card.issued_date)}</Typography>
                                </Sheet>}

                            {/* Parent*/}
                            {studentData.parents.length > 0 &&
                                <Sheet
                                    variant="outlined"
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'row',
                                        width: { xs: 'unset', md: '400px' },
                                        backgroundColor: 'background.body',
                                        p: 2,
                                        gap: 1,
                                        borderRadius: 6
                                    }}>
                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.6, width: '100%' }}>
                                        <Typography level="h4">{t("parent.details")}</Typography>
                                        <Divider />
                                        {studentData.parents.map((item, index) => (
                                            <Box key={index} sx={{ display: 'flex', flexDirection: 'column', gap: 0.6, width: '100%' }}>
                                                <Typography level="title-md">{item.first_name + " " + item.last_name}</Typography>
                                                {parentDetails(item).map((dt, id) => (
                                                    <Typography key={id} level="body-sm"><b>{dt.title}:</b> {dt.value}</Typography>
                                                ))}
                                                <Divider />
                                            </Box>
                                        ))}
                                    </Box>

                                </Sheet>}
                        </Box>



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
                    <DialogTitle>{t("student.add")}</DialogTitle>
                    <DialogContent>{t("init.enterDetails")}</DialogContent>
                    <Stack component='form' onSubmit={handleSubmit} gap={2} sx={{ mt: 2 }}>

                        {/* Edit student profile */}
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignSelf: 'center', gap: 1, alignItems: 'center' }}>
                            <Avatar
                                size="lg"
                                sx={{ width: 100, height: 100, borderRadius: 4 }}
                                src={studentData.profile_picture ? studentData.profile_picture_url : FILE_BASE + studentData.profile_picture_url} />
                            <input type="file" hidden id="profile_picture" style={{ display: 'None' }} onChange={handleFileChange} />

                            <Button
                                size="sm"
                                variant="outlined"
                                color='neutral'
                                sx={{ borderRadius: 100 }}>
                                <label htmlFor="profile_picture" style={{ width: '100%', alignItems: 'center' }}>{t("student.changeProfile")}</label>
                            </Button>

                        </Box>

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
                        </Stack>

                        <Stack direction={{ xs: 'column', md: 'row' }} gap={2}>
                            {/* school name */}
                            <FormControl sx={{ flex: 1 }} required>
                                <FormLabel>{t("student.schoolName")}</FormLabel>
                                <Select name="school" defaultValue={studentData.school_value} value={studentData.school_value}
                                    placeholder={t("init.select") + t("student.schoolName")}
                                    onChange={(e, value) => setStudentData({ ...studentData, school_value: value })}>
                                    {schoolStatus === STATUS.SUCCESS ? schoolList.results.map((item, index) => (
                                        <Option key={index} value={item.id}>{item.name}</Option>
                                    )) : <Option value={null}>{t("school.NoList")}</Option>}
                                </Select>
                            </FormControl>

                            {/* class room */}
                            <FormControl sx={{ flex: 1 }} required>
                                <FormLabel>{t("student.classRoom")}</FormLabel>
                                <Input type="text" name="class_room" value={studentData.class_room} onChange={handleChange} placeholder={t("init.placeholder") + t("student.classRoom")} />
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

const mapStateToProps = ({ user, auth, school }) => {
    const {
        accessToken,

        editUserStatus: editStatus,
        editUserResult: editResult,
        editUserErrorMEessage: editErrorMessage,
    } = auth

    const {
        schoolListResult: schoolList,
        schoolListStatus: schoolStatus,
    } = school
    const {
        studentDetailsStatus: detailsStatus,
        studentDetailsResult: detailsResult,
        studentDetailsErrorMessage: detailsErrorMessage,
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

export default connect(mapStateToProps, {})(StudentDetailsPage)