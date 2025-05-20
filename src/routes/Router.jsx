import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import LoginPage from '@pages/LoginPage';
import UsersManagement from '@pages/UsersManagement';
import PendingUsersPage from '@pages/PendingUsersPage';
import { ThemeProvider } from '@mui/material/styles';
import StoresPage from '@pages/StoresPage';
import CssBaseline from '@mui/material/CssBaseline';
import theme from '@styles/theme';
import Sidebar from '@components/Sidebar';
import CategoriesPage from '@pages/CategoriesPage';
import OrdersPage from '@pages/OrdersPage';
import AnalyticsPage from '@pages/AnalyticsPage';
import AdPage from '@pages/AdPage';
import SellerAnalyticsPage from '@pages/SellerAnalyticsPage';
import ChatPage from '@pages/ChatPage';
import RoutesPage from '@pages/RoutesPage';
import RoutesPage2 from '../pages/DelRoutePage';

const isAuthenticated = () => {
  console.log(localStorage.getItem('auth'));
  return localStorage.getItem('auth');
};

const ProtectedRoute = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to='/login' replace />;
};

const Layout = ({ children }) => (
  <div style={{ display: 'flex' }}>
    <Sidebar />
    <div style={{ flex: 1 }}>{children}</div>
  </div>
);

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route
          path='/login'
          element={
            <ThemeProvider theme={theme}>
              <CssBaseline />
              <LoginPage />
            </ThemeProvider>
          }
        />
        <Route
          path='/users'
          element={
            <ProtectedRoute>
              <Layout>
                <ThemeProvider theme={theme}>
                  <CssBaseline />
                  <UsersManagement />
                </ThemeProvider>
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path='/requests'
          element={
            <ProtectedRoute>
              <Layout>
                <ThemeProvider theme={theme}>
                  <CssBaseline />
                  <PendingUsersPage />
                </ThemeProvider>
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path='/stores'
          element={
            <ProtectedRoute>
              <Layout>
                <ThemeProvider theme={theme}>
                  <CssBaseline />
                  <StoresPage />
                </ThemeProvider>
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path='/categories'
          element={
            <ProtectedRoute>
              <Layout>
                <ThemeProvider theme={theme}>
                  <CssBaseline />
                  <CategoriesPage />
                </ThemeProvider>
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path='/orders'
          element={
            <ProtectedRoute>
              <Layout>
                <ThemeProvider theme={theme}>
                  <CssBaseline />
                  <OrdersPage />
                </ThemeProvider>
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path='/analytics'
          element={
            <ProtectedRoute>
              <Layout>
                <ThemeProvider theme={theme}>
                  <CssBaseline />
                  <AnalyticsPage />
                </ThemeProvider>
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path='/ads'
          element={
            <ProtectedRoute>
              <Layout>
                <ThemeProvider theme={theme}>
                  <CssBaseline />
                  <AdPage />
                </ThemeProvider>
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path='/chat'
          element={
            <ProtectedRoute>
              <Layout>
                <ThemeProvider theme={theme}>
                  <CssBaseline />
                  <ChatPage />
                </ThemeProvider>
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path='/routes'
          element={
            <ProtectedRoute>
              <Layout>
                <ThemeProvider theme={theme}>
                  <CssBaseline />
                  {/* <RoutesPage /> */}
                  <RoutesPage />
                </ThemeProvider>
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path='/'
          element={
            <Navigate to={isAuthenticated() ? '/users' : '/login'} replace />
          }
        />
        <Route path='/analytics/seller' element={<SellerAnalyticsPage />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
