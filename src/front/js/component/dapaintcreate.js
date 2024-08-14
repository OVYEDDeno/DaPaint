import React, { useState, useEffect, useContext } from "react";
import { Context } from "../store/appContext";
import PropTypes from "prop-types";
import "../../styles/landing.css";

export const DaPaintCreate = ({ onClose, username, profilePicture, onAdd }) => {
  const { store, actions } = useContext(Context);
  const [location, setLocation] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [amount, setAmount] = useState('0');
  const [error, setError] = useState(''); // State to handle errors
  const [storedUsername, setStoredUsername] = useState('');


  // useEffect(() => {
  //   const storedUsername = localStorage.getItem("username");
  //   if(storedUsername) {
  //     username(storedUsername);
  //   } else{

  //   }
  // }, [])

  useEffect(() => {
    actions.fetchCurrentUser();
  }, []);

  const handleCreate = async () => {
    if (!validateDateTime()) {
      return;
    }

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

        setLocation('');
        setDate('');
        setTime('');
        setAmount('0');
      } else {
        const error = await response.json();
        console.error('Failed to create event:', error);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const validateDateTime = () => {
    if (!date) {
      setError('Please select a valid date.');
      return false;
    }
    if (!time) {
      setError('Please select a valid time.');
      return false;
    }
    const handleCloseDaPaintCreate = () => {
      setShowDaPaintCreate(false);
      const currentModal = document.getElementById("DaPaint");
      const modal = new bootstrap.Modal(currentModal);
      modal.show();
    };

    const selectedDateTime = new Date(`${date}T${time}`);
    const now = new Date();

    if (selectedDateTime < now) {
      setError('Please select a future date and time.');
      return false;
    }

    setError('');
    return true;
  };

  return (
    <><div className="modal-header">
      <h1 className="modal-title text-2xl font-bold" id="DaPaintLabel">DA PAINT</h1>
      {/* <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={handleCloseDaPaintCreate}></button> */}
    </div><div className="user-profile">
        <div className="bg-white text-black rounded-full p-2 flex items-center mb-2">
          {/* <img src={profilePicture} alt={username} className="w-8 h-8 rounded-full mr-2" /> */}
          {/* <span>{username}</span> */}
          <span>{store.userData && store.userData.profilePicture}</span>
          <span>{store.userData && store.userData.name}</span>
        </div>

        <label class="form-label" for="stateSelect">Fitness Style:</label>
        <select class="form-select" id="fitnessSelect" name="fitness">
          <option value="boxing">Boxing</option>
          <option value="break dancing">Breaking Dancing</option>
        </select>

        <label class="form-label" for="locationSelect">Select a Location:</label><input
          type="text"
          placeholder="LOCATION"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="w-full p-2 mb-4 border-b border-gray-300 focus:outline-none" />

        {error && <div className="text-red-500 mb-4">{error}</div>}

        <div className="flex mb-4">
          <label className="form-label mr-4" for="stateSelect">Select a Date:</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-1/2 p-2 mr-6 border-b border-gray-300 focus:outline-none" /><div><p></p></div>
          <label className="form-label mr-4" for="timeSelect">Select a Time:</label>
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="w-1/2 p-2 border-b border-gray-300 focus:outline-none" />
        </div>


        <label class="form-label" for="stateSelect">Ticket Prices:</label><input
          type="number"
          placeholder="AMOUNT"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full p-2 mb-4 border-b border-gray-300 focus:outline-none" />

        <button
          onClick={handleCreate}
          className="w-full bg-black text-white p-2 rounded">
          CREATE
        </button>
      </div></>
  );
};

DaPaintCreate.propTypes = {
  onClose: PropTypes.func.isRequired,
  username: PropTypes.string.isRequired,
  profilePicture: PropTypes.string.isRequired,
  onAdd: PropTypes.func.isRequired
};
