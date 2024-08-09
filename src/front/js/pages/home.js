import React, { useContext } from "react";
import { Context } from "../store/appContext";
import "../../styles/home.css";
import { Link } from "react-router-dom";

export const Home = () => {
  return (
    <div className="home-container">
      {/* <header className="top-header">   
        <nav className="nav-links">
          <ul>
            <li><a href="/about">About Diddy</a></li>
            <li><a href="#">Jobs</a></li>
          </ul>
        </nav>
        <Link to="/auth">
          <button className="cta-button">Clock In</button>
        </Link>
      </header> */}

      <main className="main-body">
        <a href="" onclick="location.reload();">
          <img
            src="https://static-00.iconduck.com/assets.00/oncoming-fist-medium-dark-emoji-2048x1797-dmd9wvcy.png"
            alt="Logo"
            className="logo"
          />
        </a>
        {/* <h1 className="tagline">Defy Your Limits</h1> */}
        <h1 className="tagline">🎉Welcome To Diddy🎉</h1> 
        <p>We're in the early stages of launching, and you can be part of the fun with an invite from a current member!</p>
        <p></p>
        <p>Sign up to see if you have friends on Diddy who can let you in. We can't wait for you to join!</p>
        <Link to="/auth">
          <button className="cta-button">Clock In</button>
        </Link>
      </main>

      <footer className="footer">
        <div className="footer-column">
          <ul>
            <li><a href="#">Guidelines</a></li>
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
          <p>&copy; {new Date().getFullYear()} OVYED Labs</p>
        </div>
      </footer>
    </div>
  );
};
