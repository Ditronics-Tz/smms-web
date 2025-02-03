import React, { Fragment, useEffect } from "react";
import { Typography, Box } from "@mui/joy";
import { toast } from 'react-toastify';
import { Main, PageTitle } from "../../../components";

const TransactionPage = () => {

    // useEffect(() => {
    //     toast.success('Welcome')
    // },[])
    return (
            <Box>
                <PageTitle title={'Transactions'} />

                <Typography>
                    All transations will be shown here
                </Typography>
            </Box>





    )
}

export default TransactionPage