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
  NAVIGATE_TO_BANKDEPOSITPAGE,
  NAVIGATE_TO_CANTEENITEMPAGE,
  NAVIGATE_TO_CARDPAGE,
  NAVIGATE_TO_DASHBOARD,
  NAVIGATE_TO_LEDGERPAGE,
  NAVIGATE_TO_NOTIFICATIONPAGE,
  NAVIGATE_TO_OPERATORDETAILSPAGE,
  NAVIGATE_TO_OPERATORPAGE,
  NAVIGATE_TO_PARENTDETAILSPAGE,
  NAVIGATE_TO_PARENTPAGE,
  NAVIGATE_TO_SCHOOLPAGE,
  NAVIGATE_TO_SETTINGSPAGE,
  NAVIGATE_TO_SESSIONPAGE,
  NAVIGATE_TO_SPENDPAGE,
  NAVIGATE_TO_STATEMENTPAGE,
  NAVIGATE_TO_TOPUPPAGE,
  NAVIGATE_TO_STAFFDETAILSPAGE,
  NAVIGATE_TO_STAFFPAGE,
  NAVIGATE_TO_STUDENTDETAILSPAGE,
  NAVIGATE_TO_STUDENTIMPORTPAGE,
  NAVIGATE_TO_STUDENTPAGE,
  NAVIGATE_TO_TRANSACTIONPAGE,
} from "../../route/types";
import { connect, useDispatch } from "react-redux";

import { BadgeOutlined, AccountBalanceOutlined, EditNotificationsOutlined, Face6Outlined, FolderOutlined, GroupsOutlined, ManageAccountsOutlined, Person2Outlined, RestaurantOutlined, ScheduleOutlined, SchoolOutlined, SettingsOutlined, SpeedOutlined, SupervisorAccountOutlined, BarChartOutlined, PaidOutlined, ReceiptLongOutlined, MenuBookOutlined } from "@mui/icons-material";
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
  const navigate = useNavigate()

  const navTo = () => {
    // Items that only run an action (logout) pass route="#" or null; navigating
    // to those pushed a bogus "#" into the URL and made the row look like a
    // link, so only real routes are pushed.
    if (route && route !== '#') {
      navigate(route)
    }
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
            // Was `path ? "black" : '#FFFFFF99'` - invisible in dark mode when
            // active (black on a dark surface) and near-invisible in light mode
            // when inactive (translucent white on a white sheet).
            color: path ? 'var(--joy-palette-primary-plainColor)' : 'var(--joy-palette-text-secondary)',
            '--List-gap': '0px'
          }}>
          {props.title}
        </Typography>
      </ListItemContent>
    </ListItemButton>
  );
};

