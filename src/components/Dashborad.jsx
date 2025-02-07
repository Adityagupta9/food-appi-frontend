import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Doughnut } from "react-chartjs-2";
import { IoMdPerson } from "react-icons/io";
import { IoFastFoodSharp } from "react-icons/io5";
import { IoIosPricetags } from "react-icons/io";
import { RiLoader4Line } from "react-icons/ri";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import Sidebar from "./Sidebar";
import "../style/Dashboard.css";
import Footer from "./Footer";

ChartJS.register(ArcElement, Tooltip, Legend);

const Dashboard = () => {
  const baseURL = import.meta.env.REACT_APP_BASEURL;
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [staffCount, setStaffCount] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/");
        return;
      }
      try {
        const response = await axios.get(`${baseURL}/auth/user`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(response.data);
      } catch (error) {
        console.error("Error fetching user", error);
        navigate("/");
      }
    };

    const fetchOrders = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get(`${baseURL}/admin/orders`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(response.data);
        const total = response.data
          .filter(order => order.status === "Completed")
          .reduce((sum, order) => sum + order.totalAmount, 0);
        setTotalAmount(total);
      } catch (error) {
        console.error("Error fetching orders", error);
      }
    };

    const fetchStaffCount = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get(`${baseURL}/admin/staff`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStaffCount(response.data.length);
      } catch (error) {
        console.error("Error fetching staff", error);
      }
    };

    fetchUserData();
    fetchOrders();
    if (user?.role === "admin") fetchStaffCount();
  }, [navigate, user?.role]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const handleDeleteAllOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${baseURL}/admin/delete-all-order`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("All orders have been deleted successfully.");
      setOrders([]);
    } catch (error) {
      console.error("Error deleting all orders", error);
      alert("Failed to delete orders. Please try again.");
    } finally {
      setShowModal(false);
    }
  };

  const chartData = {
    labels: ["Pending", "Processing", "Completed", "Cancelled"],
    datasets: [
      {
        data: [
          orders.filter(order => order.status === "Pending").length,
          orders.filter(order => order.status === "Processing").length,
          orders.filter(order => order.status === "Completed").length,
          orders.filter(order => order.status === "Cancelled").length
        ],
        backgroundColor: ["#007BFF", "#00A8E8", "#87CEEB", "#D4E4F7"],
        hoverOffset: 4,
      },
    ],
  };

  return (
    <div className="dashboard-container">
      <Sidebar user={user} handleLogout={handleLogout} />

      <div className="content">
        <h2>Welcome, {user?.name}!</h2>

        {user?.role === "admin" && (
          <div className="dashboard-content">
            <div className="admin-panel">
              <h3>Admin Overview</h3>
              <div className="admin-overview">
                <div className="chart-container">
                  <Doughnut data={chartData} />
                </div>
                <div className="stats">
                  <p className="staff-count"><strong>TOTAL STAFF:</strong> {staffCount}</p>
                  <p><strong>Total Revenue from Completed Orders:</strong> ₹{totalAmount}</p>
                </div>
              </div>
              <button className="delete-all-btn" onClick={() => setShowModal(true)}>
                Delete All Orders
              </button>
            </div>

            <div className="table-container">
              <h3>Orders</h3>
              <table>
                <thead>
                  <tr>
                    <th><span><IoMdPerson /></span> Customer</th>
                    <th><span><IoFastFoodSharp /></span> Items</th>
                    <th><span><IoIosPricetags /></span> Total</th>
                    <th><span><RiLoader4Line /></span> Status</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map(order => (
                    <tr key={order._id}>
                      <td>{order.customerName}</td>
                      <td>{order.items.map(item => item.name).join(", ")}</td>
                      <td>₹{order.totalAmount}</td>
                      <td className={`status-${order.status.toLowerCase()}`}>{order.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Modal for Confirmation */}
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>Are you sure you want to delete all orders?</h3>
            <div className="modal-actions">
              <button className="confirm-btn" onClick={handleDeleteAllOrders}>Yes, Delete</button>
              <button className="cancel-btn" onClick={() => setShowModal(false)}>No, Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
