import { Link, useNavigate } from "react-router-dom";
import { useDispatch, connect } from "react-redux";
import { toast } from "react-toastify";
import { STATUS } from "../../constant";
import React, { Fragment, useEffect, useState } from "react";
import { fetchProfileReset } from "../../store/actions";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import {
  passwordChangeReset,
  passwordChangeRequest,
} from "../../store/actions";
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
import { userLogoutRequest, resetUserType } from "../../store/actions";
import { useColorScheme } from "@mui/joy/styles";
import { NAVIGATE_TO_DASHBOARD, NAVIGATE_TO_LOGINPAGE, NAVIGATE_TO_PROFILEPAGE } from "../../route/types";
import image from "../../constant/image";
import { Lock } from "@mui/icons-material";
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
} from "@mui/joy";
import { useTranslation } from "react-i18next";
import LanguageMenu from "../molecules/LanguageMenu";
// import ColorSchemeToggle from '../../utils/ColorSchemeToggle';

function ColorSchemeToggle() {
  const { mode, setMode } = useColorScheme();
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) {
    return <IconButton size="sm" variant="outlined" color="primary" />;
  }
  return (
    <Tooltip title="Change theme" variant="outlined">
      <IconButton
        id="toggle-mode"
        size="sm"
        variant="plain"
        color="neutral"
        sx={{ alignSelf: "center" }}
        onClick={() => {
          if (mode === "light") {
            setMode("dark");
          } else {
            setMode("light");
          }
        }}>
        {mode === "light" ? <DarkModeRoundedIcon /> : <LightModeRoundedIcon />}
      </IconButton>
    </Tooltip>
  );
}

const Header = ({
  // profileResult,
  // profileStatus,
  // userLoginResult,
  // passwordChangeStatus,
  // passwordChangeResult,
  // passwordChangeErrorMessage,
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const [refresh, setRefresh] = useState(false)

  const [oldPass, setOldPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [isData, setIsData] = useState(false);
  const [error, setError] = useState("");
  const [name, setName] = useState("Godlisten Honest");
  const [trustIndex, setTrustIndex] = useState("");

  const [open, setOpen] = useState(false);


  const logOut = () => {
    navigate(NAVIGATE_TO_LOGINPAGE)
    // setTimeout(() => {
    //   dispatch(resetUserType());
    // }, 2000);
    // dispatch(userLogoutRequest());
  };

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
              <Typography level="title-md" sx={{fontFamily: 'roboto'}}>{t("intro.appName")}</Typography>
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

          {/* Change theme */}
          <ColorSchemeToggle />

          {/* language */}
          <LanguageMenu change={() => setRefresh(!refresh)} />

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
                    </Box>
                  </Box>
                </Link>
              </MenuItem>

              <Divider />

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
const mapStateToProps = ({ profile, authAmb, password }) => {
  const { otpResult: userLoginResult } = authAmb;

  const {
    passwordChangeStatus: passwordChangeStatus,
    passwordChangeResult: passwordChangeResult,
    passwordChangeErrorMessage: passwordChangeErrorMessage,
  } = password;

  const { profileResult: profileResult, profileStatus: profileStatus } =
    profile;

  return {
    userLoginResult,
    profileResult,
    profileStatus,
    passwordChangeStatus,
    passwordChangeResult,
    passwordChangeErrorMessage,
  };
};

//connecting Redux store to sidebar component
// export default connect(mapStateToProps, {})(Header);
export default Header
