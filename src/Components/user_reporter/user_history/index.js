import React, { useEffect, useState } from 'react';
import './index.css';
import { useNavigate } from 'react-router-dom';

const UserHistory = () => {
  const [reports, setReports] = useState([]);
  const [spottedReports, setSpottedReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('missing'); // 'missing' or 'spotted'
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true);
      setError(null);
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        const token = localStorage.getItem('token');
        
        if (!user) {
          setError('User not logged in.');
          setLoading(false);
          return;
        }

        // Use user.id if available, otherwise use user._id or email as fallback
        const userId = user.id || user._id || user.email;
        
        if (!userId) {
          setError('User ID not found.');
          setLoading(false);
          return;
        }
        
        // Fetch missing person reports (user's own reports)
        try {
          const missingRes = await fetch(`http://localhost:5000/api/user_missing_reports?user_id=${userId}`, {
            headers: token ? { 'Authorization': `Bearer ${token}` } : {}
          });
          
          if (missingRes.ok) {
            const missingResult = await missingRes.json();
            if (missingResult.success) {
              setReports(missingResult.data || []);
            } else {
              console.log('Missing reports API response:', missingResult);
              setReports([]); // Set empty array instead of error
            }
          } else {
            console.log('Missing reports API failed:', missingRes.status);
            setReports([]); // Set empty array instead of error
          }
        } catch (missingErr) {
          console.log('Missing reports fetch error:', missingErr);
          setReports([]); // Set empty array instead of error
        }
        
        // Fetch spotted unknown person reports (photos uploaded by user)
        try {
          const spottedRes = await fetch(`http://localhost:5000/api/user_spotted_reports?user_id=${userId}`, {
            headers: token ? { 'Authorization': `Bearer ${token}` } : {}
          });
          
          if (spottedRes.ok) {
            const spottedResult = await spottedRes.json();
            if (spottedResult.success) {
              setSpottedReports(spottedResult.data || []);
            } else {
              console.log('Spotted reports API response:', spottedResult);
              setSpottedReports([]); // Set empty array instead of error
            }
          } else {
            console.log('Spotted reports API failed:', spottedRes.status);
            setSpottedReports([]); // Set empty array instead of error
          }
        } catch (spottedErr) {
          console.log('Spotted reports fetch error:', spottedErr);
          setSpottedReports([]); // Set empty array instead of error
        }
        
      } catch (err) {
        console.error('Reports fetch error:', err);
        setError('Network or server error.');
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'found':
        return 'Found';
      case 'active':
        return 'Active';
      default:
        return 'Active';
    }
  };

  const getCurrentReports = () => {
    return activeTab === 'missing' ? reports : spottedReports;
  };

  const getCurrentStats = () => {
    const currentReports = getCurrentReports();
    const activeCount = currentReports.filter(r => getStatusColor(r.status) === 'Active').length;
    const foundCount = currentReports.filter(r => getStatusColor(r.status) === 'Found').length;
    
    return {
      total: currentReports.length,
      active: activeCount,
      found: foundCount
    };
  };

  const renderReportCard = (report, isSpotted = false) => (
    <div className="user-history-card" key={report.id || report._id || Math.random()}>
      {/* Card Header */}
      <div className="user-history-card-header">
        <div className="user-history-card-img">
          {report.image_url ? (
            <img src={report.image_url} alt={report.full_name || 'Unknown Person'} />
          ) : (
            <div className="user-history-card-img-placeholder">👤</div>
          )}
        </div>
        <div className="user-history-card-name">
          {isSpotted ? (report.full_name || 'Unknown Person') : report.full_name}
        </div>
        <div className="user-history-card-status">
          Status: {getStatusColor(report.status)}
        </div>
      </div>

      {/* Card Body */}
      <div className="user-history-card-body">
        <div className="user-history-card-info">
          {isSpotted ? (
            // Spotted person report fields
            <>
              <div className="user-history-card-row">
                <div className="user-history-card-label">Location</div>
                <div className="user-history-card-value">{report.location || 'Unknown'}</div>
              </div>
              <div className="user-history-card-row">
                <div className="user-history-card-label">Date Spotted</div>
                <div className="user-history-card-value">{report.spotted_date || 'Unknown'}</div>
              </div>
              <div className="user-history-card-row">
                <div className="user-history-card-label">Description</div>
                <div className="user-history-card-value">{report.description || 'No description'}</div>
              </div>
              <div className="user-history-card-row">
                <div className="user-history-card-label">Reported</div>
                <div className="user-history-card-value">
                  {report.created_at ? new Date(report.created_at).toLocaleDateString() : 'N/A'}
                </div>
              </div>
            </>
          ) : (
            // Missing person report fields
            <>
              <div className="user-history-card-row">
                <div className="user-history-card-label">Age</div>
                <div className="user-history-card-value">{report.age_when_missing}</div>
              </div>
              <div className="user-history-card-row">
                <div className="user-history-card-label">Gender</div>
                <div className="user-history-card-value">{report.gender}</div>
              </div>
              <div className="user-history-card-row">
                <div className="user-history-card-label">Last Seen</div>
                <div className="user-history-card-value">{report.last_seen_location}</div>
              </div>
              <div className="user-history-card-row">
                <div className="user-history-card-label">Date</div>
                <div className="user-history-card-value">{report.last_seen_date}</div>
              </div>
              <div className="user-history-card-row">
                <div className="user-history-card-label">Guardian</div>
                <div className="user-history-card-value">{report.guardian_name}</div>
              </div>
              <div className="user-history-card-row">
                <div className="user-history-card-label">Relationship</div>
                <div className="user-history-card-value">{report.relationship}</div>
              </div>
              <div className="user-history-card-row">
                <div className="user-history-card-label">Phone</div>
                <div className="user-history-card-value">{report.phone_number}</div>
              </div>
              <div className="user-history-card-row">
                <div className="user-history-card-label">Email</div>
                <div className="user-history-card-value">{report.email}</div>
              </div>
              <div className="user-history-card-row">
                <div className="user-history-card-label">Reported</div>
                <div className="user-history-card-value">
                  {report.created_at ? new Date(report.created_at).toLocaleDateString() : 'N/A'}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Card Actions */}
        <div className="user-history-card-actions">
          <button className="user-history-card-action-btn primary">
            View Details
          </button>
          <button className="user-history-card-action-btn secondary">
            {isSpotted ? 'Update Spotting' : 'Update Report'}
          </button>
        </div>
      </div>
    </div>
  );

  const stats = getCurrentStats();

  return (
    <div className="user-history-root">
      {/* Header Section */}
      <div className="user-history-header">
        <span className="user-history-header-emoji" role="img" aria-label="support">📋</span>
        <div className="user-history-title">Your Reports</div>
        <div className="user-history-support">
          Track all your missing person reports and spotted unknown persons in one place.
        </div>
      </div>

      {/* Tabs Section */}
      <div className="user-history-tabs">
        <button 
          className={`user-history-tab ${activeTab === 'missing' ? 'active' : ''}`}
          onClick={() => setActiveTab('missing')}
        >
          <span className="user-history-tab-icon" role="img" aria-label="missing">🔍</span>
          Missing Persons
        </button>
        <button 
          className={`user-history-tab ${activeTab === 'spotted' ? 'active' : ''}`}
          onClick={() => setActiveTab('spotted')}
        >
          <span className="user-history-tab-icon" role="img" aria-label="spotted">📸</span>
          Spotted Persons
        </button>
      </div>

      {/* Stats Section */}
      <div className="user-history-stats">
        <div className="user-history-stat-card">
          <div className="user-history-stat-number">{stats.total}</div>
          <div className="user-history-stat-label">
            {activeTab === 'missing' ? 'Total Reports' : 'Total Spottings'}
          </div>
        </div>
        <div className="user-history-stat-card">
          <div className="user-history-stat-number">{stats.active}</div>
          <div className="user-history-stat-label">
            {activeTab === 'missing' ? 'Active Cases' : 'Active Spottings'}
          </div>
        </div>
        <div className="user-history-stat-card">
          <div className="user-history-stat-number">{stats.found}</div>
          <div className="user-history-stat-label">
            {activeTab === 'missing' ? 'Resolved Cases' : 'Identified Persons'}
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="user-history-loading">
          <span role="img" aria-label="loading">⏳</span> Loading your reports...
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="user-history-error">
          <span role="img" aria-label="error">⚠️</span> {error}
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && getCurrentReports().length === 0 && (
        <div className="user-history-empty">
          <span className="user-history-empty-emoji" role="img" aria-label="no reports">
            {activeTab === 'missing' ? '📝' : '📸'}
          </span>
          <div className="user-history-empty-title">
            {activeTab === 'missing' ? 'No Missing Person Reports Yet' : 'No Spotted Persons Yet'}
          </div>
          <div className="user-history-empty-description">
            {activeTab === 'missing' 
              ? "You haven't reported anyone missing yet. We hope you never have to, but if you do, we're here to help."
              : "You haven't spotted any unknown persons yet. Help others by reporting if you see someone who might be missing."
            }
          </div>
        </div>
      )}

      {/* Reports Grid */}
      <div className="user-history-list">
        {getCurrentReports().map((report) => 
          renderReportCard(report, activeTab === 'spotted')
        )}
      </div>

      {/* Floating Action Button */}
      <button 
        className="user-history-fab" 
        title={activeTab === 'missing' ? "Report someone missing" : "Report spotted person"}
        onClick={() => navigate(activeTab === 'missing' ? '/report_missing' : '/report_spotted')}
      >
        <span role="img" aria-label="add">➕</span>
      </button>
    </div>
  );
};

export default UserHistory;
