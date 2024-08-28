import React, { useState, useContext, useEffect } from "react";
import "../../styles/start.css";
import { Context } from "../store/appContext";

export const Start = () => {
  const [hostUser, setHostUser] = useState(null);
  const [foeUser, setFoeUser] = useState(null);
  const [hostVote, setHostVote] = useState(null);
  const [winType, setWinType] = useState('KO'); // State for the radio selection
  const { store, actions } = useContext(Context);
  const [foeVote, setFoeVote] = useState(null);

  // ...other state and useEffect hooks...

  const handleFileUpload = (e, setUser) => {
    setUser(URL.createObjectURL(e.target.files[0]));
  };

  const handleHostVote = (vote) => {
    setHostVote(vote);
    if (vote === 'winner') {
      setFoeVote('loser');
    } else {
      setFoeVote('winner');
    }
  };

  const handleFoeVote = (vote) => {
    setFoeVote(vote);
    if (vote === 'winner') {
      setHostVote('loser');
    } else {
      setHostVote('winner');
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
      {/*Button trigger modal*/}
      <button type="button" class="btn btn-secondary" data-bs-toggle="modal" data-bs-target="#staticBackdrop">
      <h1>👊🏾START👊🏾</h1>
      </button>
      {/* StartModal */}
      <div class="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h1 class="modal-title fs-5" id="staticBackdropLabel">Modal title</h1>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              ...
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              <button type="button" class="btn btn-primary">Understood</button>
            </div>
          </div>
        </div>
      </div></>
  );
};