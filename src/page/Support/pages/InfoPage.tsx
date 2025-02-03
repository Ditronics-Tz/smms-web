import React, { Fragment, useEffect } from "react";
import { Typography, Box } from "@mui/joy";
import { toast } from 'react-toastify';
import { Main, PageTitle } from "../../../components";

const InfoPage = () => {

    // useEffect(() => {
    //     toast.success('Welcome')
    // },[])
    return (
            <Box>
                <PageTitle title={'Bank Infomartions'} />

                <Typography>
                    All Infomartions will be shown here
                </Typography>
            </Box>





    )
}

export default InfoPage