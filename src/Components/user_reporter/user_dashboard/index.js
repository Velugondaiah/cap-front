import React from 'react';

const UserDashboard = ({ onNavigate }) => (
  <div className="dashboard-container">
    <h2>User Dashboard</h2>
    <p>Welcome, general user! Here you can view your reports, rewards, and more.</p>
    <button style={{marginTop: 24}} onClick={() => onNavigate && onNavigate('profile')}>
      View Profile
    </button>
  </div>
);

export default UserDashboard;
