import React, { useState, useEffect, useContext } from "react";
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom";
import "../../styles/landing.css";
import { Profile } from "../component/profile";
import { DaPaintList } from "../component/dapaintlist.js";
import { DaPaintCreate } from "../component/dapaintcreate.js";
import { Lineup } from "../component/lineup.js";
import { Setting } from "../component/setting.js";
import { Invite } from "../component/invite.js";
// import { EditProfile } from "../component/editprofile.js";
import { Start, Wlsub } from "../component/start.js";
import { Help } from "../component/help.js";
import { Wallet } from "../component/wallet.js";

export const Landing = () => {
  const { store, actions } = useContext(Context);
  const [currentWinStreak, setCurrentWinStreak] = useState(0);
  const [GoalWinStreak, setGoalWinStreak] = useState(30);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [maxWinStreak, setMaxWinStreak] = useState(0);
  const nextWinStreak = maxWinStreak + 1;
  const [user, setUser] = useState();
  const [maxWinStreakUser, setMaxWinStreakUser] = useState();
  const navigate = useNavigate();
  useEffect(() => {
    actions.fetchMaxWinStreak(
      setMaxWinStreak,
      setGoalWinStreak,
      setMaxWinStreakUser
    );
    actions.fetchAndSetUser(setUser, setCurrentWinStreak);
  }, []);

  console.log(
    "GoalWinStreak",
    GoalWinStreak,
    "CURRENTWinStreak",
    currentWinStreak,
    "calc",
    ((currentWinStreak < GoalWinStreak ? currentWinStreak : GoalWinStreak) /
      GoalWinStreak) *
      100
  );
  console.log("max Win Streak", maxWinStreak);
  {
    /* <div>
    {userData && store.userData.user?.name ? */
  }
  return (
    <div className={`home-container`}>
      <main className="main-body">
        <header className="top-header">
          <h1>
            {/* <EditProfile /> */}
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
                    ((currentWinStreak < GoalWinStreak
                      ? currentWinStreak
                      : GoalWinStreak) /
                      GoalWinStreak) *
                    100
                  }%`,
                }}
              ></div>
              <div
                className={`custom-circle ms-auto custom-end ${
                  currentWinStreak >= GoalWinStreak ? "bg-yellow" : ""
                }`}
              >
                <h4>{GoalWinStreak}</h4>
              </div>
            </div>
          </div>
        </div>
        <p></p>
        <p></p>

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
        <p></p>
        <Lineup />
        <p></p>
        <p></p>
        {/* <Help /> */}
        <div className="find-foe-section">
          {(store.userData.dapaintId && <Start />) || <DaPaintList />}

          <Wallet/>
          <p className="tap-button-text">TAP THE BUTTON</p>
        </div>
      </main>
    </div>
  );
};
{
  /* : <p>Can't get the current user</p>}
     </div>*/
}
