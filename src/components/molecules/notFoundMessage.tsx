import { WarningRounded } from "@mui/icons-material"
import { Card, Typography } from "@mui/joy"
import React from "react";
import { useTranslation } from "react-i18next"

const NotFoundMessage = () => {
    const { t } = useTranslation();
    return (
        <Card sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            top: '20%'
        }}>
            <WarningRounded sx={{ fontSize: '50px', color: 'background.appcolor' }} />
            <Typography level="title-md">{t("alert.notFound")}</Typography>
            <Typography level="body-sm" textAlign={'center'}>{t("alert.notFoundDesc")}</Typography>
        </Card>
    )
}

export default NotFoundMessage