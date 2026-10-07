import "./App.css";
// import PublicRoute from './route/Mainroute'
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AnimatePresence } from "framer-motion";

import React, { useEffect, useState } from "react";
import { useDispatch, connect } from "react-redux";

import { toast } from 'react-toastify';
import { STATUS } from './constant';
import { requestForToken } from './firebase/firebase'


//import MainRoute from './route/Mainroute';
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

import RoutesContainer from "./route/Routes";
import { AppInit } from "./components";
import { doLogout } from "./service/auth";
import { logoutRequest, tokenRequest, tokenReset, schoolListRequest } from "./store/actions";
import { initializeSidebar, getRefreshToken } from "./utils";

// FUNCTION TO CHECK TOKEN
const parseJwt = (token) => {
  try {
    let jwtFirstPart = token.split(".")[1];
    // console.log(JSON.parse(atob(jwtFirstPart)));
    return JSON.parse(atob(jwtFirstPart));
  } catch (error) {
    console.log(error);
    return null;
  }
};

// MAIN TO RENDER ROUTES AND PAGES
const App = ({
  loginStatus,
  loginResult,

  accessToken,

  tokenStatus,
}) => {
  const dispatch = useDispatch()

  // FE-03: the access token is no longer persisted, so a reload starts logged
  // out as far as redux is concerned. If a refresh token is still in
  // sessionStorage, exchange it for a new access token BEFORE the protected
  // routes are allowed to render, otherwise every reload would redirect to
  // /login. `bootPending` keeps the loading screen up while that happens.
  const [bootPending, setBootPending] = useState(
    () => getRefreshToken() !== null
  );

  useEffect(() => {
    initializeSidebar();
  }, []);

  useEffect(() => {
    const refresh = getRefreshToken();
    if (refresh) {
      dispatch(tokenRequest({ refresh }));
    } else {
      setBootPending(false);
    }
  }, [dispatch]);

  useEffect(() => {
    if (!bootPending) return;
    if (tokenStatus === STATUS.SUCCESS || tokenStatus === STATUS.ERROR) {
      setBootPending(false);
    }
  }, [bootPending, tokenStatus]);

  // get fcm token for firebase
  useEffect(() => {
    requestForToken();
  },[])

  // check the token validity on every 30 sec
  /* eslint-disable */
  useEffect(() => {
    if (loginStatus === STATUS.SUCCESS) {
      const checkToken = () => checkTokenValidity(parseJwt(accessToken));

      checkToken(); // Initial check
      const interval = setInterval(checkToken, 30000); // Check every 30 seconds
  
      return () => clearInterval(interval); // Cleanup on unmount
    }
  }, [loginStatus, accessToken]);

  // FE-08: /resources/school-list is admin-only (BE-03). It used to be fetched on
  // every login for every role, so a parent, staff member or operator always got
  // a 403 toast for a list only the admin pages read. It now runs for admins
  // only, which is every page that consumes schoolListResult.
  useEffect(() => {
    if (loginStatus !== STATUS.SUCCESS) return;
    const user = loginResult?.user;
    if (user?.role !== 'admin') return;
    dispatch(schoolListRequest(accessToken, { "search": "" }, 1));
  }, [loginStatus, loginResult, accessToken, dispatch]);

  useEffect(() => {
    if (tokenStatus === STATUS.ERROR) {
      toast.warn("User access timeout please login");
      doLogout({ "refresh": getRefreshToken() });
      dispatch(tokenReset());
      dispatch(logoutRequest());
    }
  }, [tokenStatus])
  /* eslint-enable */

  const checkTokenValidity = (decodedJwt) => {
    if (!decodedJwt) {
      toast.warn("Not enabled User");
      dispatch(logoutRequest());
      return;
    }

    if (decodedJwt.exp * 1000 < Date.now()) {
      const refresh = getRefreshToken();
      if (!refresh) {
        dispatch(logoutRequest());
        return;
      }
      dispatch(tokenRequest({ refresh }))
    }
    return;
  };

  if (bootPending) {
    return <AppInit />;
  }

  return (
    <>
      <AnimatePresence mode="wait">
        <RoutesContainer
          loginStatus={loginStatus}
          userRole={loginStatus === STATUS.SUCCESS ? loginResult.user.role : ""}
          isSuperuser={loginStatus === STATUS.SUCCESS ? !!loginResult.user.is_superuser : false}
        />
      </AnimatePresence>
      <ToastContainer
        autoClose={3000}
        draggable={false}
        position="top-right"
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnHover
      />
    </>
  );
};

const mapStateToProps = ({ auth }) => {
  const {
    loginStatus,
    loginResult,
    loginErrorMessage,
    accessToken,

    tokenStatus,
    tokenResult,
    tokenErrorMessage
  } = auth;


  return {
    loginStatus,
    loginResult,
    loginErrorMessage,
    accessToken,

    tokenStatus,
    tokenResult,
    tokenErrorMessage
  };
};
export default connect(mapStateToProps, {})(App);

// export default App;
