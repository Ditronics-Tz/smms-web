import * as React from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import GlobalStyles from "@mui/joy/GlobalStyles";
import Avatar from "@mui/joy/Avatar";
import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import Card from "@mui/joy/Card";
import Chip from "@mui/joy/Chip";
import Divider from "@mui/joy/Divider";
import IconButton from "@mui/joy/IconButton";
import Input from "@mui/joy/Input";
import LinearProgress from "@mui/joy/LinearProgress";
import List from "@mui/joy/List";
import ListItem from "@mui/joy/ListItem";
import ListItemButton, { listItemButtonClasses } from "@mui/joy/ListItemButton";
import ListItemContent from "@mui/joy/ListItemContent";
import Typography from "@mui/joy/Typography";
import Sheet from "@mui/joy/Sheet";
import Stack from "@mui/joy/Stack";

import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import WalletRoundedIcom from "@mui/icons-material/WalletRounded";
import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import TransferRoundIcon from "@mui/icons-material/TransferWithinAStationRounded";
import ShoppingCartRoundedIcon from "@mui/icons-material/ShoppingCartRounded";
import AssignmentRoundedIcon from "@mui/icons-material/AssignmentRounded";
import QuestionAnswerRoundedIcon from "@mui/icons-material/QuestionAnswerRounded";
import GroupRoundedIcon from "@mui/icons-material/GroupRounded";
import SupportRoundedIcon from "@mui/icons-material/SupportRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import BrightnessAutoRoundedIcon from "@mui/icons-material/BrightnessAutoRounded";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import InfoRoundIcon from "@mui/icons-material/InfoRounded";
import CurrentExchangeRoundIcon from "@mui/icons-material/CurrencyExchangeOutlined";

// import ColorSchemeToggle from '../../utils/ColorSchemeToggle';
import { closeSidebar } from "../../utils";
import image from "../../constant/image";
import { userLogoutRequest, resetUserType } from "../../store/actions";
import {
  NAVIGATE_TO_LOGINPAGE,
  NAVIGATE_TO_DASHBOARD,
  NAVIGATE_TO_SUPPORTPAGE,
  NAVIGATE_TO_STAFFPAGE,
  NAVIGATE_TO_AGENTSPAGE,
  NAVIGATE_TO_TRANSACTIONPAGE,
  NAVIGATE_TO_ACCOUNTSPAGE,
  NAVIGATE_TO_APIACCESSPAGE,
  NAVIGATE_TO_APIUSAGEPAGE,
  NAVIGATE_TO_LOGSPAGE,
  NAVIGATE_TO_INFOPAGE,
} from "../../route/types";
import { connect, useDispatch } from "react-redux";
import {
  ambassadorLoanListRequest,
  pendingLoanRequest,
  payPlanListrequest
} from "../../store/actions";
import { DashboardOutlined, FolderOutlined, GroupAddOutlined, InfoOutlined, KeyboardArrowDown, LinkOutlined, ManageAccountsOutlined, Person2Rounded, PersonAddAlt1Outlined, PersonOutlined, ReceiptLong, RoofingOutlined, SpeedOutlined, SupportAgentOutlined, SupportOutlined } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { ListDivider } from "@mui/joy";

function Toggler({
  defaultExpanded = false,
  renderToggle,
  route,
  children,
}: {
  defaultExpanded?: boolean;
  children: React.ReactNode;
  route: boolean;
  renderToggle: (params: {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  }) => React.ReactNode;
}) {
  const [open, setOpen] = React.useState(defaultExpanded);

  React.useEffect(() => {
    // Set the initial state based on the condition
    setOpen(defaultExpanded || route);
  }, [defaultExpanded, route]);

  return (
    <React.Fragment>
      {renderToggle({ open, setOpen })}
      <Box
        sx={{
          display: "grid",
          gridTemplateRows: open ? "1fr" : "0fr",
          transition: "0.2s ease",
          "& > *": {
            overflow: "hidden",
          },
        }}>
        {open && children}
      </Box>
    </React.Fragment>
  );
}


