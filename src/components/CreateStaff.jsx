import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "./Sidebar"; // Import Sidebar Component
import "../style/CreateStaff.css"; // Import the styles for the CreateStaff page
import { useNavigate } from "react-router-dom";

const CreateStaff = () => {
  const navigate = useNavigate();
  const baseURL = import.meta.env.REACT_APP_BASEURL;
  const [user, setUser] = useState(null);
  const [newStaff, setNewStaff] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });
  const [message, setMessage] = useState("");

  useEffect(() => {
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
    fetchUserData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  const handleInputChange = (e) => {
    setNewStaff({ ...newStaff, [e.target.name]: e.target.value });
  };

  const handleAddStaff = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.post(`${baseURL}/admin/create-staff`, newStaff, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage("Staff created successfully!");
      setNewStaff({ name: "", email: "", phone: "", password: "" }); // Clear form
    } catch (error) {
      setMessage("Error creating staff. Try again.");
      console.error("Error creating staff", error);
    }
  };

  return (
    <div className="create-staff-container">
      {/* Sidebar Component */}
      <Sidebar user={user} handleLogout={handleLogout} />

      <div className="create-staff-box">
        <h2>Create Staff</h2>
        {message && <p className="message">{message}</p>}

        {/* Add Staff Form */}
        <form className="add-staff-form" onSubmit={handleAddStaff}>
          <div className="input-group">
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={newStaff.name}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="input-group">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={newStaff.email}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="input-group">
            <input
              type="tel"
              name="phone"
              placeholder="Phone"
              value={newStaff.phone}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="input-group">
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={newStaff.password}
              onChange={handleInputChange}
              required
            />
          </div>

          <button type="submit" className="create-staff-btn">
            Add Staff
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateStaff;
