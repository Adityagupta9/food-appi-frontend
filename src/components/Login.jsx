import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Spinner from "./Spinner";
import "../style/Login.css";
import { LuMail } from "react-icons/lu";
import { MdPassword } from "react-icons/md";
import Footer from "./Footer";
import { IoPerson } from "react-icons/io5";
import ReCAPTCHA from "react-google-recaptcha"; // ✅ Import reCAPTCHA

const Login = () => {
  const baseURL = import.meta.env.REACT_APP_BASEURL;
  const reCaptchaKey = import.meta.env.REACT_APP_RECAPTCHA_SITE_KEY;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [captchaValue, setCaptchaValue] = useState(null); // ✅ State for CAPTCHA
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    if (!captchaValue) {
      setError("Please complete the CAPTCHA");
      setLoading(false);
      return;
    }
  
    const loginData = {
      email,
      password,
      recaptchaToken: captchaValue, // ✅ Ensure this matches backend field name
    };
  
  
    try {
      const response = await axios.post(`${baseURL}/auth/login`, loginData);
      localStorage.setItem("token", response.data.token);
  
      if (response.data.role === "admin") {
        navigate("/dashboard");
      } else {
        navigate("/staff/orders");
      }
    } catch (error) {
      console.error("❌ Login error:", error.response?.data || error.message);
      setError(error.response?.data?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="login-container">
      <div className="login-box">
        <h2><span><IoPerson/></span> Login to Food Appi</h2>
        {error && <div className="error-message">{error}</div>}

        {loading ? <Spinner /> : (
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label htmlFor="email"><span><LuMail/></span> Email</label>
              <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="input-group">
              <label htmlFor="password"><span><MdPassword/></span> Password</label>
              <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>

            {/* ✅ Google reCAPTCHA */}
            <ReCAPTCHA
              sitekey={reCaptchaKey} // ✅ Use curly braces
              onChange={(value) => setCaptchaValue(value)}
            />


            <button type="submit" className="login-btn">Login</button>
          </form>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Login;
