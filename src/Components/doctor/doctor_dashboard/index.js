import React from 'react';
import './index.css';

const DoctorDashboard = ({ onNavigate }) => (
  <div className="dashboard-container">
    <h2>Doctor Dashboard</h2>
    <p>Welcome, doctor! Here you can manage newborn details, view history, and more.</p>
    <button style={{marginTop: 24}} onClick={() => onNavigate && onNavigate('profile')}>
      View Profile
    </button>
  </div>
);

export default DoctorDashboard;
