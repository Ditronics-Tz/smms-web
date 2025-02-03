import React, { Fragment, useEffect } from "react";
import { Typography, Box } from "@mui/joy";
import { toast } from 'react-toastify';
import { Main, PageTitle } from "../../../components";

const ProfilePage = () => {
    return (
            <Box>
                <PageTitle title={'ProfilePage'} />
                <Typography>
                    User details will be shown here
                </Typography>
            </Box>




    )
}

export default ProfilePage