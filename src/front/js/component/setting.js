import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/setting.css";
import { Context } from "../store/appContext";

export const Setting = ({ onClose }) => {
  const { store, actions } = useContext(Context);
  const navigate = useNavigate();
  const [isActive, setIsActive] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [rating, setRating] = useState(0); // New state for rating
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [expanded, setExpanded] = useState(Array(9).fill(false));

  const handleRatingChange = (value) => {
    setRating(value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log("Rating:", rating, "Feedback:", feedback);
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

  const toggleQRCode = (index) => {
    setExpanded((prev) => {
      const newExpanded = [...prev];
      newExpanded[index] = !newExpanded[index];
      return newExpanded;
    });
  };
  
  

  return (
    <>
      <div
        class="modal fade"
        id="exampleModalToggle"
        aria-hidden="true"
        aria-labelledby="exampleModalToggleLabel"
        tabindex="-1"
      >
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            {/* <div class="modal-header">
        <h1 class="modal-title fs-5" id="exampleModalToggleLabel3">
          Dapaint list
        </h1>
        <button
          type="button"
          class="btn-close"
          data-bs-dismiss="modal"
          aria-label="Close"
        ></button>
      </div> */}

            <div className="invite-header">
              <img
                data-bs-target="#exampleModalToggle"
                data-bs-toggle="modal"
                src="https://icons.iconarchive.com/icons/microsoft/fluentui-emoji-3d/512/Back-Arrow-3d-icon.png"
                alt="Back"
                className="invite-close"
              />
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

            <div class="profile-container">
              <button
                class="btn btn-secondary"
                data-bs-target="#exampleModalToggle2"
                data-bs-toggle="modal"
              >
                <h5>FEEDBACK</h5>
              </button>
              <button
                class="btn btn-secondary"
                data-bs-target="#exampleModalToggle3"
                data-bs-toggle="modal"
              >
                <h5>HOW TO PLAY</h5>
              </button>
              <button
                class="btn btn-secondary"
                data-bs-target="#exampleModalToggle4"
                data-bs-toggle="modal"
              >
                <h5>TICKETS</h5>
              </button>
              <button
                class="btn btn-secondary"
                data-bs-target="#exampleModalToggle5"
                data-bs-toggle="modal"
              >
                <h5>SWITCH PROFILE</h5>
              </button>
              <button
                class="btn btn-secondary"
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
        class="modal fade"
        id="exampleModalToggle2"
        aria-hidden="true"
        aria-labelledby="exampleModalToggleLabel2"
        tabindex="-1"
      >
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            {/* <div class="modal-header">
        <h1 class="modal-title fs-5" id="exampleModalToggleLabel3">
          Dapaint list
        </h1>
        <button
          type="button"
          class="btn-close"
          data-bs-dismiss="modal"
          aria-label="Close"
        ></button>
      </div> */}

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

            <div class="profile-container">
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
        class="modal fade"
        id="exampleModalToggle3"
        aria-hidden="true"
        aria-labelledby="exampleModalToggleLabel3"
        tabindex="-1"
      >
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            {/* <div class="modal-header">
        <h1 class="modal-title fs-5" id="exampleModalToggleLabel3">
          Dapaint list
        </h1>
        <button
          type="button"
          class="btn-close"
          data-bs-dismiss="modal"
          aria-label="Close"
        ></button>
      </div> */}
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

            <div class="profile-container">
              1. TAP FIND FOE BUTTON
              <br />
              3. TAP CLOCK IN
              <br />
              2. FIND A HOST CHALLENGING YOU IN A SPORT
              <br />
              1. TAP CLOCK IN
              <br />
              3. SPREAD THE WORD TO SELL TICKETS TO YOUR MATCH
              <br />
              4. TAP START
              <br />
              6. SUBMIT YOUR FOOTAGE/RESULT OF THE MATCH
              <br />
              5. REPEAT TILL YOU REACH 30 WINSTREAKS FOR A SURPRISE
            </div>
          </div>
        </div>
      </div>
      <div
        class="modal fade"
        id="exampleModalToggle4"
        aria-hidden="true"
        aria-labelledby="exampleModalToggleLabel4"
        tabindex="-1"
      >
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            {/* <div class="modal-header">
        <h1 class="modal-title fs-5" id="exampleModalToggleLabel3">
          Dapaint list
        </h1>
        <button
          type="button"
          class="btn-close"
          data-bs-dismiss="modal"
          aria-label="Close"
        ></button>
      </div> */}

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

            <div class="tickets-container mx-auto">
            <table className="ticket-table">
      <tbody>
        {Array.from({ length: 3 }).map((_, rowIndex) => (
          <tr key={rowIndex}>
            {Array.from({ length: 3 }).map((_, colIndex) => {
              const ticketIndex = rowIndex * 3 + colIndex;
              return (
                <td className="ticket-cell" key={colIndex}>
                  <div className={`ticket ${expanded[ticketIndex] ? 'expanded' : ''}`}>
                    <img
                      src="https://icons.iconarchive.com/icons/microsoft/fluentui-emoji-3d/512/Oncoming-Fist-3d-Medium-Dark-icon.png"
                      alt="QR Code"
                      className="qr-code"
                    />
                    <button className="btn refund-btn">REFUND</button>
                    {expanded[ticketIndex] ? (
                      <button className="btn hide-btn" onClick={() => toggleQRCode(ticketIndex)}>HIDE</button>
                    ) : (
                      <button className="btn show-btn" onClick={() => toggleQRCode(ticketIndex)}>SHOW</button>
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
        class="modal fade"
        id="exampleModalToggle5"
        aria-hidden="true"
        aria-labelledby="exampleModalToggleLabel5"
        tabindex="-1"
      >
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            {/* <div class="modal-header">
        <h1 class="modal-title fs-5" id="exampleModalToggleLabel3">
          Dapaint list
        </h1>
        <button
          type="button"
          class="btn-close"
          data-bs-dismiss="modal"
          aria-label="Close"
        ></button>
      </div> */}

            <div className="invite-header">
              <img
                data-bs-target="#exampleModalToggle"
                data-bs-toggle="modal"
                src="https://icons.iconarchive.com/icons/microsoft/fluentui-emoji-3d/512/Back-Arrow-3d-icon.png"
                alt="Back"
                className="invite-close"
              />
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

            <div class="profile-container">
              Hide this modal and show the sixth with the button below.
            </div>
          </div>
        </div>
      </div>
      <div
        class="modal fade"
        id="exampleModalToggle6"
        aria-hidden="true"
        aria-labelledby="exampleModalToggleLabel6"
        tabindex="-1"
      >
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            {/* <div class="modal-header">
        <h1 class="modal-title fs-5" id="exampleModalToggleLabel3">
          Dapaint list
        </h1>
        <button
          type="button"
          class="btn-close"
          data-bs-dismiss="modal"
          aria-label="Close"
        ></button>
      </div> */}

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

            <div class="profile-container">
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
        class="btn setting"
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
