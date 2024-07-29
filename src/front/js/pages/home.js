import React, { useContext } from "react";
import { Context } from "../store/appContext";
import "../../styles/home.css";
import { Link } from "react-router-dom";

export const Home = () => {
  return (
    <div className="home-container">
      <header className="top-header">
        <a href="https://example.com">
          <img
            src="https://static-00.iconduck.com/assets.00/oncoming-fist-medium-dark-emoji-2048x1797-dmd9wvcy.png"
            alt="Logo"
            className="logo"
          />
        </a>

        <nav className="nav-links">
          <ul>
            <li><a href="#">Blog</a></li>
            <li><a href="#">Jobs</a></li>
          </ul>
        </nav>

        <Link to="/auth">
          <button className="cta-button">Clock In</button>
        </Link>
      </header>

      <main className="main-body">
        <h1 className="tagline">Defy Your Limits</h1>
        <Link to="/profile">
          <button className="cta-button">Clock In</button>
        </Link>
      </main>

      <footer className="footer">
        <div className="footer-column">
          <ul>
            <li><a href="#">Privacy</a></li>
            <li><a href="#">Terms</a></li>
            <li><a href="#">FAQs</a></li>
          </ul>
        </div>
        <div className="footer-column social-media-logos">
          <a href="https://tiktok.com">
            <img src="https://static-00.iconduck.com/assets.00/tiktok-icon-445x512-xaxcw9b8.png" alt="TikTok" />
          </a>
          <a href="https://twitter.com">
            <img src="https://static-00.iconduck.com/assets.00/twitter-icon-512x417-ypy0580u.png" alt="Twitter" />
          </a>
          <a href="https://instagram.com">
            <img src="https://static-00.iconduck.com/assets.00/instagram-icon-512x512-ek33t112.png" alt="Instagram" />
          </a>
        </div>

        <div className="footer-column">
          <p>&copy; 2024 OVYED Labs</p>
        </div>
      </footer>
    </div>
  );
};
