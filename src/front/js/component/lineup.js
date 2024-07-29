import React, { useState, useEffect } from "react";
import "../../styles/landing.css";


export const Landing = () => {
  const [currentWinStreak, setCurrentWinStreak] = useState(0); // Example value
  const maxWinStreak = 30;
  const nextWinStreak = currentWinStreak + 1;
  const username = "OVYEDDeno"; // Example username

  useEffect(() => {
    const fetchMaxWinStreak = async () => {
      try {
        const response = await fetch('/max-win-streak');
        const data = await response.json();
        console.log(data.maxWinStreak);
        console.log("trying to fetch Win Streak, ")
        setCurrentWinStreak(data.maxWinStreak);
      } catch (error) {
        console.error("Error fetching max win streak:", error);
      }
    };

    fetchMaxWinStreak();
  }, []);


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
            <span className="profile-name">{username}</span>
          </div>
        </div>
        <div className="actions-section">
          <button className="invite-friends-button">INVITE FRIENDS</button>
          <button className="settings-button">⚙️</button>
        </div>
      </header>
      <div className="custom-win-streak">
        <div className="custom-progress-container">
          <div className="custom-circle custom-start">{currentWinStreak}</div>
          <div className="custom-progress-bar">
            <span className="custom-progress-text">WIN STREAK</span>
            <div className="custom-progress" style={{ width: `${(currentWinStreak / maxWinStreak) * 100}%` }}>
            </div><div className={`custom-circle ms-auto custom-end ${currentWinStreak == 30 ? "bg-yellow" : ""}`}>30</div>
          </div>

        </div>
      </div>


      <main className="main-body">
        <h2 className="streak-announcement">WHO WILL ACHIEVE {nextWinStreak} WIN STREAK?</h2>
        <p className="current-streak">OVYEDDeno HAS ACHIEVED {currentWinStreak} WIN STREAK</p>
        <button className="line-up-button">LINE UP</button>
        <div className="find-foe-section">
          <button className="find-foe-button">FIND FOE 💰0.01</button>
          <p className="tap-button-text">TAP THE BUTTON</p>
        </div>
      </main>
    </div>
  );
};
