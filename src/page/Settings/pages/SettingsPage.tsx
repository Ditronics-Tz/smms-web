import React, { useEffect, useMemo, useRef, useState } from "react";
import {
    Avatar,
    Box,
    Button,
    Card,
    Divider,
    FormControl,
    FormHelperText,
    FormLabel,
    IconButton,
    Input,
    Stack,
    Typography,
} from "@mui/joy";
import { connect, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import HelpOutlineRounded from "@mui/icons-material/HelpOutlineRounded";
import LockOutlined from "@mui/icons-material/LockOutlined";
import PersonOutlineRounded from "@mui/icons-material/PersonOutlineRounded";
import PaletteOutlined from "@mui/icons-material/PaletteOutlined";
import PhotoCameraRounded from "@mui/icons-material/PhotoCameraRounded";
import VisibilityRounded from "@mui/icons-material/VisibilityRounded";
import VisibilityOffRounded from "@mui/icons-material/VisibilityOffRounded";

import { LoadingView, PageTitle } from "../../../components";
import LanguageMenu from "../../../components/molecules/LanguageMenu";
import { ColorSchemeToggle, profilePictureSrc } from "../../../utils";
import { STATUS } from "../../../constant";
import { changePasswordRequest, changePasswordReset, editUserRequest, editUserReset } from "../../../store/actions";
import { NAVIGATE_TO_SUPPORTPAGE } from "../../../route/types";

const MAX_PHOTO_BYTES = 2 * 1024 * 1024;
const ACCEPTED_PHOTO_TYPES = ["image/jpeg", "image/png"];

const passwordSchema = (t: (k: string) => string) =>
    Yup.object({
        old_password: Yup.string().required(t("settings.required")),
        new_password: Yup.string()
            .required(t("settings.required"))
            .min(8, t("settings.passwordTooShort"))
            .test(
                "notSame",
                t("settings.sameAsOld"),
                (value, ctx) => Boolean(value) && value === ctx.parent.old_password
            ),
        confirm_password: Yup.string()
            .required(t("settings.required"))
            .oneOf([Yup.ref("new_password")], t("settings.passwordsDontMatch")),
    });

const PasswordInput = ({ id, label, value, onChange, onBlur, error, helperText, visible, onToggle }) => (
    <FormControl required error={error}>
        <FormLabel htmlFor={id}>{label}</FormLabel>
        <Input
            id={id}
            name={id}
            type={visible ? "text" : "password"}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            autoComplete={id === "old_password" ? "current-password" : "new-password"}
            sx={{ height: 45 }}
            endDecorator={
                <IconButton onClick={onToggle} size="sm" variant="plain" aria-label={label}>
                    {visible ? <VisibilityOffRounded /> : <VisibilityRounded />}
                </IconButton>
            }
        />
        {helperText ? <FormHelperText>{helperText}</FormHelperText> : null}
    </FormControl>
);

const SectionTitle = ({ icon, title, desc }) => (
    <Box sx={{ display: "flex", gap: 1.5, alignItems: "flex-start" }}>
        <Box
            sx={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                backgroundColor: "primary.softBg",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
            }}
        >
            {icon}
        </Box>
        <Box>
            <Typography level="title-md">{title}</Typography>
            <Typography level="body-xs" sx={{ color: "text.secondary" }}>
                {desc}
            </Typography>
        </Box>
    </Box>
);

