import * as React from 'react';
import Box, { BoxProps } from '@mui/joy/Box';
import Stack from '@mui/joy/Stack';
import CssBaseline from '@mui/joy/CssBaseline'
import Header from './Header';
import Typography from '@mui/joy/Typography';
import SideBar from './SideBar';
import { ToastContainer } from 'react-toastify';
import { CssVarsProvider } from '@mui/joy';
import { useLocation, Outlet } from 'react-router-dom';
import theme from '../../utils/theme'

const Main = () => {

    return (
        <CssVarsProvider disableTransitionOnChange defaultMode='light' theme={theme}>
            <CssBaseline />
            <Box sx={{ display: 'flex', minHeight: '100dvh'}}>

                {/* Drawer side bar */}
                <SideBar />
                {/* <ToastContainer /> */}
                {/* Header */}
                <Header />

                {/* Main contents */}
                <Box
                    component="main"
                    className="MainContent"
                    sx={{
                        marginLeft: {xs: 0, md: 'var(--SideNavigation-open)'},
                        px: { xs: 2, md: 4 },
                        pt: {
                            xs: 'calc(22px + var(--Header-height))',
                            sm: 'calc(25px + var(--Header-height))',
                            md: 'calc(80px + var(--Header-height))',
                        },
                        pb: { xs: 2, sm: 2, md: 3 },
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        minWidth: 0,
                        // height: '100dvh',
                        minHeight: '100dvh',
                        gap: 1,
                        backgroundColor: 'background.surface',
                        overflowY: 'auto' 
                    }}
                >
                        <Outlet/>
                </Box>
            </Box>
        </CssVarsProvider>
    );
}

export default Main