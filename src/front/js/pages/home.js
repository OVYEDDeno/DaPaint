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
              Welcome to DaPaint. <h5>Where Legends Are Made.</h5>
            </h1>
            <p>
              We're still launching, but you can jump in early with an exclusive
              invite from a current user! We can't wait for you to Clock In
              DaPaint! Think you’ve got what it takes? Prove it.
            </p>
            <p>
              This isn’t another app. It’s the ultimate 1-on-1 sports
              challenges. Sweat, grit, and glory. Ain’t no special treatment you wanna be a winner then do what it takes to WIN!
            </p>

            <p>30 win streaks = $1 MILLION. Real competition. Real reward.</p>
            <strong>
              <p style={{ color: "red" }}>
                WARNING: DaPaint ISN’T FOR EVERYONE…WINNERS ONLY!
              </p>
            </strong>
            <div className="d-flex cta-button-container">
              <Link to="/auth">
                <button className="btn-secondary w-5000">
                  Join Now!
                  <img
                    src="https://icons.iconarchive.com/icons/microsoft/fluentui-emoji-3d/512/Oncoming-Fist-3d-Medium-Dark-icon.png"
                    alt="DaPaintLogo"
                    className="DaPaintLogo1"
                  />{" "}
                  victory awaits.
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
