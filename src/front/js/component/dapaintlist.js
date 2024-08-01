import React, { useState } from "react";
import PropTypes from "prop-types";
import "../../styles/landing.css";
import { DaPaintCreate } from './dapaintcreate.js';

const DaPaintList = ({ onClose }) => {
  const [events, setEvents] = useState([
    { id: 1, username: 'OVYEDDeno', location: 'BOXR GYM', distance: '3MILES', date: '7/12/24', time: '11 AM EST' },
    { id: 2, username: 'JBeat', location: 'BOXR GYM', distance: '3MILES', date: '7/12/24', time: '11 AM EST' },
    { id: 3, username: 'OVYEDDeno', location: 'BOXR GYM', distance: '3MILES', date: '7/12/24', time: '11 AM EST' },
    { id: 4, username: 'JBeat', location: 'BOXR GYM', distance: '3MILES', date: '7/12/24', time: '11 AM EST' },
    { id: 5, username: 'OVYEDDeno', location: 'BOXR GYM', distance: '3MILES', date: '7/12/24', time: '11 AM EST' },
  ]);

  const handleClockIn = (id) => {
    console.log('Clocking in for event:', id);
    // Add your clock in logic here
  };

  const addNewEvent = (newEvent) => {
    setEvents((prevEvents) => [...prevEvents, newEvent]);
  };

  return (
    <>
      <button type="button" className="btn" data-bs-toggle="modal" data-bs-target="#DaPaint">
        FIND FOE 💰0.01
      </button>
      <div className="modal fade" id="DaPaint" tabIndex="-1" aria-labelledby="DaPaint" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
          <div className="modal-content">
            <div className="fixed inset-0 bg-black text-white flex flex-col">
              <div className="flex justify-between items-center p-4">
                <h1 className="text-2xl font-bold">DA PAINT</h1>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
            </div>
            <div className="modal-body">
              <div className="fixed inset-0 bg-black text-white flex flex-col">
                <div className="flex-1 p-4 bg-white text-black rounded-t-3xl mt-4 overflow-y-auto">
                  {events.map((event) => (
                    <div key={event.id} className="flex justify-between items-center mb-4">
                      <div className="flex items-center">
                        <img src={`/path-to-${event.username.toLowerCase()}-avatar.jpg`} alt={event.username} className="w-8 h-8 rounded-full mr-2" />
                        <span className="text-black">{event.username}</span>
                      </div>
                      <div className="text-gray-500">{event.location}</div>
                      <div className="text-black">{event.distance}</div>
                      <div className="text-black">{event.date} {event.time}</div>
                      <button
                        className="bg-black text-white p-2 rounded"
                        onClick={() => handleClockIn(event.id)}
                      >
                        CLOCK IN
                      </button>
                    </div>
                  ))}
                </div>
                <DaPaintCreate onClose={onClose} username="YourUsername" profilePicture="path-to-profile-pic.jpg" onAdd={addNewEvent} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

DaPaintList.propTypes = {
  onClose: PropTypes.func.isRequired,
};

export default DaPaintList;