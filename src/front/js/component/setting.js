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

  // const toggleQRCode = async (index) => {
  //   if (expandedIndex === index) {
  //     setExpandedIndex(null);
  //   } else {
  //     setExpandedIndex(index);
  //     if (!qrCodes[index]) {
  //       const inviteCode = generateInviteCode();
  //       const qrCodeDataUrl = await generateQRCode(inviteCode);
  //       setQrCodes((prevCodes) => {
  //         const newCodes = [...prevCodes];
  //         newCodes[index] = qrCodeDataUrl;
  //         return newCodes;
  //       });
  //     }
  //   }
  // };
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

            <div className="tickets-container mx-auto">
              <table className="ticket-table">
                {/* <tbody>
                  {Array.from({ length: 3 }).map((_, rowIndex) => (
                    <tr key={rowIndex}>
                      {Array.from({ length: 3 }).map((_, colIndex) => {
                        const ticketIndex = rowIndex * 3 + colIndex;
                        const isExpanded = expandedIndex === ticketIndex;

                        return (
                          <td
                            className={`ticket-cell ${
                              expandedIndex !== null && !isExpanded
                                ? "hidden"
                                : ""
                            }`}
                            key={colIndex}
                          >
                            <div
                              className={`ticket ${
                                isExpanded ? "expanded" : ""
                              }`}
                            >
                              {!isExpanded && (
                                <>
                                  <img
                                    src={qrCodes[ticketIndex]}
                                    alt="QR Code"
                                    className="qr-code"
                                  />
                                  <button className="btn refund-btn">
                                    REFUND
                                  </button>
                                  <button
                                    className="btn show-btn"
                                    onClick={() => toggleQRCode(ticketIndex)}
                                  >
                                    SHOW
                                  </button>
                                </>
                              )}

                              {isExpanded && (
                                <>
                                  <img
                                    src={qrCodes[ticketIndex]}
                                    alt="QR Code"
                                    className="qr-code expanded"
                                  />
                                  <div className="details-label">Details</div>
                                  <button
                                    className="btn hide-btn"
                                    onClick={() => toggleQRCode(ticketIndex)}
                                  >
                                    HIDE
                                  </button>
                                </>
                              )}
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody> */}
                <tbody>
                  {Array.from({
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

                        if (!ticket) {
                          return (
                            <td
                              key={colIndex}
                              className="ticket-cell empty"
                            ></td>
                          );
                        }
                        // <p>You haven't bought any tickets</p>    

                        return (
                          <td
                            className={`ticket-cell ${
                              expandedIndex !== null && !isExpanded
                                ? "hidden"
                                : ""
                            }`}
                            key={colIndex}
                          >
                            <div
                              className={`ticket ${
                                isExpanded ? "expanded" : ""
                              }`}
                            >
                              {!isExpanded && (
                                <>
                                  <img
                                    src={
                                      ticket.qr_code_path ||
                                      "/path/to/placeholder.png"
                                    }
                                    alt="QR Code"
                                    className="qr-code"
                                  />
                                  
                                  {actions.convertTo12Hr(ticket.dapaint.date_time)}
                                  <button
                                    className="btn show-btn"
                                    onClick={() => toggleQRCode(ticketIndex)}
                                  >
                                    SHOW
                                  </button>
                                </>
                              )}

                              {isExpanded && (
                                <>
                                  <img
                                    src={
                                      ticket.qr_code_path ||
                                      "/path/to/placeholder.png"
                                    }
                                    alt="QR Code"
                                    className="qr-code expanded"
                                  />
                                  <div className="details-label">Details
                                  {ticket.dapaint.hostFoeId.name} vs {ticket.dapaint.foeId.name}
                                  {ticket.dapaint.location}
                                  {ticket.dapaint.hostFoeId.profile_pic}                                  
                                  {ticket.dapaint.fitnessStyle}
                                  <button className="btn refund-btn">
                                    REFUND
                                  </button>
                                  </div>
                                  <button
                                    className="btn hide-btn"
                                    onClick={() => toggleQRCode(ticketIndex)}
                                  >
                                    HIDE
                                  </button>
                                </>
                              )}
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
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
