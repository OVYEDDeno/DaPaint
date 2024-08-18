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
// import { EditProfile } from "../component/editprofile.js";
import { Wlsub } from "../component/wlsub.js";

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
    const fetchMaxWinStreak = async () => {
      try {
        const response = await fetch(process.env.BACKEND_URL + '/api/max-win-streak', {
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`
          }
        });
        const data = await response.json();
        console.log(data.maxWinStreak);
        console.log("trying to fetch Win Streak, ")
        setMaxWinStreak(data.maxWinStreak);
        setGoalWinStreak(data.WinStreakGoal);
        setMaxWinStreakUser(data.maxWinStreakUser.name);
      } catch (error) {
        console.error("Error fetching max win streak:", error);
      }
    };

    const fetchCurrentUser = async () => {
      try {
        const response = await fetch(process.env.BACKEND_URL + '/api/current-user', {
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`
          }
        });
        const data = await response.json();
        setUser(data);
        setCurrentWinStreak(data.winstreak);
        console.log("User: ", data);
        // actions.setCurrentUser(data);
      } catch (error) {
        console.error("Error fetching current user:", error);
      }
    };

    fetchMaxWinStreak();
    fetchCurrentUser();
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode); // Toggle dark mode
  };

  console.log("GoalWinStreak", GoalWinStreak, "CURRENTWinStreak", currentWinStreak, "calc", ((currentWinStreak < GoalWinStreak ? currentWinStreak : GoalWinStreak) / GoalWinStreak) * 100)
  console.log("max Win Streak", maxWinStreak);

  return (
    <div className={`home-container ${darkMode ? "dark-mode" : ""}`}>
      <header className="top-header">
        <Profile />
        {/* <EditProfile /> */}
        <button onClick={toggleDarkMode} className="dark-mode-toggle">
          {darkMode ? "Light Mode" : "Dark Mode"}
        </button>
        <div className="actions-section">
          <Invite />
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
          {currentWinStreak >= 40 ? "CONGRATULATIONS!!" : maxWinStreak >= 40 ? `CONGRATULATIONS TO ${maxWinStreakUser} FOR REACHING 40 WIN STREAK!` : `WHO WILL ACHIEVE ${nextWinStreak} WIN STREAK?`}
        </h2>
        <p className="current-streak">{maxWinStreakUser} HAS ACHIEVED {maxWinStreak} WIN STREAK</p>
        <Lineup />
        <div className="find-foe-section">
          <DaPaintList /><p></p>
          <Wlsub />
          <p className="tap-button-text">TAP THE BUTTON</p>
        </div>
      </main>
    </div>
  );
};