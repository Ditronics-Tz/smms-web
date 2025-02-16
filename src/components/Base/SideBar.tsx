import * as React from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import GlobalStyles from "@mui/joy/GlobalStyles";
import Avatar from "@mui/joy/Avatar";
import Box from "@mui/joy/Box";
import Divider from "@mui/joy/Divider";
import IconButton from "@mui/joy/IconButton";
import List from "@mui/joy/List";
import ListItem from "@mui/joy/ListItem";
import ListItemButton, { listItemButtonClasses } from "@mui/joy/ListItemButton";
import ListItemContent from "@mui/joy/ListItemContent";
import Typography from "@mui/joy/Typography";
import Sheet from "@mui/joy/Sheet";

import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import CurrentExchangeRoundIcon from "@mui/icons-material/CurrencyExchangeOutlined";

// import ColorSchemeToggle from '../../utils/ColorSchemeToggle';
import { closeSidebar } from "../../utils";
import image from "../../constant/image";
import { logoutRequest } from "../../store/actions";
import {
  NAVIGATE_TO_ADMINDETAILSPAGE,
  NAVIGATE_TO_ADMINPAGE,
  NAVIGATE_TO_CANTEENITEMPAGE,
  NAVIGATE_TO_CARDDETAILSPAGE,
  NAVIGATE_TO_CARDPAGE,
  NAVIGATE_TO_DASHBOARD,
  NAVIGATE_TO_NOTIFICATIONPAGE,
  NAVIGATE_TO_OPERATORDETAILSPAGE,
  NAVIGATE_TO_OPERATORPAGE,
  NAVIGATE_TO_PARENTDETAILSPAGE,
  NAVIGATE_TO_PARENTPAGE,
  NAVIGATE_TO_SCHOOLPAGE,
  NAVIGATE_TO_SESSIONPAGE,
  NAVIGATE_TO_STUDENTDETAILSPAGE,
  NAVIGATE_TO_STUDENTPAGE,
  NAVIGATE_TO_TRANSACTIONPAGE,
} from "../../route/types";
import { connect, useDispatch } from "react-redux";

import { BadgeOutlined, EditNotificationsOutlined, Face6Outlined, FolderOutlined, GroupsOutlined, ManageAccountsOutlined, MoveToInboxOutlined, Person2Outlined, RestaurantOutlined, ScheduleOutlined, SchoolOutlined, SpeedOutlined, SupervisorAccountOutlined } from "@mui/icons-material";
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
        width={20}
        height={27}
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
              width={20}
              height={27}
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