const SettingsPage = ({
    accessToken,
    loginResult,
    changePasswordStatus,
    changePasswordErrorMessage,
    editUserStatus,
    editUserErrorMessage,
    profilePictureVersion,
}) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();

    const user = loginResult?.user;
    const fullName = useMemo(() => {
        if (!user) return "";
        return [user.first_name, user.middle_name, user.last_name].filter(Boolean).join(" ");
    }, [user]);

    // --- change password ---
    const [showPassword, setShowPassword] = useState(false);
    const formik = useFormik({
        initialValues: { old_password: "", new_password: "", confirm_password: "" },
        validationSchema: passwordSchema(t),
        onSubmit: (values) => {
            dispatch(changePasswordRequest(accessToken, values));
        },
    });
    const { errors, touched, handleBlur, handleChange, handleSubmit, resetForm, values } = formik;

    // --- profile picture ---
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [pendingFile, setPendingFile] = useState<File | null>(null);
    const [photoError, setPhotoError] = useState("");

    /* eslint-disable react-hooks/exhaustive-deps */
    useEffect(() => {
        if (changePasswordStatus === STATUS.SUCCESS) {
            toast.success(t("settings.passwordChanged"));
            dispatch(changePasswordReset());
            resetForm();
        } else if (changePasswordStatus === STATUS.ERROR) {
            toast.error(changePasswordErrorMessage ? t(changePasswordErrorMessage) : t("forget.error"));
            dispatch(changePasswordReset());
        }
    }, [changePasswordStatus]);

    useEffect(() => {
        if (editUserStatus === STATUS.SUCCESS) {
            toast.success(t("profile.successUpload"));
            setPreview(null);
            setPendingFile(null);
            dispatch(editUserReset());
        } else if (editUserStatus === STATUS.ERROR) {
            setPhotoError(editUserErrorMessage ? t(editUserErrorMessage) : t("profile.failureUpload"));
            setPreview(null);
            setPendingFile(null);
            dispatch(editUserReset());
        }
    }, [editUserStatus]);
    /* eslint-enable react-hooks/exhaustive-deps */

    // The stored avatar is the source of truth; the object URL is only a
    // local preview while a new file is being chosen.
    useEffect(() => {
        return () => {
            if (preview) URL.revokeObjectURL(preview);
        };
    }, [preview]);

    // The stored avatar is the source of truth; the object URL is only a
    // local preview while a new file is being chosen. The version is part of
    // the URL so a successful upload cannot be answered from cache.
    const avatarSrc =
        preview ?? profilePictureSrc(user?.profile_picture, profilePictureVersion);

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        setPhotoError("");
        if (!file) return;

        if (!ACCEPTED_PHOTO_TYPES.includes(file.type)) {
            setPhotoError(t("settings.photoWrongType"));
            e.target.value = "";
            return;
        }
        if (file.size > MAX_PHOTO_BYTES) {
            setPhotoError(t("settings.photoTooLarge"));
            e.target.value = "";
            return;
        }

        if (preview) URL.revokeObjectURL(preview);
        setPreview(URL.createObjectURL(file));
        setPendingFile(file);
    };

    // Mirrors the field set the existing edit-user forms send, so the picture
    // lands on the same contract the other role forms already use.
    const handleSavePhoto = () => {
        if (!pendingFile || !user) return;

        const formData = new FormData();
        formData.append("user_id", user.id ?? user.user_id ?? "");
        formData.append("first_name", user.first_name ?? "");
        formData.append("middle_name", user.middle_name ?? "");
        formData.append("last_name", user.last_name ?? "");
        formData.append("gender", user.gender ?? "");
        formData.append("email", user.email ?? "");
        formData.append("username", user.username ?? "");
        formData.append("mobile_number", user.mobile_number ?? "");
        formData.append("role", user.role ?? "");
        if (user.school != null) formData.append("school", String(user.school));
        formData.append("profile_picture", pendingFile);

        dispatch(editUserRequest(accessToken, formData));
    };

    const field = (name: string) => ({
        error: Boolean(touched[name] && errors[name]),
        helperText: touched[name] && errors[name] ? String(errors[name]) : null,
    });

    const savingPhoto = editUserStatus === STATUS.LOADING;
    const changingPassword = changePasswordStatus === STATUS.LOADING;

    return (
        <Box sx={{ px: { xs: 2, md: 0 } }}>
            <PageTitle title={t("settings.title")} />

            <LoadingView loading={savingPhoto || changingPassword} />

            <Stack gap={2} sx={{ maxWidth: 760, mx: "auto", my: 2 }}>
                {/* ---------------- Account ---------------- */}
                <Card variant="outlined" sx={{ p: { xs: 2, sm: 3 }, borderRadius: "md" }}>
                    <SectionTitle
                        icon={<PersonOutlineRounded />}
                        title={t("settings.account")}
                        desc={t("settings.accountDesc")}
                    />

                    <Divider sx={{ my: 2 }} />

                    <Stack direction={{ xs: "column", sm: "row" }} gap={3} alignItems="center">
                        <Box sx={{ position: "relative" }}>
                            <Avatar
                                src={avatarSrc}
                                size="lg"
                                sx={{ width: 110, height: 110 }}
                            />
                            <IconButton
                                onClick={() => fileInputRef.current?.click()}
                                size="sm"
                                variant="solid"
                                color="primary"
                                aria-label={t("settings.changePhoto")}
                                disabled={savingPhoto}
                                sx={{
                                    position: "absolute",
                                    bottom: 0,
                                    right: 0,
                                    borderRadius: "50%",
                                }}
                            >
                                <PhotoCameraRounded fontSize="small" />
                            </IconButton>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept={ACCEPTED_PHOTO_TYPES.join(",")}
                                hidden
                                onChange={handlePhotoChange}
                            />
                        </Box>

                        <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Typography level="title-md">{fullName || t("settings.notSet")}</Typography>
                            <Typography level="body-sm" sx={{ color: "text.secondary" }}>
                                {user?.email || t("settings.notSet")}
                            </Typography>
                            <Typography level="body-sm" sx={{ color: "text.secondary" }}>
                                {user?.mobile_number || t("settings.notSet")}
                            </Typography>
                            <Typography level="body-xs" sx={{ color: "text.tertiary", mt: 0.5 }}>
                                {t("settings.role")}: {user?.role || t("settings.notSet")}
                            </Typography>
                            <Typography level="body-xs" sx={{ color: "text.tertiary" }}>
                                {t("settings.photoHint")}
                            </Typography>

                            {photoError && (
                                <FormHelperText sx={{ color: "danger.solidColor" }}>{photoError}</FormHelperText>
                            )}

                            {pendingFile && (
                                <Button
                                    size="sm"
                                    onClick={handleSavePhoto}
                                    loading={savingPhoto}
                                    sx={{ mt: 1 }}
                                >
                                    {savingPhoto ? t("settings.savingPhoto") : t("settings.changePhoto")}
                                </Button>
                            )}
                        </Box>
                    </Stack>
                </Card>

                {/* ---------------- Security ---------------- */}
                <Card variant="outlined" sx={{ p: { xs: 2, sm: 3 }, borderRadius: "md" }}>
                    <SectionTitle
                        icon={<LockOutlined />}
                        title={t("settings.security")}
                        desc={t("settings.securityDesc")}
                    />

                    <Divider sx={{ my: 2 }} />

                    <Box
                        component="form"
                        onSubmit={handleSubmit}
                        noValidate
                        sx={{ display: "flex", flexDirection: "column", gap: 2, maxWidth: 420 }}
                    >
                        <PasswordInput
                            id="old_password"
                            label={t("settings.oldPassword")}
                            value={values.old_password}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={field("old_password").error}
                            helperText={field("old_password").helperText}
                            visible={showPassword}
                            onToggle={() => setShowPassword((v) => !v)}
                        />
                        <PasswordInput
                            id="new_password"
                            label={t("settings.newPassword")}
                            value={values.new_password}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={field("new_password").error}
                            helperText={field("new_password").helperText}
                            visible={showPassword}
                            onToggle={() => setShowPassword((v) => !v)}
                        />
                        <PasswordInput
                            id="confirm_password"
                            label={t("settings.confirmNewPassword")}
                            value={values.confirm_password}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={field("confirm_password").error}
                            helperText={field("confirm_password").helperText}
                            visible={showPassword}
                            onToggle={() => setShowPassword((v) => !v)}
                        />
                        <Typography level="body-xs" sx={{ color: "text.tertiary" }}>
                            {t("settings.passwordHint")}
                        </Typography>
                        <Button
                            type="submit"
                            loading={changingPassword}
                            sx={{
                                height: 45,
                                backgroundColor: "text.primary",
                                color: "background.surface",
                                fontWeight: "bold",
                            }}
                        >
                            {t("settings.changePassword")}
                        </Button>
                    </Box>
                </Card>

                {/* ---------------- Appearance ---------------- */}
                <Card variant="outlined" sx={{ p: { xs: 2, sm: 3 }, borderRadius: "md" }}>
                    <SectionTitle
                        icon={<PaletteOutlined />}
                        title={t("settings.appearance")}
                        desc={t("settings.appearanceDesc")}
                    />

                    <Divider sx={{ my: 2 }} />

                    <Stack direction={{ xs: "column", sm: "row" }} gap={2} alignItems="center">
                        <Typography level="body-sm" sx={{ flex: 1 }}>
                            {t("settings.language")}
                        </Typography>
                        <LanguageMenu change={() => {}} />
                        <Typography level="body-sm" sx={{ flex: 1 }}>
                            {t("settings.theme")}
                        </Typography>
                        <ColorSchemeToggle />
                    </Stack>
                </Card>

                {/* ---------------- Help ---------------- */}
                <Card variant="outlined" sx={{ p: { xs: 2, sm: 3 }, borderRadius: "md" }}>
                    <SectionTitle
                        icon={<HelpOutlineRounded />}
                        title={t("settings.help")}
                        desc={t("settings.helpDesc")}
                    />

                    <Divider sx={{ my: 2 }} />

                    <Button
                        component={Link}
                        to={NAVIGATE_TO_SUPPORTPAGE}
                        variant="outlined"
                        color="neutral"
                        startDecorator={<HelpOutlineRounded />}
                        sx={{ alignSelf: { xs: "stretch", sm: "flex-start" } }}
                    >
                        {t("settings.openSupport")}
                    </Button>
                </Card>
            </Stack>
        </Box>
    );
};

const mapStateToProps = ({ auth }) => {
    const {
        accessToken,
        loginResult,
        changePasswordStatus,
        changePasswordErrorMessage,
        editUserStatus,
        editUserErrorMessage,
        profilePictureVersion,
    } = auth;

    return {
        accessToken,
        loginResult,
        changePasswordStatus,
        changePasswordErrorMessage,
        editUserStatus,
        editUserErrorMessage,
        profilePictureVersion,
    };
};

export default connect(mapStateToProps, {})(SettingsPage);
