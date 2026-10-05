import React from "react";
import { Navigate, Outlet, Route, Routes, useLocation } from "react-router-dom";

import { ForgetPasswordPage, LoginPage, ResetPasswordPage } from "../page/Login";

import {
  ERROR_404_PAGE,
  NAVIGATE_TO_ADMINDETAILSPAGE,
  NAVIGATE_TO_ADMINPAGE,
  NAVIGATE_TO_CANTEENITEMPAGE,
  NAVIGATE_TO_CARDPAGE,
  NAVIGATE_TO_DASHBOARD,
    NAVIGATE_TO_FORGOTPASSWORDPAGE,
    NAVIGATE_TO_RESETPASSWORDPAGE,
    NAVIGATE_TO_SETTINGSPAGE,
    NAVIGATE_TO_BANKDEPOSITPAGE,
  NAVIGATE_TO_INFOPAGE,
  NAVIGATE_TO_LEDGERPAGE,
  NAVIGATE_TO_LOGINPAGE,
  NAVIGATE_TO_NOTIFICATIONPAGE,
  NAVIGATE_TO_OPERATORDETAILSPAGE,
  NAVIGATE_TO_OPERATORPAGE,
  NAVIGATE_TO_PARENTDETAILSPAGE,
  NAVIGATE_TO_PARENTPAGE,
  NAVIGATE_TO_PROFILEPAGE,
  NAVIGATE_TO_SCHOOLPAGE,
  NAVIGATE_TO_SESSIONPAGE,
  NAVIGATE_TO_SPENDPAGE,
  NAVIGATE_TO_TOPUPPAGE,
  NAVIGATE_TO_STAFFDETAILSPAGE,
  NAVIGATE_TO_STAFFPAGE,
  NAVIGATE_TO_STUDENTDETAILSPAGE,
  NAVIGATE_TO_STUDENTIMPORTPAGE,
  NAVIGATE_TO_STUDENTPAGE,
  NAVIGATE_TO_STATEMENTPAGE,
  NAVIGATE_TO_SUPPORTPAGE,
  NAVIGATE_TO_TRANSACTIONPAGE,
} from "./types";
import { STATUS } from "../constant";
import Error404Page from "../page/ErrorsPages/404Error";
import { Main } from "../components";
import { AdminDetailsPage, AdminPage, BankDepositPage, CanteenItemPage, CardPage, Dashboard, InfoPage, JournalPage, OperatorDetailsPage, OperatorPage, ParentDetailsPage, ParentPage, ProfilePage, SchoolPage, SettingsPage, SpendPage, StudentDetailsPage, StudentPage, StudentImportPage, SupportPage, TopUpPage, TransactionPage, SessionPage, NotificationPage, StaffDetailsPage, StaffPage, StatementPage } from "../page";

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

// Superuser-only pages. The sidebar already hides these unless the user is a
// superuser, so the guard has to agree or the page stays reachable by typing the
// URL. Used for: admin list, student import, schools, cards, all notifications.
const SuperuserRoute = ({ userRole, isSuperuser, children }) => {
  return userRole === "admin" && isSuperuser ? children : <Navigate to={NAVIGATE_TO_DASHBOARD} />;
};

// MAIN FUNC TO RENDER ROUTES AND PAGES
const RoutesContainer = ({ loginStatus, userRole, isSuperuser }) => {
  const location = useLocation();

  return (
    <Routes key={location.pathname} location={location}>

      <Route path={NAVIGATE_TO_LOGINPAGE} element={<LoginPage />} />
        <Route path={NAVIGATE_TO_FORGOTPASSWORDPAGE} element={<ForgetPasswordPage/>} />
        <Route path={NAVIGATE_TO_RESETPASSWORDPAGE} element={<ResetPasswordPage />} />

      <Route path="/" element={<ProtectRoute status={loginStatus} />}>
        <Route path='/' element={<Main />}>
          <Route index element={<Dashboard />} />
          <Route path={NAVIGATE_TO_PROFILEPAGE} element={<ProfilePage />} />
          {/* Self-service settings: every role gets password + picture + appearance. */}
          <Route path={NAVIGATE_TO_SETTINGSPAGE} element={<SettingsPage />} />

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

          {/* student import */}
          <Route
            path={NAVIGATE_TO_STUDENTIMPORTPAGE}
            element={
              <SuperuserRoute userRole={userRole} isSuperuser={isSuperuser}>
                <StudentImportPage />
              </SuperuserRoute>
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
              <SuperuserRoute userRole={userRole} isSuperuser={isSuperuser}>
                <AdminPage />
              </SuperuserRoute>
            } />

          {/* admin details */}
          <Route
            path={NAVIGATE_TO_ADMINDETAILSPAGE}
            element={
              <SuperuserRoute userRole={userRole} isSuperuser={isSuperuser}>
                <AdminDetailsPage />
              </SuperuserRoute>
            } />

          {/* school page */}
          <Route
            path={NAVIGATE_TO_SCHOOLPAGE}
            element={
              <SuperuserRoute userRole={userRole} isSuperuser={isSuperuser}>
                <SchoolPage />
              </SuperuserRoute>
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
              <SuperuserRoute userRole={userRole} isSuperuser={isSuperuser}>
                <CardPage />
              </SuperuserRoute>
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

          {/* Bank Deposit / finance */}
          <Route path={NAVIGATE_TO_BANKDEPOSITPAGE} element={
            <RoleProtectedRoute userRole={userRole} allowedRoles={['admin']}>
              <BankDepositPage />
            </RoleProtectedRoute>
          } />

          {/* Ledger journal (FE-11) - admin only, matching the BE-29 rule */}
          <Route path={NAVIGATE_TO_LEDGERPAGE} element={
            <RoleProtectedRoute userRole={userRole} allowedRoles={['admin']}>
              <JournalPage />
            </RoleProtectedRoute>
          } />

          {/* Spend */}
          <Route path={NAVIGATE_TO_SPENDPAGE} element={
            <RoleProtectedRoute userRole={userRole} allowedRoles={['parent']}>
              <SpendPage />
            </RoleProtectedRoute>
          } />

          {/* Top up */}
          <Route path={NAVIGATE_TO_TOPUPPAGE} element={
            <RoleProtectedRoute userRole={userRole} allowedRoles={['parent']}>
              <TopUpPage />
            </RoleProtectedRoute>
          } />

          {/* Statement. The sidebar entry already pointed here, so without this
              route a parent clicking it landed on the 404. */}
          <Route path={NAVIGATE_TO_STATEMENTPAGE} element={
            <RoleProtectedRoute userRole={userRole} allowedRoles={['parent']}>
              <StatementPage />
            </RoleProtectedRoute>
          } />

          {/* Notifications */}
          <Route path={NAVIGATE_TO_NOTIFICATIONPAGE} element={
            <SuperuserRoute userRole={userRole} isSuperuser={isSuperuser}>
              <NotificationPage />
            </SuperuserRoute>
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
