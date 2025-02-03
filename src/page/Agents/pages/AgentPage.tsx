import React, { Fragment, useEffect, useState } from "react";
import { Typography, Box, List, ListItem, ListItemContent, Chip, ColorPaletteProp, ListDivider, Sheet, Table, iconButtonClasses, Button, IconButton, Card, Input, ButtonGroup, Dropdown, MenuButton, Menu } from "@mui/joy";
import { toast } from 'react-toastify';
import { Main, PageTitle } from "../../../components";
import { formatDate, thousandSeparator } from "../../../utils";

import FilterAltIcon from '@mui/icons-material/FilterAlt';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import SearchIcon from '@mui/icons-material/Search';
import MoreHorizRoundedIcon from '@mui/icons-material/MoreHorizRounded';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import BlockIcon from '@mui/icons-material/Block';
import AutorenewRoundedIcon from '@mui/icons-material/AutorenewRounded';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';

import agentDT from "../../../assets/fakeData/customerData.json"
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useMediaQuery } from "@mui/material";
import { BlockOutlined, DeleteOutline, EditOutlined, PersonAddOutlined, WarningRounded } from "@mui/icons-material";

const MobileViewTable = ({ data }) => {
    return (
        <Box sx={{ display: { xs: 'block', md: 'none' } }}>
            {data.map((listItem, index) => (
                <List
                    key={index}
                    size="sm"
                    sx={{
                        '--ListItem-paddingX': 0,
                    }}
                >
                    <ListItem
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'start',
                        }}
                    >
                        <ListItemContent sx={{ display: 'flex', gap: 2, alignItems: 'start' }}>
                            {/* <ListItemDecorator>
                                  <Avatar size="sm">{listItem.customer.initial}</Avatar>
                              </ListItemDecorator> */}
                            <div>
                                <Typography fontWeight={600} gutterBottom>{listItem.name}</Typography>
                                <Typography level="body-xs" gutterBottom><b>Mobile:</b> {listItem.mobile}</Typography>
                                <Typography level="body-xs" gutterBottom><b>Email: </b>{listItem.email}</Typography>
                                <Typography level="body-xs" gutterBottom><b>Address:</b> {listItem.address}</Typography>
                                <Dropdown>
                                    <MenuButton variant="plain" size="sm">More ...</MenuButton>
                                    <Menu placement="bottom-end" sx={{p: 1}}>
                                        <Typography level="body-sm" gutterBottom><b>Created at:</b> {formatDate(listItem.join_date)}</Typography>
                                        <Typography level="body-sm" gutterBottom><b>Last Login: </b>{formatDate(listItem.last_login)}</Typography>
                                    </Menu>
                                </Dropdown>
                            </div>
                        </ListItemContent>
                        <Box sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'flex-end',
                            rowGap: 1
                        }}>
                            <Chip
                                variant="solid"
                                size="sm"
                                // startDecorator={
                                //     {
                                //         Paid: <CheckRoundedIcon />,
                                //         Refunded: <AutorenewRoundedIcon />,
                                //         Cancelled: <BlockIcon />,
                                //     }['Paid']
                                // }
                                color={
                                    {
                                        Paid: 'success',
                                        Refunded: 'neutral',
                                        Cancelled: 'danger',
                                    }['Paid'] as ColorPaletteProp
                                }
                            >
                                {'Active'}
                            </Chip>
                            <ButtonGroup variant="soft" size="sm">
                                <Button color="primary"><EditOutlined /></Button>
                                <Button color="danger"><DeleteOutline /></Button>
                                <Button color="warning"><BlockOutlined /></Button>
                            </ButtonGroup>
                        </Box>

                    </ListItem>
                    <ListDivider />
                </List>
            ))}
        </Box>
    )
}

