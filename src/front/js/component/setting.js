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
              Hide this modal and show the third with the button below. Add a
              form on here
            </div>
            <button
              class="btn btn-secondary"
              data-bs-target="#exampleModalToggle"
              data-bs-toggle="modal"
            >
              Back to first modal
            </button>
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
              <br/>3. TAP CLOCK IN
              <br/>2. FIND A HOST CHALLENGING YOU IN A SPORT
              <br/>1. TAP CLOCK IN
              <br/>3. SPREAD THE WORD TO SELL TICKETS TO YOUR MATCH
              <br/>4. TAP START
              <br/>6. SUBMIT YOUR FOOTAGE/RESULT OF THE MATCH
              <br/>5. REPEAT TILL YOU REACH 30 WINSTREAKS FOR A SURPRISE
            </div>
            <button
              class="btn btn-secondary"
              data-bs-target="#exampleModalToggle"
              data-bs-toggle="modal"
            >
              Back to first modal
            </button>
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

            <div class="profile-container">
              Hide this modal and show the fifth with the button below.
            </div>
            <button
              class="btn btn-secondary"
              data-bs-target="#exampleModalToggle"
              data-bs-toggle="modal"
            >
              Back to first modal
            </button>
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
            <button
              class="btn btn-secondary"
              data-bs-target="#exampleModalToggle"
              data-bs-toggle="modal"
            >
              Back to first modal
            </button>
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
              <button>YES</button>
              <button>NO</button>
            </div>
            <button
              class="btn btn-secondary"
              data-bs-target="#exampleModalToggle"
              data-bs-toggle="modal"
            >
              Back to first modal
            </button>
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
