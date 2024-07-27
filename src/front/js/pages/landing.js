import React, { useContext } from "react";
import { Context } from "../store/appContext";
import "../../styles/landing.css";

export const Landing = () => {
  return (
    <div className="home-container">
      <header className="top-header">
        <div className="profile-section">
          <img
            src="https://example.com/path-to-profile-picture"
            alt="Profile"
            className="profile-picture"
          />
          <div className="profile-info">
            <span className="profile-name">OVYEDDeno</span>
            <span className="profile-coins">💰1000</span>
          </div>
        </div>
        <div className="streak-section">
          <span className="streak-count">10</span>
          <span className="streak-label">WIN STREAK</span>
          <span className="target-streak">WIN $1M at 30</span>
        </div>
        <div className="actions-section">
          <button className="invite-friends-button">INVITE FRIENDS</button>
          <button className="settings-button">⚙️</button>
        </div>
      </header>

      <main className="main-body">
        <h2 className="streak-announcement">WHO WILL ACHIEVE 11 WIN STREAK?</h2>
        <p className="current-streak">OVYEDDeno HAS ACHIEVED 10 WIN STREAK</p>
        <button className="line-up-button">LINE UP</button>
        <div className="find-foe-section">
          <button className="find-foe-button">FIND FOE 💰0.01</button>
          <p className="tap-button-text">TAP THE BUTTON</p>
        </div>
      </main>
    </div>
  );
};

