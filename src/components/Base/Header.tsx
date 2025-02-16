import { Link, useNavigate } from "react-router-dom";
import { useDispatch, connect } from "react-redux";
import { toast } from "react-toastify";
import { STATUS } from "../../constant";
import React, { Fragment, useEffect, useState } from "react";
import { requestForToken, onMessageListener } from '../../firebase/firebase'

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
import { logoutRequest, notificationsRequest, notificationsReset } from "../../store/actions";
import { useColorScheme } from "@mui/joy/styles";
import { NAVIGATE_TO_DASHBOARD, NAVIGATE_TO_LOGINPAGE, NAVIGATE_TO_PROFILEPAGE } from "../../route/types";
import image from "../../constant/image";
import { DarkMode, LightMode, Lock, Notifications, Settings } from "@mui/icons-material";
import HelpRoundedIcon from '@mui/icons-material/HelpRounded';
import {
  Badge,
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
  accessToken,

  notificationsStatus,
  notificationsResult,
  notificationsErrorMessage,
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const [refresh, setRefresh] = useState(false)
  const [name, setName] = useState("");
  const [role, setRole] = useState("");

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

  // ---- NOTIFICATIONS -----
  const [notificationCount, setNotificationCount] = useState(null)
  const [notList, setNotList] = React.useState([]);
  const [notLoad, setNotLoad] = React.useState(false);
  const [notError, setNotError] = React.useState("");

  // --- get message from backedn
  useEffect(() => {
    if (notificationsStatus === STATUS.SUCCESS) {
      setNotList(notificationsResult);
      dispatch(notificationsReset())
    }
    else if (notificationsStatus === STATUS.ERROR) {
      setNotError(notificationsErrorMessage)
      dispatch(notificationsReset())
    }
  }, [notificationsStatus])

  useEffect(() => {
    dispatch(notificationsRequest(accessToken, {}))
  }, [])

  // get background message
  useEffect(() => {
    // Listen for background messages through the BroadcastChannel
    const channel = new BroadcastChannel("notification-channel");

    channel.addEventListener("message", (event) => {
      console.log("Background message received: ", event.data);

      const newNotification = {
        type: event.data.notification.title,
        message: event.data.notification.body,
        created_at: new Date().toISOString(),
      };

      // Update the notification list and count for background messages
      setNotList((prev) => [newNotification, ...prev]);
      setNotificationCount((prev) => prev + 1);
    });

    // Cleanup on component unmount
    return () => {
      channel.close();
    };
  }, []);

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
              sx={{ maxWidth: '32px', maxHeight: '32px', borderRadius: '9999999px' }}
              aria-label="Notifications"
            >
              <IconButton
                id="toggle-mode"
                size="sm"
                variant="plain"
                color="success"
                sx={{ alignSelf: 'center' }}
              // onClick={null}
              // aria-haspopup="true"
              // aria-expanded={open ? 'true' : 'false'}
              >
                <Badge size="sm" badgeContent={notificationCount}>
                  <Notifications />
                </Badge>
              </IconButton>
            </MenuButton>
            <Menu
              placement="bottom"
              size="sm"
              sx={{
                zIndex: '99999',
                overflow: 'auto',
                maxHeight: '90vh', // Set a maximum height for the menu
                width: { xs: "90%", md: '400px' },
                justifyContent: 'flex-start', // Align content to the top
                alignItems: 'flex-start', // Align content to the left
                pt: 0,
                pb: 2,
                px: 1,
                gap: 1,
                '--ListItem-radius': 'var(--joy-radius-sm)',
              }}
              aria-labelledby="toggle-mode"
            >
              {/* notification header */}
              <Box sx={{
                display: 'flex',
                gap: 1,
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%',
                position: 'sticky', // Make the header sticky
                top: 0, // Stick to the top
                backgroundColor: 'background.surface', // Match the background color
                zIndex: 1, // Ensure the header stays above the scrollable content
                p: 1, // Add padding to the header
                borderBottom: '1px solid', // Add a border to separate the header from the content
                borderColor: 'divider', // Use the theme's divider color
              }}>
                <Notifications />
                <Typography level='title-md' id="notification-header">
                  {t("header.notification")}
                </Typography>
              </Box>

              {notLoad || notificationsStatus === STATUS.LOADING ? (
                <CircularProgress size='lg' thickness={3} sx={{ alignSelf: 'center' }} />
              ) : (
                notList.length > 0 ? notList.map((item, index) => (
                  <Sheet
                    variant="outlined"
                    key={index}
                    sx={{
                      width: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      alignSelf: 'flex-start',
                      p: 0.7,
                      gap: 0.5,
                      borderRadius: 'sm',
                      boxShadow: 'sm',
                    }}
                  >
                    <Typography level='title-sm'>
                      {{
                        "transaction": t("notification.transaction"),
                        "system": t("notification.system"),
                        "reminder": t("notification.reminder"),
                        "message": t("notification.message")
                      }[item.type]}
                    </Typography>
                    <Typography level='body-xs'>{item.message}</Typography>
                    <Divider />
                  </Sheet>
                )) : (
                  <Typography level='title-sm' sx={{ p: 1, backgroundColor: 'lightgray', borderRadius: 'md' }}>
                    {notError || t("notification.notFound")}
                  </Typography>
                )
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
const mapStateToProps = ({ auth, resources }) => {
  const {
    loginStatus,
    loginResult,
    loginErrorMessage,
    accessToken
  } = auth;

  const {
    notificationsStatus,
    notificationsResult,
    notificationsErrorMessage,
  } = resources

  return {
    loginStatus,
    loginResult,
    loginErrorMessage,
    accessToken,

    notificationsStatus,
    notificationsResult,
    notificationsErrorMessage,
  };
};

//connecting Redux store to sidebar component
export default connect(mapStateToProps, {})(Header);
