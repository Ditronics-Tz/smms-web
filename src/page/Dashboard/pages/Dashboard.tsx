import React, { useEffect, useState } from "react";
import { Box, Typography } from "@mui/joy";
import AdminDashboard from "./AdminDashboard";
import { connect } from "react-redux";

const Dashboard = ({
    accessToken,
    loginResult
}) => {

    const [name, setName] = useState("")

    useEffect(() => {
        if (loginResult){
            setName(loginResult.user.first_name)
        }
    },[loginResult])

    return (
        <Box>
            <Box sx={{ py: 1}}>
                <Typography level="title-lg">Welcome Back, {name}</Typography>
                <Typography level="body-sm">Here is your summary details</Typography>
            </Box>

            {/* <LoadingView loading={true}/> */}
            <AdminDashboard/>



        </Box>
    )
}

const mapStateToProps = ({auth}) => {
    const {accessToken, loginResult} = auth

    return {
        accessToken,
        loginResult
    }
}


export default connect(mapStateToProps,{})(Dashboard)