import React, { useEffect, useState } from "react";
import { Typography, Box, Card, Avatar, Stack, FormControl, FormLabel, Input, Button } from "@mui/joy";
import { LoadingView, PageTitle } from "../../../components";
import { connect, useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { FILE_BASE, STATUS } from "../../../constant";
import { toast } from "react-toastify";
import {
    changePasswordRequest, changePasswordReset
} from "../../../store/actions"

const ProfilePage = (
    {
        accessToken,
        loginResult,
        changePasswordStatus,
        changePasswordResult,
        changePasswordErrorMessage
    }
) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();

    const [user, setUser] = useState({
        name: "",
        role: "",
        email: "",
        mobile: "",
        profile_picture: ""
    })

    useEffect(() => {
        if (loginResult) {
            setUser({
                name: loginResult.user.first_name + " " + loginResult.user.middle_name + " " + loginResult.user.last_name,
                role: loginResult.user.role,
                email: loginResult.user.email,
                mobile: loginResult.user.mobile_number,
                profile_picture: loginResult.user.profile_picture
            })
        }

        if (changePasswordStatus) {
            if (changePasswordStatus === STATUS.SUCCESS) {
                toast.success(t("changePin.success"));
                dispatch(changePasswordReset());
            } else if (changePasswordStatus === STATUS.ERROR) {
                if (changePasswordErrorMessage !== "") {
                    toast.error(t(changePasswordErrorMessage));
                } else {
                    toast.error(t("forget.error"));
                }
                dispatch(changePasswordReset());
            }
        }
    }, [loginResult, changePasswordStatus, changePasswordErrorMessage, dispatch, t])

    // Handle Submit
    const handleChangePassword = (event) => {
        event.preventDefault();
        const formElements = event.currentTarget.elements;
        const data = {
            'old_password': formElements.oldPassword.value,
            'new_password': formElements.newPassword.value,
            'confirm_password': formElements.confirmPassword.value,
        };
        console.log(data)
        if (data.old_password === "" || data.new_password === "" || data.confirm_password === "") {
            toast.error(t("changePin.emptyErr"));
            return;
        }

        if (data.new_password === data.confirm_password) {
            dispatch(changePasswordRequest(accessToken, data));
            formElements.oldPassword.value = "";
            formElements.newPassword.value = "";
            formElements.confirmPassword.value = "";

        } else {
            toast.error(t("changePin.notMatch"));
        }
    }

    const checkLoading = () => {
        if (changePasswordStatus === STATUS.LOADING) {
            return true
        }
        else {
            return false
        }
    }

    return (
        <Box sx={styles.container}>
            <PageTitle title={t("setting.title")} />

            {/* loading  */}
            <LoadingView loading={checkLoading()} />

            <Card sx={styles.card}>
                <Box sx={styles.leftSide}>
                    <Stack width={'100%'} mb={1} gap={0}>
                        <Typography level="title-md">{t("setting.profile")}</Typography>
                        <Typography level="body-xs">{t("setting.profileDesc")}</Typography>
                    </Stack>
                    <Avatar
                        variant="outlined"
                        src={FILE_BASE + user.profile_picture}
                        size="lg"
                        sx={{ width: 130, height: 130, borderWidth: 3, mb: 2 }}
                    />
                    <Typography level="title-md">{user.name}</Typography>
                    <Typography level="body-xs">{ }</Typography>
                    <Typography level="body-sm">{user.email}</Typography>
                    <Typography level="body-sm">{user.mobile}</Typography>
                </Box>
                <Box sx={styles.rightSide}>
                    {/* Change Password */}
                    <Stack sx={{ mb: 2, gap: 1 }}>
                        <Typography textAlign='center' level="h3">{t("changePin.title")}</Typography>
                        <Typography textAlign='center' level="body-sm">{t("changePin.desc")}</Typography>
                    </Stack>

                    <Stack component='form' onSubmit={handleChangePassword} gap={2} sx={{ mt: 2, width: '90%' }}>
                        <FormControl required>
                            <FormLabel>{t("changePin.old")}</FormLabel>
                            <Input type="password" name="oldPassword" />
                        </FormControl>

                        <FormControl required>
                            <FormLabel>{t("changePin.confirm")}</FormLabel>
                            <Input type="password" name="confirmPassword" />
                        </FormControl>

                        <FormControl required sx={{ mt: 1 }}>
                            <FormLabel>{t("changePin.new")}</FormLabel>
                            <Input type="password" name="newPassword" />
                        </FormControl>
                        <Stack gap={4} sx={{ mt: 2 }}>
                            <Button type="submit" fullWidth sx={styles.button}>
                                {t("changePin.button")}
                            </Button>
                        </Stack>
                    </Stack>

                </Box>
            </Card>
        </Box>
    )
}

const styles = {
    container: {
        display: "flex",
        flexDirection: 'column'
        // justifyContent: "center",
        // alignItems: 'center'
    },
    card: {
        display: 'flex',
        minWidth: { xs: '100%', md: '800px' },
        flexDirection: { xs: 'column', md: 'row' },
        alignSelf: 'center',
        backgroundColor: 'background.popup',
        mt: 3,
        boxShadow: 'md'
    },
    leftSide: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        flex: { xs: 'noset', md: 2 }
    },
    rightSide: {
        display: 'flex',
        width: '90%',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        flex: { xs: 'noset', md: 3 },
        borderLeft: 1,
        borderColor: 'lightgray'
        // blur
    },
    input: {
        height: 45,
        width: '100%'

    },
    button: {
        height: 48,
        backgroundColor: 'text.primary',
        color: 'background.surface',
        fontWeight: 'bold',
        '&:hover':
        {
            backgroundColor: 'grey'
        }
    },

}

const MapStateToProps = ({ auth }) => {
    const {
        accessToken,
        loginResult,
        changePasswordStatus,
        changePasswordResult,
        changePasswordErrorMessage
    } = auth

    return {
        accessToken,
        loginResult,
        changePasswordStatus,
        changePasswordResult,
        changePasswordErrorMessage
    }
}

export default connect(MapStateToProps, {})(ProfilePage)