import React, { useState, useEffect, useContext } from "react";
import { Context } from "../store/appContext";
import "../../styles/lineup.css";

export const Lineup = () => {
  const { store, actions } = useContext(Context);
  const [events, setEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [forfeit, setForfeit] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");

    async function getDapaintList() {
      try {
        const response = await fetch(
          `${process.env.BACKEND_URL}/api/lineup?isaccepted=1`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          const EventList = await response.json();
          setEvents(EventList);
          console.log("EventList from lineup.js: ", EventList);
        } else {
          const error = await response.json();
          console.error("Failed to retrieve list of events:", error);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    }

    getDapaintList();
  }, []);

  // Transform events into matchups
  const matchups = events
    .filter((event) => event.hostFoeId)
    .map((event) => ({
      id: event.id,
      date_time: event.date_time,
      fitnessStyle: event.fitnessStyle,
      // time: event.time,
      // location: `${event.location} ${event.distance}`,
      location: event.location,
      user1name: event.hostFoeId.name,
      user2name: event.foeId.name,
      user1Id: event.hostFoeId.id,
      user2Id: event.foeId.id,
    }));

  console.log("Matchups: ", matchups);

  // Filter matchups based on search term
  const filteredMatchups = matchups.filter(
    (matchup) =>
      matchup.user1name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      matchup.user2name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  //  handleBuyTicket

  console.log("user data from store(lineup): ", store.userData);
  const userId = store.userData.id;
  console.log("user id from (lineup)", userId);
  //
  const verifyTime = (timeOfMatch) => {
    let currentTime = new Date();
    console.log("Current Time: " + currentTime);
    console.log("Time of Match: " + timeOfMatch);

    // Ensure timeOfMatch is a Date object
    let matchTime = new Date(timeOfMatch);

    // Calculate the difference in milliseconds
    let timeDifference = matchTime - currentTime;

    // Convert milliseconds to hours
    let hoursDifference = timeDifference / (1000 * 60 * 60);

    // Check if the current time is less than 48 hours from the time of the match
    if (hoursDifference < 48) {
        console.log("Time is less than 48 hours from the match.");
        return false;
    } else {
        console.log("Time is more than 48 hours from the match.");
        return true;
    }
};

  return (
    <>
      <button
        type="button"
        className="btn btn-info"
        data-bs-toggle="modal"
        data-bs-target="#lineUp"
      >
        LINE UP
      </button>
      <div
        className="modal fade"
        id="lineUp"
        aria-labelledby="lineUp"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-body">
              <div className="modal-header">
                <h5 className="modal-title" id="lineUpLabel">
                  LINEUP
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search for a user..."
                className="form-control mb-3"
              />
              <div className="lineup">
                {filteredMatchups.map((matchup) => (
                  <div className="matchup" key={matchup.id}>
                    <div className="user">
                      <img src="path/to/ovye.png" alt={matchup.user1name} />
                      <span>{matchup.user1name}</span>
                    </div>
                    <div className="vs">VS</div>
                    <div className="user">
                      <img src="path/to/jbeat.png" alt={matchup.user2name} />
                      <span>{matchup.user2name}</span>
                    </div>
                    <div className="details">
                      <span>{matchup.date_time}</span>
                      <span>{matchup.fitnessStyle}</span>
                      <span>{matchup.location}</span>
                    </div>
                    <div className="btn-group">
                      {userId === matchup.user1Id ||
                      userId === matchup.user2Id ? (
                        <button className="bg-black text-white p-2 rounded" onClick={()=>{
                          verifyTime(matchup.date_time);
                          if (verifyTime(matchup.date_time)) {
                            actions.forfeitMatch(matchup.id)
                          }
                            else {
                              actions.cancelMatch(matchup.id)
                            }

                        }}>
                          CANCEL (FORFEIT)
                        </button>
                      ) : (
                        <button className="bg-black text-white p-2 rounded">
                          BUY TICKETS
                        </button>
                      )}
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
