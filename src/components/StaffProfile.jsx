import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { RiContactsLine } from "react-icons/ri";
import Sidebar from "./Sidebar"; // Sidebar component
import "../style/StaffProfile.css";

const StaffProfile = () => {
  const baseURL = import.meta.env.REACT_APP_BASEURL;
  const [user, setUser] = useState(null);
  const navigate = useNavigate(); // For redirecting after logout

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const response = await axios.get(`${baseURL}/auth/user`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(response.data);
    } catch (error) {
      console.error("Error fetching user", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/"); // Redirect to login page
    window.location.reload(); // Force a full refresh
  };

  return (
    <div className="staff-profile-container">
      <Sidebar user={user} handleLogout={handleLogout} />
      <div className="profile-content">
        <h2><RiContactsLine /> My Profile</h2>
        {user ? (
          <div className="profile-card">
            <p><strong>Name:</strong> {user.name}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Phone:</strong> {user.phone}</p>
            <p><strong>Role:</strong> {user.role}</p>
          </div>
        ) : (
          <p>Loading profile...</p>
        )}
      </div>
    </div>
  );
};

export default StaffProfile;
