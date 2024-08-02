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
import {EditProfile} from "../component/editprofile.js";

export const Landing = () => {
  const { store } = useContext(Context);
  const [currentWinStreak, setCurrentWinStreak] = useState(0);
  const [GoalWinStreak, setGoalWinStreak] = useState(0);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const maxWinStreak = 30;
  const nextWinStreak = currentWinStreak + 1;
  const [user, setUser] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMaxWinStreak = async () => {
      try {
        const response = await fetch(process.env.BACKEND_URL+'/api/max-win-streak');
        const data = await response.json();
        console.log(data.maxWinStreak);
        console.log("trying to fetch Win Streak, ")
        setCurrentWinStreak(data.maxWinStreak);
        setGoalWinStreak(data.WinStreakGoal);
      } catch (error) {
        console.error("Error fetching max win streak:", error);
      }
    };
    const fetchCurrentUser = async () => {
      try {
        const response = await fetch(process.env.BACKEND_URL+'/api/current-user',{
          headers:{
            "Authorization":`Bearer ${localStorage.getItem("token")}`
          }
        });
        const data = await response.json();
        setUser(data);
      } catch (error) {
        console.error("Error fetching current user:", error);
      }
    };

    fetchMaxWinStreak();
    fetchCurrentUser();
  }, []);

  return (
    <div className="home-container">
      <header className="top-header">
      <Profile />
      <EditProfile />
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
            <div className="custom-progress" style={{ width: `${(currentWinStreak / maxWinStreak) * 100}%` }}>
            </div><div className={`custom-circle ms-auto custom-end ${currentWinStreak == 30 ? "bg-yellow" : ""}`}>{GoalWinStreak}</div>
          </div>
        </div>
      </div>

      <main className="main-body">
        <h2 className="streak-announcement">WHO WILL ACHIEVE {nextWinStreak} WIN STREAK?</h2>
        <p className="current-streak">{user&&user.name} HAS ACHIEVED {currentWinStreak} WIN STREAK</p>
        <Lineup />
        <div className="find-foe-section">
        <DaPaintList />
          <p className="tap-button-text">TAP THE BUTTON</p>
          <DaPaintCreate />
        </div>
      </main>
    </div>
  );
};
