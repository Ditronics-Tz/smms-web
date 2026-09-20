import React from "react";
import { Typography, Box, Sheet, Divider, IconButton } from "@mui/joy";
import { PageTitle } from "../../../components";
import CallOutlined from "@mui/icons-material/CallOutlined";
import EmailOutlined from "@mui/icons-material/EmailOutlined";
import HelpOutlineOutlined from "@mui/icons-material/HelpOutlineOutlined";
import ExpandMoreRounded from "@mui/icons-material/ExpandMoreRounded";
import { useTranslation } from "react-i18next";
import branding from "../../../config/branding";

const FAQItem = ({ title, desc, t }) => {
    const [open, setOpen] = React.useState(false);
    return (
        <Sheet
            variant="outlined"
            sx={{
                borderRadius: 'md',
                p: 2,
                mb: 1.5,
                cursor: 'pointer',
                transition: '0.2s ease',
                '&:hover': { boxShadow: 'sm' }
            }}
            onClick={() => setOpen((prev) => !prev)}
        >
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography level="title-md">{title}</Typography>
                <IconButton
                    size="sm"
                    variant="plain"
                    color="primary"
                    onClick={() => setOpen((prev) => !prev)}
                >
                    <ExpandMoreRounded style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transition: '0.2s ease' }} />
                </IconButton>
            </Box>
            {open && (
                <Typography level="body-sm" sx={{ mt: 1, color: 'text.secondary' }}>
                    {desc}
                </Typography>
            )}
        </Sheet>
    );
};

const SupportPage = () => {
    const { t } = useTranslation();
    return (
        <Box sx={{ px: { xs: 2, md: 0 } }}>
            <PageTitle title={t("support.title")} />

            <Divider sx={{ my: 2 }} />

            <Typography level="body-md" sx={{ mb: 2, color: 'text.secondary' }}>
                {t("support.desc")}
            </Typography>

            {/* Contact cards */}
            <Box
                sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' },
                    gap: 2,
                    my: 3
                }}
            >
                {/* Phone */}
                <Sheet variant="outlined" sx={{ p: 2, borderRadius: 'md', display: 'flex', gap: 1.5, alignItems: 'center' }}>
                    <Box sx={{
                        width: 42, height: 42, borderRadius: '50%', backgroundColor: 'primary.softBg',
                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                        <CallOutlined />
                    </Box>
                    <Box>
                        <Typography level="title-md">{t("support.phone")}</Typography>
                        <Typography level="body-sm" color="primary">{branding.SUPPORT_PHONE}</Typography>
                    </Box>
                </Sheet>

                {/* Email */}
                <Sheet variant="outlined" sx={{ p: 2, borderRadius: 'md', display: 'flex', gap: 1.5, alignItems: 'center' }}>
                    <Box sx={{
                        width: 42, height: 42, borderRadius: '50%', backgroundColor: 'primary.softBg',
                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                        <EmailOutlined />
                    </Box>
                    <Box>
                        <Typography level="title-md">{t("support.email")}</Typography>
                        <Typography level="body-sm" color="primary">{branding.SUPPORT_EMAIL}</Typography>
                    </Box>
                </Sheet>

                {/* Chat */}
                <Sheet variant="outlined" sx={{ p: 2, borderRadius: 'md', display: 'flex', gap: 1.5, alignItems: 'center' }}>
                    <Box sx={{
                        width: 42, height: 42, borderRadius: '50%', backgroundColor: 'primary.softBg',
                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                        <HelpOutlineOutlined />
                    </Box>
                    <Box>
                        <Typography level="title-md">{t("support.chat")}</Typography>
                        <Typography level="body-sm" sx={{ color: 'text.secondary' }}>{t("support.chatDesc")}</Typography>
                    </Box>
                </Sheet>
            </Box>

            {/* FAQ */}
            <Box sx={{ mt: 3 }}>
                <Typography level="title-lg" sx={{ mb: 1.5 }}>
                    {t("support.FAQ")}
                </Typography>
                <FAQItem title={t("support.faq1Title")} desc={t("support.faq1Desc")} t={t} />
                <FAQItem title={t("support.faq2Title")} desc={t("support.faq2Desc")} t={t} />
                <FAQItem title={t("support.faq3Title")} desc={t("support.faq3Desc")} t={t} />
            </Box>
        </Box>
    );
};

export default SupportPage;
