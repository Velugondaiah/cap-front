import React, { useEffect, useState } from 'react';
import { Avatar, IconButton, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Snackbar, Alert } from '@mui/material';
import { Dashboard, Person, Message, Settings, Notifications, Logout, Brightness4, Brightness7, VerifiedUser, AddAlert, CloudUpload, CheckCircle, EmojiEvents, Map } from '@mui/icons-material';
import './index.css';

const navItems = [
  { label: 'Dashboard', icon: <Dashboard /> },
  { label: 'Profile', icon: <Person /> },
  { label: 'Reports', icon: <CheckCircle /> },
  { label: 'Messages', icon: <Message /> },
  { label: 'Settings', icon: <Settings /> },
];

const UserDashboard = ({ onNavigate }) => {
  const [user, setUser] = useState({ name: '', role: 'Citizen', verified: true });
  const [darkMode, setDarkMode] = useState(false);
  const [activeNav, setActiveNav] = useState('Dashboard');
  const [openSighting, setOpenSighting] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);

  useEffect(() => {
    const u = JSON.parse(localStorage.getItem('user'));
    if (u) setUser({ ...u, role: 'Citizen', verified: true });
  }, []);

  // Mock data
  const myReports = [
    { name: 'John Doe', status: 'Missing', alert: true },
    { name: 'Jane Smith', status: 'Found', alert: false },
  ];
  const sightings = [
    { photo: '', location: 'Central Park', time: '1h ago', desc: 'Spotted a person matching description.' },
    { photo: '', location: 'Main St', time: '3h ago', desc: 'Possible sighting near bus stop.' },
  ];
  const matches = [
    { msg: 'Possible match for John Doe at Central Park!', time: 'Just now' },
  ];
  const rewards = [
    { desc: 'Reward for reporting sighting of John Doe', status: 'Earned' },
    { desc: 'Reward for uploading sighting of Jane Smith', status: 'Pending' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    if (onNavigate) {
      onNavigate('login');
    } else {
      window.location.href = '/login';
    }
  };

  return (
    <div className={`civic-dashboard-root topnav-layout${darkMode ? ' dark' : ''}`}> 
      {/* Top Navigation Bar */}
      <header className="civic-topnav">
        <div className="civic-topnav-left">
          <span className="civic-topnav-logo">
            <Dashboard className="civic-topnav-logo-icon" />
            CivicIQ
          </span>
          <nav className="civic-topnav-nav">
            {navItems.map((item) => (
              <div
                key={item.label}
                className={`civic-topnav-nav-item${activeNav === item.label ? ' active' : ''}`}
                onClick={() => {
                  setActiveNav(item.label);
                  onNavigate && onNavigate(item.label.toLowerCase());
                }}
                title={item.label}
                style={{ fontSize: '1rem', padding: '8px 16px' }}
              >
                {React.cloneElement(item.icon, { style: { fontSize: 20 } })}
                <span>{item.label}</span>
              </div>
            ))}
          </nav>
        </div>
        <div className="civic-topnav-right">
          <IconButton color="inherit" onClick={() => setDarkMode(!darkMode)} size="small">
            {darkMode ? <Brightness7 style={{ fontSize: 20 }} /> : <Brightness4 style={{ fontSize: 20 }} />}
          </IconButton>
          <IconButton color="inherit" onClick={handleLogout} size="small"><Logout style={{ fontSize: 20 }} /></IconButton>
          <div className="civic-topnav-profile">
            <Avatar src={user.photo || ''} style={{ width: 32, height: 32 }} />
            <div className="civic-topnav-profile-info">
              <div className="civic-topnav-profile-name">{user.name || 'Citizen'} {user.verified && <VerifiedUser className="civic-topnav-badge" title="Verified user" />}</div>
              <div className="civic-topnav-profile-role">{user.role}</div>
            </div>
          </div>
        </div>
      </header>
      {/* Main Content */}
      <main className="civic-dashboard-main topnav-main">
        {/* Hero Section */}
        <section className="civic-dashboard-header topnav-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
            <Avatar src={user.photo || ''} className="civic-header-avatar" style={{ width: 72, height: 72, marginRight: 18, boxShadow: '0 2px 8px #dbeafe55', border: '3px solid #e0e7ef' }} />
            <div>
              <div className="civic-header-greeting">
                Welcome, <span className="civic-header-name">{user.name || 'Citizen'}</span> {user.verified && <VerifiedUser className="civic-header-verified" title="Verified user" />}
              </div>
              <div className="civic-header-role">{user.role}</div>
            </div>
          </div>
          <div className="civic-header-actions">
            <button className="civic-header-action-btn" onClick={() => onNavigate && onNavigate('report_missing')}><AddAlert style={{ fontSize: 22 }} /> Report Missing</button>
            <button className="civic-header-action-btn" onClick={() => setOpenSighting(true)}><CloudUpload style={{ fontSize: 22 }} /> Upload Sighting</button>
          </div>
        </section>
        {/* Widget Grid */}
        <section className="civic-widget-grid">
          {/* My Reports Widget */}
          <div className="civic-widget-card">
            <div className="civic-widget-title"><CheckCircle /> My Reports</div>
            <ul className="civic-widget-list">
              {myReports.map((r, i) => (
                <li key={i} className={`civic-widget-list-item${r.status === 'Missing' ? ' missing' : ' found'}`}> 
                  <span className="civic-widget-list-avatar"><Person /></span>
                  <span className="civic-widget-list-name">{r.name}</span>
                  <span className={`civic-widget-list-status ${r.status === 'Missing' ? 'missing' : 'found'}`}>{r.status}</span>
                  {r.alert && <span className="civic-widget-list-alert"><Notifications /></span>}
                </li>
              ))}
            </ul>
          </div>
          {/* Recent Sightings Widget */}
          <div className="civic-widget-card">
            <div className="civic-widget-title"><Map /> Recent Sightings</div>
            <ul className="civic-widget-list">
              {sightings.map((s, i) => (
                <li key={i} className="civic-widget-list-item">
                  <span className="civic-widget-list-avatar"><Map /></span>
                  <span className="civic-widget-list-name">{s.location}</span>
                  <span className="civic-widget-list-desc">{s.desc}</span>
                  <span className="civic-widget-list-time">{s.time}</span>
                </li>
              ))}
            </ul>
          </div>
          {/* Matches/Alerts Widget */}
          <div className="civic-widget-card">
            <div className="civic-widget-title"><Notifications /> Matches / Alerts</div>
            <ul className="civic-widget-list">
              {matches.map((m, i) => (
                <li key={i} className="civic-widget-list-item">
                  <span className="civic-widget-list-avatar"><Notifications /></span>
                  <span className="civic-widget-list-name">{m.msg}</span>
                  <span className="civic-widget-list-time">{m.time}</span>
                </li>
              ))}
            </ul>
          </div>
          {/* Rewards Widget */}
          <div className="civic-widget-card">
            <div className="civic-widget-title"><EmojiEvents /> Rewards</div>
            <ul className="civic-widget-list">
              {rewards.map((r, i) => (
                <li key={i} className={`civic-widget-list-item${r.status === 'Earned' ? ' earned' : ' pending'}`}> 
                  <span className="civic-widget-list-avatar"><EmojiEvents /></span>
                  <span className="civic-widget-list-name">{r.desc}</span>
                  <span className={`civic-widget-list-status ${r.status === 'Earned' ? 'earned' : 'pending'}`}>{r.status}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>
      {/* Upload Sighting Modal */}
      <Dialog open={openSighting} onClose={() => setOpenSighting(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Upload Sighting</DialogTitle>
        <DialogContent>
          <TextField margin="dense" label="Photo URL" fullWidth />
          <TextField margin="dense" label="Location" fullWidth />
          <TextField margin="dense" label="Date & Time" type="datetime-local" InputLabelProps={{ shrink: true }} fullWidth />
          <TextField margin="dense" label="Description / Notes" fullWidth multiline rows={2} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenSighting(false)}>Cancel</Button>
          <Button onClick={() => { setOpenSighting(false); setOpenAlert(true); }} variant="contained" color="secondary">Submit</Button>
        </DialogActions>
      </Dialog>
      {/* Snackbar for alert */}
      <Snackbar open={openAlert} autoHideDuration={4000} onClose={() => setOpenAlert(false)} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert onClose={() => setOpenAlert(false)} severity="success" sx={{ width: '100%' }}>
          Submitted successfully!
        </Alert>
      </Snackbar>
    </div>
  );
};

export default UserDashboard;