const DesktopViewTable = ({ data }) => {
    return (
        <React.Fragment>
            <Sheet
                className="OrderTableContainer"
                variant="outlined"
                sx={{
                    display: { xs: 'none', md: 'flex', lg: 'flex' },
                    // width: '100%',
                    borderRadius: 'sm',
                    flexShrink: 1,
                    overflow: 'auto',
                    minHeight: 0,
                }}
            >
                <Table
                    aria-labelledby="tableTitle"
                    stickyHeader
                    hoverRow
                    sx={{
                        '--TableCell-headBackground': 'var(--joy-palette-background-level1)',
                        '--Table-headerUnderlineThickness': '1px',
                        '--TableRow-hoverBackground': 'var(--joy-palette-background-level1)',
                        '--TableCell-paddingY': '4px',
                        '--TableCell-paddingX': '8px',
                    }}
                >
                    <thead>
                        <tr style={{ textAlign: 'center' }}>
                            <th style={{ width: 100, padding: '10px 6px' }}>Name</th>
                            <th style={{ width: 100, padding: '10px 6px', textAlign: 'center' }}>Mobile</th>
                            <th style={{ width: 140, padding: '10px 6px', textAlign: 'center' }}>Email</th>
                            <th style={{ width: 100, padding: '10px 6px', textAlign: 'center' }}>Address</th>
                            <th style={{ width: 100, padding: '10px 6px', textAlign: 'center' }}>Created at</th>
                            <th style={{ width: 100, padding: '10px 6px', textAlign: 'center' }}>Last Login</th>
                            <th style={{ width: 40, padding: '10px 6px', textAlign: 'center' }}>Status</th>
                            <th style={{ width: 100, padding: '10px 6px', textAlign: 'center' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((row, index) => (
                            <tr key={index}>
                                <td>
                                    <Typography level="body-sm">{row.name}</Typography>
                                </td>
                                <td>
                                    <Typography level="body-sm">{row.mobile}</Typography>
                                </td>
                                <td>
                                    <Typography level="body-xs">{row.email}</Typography>
                                </td>
                                <td>
                                    <Typography level="body-sm">{row.address}</Typography>
                                </td>
                                <td>
                                    <Typography level="body-sm">{formatDate(row.join_date)}</Typography>
                                </td>
                                <td>
                                    <Typography level="body-sm">{formatDate(row.last_login)}</Typography>
                                </td>
                                <td>
                                    <Chip
                                        variant="solid"
                                        size="sm"
                                        // startDecorator={
                                        //     {
                                        //         Paid: <CheckRoundedIcon />,
                                        //         Refunded: <AutorenewRoundedIcon />,
                                        //         Cancelled: <BlockIcon />,
                                        //     }['Paid']
                                        // }
                                        color={
                                            {
                                                Paid: 'success',
                                                Refunded: 'neutral',
                                                Cancelled: 'danger',
                                            }['Paid'] as ColorPaletteProp
                                        }
                                    >
                                        {'Active'}
                                    </Chip>
                                </td>
                                <td>
                                    <ButtonGroup variant="soft" size="sm">
                                        <Button title="Edit" color="primary"><EditOutlined /></Button>
                                        <Button title="Delete" color="danger"><DeleteOutline /></Button>
                                        <Button title="Block" color="warning"><BlockOutlined /></Button>
                                    </ButtonGroup>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </Sheet>
        </React.Fragment>
    );
}

const AgentPage = () => {

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const isDesktop = useMediaQuery("(min-width:600px)");

    const [loanStatus, setLoanStatus] = useState('')
    const [agentData, setAgentData] = useState(agentDT)


    const [currentPage, setCurrentPage] = useState(0);
    const ITEMS_PER_PAGE = 20;

    const handlePreviousPage = () => {
        setCurrentPage((prevPage) => Math.max(0, prevPage - 1));
    };

    const handleNextPage = () => {
        setCurrentPage((prevPage) => Math.min(prevPage + 1, Math.ceil(agentData.length / ITEMS_PER_PAGE) - 1));
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const paginatedData = agentData.slice(currentPage * ITEMS_PER_PAGE, (currentPage + 1) * ITEMS_PER_PAGE);



    return (
        <Box>
            <PageTitle title={'Manage Agents'} />



            {agentData.length > 0 ? <>

                {/* search */}
                <Sheet
                    className="SearchAndFilters"
                    sx={{
                        display: 'flex',
                        my: 1,
                        gap: 1,
                        flexDirection: { xs: 'column', sm: 'row' },
                        // width: { xs: 'auto', md: '30%' },
                        justifyContent: 'space-between',
                    }}
                >
                    <Button
                        startDecorator={<PersonAddOutlined />}
                        color="success"
                        sx={{ width: 'auto' }}
                        onClick={null}>
                        Add new Agent
                    </Button>
                    <Input
                        size="sm"
                        placeholder="Search"
                        startDecorator={<SearchIcon />}
                        sx={{ width: { xs: 'auto', md: '30%' } }}
                    />
                </Sheet>
                <MobileViewTable data={paginatedData} />
                <DesktopViewTable data={paginatedData} />

                {/* Pagination */}
                {agentData.length > ITEMS_PER_PAGE
                    &&
                    <Box
                        className="Pagination-laptopUp"
                        sx={{
                            pt: 2,
                            gap: 1,
                            [`& .${iconButtonClasses.root}`]: { borderRadius: '50%' },
                            display: 'flex'
                        }}
                    >
                        <Button
                            size="sm"
                            variant="outlined"
                            color="neutral"
                            startDecorator={<KeyboardArrowLeftIcon />}
                            onClick={handlePreviousPage}
                            disabled={currentPage === 0}
                        >
                            {isDesktop ? 'Previous' : ""}
                        </Button>


                        <Box sx={{ flex: 1 }} />
                        {/* for desktop to display page number */}
                        {Array.from({ length: Math.ceil(agentData.length / ITEMS_PER_PAGE) }).map((_, page) => (
                            <IconButton
                                key={page}
                                size="sm"
                                variant={'outlined'}
                                color="neutral"
                                onClick={() => handlePageChange(page)}
                                disabled={currentPage === page}
                                sx={{ display: { xs: 'none', md: 'flex' } }}
                            >
                                {page + 1}
                            </IconButton>
                        ))}

                        {/* for mobile to display page number */}
                        <Typography level="body-sm" mx="auto" textAlign={'center'} sx={{ display: { xs: 'flex', md: 'none' } }}>
                            Page {currentPage + 1} of {Math.ceil(agentData.length / ITEMS_PER_PAGE)}
                        </Typography>
                        <Box sx={{ flex: 1 }} />



                        <Button
                            size="sm"
                            variant="outlined"
                            color="neutral"
                            endDecorator={<KeyboardArrowRightIcon />}
                            onClick={handleNextPage}
                            disabled={currentPage === Math.ceil(agentData.length / ITEMS_PER_PAGE) - 1}
                        >
                            {isDesktop ? 'Next' : ""}
                        </Button>
                    </Box>}

            </> :
                <Card sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    top: '20%'
                }}>
                    <WarningRounded sx={{ fontSize: '50px', color: 'background.appcolor' }} />
                    <Typography level="title-md">Resource not Found</Typography>
                    <Typography level="body-sm" textAlign={'center'}>This can be either you don't have completed loans or network issue.</Typography>
                </Card>
            }
        </Box>




    )
}

export default AgentPage