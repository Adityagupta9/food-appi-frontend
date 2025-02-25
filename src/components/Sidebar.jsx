import React, { useState } from "react";
import { Link } from "react-router-dom";
import { CgMenuLeft } from "react-icons/cg";
import { IoPersonCircleOutline, IoCloseSharp } from "react-icons/io5";
import { RiLogoutBoxLine } from "react-icons/ri";
import { AiOutlineLineChart } from "react-icons/ai";
import { MdOutlineAdminPanelSettings, MdExpandMore, MdExpandLess } from "react-icons/md";
import "../style/Sidebar.css";

const Sidebar = ({ user, handleLogout }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);
  const [staffOpen, setStaffOpen] = useState(false);
  const [ordersOpen, setOrdersOpen] = useState(false);

  return (
    <>
      {/* Menu Button */}
      <button className="menu-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>
        {sidebarOpen ? <IoCloseSharp size={30} /> : <CgMenuLeft size={30} />}
      </button>

      {/* Sidebar */}
      <div className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <h2>FoodAppi</h2>
        
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

        {/* Navigation Menu */}
        <nav>
          <ul>
            <li>
              <Link to="/dashboard"><span id="slidebar-dashboard-icon"><AiOutlineLineChart /></span> Dashboard</Link>
            </li>

            {/* Admin Section */}
            <li onClick={() => setAdminOpen(!adminOpen)} className="expandable">
              Admin {adminOpen ? <MdExpandLess /> : <MdExpandMore />}
            </li>
            <ul className={`submenu ${adminOpen ? "open" : ""}`}>
              <li><Link to="/admin/create-user">Create Admin</Link></li>
              <li><Link to="/admin/manage-admin">Manage Admins</Link></li>
            </ul>

            {/* Staff Section */}
            <li onClick={() => setStaffOpen(!staffOpen)} className="expandable">
              Staff {staffOpen ? <MdExpandLess /> : <MdExpandMore />}
            </li>
            <ul className={`submenu ${staffOpen ? "open" : ""}`}>
              <li><Link to="/admin/staff-management">Create Staff</Link></li>
              <li><Link to="/admin/manage-staff">Manage Staff</Link></li>
            </ul>

            {/* Orders Section */}
            <li onClick={() => setOrdersOpen(!ordersOpen)} className="expandable">
              Orders {ordersOpen ? <MdExpandLess /> : <MdExpandMore />}
            </li>
            <ul className={`submenu ${ordersOpen ? "open" : ""}`}>
              <li><Link to="/create-order">Create Order</Link></li>
            </ul>
          </ul>
        </nav>

        {/* Logout Button */}
        <button className="logout-btn" onClick={handleLogout}>
          <span><RiLogoutBoxLine /></span> Logout
        </button>
      </div>
    </>
  );
};

export default Sidebar;
