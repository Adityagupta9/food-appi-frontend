import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "./Sidebar"; // Import Sidebar Component
import "../style/ManageStaff.css";
import { MdDelete } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import { useNavigate } from "react-router-dom";


const ManageStaff = () => {
  const baseURL = import.meta.env.REACT_APP_BASEURL;
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [staff, setStaff] = useState([]);
  const [message, setMessage] = useState("");
  const [editingStaff, setEditingStaff] = useState(null); // To manage editing staff
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });
  const [showModal, setShowModal] = useState(false); // To toggle modal visibility
  const [showDeleteModal, setShowDeleteModal] = useState(false); // Confirmation modal for delete
  const [staffToDelete, setStaffToDelete] = useState(null); // Store staff id to delete

  useEffect(() => {
    fetchUserData();
    fetchStaff();
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

  const fetchStaff = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${baseURL}/admin/staff`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStaff(response.data);
    } catch (error) {
      console.error("Error fetching staff", error);
    }
  };

  const handleEdit = (staffMember) => {
    setEditingStaff(staffMember);
    setFormData({
      name: staffMember.name,
      email: staffMember.email,
      phone: staffMember.phone,
      password: "", // No need to edit password initially
    });
    setShowModal(true); // Show modal
  };

  const handleUpdateStaff = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${baseURL}/admin/update-staff/${editingStaff._id}`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setMessage("Staff updated successfully.");
      setShowModal(false); // Close modal
      setEditingStaff(null); // Reset editing mode
      fetchStaff(); // Refresh staff list
    } catch (error) {
      setMessage("Error updating staff.");
      console.error("Error updating staff", error);
    }
  };

  const handleDeleteStaff = (id) => {
    setStaffToDelete(id);
    setShowDeleteModal(true); // Show confirmation modal
  };

  const confirmDeleteStaff = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${baseURL}/admin/delete-staff/${staffToDelete}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage("Staff deleted successfully.");
      setShowDeleteModal(false); // Close confirmation modal
      fetchStaff(); // Refresh staff list after deletion
    } catch (error) {
      setMessage("Error deleting staff.");
      console.error("Error deleting staff", error);
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
    <div className="dashboard-container">
      {/* Sidebar Component */}
      <Sidebar user={user} handleLogout={handleLogout} />

      <div className="content">
        <h2>Manage Staff</h2>
        {message && <p className="message">{message}</p>}

        {/* Staff List as Cards */}
        <div className="staff-cards">
          {staff.map((member) => (
            <div className="staff-card" key={member._id}>
              <div className="card-header">
                <h4>{member.name}</h4>
                <p><strong>Email:</strong> {member.email}</p>
                <p><strong>Phone:</strong> {member.phone}</p>
                <div className="card-actions">
                  <button className="edit-btn" onClick={() => handleEdit(member)}>
                    <FaEdit size={18} /> Update
                  </button>
                  <button className="delete-btn" onClick={() => handleDeleteStaff(member._id)}>
                    <span><MdDelete size={15} /></span> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Edit Staff Modal */}
        {showModal && (
          <div className="modal">
            <div className="modal-content">
              <span className="close-btn" onClick={() => setShowModal(false)}>
                &times;
              </span>
              <h3>Edit Staff: {editingStaff.name}</h3>
              <form className="edit-staff-form" onSubmit={handleUpdateStaff}>
                <input
                  type="text"
                  name="name"
                  placeholder="Name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                />
                <input
                  type="password"
                  name="password"
                  placeholder="New Password (optional)"
                  value={formData.password}
                  onChange={handleInputChange}
                />
                <button type="submit">Update Staff</button>
              </form>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="modal">
            <div className="modal-content">
              <span className="close-btn" onClick={() => setShowDeleteModal(false)}>
                &times;
              </span>
              <h3>Are you sure you want to delete this staff member?</h3>
              <button onClick={confirmDeleteStaff}>Yes, Delete</button>
              <button onClick={() => setShowDeleteModal(false)}>Cancel</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageStaff;
