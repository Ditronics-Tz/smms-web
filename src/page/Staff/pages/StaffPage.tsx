import React, { Fragment, useEffect, useState } from "react";
import { Typography, Box, List, ListItem, ListItemContent, Chip, ColorPaletteProp, ListDivider, Sheet, Table, iconButtonClasses, Button, IconButton, Card, Input, ButtonGroup, Option, Dropdown, MenuButton, Menu, Modal, ModalDialog, ModalClose, DialogTitle, DialogContent, FormControl, FormLabel, Stack, Select, MenuItem } from "@mui/joy";
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
import { BlockOutlined, CalendarMonthOutlined, DeleteOutline, EditOutlined, Filter, Filter2Outlined, FilterAltOutlined, PersonAddOutlined, WarningRounded } from "@mui/icons-material";

const MobileViewTable = ({ data, props }) => {
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
                                    <Menu placement="bottom-end" sx={{ p: 1 }}>
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
                                <Button color="primary" onClick={() => props.edit(listItem)}><EditOutlined /></Button>
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

const DesktopViewTable = ({ data, props }) => {
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
                        '& tr > *:last-child': {
                            position: 'sticky',
                            right: 0,
                            bgcolor: 'var(--TableCell-headBackground)',
                        },
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
                            <th aria-label="last" style={{ width: 100, padding: '10px 6px', textAlign: 'center' }}>Actions</th>
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
                                        <Button title="Edit" color="primary" onClick={() => props.edit(row)}><EditOutlined /></Button>
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

const StaffPage = () => {

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const isDesktop = useMediaQuery("(min-width:600px)");

    const [loanStatus, setLoanStatus] = useState('')
    const [agentData, setAgentData] = useState(agentDT)

    const [formModal, setFormModal] = useState(false)

    /* --------------- location (region and district data) ----------- */
    // locations
    const locations = require('../../../assets/locations.json');

    const [regionList, setRegionList] = useState([]);
    const [region, setRegion] = useState('');
    const [districtList, setDistrictList] = useState([]);
    const [district, setDistrict] = useState('');

    useEffect(() => {
        let _regions = [];
        locations.map(val => {
            _regions.push(val.name);
        });
        setRegionList(_regions);
    }, []);

    useEffect(() => {
        //first clear selected district
        setDistrict('')
        locations.find((location) => {
            //return location.name = region
            let _districtList = []
            if (location.name == region) {
                location.districts.map(val => {
                    _districtList.push(val.name);
                })
                setDistrictList(_districtList);
                return;
            }
        });
    }, [region])

    const handleRegion = (event, newValue) => {
        setRegion(newValue)
    }

    const handleDistrict = (event, newValue) => {
        setDistrict(newValue)
    }

    /* ----------- end of location set ------------------ */

    /* -------- FUNCTION TO SEARCH ------ */
    const [search, setSearch] = useState('');
    const [filterBy, setFilterBy] = useState('name')
    const [isSearchVisible, setIsSearchVisible] = useState(false);

    // filtre by  name
    const filteredData = agentData.filter((item) => {
        if (filterBy === 'name') {
            return item.name.toLowerCase().includes(search.toLowerCase())
        }
        else if (filterBy === 'mobile') {
            return item.mobile.includes(search)
        }  
        else if (filterBy === 'date') {
            return item.join_date.includes(search)
        } 
        else if (filterBy === 'address') {
            return item.address.toLowerCase().includes(search.toLowerCase())
        }
        else {
            return item.name.toLowerCase().includes(search.toLowerCase())
        }
    })


    /* ------ pagination functions ------- */
    const [currentPage, setCurrentPage] = useState(0);
    const ITEMS_PER_PAGE = 20;
    const pageLength = Math.ceil(filteredData.length / ITEMS_PER_PAGE)

    const handlePreviousPage = () => {
        setCurrentPage((prevPage) => Math.max(0, prevPage - 1));
    };

    const handleNextPage = () => {
        setCurrentPage((prevPage) => Math.min(prevPage + 1, pageLength - 1));
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };



    const paginatedData = filteredData.slice(currentPage * ITEMS_PER_PAGE, (currentPage + 1) * ITEMS_PER_PAGE);
    /* ---- end of pagination functions ------- */

    /* -------- actions ----------- */
    const [t, setT] = useState('')
    const openEditForm = (details) => {
        setFormModal(true)
        setT(details.name)

    }

    const openAddForm = () => {
        setT('')
        setFormModal(true)
    }


    return (
        <Box>
            <PageTitle title={'Manage Staffs'} />

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
                    onClick={openAddForm}>
                    Add new Staff
                </Button>
                {agentData.length > 0 &&
                    <Input
                        size="sm"
                        placeholder={`Search by ${filterBy}`}
                        type={{date: 'date',name : "text", address :'text', mobile: 'number'}[filterBy]}
                        defaultValue={search}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        startDecorator={filterBy === 'date' ? <CalendarMonthOutlined /> : <SearchIcon />}
                        endDecorator={
                            <Dropdown>
                                <MenuButton variant="plain">
                                    {/* <Typography level="body-sm">Filter</Typography> */}
                                    <FilterAltOutlined />
                                </MenuButton>
                                <Menu sx={{minWidth: '120px', fontSize: '14px'}}>
                                    <MenuItem onClick={() => setFilterBy('name')} selected={filterBy == 'name'}>Name</MenuItem>
                                    <MenuItem onClick={() => setFilterBy('mobile')} selected={filterBy == 'mobile'}>Mobile</MenuItem>
                                    <MenuItem onClick={() => setFilterBy('date')} selected={filterBy == 'date'}>Date</MenuItem>
                                    <MenuItem onClick={() => setFilterBy('address')} selected={filterBy == 'address'}>Address</MenuItem>
                                </Menu>
                            </Dropdown>
                        }
                        sx={{ width: { xs: 'auto', md: '30%' },  textTransform: 'capitalize' }}
                    />}
            </Sheet>

            {agentData.length > 0 ? <>
                {/* ------ render different view depend on plafform -------- */}
                <MobileViewTable data={paginatedData} props={{ edit: openEditForm }} />
                <DesktopViewTable data={paginatedData} props={{ edit: openEditForm }} />

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
                        {Array.from({ length: pageLength }).map((_, page) => (
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
                            Page {currentPage + 1} of {pageLength}
                        </Typography>
                        <Box sx={{ flex: 1 }} />



                        <Button
                            size="sm"
                            variant="outlined"
                            color="neutral"
                            endDecorator={<KeyboardArrowRightIcon />}
                            onClick={handleNextPage}
                            disabled={currentPage === pageLength - 1}
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

            {/* ------ Modal form for add and edit staff details ------ */}
            <Modal open={formModal} >
                <ModalDialog
                    aria-labelledby="nested-modal-title"
                    aria-describedby="nested-modal-description"
                    sx={(theme) => ({
                        [theme.breakpoints.only('xs')]: {
                            top: '60px',
                            bottom: 0,
                            left: 0,
                            right: 0,
                            // borderRadius: 0,
                            borderTopLeftRadius: 20,
                            borderTopRightRadius: 20,
                            transform: 'none',
                            maxWidth: 'unset',
                            overflow: 'auto'
                        },
                    })}>
                    <ModalClose variant="outlined" onClick={() => setFormModal(false)} />
                    <DialogTitle>{t != "" ? `Edit ${t} Details` : "Add Staff"}</DialogTitle>
                    <DialogContent>Please enter staff details correct.</DialogContent>
                    <Stack component='form' onSubmit={null} gap={2} sx={{ mt: 2 }}>
                        <Stack direction={{ xs: 'column', md: 'row' }} gap={2}>
                            {/* first name */}
                            <FormControl sx={{ flex: 1 }} required>
                                <FormLabel>First Name</FormLabel>
                                <Input type="text" name="firstName" placeholder='Enter your first name' />
                            </FormControl>

                            {/* second name */}
                            <FormControl sx={{ flex: 1 }} required>
                                <FormLabel>Middle Name</FormLabel>
                                <Input type="text" name="secondName" placeholder='Enter your second name' />
                            </FormControl>

                            {/* last name */}
                            <FormControl sx={{ flex: 1 }} required>
                                <FormLabel>Surname Name</FormLabel>
                                <Input type="text" name="lastName" placeholder='Enter your third name' />
                            </FormControl>
                        </Stack>

                        <Stack direction={{ xs: 'column', md: 'row' }} gap={2}>
                            {/* mobile number */}
                            <FormControl sx={{ flex: 1 }} required>
                                <FormLabel>Mobile number</FormLabel>
                                <Input type="tel" name="mobile" placeholder='Enter phone number' />
                            </FormControl>

                            {/* nida */}
                            <FormControl sx={{ flex: 1 }} required>
                                <FormLabel>Nida</FormLabel>
                                <Input
                                    name="nida"
                                    placeholder='Enter nida number' />
                            </FormControl>
                        </Stack>

                        <Stack direction={{ xs: 'column', md: 'row' }} gap={2}>
                            {/* region */}
                            <FormControl sx={{ flex: 1 }} required>
                                <FormLabel>Region</FormLabel>
                                <Select placeholder="Select your region" onChange={handleRegion} required>
                                    {regionList.map((dt) => (
                                        <Option value={dt}>{dt}</Option>
                                    ))}
                                </Select>
                            </FormControl>

                            {/* district */}
                            {region && <FormControl sx={{ flex: 1 }} required>
                                <FormLabel>District</FormLabel>
                                <Select placeholder="Select your district" onChange={handleDistrict} required>
                                    {districtList.map((dt) => (
                                        <Option value={dt}>{dt}</Option>
                                    ))}
                                </Select>
                            </FormControl>}
                        </Stack>

                        <Stack direction={{ xs: 'column', md: 'row' }} gap={2}>
                            {/* password */}
                            <FormControl required sx={{ flex: 1 }}>
                                <FormLabel>Password</FormLabel>
                                <Input type="password" name="password" placeholder='********' />
                            </FormControl>

                            {/* confirm password */}
                            <FormControl required sx={{ flex: 1 }}>
                                <FormLabel>Confirm Password</FormLabel>
                                <Input type="password" name="confirmPassword" placeholder='*******' />
                            </FormControl>
                        </Stack>

                        <Stack gap={4} sx={{ mt: 2 }}>
                            {/* <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                }}
                            >
                                <Checkbox size="sm" label="I agree with term and conditions of Sava Loan Tanzania" name="checkBox" />
                                <Link onClick={viewTerms} level='title-sm' sx={{ color: 'green' }} >
                                    View Terms and Conditions
                                </Link>
                            </Box> */}
                            <Button type="submit" fullWidth>
                                Submit
                            </Button>
                        </Stack>
                    </Stack>
                </ModalDialog>
            </Modal>
        </Box>




    )
}

export default StaffPage