const Sidebar = ({
  loginResult
}) => {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const logOut = () => {
    dispatch(logoutRequest());
  }

  const [userRole, setUserRoles] = React.useState("")
  const [isAdmin, setIsAdmin] = React.useState(false)

  React.useEffect(() => {
    if (loginResult != null && loginResult != undefined) {
      setUserRoles(loginResult.user.role)
      setIsAdmin(loginResult.user.is_superuser)
    }
  }, [loginResult])

  //MAIN
  return (
    <Sheet
      className="Sidebar"
      sx={styles.container}>
      <GlobalStyles
        styles={(theme) => ({
          ":root": {
            "--Sidebar-width": "240px",
            [theme.breakpoints.up("lg")]: {
              "--Sidebar-width": "260px",
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
              title: t('sidebar.dashboard'),
              icon: <SpeedOutlined />
            }}
          />

          {/* ---- Manage User ----- */}
          {userRole === 'admin' &&
            <DropdowmList
              path={
                location.pathname === NAVIGATE_TO_STUDENTPAGE ||
                location.pathname === NAVIGATE_TO_STUDENTDETAILSPAGE ||
                location.pathname === NAVIGATE_TO_ADMINPAGE ||
                location.pathname === NAVIGATE_TO_ADMINDETAILSPAGE ||
                location.pathname === NAVIGATE_TO_OPERATORPAGE ||
                location.pathname === NAVIGATE_TO_OPERATORDETAILSPAGE ||
                location.pathname === NAVIGATE_TO_PARENTDETAILSPAGE ||
                location.pathname === NAVIGATE_TO_PARENTPAGE
              }
              props={{
                title: t("sidebar.manageUser"),
                icon: <GroupsOutlined />,

              }}>

              {/* Admins */}
              {isAdmin && <ListItemComponent
                route={NAVIGATE_TO_ADMINPAGE}
                path={location.pathname === NAVIGATE_TO_ADMINPAGE || location.pathname === NAVIGATE_TO_ADMINDETAILSPAGE}
                action={() => null}
                props={{
                  title: t("sidebar.manageAdmins"),
                  icon: <ManageAccountsOutlined />
                }}
              />}

              {/* Students */}
              <ListItemComponent
                route={NAVIGATE_TO_STUDENTPAGE}
                path={location.pathname === NAVIGATE_TO_STUDENTPAGE || location.pathname === NAVIGATE_TO_STUDENTDETAILSPAGE}
                action={() => null}
                props={{
                  title: t("sidebar.manageStudents"),
                  icon: <Face6Outlined />
                }}
              />

              {/* Parents */}
              <ListItemComponent
                route={NAVIGATE_TO_PARENTPAGE}
                path={location.pathname === NAVIGATE_TO_PARENTPAGE || location.pathname === NAVIGATE_TO_PARENTDETAILSPAGE}
                action={() => null}
                props={{
                  title: t("sidebar.manageParents"),
                  icon: <SupervisorAccountOutlined />
                }}
              />

              {/* Operators */}
              <ListItemComponent
                route={NAVIGATE_TO_OPERATORPAGE}
                path={location.pathname === NAVIGATE_TO_OPERATORPAGE || location.pathname === NAVIGATE_TO_OPERATORDETAILSPAGE}
                action={() => null}
                props={{
                  title: t("sidebar.manageOperators"),
                  icon: <Person2Outlined />
                }}
              />

            </DropdowmList>}

          {/* ------ Manage Resources ------- */}
          {userRole == 'admin' &&
            <DropdowmList
              path={
                location.pathname === NAVIGATE_TO_SCHOOLPAGE ||
                location.pathname === NAVIGATE_TO_CANTEENITEMPAGE ||
                location.pathname === NAVIGATE_TO_CARDPAGE ||
                location.pathname === NAVIGATE_TO_CARDDETAILSPAGE
              }
              props={{
                title: t("sidebar.manageResources"),
                icon: <FolderOutlined />,

              }}>

              {/* School*/}
              {isAdmin && <ListItemComponent
                route={NAVIGATE_TO_SCHOOLPAGE}
                path={location.pathname === NAVIGATE_TO_SCHOOLPAGE}
                action={() => null}
                props={{
                  title: t("sidebar.manageSchool"),
                  icon: <SchoolOutlined />
                }}
              />}

              {/* cards */}
              {isAdmin && <ListItemComponent
                route={NAVIGATE_TO_CARDPAGE}
                path={location.pathname === NAVIGATE_TO_CARDPAGE ||
                  location.pathname === NAVIGATE_TO_CARDDETAILSPAGE}
                action={() => null}
                props={{
                  title: t("sidebar.manageCards"),
                  icon: <BadgeOutlined />
                }}
              />}

              {/* items */}
              <ListItemComponent
                route={NAVIGATE_TO_CANTEENITEMPAGE}
                path={location.pathname === NAVIGATE_TO_CANTEENITEMPAGE}
                action={() => null}
                props={{
                  title: t("sidebar.manageItems"),
                  icon: <RestaurantOutlined />
                }}
              />
            </DropdowmList>}

          {/* Transactions */}
          {(userRole == 'admin' || userRole == 'parent') &&
            <ListItemComponent
              route={NAVIGATE_TO_TRANSACTIONPAGE}
              path={location.pathname === NAVIGATE_TO_TRANSACTIONPAGE}
              action={() => null}
              props={{
                title: t("sidebar.transaction"),
                icon: <CurrentExchangeRoundIcon />
              }}
            />}

          {/* Sessions */}
          {userRole == 'operator' &&
            <ListItemComponent
              route={NAVIGATE_TO_SESSIONPAGE}
              path={location.pathname === NAVIGATE_TO_SESSIONPAGE}
              action={() => null}
              props={{
                title: t("sidebar.session"),
                icon: <ScheduleOutlined />
              }}
            />}

          {/* Bank deposit */}
          {userRole == 'admin' && <ListItemComponent
            route={'#'}
            path={null}
            action={() => null}
            props={{
              title: t("sidebar.bankDeposit"),
              icon: <MoveToInboxOutlined />
            }}
          />}

          {/* Notifications */}
          {isAdmin && <ListItemComponent
            route={NAVIGATE_TO_NOTIFICATIONPAGE}
            path={location.pathname === NAVIGATE_TO_NOTIFICATIONPAGE}
            action={() => null}
            props={{
              title: t("sidebar.notifications"),
              icon: <EditNotificationsOutlined />
            }}
          />}

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

const mapStateToProps = ({ auth }) => {
  const { loginResult } = auth

  return {
    loginResult
  }
}

export default connect(mapStateToProps, {})(Sidebar);
