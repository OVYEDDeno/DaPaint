import React, { useState, useEffect, useContext } from "react";
import { Context } from "../store/appContext";
import PropTypes from "prop-types";
import "../../styles/landing.css";
import { DaPaintCreate } from './dapaintcreate.js';

const DaPaintList = ({ onClose }) => {
  const { store, actions } = useContext(Context);
  const [events, setEvents] = useState([]);
  const [showDaPaintCreate, setShowDaPaintCreate] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const token = localStorage.getItem("token");

    async function getDapaintList() {
      try {
        const response = await fetch(`${process.env.BACKEND_URL}/api/lineup`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
        });

        if (response.ok) {
          const EventList = await response.json();
          console.log('Fetched events:', EventList);
          setEvents(EventList);
        } else {
          const error = await response.json();
          console.error('Failed to retrieve list of events:', error);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    }

    getDapaintList();
  }, []);

  const handleClockIn = async (event) => {
    const token = localStorage.getItem('token');
    const userId = store.userData.id;
    console.log("userId: ", userId);

    if (event.hostFoeId !== userId) {
      try {
        const response = await fetch(`${process.env.BACKEND_URL}/api/lineup/${event.id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ foeId: userId })
        });

        if (response.ok) {
          const updatedEvent = await response.json();
          console.log('Updated event:', updatedEvent);

          setEvents((prevEvents) =>
            prevEvents.map((evt) => (evt.id === updatedEvent.id ? updatedEvent : evt))
          );
        } else {
          const error = await response.json();
          console.error('Failed to clock in for event:', error);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    }
  };

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
      setEvents((prevEvents) => prevEvents.filter((event) => event.id !== eventId));
      const currentModal = document.getElementById("DaPaint");
      const modal = new bootstrap.Modal(currentModal);
      modal.show();
    }
  };

  // Add extensive logging to check the structure of each event
  console.log("Events Array:", events);
  const filteredEvents = events.filter(event => {
    const hostFoeName = event.hostFoeId?.name ? event.hostFoeId.name.toLowerCase() : "";
    const foeName = event.foeId?.name ? event.foeId.name.toLowerCase() : "";
    const lowerCaseSearchTerm = searchTerm.toLowerCase();

    return hostFoeName.includes(lowerCaseSearchTerm) || foeName.includes(lowerCaseSearchTerm);
  });

  return (
    <>
      <button type="button" onClick={() => actions.resetWinStreak()} className="btn btn-danger" data-bs-toggle="modal" data-bs-target="#DaPaint">
        FIND FOE 💰0.01
      </button>
      <div className="modal fade" id="DaPaint" tabIndex="-1" aria-labelledby="DaPaintLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title text-2xl font-bold" id="DaPaintLabel">DA PAINT</h1>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <div className="flex-1 bg-black text-white rounded-t-3xl mt-4 overflow-y-auto">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search for a foe..."
                  className="form-control mb-3"
                />
                {filteredEvents.map((event) => (
                  <div key={event.id} className="flex justify-between items-center mb-4">
                    <div className="flex items-center">
                      {event.hostFoeId ? (
                        <>
                          <img
                            src={`/path-to-${event.hostFoeId.name?.toLowerCase() || "default"}-avatar.jpg`}
                            alt={event.hostFoeId.name || "Unknown Host"}
                            className="w-8 h-8 rounded-full mr-2"
                          />
                          <span className="text-black">{event.hostFoeId.name || "Unknown Host"}</span>
                        </>
                      ) : (
                        <span className="text-black">Unknown Host</span>
                      )}
                    </div>
                    {/* <div className="vs">VS</div>
                    <div className="flex items-center">
                      {event.foeId ? (
                        <>
                          <img
                            src={`/path-to-${event.foeId.name?.toLowerCase() || "default"}-avatar.jpg`}
                            alt={event.foeId.name || "Unknown Foe"}
                            className="w-8 h-8 rounded-full mr-2"
                          />
                          <span className="text-black">{event.foeId.name || "Unknown Foe"}</span>
                        </>
                      ) : (
                        <span className="text-black">Foe</span>
                      )}
                    </div> */}
                    <div className="text-gray-500">{event.location}</div>
                    <div className="text-gray-500">{event.distance}</div>
                    <div className="text-gray-500">{event.date_time}</div>
                    {event.hostFoeId?.id !== store.userData.id && event.hostFoeId ? (
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
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-info"
                onClick={handleAddEventClick}
              >
                Add Event
              </button>
            </div>
          </div>
        </div>
      </div>

      {showDaPaintCreate && (
        <div className="modal fade show d-block" tabIndex="-1" role="dialog" aria-labelledby="DaPaintCreateLabel" aria-hidden="true">
          <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="DaPaintCreateLabel">DAPAINT</h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={handleCloseDaPaintCreate}></button>
              </div>
              <div className="modal-body">
                <DaPaintCreate onClose={handleCloseDaPaintCreate} username="YourUsername" profilePicture="path-to-profile-pic.jpg" onAdd={addNewEvent} />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

DaPaintList.propTypes = {
  onClose: PropTypes.func.isRequired,
};

export default DaPaintList;
