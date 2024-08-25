import React, { useState, useEffect, useContext } from "react";
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom";
import "../../styles/landing.css";
import { Profile } from "../component/profile";
import DaPaintList from '../component/dapaintlist.js';
import { DaPaintCreate } from '../component/dapaintcreate.js';
import { Lineup } from "../component/lineup.js";
import { Setting } from "../component/setting.js";
import { Invite } from "../component/invite.js";
import { EditProfile } from "../component/editprofile.js";
import { Start, Wlsub } from "../component/start.js";
import { Help } from "../component/help.js";
import { Wallet } from "../component/wallet.js";

export const Landing = () => {
  const { store, actions } = useContext(Context);
  const [currentWinStreak, setCurrentWinStreak] = useState(0);
  const [GoalWinStreak, setGoalWinStreak] = useState(0);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [maxWinStreak, setMaxWinStreak] = useState(0);
  const nextWinStreak = maxWinStreak + 1;
  const [user, setUser] = useState();
  const [maxWinStreakUser, setMaxWinStreakUser] = useState();
  const [darkMode, setDarkMode] = useState(false); // State for dark mode
  const navigate = useNavigate();

  useEffect(() => {

    actions.fetchMaxWinStreak(setMaxWinStreak, setGoalWinStreak, setMaxWinStreakUser);
    actions.fetchAndSetUser(setUser, setCurrentWinStreak);

  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode); // Toggle dark mode
  };

  console.log("GoalWinStreak", GoalWinStreak, "CURRENTWinStreak", currentWinStreak, "calc", ((currentWinStreak < GoalWinStreak ? currentWinStreak : GoalWinStreak) / GoalWinStreak) * 100)
  console.log("max Win Streak", maxWinStreak);

  return (
    <div className={`home-container ${darkMode ? "dark-mode" : ""}`}>
      <header className="top-header">
        <h1>Welcome<EditProfile />
        {/* <Help/> */}
        {/* <Profile />                 */}</h1>
        <button onClick={toggleDarkMode} className="dark-mode-toggle">
          {darkMode ? "Light Mode" : "Dark Mode"}
        </button>
        <div className="actions-section">          
          {/* <Invite /> */}
          <Setting />
        </div>
      </header>
      <div className="custom-win-streak">
        <div className="custom-progress-container">
          <div className="custom-circle custom-start">{currentWinStreak}</div>
          <div className="custom-progress-bar">
            <span className="custom-progress-text">WIN STREAK</span>
            <div className="custom-progress" style={{ width: `${((currentWinStreak < GoalWinStreak ? currentWinStreak : GoalWinStreak) / GoalWinStreak) * 100}%` }}>
            </div><div className={`custom-circle ms-auto custom-end ${currentWinStreak >= GoalWinStreak ? "bg-yellow" : ""}`}>{GoalWinStreak}</div>
          </div>
        </div>
      </div>

      <main className="main-body">
        <h2 className="streak-announcement">
          {currentWinStreak >= GoalWinStreak ? "CONGRATULATIONS!!" : maxWinStreak >= GoalWinStreak ? `CONGRATULATIONS TO ${maxWinStreakUser} FOR REACHING ${GoalWinStreak} WIN STREAK!` : `WHO WILL ACHIEVE ${nextWinStreak} WIN STREAK?`}
        </h2>
        <p className="current-streak">{maxWinStreakUser} HAS ACHIEVED {maxWinStreak} WIN STREAK</p>
        <Lineup />
        <div className="find-foe-section">
          <DaPaintList /><p></p>
          <Start />
          {/* <Wallet/> */}
          <p className="tap-button-text">TAP THE BUTTON</p>
        </div>
      </main>
    </div>
  );
};