import React from "react";
import { Navigate, Outlet, Route, Routes, useLocation } from "react-router-dom";

import { LoginPage } from "../page/Login";

import {
  ERROR_404_PAGE,
  NAVIGATE_TO_ADMINDETAILSPAGE,
  NAVIGATE_TO_ADMINPAGE,
  NAVIGATE_TO_CANTEENITEMPAGE,
  NAVIGATE_TO_CARDPAGE,
  NAVIGATE_TO_DASHBOARD,
  NAVIGATE_TO_INFOPAGE,
  NAVIGATE_TO_LOGINPAGE,
  NAVIGATE_TO_NOTIFICATIONPAGE,
  NAVIGATE_TO_OPERATORDETAILSPAGE,
  NAVIGATE_TO_OPERATORPAGE,
  NAVIGATE_TO_PARENTDETAILSPAGE,
  NAVIGATE_TO_PARENTPAGE,
  NAVIGATE_TO_PROFILEPAGE,
  NAVIGATE_TO_SCHOOLPAGE,
  NAVIGATE_TO_SESSIONPAGE,
  NAVIGATE_TO_STAFFDETAILSPAGE,
  NAVIGATE_TO_STAFFPAGE,
  NAVIGATE_TO_STUDENTDETAILSPAGE,
  NAVIGATE_TO_STUDENTPAGE,
  NAVIGATE_TO_SUPPORTPAGE,
  NAVIGATE_TO_TRANSACTIONPAGE,
} from "./types";
import { STATUS } from "../constant";
import Error404Page from "../page/ErrorsPages/404Error";
import { Main } from "../components";
import { AdminDetailsPage, AdminPage, CanteenItemPage, CardPage, Dashboard, InfoPage, OperatorDetailsPage, OperatorPage, ParentDetailsPage, ParentPage, ProfilePage, SchoolPage, StudentDetailsPage, StudentPage, SupportPage, TransactionPage, SessionPage, NotificationPage, StaffDetailsPage, StaffPage } from "../page";

// FUNCTION TO DIRECT ONLY AUTH USER TO THEIR PAGES
const ProtectRoute = ({ status }) => {
  return status === STATUS.SUCCESS ? (
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

          {/* student list */}
          <Route
            path={NAVIGATE_TO_STUDENTPAGE}
            element={
              <RoleProtectedRoute userRole={userRole} allowedRoles={['admin']}>
                <StudentPage />
              </RoleProtectedRoute>
            } />

          {/* student details */}
          <Route
            path={NAVIGATE_TO_STUDENTDETAILSPAGE}
            element={
              <RoleProtectedRoute userRole={userRole} allowedRoles={['admin']}>
                <StudentDetailsPage />
              </RoleProtectedRoute>
            } />

          {/* parent list */}
          <Route
            path={NAVIGATE_TO_PARENTPAGE}
            element={
              <RoleProtectedRoute userRole={userRole} allowedRoles={['admin']}>
                <ParentPage />
              </RoleProtectedRoute>
            } />

          {/* parent details */}
          <Route
            path={NAVIGATE_TO_PARENTDETAILSPAGE}
            element={
              <RoleProtectedRoute userRole={userRole} allowedRoles={['admin']}>
                <ParentDetailsPage />
              </RoleProtectedRoute>
            } />

          {/* staff list */}
          <Route
            path={NAVIGATE_TO_STAFFPAGE}
            element={
              <RoleProtectedRoute userRole={userRole} allowedRoles={['admin']}>
                <StaffPage />
              </RoleProtectedRoute>
            } />

          {/* staff details */}
          <Route
            path={NAVIGATE_TO_STAFFDETAILSPAGE}
            element={
              <RoleProtectedRoute userRole={userRole} allowedRoles={['admin']}>
                <StaffDetailsPage />
              </RoleProtectedRoute>
            } />

          {/* operator list */}
          <Route
            path={NAVIGATE_TO_OPERATORPAGE}
            element={
              <RoleProtectedRoute userRole={userRole} allowedRoles={['admin']}>
                <OperatorPage />
              </RoleProtectedRoute>
            } />

          {/* operator details */}
          <Route
            path={NAVIGATE_TO_OPERATORDETAILSPAGE}
            element={
              <RoleProtectedRoute userRole={userRole} allowedRoles={['admin']}>
                <OperatorDetailsPage />
              </RoleProtectedRoute>
            } />

          {/* admin list */}
          <Route
            path={NAVIGATE_TO_ADMINPAGE}
            element={
              <RoleProtectedRoute userRole={userRole} allowedRoles={['admin']}>
                <AdminPage />
              </RoleProtectedRoute>
            } />

          {/* admin details */}
          <Route
            path={NAVIGATE_TO_ADMINDETAILSPAGE}
            element={
              <RoleProtectedRoute userRole={userRole} allowedRoles={['admin']}>
                <AdminDetailsPage />
              </RoleProtectedRoute>
            } />

          {/* school page */}
          <Route
            path={NAVIGATE_TO_SCHOOLPAGE}
            element={
              <RoleProtectedRoute userRole={userRole} allowedRoles={['admin']}>
                <SchoolPage />
              </RoleProtectedRoute>
            } />

          {/* canteen items page */}
          <Route
            path={NAVIGATE_TO_CANTEENITEMPAGE}
            element={
              <RoleProtectedRoute userRole={userRole} allowedRoles={['admin']}>
                <CanteenItemPage />
              </RoleProtectedRoute>
            } />

          {/* card  page */}
          <Route
            path={NAVIGATE_TO_CARDPAGE}
            element={
              <RoleProtectedRoute userRole={userRole} allowedRoles={['admin']}>
                <CardPage />
              </RoleProtectedRoute>
            } />

          {/* Session */}
          <Route path={NAVIGATE_TO_SESSIONPAGE} element={
            <RoleProtectedRoute userRole={userRole} allowedRoles={['operator']}>
              <SessionPage />
            </RoleProtectedRoute>
          } />

          {/* Transactions */}
          <Route path={NAVIGATE_TO_TRANSACTIONPAGE} element={
            <RoleProtectedRoute userRole={userRole} allowedRoles={['admin', 'parent', 'staff']}>
              <TransactionPage />
            </RoleProtectedRoute>
          } />

          {/* Notifications */}
          <Route path={NAVIGATE_TO_NOTIFICATIONPAGE} element={
            <RoleProtectedRoute userRole={userRole} allowedRoles={['admin']}>
              <NotificationPage />
            </RoleProtectedRoute>
          } />

          <Route path={NAVIGATE_TO_SUPPORTPAGE} element={<SupportPage />} />
          <Route path={NAVIGATE_TO_INFOPAGE} element={<InfoPage />} />
        </Route>
      </Route>

      <Route path={ERROR_404_PAGE} element={<Error404Page />} />
    </Routes>
  );
};

export default RoutesContainer;
