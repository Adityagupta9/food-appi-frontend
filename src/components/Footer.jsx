import React from "react";
import "../style/Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <p>© {new Date().getFullYear()} Food Appi. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
