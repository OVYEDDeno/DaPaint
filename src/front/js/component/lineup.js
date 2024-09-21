import React, { useState, useEffect, useContext } from "react";
import { Context } from "../store/appContext";
import "../../styles/lineup.css";

export const Lineup = () => {
  const { store, actions } = useContext(Context);
  const [events, setEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const placeholderImage =
    "https://icons.iconarchive.com/icons/microsoft/fluentui-emoji-3d/512/Man-3d-Medium-Dark-icon.png";

  // Function to fetch the data for the lineup
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

  // Fetch current user data
  useEffect(() => {
    actions.fetchCurrentUser();
    console.log("Updated user data:", store.userData);
  }, []);

  // Function to dynamically return the profile image URL or placeholder
  const getProfileImageUrl = (url) => {
    return url ? `${url}?${new Date().getTime()}` : placeholderImage;
  };

  // Function for social media buttons
  const SocialMediaButtons = (user, userId) => {
    const platforms = [
      { key: "instagram", url: user.instagram_url },
      { key: "tiktok", url: user.tiktok_url },
      { key: "twitch", url: user.twitch_url },
      { key: "kick", url: user.kick_url },
      { key: "youtube", url: user.youtube_url },
      { key: "twitter", url: user.twitter_url },
      { key: "facebook", url: user.facebook_url },
    ];

    const sendNotification = async (platform) => {
      try {
        const response = await fetch(`${process.env.BACKEND_URL}/api/link-request/${platform}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ indulgerId: userId }),
        });

        if (response.ok) {
          alert(`Notification sent to add ${platform} link.`);
        } else {
          alert("Failed to send notification.");
        }
      } catch (error) {
        console.error("Error sending notification:", error);
      }
    };

    return (
      <div className="social-media-buttons">
        {platforms.map((platform) => (
          <div key={platform.key}>
            {platform.url ? (
             <button
             onClick={() => {
               // Ensure the URL has the full format
               let fullUrl = platform.url.startsWith("http") ? platform.url : `https://${platform.url}`;
               window.open(fullUrl, "_blank");
             }}
             className={`${platform.key}-button`}
           >
             {platform.key}
           </button>
            ) : (
              <button
                onClick={() => sendNotification(platform.key)}
                className="notification-button"
              >
                Request {platform.key} Link
              </button>
            )}
          </div>
        ))}
      </div>
    );
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
      hostFoeId: event.hostFoeId,
      foeId: event.foeId,
    }));

  const filteredMatchups = matchups.filter(
    (matchup) =>
      matchup.user1name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      matchup.user2name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const userId = store.userData.user?.id;

  // Verify the match time
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
                <img
                data-bs-dismiss="modal"
                src="https://icons.iconarchive.com/icons/microsoft/fluentui-emoji-flat/512/Cross-Mark-Flat-icon.png"
                alt="Close"
                className="profile-close"
              />
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
                      <p className="d-inline-flex gap-1">
                        <button
                          className="btn btn-primary"
                          type="button"
                          data-bs-toggle="collapse"
                          data-bs-target={`#collapseUser1-${matchup.id}`}
                          aria-expanded="false"
                          aria-controls={`collapseUser1-${matchup.id}`}
                        >
                          Live
                        </button>
                      </p>
                      <div className="collapse" id={`collapseUser1-${matchup.id}`}>
                        <div className="card card-body">
                          {SocialMediaButtons(matchup.hostFoeId, matchup.user1Id)}
                        </div>
                      </div>
                    </div>
                    <div className="vs">VS</div>
                    <div className="user">
                      <img src={matchup.user2Image} alt={matchup.user2name} />
                      <span>{matchup.user2name}</span>
                      <p className="d-inline-flex gap-1">
                        <button
                          className="btn btn-primary"
                          type="button"
                          data-bs-toggle="collapse"
                          data-bs-target={`#collapseUser2-${matchup.id}`}
                          aria-expanded="false"
                          aria-controls={`collapseUser2-${matchup.id}`}
                        >
                          Live
                        </button>
                      </p>
                      <div className="collapse" id={`collapseUser2-${matchup.id}`}>
                        <div className="card card-body">
                          {SocialMediaButtons(matchup.foeId, matchup.user2Id)}
                        </div>
                      </div>
                    </div>
                    <div className="details">
                      <span>{matchup.date_time}</span>
                      <span>{matchup.fitnessStyle}</span>
                      <span>{matchup.location}</span>
                    </div>
                    <div className="btn-group">
                      {userId === matchup.user1Id || userId === matchup.user2Id ? (
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
