import React, { useState, useEffect } from "react";
import './lineup.css';

export const Lineup = () => {
  const matchups = [
    { id: 1, date: '7/12/24', time: '11 AM EST', location: 'BOXR GYM 3MILES', user1: 'OVYEDDenO', user2: 'JBEAT' },
    { id: 2, date: '7/12/24', time: '11 AM', location: 'BOXR GYM 3MILES', user1: 'OVYEDDenO', user2: 'JBEAT' },
    // Add more matchups as needed
  ];

  return (
    <div className="lineup">
      <div className="lineup-header">
        <h2>LINE UP</h2>
        <button className="close-button">X</button>
      </div>
      {matchups.map(matchup => (
        <div className="matchup" key={matchup.id}>
          <div className="user">
            <img src="path/to/ovye.png" alt="OVYEDDenO" />
            <span>{matchup.user1}</span>
          </div>
          <div className="vs">VS</div>
          <div className="user">
            <img src="path/to/jbeat.png" alt="JBEAT" />
            <span>{matchup.user2}</span>
          </div>
          <div className="details">
            <span>{matchup.date}</span>
            <span>{matchup.time}</span>
            <span>CLOCK IT</span>
            <span>{matchup.location}</span>
          </div>
        </div>
      ))}
    </div>
  );
};