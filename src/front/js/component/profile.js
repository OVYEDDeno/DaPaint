import React, { useState, useEffect, useContext } from "react";
import { Context } from "../store/appContext";
import "../../styles/profile.css"; // Assuming you will create this CSS file

export const Profile = () => {
  const { store, actions } = useContext(Context);
  const [user, setUser] = useState();
  const [profileData, setProfileData] = useState({
    total: 20,
    wins: 15,
    winsByKnockout: 2,
    winsBySubmission: 11,
    losses: 2,
    lossesByKnockout: 2,
    lossesBySubmission: 0,
    disqualifications: 0
  });

  const username = "OVYEDDeno"; // Example username
  useEffect(() => {    
    actions.fetchCurrentUser();
  }, []);

  return (
    <><button type="button" class="btn" data-bs-toggle="modal" data-bs-target="#exampleModal">
      <div className="profile-container">
        <div className="profile-header">
          <div className="profile-picture-section">
            <img
              src="https://static-00.iconduck.com/assets.00/oncoming-fist-medium-dark-emoji-2048x1797-dmd9wvcy.png"
              alt="Profile"
              className="profile-picture" />
            <div className="profile-name">{store.userData && store.userData.name}</div>
          </div>
        </div>
      </div>
    </button><div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">

              <h1 class="modal-title fs-5" id="exampleModalLabel">Profile</h1>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <table className="stats-table">
                <tbody>
                  <tr>
                    <td>Total</td>
                    <td>{store.userData && store.userData.wins+store.userData.losses}</td>
                  </tr>
                  <tr>
                    <td>Wins</td>
                    <td className="wins">{store.userData && store.userData.wins}</td>
                  </tr>
                  <tr>
                    <td>By knockout</td>
                    <td>{store.userData && store.userData.winsByKO}</td>
                  </tr>
                  <tr>
                    <td>By submission</td>
                    <td>{store.userData && store.userData.winsBySub}</td>
                  </tr>
                  <tr>
                    <td>Losses</td>
                    <td className="losses">{store.userData && store.userData.losses}</td>
                  </tr>
                  <tr>
                    <td>By knockout</td>
                    <td>{store.userData && store.userData.lossesByKO}</td>
                  </tr>
                  <tr>
                    <td>By submission</td>
                    <td>{store.userData && store.userData.lossesBySub}</td>
                  </tr>
                  <tr>
                    <td>Disqualifications</td>
                    <td>{store.userData && store.userData.disqualifications}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              <button type="button" class="btn btn-primary">Save changes</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
