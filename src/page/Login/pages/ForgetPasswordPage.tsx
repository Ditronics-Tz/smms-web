import React, { useState, useEffect } from 'react';
import { connect, useDispatch } from "react-redux";
import {
    loginRequest, loginReset, forgotPasswordRequest, forgotPasswordReset
} from "../../../store/actions"

import { CssVarsProvider } from '@mui/joy/styles';
import GlobalStyles from '@mui/joy/GlobalStyles';
import CssBaseline from '@mui/joy/CssBaseline';
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import FormControl from '@mui/joy/FormControl';
import FormLabel, { formLabelClasses } from '@mui/joy/FormLabel';
import Input from '@mui/joy/Input';
import Typography from '@mui/joy/Typography';
import Stack from '@mui/joy/Stack';
import theme from '../../../utils/theme';
import { Avatar, Card, CircularProgress, DialogContent, DialogTitle, Divider, Modal, ModalClose, ModalDialog } from '@mui/joy';

import { useNavigate } from 'react-router-dom';


import image from '../../../constant/image';
import { NAVIGATE_TO_DASHBOARD, NAVIGATE_TO_LOGINPAGE } from '../../../route/types';
import { toast } from 'react-toastify';
import { STATUS } from '../../../constant';
import { LoadingView } from '../../../components';
import LanguageMenu from '../../../components/molecules/LanguageMenu';
import { ColorSchemeToggle } from '../../../utils';
import { useTranslation } from 'react-i18next';

const ForgotPasswordPage = ({
    forgotPasswordStatus,
    forgotPasswordErrorMessage,
    forgotPasswordResult,
}) => {

    const navigate = useNavigate();
    const dispatch = useDispatch()
    const { t } = useTranslation();

    const [refresh, setRefresh] = useState(false)

    /* eslint-disable */
    const [email, setEmail] = useState('')

    useEffect(() => {
        if (forgotPasswordStatus === STATUS.SUCCESS) {
            toast.success(t("forget.success"))
            dispatch(forgotPasswordReset());
            navigate(NAVIGATE_TO_LOGINPAGE, { replace: true });
        }
        else if (forgotPasswordStatus === STATUS.ERROR) {
            toast.error(forgotPasswordErrorMessage)
            dispatch(forgotPasswordReset());
        }
    }, [forgotPasswordStatus])

    useEffect(() => {
        console.log("Refresh screen")
    }, [refresh])
    /* eslint-enable */


    const handleSubmit = (event) => {
        event.preventDefault();
        const formElements = event.currentTarget.elements;
        const data = {
            'email': formElements.email.value
        };
        console.log(data)
        if (data.email) {
            dispatch(forgotPasswordRequest({"email" : data.email}));

        } else {
            toast.error(t("login.emptyErr"));
        }
    }

    const checkLoading = () => {
        if (forgotPasswordStatus === STATUS.LOADING){
            return true
        }
        else {
            return false
        }
    }

    return (
        <CssVarsProvider defaultMode="light" disableTransitionOnChange theme={theme}>
            <CssBaseline />
            <GlobalStyles
                styles={{
                    ':root': {
                        '--Collapsed-breakpoint': '769px', // form will stretch when viewport is below `769px`
                        '--Cover-width': '50vw', // must be `vw` only
                        '--Form-maxWidth': '600px',
                        '--Transition-duration': '0.4s', // set to `none` to disable transition
                    },
                }}
            />

            {/* loading  */}
            <LoadingView loading={checkLoading()} />

            <Box
                sx={styles.container}
            >
                <Box
                    sx={styles.subcontainer}
                >
                    <Box
                        component="header"
                        sx={{
                            py: 4,
                            gap: 1,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            // flexDirection: 'column',
                        }}
                    >
                        <Box sx={{
                            display: 'flex',
                            gap: 1,
                            alignItems: 'center'
                        }}
                        >
                            <Avatar
                                src={image.Images.logo}
                                size='sm'
                                sx={{
                                    maxWidth: 90, maxHeight: 90,
                                }}
                            />
                            <Typography level='title-lg' sx={{ fontFamily: 'roboto' }}>{t("intro.appName")}</Typography>
                        </Box>

                        <Box sx={{ display: 'flex', gap: 1 }}>
                            <LanguageMenu change={() => setRefresh(!refresh)} />
                            <ColorSchemeToggle />
                        </Box>
                    </Box>
                    <Card
                        component="main"
                        sx={styles.card}>

                        <Box
                            sx={{
                                // py: 4,
                                width: 500,
                                maxWidth: '100%',
                                px: 2,
                                gap: 1,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                alignSelf: 'center'
                            }}
                        >
                            <Typography textAlign='center' level='h3' sx={styles.title}>
                                {t("intro.title")}
                            </Typography>
                            <Typography textAlign='center' level='body-md' sx={styles.title}>
                                {t("intro.desc")}
                            </Typography>

                        </Box>
                        <Box
                            sx={styles.form}
                        >
                            <Stack sx={{ mb: 2, gap:1 }}>
                                <Typography textAlign='center' level="h3">{t("forget.title")}</Typography>
                                <Typography textAlign='center' level="body-sm">{t("forget.desc")}</Typography>
                            </Stack>

                            <Stack component='form' onSubmit={handleSubmit} gap={4} sx={{ mt: 2 }}>
                                <FormControl required>
                                    <FormLabel>{t("forget.email")}</FormLabel>
                                    <Input type="text" name="email" placeholder={t("forget.emailPlaceholder")} sx={styles.input} />
                                </FormControl>
                                <Stack gap={4} sx={{ mt: 2 }}>
                                    <Button type="submit" fullWidth sx={styles.button}>
                                        {t("forget.button")}
                                    </Button>
                                </Stack>
                            </Stack>
                            <Divider>Or</Divider>
                            <Stack gap={4} sx={{ mt: 2 }}>
                                <Button variant='soft' color='neutral' sx={{borderColor: "blue"}}  fullWidth onClick={() => navigate(NAVIGATE_TO_LOGINPAGE, { replace: true })}>
                                    {t("forget.back")}
                                </Button>
                            </Stack>
                        </Box>
                    </Card>

                    <Box component="footer" sx={{ py: 3 }}>
                        <Typography level="body-xs" textAlign="center">
                            © {t("intro.owner")} {new Date().getFullYear()}
                        </Typography>
                    </Box>
                </Box>
            </Box>

        </CssVarsProvider>
    );
}