const ListItemComponent = ({ route, action, props, path }) => {
  const location = useLocation();
  const navigate = useNavigate()

  const navTo = () => {
    navigate(route)
    action()
  }
  return (
    <ListItemButton
      role="menuitem"
      disabled={path ? true : false}
      sx={{
        backgroundColor: path ? "background.appcolor" : "transparent",
        boxShadow: path ? 'sm' : "none",
        alignItems: 'center',
      }}
      onClick={navTo}>
      <Box
        width={30}
        height={30}
        sx={styles.icon}>
        {props.icon}
      </Box>

      <ListItemContent>
        <Typography
          level="title-sm"
          sx={{
            color: path ? "black" : '#FFFFFF99',
            '--List-gap': '0px'
          }}>
          {props.title}
        </Typography>
      </ListItemContent>
    </ListItemButton>
  );
};

const DropdowmList = ({ children, props, path }) => {
  const location = useLocation();
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <ListItem nested sx={{ backgroundColor: isOpen && '#FFFFFF10' }}>
      <Toggler
        route={path}
        renderToggle={({ open, setOpen }) => (
          <ListItemButton
            onClick={() => (setOpen(!open), setIsOpen(!open))}
            sx={{
              height: 30,
              backgroundColor: path ? "#FFFFFF30" : "transparent",
            }}>
            <Box
              width={30}
              height={30}
              sx={styles.icon}>
              {props.icon}
            </Box>
            <ListItemContent>
              <Typography level="title-sm" sx={{ color: path ? 'white' : '#FFFFFF95' }}>{props.title}</Typography>
            </ListItemContent>
            <KeyboardArrowDownIcon
              sx={{ transform: open ? "rotate(180deg)" : "none" }}
            />
          </ListItemButton>
        )
        }>
        <List sx={{ gap: 0.5, }}>{children}</List>
      </Toggler >
    </ListItem >

  );
};

const Sidebar = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const logOut = () => {
    navigate(NAVIGATE_TO_LOGINPAGE)
    // dispatch(userLogoutRequest());
    // dispatch(resetUserType());
  }

  //MAIN
  return (
    <Sheet
      className="Sidebar"
      sx={styles.container}>
      <GlobalStyles
        styles={(theme) => ({
          ":root": {
            "--Sidebar-width": "220px",
            [theme.breakpoints.up("lg")]: {
              "--Sidebar-width": "240px",
            },
          },
        })}
      />
      <Box
        className="Sidebar-overlay"
        sx={styles.subcontainer}
        onClick={() => closeSidebar()}
      />

      {/* Logo and App Name */}
      <Link to={NAVIGATE_TO_DASHBOARD} style={{ textDecoration: 'none' }}>
        <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
          <IconButton
            variant="soft"
            sx={{ backgroundColor: "transparent" }}
            size="sm">
            <Avatar
              src={image.Images.icon}
              sx={styles.logo}
            />
          </IconButton>
          <Typography level="title-sm" sx={styles.appname}>{t("intro.appName")}</Typography>
        </Box>
      </Link>

      <ListDivider />

      <Box
        sx={{
          overflow: "hidden auto",
          flexGrow: 1,
          pl: '10px',
          [`& .${listItemButtonClasses.root}`]: {
            gap: 1.5,
          },
        }}>
        <List
          size="sm"
          sx={styles.list}
        >

          {/* home */}
          <ListItemComponent
            route={NAVIGATE_TO_DASHBOARD}
            path={location.pathname === NAVIGATE_TO_DASHBOARD}
            action={() => null}
            props={{
              title: 'Dashboard',
              icon: <SpeedOutlined />
            }}
          />

          <DropdowmList
            path={location.pathname === NAVIGATE_TO_STAFFPAGE || location.pathname === NAVIGATE_TO_AGENTSPAGE}
            props={{
              title: 'Intergration',
              icon: <LinkOutlined />,

            }}>

            {/* Staff */}
            <ListItemComponent
              route={NAVIGATE_TO_STAFFPAGE}
              path={location.pathname === NAVIGATE_TO_STAFFPAGE}
              action={() => null}
              props={{
                title: 'Manage Staffs',
                icon: <ManageAccountsOutlined />
              }}
            />

            {/* Agents */}
            <ListItemComponent
              route={NAVIGATE_TO_AGENTSPAGE}
              path={location.pathname === NAVIGATE_TO_AGENTSPAGE}
              action={() => null}
              props={{
                title: "Manage Agents",
                icon: <ManageAccountsOutlined />
              }}
            />

          </DropdowmList>

          {/* Transactions */}
          <ListItemComponent
            route={NAVIGATE_TO_TRANSACTIONPAGE}
            path={location.pathname === NAVIGATE_TO_TRANSACTIONPAGE}
            action={() => null}
            props={{
              title: "Transactions",
              icon: <CurrentExchangeRoundIcon />
            }}
          />

          {/* Accounts */}
          <ListItemComponent
            route={NAVIGATE_TO_ACCOUNTSPAGE}
            path={location.pathname === NAVIGATE_TO_ACCOUNTSPAGE}
            action={() => null}
            props={{
              title: 'Accounts',
              icon: <FolderOutlined />
            }}
          />


          <Divider sx={{ my: "10px" }} />

          <ListItemComponent
            path={null}
            route="#"
            action={logOut}
            props={{
              title: 'Log out',
              icon: <LogoutRoundedIcon />
            }}
          />
        </List>
      </Box>
    </Sheet >
  );
};

