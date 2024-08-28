import React, { useState, useContext } from "react";
import "../../styles/start.css";
import { Context } from "../store/appContext";

export const Start = () => {
  const [hostUser, setHostUser] = useState(null);
  const [foeUser, setFoeUser] = useState(null);
  const [hostVote, setHostVote] = useState(null);
  const [winType, setWinType] = useState('KO');
  const { store, actions } = useContext(Context);
  const [foeVote, setFoeVote] = useState(null);

  const handleFileUpload = (e, setUser) => {
    setUser(URL.createObjectURL(e.target.files[0]));
  };

  const handleHostVote = (vote) => {
    setHostVote(vote);
    setFoeVote(vote === 'winner' ? 'loser' : 'winner');
  };

  const handleFoeVote = (vote) => {
    setFoeVote(vote);
    setHostVote(vote === 'winner' ? 'loser' : 'winner');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!store.userData.dapaintId) {
      alert("No valid event found for this user");
      return;
    }

    let result = await actions.updateWinstreak(store.userData.dapaintId, hostVote, winType);
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
        className="btn btn-secondary"
        data-bs-toggle="modal"
        data-bs-target="#startModal"
      >
        <h1>👊🏾START👊🏾</h1>
      </button>

      <div className="modal fade" id="startModal" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="startModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title" id="startModalLabel">Who Won?</h1>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
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
                      <button type="button" className='rounded-lg'>Upload KO</button>
                    </div>
                    <div className="win-type-radio">
                      <label style={{ marginRight: '10px' }}>
                        <input
                          type="radio"
                          name="winType"
                          value="KO"
                          checked={winType === 'KO'}
                          onChange={() => setWinType('KO')}
                          style={{ marginRight: '5px' }}
                        />
                        Win By KO
                      </label>
                      <label>
                        <input
                          type="radio"
                          name="winType"
                          value="Sub"
                          checked={winType === 'Sub'}
                          onChange={() => setWinType('Sub')}
                          style={{ marginRight: '5px' }}
                        />
                        Win By Sub
                      </label>
                    </div>
                    {hostUser && <img src={hostUser} alt="Host User" className="user-img" />}
                    <div className="user-vote">
                      <span>{store.userData.players.host.name}</span>
                      <button
                        type="button"
                        className='rounded-lg'
                        style={{ backgroundColor: hostVote === 'winner' ? 'green' : 'black' }}
                        onClick={() => handleHostVote('winner')}
                      >
                        Winner
                      </button>
                      <button
                        type="button"
                        className='rounded-lg'
                        style={{ backgroundColor: hostVote === 'loser' ? 'red' : 'black' }}
                        onClick={() => handleHostVote('loser')}
                      >
                        Loser
                      </button>
                    </div>
                  </div>
                  <div className="user-section">
                    {foeUser && <img src={foeUser} alt="Foe User" className="user-img" />}
                    <div className="user-vote">
                      <span>{store.userData.players.foe.name}</span>
                      <button
                        type="button"
                        className='rounded-lg'
                        style={{
                          backgroundColor: foeVote === 'winner' ? '#f5c116' : 'black',
                          color: foeVote === 'winner' ? 'black' : '#f5c116'
                        }}
                        onClick={() => handleFoeVote('winner')}
                      >
                        Winner
                      </button>
                      <button
                        type="button"
                        className='rounded-lg'
                        style={{ backgroundColor: foeVote === 'loser' ? 'red' : 'black' }}
                        onClick={() => handleFoeVote('loser')}
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
