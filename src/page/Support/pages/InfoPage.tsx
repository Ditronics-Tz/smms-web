import React from "react";
import { Typography, Box, Sheet, Divider, List, ListItem, ListItemDecorator } from "@mui/joy";
import { PageTitle } from "../../../components";
import InfoOutlined from "@mui/icons-material/InfoOutlined";
import CheckRounded from "@mui/icons-material/CheckRounded";
import InfoRounded from "@mui/icons-material/InfoRounded";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { NAVIGATE_TO_SUPPORTPAGE } from "../../../route/types";

const InfoPage = () => {
    const { t } = useTranslation();
    return (
        <Box sx={{ px: { xs: 2, md: 0 } }}>
            <PageTitle title={t("info.title")} />

            <Divider sx={{ my: 2 }} />

            <Typography level="body-md" sx={{ mb: 2, color: 'text.secondary' }}>
                {t("info.desc")}
            </Typography>

            <Sheet variant="outlined" sx={{ p: 3, borderRadius: 'md', maxWidth: 640 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                    <InfoOutlined color="primary" />
                    <Typography level="title-lg">{t("info.about")}</Typography>
                </Box>
                <Typography level="body-sm" sx={{ color: 'text.secondary', mb: 2 }}>
                    {t("info.aboutDesc")}
                </Typography>

                <List size="sm">
                    <ListItem>
                        <ListItemDecorator><CheckRounded color="success" /></ListItemDecorator>
                        {t("notification.transaction")}
                    </ListItem>
                    <ListItem>
                        <ListItemDecorator><CheckRounded color="success" /></ListItemDecorator>
                        {t("support.chat")}
                    </ListItem>
                    <ListItem>
                        <ListItemDecorator><CheckRounded color="success" /></ListItemDecorator>
                        {t("card.title")}
                    </ListItem>
                </List>

                <Divider sx={{ my: 2 }} />

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <InfoRounded color="primary" />
                    <Typography level="body-sm">
                        <b>{t("info.version")}:</b> {t("info.versionValue")}
                    </Typography>
                </Box>
            </Sheet>

            <Typography level="body-sm" sx={{ mt: 3, color: 'primary' }}>
                <Link to={NAVIGATE_TO_SUPPORTPAGE} style={{ textDecoration: 'none' }}>
                    {t("info.support")}
                </Link>
            </Typography>
        </Box>
    );
};

export default InfoPage;
