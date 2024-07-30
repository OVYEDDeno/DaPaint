import React, { useState, useEffect } from "react";
import "../../styles/wlsub.css';

export const Wlsub = () => {
  const [hostUser, setHostUser] = useState(null);
  const [foeUser, setFoeUser] = useState(null);
  const [location, setLocation] = useState('');
  const [distance, setDistance] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [hostVote, setHostVote] = useState(null);
  const [foeVote, setFoeVote] = useState(null);

  const handleFileUpload = (e, setUser) => {
    setUser(URL.createObjectURL(e.target.files[0]));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add submission logic here
  };

  return (
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
            <button type="button" onClick={() => setHostVote('yes')}>Yes</button>
            <button type="button" onClick={() => setHostVote('no')}>No</button>
          </div>
        </div>
        <div className="details-section">
          <div className="location">{location}</div>
          <div className="distance">{distance}</div>
          <div className="date">{date}</div>
          <div className="time">{time}</div>
        </div>
        <div className="user-section">
          <div className="upload-ko">
            <input
              type="file"
              accept="image/*,video/*"
              onChange={(e) => handleFileUpload(e, setFoeUser)}
            />
            <button type="button">Upload KO</button>
          </div>
          {foeUser && <img src={foeUser} alt="Foe User" className="user-img" />}
          <div className="user-vote">
            <button type="button" onClick={() => setFoeVote('yes')}>Yes</button>
            <button type="button" onClick={() => setFoeVote('no')}>No</button>
          </div>
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};