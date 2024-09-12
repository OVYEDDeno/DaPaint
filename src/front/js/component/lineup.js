import React, { useState, useEffect, useContext } from "react";
import { Context } from "../store/appContext";
import "../../styles/lineup.css";



export const Lineup = () => {
  const { store, actions } = useContext(Context);
  const [events, setEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const placeholderImage =
    "https://icons.iconarchive.com/icons/microsoft/fluentui-emoji-3d/512/Man-3d-Medium-Dark-icon.png";

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

  useEffect(() => {
    // Update component when userData changes
    console.log("Updated user data:", store.userData);
  }, [store.userData]);

  // Helper function to append a cache-busting query parameter
  const getProfileImageUrl = (url) => {
    return url ? `${url}?${new Date().getTime()}` : placeholderImage;
  };

  const matchups = events
    .filter((event) => event.hostFoeId)
    .map((event) => ({
      id: event.id,
      date_time: event.date_time,
      fitnessStyle: event.fitnessStyle,
      location: event.location,
      user1name: event.hostFoeId.name,
      user2name: event.foeId.name,
      user1Id: event.hostFoeId.id,
      user2Id: event.foeId.id,
      user1Image: getProfileImageUrl(event.hostFoeId.profileImageUrl),
      user2Image: getProfileImageUrl(event.foeId?.profileImageUrl),
    }));

  console.log("Matchups: ", matchups);

  const filteredMatchups = matchups.filter(
    (matchup) =>
      matchup.user1name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      matchup.user2name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const userId = store.userData.user?.id;

  const verifyTime = (timeOfMatch) => {
    let currentTime = new Date();
    let matchTime = new Date(timeOfMatch);
    let timeDifference = matchTime - currentTime;
    let hoursDifference = timeDifference / (1000 * 60 * 60);

    return hoursDifference >= 48;
  };

  return (
    <>
      <button
        type="button"
        className="btn btn-secondary btn-lg"
        data-bs-toggle="modal"
        data-bs-target="#lineUp"
      >
        <h1>🥇LINEUP🥇</h1>
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
                      <img src={matchup.user1Image} alt={matchup.user1name} />
                      <span>{matchup.user1name}</span>                  

                      {/* <button
                        onClick={() =>
                          window.open(
                            "https://www.twitch.tv/kaicenat",
                            "_blank"
                          )
                        }
                      >
                        Live
                      </button> */}
                      <div class="dropdown">
                        <button class="btn btn-secondary dropdown-toggle" type="button" id="drop" data-bs-toggle="dropdown" aria-expanded="false" >
                          Dropdown button
                        </button>
                        <ul class="dropdown-menu"  aria-labelledby="drop">
                          <li><a class="dropdown-item" href="#">Action</a></li>
                          <li><a class="dropdown-item" href="#">Another action</a></li>
                          <li><a class="dropdown-item" href="#">Something else here</a></li>
                        </ul>
                      </div>
                    </div>
                    <div className="vs">VS</div>
                    <div className="user">
                      <img src={matchup.user2Image} alt={matchup.user2name} />
                      <span>{matchup.user2name}</span>
                      <button
                        onClick={() =>
                          window.open(
                            "https://www.twitch.tv/kaicenat",
                            "_blank"
                          )
                        }
                      >
                        Live
                      </button>
                    </div>
                    <div className="details">
                      <span>{matchup.date_time}</span>
                      <span>{matchup.fitnessStyle}</span>
                      <span>{matchup.location}</span>
                    </div>
                    <div className="btn-group">
                      {userId === matchup.user1Id ||
                      userId === matchup.user2Id ? (
                        <button
                          className="bg-black text-white p-2 rounded"
                          onClick={() => {
                            if (verifyTime(matchup.date_time)) {
                              actions.cancelMatch(matchup.id);
                            } else {
                              actions.forfeitMatch(matchup.id);
                            }
                          }}
                        >
                          {verifyTime(matchup.date_time) ? "CANCEL" : "FORFEIT"}
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
