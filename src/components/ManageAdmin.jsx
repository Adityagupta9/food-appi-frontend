import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "./Sidebar";
import "../style/ManageAdmin.css";
import { AiOutlineUserDelete } from "react-icons/ai";
import { FaEdit } from "react-icons/fa";
import { useNavigate } from "react-router-dom";


const ManageAdmin = () => {
  const baseURL = import.meta.env.REACT_APP_BASEURL;
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [admins, setAdmins] = useState([]);
  const [editingAdmin, setEditingAdmin] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchUserData();
    fetchAdmins();
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
        window.location.href = "/dashboard";
      }
    } catch (error) {
      console.error("Error fetching user", error);
    }
  };

  const fetchAdmins = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${baseURL}/admin/admins`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAdmins(response.data);
    } catch (error) {
      console.error("Error fetching admins", error);
    }
  };

  const handleEdit = (admin) => {
    setEditingAdmin(admin);
    setFormData({
      name: admin.name,
      email: admin.email,
      phone: admin.phone,
      password: "",
    });
    setShowModal(true);
  };

  const handleUpdateAdmin = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${baseURL}/admin/update-admin/${editingAdmin._id}`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setMessage("Admin updated successfully.");
      setShowModal(false);
      setEditingAdmin(null);
      fetchAdmins();
    } catch (error) {
      setMessage("Error updating admin.");
      console.error("Error updating admin", error);
    }
  };

  const handleDeleteAdmin = async (id) => {
    if (user?._id === id) {
      setMessage("You cannot delete yourself.");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${baseURL}/admin/delete-admin/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage("Admin deleted successfully.");
      fetchAdmins();
    } catch (error) {
      setMessage("Error deleting admin.");
      console.error("Error deleting admin", error);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="manage-admin-container">
      <Sidebar user={user} handleLogout={handleLogout} />

      <div className="content">
        <h2>Manage Admins</h2>
        {message && <p className="message">{message}</p>}

        <div className="admin-cards">
          {admins.map((admin) => (
            <div className="admin-card" key={admin._id}>
              <h3>{admin.name}</h3>
              <p><strong>Email:</strong> {admin.email}</p>
              <p><strong>Phone:</strong> {admin.phone}</p>
              <div className="card-actions">
                <button className="edit-btn" onClick={() => handleEdit(admin)}>
                  <FaEdit size={18} /> Edit
                </button>
                {user?._id !== admin._id && (
                  <button className="delete-btn" onClick={() => handleDeleteAdmin(admin._id)}>
                    <AiOutlineUserDelete size={20} /> Delete
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {showModal && (
          <div className="modal">
            <div className="modal-content">
              <span className="close-btn" onClick={() => setShowModal(false)}>&times;</span>
              <h3>Edit Admin: {editingAdmin.name}</h3>
              <form className="edit-admin-form" onSubmit={handleUpdateAdmin}>
                <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleInputChange} required />
                <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleInputChange} required />
                <input type="tel" name="phone" placeholder="Phone" value={formData.phone} onChange={handleInputChange} required />
                <input type="password" name="password" placeholder="New Password (optional)" value={formData.password} onChange={handleInputChange} />
                <button type="submit">Update Admin</button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageAdmin;
