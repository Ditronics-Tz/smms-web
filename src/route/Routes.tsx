import React, { useEffect } from "react";
import { Navigate, Outlet, Route, Routes, useLocation } from "react-router-dom";

import { LoginPage } from "../page/Login";

import {
  ERROR_404_PAGE,
  NAVIGATE_TO_ACCOUNTSPAGE,
  NAVIGATE_TO_AGENTSPAGE,
  NAVIGATE_TO_APIACCESSPAGE,
  NAVIGATE_TO_APIUSAGEPAGE,
  NAVIGATE_TO_DASHBOARD,
  NAVIGATE_TO_INFOPAGE,
  NAVIGATE_TO_LOGINPAGE,
  NAVIGATE_TO_LOGSPAGE,
  NAVIGATE_TO_PROFILEPAGE,
  NAVIGATE_TO_STUDENTDETAILSPAGE,
  NAVIGATE_TO_STUDENTPAGE,
  NAVIGATE_TO_SUPPORTPAGE,
  NAVIGATE_TO_TRANSACTIONPAGE,
} from "./types";
import { STATUS } from "../constant";
import Error404Page from "../page/ErrorsPages/404Error";
import { Main } from "../components";
import { AccountsPage, AgentPage, ApiAccessPage, ApiUsagePage, Dashboard, InfoPage, LogsPage, ProfilePage, StudentDetailsPage, StudentPage, SupportPage, TransactionPage } from "../page";

// FUNCTION TO DIRECT ONLY AUTH USER TO THEIR PAGES
const ProtectRoute = ({ status }) => {
  return status == STATUS.SUCCESS ? (
    <Outlet />
  ) : (
    <Navigate to={NAVIGATE_TO_LOGINPAGE} />
  );
};

// Role-based protection for specific routes
const RoleProtectedRoute = ({ userRole, allowedRoles, children }) => {
  return allowedRoles.includes(userRole) ? children : <Navigate to={NAVIGATE_TO_DASHBOARD} />;
};

// MAIN FUNC TO RENDER ROUTES AND PAGES
const RoutesContainer = ({ loginStatus, userRole }) => {
  const location = useLocation();

  return (
    <Routes key={location.pathname} location={location}>

      <Route path={NAVIGATE_TO_LOGINPAGE} element={<LoginPage />} />

      <Route path="/" element={<ProtectRoute status={loginStatus} />}>
        <Route path='/' element={<Main />}>
          <Route index element={<Dashboard />} />
          <Route path={NAVIGATE_TO_PROFILEPAGE} element={<ProfilePage />} />

          <Route
            path={NAVIGATE_TO_STUDENTPAGE}
            element={
              <RoleProtectedRoute userRole={userRole} allowedRoles={['admin']}>
                <StudentPage />
              </RoleProtectedRoute>
            } />

          <Route
            path={NAVIGATE_TO_STUDENTDETAILSPAGE}
            element={
              <RoleProtectedRoute userRole={userRole} allowedRoles={['admin']}>
                <StudentDetailsPage />
              </RoleProtectedRoute>
            } />
          <Route path={NAVIGATE_TO_AGENTSPAGE} element={<AgentPage />} />
          <Route path={NAVIGATE_TO_TRANSACTIONPAGE} element={<TransactionPage />} />
          <Route path={NAVIGATE_TO_ACCOUNTSPAGE} element={<AccountsPage />} />

          <Route path={NAVIGATE_TO_APIACCESSPAGE} element={<ApiAccessPage />} />
          <Route path={NAVIGATE_TO_APIUSAGEPAGE} element={<ApiUsagePage />} />
          <Route path={NAVIGATE_TO_LOGSPAGE} element={<LogsPage />} />

          <Route path={NAVIGATE_TO_SUPPORTPAGE} element={<SupportPage />} />
          <Route path={NAVIGATE_TO_INFOPAGE} element={<InfoPage />} />
        </Route>
      </Route>

      <Route path={ERROR_404_PAGE} element={<Error404Page />} />
    </Routes>
  );
};

export default RoutesContainer;
