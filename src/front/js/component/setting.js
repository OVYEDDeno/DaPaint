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
        data-bs-target="#setting"
        data-bs-toggle="setting modal"
      >
        <img
          src="https://icons.iconarchive.com/icons/microsoft/fluentui-emoji-3d/512/Exclamation-Question-Mark-3d-icon.png"
          alt="Settings"
          style={{ width: "51px", height: "51px" }}
        />
      </button>

      <div
        className="setting fade"
        id="setting"
        aria-labelledby="setting"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="setting-content">
            <div className="setting-header" style={{ position: "justify" }}>
              <img
                data-bs-dismiss="setting modal"
                src="https://icons.iconarchive.com/icons/microsoft/fluentui-emoji-3d/512/Cross-Mark-3d-icon.png"
                alt="Close"
                style={{
                  position: "absolute",
                  top: "10px",
                  right: "10px",
                  width: "20px",
                  height: "20px",
                  cursor: "pointer",
                }}
              />
              <h1
                className="text-3x5 text-black"
                style={{
                  margin: "0 auto",
                  textAlign: "center",
                  fontStyle: "normal",
                  // position: "absolute",
                  // width: "0%",
                }}
              >
                SETTING
              </h1>
            </div>

            <div className="setting-body">
              <div className="flex flex-col space-y-4">

                <div><button
                  className="w-full py-2 bg-black text-white rounded-lg font-bold hover:bg-gray-800"
                  data-bs-target="#DIDDYModal"
                  data-bs-toggle="DIDDY modal"
                >
                  HOW TO DIDDY
                </button></div>

                <div><button
                  className="w-full py-2 bg-black text-white rounded-lg font-bold hover:bg-gray-800"
                  data-bs-target="#feedbackModal"
                  data-bs-toggle="FEEDBACK modal"
                >
                  FEEDBACK
                </button></div>

                <div><button
                  className="w-full py-2 bg-black text-white rounded-lg font-bold hover:bg-gray-800"
                  data-bs-target="#TICKETSModal"
                  data-bs-toggle="TICKETS modal"
                >
                  TICKETS
                </button></div>

                <div><button
                  className="w-full py-2 bg-black text-white rounded-lg font-bold hover:bg-gray-800"
                  data-bs-target="#exampleModalToggle2"
                  data-bs-toggle="modal"
                >
                  {isActive ? "Deactivate" : "Activate"}
                </button></div>

                <div><button
                  className="w-full py-2 bg-black text-white rounded-lg font-bold hover:bg-gray-800"
                  onClick={handleLogout}
                >
                  CLOCK OUT
                </button></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        className="modal fade"
        id="feedbackModal"
        aria-hidden="true"
        aria-labelledby="feedbackModalLabel"
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

      <div
        className="modal fade"
        id="exampleModalToggle2"
        aria-hidden="true"
        aria-labelledby="exampleModalToggleLabel2"
        tabIndex="-1"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalToggleLabel2">
                Modal 2
              </h1>
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
                className="btn btn-primary"
                data-bs-target="#setting"
                data-bs-toggle="modal"
              >
                CANCEL
              </button>
              <button
                className="btn btn-primary"
                data-bs-target="#setting"
                data-bs-toggle="modal"
                onClick={toggleActiveStatus}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
