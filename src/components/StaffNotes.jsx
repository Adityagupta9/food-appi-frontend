import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "./Sidebar";
import { useNavigate } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";
import "../style/StaffNotes.css";

const StaffNotes = () => {
  const baseURL = import.meta.env.REACT_APP_BASEURL;
  const [notes, setNotes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchNotes();
  }, []);

  // ✅ Fetch Notes (Staff can only view)
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

  return (
    <div className="staff-notes-container">
      <Sidebar />
      <div className="content">
        <div className="header">
          <h2>All Notes</h2>
          <button className="back-btn" onClick={() => navigate("/staff/orders")}>
            <IoArrowBack />
          </button>
        </div>

        {/* ✅ Render Notes */}
        <div className="notes-list">
          {Array.isArray(notes) && notes.length === 0 ? (
            <p className="no-notes">No notes available.</p>
          ) : (
            notes.map((note) => (
              <div key={note._id} className="note-item">
                <p className="note-content"><strong>{note.content}</strong></p>
                <p className="note-date">
                 {new Date(note.createdAt).toLocaleString()}
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
