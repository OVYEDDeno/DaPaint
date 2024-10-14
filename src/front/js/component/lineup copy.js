import React, { useState, useEffect, useContext } from "react";
import { Context } from "../store/appContext";
import "../../styles/lineup.css";
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import QRCode from 'qrcode';

export const Lineup = () => {
  const { store, actions } = useContext(Context);
  const [events, setEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [targetZipcode, setTargetZipcode] = useState(null);
  const [ticketTracker, setTicketTracker] = useState({});
  const [selectedFitnessStyle, setSelectedFitnessStyle] = useState("");

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
    async function getUserInfo() {
      let success = await actions.fetchCurrentUser();
      if (success) {
        setTargetZipcode(store.userData.user.zipcode);
        console.log("Updated user data:", store.userData);
      }
    }
    getUserInfo();
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
        const response = await fetch(
          `${process.env.BACKEND_URL}/api/link-request/${platform}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify({ indulgerId: userId }),
          }
        );

        if (response.ok) {
          alert(`Request sent to add ${platform} link.`);
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
          <div className="d-grid gap-2" key={platform.key}>
            {platform.url ? (
              <button
                onClick={() => {
                  // Ensure the URL has the full format
                  let fullUrl = platform.url.startsWith("http")
                    ? platform.url
                    : `https://${platform.url}`;
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
                Request {platform.key}
              </button>
            )}
          </div>
        ))}
      </div>
    );
  };
  const isCloseZipcode = (userZipcode, targetZipcode, range = 100) => {
    return Math.abs(parseInt(userZipcode) - parseInt(targetZipcode)) <= range;
  };

  const matchups = events
    .filter(
      (event) =>
        event &&
        event.hostFoeId &&
        event.hostFoeId.zipcode &&
        targetZipcode &&
        isCloseZipcode(event.hostFoeId.zipcode, targetZipcode)
    )
    .map((event) => ({
      id: event.id,
      date_time: event.date_time,
      fitnessStyle: event.fitnessStyle,
      location: event.location,
      user1name: event.hostFoeId.name,
      user2name: event.foeId.name,
      user1Id: event.hostFoeId.id,
      user2Id: event.foeId.id,
      user1Image: getProfileImageUrl(event.hostFoeId.profile_pic?.image_url),
      user2Image: getProfileImageUrl(event.foeId.profile_pic?.image_url),
      hostFoeId: event.hostFoeId,
      foeId: event.foeId,
      price: event.price,
    }));

  const filteredMatchups = matchups.filter((matchup) => {
    if (!matchup || !matchup.user1name || !matchup.user2name) {
      return false;
    }

    const matchesSearch =
      matchup.user1name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      matchup.user2name.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFitnessStyle =
      selectedFitnessStyle === "" ||
      matchup.fitnessStyle === selectedFitnessStyle;

    return matchesSearch && matchesFitnessStyle;
  });
  const handleFitnessStyleChange = (e) => {
    setSelectedFitnessStyle(e.target.value);
  };
  const userId = store.userData.user?.id;

  // Verify the match time
  const verifyTime = (timeOfMatch) => {
    let currentTime = new Date();
    let matchTime = new Date(timeOfMatch);
    let timeDifference = matchTime - currentTime;
    let hoursDifference = timeDifference / (1000 * 60 * 60);

    return hoursDifference >= 48;
  };

  function convertTo12Hr(timeStr) {
    // Create a Date object from the input string
    const date = new Date(timeStr);

    // Extract hours, minutes, and seconds
    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const seconds = date.getSeconds().toString().padStart(2, "0");

    // Determine AM or PM
    const ampm = hours >= 12 ? "PM" : "AM";

    // Convert hours to 12-hour format
    hours = hours % 12;
    hours = hours ? hours : 12; // Handle midnight (0 should be 12)

    // Format the date part (MM/DD/YYYY)
    const formattedDate =
      (date.getMonth() + 1).toString().padStart(2, "0") +
      "/" +
      date.getDate().toString().padStart(2, "0") +
      "/" +
      date.getFullYear();

    // Return formatted time in 12-hour format
    return `${formattedDate} ${hours}:${minutes}:${seconds} ${ampm}`;
  }

  useEffect(() => {
    if (filteredMatchups.length > 0) {
      const newTicketTracker = {};
      filteredMatchups.forEach((value) => {
        newTicketTracker[value.id] = {
          Tickets: 1,
          Price: value.price,
        };
      });
      setTicketTracker(newTicketTracker);
    }
  }, []);

  function getMatchList() {
    return filteredMatchups.length ? filteredMatchups : store.daPaintList;
  }

  const handleTicketIncrement = (matchupId) => {
    setTicketTracker((prevState) => ({
      ...prevState,
      [matchupId]: {
        ...prevState[matchupId],
        Tickets: (prevState[matchupId]?.Tickets || 0) + 1,
      },
    }));
  };

  const handleTicketDecrement = (matchupId) => {
    setTicketTracker((prevState) => ({
      ...prevState,
      [matchupId]: {
        ...prevState[matchupId],
        Tickets: Math.max((prevState[matchupId]?.Tickets || 0) - 1, 1), // Ensure minimum of 1 ticket
      },
    }));
  };

  const initialOptions = {
    clientId:
      "Ab3UDlPb82gsZcwSr7TDWewUxS8yUygIDlBBegXaDPolaA4PGtzqSG-rx6sDkg--HjtZ88XVGJycQbLz",
    currency: "USD",
    intent: "capture",
  };
  const handleApprove = async (data, dapaintId) => {
    let qr_codes = [];
    const generateInviteCode = () => {
      return Math.random().toString(36).substring(2, 10).toUpperCase();
    };
  
    const generateQRCode = async (inviteCode) => {
      try {
        const qrCodeDataUrl = await QRCode.toDataURL(inviteCode);
        return qrCodeDataUrl;
      } catch (error) {
        console.error('Error generating QR code:', error);
        return null;
      }
    };
  
    // Get the correct number of tickets from ticketTracker
    const ticketCount = ticketTracker[dapaintId]?.Tickets || 1;
  
    for (let i = 0; i < ticketCount; i++) {
      const inviteCode = generateInviteCode();
      const qrCodeDataUrl = await generateQRCode(inviteCode);
      if (qrCodeDataUrl) {
        qr_codes.push({
          qr_code_path: qrCodeDataUrl,
          ticket_code: inviteCode,
        });
      }
    }
  
    try {
      const response = await fetch(process.env.BACKEND_URL + "/api/capture-paypal-order", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          paypal_id: data.orderID,
          type_of_order: "ticket_purchase",
          dapaint_id: dapaintId,
          qr_codes: qr_codes,
        }),
      });
  
      const orderData = await response.json();
  
      // Get references to both modals
      const lineUpModal = document.getElementById("lineUp");
      const TicketModal = document.getElementById("Ticket");
  
      // Hide the lineUp modal
      const bsModallineUp = bootstrap.Modal.getInstance(lineUpModal);
      bsModallineUp.hide();
  
      // Use a small delay to ensure the first modal is fully hidden
      setTimeout(() => {
        // Show the Ticket modal
        const bsModalTicket = new bootstrap.Modal(TicketModal);
        bsModalTicket.show();
      }, 300);
  
      return orderData;
    } catch (error) {
      console.error('Error processing order:', error);
      // Handle the error appropriately (e.g., show an error message to the user)
    }
  };

  return (
    <>
      <button
        type="button"
        className="btn-secondary btn-lg"
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
            <div className="profile-header">
              <h1 className="profile-title" id="lineUpLabel">
                LINEUP
              </h1>
              <img
                data-bs-dismiss="modal"
                src="https://icons.iconarchive.com/icons/microsoft/fluentui-emoji-flat/512/Cross-Mark-Flat-icon.png"
                alt="Close"
                className="profile-close"
              />
            </div>
            <div className="profile-container">
              <div className="m-2">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search for a user..."
                  className="form-control mb-3"
                />
                <select
                  value={selectedFitnessStyle}
                  onChange={handleFitnessStyleChange}
                  className="form-control mb-3"
                >
                  <option value="">Any Fitness Style</option>
                  <option value="basketball">Basketball</option>
                  <option value="boxing">Boxing</option>
                  <option value="racquetball">Racquetball/Squash</option>
                  <option value="tennis">Tennis</option>
                  <option value="pickleball">Pickleball</option>
                  <option value="golf">Golf</option>
                  <option value="volleyball">Volleyball</option>
                  <option value="badminton">Badminton</option>
                  <option value="tableTennis">Table Tennis</option>
                  <option value="breakDancing">Break Dancing</option>
                </select>
              </div>

              <div className="lineup">
                {getMatchList().map((matchup) => (
                  <>
                    <div className="matchup" key={matchup.id}>
                      <div className="user">
                        <img src={matchup.user1Image} alt={matchup.user1name} />
                        <span>{matchup.user1name}</span>
                        {/* <p className="d-inline-flex gap-1"> */}
                        <button
                          className="btn-primary"
                          type="button"
                          data-bs-toggle="collapse"
                          data-bs-target={`#collapseUser1-${matchup.id}`}
                          aria-expanded="false"
                          aria-controls={`collapseUser1-${matchup.id}`}
                        >
                          LIVE
                        </button>
                        {/* </p> */}
                        <div
                          className="collapse"
                          id={`collapseUser1-${matchup.id}`}
                        >
                          <div>
                            {SocialMediaButtons(
                              matchup.hostFoeId,
                              matchup.user1Id
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="vs p-1" style={{ fontSize: "34px" }}>
                        VS
                      </div>

                      <div className="user">
                        <img src={matchup.user2Image} alt={matchup.user2name} />
                        <span>{matchup.user2name}</span>
                        {/* <p className="d-inline-flex p-10"> */}
                        <button
                          className="btn-primary"
                          type="button"
                          data-bs-toggle="collapse"
                          data-bs-target={`#collapseUser2-${matchup.id}`}
                          aria-expanded="false"
                          aria-controls={`collapseUser2-${matchup.id}`}
                        >
                          LIVE
                        </button>
                        {/* </p> */}
                        <div
                          className="collapse"
                          id={`collapseUser2-${matchup.id}`}
                        >
                          <div className="profile-container">
                            {SocialMediaButtons(matchup.foeId, matchup.user2Id)}
                          </div>
                        </div>
                      </div>
                      <div className="details">
                        <span>{convertTo12Hr(matchup.date_time)}</span>
                        <span>{matchup.fitnessStyle}</span>
                        <span>{matchup.location}</span>

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
                              {verifyTime(matchup.date_time)
                                ? "CANCEL"
                                : "FORFEIT"}
                            </button>
                          ) : (
                            <>
                              <button
                                className="bg-black text-white p-2 rounded"
                                type="button"
                                data-bs-toggle="collapse"
                                data-bs-target={`#collapseTicket-${matchup.id}`}
                                aria-expanded="false"
                                aria-controls={`collapseTicket-${matchup.id}`}
                              >
                                BUY TICKETS
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <div
                      className="collapse"
                      id={`collapseTicket-${matchup.id}`}
                    >
                      <div className="profile-container">
                        <div className="ticket-row">
                          <div className="ticket-info">
                            <p>General Admission</p>
                            <p>
                              $
                              {(ticketTracker[matchup.id]?.Price ||
                                matchup.price) *
                                (ticketTracker[matchup.id]?.Tickets || 1)}
                            </p>
                          </div>
                          <div className="ticket-controls">
                            <button
                              onClick={() => handleTicketDecrement(matchup.id)}
                            >
                              -
                            </button>
                            <span>
                              {ticketTracker[matchup.id]?.Tickets || 1}
                            </span>
                            <button
                              onClick={() => handleTicketIncrement(matchup.id)}
                            >
                              +
                            </button>
                          </div>
                        </div>
                        <PayPalScriptProvider options={initialOptions}>
                          <PayPalButtons
                            createOrder={(data, actions) => {
                              // Get the current ticket count and price from ticketTracker
                              const ticketCount =
                                ticketTracker[matchup.id]?.Tickets || 1;
                              const ticketPrice =
                                ticketTracker[matchup.id]?.Price ||
                                matchup.price;
                              const totalAmount = ticketCount * ticketPrice;

                              return actions.order.create({
                                purchase_units: [
                                  {
                                    amount: {
                                      value: totalAmount.toFixed(2),
                                    },
                                  },
                                ],
                              });
                            }}
                            // onApprove={(e)=>handleApprove(e,matchup.id)}
                            onApprove={(data, actions) => handleApprove(data, matchup.id)}
                          />
                        </PayPalScriptProvider>
                        <p>All Ticket Sales are Final.</p>
                      </div>
                    </div>
                  </>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
