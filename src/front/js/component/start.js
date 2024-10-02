import React, { useState, useContext } from "react";
import "../../styles/start.css";
import { Context } from "../store/appContext";

export const Start = () => {
  const [hostUser, setHostUser] = useState(null);
  const [foeUser, setFoeUser] = useState(null);
  const [hostVote, setHostVote] = useState(null);
  const [foeVote, setFoeVote] = useState(null);
  const { store, actions } = useContext(Context);
  const [previewURL, setPreviewURL] = useState("");
  const placeholderImage =
    "https://icons.iconarchive.com/icons/microsoft/fluentui-emoji-3d/512/Man-3d-Medium-Dark-icon.png";

  const handleFileUpload = (e, setUser) => {
    setUser(URL.createObjectURL(e.target.files[0]));
  };

  const handleHostVote = (vote) => {
    setHostVote(vote);
    setFoeVote(vote === "winner" ? "loser" : foeVote); // Update foeVote only if host claims a win
  };

  const handleFoeVote = (vote) => {
    setFoeVote(vote);
    setHostVote(vote === "winner" ? "loser" : hostVote); // Update hostVote only if foe claims a win
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!store.userData.dapaintId) {
      alert("No valid event found for this user");
      return;
    }

    let winner_id = null;
    let loser_id = null;

    // Determine the winner/loser for host
    if (hostVote === "winner") {
      winner_id = store.userData.indulgers.host.id;
      loser_id = store.userData.indulgers.foe.id;
    }

    // Determine the winner/loser for foe
    if (foeVote === "winner") {
      winner_id = store.userData.indulgers.foe.id;
      loser_id = store.userData.indulgers.host.id;
    }

    // Check for conflict: both claiming winner

    // Update win streaks and other fields when no conflict
    let result = await actions.updateWinstreak(
      store.userData.dapaintId,
      winner_id,
      loser_id
    );
    if (result) {
      alert("Winstreak has been updated");
      actions.fetchCurrentUser();
    } else {
      alert("Failed to update win streak");
    }
  };
  const getDisplayImageFoe = () => {
    const foeProfilePic = store.userData.indulgers.foe.profile_pic;
    if (foeProfilePic && foeProfilePic.image_url) {
      return foeProfilePic.image_url;
    } else if (placeholderImage) {
      return placeholderImage;
    }
  };

  const getDisplayImageHost = () => {
    const hostProfilePic = store.userData.indulgers.host.profile_pic;
    if (hostProfilePic && hostProfilePic.image_url) {
      return hostProfilePic.image_url;
    } else if (placeholderImage) {
      return placeholderImage;
    }
  };

  return (
    <>
      <button
        type="button"
        className="btn-start"
        data-bs-toggle="modal"
        data-bs-target="#startModal"
      >
        <h1>👊🏾START👊🏾</h1>
      </button>

      <div
        className="modal fade"
        id="startModal"
        // data-bs-backdrop="static"
        data-bs-keyboard="false"
        tabIndex="-1"
        aria-labelledby="startModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="profile-header">
              <img
                data-bs-dismiss="modal"
                src="https://icons.iconarchive.com/icons/microsoft/fluentui-emoji-3d/512/Prohibited-3d-icon.png"
                alt="Close"
                className="invite-close"
              />
              <p>--Forfeit</p>
              <h1 className="invite-title">
                WHO WON?
                <img
                  data-bs-dismiss="modal"
                  src="https://icons.iconarchive.com/icons/microsoft/fluentui-emoji-flat/512/Cross-Mark-Flat-icon.png"
                  alt="Close"
                  className="invite-close"
                />
              </h1>
            </div>

            <div className="modal-body">
              <div className="start-container">
                <form onSubmit={handleSubmit}>
                  <div className="user-section">
                    <div className="upload-ko">
                      <input
                        type="file"
                        accept="image/*,video/*"
                        onChange={(e) => handleFileUpload(e, setHostUser)}
                      />
                      
                    </div>
                    {/* {hostUser && (
                      
                    )} */}
                    <div className="user-vote">
                      <div className="user-name">
                        <img
                          src={getDisplayImageHost()}
                          alt="Host User"
                          className="rounded-circle img-fluid pe-1"
                          style={{ width: "68px", height: "68px" }}
                        />
                        {store.userData.indulgers.host.name}
                      </div>
                      <div className="vote-buttons">
                        <button
                          type="button"
                          className="rounded-lg"
                          style={{
                            backgroundColor:
                              hostVote === "winner" ? "green" : "black",
                          }}
                          onClick={() => handleHostVote("winner")}
                        >
                          Winner
                        </button>
                        <button
                          type="button"
                          className="rounded-lg"
                          style={{
                            backgroundColor:
                              hostVote === "loser" ? "red" : "black",
                          }}
                          onClick={() => handleHostVote("loser")}
                        >
                          Loser
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="user-section">
                    <div className="user-vote">
                      <div className="user-name">
                        <img
                          src={getDisplayImageFoe()}
                          alt="Host User"
                          className="rounded-circle img-fluid pe-1"
                          style={{ width: "68px", height: "68px" }}
                        />

                        {store.userData.indulgers.foe.name}
                      </div>
                      <div className="vote-buttons">
                      
                        <button
                          type="button"
                          className="rounded-lg"
                          style={{
                            backgroundColor:
                              foeVote === "winner" ? "green" : "black",
                            color: foeVote === "winner" ? "white" : "white",
                          }}
                          onClick={() => handleFoeVote("winner")}
                        >
                          Winner
                        </button>
                        <button
                          type="button"
                          className="rounded-lg"
                          style={{
                            backgroundColor:
                              foeVote === "loser" ? "red" : "black",
                          }}
                          onClick={() => handleFoeVote("loser")}
                        >
                          Loser
                        </button>
                      </div>
                    </div>
                  </div>
                  <button type="submit">Submit</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
