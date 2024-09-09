import React, { useState, useContext } from "react";
import "../../styles/start.css";
import { Context } from "../store/appContext";

export const Start = () => {
  const [hostUser, setHostUser] = useState(null);
  const [foeUser, setFoeUser] = useState(null);
  const [hostVote, setHostVote] = useState(null);
  const [foeVote, setFoeVote] = useState(null);
  const { store, actions } = useContext(Context);

  const handleFileUpload = (e, setUser) => {
    setUser(URL.createObjectURL(e.target.files[0]));
  };

  const handleHostVote = (vote) => {
    setHostVote(vote);
    setFoeVote(vote === "winner" ? "loser" : foeVote);  // Update foeVote only if host claims a win
  };

  const handleFoeVote = (vote) => {
    setFoeVote(vote);
    setHostVote(vote === "winner" ? "loser" : hostVote);  // Update hostVote only if foe claims a win
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!store.userData.dapaintId) {
      alert("No valid event found for this user");
      return;
    }

    let host_winnerId = null;
    let host_loserId = null;
    let foe_winnerId = null;
    let foe_loserId = null;

    // Determine the winner/loser for host
    if (hostVote === "winner") {
      host_winnerId = store.userData.indulgers.host.id;
      host_loserId = store.userData.indulgers.foe.id;
    } else if (hostVote === "loser") {
      host_loserId = store.userData.indulgers.host.id;
      host_winnerId = store.userData.indulgers.foe.id;
    }

    // Determine the winner/loser for foe
    if (foeVote === "winner") {
      foe_winnerId = store.userData.indulgers.foe.id;
      foe_loserId = store.userData.indulgers.host.id;
    } else if (foeVote === "loser") {
      foe_loserId = store.userData.indulgers.foe.id;
      foe_winnerId = store.userData.indulgers.host.id;
    }

    // Check for conflict: both claiming winner
    if (host_winnerId && foe_winnerId) {
      alert("Both users claimed victory. Sending to dispute resolution.");
      let reportResult = await actions.createReport(store.userData.dapaintId, {
        user_id: store.userData.indulgers.host.id,
        foe_id: store.userData.indulgers.foe.id,
        img_url: hostUser || foeUser,
        vid_url: null,
      });

      if (reportResult) {
        alert("Report has been submitted for dispute resolution.");
      } else {
        alert("Failed to submit report.");
      }
    } else {
      // Update win streaks and other fields when no conflict
      let result = await actions.updateDaPaint(
        store.userData.dapaintId,
        {
          host_winnerId,
          host_loserId,
          foe_winnerId,
          foe_loserId,
          host_winnerImg: hostUser,
          foe_winnerImg: foeUser,
        }
      );
      if (result) {
        alert("Winstreak has been updated");
        actions.fetchCurrentUser();
      } else {
        alert("Failed to update win streak");
      }
    }
  };

  return (
    <>
      <button
        type="button"
        className="btn btn-secondary"
        data-bs-toggle="modal"
        data-bs-target="#startModal"
      >
        <h1>👊🏾START👊🏾</h1>
      </button>

      <div
        className="modal fade"
        id="startModal"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        tabIndex="-1"
        aria-labelledby="startModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title" id="startModalLabel">
                Who Won?
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
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
                      <button type="button" className="rounded-lg">
                        Upload KO
                      </button>
                    </div>
                    {hostUser && (
                      <img
                        src={hostUser}
                        alt="Host User"
                        className="user-img"
                      />
                    )}
                    <div className="user-vote">
                      <span>{store.userData.indulgers.host.name}</span>
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
                  <div className="user-section">
                    {foeUser && (
                      <img src={foeUser} alt="Foe User" className="user-img" />
                    )}
                    <div className="user-vote">
                      <span>{store.userData.indulgers.foe.name}</span>
                      <button
                        type="button"
                        className="rounded-lg"
                        style={{
                          backgroundColor:
                            foeVote === "winner" ? "#f5c116" : "black",
                          color: foeVote === "winner" ? "black" : "#f5c116",
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
