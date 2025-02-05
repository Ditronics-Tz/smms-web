import "./App.css";
// import PublicRoute from './route/Mainroute'
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AnimatePresence } from "framer-motion";

import React, { useEffect } from "react";
import { useDispatch, connect } from "react-redux";

import { toast } from 'react-toastify';
import { STATUS } from './constant';



import {
  NAVIGATE_TO_LOGINPAGE,
} from "./route/types";

//import MainRoute from './route/Mainroute';
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

import RoutesContainer from "./route/Routes";
import { doLogout } from "./service/auth";
import { logoutRequest, tokenRequest, tokenReset } from "./store/actions";

// FUNCTION TO CHECK TOKEN
const parseJwt = (token) => {
  try {
    let jwtFirstPart = token.split(".")[1];
    console.log(JSON.parse(atob(jwtFirstPart)));
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
  loginErrorMessage,
  accessToken,

  tokenStatus,
  tokenResult,
  tokenErrorMessage
}) => {
  const dispatch = useDispatch()

  useEffect(() => {
    if (loginStatus === STATUS.SUCCESS) {
      checkTokenValidity(parseJwt(accessToken));
    }
  }, [])



  useEffect(() => {
    if (tokenStatus === STATUS.ERROR) {
      toast.warn("User access timeout please login");
      doLogout({ "refresh": loginResult.refresh });
      dispatch(tokenReset());
      dispatch(logoutRequest());
    }
  }, [tokenStatus])

  const checkTokenValidity = (decodedJwt) => {
    if (!decodedJwt) {
      toast.warn("Not enabled User");
      dispatch(logoutRequest());
      return;
    }

    if (decodedJwt.exp * 1000 < Date.now()) {
      const data = {
        "refresh": loginResult.refresh
      }
      dispatch(tokenRequest(data))
    }
    return;
  };

  return (
    <>
      <AnimatePresence mode="wait">
        <RoutesContainer loginStatus={loginStatus} userRole={loginStatus === STATUS.SUCCESS ? loginResult.user.role : ""}/>
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
