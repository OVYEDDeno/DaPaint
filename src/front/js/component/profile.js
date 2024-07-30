import React, { useState, useEffect } from "react";
import { Context } from "../store/appContext";
import "../../styles/profile.css"; // Assuming you will create this CSS file

export const Profile = () => {
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

  return (


    <><button type="button" class="btn" data-bs-toggle="modal" data-bs-target="#exampleModal">
      <div className="profile-container">
        <div className="profile-header">
          <div className="profile-picture-section">
            <img
              src="https://static-00.iconduck.com/assets.00/oncoming-fist-medium-dark-emoji-2048x1797-dmd9wvcy.png"
              alt="Profile"
              className="profile-picture" />
            <div className="profile-name">{username}</div>
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
                <td>{profileData.total}</td>
              </tr>
              <tr>
                <td>Wins</td>
                <td className="wins">{profileData.wins}</td>
              </tr>
              <tr>
                <td>By knockout</td>
                <td>{profileData.winsByKnockout}</td>
              </tr>
              <tr>
                <td>By submission</td>
                <td>{profileData.winsBySubmission}</td>
              </tr>
              <tr>
                <td>Losses</td>
                <td className="losses">{profileData.losses}</td>
              </tr>
              <tr>
                <td>By knockout</td>
                <td>{profileData.lossesByKnockout}</td>
              </tr>
              <tr>
                <td>By submission</td>
                <td>{profileData.lossesBySubmission}</td>
              </tr>
              <tr>
                <td>Disqualifications</td>
                <td>{profileData.disqualifications}</td>
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
