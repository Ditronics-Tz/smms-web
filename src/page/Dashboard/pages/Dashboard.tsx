import React, {  } from "react";
import { Typography, Box, Card, Grid } from "@mui/joy";
import { PageTitle } from "../../../components";
import { CardContent } from "@mui/material";
import { Folder, GroupOutlined, PaidOutlined, Person } from "@mui/icons-material";
import {  NAVIGATE_TO_OPERATORPAGE, NAVIGATE_TO_PARENTPAGE, NAVIGATE_TO_STUDENTPAGE, NAVIGATE_TO_TRANSACTIONPAGE } from "../../../route/types";
import { Link } from "react-router-dom";

const Dashboard = () => {

    const cardsItems = [
        {
            title: 'Total Students',
            icon: <GroupOutlined sx={{ color: 'black', fontSize: '30px' }} />,
            iconBgColor: 'greenyellow',
            number: "57",
            action: NAVIGATE_TO_STUDENTPAGE
        },
        {
            title: 'Total Parents',
            icon: <Person sx={{ color: 'white', fontSize: '30px' }} />,
            iconBgColor: 'blue',
            number: "10",
            action: NAVIGATE_TO_PARENTPAGE
        },
        {
            title: 'Total Operators',
            icon: <Folder sx={{ color: 'white', fontSize: '30px' }} />,
            iconBgColor: 'purple',
            number: "103",
            action: NAVIGATE_TO_OPERATORPAGE
        },
        {
            title: 'Transactions',
            icon: <PaidOutlined sx={{ color: 'white', fontSize: '30px' }} />,
            iconBgColor: 'green',
            number: "1,350",
            action: NAVIGATE_TO_TRANSACTIONPAGE
        }
    ]


    return (
        <Box>
            <PageTitle title={'Dashboard' } />

            {/* <LoadingView loading={true}/> */}

            {/* card counts */}
            <Grid container
                spacing={{ xs: 1, md: 1 }}
                columns={{ xs: 4, sm: 8, md: 12 }}
                sx={{ flexGrow: 1 }}>
                {cardsItems.map((item, index) => (
                    <Grid xs={2} sm={3} md={3} key={index}>
                        <Link to={item.action} style={{ textDecoration: 'none'}}>
                            <Card
                                sx={{
                                    // width: { sx: '120px', md: '300px' },
                                    backgroundColor: 'background.popup',
                                    boxShadow: 'sm',
                                    p: 0
                                }}>
                                <CardContent>
                                    <Box
                                        sx={{ display: 'flex', gap: 1 }}>
                                        <Card variant="soft"
                                            sx={{
                                                backgroundColor: item.iconBgColor,
                                                width: '65px',
                                                height: '65px',
                                                justifyContent: 'center',
                                                alignItems: 'center'
                                            }}>
                                            {item.icon}
                                        </Card>
                                        <Box>
                                            <Typography level="body-sm">{item.title}</Typography>
                                            <Typography level="h3">{item.number}</Typography>
                                        </Box>
                                    </Box>

                                </CardContent>
                            </Card>
                        </Link>
                    </Grid>))}
            </Grid>

        </Box>
    )
}

export default Dashboard