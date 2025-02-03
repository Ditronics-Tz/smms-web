import React, { Fragment, useEffect } from "react";
import { Typography, Box } from "@mui/joy";
import { toast } from 'react-toastify';
import { Main, PageTitle } from "../../../components";

const ApiUsagePage = () => {

    // useEffect(() => {
    //     toast.success('Welcome')
    // },[])
    return (
            <Box>
                <PageTitle title={'API Usage'} />

                <Typography>
                    details about Api usage will be shown here
                </Typography>
            </Box>





    )
}

export default ApiUsagePage