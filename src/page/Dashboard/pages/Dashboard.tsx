import React, { useEffect, useState } from "react";
import { Box, Button, Typography } from "@mui/joy";
import AdminDashboard from "./AdminDashboard";
import { connect } from "react-redux";
import { fetchPDF } from "../../../utils";
import { DownloadRounded, StartRounded } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { NAVIGATE_TO_SESSIONPAGE } from "../../../route/types";
import { toast } from "react-toastify";
import OperatorDashboard from "./OperatorDashboard";
import ParentDashboard from "./ParentDashboard";

const Dashboard = ({
    accessToken,
    loginResult
}) => {
    const navigate = useNavigate()
    const { t } = useTranslation()

    const [name, setName] = useState("")
    const [role, setRole] = useState("")

    useEffect(() => {
        if (loginResult) {
            setName(loginResult.user.first_name)
            setRole(loginResult.user.role)
        }
    }, [loginResult])

    const generateReport = () => {
        if (role === 'admin' || role === 'parent'){
            return fetchPDF(accessToken, "/dashboard/end-of-day-report")
        }
        else if (role === 'operator'){
            return navigate(NAVIGATE_TO_SESSIONPAGE)
        }
        else {
            toast.error("400 Bad Request")
            return null
        }
    }

    const renderDashboads = () => {
        if (role === 'admin'){
            return (
                <AdminDashboard/>
            )
        }
        else if (role === 'parent'){
            return <ParentDashboard/>
        }
        else if (role === 'operator'){
            return  <OperatorDashboard/>
        }
        else{
            return null
        }
    }

    return (
        <Box>
            <Box sx={{ display: 'flex', flexDirection: {xs: "column", md: "row"}, justifyContent: "space-between", py: 2 }}>
                <Box>
                    <Typography level="title-lg">{t("home.welcome")}, {name}</Typography>
                    <Typography level="body-sm">{t("home.desc")}</Typography>
                </Box>
                <Button
                    size="sm"
                    color="success"
                    startDecorator={role === 'admin' || role === 'parent' ? <DownloadRounded /> : <StartRounded/>}
                    onClick={generateReport}>
                        {role === 'admin' || role === 'parent' ? t("home.download") : t("home.start") + " " + t("home.session")}
                </Button>
            </Box>

            {/* Show Dashboard details depend on role */}
            {renderDashboads()}
        </Box>
    )
}

const mapStateToProps = ({ auth }) => {
    const { accessToken, loginResult } = auth

    return {
        accessToken,
        loginResult
    }
}


export default connect(mapStateToProps, {})(Dashboard)