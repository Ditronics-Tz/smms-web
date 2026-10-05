import React, { useEffect, useMemo, useState } from 'react';
import { connect, useDispatch } from "react-redux";
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
    confirmPasswordResetRequest,
    confirmPasswordResetReset
} from "../../../store/actions"

import { CssVarsProvider } from '@mui/joy/styles';
import GlobalStyles from '@mui/joy/GlobalStyles';
import CssBaseline from '@mui/joy/CssBaseline';
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import FormControl from '@mui/joy/FormControl';
import FormHelperText from '@mui/joy/FormHelperText';
import FormLabel, { formLabelClasses } from '@mui/joy/FormLabel';
import Input from '@mui/joy/Input';
import Typography from '@mui/joy/Typography';
import Stack from '@mui/joy/Stack';
import theme from '../../../utils/theme';
import { Avatar, Card } from '@mui/joy';
import IconButton from '@mui/joy/IconButton';

import { useNavigate, useSearchParams } from 'react-router-dom';

import image from '../../../constant/image';
import { NAVIGATE_TO_FORGOTPASSWORDPAGE, NAVIGATE_TO_LOGINPAGE } from '../../../route/types';
import { toast } from 'react-toastify';
import { STATUS } from '../../../constant';
import { LoadingView } from '../../../components';
import LanguageMenu from '../../../components/molecules/LanguageMenu';
import { ColorSchemeToggle } from '../../../utils';
import { useTranslation } from 'react-i18next';

import VisibilityRounded from '@mui/icons-material/VisibilityRounded';
import VisibilityOffRounded from '@mui/icons-material/VisibilityOffRounded';
import ErrorOutlineRounded from '@mui/icons-material/ErrorOutlineRounded';

const MIN_PASSWORD_LENGTH = 8;

const validationSchema = Yup.object({
    newPassword: Yup.string()
        .required('passwordRequired')
        .min(MIN_PASSWORD_LENGTH, 'passwordTooShort'),
    confirmPassword: Yup.string()
        .required('passwordRequired')
        .oneOf([Yup.ref('newPassword')], 'passwordsDontMatch'),
});

const PasswordField = ({ id, label, placeholder, value, onChange, onBlur, error, helperText, visible, onToggle }) => (
    <FormControl required error={error}>
        <FormLabel htmlFor={id}>{label}</FormLabel>
        <Input
            id={id}
            name={id}
            type={visible ? 'text' : 'password'}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            autoComplete="new-password"
            sx={styles.input}
            endDecorator={
                <IconButton
                    onClick={onToggle}
                    size="sm"
                    variant="plain"
                    aria-label={label}
                >
                    {visible ? <VisibilityOffRounded /> : <VisibilityRounded />}
                </IconButton>
            }
        />
        {helperText ? <FormHelperText>{helperText}</FormHelperText> : null}
    </FormControl>
);

