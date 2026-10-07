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

const telHref = (phone) => String(phone).replace(/[^\d+]/g, "");

// Renders a real, clickable link when the value is configured, and an explicit
// "not configured" note when it is not. Showing a bare "#" or an empty string
// was what made this section look unfinished; a config gap now reads as a
// config gap instead.
const ContactCard = ({ icon, title, value, href, isUrl = false }) => {
    const { t } = useTranslation();
    const configured = Boolean(value);

    const body = (
        <>
            <Box sx={{
                width: 42, height: 42, borderRadius: '50%', backgroundColor: 'primary.softBg',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
            }}>
                {icon}
            </Box>
            <Box sx={{ minWidth: 0 }}>
                <Typography level="title-md">{title}</Typography>
                {configured ? (
                    <Typography
                        level="body-sm"
                        color="primary"
                        sx={{ wordBreak: "break-word", fontWeight: 600 }}
                    >
                        {isUrl ? t("support.openChat") : value}
                    </Typography>
                ) : (
                    <Typography level="body-sm" sx={{ color: 'text.tertiary' }}>
                        {t("support.notConfigured")}
                    </Typography>
                )}
            </Box>
        </>
    );

    return (
        <Sheet
            variant="outlined"
            component={configured ? "a" : "div"}
            {...(configured ? { href, target: isUrl ? "_blank" : undefined, rel: isUrl ? "noopener noreferrer" : undefined } : {})}
            sx={{
                p: 2, borderRadius: 'md', display: 'flex', gap: 1.5, alignItems: 'center',
                textDecoration: 'none',
                color: 'inherit',
                ...(configured
                    ? { cursor: 'pointer', transition: '0.2s ease', '&:hover': { boxShadow: 'sm', borderColor: 'primary.300' } }
                    : {})
            }}
        >
            {body}
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
                <ContactCard
                    icon={<CallOutlined />}
                    title={t("support.phone")}
                    value={branding.SUPPORT_PHONE}
                    href={branding.SUPPORT_PHONE ? `tel:${telHref(branding.SUPPORT_PHONE)}` : null}
                />
                <ContactCard
                    icon={<EmailOutlined />}
                    title={t("support.email")}
                    value={branding.SUPPORT_EMAIL}
                    href={branding.SUPPORT_EMAIL ? `mailto:${branding.SUPPORT_EMAIL}` : null}
                />
                <ContactCard
                    icon={<HelpOutlineOutlined />}
                    title={t("support.chat")}
                    value={branding.SUPPORT_CHAT_URL}
                    href={branding.SUPPORT_CHAT_URL || null}
                    isUrl
                />
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
