import { Link, useNavigate } from "react-router-dom";
import { useDispatch, connect } from "react-redux";
import { toast } from "react-toastify";
import { STATUS } from "../../constant";
import React, { Fragment, useEffect, useState } from "react";

import GlobalStyles from "@mui/joy/GlobalStyles";
import Sheet from "@mui/joy/Sheet";
import MenuIcon from "@mui/icons-material/Menu";
import Box from "@mui/joy/Box";
import Typography from "@mui/joy/Typography";
import IconButton from "@mui/joy/IconButton";
import Avatar from "@mui/joy/Avatar";
import Tooltip from "@mui/joy/Tooltip";
import Dropdown from "@mui/joy/Dropdown";
import Menu from "@mui/joy/Menu";
import MenuButton from "@mui/joy/MenuButton";
import MenuItem from "@mui/joy/MenuItem";
import ListDivider from "@mui/joy/ListDivider";

import DarkModeRoundedIcon from "@mui/icons-material/DarkModeRounded";
import LightModeRoundedIcon from "@mui/icons-material/LightModeRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";

import { toggleSidebar } from "../../utils/sideBarutils";
import { logoutRequest } from "../../store/actions";
import { useColorScheme } from "@mui/joy/styles";
import { NAVIGATE_TO_DASHBOARD, NAVIGATE_TO_LOGINPAGE, NAVIGATE_TO_PROFILEPAGE } from "../../route/types";
import image from "../../constant/image";
import { DarkMode, LightMode, Lock, Notifications, Settings } from "@mui/icons-material";
import HelpRoundedIcon from '@mui/icons-material/HelpRounded';
import {
  Button,
  CircularProgress,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalClose,
  ModalDialog,
  Switch,
} from "@mui/joy";
import { useTranslation } from "react-i18next";
import LanguageMenu from "../molecules/LanguageMenu";
import { doLogout } from "../../service/auth";
// import ColorSchemeToggle from '../../utils/ColorSchemeToggle';

function ColorSchemeToggle() {
  const { mode, setMode } = useColorScheme();
  const [mounted, setMounted] = React.useState(false);
  const { t } = useTranslation();
  React.useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) {
    return <IconButton size="sm" variant="outlined" color="success" />;
  }
  return (
    <Switch
      checked={mode == "dark"}
      id="toogle-mode"
      startDecorator={mode === "light" ? t("header.switchDark") : t("header.switchLight")}
      onChange={() => {
        if (mode === 'light') {
          setMode('dark');
        } else {
          setMode('light');
        }
      }}
      size="lg"
      slotProps={{
        input: { 'aria-label': 'Dark mode' },
        thumb: {
          children: mode === "light" ? <LightMode /> : <DarkMode />,
        },
      }
      }
      sx={{ '--Switch-thumbSize': '16px', width: '100%', pl: 1.5 }}
    />
  );
}

