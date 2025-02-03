import "./App.css";
// import PublicRoute from './route/Mainroute'
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AnimatePresence } from "framer-motion";

import React, { useEffect } from "react";
import { useDispatch, connect } from "react-redux";

import {
  userLogoutRequest,
  fetchAmbassadorProfile,
  setUserType,
  transactionListRequest} from "./store/actions"
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

// MAIN TO RENDER ROUTES AND PAGES
const App = ({
  // ambLoginStatus,
  // ambLoginResult,
  // ambLoginErrorMessage,

  // userType,
}) => {
  const dispatch = useDispatch();



  return (
    <>
      <AnimatePresence mode="wait">
        <RoutesContainer loginStatus={true}/>
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

const mapStateToProps = ({ authAmb, user }) => {
  const {
    otpStatus: ambLoginStatus,
    otpResult: ambLoginResult,
    otpErrorMessage: ambLoginErrorMessage,
  } = authAmb;

  const { userTypes: userType } = user;

  return {
    ambLoginStatus,
    ambLoginResult,
    ambLoginErrorMessage,

    userType,
  };
};
// export default connect(mapStateToProps, {})(App);

export default App;
