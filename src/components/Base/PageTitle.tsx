import { Box, Divider, Typography } from "@mui/joy";
import React from "react";

const PageTitle = ({ title }) => {
    return (
        <Box sx={{ pb: 1, }} >
            <Typography level='h4' sx={{pb: 0.5}}>{title}</Typography>
            <Divider/>
        </Box>
    )
}

export default PageTitle