const ResetPasswordPage = ({
    resetPasswordConfirmStatus,
}) => {

    const navigate = useNavigate();
    const dispatch = useDispatch()
    const { t } = useTranslation();
    const [searchParams] = useSearchParams();

    const [showPassword, setShowPassword] = useState(false);

    // The reset token travels in the emailed link. The same page doubles as the
    // "set your password" screen for an invited user, which is signalled by
    // `mode=invite` on the link.
    const resetToken = searchParams.get('token');
    const isInvite = searchParams.get('mode') === 'invite';
    const hasToken = Boolean(resetToken);

    /* eslint-disable react-hooks/exhaustive-deps */
    useEffect(() => {
        if (resetPasswordConfirmStatus === STATUS.SUCCESS) {
            toast.success(t("resetPassword.success"))
            dispatch(confirmPasswordResetReset());
            navigate(NAVIGATE_TO_LOGINPAGE, { replace: true });
        }
        else if (resetPasswordConfirmStatus === STATUS.ERROR) {
            // Deliberately not surfacing the backend message: the page only ever
            // shows one generic failure text, so a response cannot be used to
            // probe which tokens or addresses exist.
            toast.error(t("resetPassword.error"))
            dispatch(confirmPasswordResetReset());
        }
    }, [resetPasswordConfirmStatus])
    /* eslint-enable react-hooks/exhaustive-deps */

    const formik = useFormik({
        initialValues: {
            newPassword: '',
            confirmPassword: '',
        },
        validationSchema,
        onSubmit: (values) => {
            dispatch(confirmPasswordResetRequest({
                token: resetToken,
                new_password: values.newPassword
            }));
        },
    });

    const { errors, touched, handleBlur, handleChange, handleSubmit, values } = formik;

    const heading = isInvite ? t("resetPassword.setTitle") : t("resetPassword.title");
    const subHeading = isInvite ? t("resetPassword.setDesc") : t("resetPassword.desc");

    const field = useMemo(() => ({
        helperText: (name) => (touched[name] && errors[name] ? t(`resetPassword.${errors[name]}`) : null),
        error: (name) => Boolean(touched[name] && errors[name]),
    }), [touched, errors, t]);

    const checkLoading = () => resetPasswordConfirmStatus === STATUS.LOADING;

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
                            <LanguageMenu change={() => {}} />
                            <ColorSchemeToggle />
                        </Box>
                    </Box>
                    <Card
                        component="main"
                        sx={styles.card}>

                        <Box
                            sx={{
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
                            <Stack sx={{ mb: 2, gap: 1 }}>
                                <Typography textAlign='center' level="h3">{heading}</Typography>
                                <Typography textAlign='center' level="body-sm">{subHeading}</Typography>
                            </Stack>

                            {hasToken ? (
                                <Stack component='form' onSubmit={handleSubmit} noValidate gap={4} sx={{ mt: 2 }}>
                                    <PasswordField
                                        id="newPassword"
                                        label={t("resetPassword.newPassword")}
                                        placeholder={t("resetPassword.newPasswordPlaceholder")}
                                        value={values.newPassword}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        error={field.error('newPassword')}
                                        helperText={field.helperText('newPassword')}
                                        visible={showPassword}
                                        onToggle={() => setShowPassword(!showPassword)}
                                    />
                                    <PasswordField
                                        id="confirmPassword"
                                        label={t("resetPassword.confirmPassword")}
                                        placeholder={t("resetPassword.confirmPasswordPlaceholder")}
                                        value={values.confirmPassword}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        error={field.error('confirmPassword')}
                                        helperText={field.helperText('confirmPassword')}
                                        visible={showPassword}
                                        onToggle={() => setShowPassword(!showPassword)}
                                    />
                                    <Stack gap={4} sx={{ mt: 2 }}>
                                        <Button type="submit" fullWidth sx={styles.button} loading={checkLoading()}>
                                            {t("resetPassword.button")}
                                        </Button>
                                    </Stack>
                                </Stack>
                            ) : (
                                <Stack gap={2} alignItems="center" sx={{ textAlign: 'center', py: 2 }}>
                                    <ErrorOutlineRounded sx={{ fontSize: '40px', color: 'danger.solidColor' }} />
                                    <Typography level="body-md" sx={{ color: 'text.secondary' }}>
                                        {t("resetPassword.invalidLink")}
                                    </Typography>
                                    <Typography level="body-sm" sx={{ color: 'text.tertiary' }}>
                                        {t("resetPassword.invalidLinkDesc")}
                                    </Typography>
                                    <Button
                                        variant='soft'
                                        color='neutral'
                                        fullWidth
                                        sx={{ mt: 1 }}
                                        onClick={() => navigate(NAVIGATE_TO_FORGOTPASSWORDPAGE, { replace: true })}
                                    >
                                        {t("resetPassword.requestNewLink")}
                                    </Button>
                                </Stack>
                            )}

                            <Button variant='soft' color='neutral' fullWidth onClick={() => navigate(NAVIGATE_TO_LOGINPAGE, { replace: true })}>
                                {t("resetPassword.back")}
                            </Button>
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
            `url(${image.Images.background})`,
        [theme.getColorSchemeSelector('dark')]: {
            backgroundImage:
                `url(${image.Images.background2})`,
        },
    }),
    subcontainer: {
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100dvh',
        justifyContent: 'space-between',
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
        resetPasswordConfirmStatus,
    } = auth

    return {
        resetPasswordConfirmStatus,
    }
}

export default connect(mapStateToProps, {})(ResetPasswordPage)
