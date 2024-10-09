import React, { useState, useContext } from "react"; // Added useState
import { Context } from "../store/appContext";
import "../../styles/home.css";
import { useNavigate } from "react-router-dom";

export const Home = () => {
  const [isAgreed, setIsAgreed] = useState(false);
  const navigate = useNavigate(); // Initialize navigate function

  const handleCheckboxChange = (event) => {
    setIsAgreed(event.target.checked);
  };

  const handleJoinClick = () => {
    if (isAgreed) {
      // Navigate to the /auth page
      navigate("/auth");
    } else {
      alert("Please agree to the terms before proceeding.");
    }
  };

  return (
    <div className="home-container">
      <main className="main-body">
        <div className="flex-container">
          <img
            src="https://res.cloudinary.com/dj2umay9c/image/upload/v1728188124/CLOCK_IN_n65pv1.png"
            alt="DaPaintApp"
            className="left-image"
          />
          <div className="text-container">
            <h1 className="tagline">
              WELCOME TO DaPaint! <h5>Where Legends Are Made.</h5>
            </h1>
            <p style={{ color: "goldenrod" }}>
              The ultimate 1-on-1 sports challenges. Sweat, grit, and glory
              await you.
            </p>

            <p style={{ color: "goldenrod" }}>
              <input
                type="checkbox"
                checked
                readOnly
                style={{ accentColor: "goldenrod" }}
              />{" "}
              30 WIN STREAKS = $1 MILLION
              <br />
              <input
                type="checkbox"
                checked
                readOnly
                style={{ accentColor: "goldenrod" }}
              />{" "}
              Real competitions! Real rewards!
              <br />
              <input
                type="checkbox"
                id="agree-checkbox"
                checked={isAgreed}
                style={{ accentColor: "goldenrod" }}
                onChange={handleCheckboxChange}
              />{" "}
              Think you've got what it takes?
            </p>

            <p style={{ color: "goldenrod" }}>
              Whether you’re a seasoned competitor or just starting your
              journey. We believe in your potential to rise. We're still launching, but you can join early with an
              invite code from a current user.
            </p>

            <strong>
              <p style={{ color: "red" }}>
                WARNING: LIKE WINNING DAPAINT ISN'T FOR EVERYONE!
              </p>
            </strong>

            <div className="text-center">
              <button
                role="button"
                className="golden-button"
                disabled={!isAgreed}
                onClick={handleJoinClick}
              >
                <span className="golden-text">
                  Join Now!
                  <img
                    src="https://icons.iconarchive.com/icons/microsoft/fluentui-emoji-3d/512/Oncoming-Fist-3d-Medium-Dark-icon.png"
                    alt="DaPaintLogo"
                    className="DaPaintLogo1"
                  />{" "}
                  Victory awaits.
                </span>
              </button>
              {!isAgreed && (
                <p style={{ color: "white", fontSize: "14px" }}>
                  Prove you got what it takes? (Check the box agree to TOS & PP)
                </p>
              )}
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
                Terms of service
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
            <p style={{ color: "white" }}>
              &copy; {new Date().getFullYear()} OVYED Labs
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};
