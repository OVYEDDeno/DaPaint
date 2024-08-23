import React, { useState, useContext, useEffect } from "react";
import "../../styles/start.css";
import { Context } from "../store/appContext";

export const Help = () => {
  const [hostUser, setHostUser] = useState(null);
  const [foeUser, setFoeUser] = useState(null);
  const [hostVote, setHostVote] = useState(null);
  const [winType, setWinType] = useState("KO"); // State for the radio selection
  const { store, actions } = useContext(Context);
  const [foeVote, setFoeVote] = useState(null);

  // ...other state and useEffect hooks...

  const handleFileUpload = (e, setUser) => {
    setUser(URL.createObjectURL(e.target.files[0]));
  };

  const handleHostVote = (vote) => {
    setHostVote(vote);
    if (vote === "winner") {
      setFoeVote("loser");
    } else {
      setFoeVote("winner");
    }
  };

  const handleFoeVote = (vote) => {
    setFoeVote(vote);
    if (vote === "winner") {
      setHostVote("loser");
    } else {
      setHostVote("winner");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!dapaintId) {
      alert("No valid event found for this user");
      return;
    }

    let result = await actions.updateWinstreak(dapaintId, hostVote, winType); // Pass the winType in the API call
    if (result) {
      alert("Winstreak has been updated");
      actions.fetchCurrentUser();
    } else {
      alert("Failed to update win streak");
    }
  };

  return (
    <>
      <button
        type="button"
        className="btn btn-outline-danger btn-lg"
        data-bs-toggle="modal"
        data-bs-target="#WLSubmodal"
      >
        <img
          src="https://icons.iconarchive.com/icons/microsoft/fluentui-emoji-3d/512/Exclamation-Question-Mark-3d-icon.png"
          alt="Who Won?"
          style={{ width: "40px", height: "40px" }}
        />
      </button>

      <div
        className="modal fade"
        id="WLSubmodal"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        tabIndex="-1"
        aria-labelledby="staticBackdropLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-body">
            <div className="wlsub-container">
              <div className="d-flex justify-content-center align-items-center">
                <h1
                  className="modal-title text-white text-2xl font-bold"
                  id="WLSubLabel"
                >
                  HOW TO DIDDY
                </h1>
                <button
                  type="button"
                  className="btn btn-secondary ms-3"
                  data-bs-dismiss="modal"
                >
                  Forfeit
                </button>
              </div>
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
                  <div className="win-type-radio">
                    <label style={{ marginRight: "10px" }}>
                      <input
                        type="radio"
                        name="winType"
                        value="KO"
                        checked={winType === "KO"}
                        onChange={() => setWinType("KO")}
                        style={{ marginRight: "5px" }}
                      />
                      Win By KO
                    </label>
                    <label>
                      <input
                        type="radio"
                        name="winType"
                        value="Sub"
                        checked={winType === "Sub"}
                        onChange={() => setWinType("Sub")}
                        style={{ marginRight: "5px" }}
                      />
                      Win By Sub
                    </label>
                  </div>
                  {hostUser && (
                    <img src={hostUser} alt="Host User" className="user-img" />
                  )}
                  <div className="user-vote">
                    <span>hostUsername</span>
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
                        backgroundColor: hostVote === "loser" ? "red" : "black",
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
                    <span>foeUsername</span>
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
                        backgroundColor: foeVote === "loser" ? "red" : "black",
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
    </>
  );
};
