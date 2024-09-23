import React, { useState, useEffect, useContext } from "react";
import { Context } from "../store/appContext";
import PropTypes from "prop-types";
import "../../styles/dapaintlist.css";
import { DaPaintCreate } from "./dapaintcreate.js";

export const DaPaintList = ({ onClose }) => {
  const { store, actions } = useContext(Context);
  const [events, setEvents] = useState([]);
  const [showDaPaintCreate, setShowDaPaintCreate] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    async function getDapaintList() {
      try {
        const response = await fetch(`${process.env.BACKEND_URL}/api/lineup`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const EventList = await response.json();
          console.log("Fetched events:", EventList);
          setEvents(EventList);
        } else {
          const error = await response.json();
          console.error("Failed to retrieve list of events:", error);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    }

    getDapaintList();
    console.log(
      "!!!!!!UPDATED STORE.USERDATA FROM DAPAINTLIST.JS:",
      store.userData
    );
  }, [store.userData]);

  const addNewEvent = (newEvent) => {
    setEvents((prevEvents) => [...prevEvents, newEvent]);
    setShowDaPaintCreate(false);
    const currentModal = document.getElementById("DaPaint");
    const modal = new bootstrap.Modal(currentModal);
    modal.show();
  };

  const handleAddEventClick = () => {
    setShowDaPaintCreate(true);
    const currentModal = document.getElementById("DaPaint");
    const modal = bootstrap.Modal.getInstance(currentModal);
    modal.hide();
  };

  const handleCloseDaPaintCreate = () => {
    setShowDaPaintCreate(false);
    const currentModal = document.getElementById("DaPaint");
    const modal = new bootstrap.Modal(currentModal);
    modal.show();
  };

  const handleDelete = async (eventId) => {
    const success = await actions.deleteEvent(eventId);
    if (success) {
      setEvents((prevEvents) =>
        prevEvents.filter((event) => event.id !== eventId)
      );
      const currentModal = document.getElementById("DaPaint");
      const modal = new bootstrap.Modal(currentModal);
      modal.show();
    }
  };

  // Add extensive logging to check the structure of each event
  console.log("Events Array:", events);
  const filteredEvents = events.filter((event) => {
    const hostFoeName = event.hostFoeId?.name
      ? event.hostFoeId.name.toLowerCase()
      : "";
    const foeName = event.foeId?.name ? event.foeId.name.toLowerCase() : "";
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    return (
      hostFoeName.includes(lowerCaseSearchTerm) ||
      foeName.includes(lowerCaseSearchTerm)
    );
  });

  const closeCurrentModal = (modalId) => {
    const currentModal = document.getElementById(modalId);
    const modal = bootstrap.Modal.getInstance(currentModal);
    if (modal) {
      modal.hide();
    }
  };

  const handleClockIn = async (event) => {
    try {
      const updatedDapaint = await actions.handleClockIn(event);
      if (updatedDapaint) {
        setEvents((prevEvents) =>
          prevEvents.map((e) =>
            e.id === updatedDapaint.id ? updatedDapaint : e
          )
        );
        console.log("Successfully clocked in!");

        // Close the current modal
        closeCurrentModal("DaPaint");

        // Open the lineUp modal
        const lineUpModal = document.getElementById("lineUp");
        if (lineUpModal) {
          const modal = new bootstrap.Modal(lineUpModal);
          modal.show();
        }
      }
    } catch (error) {
      console.error("Error clocking in:", error);
    }
  };

  const handleResetWinStreak = () => {
    // in the useEffect, set the user winstreak user.winstreak= {userWinStreak};
    // also in the useEffect, grab the goal win streak from store or back end = {goalWinStreak};

    // set a conditional here so this action only gets called if the user win streak = goal win streak (not the highest win streak)
    // something like that(userWinStreak >= goalWinStreak) ? actions.resetWinStreak();

    actions.resetWinStreak();
  };

  return (
    <>
      <button
        type="button"
        onClick={handleResetWinStreak}
        className="btn btn-danger btn-lg"
        data-bs-toggle="modal"
        data-bs-target="#DaPaint"
      >
        <h1>⚔️FIND FOE⚔️</h1>
      </button>
      <div
        className="modal fade"
        id="DaPaint"
        tabIndex="-1"
        aria-labelledby="DaPaintLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
          <div className="modal-content">
            <div className="profile-header">
              <h1 className="profile-title" id="DAPAINTLabel">
                DAPAINT
              </h1>
              <img
                data-bs-dismiss="modal"
                src="https://icons.iconarchive.com/icons/microsoft/fluentui-emoji-flat/512/Cross-Mark-Flat-icon.png"
                alt="Close"
                className="profile-close"
              />
            </div>

            <div className="modal-body">
              <div className="form-control">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search for a foe..."
                  className="form-control mb-3"
                />
                {filteredEvents.map((event) => (
                  <div
                    key={event.id}
                    className="flex justify-between items-center mb-4"
                  >
                    <div className="flex items-center">
                      {event.hostFoeId ? (
                        <>
                          <img
                            src={event.hostFoeId.profile_pic?.image_url}
                            alt={event.hostFoeId.name || "Unknown Host"}
                            className="w-8 h-8 rounded-full mr-2"
                          />
                          <span className="text-black">
                            {event.hostFoeId.name || "Unknown Host"}
                          </span>
                        </>
                      ) : (
                        <span className="text-black">Unknown Host</span>
                      )}
                    </div>
                    <div className="text-gray-500">{event.fitnessStyle}</div>
                    <div className="text-gray-500">{event.location}</div>
                    <div className="text-gray-500">{event.distance}</div>
                    <div className="text-gray-500">{event.date_time}</div>
                    {event.hostFoeId?.id !== store.userData.user?.id &&
                    event.hostFoeId ? (
                      <button
                        className="bg-black text-white p-2 rounded"
                        onClick={() => handleClockIn(event)}
                      >
                        CLOCK IN
                      </button>
                    ) : (
                      <button
                        className="bg-black text-danger p-2 rounded"
                        onClick={() => handleDelete(event.id)}
                      >
                        DELETE
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
            <div className="dapaint-footer">
              <button
                type="button"
                onClick={handleAddEventClick}
                className="btn btn-danger"
              >
                <h1>+ADD</h1>
              </button>
            </div>
          </div>
        </div>
      </div>

      {showDaPaintCreate && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          role="dialog"
          aria-labelledby="DaPaintCreateLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="DaPaintCreateLabel">
                  DAPAINT
                </h5>
                <img
                  data-bs-dismiss="modal"
                  onClick={handleCloseDaPaintCreate}
                  src="https://icons.iconarchive.com/icons/microsoft/fluentui-emoji-flat/512/Cross-Mark-Flat-icon.png"
                  alt="Close"
                  className="profile-close"
                />
              </div>
              <div className="modal-body">
                <DaPaintCreate
                  onClose={handleCloseDaPaintCreate}
                  username="YourUsername"
                  profilePicture="path-to-profile-pic.jpg"
                  onAdd={addNewEvent}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
