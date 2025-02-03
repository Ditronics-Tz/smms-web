import React, { Fragment, useEffect } from "react";
import { Typography, Box } from "@mui/joy";
import { toast } from 'react-toastify';
import { Main, PageTitle } from "../../../components";

const ApiAccessPage = () => {

    // useEffect(() => {
    //     toast.success('Welcome')
    // },[])
    return (
            <Box>
                <PageTitle title={'API Access'} />

                <Typography>
                    details about api will be shown here
                </Typography>
            </Box>





    )
}

export default ApiAccessPage