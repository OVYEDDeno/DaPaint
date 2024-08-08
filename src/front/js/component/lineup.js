import React, { useState, useEffect, useContext } from "react";
import { Context } from "../store/appContext";

import '../../styles/lineup.css';

export const Lineup = () => {
  const { store, actions } = useContext(Context);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    async function getDapaintList() {
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
          setEvents(EventList);
        } else {
          const error = await response.json();
          console.error('Failed to retrieve list of events:', error);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    }

    getDapaintList();
  }, []); // Remove events from dependency array to avoid infinite loop

  // Transform events into matchups
  const matchups = events
    .filter(event => event.hostFoeId) // Only include events with a hostFoeId
    .map(event => ({
      id: event.id,
      date: event.date,
      time: event.time,
      location: `${event.location} ${event.distance}`,
      user1: event.hostFoeId.name,
      user2: event.foeId ? event.foeId.name : 'Unknown'
    }));

  return (
    <>
      <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#lineUp">
        LINE UP
      </button>
      <div className="modal fade" id="lineUp" aria-labelledby="lineUp" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-body">
              <div className="lineup">
                {matchups.map(matchup => (
                  <div className="matchup" key={matchup.id}>
                    <div className="user">
                      <img src="path/to/ovye.png" alt={matchup.user1} />
                      <span>{matchup.user1}</span>
                    </div>
                    <div className="vs">VS</div>
                    <div className="user">
                      <img src="path/to/jbeat.png" alt={matchup.user2} />
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
      </div>
    </>
  );
};
