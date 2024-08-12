import React, { useState, useContext } from 'react';
import '../../styles/wlsub.css';
import { Context } from "../store/appContext";


export const Wlsub = () => {
  const [hostUser, setHostUser] = useState(null);
  const [foeUser, setFoeUser] = useState(null);
  const [hostVote, setHostVote] = useState(null);
  const { store, actions } = useContext(Context);
  const [foeVote, setFoeVote] = useState(null);

  const handleFileUpload = (e, setUser) => {
    setUser(URL.createObjectURL(e.target.files[0]));
  };

  const handleHostVote = (vote) => {
    setHostVote(vote);
    if (vote === 'winner') {
      setFoeVote('loser'); // Automatically set opponent's vote to 'loser'
    }
  };

  const handleFoeVote = (vote) => {
    setFoeVote(vote);
    if (vote === 'winner') {
      setHostVote('loser'); // Automatically set host's vote to 'loser'
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let dapaintId = 1
    let result = await actions.updateWinstreak(dapaintId, hostVote);
    if (result) {
      alert("Winstreak has been updated");
      actions.fetchCurrentUser(); // Refresh user data after update
    } else {
      alert("Failed to update win streak");
    }
  };

  return (
    <>
      <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#WLSubmodal">
        START
      </button>
      <div className="modal fade" id="WLSubmodal" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-body">
              <div className="wlsub-container">
                <h2>Who Won?</h2>
                <form onSubmit={handleSubmit}>
                  <div className="user-section">
                    <div className="upload-ko">
                      <input
                        type="file"
                        accept="image/*,video/*"
                        onChange={(e) => handleFileUpload(e, setHostUser)}
                      />
                      <button type="button">Upload KO</button>
                    </div>
                    {hostUser && <img src={hostUser} alt="Host User" className="user-img" />}
                    <div className="user-vote">
                      <button
                        type="button"
                        style={{ backgroundColor: hostVote === 'winner' ? 'green' : 'black' }}
                        onClick={() => handleHostVote('winner')}>Yes</button>
                      <button
                        type="button"
                        style={{ backgroundColor: hostVote === 'loser' ? 'red' : 'black' }}
                        onClick={() => handleHostVote('loser')}>No</button>
                    </div>
                  </div>
                  <div className="user-section">
                    {foeUser && <img src={foeUser} alt="Foe User" className="user-img" />}
                    <div className="user-vote">
                      <button
                        type="button"
                        style={{ backgroundColor: foeVote === 'winner' ? 'green' : 'black' }}
                        onClick={() => handleFoeVote('winner')}>Yes</button>
                      <button
                        type="button"
                        style={{ backgroundColor: foeVote === 'loser' ? 'red' : 'black' }}
                        onClick={() => handleFoeVote('loser')}>No</button>
                    </div>
                  </div>
                  <button type="submit">Submit</button>
                </form>
              </div>
            </div>
            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Forfeit</button>
            <button type="button" className="btn btn-primary" data-bs-dismiss="modal">Submit</button>
          </div>
        </div>
      </div>
    </>
  );
};