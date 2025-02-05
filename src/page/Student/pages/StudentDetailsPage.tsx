import React, { Fragment, useEffect, useState } from "react";
import { Typography, Box, Table, AspectRatio, Card, CardContent, Divider, ButtonGroup, Button, Sheet, Modal, ModalOverflow, ModalDialog, ModalClose, DialogTitle, DialogContent, Stack, FormControl, FormLabel, Input, Select, Option, Avatar, Chip, ColorPaletteProp, ListDivider } from "@mui/joy";
import { toast } from 'react-toastify';
import { LoadingView, Main, NotFoundMessage, PageTitle } from "../../../components";
import { useLocation, useNavigate } from "react-router-dom";
import { FILE_BASE, STATUS } from "../../../constant";
import { connect, useDispatch } from "react-redux";
import { useMediaQuery } from "@mui/material";
import {
    studentEditRequest,
    studentEditReset,
    studentDetailsRequest,
    studentDetailsReset,
} from '../../../store/actions'
import { AddCardOutlined, BlockOutlined, CheckCircle, DeleteOutline, DoNotDisturbOn, EditOutlined, FolderOpenOutlined, LocationOn, RemoveRedEyeOutlined, TaskAltOutlined, WarningRounded } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { formatDate, thousandSeparator } from "../../../utils";

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
        school_name: "",
        profile_picture: null,
        rfid_card: null,
        parents: []
    }


    const [formModal, setFormModal] = useState(false);
    const [accForm, setAccForm] = useState(false);
    const [rejectModal, setRejectModal] = useState(false);
    const [deactivateModal, setDeactivateModal] = useState(false);

    const [studentData, setStudentData] = useState(initiateStudentData);

    useEffect(() => {
        if (detailsStatus === STATUS.SUCCESS) {
            setStudentData({
                student_id: detailsResult.id,
                first_name: detailsResult.first_name,
                middle_name: detailsResult.middle_name,
                last_name: detailsResult.last_name,
                gender: detailsStatus.gender,
                class_room: detailsResult.class_room,
                school_name: detailsResult.school_name,
                profile_picture: detailsResult.profile_picture,
                rfid_card: detailsResult.rfid_card,
                parents: detailsResult.parents,
            });

        }
        else if (detailsStatus === STATUS.ERROR) {
            dispatch(studentDetailsReset());
            toast.error(detailsErrorMessage)
        }
    })


    useEffect(() => {
        if (studentData.student_id != "") {
            dispatch(studentDetailsRequest(accessToken, { "student_id": studentData.student_id }))
        }
    }, [])


    const submitForm = (event) => {
        event.preventDefault()
        if (studentData.first_name) {
            const formData = new FormData();

            // Append non-file data
            formData.append("student_id", studentData.student_id);
            formData.append("first_name", studentData.first_name);
            formData.append("middle_name", studentData.middle_name);
            formData.append("last_name", studentData.last_name);
            formData.append("gender", studentData.gender);
            formData.append("class_room", studentData.class_room);
            formData.append("school_name", studentData.school_name);

            // Append file only if selected
            if (studentData.profile_picture) {
                formData.append("profile_picture", studentData.profile_picture);
            }

            // Append arrays as JSON strings
            // formData.append("parents", JSON.stringify(studentData.parents));
            // formData.append("transactions", JSON.stringify(studentData.transactions));

            dispatch(studentEditRequest(accessToken, formData))
        } else {
            toast.error(t("init.emptyErr"))
        }
    }
    // ------ actions -------------------------
    const activateAgent = () => {
        // const data = {
        //     "id": agent_id
        // }
        // dispatch(activateAgentRequest(loginResult.token, data));
    }

    const deactivateAgent = (event) => {
        event.preventDefault()
        // const data = {
        //     "id": agent_id,
        //     "remark": remark
        // }
        // dispatch(deactivateAgentRequest(loginResult.token, data));
    }

    const checkLoading = () => {
        if (detailsStatus === STATUS.LOADING || editStatus === STATUS.LOADING) {
            return true
        } else {
            return false
        }
    }

    const rows = [
        CreateItems(t("student.firstName"), studentData.first_name),
        CreateItems(t("student.middleName"), studentData.middle_name),
        CreateItems(t("student.lastName"), studentData.last_name),
        CreateItems(t("student.gender"), studentData.gender),
        CreateItems(t("student.classRoom"), studentData.class_room),
        CreateItems(t("student.schoolName"), studentData.school_name),
    ]


    return (
        <Box>
            <PageTitle title={t("student.details") + " - " + studentData.first_name + " " + studentData.last_name} />

            <LoadingView loading={checkLoading()} />

            {/* Contents */}
            {studentData.first_name ?
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    maxWidth: "1200px",
                    gap: 4
                }}>

                    {/* Action Button */}
                    <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', md: 'row' }, alignSelf: 'flex-end' }}>

                        {/* only sale officer can edit */}
                        <Button
                            color="primary"
                            startDecorator={<EditOutlined />}
                            onClick={() => setFormModal(true)}>
                            {t("student.edit")}
                        </Button>
                    </Box>

                    {/* Details */}
                    <Box sx={{ gap: 2, display: 'flex', flexDirection: 'column' }}>
                        {/* student details */}
                        <Box sx={{
                            display: 'flex',
                            flexDirection: { xs: 'column', md: 'row' },
                            gap: 2
                        }}>
                            <Sheet
                                className="OrderTableContainer"
                                variant="outlined"
                                sx={{
                                    borderRadius: 'sm',
                                    flexShrink: 1,
                                    overflow: 'auto',
                                    maxWidth: '600px',
                                    minHeight: 0,
                                }}
                            >
                                <Table
                                    aria-labelledby="tableTitle"
                                    stickyHeader
                                    hoverRow
                                    sx={{
                                        '--TableCell-headBackground': 'var(--joy-palette-background-level2)',
                                        '--Table-headerUnderlineThickness': '1px',
                                        '--TableRow-hoverBackground': 'var(--joy-palette-background-level1)',
                                        '--TableCell-paddingY': '4px',
                                        '--TableCell-paddingX': '8px',
                                    }}>
                                    <thead>
                                        <tr>
                                            <th style={{ width: '40%', fontSize: 18 }}>
                                                {studentData.profile_picture && <Avatar size="lg" sx={{ width: 80, height: 80 }} src={FILE_BASE + studentData.profile_picture} />}
                                                <br />
                                                {t("student.details")}</th>
                                            <th ></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {rows.map((row, index) => (
                                            <tr key={index}>
                                                <td><b>{row.title}</b></td>
                                                <td>{row.value}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </Sheet>

                            {studentData.rfid_card &&
                                <Sheet
                                    variant="outlined"
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        maxWidth: { xs: 'unset', md: '400px' },
                                        backgroundColor: '#BDBDBD50',
                                        // background: 'linear-gradient(297deg, rgba(219,219,219,1) 0%, rgba(219,219,219,0.6741290266106443) 70%, rgba(215,152,152,0.29037552521008403) 100%)',
                                        p: 2,
                                        borderRadius: 'sm',
                                        gap: 0.5
                                    }}>
                                    <Box sx={{
                                        height: 20,
                                        width: 4,
                                        backgroundColor: 'blueviolet',
                                        position: 'absolute',
                                        top: -12,
                                        left: 20,
                                        // alignSelf: 'center',
                                        borderRadius: 'sm'
                                    }} />

                                    <Box sx={{
                                        height: 20,
                                        width: 4,
                                        backgroundColor: 'blueviolet',
                                        position: 'absolute',
                                        top: -12,
                                        right: 20,
                                        // alignSelf: 'center',
                                        borderRadius: 'sm'
                                    }} />

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
                        </Box>


                        {/* Parent*/}
                        {studentData.parents.length > 0 &&
                            <Sheet
                                className="OrderTableContainer"
                                variant="outlined"
                                sx={{
                                    maxWidth: "600px",
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
                                        '--TableCell-headBackground': 'var(--joy-palette-background-level2)',
                                        '--Table-headerUnderlineThickness': '1px',
                                        '--TableRow-hoverBackground': 'var(--joy-palette-background-level1)',
                                        '--TableCell-paddingY': '4px',
                                        '--TableCell-paddingX': '8px',
                                    }}>
                                    <thead>
                                        <tr>
                                            <th style={{ width: '40%', fontSize: 18 }}>{t("student.parents")}</th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    {studentData.parents.map((item, index) => (
                                        <tbody key={index}>
                                            <tr>
                                                <td><b>{t("student.firstName")}</b></td>
                                                <td>{item.first_name}</td>
                                            </tr>
                                            <tr>
                                                <td><b>{t("student.lastName")}</b></td>
                                                <td>{item.last_name}</td>
                                            </tr>
                                            <tr>
                                                <td><b>{t("parent.email")}</b></td>
                                                <td>{item.email}</td>
                                            </tr>
                                            <tr>
                                                <td><b>{t("parent.mobile")}</b></td>
                                                <td>{item.mobile_number}</td>
                                            </tr>
                                            <tr style={{ height: '15px' }}></tr>
                                        </tbody>
                                    ))}
                                </Table>
                            </Sheet>}
                    </Box>

                </Box>
                :
                <NotFoundMessage />}
        </Box>
    )
}

const mapStateToProps = ({ user, auth }) => {
    const { accessToken } = auth
    const {
        studentEditStatus: editStatus,
        studentEditResult: editResult,
        studentEditErrorMEessage: editErrorMessage,

        studentDetailsStatus: detailsStatus,
        studentDetailsResult: detailsResult,
        studentDetailsErrorMessage: detailsErrorMessage,
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

export default connect(mapStateToProps, {})(StudentDetailsPage)