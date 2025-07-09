import React from 'react';

const PoliceDashboard = ({ onNavigate }) => (
  <div className="dashboard-container">
    <h2>Police Dashboard</h2>
    <p>Welcome, officer! Here you can search cases, view station details, and more.</p>
    <button style={{marginTop: 24}} onClick={() => onNavigate && onNavigate('profile')}>
      View Profile
    </button>
  </div>
);

export default PoliceDashboard;
