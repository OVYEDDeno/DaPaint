import React, { useState, useEffect, useContext } from "react";
import { Context } from "../store/appContext";
import '../../styles/lineup.css';

export const Lineup = () => {
  const { store, actions } = useContext(Context);
  const [events, setEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

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
  }, []);

  // Transform events into matchups
  const matchups = events
    .filter(event => event.hostFoeId)
    .map(event => ({
      id: event.id,
      date_time: event.date_time,
      // time: event.time,
      // location: `${event.location} ${event.distance}`,
      location: `${event.location}`,
      user1: event.hostFoeId.name,
      user2: event.foeId ? event.foeId.name : 'Unknown'
    }));

    console.log("Matchups: ", matchups);

  // Filter matchups based on search term
  const filteredMatchups = matchups.filter(matchup =>
    matchup.user1.toLowerCase().includes(searchTerm.toLowerCase()) ||
    matchup.user2.toLowerCase().includes(searchTerm.toLowerCase())
  );
  //  handleBuyTicket

  return (
    <>
      <button type="button" className="btn btn-info" data-bs-toggle="modal" data-bs-target="#lineUp">
        LINE UP
      </button>
      <div className="modal fade" id="lineUp" aria-labelledby="lineUp" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-body">
              <div className="modal-header">
                <h5 className="modal-title" id="lineUpLabel">LINEUP</h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search for a user..."
                className="form-control mb-3"
              />
              <div className="lineup">
                {filteredMatchups.map(matchup => (
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
                      <span>{`${matchup.date_time}`}</span>
                      {/* <span>{matchup.time}</span> */}
                      {/* <button className= "btn" onClick={handleBuyTicket}>Clock It</button> */}
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