import React, { useState, useEffect } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Login from './Components/Login';
import Signup from './Components/Signup';
import UserDashboard from './Components/user_reporter/user_dashboard';
import DoctorDashboard from './Components/doctor/doctor_dashboard';
import PoliceDashboard from './Components/police/police_station_dashboard';
import UserProfile from './Components/user_reporter/user_profile';
import DoctorProfile from './Components/doctor/doctor_profile';
import PoliceProfile from './Components/police/police_station_details';

function App() {
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      setUserRole(JSON.parse(user).role);
    }
  }, []);

  return (
    <Router>
      <div className="App">
        <div className="page-transition">
          <Routes>
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/login" element={<LoginWithRedirect setUserRole={setUserRole} />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/user_dashboard" element={<UserDashboardWithNav />} />
            <Route path="/doctor_dashboard" element={<DoctorDashboardWithNav />} />
            <Route path="/police_dashboard" element={<PoliceDashboardWithNav />} />
            <Route path="/profile" element={<ProfileWithNav userRole={userRole} />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

// Wrappers to inject navigation
function LoginWithRedirect({ setUserRole }) {
  const navigate = useNavigate();
  return <Login onNavigate={page => {
    if (page === 'signup') navigate('/signup');
    else if (page === 'profile') navigate('/profile');
    else if (page === 'user_dashboard') navigate('/user_dashboard');
    else if (page === 'doctor_dashboard') navigate('/doctor_dashboard');
    else if (page === 'police_dashboard') navigate('/police_dashboard');
    else navigate('/login');
    // Update userRole after login
    const user = localStorage.getItem('user');
    if (user) setUserRole(JSON.parse(user).role);
  }} />;
}

function UserDashboardWithNav() {
  const navigate = useNavigate();
  return <UserDashboard onNavigate={page => {
    if (page === 'profile') navigate('/profile');
  }} />;
}
function DoctorDashboardWithNav() {
  const navigate = useNavigate();
  return <DoctorDashboard onNavigate={page => {
    if (page === 'profile') navigate('/profile');
  }} />;
}
function PoliceDashboardWithNav() {
  const navigate = useNavigate();
  return <PoliceDashboard onNavigate={page => {
    if (page === 'profile') navigate('/profile');
  }} />;
}

function ProfileWithNav({ userRole }) {
  const navigate = useNavigate();
  if (userRole === 'user') {
    return <UserProfile onNavigate={page => {
      if (page === 'user_dashboard') navigate('/user_dashboard');
    }} />;
  }
  if (userRole === 'doctor') {
    return <DoctorProfile onNavigate={page => {
      if (page === 'doctor_dashboard') navigate('/doctor_dashboard');
    }} />;
  }
  if (userRole === 'police') {
    return <PoliceProfile onNavigate={page => {
      if (page === 'police_dashboard') navigate('/police_dashboard');
    }} />;
  }
  return <Navigate to="/login" />;
}

export default App;