// Stylish
const styles = {
  container: {
    position: { xs: "fixed", md: "fixed" },
    // backgroundColor: '#fff5c5',
    background: 'linear-gradient(180deg, rgba(0,0,0,1) 0%, rgba(27,25,25,1) 70%, rgba(56,48,48,1) 100%)',
    transform: {
      xs: "translateX(calc(100% * (var(--SideNavigation-slideIn, 0) - 1)))",
      md: "translateX(calc(100% * (var(--SideNavigation-slideIn, 0) - 1)))",
    },
    transition: "transform 0.4s ease, width 0.4s",
    zIndex: 10000,
    // height: "100dvh",
    minHeight: '100dvh',
    width: "var(--Sidebar-width)",
    top: 0,
    p: 2,
    flexShrink: 0,
    display: "flex",
    flexDirection: "column",
    gap: 2,
    borderRight: "1px solid",
    borderColor: "divider",
  },
  subcontainer: {
    position: "fixed",
    zIndex: 9998,
    top: 0,
    left: 0,
    width: "100vw",
    // height: "100vh",
    minHeight: '100vh',
    opacity: "var(--SideNavigation-slideIn)",
    backgroundColor: "var(--joy-palette-background-backdrop)",
    transition: "opacity 0.4s",
    transform: {
      xs: "translateX(calc(100% * (var(--SideNavigation-slideIn, 0) - 1) + var(--SideNavigation-slideIn, 0) * var(--Sidebar-width, 0px)))",
      lg: "translateX(-100%)",
    },
  },
  list: (theme) => ({
    gap: 1,
    "--List-nestedInsetStart": "30px",
    "--ListItem-radius": (theme) => theme.vars.radius.sm,
    // Gatsby colors
    '--joy-palette-primary-plainColor': '#8a4baf',
    '--joy-palette-neutral-plainHoverBg': "#FFFFFF10",
    '--joy-palette-neutral-plainActiveBg': 'transparent',
    '--joy-palette-primary-plainHoverBg': 'gray',
    '--joy-palette-primary-plainActiveBg': 'transparent',
    [theme.getColorSchemeSelector('dark')]: {
      '--joy-palette-text-secondary': '#635e69',
      '--joy-palette-primary-plainColor': '#d48cff',
    },
  }),
  appname: {
    color: 'white',
    fontFamily: 'roboto'
  },
  logo: {
    maxWidth: "40px",
    maxHeight: "40px",
    backgroundColor: "transparent",
  },
  icon: {
    display: 'flex',
    // p: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 2,
    color: 'black',
    fontWeight: 'bold'
  }
}

//mapping Redux store states to props
const mapStateToProps = ({ authAmb, resource }) => {
  const { otpResult: loginResults } = authAmb;

  //extracting properties from the resource object in the Redux store's state
  const {
    ambassadorLoanResult: ambassadorLoanResult,
    ambassadorLoanStatus: ambassadorLoanStatus,
    ambassadorLoanErrorMessage: ambassadorLoanErrorMessage,
  } = resource;

  return {
    loginResults,
    ambassadorLoanResult,
    ambassadorLoanStatus,
    ambassadorLoanErrorMessage,
  };
};

//connecting Redux store to sidebar component
// export default connect(mapStateToProps, {})(Sidebar);
export default Sidebar
