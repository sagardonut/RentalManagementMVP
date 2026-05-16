import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ChatBot from './components/chatbot/ChatBot';

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
import AgencySignIn from './pages/AgencySignIn';
import SuperAdminSignIn from './pages/SuperAdminSignIn';
import LoginEntry from './pages/LoginEntry';

import ProtectedRoute from './components/auth/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/rooms" element={<Rooms />} />
          <Route path="/rooms/:id" element={<RoomDetails />} />
          
          {/* Booking Flow */}
          <Route path="/booking/:roomId" element={<BookingPayment />} />
          <Route path="/confirmation" element={<BookingSuccess />} />
          
          {/* Authentication */}
          <Route path="/login" element={<LoginEntry />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/agent/signin" element={<AgentSignIn />} />
          <Route path="/agent/signup" element={<AgentSignUp />} />
          <Route path="/agency/signin" element={<AgencySignIn />} />
          <Route path="/superadmin/signin" element={<SuperAdminSignIn />} />
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
          <Route path="/admin/agency" element={
            <ProtectedRoute allowedRoles={['agency']}>
              <AgencyDashboard />
            </ProtectedRoute>
          } />
          <Route path="/admin/super" element={
            <ProtectedRoute allowedRoles={['superadmin']}>
              <SuperAdminDashboard />
            </ProtectedRoute>
          } />
        </Routes>
      </Router>
      <ChatBot />
    </AuthProvider>
  );
}

export default App;
