import React, { useState, useEffect, useContext } from "react";
import { Context } from "../store/appContext";
import PropTypes from "prop-types";
import "../../styles/landing.css";
import { DaPaintCreate } from './dapaintcreate.js';

const DaPaintList = ({ onClose }) => {
  const { store, actions } = useContext(Context);
  const [events, setEvents] = useState([
    { id: 1, username: 'OVYEDDeno', location: 'BOXR GYM', distance: '3MILES', date: '7/12/24', time: '11 AM EST' },
  ]);
  const [showDaPaintCreate, setShowDaPaintCreate] = useState(false); // State to control DaPaintCreate modal visibility

  useEffect(() => {
    const token = localStorage.getItem("token")
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
          console.log('Lists event:', EventList);
          setEvents(EventList)
        } else {
          const error = await response.json();
          console.error('Failed to retrieve list of events:', error);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    }

    getDapaintList()
  }, []);

  const handleClockIn = async (event) => {
    const token = localStorage.getItem('token'); // Assuming the token is stored here
    const userId = store.userData.id;
    console.log("userId: ", userId);

    // Check if the current user is not the hostFoeId
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

          // Update the events state with the updated event
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

  // const addNewEvent = (newEvent) => {
  //   setEvents((prevEvents) => [...prevEvents, newEvent]);
  // };


  // const handleAddEventClick = () => {
  //   // Close the DaPaint modal and open DaPaintCreate
  //   setShowDaPaintCreate(true);
  //   const currentModal = document.getElementById('DaPaint');
  //   const modal = bootstrap.Modal.getInstance(currentModal);
  //   modal.hide();
  // };

  // const handleCloseDaPaintCreate = () => {
  //   setShowDaPaintCreate(false);
  // };

  const addNewEvent = (newEvent) => {
    setEvents((prevEvents) => [...prevEvents, newEvent]);
    setShowDaPaintCreate(false); // Close DaPaintCreate
    const currentModal = document.getElementById("DaPaint");
    const modal = new bootstrap.Modal(currentModal);
    modal.show(); // Reopen DaPaint modal
  };

  const handleAddEventClick = () => {
    // Close the DaPaint modal and open DaPaintCreate
    setShowDaPaintCreate(true);
    const currentModal = document.getElementById("DaPaint");
    const modal = bootstrap.Modal.getInstance(currentModal);
    modal.hide();
  };

  const handleCloseDaPaintCreate = () => {
    setShowDaPaintCreate(false);
    const currentModal = document.getElementById("DaPaint");
    const modal = new bootstrap.Modal(currentModal);
    modal.show(); // Reopen DaPaint modal
  };

  return (
    <>
      <button type="button" onClick={() => actions.resetWinStreak()} className="btn" data-bs-toggle="modal" data-bs-target="#DaPaint">
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
              <div className="flex-1 bg-white text-black rounded-t-3xl mt-4 overflow-y-auto">

                {events.map((event) => (
                  <div key={event.id} className="flex justify-between items-center mb-4">
                    <div className="flex items-center">
                      {event.hostFoeId ? (
                        <>
                          <img
                            src={`/path-to-${event.hostFoeId.name.toLowerCase()}-avatar.jpg`}
                            alt={event.hostFoeId.name}
                            className="w-8 h-8 rounded-full mr-2"
                          />
                          <span className="text-black">{event.hostFoeId.name}</span>
                        </>
                      ) : (
                        <span className="text-black">Unknown Host</span>
                      )}
                    </div>
                    <div className="text-gray-500">{event.location}</div>
                    <div className="text-black">{event.distance}</div>
                    <div className="text-black">{event.date_time}</div>
                    {event.hostFoeId?.id !== store.userData.id && event.hostFoeId ? (
                      <button
                        className="bg-black text-white p-2 rounded"
                        onClick={() => handleClockIn(event)}
                      >
                        CLOCK IN
                      </button>
                    ) : null}
                  </div>
                ))}

              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleAddEventClick}
              >
                Add Event
              </button>
            </div>
          </div>
        </div>
      </div >

      {
        showDaPaintCreate && (
          <div className="modal fade show d-block" tabIndex="-1" role="dialog" aria-labelledby="DaPaintCreateLabel" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title" id="DaPaintCreateLabel">DA PAINT</h5>
                  <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={handleCloseDaPaintCreate}></button>
                </div>
                <div className="modal-body">
                  <DaPaintCreate onClose={handleCloseDaPaintCreate} username="YourUsername" profilePicture="path-to-profile-pic.jpg" onAdd={addNewEvent} />
                </div>
              </div>
            </div>
          </div>
        )
      }

    </>
  );
};

DaPaintList.propTypes = {
  onClose: PropTypes.func.isRequired,
};

export default DaPaintList;