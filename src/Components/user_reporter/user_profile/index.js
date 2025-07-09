import React, { useEffect, useState } from 'react';

const UserProfile = () => {
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
      <h2>Profile</h2>
      <p><strong>Name:</strong> {profile.name}</p>
      <p><strong>Email:</strong> {profile.email}</p>
      <p><strong>Phone:</strong> {profile.phone}</p>
      <p><strong>Role:</strong> {profile.role}</p>
      {profile.role === 'user' && (
        <>
          <p><strong>Aadhar Number:</strong> {profile.aadhar_number}</p>
          <p><strong>Address:</strong> {profile.address}</p>
          <p><strong>Date of Birth:</strong> {profile.date_of_birth}</p>
          <p><strong>Gender:</strong> {profile.gender}</p>
        </>
      )}
      {profile.role === 'police' && (
        <>
          <p><strong>Badge Number:</strong> {profile.badge_number}</p>
          <p><strong>Station Name:</strong> {profile.station_name}</p>
          <p><strong>Jurisdiction Area:</strong> {profile.jurisdiction_area}</p>
          <p><strong>Rank:</strong> {profile.rank}</p>
          <p><strong>Verified:</strong> {profile.verified ? 'Yes' : 'No'}</p>
        </>
      )}
      {profile.role === 'doctor' && (
        <>
          <p><strong>Specialization:</strong> {profile.specialization}</p>
          <p><strong>License Number:</strong> {profile.license_number}</p>
          <p><strong>Hospital Name:</strong> {profile.hospital_name}</p>
          <p><strong>Location:</strong> {profile.location}</p>
          <p><strong>Verified:</strong> {profile.verified ? 'Yes' : 'No'}</p>
        </>
      )}
    </div>
  );
};

export default UserProfile;
