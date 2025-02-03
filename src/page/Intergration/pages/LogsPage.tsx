import React, { Fragment, useEffect } from "react";
import { Typography, Box } from "@mui/joy";
import { toast } from 'react-toastify';
import { Main, PageTitle } from "../../../components";

const LogsPage = () => {
    return (
            <Box>
                <PageTitle title={'Logs'} />

                <Typography>
                    All logs will be shown here
                </Typography>
            </Box>

    )
}

export default LogsPage