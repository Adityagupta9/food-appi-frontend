import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "./Sidebar";
import { useNavigate } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";
import { CiEdit } from "react-icons/ci";
import { RiDeleteBackFill } from "react-icons/ri";
import "../style/Notes.css";

const Notes = () => {
  const baseURL = import.meta.env.REACT_APP_BASEURL;
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState("");
  const [editingNote, setEditingNote] = useState(null);
  const [updatedContent, setUpdatedContent] = useState("");
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${baseURL}/note/view`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setNotes(response.data.notes || []);
    } catch (error) {
      console.error("Error fetching notes:", error);
      setNotes([]);
    }
  };

  const handleCreateNote = async () => {
    if (!newNote.trim()) return;
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${baseURL}/note/create`,
        { content: newNote },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNewNote("");
      fetchNotes();
    } catch (error) {
      console.error("Error creating note:", error);
    }
  };

  const startEditing = (note) => {
    setEditingNote(note._id);
    setUpdatedContent(note.content);
  };

  const handleEditNote = async (noteId) => {
    if (!updatedContent.trim()) return;
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${baseURL}/note/edit`,
        { noteId, content: updatedContent },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEditingNote(null);
      fetchNotes();
    } catch (error) {
      console.error("Error editing note:", error);
    }
  };
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };
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
  const handleDeleteNote = async (noteId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${baseURL}/note/delete`, {
        headers: { Authorization: `Bearer ${token}` },
        data: { noteId },
      });
      fetchNotes();
    } catch (error) {
      console.error("Error deleting note:", error);
    }
  };

  return (
    <div className="admin-notes-container">
      <Sidebar user={user} handleLogout={handleLogout} />
      <div className="content">
        <div className="header">
          <button className="back-btn" onClick={() => navigate("/dashboard")}>
            <IoArrowBack />  
          </button>
          <h2>Manage Notes</h2>
        </div>

        <div className="note-create">
          <textarea
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            placeholder="Write a new note..."
          />
          <button className="add-btn" onClick={handleCreateNote}>+ Add Note</button>
        </div>

        <div className="notes-list">
          {notes.length === 0 ? (
            <p className="no-notes">No notes available.</p>
          ) : (
            notes.map((note) => (
              <div key={note._id} className="note-item">
                {editingNote === note._id ? (
                  <>
                    <textarea
                      value={updatedContent}
                      onChange={(e) => setUpdatedContent(e.target.value)}
                    />
                    <div className="note-actions">
                      <button className="save-btn" onClick={() => handleEditNote(note._id)}>Save</button>
                      <button className="cancel-btn" onClick={() => setEditingNote(null)}>Cancel</button>
                    </div>
                  </>
                ) : (
                  <>
                    <p>{note.content}</p>
                    <div className="note-actions">
                      <button className="edit-btn" onClick={() => startEditing(note)}><CiEdit/></button>
                      <button className="delete-btn" onClick={() => handleDeleteNote(note._id)}><RiDeleteBackFill/></button>
                    </div>
                  </>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Notes;
