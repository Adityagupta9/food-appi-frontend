import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Spinner from "./Spinner"; // ✅ Import Spinner Component
import "../style/Login.css";
import { LuMail } from "react-icons/lu";
import { MdPassword } from "react-icons/md";
import Footer from "./Footer";
import Logo from "../img/logo.png";
import { IoPerson } from "react-icons/io5";

const Login = () => {
  const baseURL = import.meta.env.REACT_APP_BASEURL;  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // ✅ State for Loading
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // ✅ Show Spinner

    try {
      const response = await axios.post(`${baseURL}/auth/login`, { email, password });
      localStorage.setItem("token", response.data.token);

      if (response.data.role === "admin") {
        navigate("/dashboard");
      } else {
        navigate("/staff/orders");
      }
    } catch (error) {
      setError("Invalid email or password");
      console.log(error);
    } finally {
      setLoading(false); // ✅ Hide Spinner
    }
  };

  return (
    <div className="login-container">
      <img className="logo-img" src={Logo} alt="" />
      <div className="login-box">
        <h2><span><IoPerson/></span> Login to Food Appi</h2>
        {error && <div className="error-message">{error}</div>}

        {loading ? <Spinner /> : ( // ✅ Show Spinner Component when loading
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label htmlFor="email"><span><LuMail/></span> Email</label>
              <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="input-group">
              <label htmlFor="password"><span><MdPassword/></span> Password</label>
              <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <button type="submit" className="login-btn">Login</button>
          </form>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Login;
