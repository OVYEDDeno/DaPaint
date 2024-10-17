import React, { useState, useEffect, useContext } from "react";
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom";
import "../../styles/landing.css";
import { Profile } from "../component/profile";
import { Lineup } from "../component/lineup.js";
import { Setting } from "../component/setting.js";
import { Invite } from "../component/invite.js";
import { Start } from "../component/start.js";
import { DaPaintManager } from "../component/DaPaintManager.js";

export const Landing = () => {
  const { store, actions } = useContext(Context);
  const [currentWinStreak, setCurrentWinStreak] = useState(0);
  const [GoalWinStreak, setGoalWinStreak] = useState(0);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [maxWinStreak, setMaxWinStreak] = useState(0);
  const nextWinStreak = maxWinStreak + 1;
  const [user, setUser] = useState();
  const [maxWinStreakUser, setMaxWinStreakUser] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    actions.fetchAndSetUser(setUser, setCurrentWinStreak);
    actions.fetchMaxWinStreak(
      setMaxWinStreak,
      setGoalWinStreak,
      setMaxWinStreakUser
    );
  }, []);

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("token");
    if (!isAuthenticated) {
      navigate("/auth");
    }
  }, []);

  return (
    <div className="home-container text-center">
      <main className="main-content">
        <header className="top-header">
          <h1>
            <Profile />
          </h1>
          <div className="actions-section">
            <Invite />
            <Setting />
          </div>
        </header>
        <div className="custom-win-streak">
          <div className="custom-progress-container">
            <div className="custom-circle custom-start">
              <h4>{currentWinStreak}</h4>
            </div>
            <div className="custom-progress-bar">
              <span className="custom-progress-text">
                <h4>WIN STREAK</h4>
              </span>
              <div
                className="custom-progress"
                style={{
                  width: `${
                    ((currentWinStreak < store.WinStreakGoal
                      ? currentWinStreak
                      : store.WinStreakGoal) /
                      store.WinStreakGoal) *
                    100
                  }%`,
                }}
              ></div>
              <div
                className={`custom-circle ms-auto custom-end ${
                  currentWinStreak >= store.WinStreakGoal ? "bg-yellow" : ""
                }`}
              >
                <h4>{store.WinStreakGoal}</h4>
              </div>
            </div>
          </div>
        </div>

        <h1 className="streak-announcement">
          {currentWinStreak >= GoalWinStreak
            ? "CONGRATULATIONS!!"
            : maxWinStreak >= GoalWinStreak
            ? `CONGRATULATIONS TO ${maxWinStreakUser} FOR REACHING ${GoalWinStreak} WIN STREAK!`
            : `WHO WILL ACHIEVE ${nextWinStreak} WIN STREAKS?`}
        </h1>
        <h3 className="current-streak">
          {maxWinStreakUser} has achieved {maxWinStreak} win streaks
        </h3>

        <Lineup />

        <div className="find-foe-section">
          {(!store.userData.dapaintId ||
            store.userData.dapaintId?.winnerId &&
            store.userData.dapaintId?.loserId
          ) && <DaPaintManager /> || <Start />}
          {/* <p className="tap-button-text">TAP THE BUTTON</p> */}
        </div>
      </main>
    </div>
  );
};