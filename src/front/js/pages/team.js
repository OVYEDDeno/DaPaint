import React, { useState } from "react";
import "../../styles/home.css";
import { useNavigate } from "react-router-dom";

export const Team = () => {
  const navigate = useNavigate();

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
              CLOCK IN DaPaint! <h5>Where Products Are Made.</h5>
            </h1>
            {/* <p style={{ color: "goldenrod" }}>
              Our mission at Bento is to help bring more creator-led businesses,
              projects, and creativity to the world. We believe to be at the
              cusp of a huge creative revolution - creators should now focus on
              creating something they care about. We help them focus on their
              audience and ensure that making a living online becomes easier and
              more delightful. Our vision is simple: we believe that the
              inspiration and collaboration from people sharing their work will
              lead to greater ideas and creations that will help the world move
              forward. A Bento is a place for inspiration, engagement, and
              meaningfully connecting with peers. It’s a place that helps bring
              the right minds together and spark innovation! Wanna help the
              mission? Join the ride!
            </p> */}

            <div className="text-center">
              <button
                role="button"
                className="golden-button"
                onClick={() => navigate("/team")}
              >
                <span className="golden-text">
                  Join US!
                  <img
                    src="https://icons.iconarchive.com/icons/microsoft/fluentui-emoji-3d/512/Oncoming-Fist-3d-Medium-Dark-icon.png"
                    alt="DaPaintLogo"
                    className="DaPaintLogo1"
                  />{" "}
                </span>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
