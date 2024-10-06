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
            <li><a href="/about">About DaPaint</a></li>
            <li><a href="#">Jobs</a></li>
          </ul>
        </nav>
        <Link to="/auth">
          <button className="cta-button">Clock In</button>
        </Link>
      </header> */}
      <main className="main-body">
        <div className="flex-container">
          <img
            src="https://res.cloudinary.com/dj2umay9c/image/upload/v1728188124/CLOCK_IN_n65pv1.png"
            alt="DaPaintApp"
            className="left-image"
          />
          <div className="text-container">
            <h1 className="tagline">
              Welcome to DaPaint. Where Legends Are Made.
            </h1>
            <h5>
              <strong>
                WARNING: This is NOT for everyone. If you can’t handle the heat,
                stay out. Only the strongest will survive.
              </strong>
            </h5>
            <p>
              <strong>
                This isn’t another app. It’s the ultimate 1-on-1 sports
                challenges.
              </strong>{" "}
              Sweat, grit, and glory. Think you’ve got what it takes? Prove it.
            </p>
            <p>
              Join early with an exclusive invite from a current user—we can't
              wait for you to enter DaPaint!
            </p>
            <p>
              <strong>30 win streaks = $1 MILLION.</strong> Real competition.
              Real rewards.
            </p>
            <p>
              <strong>Join Now</strong>—victory awaits.
            </p>

            <div className="d-flex cta-button-container">
              <Link to="/auth">
                <button className="btn-secondary w-5000">
                  Join Now!
                  <img
                    src="https://icons.iconarchive.com/icons/microsoft/fluentui-emoji-3d/512/Oncoming-Fist-3d-Medium-Dark-icon.png"
                    alt="DaPaintLogo"
                    className="DaPaintLogo1"
                  />
                </button>
              </Link>
            </div>
          </div>
        </div>
      </main>

      <footer className="footer">
        <div className="footer-column">
          <ul>
            <li>
              <a href="/privacy" target="_blank">
                Privacy
              </a>
            </li>
            <li>
              <a href="/terms" target="_blank">
                Terms
              </a>
            </li>
          </ul>
        </div>
        <div className="footer-column social-media-logos">
          <a href="https://discord.gg/xFHEHkB8ag" target="_blank">
            <img
              src="https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/discord-white-icon.png"
              alt="Discord"
            />
          </a>
          <a href="https://tiktok.com" target="_blank">
            <img
              src="https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/tiktok-white-icon.png"
              alt="TikTok"
            />
          </a>
          <a href="https://x.com" target="_blank">
            <img
              src="https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/x-social-media-white-icon.png"
              alt="Twitter"
            />
          </a>
          <a href="https://instagram.com" target="_blank">
            <img
              src="https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/instagram-white-icon.png"
              alt="Instagram"
            />
          </a>
          <div className="footer-column">
            <p>&copy; {new Date().getFullYear()} OVYED Labs</p>
          </div>
        </div>
      </footer>
    </div>
  );
};
