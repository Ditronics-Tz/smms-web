import React, {  } from "react";
import { CssVarsProvider } from "@mui/joy/styles";
import GlobalStyles from "@mui/joy/GlobalStyles";
import CssBaseline from "@mui/joy/CssBaseline";
import Box from "@mui/joy/Box";

import Typography from "@mui/joy/Typography";

import { Avatar, Button, Card } from "@mui/joy";
import theme from "../../utils/theme";
import image from "../../constant/image";
import { RefreshOutlined, WarningOutlined } from "@mui/icons-material";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function Error404Page() {

  const {t} = useTranslation();
  return (
    <CssVarsProvider
      defaultMode="light"
      disableTransitionOnChange
      theme={theme}>
      <CssBaseline />
      <GlobalStyles
        styles={{
          ":root": {
            "--Collapsed-breakpoint": "769px", // form will stretch when viewport is below `769px`
            "--Cover-width": "50vw", // must be `vw` only
            "--Form-maxWidth": "600px",
            "--Transition-duration": "0.4s", // set to `none` to disable transition
          },
        }}
      />
      <Box
        sx={(theme) => ({
          //   width: '90%',
          transition: "width var(--Transition-duration)",
          transitionDelay: "calc(var(--Transition-duration) + 0.1s)",
          position: "relative",
          zIndex: 1,
          display: "flex",
          // justifyContent: 'center',

          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundImage: `url(${image.Images.backgroung})`,
          [theme.getColorSchemeSelector("dark")]: {
            backgroundImage: `url(${image.Images.backgroung2})`,
          },
        })}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            minHeight: "100dvh",
            width: "100%",
            // width:
            //   'clamp(var(--Form-maxWidth), (var(--Collapsed-breakpoint) - 100vw) * 999, 100%)',
            maxWidth: "100%",
            px: 2,
          }}>
          <Box
            component="header"
            sx={{
              py: 4,
              gap: 1,
              display: "flex",
              alignItems: "center",
              // justifyContent: 'center',
              // flexDirection: 'column',
            }}>
            <Avatar
              src={image.Images.logo}
              size="sm"
              sx={{
                maxWidth: 80,
                maxHeight: 80,
                backgroundColor: "primary.500",
                padding: "5px",
              }}
            />
            <Typography level="title-lg">{t("intro.appName")}</Typography>
          </Box>

          <Card
            sx={{
              alignSelf: "center",
              top: 40,
              flexDirection: "row",
              alignItems: "center",
              gap: 2,
            }}>
            <Box>
              <Typography
                startDecorator={<WarningOutlined sx={{ color: "orange" }} />}
                level="title-lg"
                sx={{ fontSize: { xs: 30, md: 60 }, color: "orange" }}>
                404
              </Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
              }}>
              <Typography level="title-lg" textAlign={"center"}>
                {t('alert.404Title')}
              </Typography>
              <Typography level="body-sm">
                {t('alert.404Desc')}
              </Typography>
              <Link to="/">
                <Button
                  startDecorator={<RefreshOutlined />}
                  sx={{ mt: 2 }}
                  onClick={null}>
                  Refresh
                </Button>
              </Link>
            </Box>
          </Card>
          <Box
            component="footer"
            sx={{
              py: 3,
              width: "100%",
              position: "absolute",
              bottom: 10,
              alignSelf: "center",
            }}>
            <Typography
              level="body-xs"
              textAlign="center"
              sx={{ color: "whitesmoke" }}>
              © {t('intro.owner')} {new Date().getFullYear()}
            </Typography>
          </Box>
        </Box>
      </Box>
    </CssVarsProvider>
  );
}
