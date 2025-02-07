import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import "../style/CreateOrder.css";

const CreateOrder = () => {
  const baseURL = import.meta.env.REACT_APP_BASEURL;
  const [user, setUser] = useState(null);
  const [customerName, setCustomerName] = useState("");
  const [items, setItems] = useState([{ name: "", quantity: 1, price: 0 }]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [status, setStatus] = useState("Pending");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

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
    navigate("/");
  };

  // Add new item row
  const handleAddItem = () => {
    setItems([...items, { name: "", quantity: 1, price: 0 }]);
  };

  // Update item details
  const handleItemChange = (index, key, value) => {
    const updatedItems = [...items];
    updatedItems[index][key] = key === "quantity" || key === "price" ? Number(value) : value;
    setItems(updatedItems);

    // Auto-update total amount
    const newTotal = updatedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    setTotalAmount(newTotal);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");

      const orderData = { customerName, items, totalAmount, status };
      console.log("🔍 Sending request:", orderData);

      const response = await axios.post(
        `${baseURL}/orders/create-order`,
        orderData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log("✅ Order created:", response.data);
      setMessage("Order created successfully!");
      setCustomerName("");
      setItems([{ name: "", quantity: 1, price: 0 }]);
      setTotalAmount(0);
      setStatus("Pending");
    } catch (error) {
      console.error("❌ Error creating order:", error.response?.data || error.message);
      setMessage("Error creating order. Try again.");
    }
  };

  return (
    <div className="dashboard-container">
      <Sidebar user={user} handleLogout={handleLogout} />

      <div className="content">
        <h2>Create Order</h2>
        {message && <p className="message">{message}</p>}

        <form onSubmit={handleSubmit}>
          <label>Customer Name:</label>
          <input type="text" value={customerName} onChange={(e) => setCustomerName(e.target.value)} required />

          <label>Items:</label>
          {items.map((item, index) => (
            <div key={index} className="item-row">
              <input type="text" placeholder="Item Name" value={item.name} onChange={(e) => handleItemChange(index, "name", e.target.value)} required />
              <input 
  type="number" 
  placeholder="Quantity" 
  min="1" 
  value={item.quantity || ""}  // Ensure placeholder appears when empty
  onChange={(e) => handleItemChange(index, "quantity", e.target.value)} 
  required 
/>
<input 
  type="number" 
  placeholder="Price" 
  min="0" 
  value={item.price || ""} 
  onChange={(e) => handleItemChange(index, "price", e.target.value)} 
  required 
/>

            </div>
          ))}
          <button type="button" onClick={handleAddItem}>+ Add Item</button>

          <label>Total Amount:</label>
          <input type="number" value={totalAmount} readOnly />

          <label>Status:</label>
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="Pending">Pending</option>
            <option value="Processing">Processing</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>

          <button className="create-order-btn" type="submit">Create Order</button>
        </form>
      </div>
    </div>
  );
};

export default CreateOrder;