const DropdowmList = ({ children, props, path }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <ListItem nested sx={{ backgroundColor: isOpen ? 'var(--joy-palette-neutral-plainHoverBg)' : 'transparent' }}>
      <Toggler
        route={path}
        renderToggle={({ open, setOpen }) => (
          <ListItemButton // eslint-disable-next-line
            onClick={() => (setOpen(!open), setIsOpen(!open))} 
            sx={{
              height: 30,
              backgroundColor: path ? 'var(--joy-palette-neutral-plainActiveBg)' : "transparent",
            }}>
            <Box
              width={20}
              height={27}
              sx={styles.icon}>
              {props.icon}
            </Box>
            <ListItemContent>
              <Typography level="title-sm" sx={{ color: path ? 'var(--joy-palette-primary-plainColor)' : 'var(--joy-palette-text-secondary)' }}>{props.title}</Typography>
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
  const { t } = useTranslation();

  const logOut = () => {
    dispatch(logoutRequest());
  }

  const [userRole, setUserRoles] = React.useState("")
  const [isAdmin, setIsAdmin] = React.useState(false)

  React.useEffect(() => {
    if (loginResult !== null && loginResult !== undefined) {
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
                location.pathname === NAVIGATE_TO_STUDENTIMPORTPAGE ||
                location.pathname === NAVIGATE_TO_ADMINPAGE ||
                location.pathname === NAVIGATE_TO_ADMINDETAILSPAGE ||
                location.pathname === NAVIGATE_TO_OPERATORPAGE ||
                location.pathname === NAVIGATE_TO_OPERATORDETAILSPAGE ||
                location.pathname === NAVIGATE_TO_PARENTDETAILSPAGE ||
                location.pathname === NAVIGATE_TO_PARENTPAGE ||
                location.pathname === NAVIGATE_TO_STAFFPAGE ||
                location.pathname ===  NAVIGATE_TO_STAFFDETAILSPAGE
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

              {/* Import students */}
              {isAdmin && <ListItemComponent
                route={NAVIGATE_TO_STUDENTIMPORTPAGE}
                path={location.pathname === NAVIGATE_TO_STUDENTIMPORTPAGE}
                action={() => null}
                props={{
                  title: t("sidebar.importStudents"),
                  icon: <FolderOutlined />
                }}
              />}

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

              {/* Staffs */}
              <ListItemComponent
                route={NAVIGATE_TO_STAFFPAGE}
                path={location.pathname === NAVIGATE_TO_STAFFPAGE || location.pathname === NAVIGATE_TO_STAFFDETAILSPAGE}
                action={() => null}
                props={{
                  title: t("sidebar.manageStaffs"),
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
          {userRole === 'admin' &&
            <DropdowmList
              path={
                location.pathname === NAVIGATE_TO_SCHOOLPAGE ||
                location.pathname === NAVIGATE_TO_CANTEENITEMPAGE ||
                location.pathname === NAVIGATE_TO_CARDPAGE
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
                path={location.pathname === NAVIGATE_TO_CARDPAGE}
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
          {(userRole === 'admin' || userRole === 'parent' || userRole === 'staff') &&
            <ListItemComponent
              route={NAVIGATE_TO_TRANSACTIONPAGE}
              path={location.pathname === NAVIGATE_TO_TRANSACTIONPAGE}
              action={() => null}
              props={{
                title: t("sidebar.transaction"),
                icon: <CurrentExchangeRoundIcon />
              }}
            />}

          {/* Bank Deposit / finance */}
          {userRole === 'admin' &&
            <ListItemComponent
              route={NAVIGATE_TO_BANKDEPOSITPAGE}
              path={location.pathname === NAVIGATE_TO_BANKDEPOSITPAGE}
              action={() => null}
              props={{
                title: t("bankDeposit.navTitle"),
                icon: <AccountBalanceOutlined />
              }}
            />}

          {/* Spending */}
          {userRole === 'parent' &&
            <ListItemComponent
              route={NAVIGATE_TO_SPENDPAGE}
              path={location.pathname === NAVIGATE_TO_SPENDPAGE}
              action={() => null}
              props={{
                title: t("sidebar.spending"),
                icon: <BarChartOutlined />
              }}
            />}

          {/* Top up */}
          {userRole === 'parent' &&
            <ListItemComponent
              route={NAVIGATE_TO_TOPUPPAGE}
              path={location.pathname === NAVIGATE_TO_TOPUPPAGE}
              action={() => null}
              props={{
                title: t("sidebar.topUp"),
                icon: <PaidOutlined />
              }}
            />}

          {/* Ledger journal (admin, read-only) */}
          {userRole === 'admin' &&
            <ListItemComponent
              route={NAVIGATE_TO_LEDGERPAGE}
              path={location.pathname === NAVIGATE_TO_LEDGERPAGE}
              action={() => null}
              props={{
                title: t("sidebar.ledger"),
                icon: <MenuBookOutlined />
              }}
            />}

          {/* Statement (FE-14, parent) */}
          {userRole === 'parent' &&
            <ListItemComponent
              route={NAVIGATE_TO_STATEMENTPAGE}
              path={location.pathname === NAVIGATE_TO_STATEMENTPAGE}
              action={() => null}
              props={{
                title: t("sidebar.statement"),
                icon: <ReceiptLongOutlined />
              }}
            />}

          {/* Sessions */}
          {userRole === 'operator' &&
            <ListItemComponent
              route={NAVIGATE_TO_SESSIONPAGE}
              path={location.pathname === NAVIGATE_TO_SESSIONPAGE}
              action={() => null}
              props={{
                title: t("sidebar.session"),
                icon: <ScheduleOutlined />
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

          {/* Settings - self service, every role */}
          <ListItemComponent
            route={NAVIGATE_TO_SETTINGSPAGE}
            path={location.pathname === NAVIGATE_TO_SETTINGSPAGE}
            action={() => null}
            props={{
              title: t("settings.title"),
              icon: <SettingsOutlined />
            }}
          />

          <Divider sx={{ my: "10px" }} />

          <ListItemComponent
            path={null}
            route="#"
            action={logOut}
            props={{
              title: t("header.logout"),
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
    // This block used to carry colours copied from the Joy "Gatsby" template:
    // a purple primary.plainColor (#8a4baf in light, #d48cff in dark) and a
    // dark grey text.secondary in dark mode. Both overrode the app theme - the
    // active nav row rendered purple instead of the brand orange, and the
    // secondary text sat at about 2.8:1 on the dark surface. Removed so the
    // sidebar uses theme.vars like the rest of the app.
  }),
  appname: {
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
    // Was a literal black, which made every nav icon invisible on the dark
    // surface. text.secondary follows the theme in both modes.
    color: 'var(--joy-palette-text-secondary)',
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
