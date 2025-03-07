import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "./Sidebar";
import { useNavigate } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";
import "../style/StaffNotes.css";

const StaffNotes = () => {
  const baseURL = import.meta.env.REACT_APP_BASEURL;
  const [notes, setNotes] = useState([]);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserData();
    fetchNotes();
  }, []);

  // ✅ Fetch User Data
  const fetchUserData = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const response = await axios.get(`${baseURL}/auth/user`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(response.data);

      // ✅ Allow only "staff" to access this page
      if (response.data.role !== "staff") {
        window.location.href = "/dashboard"; 
      }
    } catch (error) {
      console.error("Error fetching user", error);
    }
  };

  // ✅ Fetch Notes
  const fetchNotes = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${baseURL}/note/view`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data && Array.isArray(response.data.notes)) {
        setNotes(response.data.notes);
      } else {
        setNotes([]);
      }
    } catch (error) {
      console.error("Error fetching notes:", error);
      setNotes([]);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="staff-notes-container">
      <Sidebar user={user} handleLogout={handleLogout} />
      
      <div className="content">
        <div className="header">
          <h2>All Notes</h2>
          <button className="back-btn" onClick={() => navigate("/staff/orders")}>
            <IoArrowBack /> Back
          </button>
        </div>

        {/* ✅ Render Notes */}
        <div className="notes-list">
          {notes.length === 0 ? (
            <p className="no-notes">No notes available.</p>
          ) : (
            notes.map((note) => (
              <div key={note._id} className="note-item">
                <p className="note-content"><strong>{note.content}</strong></p>
                <p className="note-date">
                  {note.createdAt ? new Date(note.createdAt).toLocaleString() : "Unknown Date"}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default StaffNotes;
