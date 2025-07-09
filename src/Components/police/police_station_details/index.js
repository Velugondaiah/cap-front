import React, { useEffect, useState } from 'react';

const PoliceProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Not logged in.');
          setLoading(false);
          return;
        }
        const response = await fetch('http://localhost:5000/api/auth/profile', {
          headers: { 'Authorization': 'Bearer ' + token }
        });
        const result = await response.json();
        if (result.success) {
          setProfile(result.data.user);
        } else {
          setError(result.message || 'Failed to fetch profile.');
        }
      } catch (err) {
        setError('Error fetching profile.');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) return <div>Loading profile...</div>;
  if (error) return <div style={{color:'red'}}>{error}</div>;
  if (!profile) return null;

  return (
    <div className="profile-card">
      <h2>Police Profile</h2>
      <p><strong>Name:</strong> {profile.name}</p>
      <p><strong>Email:</strong> {profile.email}</p>
      <p><strong>Phone:</strong> {profile.phone}</p>
      <p><strong>Role:</strong> {profile.role}</p>
      <p><strong>Badge Number:</strong> {profile.badge_number}</p>
      <p><strong>Station Name:</strong> {profile.station_name}</p>
      <p><strong>Jurisdiction Area:</strong> {profile.jurisdiction_area}</p>
      <p><strong>Rank:</strong> {profile.rank}</p>
      <p><strong>Verified:</strong> {profile.verified ? 'Yes' : 'No'}</p>
    </div>
  );
};

export default PoliceProfile;
