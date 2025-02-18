import React, { useEffect, useState } from "react";
import { Box, Button, Typography } from "@mui/joy";
import AdminDashboard from "./AdminDashboard";
import { connect } from "react-redux";
import { fetchPDF } from "../../../utils";
import { DownloadRounded } from "@mui/icons-material";
import { useTranslation } from "react-i18next";

const Dashboard = ({
    accessToken,
    loginResult
}) => {

    const [name, setName] = useState("")
    const { t } = useTranslation()

    useEffect(() => {
        if (loginResult) {
            setName(loginResult.user.first_name)
        }
    }, [loginResult])

    const generateReport = () => {
        fetchPDF(accessToken, "/dashboard/end-of-day-report")
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
                    startDecorator={<DownloadRounded />}
                    onClick={generateReport}>
                    {t("home.download")}
                </Button>
            </Box>

            {/* <LoadingView loading={true}/> */}
            <AdminDashboard />



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