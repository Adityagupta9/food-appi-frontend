import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "./Sidebar"; // Import Sidebar Component
import "../style/CreateUser.css";
import { useNavigate } from "react-router-dom";

const CreateUser = () => {
  const navigate = useNavigate();
  const baseURL = import.meta.env.REACT_APP_BASEURL;
  const [user, setUser] = useState(null);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "staff", // Default role
  });
  const [message, setMessage] = useState("");

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
      if (response.data.role !== "admin") {
        window.location.href = "/dashboard"; // Redirect non-admin users
      }
    } catch (error) {
      console.error("Error fetching user", error);
    }
  };

  const handleInputChange = (e) => {
    setNewUser({ ...newUser, [e.target.name]: e.target.value });
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.post(`${baseURL}/auth/register`, newUser, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage("User created successfully!");
      setNewUser({ name: "", email: "", phone: "", password: "", role: "staff" });
    } catch (error) {
      setMessage("Error creating user. Try again.");
      console.error("Error creating user", error);
    }
  };
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="create-user-container">
      {/* Sidebar Component */}
      <Sidebar user={user} handleLogout={handleLogout} />

      <div className="create-user-box">
        <h2>Create User</h2>
        {message && <p className="message">{message}</p>}

        {/* Create User Form */}
        <form className="create-user-form" onSubmit={handleCreateUser}>
          <div className="input-group">
            <input type="text" name="name" placeholder="Name" value={newUser.name} onChange={handleInputChange} required />
          </div>

          <div className="input-group">
            <input type="email" name="email" placeholder="Email" value={newUser.email} onChange={handleInputChange} required />
          </div>

          <div className="input-group">
            <input type="tel" name="phone" placeholder="Phone" value={newUser.phone} onChange={handleInputChange} required />
          </div>

          <div className="input-group">
            <input type="password" name="password" placeholder="Password" value={newUser.password} onChange={handleInputChange} required />
          </div>

          {/* Role Selection */}
          <div className="input-group">
            <select name="role" value={newUser.role} onChange={handleInputChange}>
              <option value="staff">Staff</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <button type="submit" className="create-user-btn">
            Create User
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateUser;
