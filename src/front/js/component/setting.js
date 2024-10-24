import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/setting.css";
import { Context } from "../store/appContext";
import QRCode from "qrcode";

export const Setting = ({ onClose }) => {
  const { store, actions } = useContext(Context);
  const navigate = useNavigate();
  const [isActive, setIsActive] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [rating, setRating] = useState(0);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [qrCodes, setQrCodes] = useState(Array(9).fill(null));
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [showOldTickets, setShowOldTickets] = useState(false);
  const placeholderImage =
    "https://icons.iconarchive.com/icons/microsoft/fluentui-emoji-3d/512/Man-3d-Medium-Dark-icon.png";

  const handleRatingChange = (value) => {
    setRating(value);
  };

  useEffect(() => {
    const fetchUserStatus = async () => {
      await actions.fetchCurrentUser();
      if (store.userData && store.userData.user) {
        setName(store.userData.user.name || "");
        setEmail(store.userData.user.email || "");
      }
    };

    fetchUserStatus();
  }, []);

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    if (!feedback || rating === 0) {
      alert("Please provide both feedback and rating.");
      return;
    }
    try {
      const response = await actions.submitFeedback(feedback, rating);
      if (response && response.msg) {
        alert(response.msg);
        setFeedback("");
        setRating(0);
      }
    } catch (error) {
      console.error("Error submitting feedback:", error);
      alert("There was an error submitting your feedback. Please try again.");
    }
  };

  const toggleActiveStatus = async () => {
    let options = {
      method: "PUT",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
        "Content-Type": "application/json",
      },
    };

    let response = await fetch(process.env.BACKEND_URL + "/api/act", options);
    if (response.status !== 200) {
      console.log("Error updating user status: ", response.statusText);
      alert("Error updating user status");
    } else {
      setIsActive(!isActive);
      await actions.fetchCurrentUser();
    }
  };

  const handleLogout = () => {
    document.body.classList.remove("modal-open");
    const overlay = document.querySelector(".modal-backdrop");
    if (overlay) {
      overlay.remove();
    }

    localStorage.removeItem("token");
    console.log("Log out successful");
    navigate("/");
  };

  const generateInviteCode = () => {
    return Math.random().toString(36).substring(2, 10).toUpperCase();
  };

  const generateQRCode = async (inviteCode) => {
    try {
      const qrCodeDataUrl = await QRCode.toDataURL(inviteCode);
      return qrCodeDataUrl;
    } catch (error) {
      console.error("Error generating QR code:", error);
      return null;
    }
  };

  const toggleQRCode = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };
  useEffect(() => {
    const getTicketsinfo = async () => {
      let success = await actions.getTickets();
      if (success) {
        console.log("Updated tickets info:", store.tickets);
      }
    };
    getTicketsinfo();
  }, []);
  const currentDate = new Date();

  // Function to determine if a ticket is old (more than 24 hours old)
  const isOldTicket = (ticketDate) => {
    const ticketDateTime = new Date(ticketDate);
    const diffInHours = (currentDate - ticketDateTime) / (1000 * 60 * 60);
    return diffInHours > 24;
  };

  // Separate current and old tickets
  const sortTickets = () => {
    const current = [];
    const old = [];

    store.userData?.user?.tickets?.forEach((ticket) => {
      if (isOldTicket(ticket.dapaint.date_time)) {
        old.push(ticket);
      } else {
        current.push(ticket);
      }
    });

    return { current, old };
  };

  const { current, old } = sortTickets();

  return (
    <>
      <div
        className="modal fade"
        id="exampleModalToggle"
        aria-hidden="true"
        aria-labelledby="exampleModalToggleLabel"
        tabIndex="-1"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="invite-header">
              {/* <img
                data-bs-target="#exampleModalToggle"
                data-bs-toggle="modal"
                src="https://icons.iconarchive.com/icons/microsoft/fluentui-emoji-3d/512/Back-Arrow-3d-icon.png"
                alt="Back"
                className="invite-close"
              /> */}
              <h1 className="invite-title">
                SETTING
                <img
                  data-bs-dismiss="modal"
                  src="https://icons.iconarchive.com/icons/microsoft/fluentui-emoji-flat/512/Cross-Mark-Flat-icon.png"
                  alt="Close"
                  className="invite-close"
                />
              </h1>
            </div>

            <div className="profile-container">
              <button
                className="btn btn-secondary"
                data-bs-target="#exampleModalToggle2"
                data-bs-toggle="modal"
              >
                <h5>FEEDBACK</h5>
              </button>
              <button
                className="btn btn-secondary"
                data-bs-target="#exampleModalToggle3"
                data-bs-toggle="modal"
              >
                <h5>HOW TO PLAY</h5>
              </button>
              <button
                className="btn btn-secondary"
                data-bs-target="#Ticket"
                data-bs-toggle="modal"
              >
                <h5>TICKETS</h5>
              </button>
              <button
                className="btn btn-secondary"
                data-bs-target="#exampleModalToggle6"
                data-bs-toggle="modal"
              >
                <h5>CLOCK OUT</h5>
              </button>
            </div>
          </div>
        </div>
      </div>
      <div
        className="modal fade"
        id="exampleModalToggle2"
        aria-hidden="true"
        aria-labelledby="exampleModalToggleLabel2"
        tabIndex="-1"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="invite-header">
              <img
                data-bs-target="#exampleModalToggle"
                data-bs-toggle="modal"
                src="https://icons.iconarchive.com/icons/microsoft/fluentui-emoji-3d/512/Back-Arrow-3d-icon.png"
                alt="Back"
                className="invite-close"
              />
              <h1 className="invite-title">
                FEEDBACK
                <img
                  data-bs-dismiss="modal"
                  src="https://icons.iconarchive.com/icons/microsoft/fluentui-emoji-flat/512/Cross-Mark-Flat-icon.png"
                  alt="Close"
                  className="invite-close"
                />
              </h1>
            </div>

            <div className="profile-container">
              <form onSubmit={handleFeedbackSubmit}>
                <div className="star-rating">
                  {[5, 4, 3, 2, 1].map((star) => (
                    <React.Fragment key={star}>
                      <input
                        type="radio"
                        id={`star-${star}`}
                        name="star-radio"
                        value={star}
                        checked={rating === star}
                        onChange={() => handleRatingChange(star)}
                        className="visually-hidden"
                      />
                      <label htmlFor={`star-${star}`} className="star-label">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                        >
                          <path
                            pathLength="360"
                            d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z"
                          />
                        </svg>
                      </label>
                    </React.Fragment>
                  ))}
                </div>
                <textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Enter your feedback here"
                  required
                />
                <button type="submit">Submit Feedback</button>
              </form>
            </div>
          </div>
        </div>
      </div>
      <div
        className="modal fade"
        id="exampleModalToggle3"
        aria-hidden="true"
        aria-labelledby="exampleModalToggleLabel3"
        tabIndex="-1"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="invite-header">
              <img
                data-bs-target="#exampleModalToggle"
                data-bs-toggle="modal"
                src="https://icons.iconarchive.com/icons/microsoft/fluentui-emoji-3d/512/Back-Arrow-3d-icon.png"
                alt="Back"
                className="invite-close"
              />
              <h1 className="invite-title">
                HOW TO PLAY
                <img
                  data-bs-dismiss="modal"
                  src="https://icons.iconarchive.com/icons/microsoft/fluentui-emoji-flat/512/Cross-Mark-Flat-icon.png"
                  alt="Close"
                  className="invite-close"
                />
              </h1>
            </div>

            <div className="profile-container">
              <ol>
                TAP the "Find Foe" button.
                <br />
                Locate a host who is challenging you in a sport.
                <br />
                TAP "Clock In."
                <br />
                Spread the word to sell tickets to your match.
                <br />
                TAP "Start."
                <br />
                Submit your footage/result of the match.
                <br />
                Repeat until you reach **30 win streaks** for your reward!
                <br />
              </ol>
            </div>
          </div>
        </div>
      </div>
      <div
        className="modal fade"
        id="Ticket"
        aria-hidden="true"
        aria-labelledby="exampleModalToggleLabel4"
        tabIndex="-1"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="invite-header">
              <img
                data-bs-target="#exampleModalToggle"
                data-bs-toggle="modal"
                src="https://icons.iconarchive.com/icons/microsoft/fluentui-emoji-3d/512/Back-Arrow-3d-icon.png"
                alt="Back"
                className="invite-close"
              />
              <h1 className="invite-title">
                TICKETS
                <img
                  data-bs-dismiss="modal"
                  src="https://icons.iconarchive.com/icons/microsoft/fluentui-emoji-flat/512/Cross-Mark-Flat-icon.png"
                  alt="Close"
                  className="invite-close"
                />
              </h1>
            </div>
            <div className="tickets-section">
              {/* Current Tickets */}
              <div className="tickets-container mx-auto">
                <table className="ticket-table">
                  <tbody>
                    {store.userData?.user?.tickets?.length === 0 ? (
                      <tr>
                        <td colSpan={3} className="ticket-cell empty">
                          <p>You haven't bought any tickets.</p>
                        </td>
                      </tr>
                    ) : (
                      <>
                        {/* Current Tickets */}
                        {Array.from({
                          length: Math.ceil(
                            store.userData?.user?.tickets?.filter(
                              (ticket) => !isOldTicket(ticket.dapaint.date_time)
                            ).length / 3
                          ),
                        }).map((_, rowIndex) => (
                          <tr key={`current-${rowIndex}`}>
                            {Array.from({ length: 3 }).map((_, colIndex) => {
                              const currentTickets =
                                store.userData?.user?.tickets?.filter(
                                  (ticket) =>
                                    !isOldTicket(ticket.dapaint.date_time)
                                );
                              const ticketIndex = rowIndex * 3 + colIndex;
                              const isExpanded = expandedIndex === ticketIndex;
                              const ticket = currentTickets?.[ticketIndex];

                              return (
                                <td
                                  className={`ticket-cell ${
                                    expandedIndex !== null && !isExpanded
                                      ? "hidden"
                                      : ""
                                  }`}
                                  key={colIndex}
                                >
                                  {ticket ? (
                                    <div
                                      className={`ticket ${
                                        isExpanded ? "expanded" : ""
                                      }`}
                                    >
                                      {!isExpanded && (
                                        <>
                                          <img
                                            src={ticket.qr_code_path}
                                            alt="QR Code"
                                            className="qr-code"
                                          />
                                          {actions.convertTo12Hr(
                                            ticket.dapaint.date_time
                                          )}
                                          <button
                                            className="btn show-btn"
                                            onClick={() =>
                                              toggleQRCode(ticketIndex)
                                            }
                                          >
                                            SHOW
                                          </button>
                                        </>
                                      )}

                                      {isExpanded && (
                                        <>
                                          <div className="ticket-info">
                                            <div className="ticket-code mx-auto">
                                              <p>Ticket Code</p>
                                              <h1>
                                                {ticket.ticket_code}
                                                <img
                                                  src={ticket.qr_code_path}
                                                  alt="QR Code"
                                                  className="qr-code expanded"
                                                />
                                              </h1>
                                            </div>
                                            <div className="details">
                                              <div className="details-label">
                                                Location:{" "}
                                                {ticket.dapaint.location}
                                              </div>
                                              <div className="details-content">
                                                <div className="host-info">
                                                  <img
                                                    src={
                                                      ticket.dapaint.hostFoeId
                                                        .profile_pic
                                                        ?.image_url ||
                                                      placeholderImage
                                                    }
                                                    alt="Host Profile"
                                                    className="profile-pic"
                                                    style={{
                                                      width: "100px",
                                                      height: "100px",
                                                    }}
                                                  />
                                                  <div className="host-name">
                                                    {
                                                      ticket.dapaint.hostFoeId
                                                        .name
                                                    }
                                                  </div>
                                                </div>
                                                <div className="foe-info">
                                                  <img
                                                    src={
                                                      ticket.dapaint.foeId
                                                        .profile_pic
                                                        ?.image_url ||
                                                      placeholderImage
                                                    }
                                                    alt="Foe Profile"
                                                    className="profile-pic"
                                                    style={{
                                                      width: "100px",
                                                      height: "100px",
                                                    }}
                                                  />
                                                  <div className="foe-name">
                                                    {ticket.dapaint.foeId.name}
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                            <div className="buttons">
                                              <button className="btn refund-btn">
                                                REFUND
                                              </button>
                                              <button
                                                className="btn hide-btn"
                                                onClick={() =>
                                                  toggleQRCode(ticketIndex)
                                                }
                                              >
                                                HIDE
                                              </button>
                                            </div>
                                          </div>
                                        </>
                                      )}
                                    </div>
                                  ) : (
                                    <div className="ticket empty">
                                      No Ticket Available
                                    </div>
                                  )}
                                </td>
                              );
                            })}
                          </tr>
                        ))}

                        {/* Old Tickets Button and Section */}
                        {store.userData?.user?.tickets?.some((ticket) =>
                          isOldTicket(ticket.dapaint.date_time)
                        ) && (
                          <tr>
                            <td colSpan={3}>
                              <button
                                className="old-tickets-button"
                                onClick={() =>
                                  setShowOldTickets(!showOldTickets)
                                }
                              >
                                {showOldTickets
                                  ? "Hide Old Tickets"
                                  : "Show Old Tickets"}
                              </button>
                            </td>
                          </tr>
                        )}

                        {/* Old Tickets Content */}
                        {showOldTickets &&
                          Array.from({
                            length: Math.ceil(
                              store.userData?.user?.tickets?.filter((ticket) =>
                                isOldTicket(ticket.dapaint.date_time)
                              ).length / 3
                            ),
                          }).map((_, rowIndex) => (
                            <tr
                              key={`old-${rowIndex}`}
                              className={
                                showOldTickets
                                  ? "show-old-tickets"
                                  : "hidden-tickets"
                              }
                            >
                              {Array.from({ length: 3 }).map((_, colIndex) => {
                                const oldTickets =
                                  store.userData?.user?.tickets?.filter(
                                    (ticket) =>
                                      isOldTicket(ticket.dapaint.date_time)
                                  );
                                const ticketIndex = `old-${
                                  rowIndex * 3 + colIndex
                                }`;
                                const isExpanded =
                                  expandedIndex === ticketIndex;
                                const ticket =
                                  oldTickets?.[rowIndex * 3 + colIndex];

                                return ticket ? (
                                  <td
                                    className={`ticket-cell ${
                                      expandedIndex !== null && !isExpanded
                                        ? "hidden"
                                        : ""
                                    }`}
                                    key={colIndex}
                                  >
                                    {/* Same ticket content structure as above */}
                                    <div
                                      className={`ticket ${
                                        isExpanded ? "expanded" : ""
                                      }`}
                                    >
                                      {!isExpanded && (
                                        <>
                                          <img
                                            src={ticket.qr_code_path}
                                            alt="QR Code"
                                            className="qr-code"
                                          />
                                          {actions.convertTo12Hr(
                                            ticket.dapaint.date_time
                                          )}
                                          <button
                                            className="btn show-btn"
                                            onClick={() =>
                                              toggleQRCode(ticketIndex)
                                            }
                                          >
                                            SHOW
                                          </button>
                                        </>
                                      )}

                                      {isExpanded && (
                                        <>
                                          <div className="ticket-info">
                                            <div className="ticket-code mx-auto">
                                              <p>Ticket Code</p>
                                              <h1>
                                                {ticket.ticket_code}
                                                <img
                                                  src={ticket.qr_code_path}
                                                  alt="QR Code"
                                                  className="qr-code expanded"
                                                />
                                              </h1>
                                            </div>
                                            <div className="details">
                                              <div className="details-label">
                                                Location:{" "}
                                                {ticket.dapaint.location}
                                              </div>
                                              <div className="details-content">
                                                <div className="host-info">
                                                  <img
                                                    src={
                                                      ticket.dapaint.hostFoeId
                                                        .profile_pic
                                                        ?.image_url ||
                                                      placeholderImage
                                                    }
                                                    alt="Host Profile"
                                                    className="profile-pic"
                                                    style={{
                                                      width: "100px",
                                                      height: "100px",
                                                    }}
                                                  />
                                                  <div className="host-name">
                                                    {
                                                      ticket.dapaint.hostFoeId
                                                        .name
                                                    }
                                                  </div>
                                                </div>
                                                <div className="foe-info">
                                                  <img
                                                    src={
                                                      ticket.dapaint.foeId
                                                        .profile_pic
                                                        ?.image_url ||
                                                      placeholderImage
                                                    }
                                                    alt="Foe Profile"
                                                    className="profile-pic"
                                                    style={{
                                                      width: "100px",
                                                      height: "100px",
                                                    }}
                                                  />
                                                  <div className="foe-name">
                                                    {ticket.dapaint.foeId.name}
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                            <div className="buttons">
                                              <button className="btn refund-btn">
                                                REFUND
                                              </button>
                                              <button
                                                className="btn hide-btn"
                                                onClick={() =>
                                                  toggleQRCode(ticketIndex)
                                                }
                                              >
                                                HIDE
                                              </button>
                                            </div>
                                          </div>
                                        </>
                                      )}
                                    </div>
                                  </td>
                                ) : null;
                              })}
                            </tr>
                          ))}
                      </>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* <div className="tickets-container mx-auto">
              <table className="ticket-table">
                <tbody>
                  {store.userData?.user?.tickets?.length === 0 ? (
                    // Display message when there are no tickets
                    <tr>
                      <td colSpan={3} className="ticket-cell empty">
                        <p>You haven't bought any tickets.</p>
                      </td>
                    </tr>
                  ) : (
                    // Display tickets in rows if tickets exist
                    Array.from({
                      length: Math.ceil(
                        store.userData?.user?.tickets?.length / 3
                      ),
                    }).map((_, rowIndex) => (
                      <tr key={rowIndex}>
                        {Array.from({ length: 3 }).map((_, colIndex) => {
                          const ticketIndex = rowIndex * 3 + colIndex;
                          const isExpanded = expandedIndex === ticketIndex;
                          const ticket =
                            store.userData?.user?.tickets?.[ticketIndex];

                          return (
                            <td
                              className={`ticket-cell ${
                                expandedIndex !== null && !isExpanded
                                  ? "hidden"
                                  : ""
                              }`}
                              key={colIndex}
                            >
                              {ticket ? (
                                <div
                                  className={`ticket ${
                                    isExpanded ? "expanded" : ""
                                  }`}
                                >
                                  {!isExpanded && (
                                    <>
                                      <img
                                        src={ticket.qr_code_path}
                                        alt="QR Code"
                                        className="qr-code"
                                      />
                                      {actions.convertTo12Hr(
                                        ticket.dapaint.date_time
                                      )}
                                      <button
                                        className="btn show-btn"
                                        onClick={() =>
                                          toggleQRCode(ticketIndex)
                                        }
                                      >
                                        SHOW
                                      </button>
                                    </>
                                  )}

                                  {isExpanded && (
                                    <>
                                      <div className="ticket-info">
                                        <div className="ticket-code mx-auto">
                                          <p>Ticket Code</p>
                                          <h1>
                                            {ticket.ticket_code}
                                            <img
                                              src={ticket.qr_code_path}
                                              alt="QR Code"
                                              className="qr-code expanded"
                                            />
                                          </h1>
                                        </div>
                                        <div className="details">
                                          <div className="details-label">
                                            Location: {ticket.dapaint.location}
                                          </div>
                                          <div className="details-content">
                                            <div className="host-info">
                                              <img
                                                src={
                                                  ticket.dapaint.hostFoeId
                                                    .profile_pic?.image_url ||
                                                  placeholderImage
                                                }
                                                alt="Host Profile"
                                                className="profile-pic"
                                                style={{
                                                  width: "100px",
                                                  height: "100px",
                                                }}
                                              />
                                              <div className="host-name">
                                                {ticket.dapaint.hostFoeId.name}
                                              </div>
                                            </div>
                                            <div className="foe-info">
                                              <img
                                                src={
                                                  ticket.dapaint.foeId
                                                    .profile_pic?.image_url ||
                                                  placeholderImage
                                                }
                                                alt="Foe Profile"
                                                className="profile-pic"
                                                style={{
                                                  width: "100px",
                                                  height: "100px",
                                                }}
                                              />
                                              <div className="foe-name">
                                                {ticket.dapaint.foeId.name}
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                        <div className="buttons">
                                          <button className="btn refund-btn">
                                            REFUND
                                          </button>
                                          <button
                                            className="btn hide-btn"
                                            onClick={() =>
                                              toggleQRCode(ticketIndex)
                                            }
                                          >
                                            HIDE
                                          </button>
                                        </div>
                                      </div>
                                    </>
                                  )}
                                </div>
                              ) : (
                                <div className="ticket empty">
                                  No Ticket Available
                                </div>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div> */}
          </div>
        </div>
      </div>
      <div
        className="modal fade"
        id="exampleModalToggle6"
        aria-hidden="true"
        aria-labelledby="exampleModalToggleLabel6"
        tabIndex="-1"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="invite-header">
              <img
                data-bs-target="#exampleModalToggle"
                data-bs-toggle="modal"
                src="https://icons.iconarchive.com/icons/microsoft/fluentui-emoji-3d/512/Back-Arrow-3d-icon.png"
                alt="Back"
                className="invite-close"
              />
              <h1 className="invite-title">
                CLOCK OUT
                <img
                  data-bs-dismiss="modal"
                  src="https://icons.iconarchive.com/icons/microsoft/fluentui-emoji-flat/512/Cross-Mark-Flat-icon.png"
                  alt="Close"
                  className="invite-close"
                />
              </h1>
            </div>

            <div className="profile-container">
              Are you sure you want to clock out?
              <button className="btn btn-secondary" onClick={handleLogout}>
                YES
              </button>
              <button
                className="btn btn-secondary"
                data-bs-target="#exampleModalToggle"
                data-bs-toggle="modal"
              >
                NO
              </button>
            </div>
          </div>
        </div>
      </div>
      <button
        className="btn setting"
        data-bs-target="#exampleModalToggle"
        data-bs-toggle="modal"
      >
        <img
          src="https://icons.iconarchive.com/icons/microsoft/fluentui-emoji-3d/512/Exclamation-Question-Mark-3d-icon.png"
          alt="Settings"
          style={{ width: "68px", height: "68px" }}
        />
      </button>
    </>
  );
};
