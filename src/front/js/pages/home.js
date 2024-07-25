// Import React and useContext from the react library
import React, { useContext } from "react";

// Import the Context from the appContext file
import { Context } from "../store/appContext";

// // Import the logo image
// import logoImageUrl from "../../img/logo.png";

// Import the styles for the home page
import "../../styles/home.css";

// Define the Home component
export const Home = () => {
  // Use the useContext hook to access the store and actions from the Context
  const { store, actions } = useContext(Context);

  // Return the JSX for the home page
  return (
    // Container element for the home page
    <div className="home-container">
      {/* Top Header */}
      <header className="top-header">
        {/* Navigation links */}
        <nav className="nav-links">
          <ul>
            {/* Link to the blog page */}
            <li>
              <a href="#">Blog</a>
            </li>
            {/* Link to the jobs page */}
            <li>
              <a href="#">Jobs</a>
            </li>
          </ul>
        </nav>
        {/* Logo */}
        <img
          src="https://static-assets.clubhouseapi.com/static/img/img_hand_wave.3454a59f2b06.svg"
          alt="Logo"
          style={{ width: "78px", height: "64px" }}
        />
        {/* Clock In button */}
        <button className="clock-in-btn">Clock In</button>
      </header>

      {/* Main Body */}
      <main className="main-body">
        {/* Tagline */}
        <h1 className="tagline">Welcome to OVYED Labs</h1>
        {/* Clock In button */}
        <button className="clock-in-btn">Clock In</button>
      </main>

      {/* Footer */}
      <footer className="footer">
        {/* Links */}
        <div className="footer-links">
          <ul>
            {/* Link to the privacy page */}
            <li>
              <a href="#">Privacy</a>
            </li>
            {/* Link to the terms page */}
            <li>
              <a href="#">Terms</a>
            </li>
            {/* Link to the FAQs page */}
            <li>
              <a href="#">FAQs</a>
            </li>
          </ul>
        </div>
        {/* Social media logos */}
        <div className="social-media-logos">
          {/* TikTok logo */}
          <img src="tiktok-logo.png" alt="TikTok" />
          {/* Instagram logo */}
          <img src="instagram-logo.png" alt="Instagram" />
          {/* Twitter logo */}
          <img src="twitter-logo.png" alt="Twitter" />
        </div>
        {/* Copyright information */}
        <div className="copyright-info">
          &copy; 2024 OVYED Labs
        </div>
      </footer>
    </div>
  );
};