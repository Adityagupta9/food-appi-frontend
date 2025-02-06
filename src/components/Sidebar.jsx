import React, { useState } from "react";
import { Link } from "react-router-dom";
import { CgMenuLeft } from "react-icons/cg";
import { IoPersonSharp } from "react-icons/io5";
import { IoCloseSharp } from "react-icons/io5";
import { RiLogoutBoxLine } from "react-icons/ri";
import { MdOutlineAdminPanelSettings } from "react-icons/md";
import { IoPersonCircleOutline } from "react-icons/io5";
import "../style/Sidebar.css";

const Sidebar = ({ user, handleLogout }) => {
  const baseURL = process.env.REACT_APP_BASEURL;
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      <button className="menu-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>
        {sidebarOpen ? <IoCloseSharp size={30} /> : <CgMenuLeft size={30} />}
      </button>

      <div className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <h2>Food Appi</h2>
        <p>
          {user?.role === "admin" ? (
            <>
              <MdOutlineAdminPanelSettings /> Admin Panel
            </>
          ) : (
            <>
              <IoPersonCircleOutline /> Staff Panel
            </>
          )}
        </p>

        <nav>
          <ul>
            {user?.role === "admin" ? (
              <>
                <li><Link to="/dashboard">Dashboard</Link></li>
                <li><Link to="/create-order">Create Order</Link></li>
                <li><Link to="/admin/staff-management">Create Staff</Link></li>
                <li><Link to="/admin/manage-staff">Manage Staff</Link></li>
                <li><Link to="/admin/create-user">Create User</Link></li>
                <li><Link to="/admin/manage-admin">Manage Admins</Link></li>
              </>
            ) : (
              <>
                <li><Link to="/staff/orders">Orders</Link></li>
                <li><Link to="/staff/profile"><IoPersonSharp/>Your Account</Link></li>
              </>
            )}
          </ul>
        </nav>

        <button className="logout-btn" onClick={handleLogout}>
          <span><RiLogoutBoxLine /></span> Logout
        </button>
      </div>
    </>
  );
};

export default Sidebar;
