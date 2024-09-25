import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/setting.css";
import { Context } from "../store/appContext";

export const Setting = ({ onClose }) => {
  const { store, actions } = useContext(Context);
  const navigate = useNavigate();
  const [isActive, setIsActive] = useState(null);
  const [feedback, setFeedback] = useState(""); // State to store feedback input

  useEffect(() => {
    const fetchUserStatus = async () => {
      await actions.fetchCurrentUser();
      setIsActive(store.user?.is_active);
    };

    fetchUserStatus();
  }, []);

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

  const handleFeedbackSubmit = async () => {
    console.log("Feedback submitted:", feedback);
    alert("Thank you for your feedback!");
    setFeedback(""); // Clear feedback input
  };

  return (
    <>
      <button
        className="setting btn"
        data-bs-target="#settingModal"
        data-bs-toggle="modal"
      >
        <img
          src="https://icons.iconarchive.com/icons/microsoft/fluentui-emoji-3d/512/Exclamation-Question-Mark-3d-icon.png"
          alt="Settings"
          style={{ width: "51px", height: "51px" }}
        />
      </button>

      <div
        className="modal fade"
        id="settingModal"
        aria-labelledby="settingModalLabel"
        aria-hidden="true"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="setting-content">
            <div className="setting-header">
              <h1 className="text-3x5 text-white">SETTING</h1>
              <img
                data-bs-dismiss="modal"
                src="https://icons.iconarchive.com/icons/microsoft/fluentui-emoji-flat/512/Cross-Mark-Flat-icon.png"
                alt="Close"
                className="profile-close"
              />
            </div>

            <div id="modalBody" className="setting-body">
              <div className="flex flex-col space-y-4">
                <div className="allButtons">
                  <div>
                    <button
                      className="w-full py-2 bg-black text-white rounded-lg font-bold hover:bg-gray-800"
                      data-bs-target="#DaPaintModal"
                      data-bs-toggle="modal"
                    >
                      HOW TO DaPaint
                    </button>
                  </div>
                  <button>Switch</button>
                  <div>
                    <button
                      className="w-full py-2 bg-black text-white rounded-lg font-bold hover:bg-gray-800"
                      data-bs-target="#feedbackModal"
                      data-bs-toggle="modal"
                    >
                      FEEDBACK
                    </button>
                  </div>
                  <div>
                    <button
                      className="w-full py-2 bg-black text-white rounded-lg font-bold hover:bg-gray-800"
                      data-bs-target="#ticketsModal"
                      data-bs-toggle="modal"
                    >
                      TICKETS
                    </button>
                  </div>
                  <div>
                    <button
                      className="w-full py-2 bg-black text-white rounded-lg font-bold hover:bg-gray-800"
                      data-bs-target="#statusModal"
                      data-bs-toggle="modal"
                    >
                      {isActive ? "Deactivate" : "Activate"}
                    </button>
                  </div>
                  <div>
                    <button
                      className="w-full py-2 bg-black text-white rounded-lg font-bold hover:bg-gray-800"
                      onClick={handleLogout}
                    >
                      CLOCK OUT
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* DaPaint Modal */}
      <div
        className="modal fade"
        id="DaPaintModal"
        aria-hidden="true"
        aria-labelledby="DaPaintModalLabel"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        tabIndex="-1"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="DaPaintModalLabel">
                How to DaPaint
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              {/* Add content for How to DaPaint modal here */}
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" data-bs-dismiss="modal">
                Close
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* FEEDBACK Modal */}
      <div
        className="modal fade"
        id="feedbackModal"
        aria-hidden="true"
        aria-labelledby="feedbackModalLabel"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        tabIndex="-1"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="feedbackModalLabel">
                Feedback
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <textarea
                className="form-control"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Enter your feedback here"
                rows="4"
              ></textarea>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" data-bs-dismiss="modal">
                Close
              </button>
              <button
                className="btn btn-primary"
                onClick={handleFeedbackSubmit}
                data-bs-dismiss="modal"
              >
                Submit Feedback
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* TICKETS Modal */}
      <div
        className="modal fade"
        id="ticketsModal"
        aria-hidden="true"
        aria-labelledby="ticketsModalLabel"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        tabIndex="-1"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="ticketsModalLabel">
                Tickets
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              {/* Add content for Tickets modal here */}
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" data-bs-dismiss="modal">
                Close
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Status Modal */}
      <div
        className="modal fade"
        id="statusModal"
        aria-hidden="true"
        aria-labelledby="statusModalLabel"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        tabIndex="-1"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="statusModalLabel">
                Account Status
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              Are you sure you want to {isActive ? "deactivate" : "activate"}{" "}
              your account?
            </div>
            <div className="modal-footer">
              <button
                className="btn btn-secondary"
                data-bs-dismiss="modal"
                onClick={toggleActiveStatus}
              >
                {isActive ? "Deactivate" : "Activate"}
              </button>
              <button className="btn btn-secondary" data-bs-dismiss="modal">
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
