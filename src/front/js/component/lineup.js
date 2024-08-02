import React, { useState, useEffect } from "react";
import '../../styles/lineup.css';

export const Lineup = () => {
  const matchups = [
    { id: 1, date: '7/12/24', time: '11 AM EST', location: 'BOXR GYM 3MILES', user1: 'OVYEDDenO', user2: 'JBEAT' },
    { id: 2, date: '7/12/24', time: '11 AM', location: 'BOXR GYM 3MILES', user1: 'OVYEDDenO', user2: 'JBEAT' },
    // Add more matchups as needed
  ];

  useEffect(() => {
    const token = localStorage.getItem("token")
    async function getDapaintList(){
      try {
        const response = await fetch(`${process.env.BACKEND_URL}/api/lineup?isaccepted=1`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          
        });

        if (response.ok) {
          const EventList = await response.json();
          console.log('Lists event:', EventList);
          setEvents(EventList)
        } else {
          const error = await response.json();
          console.error('Failed to retrieve list of events:', error);
        }
      } catch (error) {
        console.error('Error:', error);
      }
      
    }

    getDapaintList()
    
  }, [])

  return (
    <><button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#lineUp">
      LINE UP
    </button>
    <div class="modal fade" id="lineUp" tabindex="-1" aria-labelledby="lineUp" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h1 class="modal-title fs-5" id="lineUp">LINE UP</h1>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
      <div className="lineup">
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
      </div>      
    </div>
  </div>
</div></>
  );
};