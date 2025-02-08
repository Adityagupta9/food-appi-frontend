import React from "react";
import "../style/Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <p>© {new Date().getFullYear()} FoodAppi. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
