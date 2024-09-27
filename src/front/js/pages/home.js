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
        <a href="" onClick={() => location.reload()}>
          <img
            src="https://icons.iconarchive.com/icons/microsoft/fluentui-emoji-3d/512/Oncoming-Fist-3d-Medium-Dark-icon.png"
            alt="DaPaintLogo"
            className="DaPaintLogo1"
          />
        </a>
        {/* <h1 className="tagline">Defy Your Limits</h1> */}
        <h1 className="tagline">Welcome To DaPaint</h1>
        <p></p>
        <h5>
          Hey, we're still launching, but you can jump in with an exclusive
          invite from a current user!
        </h5>
        <p></p>
        <p>
          Sign up to see if you have friends on DaPaint who can let you in. We
          can't wait for you to join!
        </p>
        <div className="d-flex cta-button-container">
        <Link to="/auth">
          <button className="btn-secondary w-5000">Join Now!</button>
        </Link>
        </div>
      </main>

      <footer className="footer">
        <div className="footer-column">
          <ul>
            <li>
              <a href="/advertise" target="_blank">
                Advertise With Us
              </a>
            </li>
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
            <li>
              <a href="/faqs" target="_blank">
                FAQs
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
