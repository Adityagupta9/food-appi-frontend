import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "./Sidebar";
import "../style/StaffDashboard.css";
import { useNavigate } from "react-router-dom";

const StaffDashboard = () => {
  const baseURL = import.meta.env.REACT_APP_BASEURL;

  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchUserData();
    fetchOrders();
  }, []);

  const fetchUserData = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const response = await axios.get(`${baseURL}/auth/user`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(response.data);
      if (response.data.role !== "staff") {
        window.location.href = "/dashboard";
      }
    } catch (error) {
      console.error("Error fetching user", error);
    }
  };

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${baseURL}/staff/orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      const sortedOrders = response.data.sort((a, b) => {
        const statusOrder = { Pending: 1, Processing: 2, Completed: 3, Cancelled: 4 };
        return statusOrder[a.status] - statusOrder[b.status];
      });
  
      setOrders(sortedOrders);
    } catch (error) {
      console.error("Error fetching orders", error);
    }
  };
  

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${baseURL}/staff/update-order/${orderId}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchOrders();
    } catch (error) {
      console.error("Error updating order status", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  return (
    <div className="staff-dashboard">
      <Sidebar user={user} handleLogout={handleLogout} />
      <div className="content">
        <h2>Staff Dashboard - Manage Orders</h2>
        <div className="order-cards">
          {orders.map((order) => (
            <div className="order-card" key={order._id}>
              <h3>{order.customerName}</h3>
              <p><strong>Items:</strong> {order.items.map((item) => `${item.name} x${item.quantity}`).join(", ")}</p>
              <p><strong>Total Amount:</strong> ${order.totalAmount}</p>
              <p><strong>Status:</strong> <span className={`status ${order.status.toLowerCase()}`}>{order.status}</span></p>
              <p><strong>Created:</strong> {new Date(order.createdAt).toLocaleString()}</p>
              
              {order.status !== "Completed" && order.status !== "Cancelled" && (
                <select
                  onChange={(e) => handleStatusChange(order._id, e.target.value)}
                  value={order.status}
                >
                  <option value="Pending">Pending</option>
                  <option value="Processing">Processing</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StaffDashboard;