const Header = ({
  loginStatus,
  loginResult,
  loginErrorMessage,
  accessToken
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const [refresh, setRefresh] = useState(false)
  const [name, setName] = useState("");
  const [role, setRole] = useState("");

  const [notList, setNotList] = React.useState([]);
  const [notLoad, setNotLoad] = React.useState(false);
  const [notError, setNotError] = React.useState("");

  useEffect(() => {
    if (loginResult != null || loginResult != undefined) {
      setName(loginResult.user.first_name + " " + loginResult.user.last_name)
      setRole(loginResult.user.role)
    }
  }, [loginResult])

  const logOut = () => {
    const data = {
      "refresh": loginResult.refresh
    }
    doLogout(data)
    dispatch(logoutRequest());
  };

  useEffect(() => {
    console.log("Refresh screen")
  }, [refresh])

  return (
    <Fragment>
      <Sheet
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          position: "fixed",
          backgroundColor: 'background.body',
          top: 0,
          width: "100vw",
          // bgcolor: "background.appcolor",
          // height: 'var(--Header-height)',
          zIndex: 9999,
          px: { xs: 1, md: 3 },
          py: { xs: 2, md: 2 },
          gap: 1,
          borderBottom: "1px solid",
          borderColor: "background.level1",
          boxShadow: "sm",
        }}>
        <GlobalStyles
          styles={(theme) => ({
            ":root": {
              "--Header-height": "52px",
              [theme.breakpoints.up("md")]: {
                "--Header-height": "0px",
              },
            },
          })}
        />

        {/* ------------------- MENU ICON ----------------------- */}
        <Box
          sx={{
            display: 'flex',
            gap: 2,
            transform: {
              md: "translateX(calc(100% * (var(--SideNavigation-slideIn, 1) - 1)))",
            },
            // borderColor: "background",
            ml: { lg: 'var(--SideNavigation-open)' },
            alignItems: 'center'

          }}>
          {/* toggle sidebar button */}
          <IconButton
            onClick={() => toggleSidebar()}
            variant="outlined"
            // color="neutral"
            size="sm"
            sx={{
              transform: {
                md: "translateX(calc(100% * (var(--SideNavigation-slideIn, 1) - 1)))",
              },
              // borderColor: "background",
              // ml: { lg: 'var(--SideNavigation-open)' }
            }}>
            <MenuIcon />
          </IconButton>

          {/* web name */}
          <Link to={NAVIGATE_TO_DASHBOARD} style={{ textDecoration: 'none' }}>
            <Box sx={{ display: { xs: "none", md: "flex" }, gap: 1, alignItems: "center" }}>
              <Typography level="title-md" sx={{ fontFamily: 'roboto' }}>{t("intro.appName")}</Typography>
              {/* <ColorSchemeToggle sx={{ ml: 'auto' }} /> */}
            </Box>
          </Link>
        </Box>


        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            gap: 1.5,
            alignItems: "center",
          }}>

          {/* language */}
          <LanguageMenu change={() => setRefresh(!refresh)} />

          {/* notifications */}
          <Dropdown>
            <MenuButton
              variant="plain"
              size="sm"
              sx={{ maxWidth: '32px', maxHeight: '32px', borderRadius: '9999999px' }}>
              <IconButton
                id="toggle-mode"
                size="sm"
                variant="plain"
                color="success"
                sx={{ alignSelf: 'center' }}
                onClick={null}
              >
                <Notifications />
              </IconButton>
            </MenuButton>
            <Menu
              placement="bottom"
              size="sm"
              sx={{
                zIndex: '99999',
                width: { xs: "90%", sm: "60%", md: '40%' },
                justifyContent: 'center',
                alignItems: 'center',
                p: 1,
                gap: 1,
                '--ListItem-radius': 'var(--joy-radius-sm)',
              }}>

              {/* notification header */}
              <Box sx={{
                display: 'flex',
                gap: 1,
                justifyContent: 'center',
                alignItems: 'center'
              }}>
                <Notifications />
                <Typography level='title-md'> {t("header.notification")}</Typography>
              </Box>
              <ListDivider />

              {notLoad ?
                <CircularProgress size='lg' thickness={3} sx={{ alignSelf: 'center' }} />
                : (
                  notList.length > 0 ? notList.map((item, index) => (
                    <Box
                      key={index}
                      sx={{
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignSelf: 'flex-start',
                        p: 0.7,
                        borderLeft: 2.5,
                        borderBottom: 0.6,
                        borderColor: 'green',
                        gap: 0.5
                      }}>
                      <Typography level='title-sm'>{item.title}</Typography>
                      <Typography level='body-sm'>{item.message}</Typography>
                      {/* <Divider /> */}
                    </Box>
                  )) :
                    <Typography level='title-md' sx={{ p: 1, backgroundColor: 'lightgray', borderRadius: 'md' }}>{notError}</Typography>
                )}
            </Menu>
          </Dropdown>

          {/* --------------- Dropdown menu toggle  ---------- */}
          <Dropdown>
            <MenuButton
              variant="outlined"
              // color="secondary"
              size="sm"
              sx={{
                // maxWidth: "32px",
                gap: 1,
                // maxHeight: {xs: "32px", md: 'auto'},
                borderRadius: "9999999px",
                borderColor: 'background.appcolor'
              }}>
              <Avatar
                src={image.Images.userIcon2}
                sx={{ maxWidth: "29px", maxHeight: "29px" }}
                size="sm"
              />
              {/* ------------ user name  -------------*/}
              <Typography level="title-sm" sx={{ display: { xs: 'none', md: 'flex' } }}>
                {name}
              </Typography>
            </MenuButton>

            {/* ---------------- Dropdown Menu ------------------- */}
            <Menu
              placement="bottom-end"
              size="sm"
              sx={{
                zIndex: "99999",
                p: 1,
                gap: 1,
                "--ListItem-radius": "var(--joy-radius-sm)",
              }}>

              {/* --------------- User profile ----------- */}
              <MenuItem >
                <Link to={NAVIGATE_TO_PROFILEPAGE} style={{ textDecoration: 'none' }}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                    }}>
                    <Avatar
                      src={image.Images.userIcon2}
                      sx={{ maxWidth: "29px", maxHeight: "29px" }}
                      size="sm"
                    />
                    <Box sx={{ ml: 1.5 }}>
                      <Typography level="title-sm" textColor="text.primary">
                        {name}
                      </Typography>
                      <Typography level="body-sm">
                        {role}
                      </Typography>
                    </Box>
                  </Box>
                </Link>
              </MenuItem>

              <ListDivider />

              {/* change theme */}
              <ColorSchemeToggle />

              {/* profile and settings */}
              <MenuItem
                component="a"
                href={'#'}>
                <Settings />
                {t("header.setting")}
              </MenuItem>

              {/* support */}
              <MenuItem
                component="a"
                href={'#'}>
                <HelpRoundedIcon />
                {t("header.support")}
              </MenuItem>

              {/* ------------- logout button ----------------- */}
              <MenuItem component="a" href="#" onClick={logOut}>
                <LogoutRoundedIcon />
                {t("header.logout")}
              </MenuItem>
            </Menu>
          </Dropdown>
        </Box>
      </Sheet>
    </Fragment>
  );
};

//mapping Redux store states to props
const mapStateToProps = ({ auth }) => {
  const {
    loginStatus,
    loginResult,
    loginErrorMessage,
    accessToken
  } = auth;

  return {
    loginStatus,
    loginResult,
    loginErrorMessage,
    accessToken
  };
};

//connecting Redux store to sidebar component
export default connect(mapStateToProps, {})(Header);
