import React, { useState } from 'react';
import '../../styles/wlsub.css';

export const Wlsub = () => {
  const [hostUser, setHostUser] = useState(null);
  const [foeUser, setFoeUser] = useState(null);
  const [hostVote, setHostVote] = useState(null);
  const [foeVote, setFoeVote] = useState(null);

  const handleFileUpload = (e, setUser) => {
    setUser(URL.createObjectURL(e.target.files[0]));
  };

  const handleHostVote = (vote) => {
    setHostVote(vote);
    if (vote === 'yes') {
      setFoeVote('no'); // Automatically set opponent's vote to 'no'
    }
  };

  const handleFoeVote = (vote) => {
    setFoeVote(vote);
    if (vote === 'yes') {
      setHostVote('no'); // Automatically set host's vote to 'no'
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token'); // Assuming JWT is stored in localStorage
    if (!token) {
      console.error('No token found');
      return;}
    try {
      const response = await fetch(process.env.BACKEND_URL+'/api/update-win-streak', { // Ensure this matches your Flask app's URL prefix
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // Include JWT token
        },
        body: JSON.stringify({ hostVote, foeVote }),
      });
      if (!response.ok) {
        throw new Error('Failed to update win streak');
      }
      const data = await response.json();
      console.log('Win streak updated:', data);
    } catch (error) {
      console.error('Error updating win streak:', error);
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
                        style={{ backgroundColor: hostVote === 'yes' ? 'green' : 'black' }}
                        onClick={() => handleHostVote('yes')}>Yes</button>
                      <button
                        type="button"
                        style={{ backgroundColor: hostVote === 'no' ? 'red' : 'black' }}
                        onClick={() => handleHostVote('no')}>No</button>
                    </div>
                  </div>
                  <div className="user-section">
                    {foeUser && <img src={foeUser} alt="Foe User" className="user-img" />}
                    <div className="user-vote">
                      <button
                        type="button"
                        style={{ backgroundColor: foeVote === 'yes' ? 'green' : 'black' }}
                        onClick={() => handleFoeVote('yes')}>Yes</button>
                      <button
                        type="button"
                        style={{ backgroundColor: foeVote === 'no' ? 'red' : 'black' }}
                        onClick={() => handleFoeVote('no')}>No</button>
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