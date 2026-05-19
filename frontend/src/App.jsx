import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

import Home from './pages/Home';
import Rooms from './pages/Rooms';
import RoomDetails from './pages/RoomDetails';
import BookingPayment from './pages/BookingPayment';
import BookingSuccess from './pages/BookingSuccess';
import PaymentSetup from './pages/PaymentSetup';
import UserDashboard from './pages/UserDashboard';
import AgentDashboard from './pages/AgentDashboard';
import AgencyDashboard from './pages/AgencyDashboard';
import SuperAdminDashboard from './pages/SuperAdminDashboard';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import AgentSignIn from './pages/AgentSignIn';
import AgentSignUp from './pages/AgentSignUp';
import LoginEntry from './pages/LoginEntry';
import SuperAdminSignIn from './pages/SuperAdminSignIn';
import HelpCenter from './pages/HelpCenter';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsConditions from './pages/TermsConditions';
import ContactUs from './pages/ContactUs';

import ProtectedRoute from './components/auth/ProtectedRoute';
import FloatingChatbot from './components/chatbot/FloatingChatbot';

function App() {
  return (
    <AuthProvider>
      <Router>
        <ThemeProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/rooms" element={<Rooms />} />
          <Route path="/rooms/:id" element={<RoomDetails />} />
          <Route path="/help" element={<HelpCenter />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-conditions" element={<TermsConditions />} />
          <Route path="/contact-us" element={<ContactUs />} />
          
          {/* Booking Flow */}
          <Route path="/booking/:roomId" element={<BookingPayment />} />
          <Route path="/confirmation" element={<BookingSuccess />} />
          
          {/* Authentication */}
          <Route path="/login" element={<LoginEntry />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/agent/signin" element={<AgentSignIn />} />
          <Route path="/agent/signup" element={<AgentSignUp />} />
          <Route path="/superadmin/login" element={<SuperAdminSignIn />} />
          <Route path="/payment-setup" element={<PaymentSetup />} />
          
          {/* Dashboards - Protected by Role */}
          <Route path="/user/dashboard" element={
            <ProtectedRoute allowedRoles={['user']}>
              <UserDashboard />
            </ProtectedRoute>
          } />
          <Route path="/agent/dashboard" element={
            <ProtectedRoute allowedRoles={['agent']}>
              <AgentDashboard />
            </ProtectedRoute>
          } />
          <Route path="/agency/dashboard" element={
            <ProtectedRoute allowedRoles={['agency']}>
              <AgencyDashboard />
            </ProtectedRoute>
          } />
          <Route path="/admin/super" element={
            <ProtectedRoute allowedRoles={['superadmin']}>
              <SuperAdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="/admin/super/payments" element={
            <ProtectedRoute allowedRoles={['superadmin']}>
              <SuperAdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="/admin/super/reports" element={
            <ProtectedRoute allowedRoles={['superadmin']}>
              <SuperAdminDashboard />
            </ProtectedRoute>
          } />
        </Routes>
        <FloatingChatbot />
        </ThemeProvider>
      </Router>
    </AuthProvider>
  );
}

export default App;
