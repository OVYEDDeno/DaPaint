import React, { useContext } from "react";
import { Context } from "../store/appContext";
import "../../styles/home.css";

export const Home = () => {
  const { store, actions } = useContext(Context);

  return (
    <div className="home-container">
      <header className="top-header">
        <img
          src="👊🏿"
          alt="Logo"
          className="logo"
        />
        <nav className="nav-links">
          <ul>
            <li>
              <a href="#">Blog</a>
            </li>
            <li>
              <a href="#">Jobs</a>
            </li>
          </ul>
        </nav>
        <button className="cta-button">Clock In</button>
      </header>

      <main className="main-body">
        <h1 className="tagline">Welcome to OVYED Labs</h1>
        <button className="cta-button">Clock In</button>
      </main>

      <footer className="footer">
        <div className="footer-links">
          <ul>
            <li><a href="#">Privacy</a></li>
            <li><a href="#">Terms</a></li>
            <li><a href="#">FAQs</a></li>
          </ul>
        </div>
        <div className="social-media-logos">
          <img src="path/to/tiktok-logo.png" alt="TikTok" />
          <img src="path/to/instagram-logo.png" alt="Instagram" />
          <img src="path/to/twitter-logo.png" alt="Twitter" />
        </div>
        <div className="footer-bottom">
          <p>&copy; 2024 OVYED Labs</p>
        </div>
      </footer>
    </div>
  );
};