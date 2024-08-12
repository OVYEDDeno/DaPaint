import React, { useState, useEffect, useContext } from "react";
import { Context } from "../store/appContext";
import "../../styles/profile.css"; // Assuming you will create this CSS file
// import { EditProfile } from "../component/editprofile.js";

export const Profile = () => {
  const { store, actions } = useContext(Context);
  
  useEffect(() => {
    actions.fetchCurrentUser();
  }, []);

  return (
    <><button type="button" class="btn" data-bs-toggle="modal" data-bs-target="#profileModal">
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
    </button>

      <div class="modal fade" id="profileModal" tabindex="-1" aria-labelledby="profileModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header">
              <h1 class="modal-title fs-5" id="profileModalLabel">Profile</h1>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              {/* <EditProfile 
                 setProfileData={setProfileData}
                 initialData={store.userData}
              /> */}

              <table className="stats-table">
                <tbody>
                  <tr>
                    <td>Total</td>
                    <td className="total">{store.userData && store.userData.wins + store.userData.losses}</td>
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
                    <td className="disqualifications">{store.userData && store.userData.disqualifications}</td>
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
