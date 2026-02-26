import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import OnboardingPage from './pages/OnboardingPage';
import HomePage from './pages/HomePage';
import NotificationPage from './pages/NotificationPage';
import ChatPage from './pages/ChatPage';
import CallPage from './pages/CallPage';
import PageLoader from './components/PageLoader';
import useAuthUser from './hooks/useAuthUser';

const App = () => {
  // Read authentication state once and derive route guards from it.
  const { isLoading, authUser } = useAuthUser();

  const isAuthenticated = Boolean(authUser);
  const isOnboarded = authUser?.isOnboarded;

  // Keep loading UI while auth status is being fetched.
  if (isLoading) return <PageLoader />;

  return (
    <div>
      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated && isOnboarded ? (
              <HomePage />
            ) : (
              <Navigate to={!isAuthenticated ? '/login' : '/onboarding'} />
            )
          }
        />
        <Route
          path="/signup"
          element={!isAuthenticated ? <SignUpPage /> : <Navigate to="/" />}
        />
        <Route
          path="/login"
          element={!isAuthenticated ? <LoginPage /> : <Navigate to={isOnboarded? "/" : "/onboarding"} />}
        />
        <Route
          path="/onboarding"
          element={
            isAuthenticated && !isOnboarded ? (
              <OnboardingPage />
            ) : (
              <Navigate to={!isAuthenticated ? '/login' : '/'} />
            )
          }
        />
        <Route
          path="/Notification"
          element={
            isAuthenticated && isOnboarded ? (
              <NotificationPage />
            ) : (
              <Navigate to={!isAuthenticated ? '/login' : '/onboarding'} />
            )
          }
        />
        <Route
          path="/Chat"
          element={
            isAuthenticated && isOnboarded ? (
              <ChatPage />
            ) : (
              <Navigate to={!isAuthenticated ? '/login' : '/onboarding'} />
            )
          }
        />
        <Route
          path="/Call"
          element={
            isAuthenticated && isOnboarded ? (
              <CallPage />
            ) : (
              <Navigate to={!isAuthenticated ? '/login' : '/onboarding'} />
            )
          }
        />
      </Routes>
      <Toaster />
    </div>
  );
};

export default App;
