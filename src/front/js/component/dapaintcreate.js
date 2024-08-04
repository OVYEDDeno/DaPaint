import React, { useState } from "react";
import PropTypes from "prop-types";
import "../../styles/landing.css";

export const DaPaintCreate = ({ onClose, username, profilePicture, onAdd }) => {
  const [location, setLocation] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [amount, setAmount] = useState('0');
  const [isOpen, setIsOpen] = useState(false); // State to control modal visibility

  const handleCreate = async () => {
    const dateTime = `${date} ${time}:00`; // Format: YYYY-MM-DD HH:MM:SS
    const token = localStorage.getItem('token'); // Assuming the token is stored here

    const newEvent = {
      location,
      date_time: dateTime,
      price: parseFloat(amount)
    };

    try {
      const response = await fetch(`${process.env.BACKEND_URL}/api/dapaint`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newEvent)
      });

      if (response.ok) {
        const createdEvent = await response.json();
        console.log('Created event:', createdEvent);
        onAdd(createdEvent); // Update the event list in DaPaintList
        handleClose(); // Close the modal
      } else {
        const error = await response.json();
        console.error('Failed to create event:', error);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => {
    setIsOpen(false);
    // onClose();
  };

  return (
    <>
      <button type="button" className="btn position-fixed " onClick={handleOpen}>
        + ADD
      </button>

      {isOpen && (
        <div className="modal fade show d-block" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">DA PAINT</h5>
                <button onClick={handleClose} type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div className="modal-body">
                <div className="user-profile">
                  <div className="bg-black text-white rounded-full p-2 flex items-center mb-6">
                    <img src={profilePicture} alt={username} className="w-8 h-8 rounded-full mr-2" />
                    <span>{username}</span>
                  </div>

                  <input
                    type="text"
                    placeholder="LOCATION"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full p-2 mb-4 border-b border-gray-300 focus:outline-none" />

                  <div className="flex mb-4">
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-1/2 p-2 mr-2 border-b border-gray-300 focus:outline-none" />
                    <input
                      type="time"
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      className="w-1/2 p-2 border-b border-gray-300 focus:outline-none" />
                  </div>

                  <div className="relative mb-8">
                    <span className="absolute left-0 top-2 text-2xl">$</span>
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="w-full p-2 pl-6 text-2xl border-b border-gray-300 focus:outline-none" />
                  </div>

                  <button
                    onClick={handleCreate}
                    className="w-full bg-black text-white p-3 rounded-full flex items-center justify-center"
                  >
                    CREATE
                    <span className="ml-2">•0.01</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>)

      }
    </>)
};

DaPaintCreate.propTypes = {
  onClose: PropTypes.func.isRequired,
  username: PropTypes.string.isRequired,
  profilePicture: PropTypes.string.isRequired,
  onAdd: PropTypes.func.isRequired
};