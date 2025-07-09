import React, { useState, useEffect } from 'react';
import './App.css';
import Login from './Components/Login';
import Signup from './Components/Signup';
import UserProfile from './Components/user_reporter/user_profile';
import DoctorProfile from './Components/doctor/doctor_profile';
import PoliceProfile from './Components/police/police_station_details';

function App() {
  const [currentPage, setCurrentPage] = useState('login');
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    // On mount, check if user is already logged in
    const user = localStorage.getItem('user');
    if (user) {
      const parsed = JSON.parse(user);
      setUserRole(parsed.role);
      setCurrentPage('profile');
    }
  }, []);

  const handleNavigate = (page) => {
    if (page === 'profile') {
      const user = localStorage.getItem('user');
      if (user) {
        setUserRole(JSON.parse(user).role);
      }
    }
    setCurrentPage(page);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'login':
        return <Login onNavigate={handleNavigate} />;
      case 'signup':
        return <Signup onNavigate={handleNavigate} />;
      case 'profile':
        if (userRole === 'user') return <UserProfile />;
        if (userRole === 'doctor') return <DoctorProfile />;
        if (userRole === 'police') return <PoliceProfile />;
        return <div>No profile found.</div>;
      default:
        return <Login onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="App">
      <div className="page-transition">
        {renderPage()}
      </div>
    </div>
  );
}

export default App;