// Stylish
const styles = {
    container: (theme) => ({
        //   width: '90%',
        transition: 'width var(--Transition-duration)',
        transitionDelay: 'calc(var(--Transition-duration) + 0.1s)',
        position: 'relative',
        zIndex: 1,
        display: 'flex',
        justifyContent: 'center',
        alignContent: 'center',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundImage:
            `url(${image.Images.backgroung})`,
        [theme.getColorSchemeSelector('dark')]: {
            backgroundImage:
                `url(${image.Images.backgroung2})`,
        },
    }),
    subcontainer: {
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100dvh',
        justifyContent: 'space-between',
        // width:
        //   'clamp(var(--Form-maxWidth), (var(--Collapsed-breakpoint) - 100vw) * 999, 100%)',
        maxWidth: '100%',
        px: 2,
        m: 2
    },
    card: {
        background: 'linear-gradient(297deg, rgba(255,165,0,1) 0%, rgba(226,124,0,1) 70%, rgba(215,152,152,1) 100%)',
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        gap: 2,
        width: '100%',
        boxShadow: 'md',
        borderRadius: 0,
    },
    form: {
        my: 'auto',
        py: 2,
        pb: 5,
        p: 3,
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        width: 400,
        maxWidth: '100%',
        mx: 'auto',
        backgroundColor: 'background.surface',
        borderRadius: 'sm',
        '& form': {
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
        },
        [`& .${formLabelClasses.asterisk}`]: {
            visibility: 'hidden',
        },
    },
    input: {
        height: 45,

    },
    button: {
        height: 45,
        backgroundColor: 'text.primary',
        color: 'background.surface',
        fontWeight: 'bold',
        '&:hover':
        {
            backgroundColor: 'grey'
        }
    },
    title: {
        color: 'white',
        fontFamily: 'roboto'
    }

}

const mapStateToProps = ({ auth }) => {
    const {
        forgotPasswordStatus,
        forgotPasswordResult,
        forgotPasswordErrorMessage,
        accessToken,
    } = auth


    return {
        forgotPasswordStatus,
        forgotPasswordResult,
        forgotPasswordErrorMessage,
        accessToken,
    }
}

// export default LoginPage
export default connect(mapStateToProps, {})(ForgotPasswordPage)