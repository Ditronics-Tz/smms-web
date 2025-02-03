import React, { Fragment, useEffect } from "react";
import { Typography, Box } from "@mui/joy";
import { toast } from 'react-toastify';
import { Main, PageTitle } from "../../../components";

const SupportPage = () => {

    // useEffect(() => {
    //     toast.success('Welcome')
    // },[])
    return (
        <Fragment>
            <Box>
                <PageTitle title={'Support'} />
                {/* <Typography variant="div"> */}
                {/* <ToastContainer /> */}
                <Typography>
                    {/* How can we help you */}
                </Typography>
                {/* </Typography> */}
            </Box>

            <Box
                sx={{
                    height: 150,
                    borderRadius: 5,
                    border: 0.5,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: 12
                }}
            >
                <Box
                    sx={{
                        display: '',


                    }}
                >
                    <Box sx={{
                        display: 'flex',
                        justifyContent: 'center'
                    }}>
                        <Typography level='title-md'>Call customer support</Typography>
                    </Box>



                    <Box
                        sx={{
                            backgroundColor: "primary",
                            justifyContent: 'center',
                            alignItems: 'center',
                            display: 'flex',
                            height: 50,
                            width: 250,
                            borderRadius: 4,
                            mt: 1

                        }}
                    >
                        <Typography sx={{ color: 'white' }}>+255 785 907 500</Typography>
                    </Box>




                </Box>

                <Box
                    sx={{
                        display: '',


                    }}
                >

                    <Box sx={{
                        display: 'flex',
                        justifyContent: 'center'
                    }}>
                        <Typography level='title-md'>Email customer support</Typography>
                    </Box>

                    <Box
                        sx={{
                            backgroundColor: '',
                            justifyContent: 'center',
                            alignItems: 'center',
                            display: 'flex',
                            height: 50,
                            width: 250,
                            borderRadius: 4,
                            mt: 1

                        }}
                    >
                        <Typography sx={{ color: 'white' }}>support@sava.co.tz</Typography>
                    </Box>




                </Box>


            </Box>
        </Fragment>




    )
}

export default SupportPage