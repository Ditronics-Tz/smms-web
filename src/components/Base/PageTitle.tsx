import { Box, Divider, ListDivider, Typography } from "@mui/joy";
import React from "react";

const PageTitle = ({ title }) => {
    return (
        <Box sx={{ pb: 1, }} >
            <Typography level='h3' sx={{pb: 1}}>{title}</Typography>
            <Divider/>
        </Box>
    )
}

export default PageTitle