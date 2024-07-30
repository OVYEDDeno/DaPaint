import React, { useState, useEffect } from "react";
import "../../styles/landing.css";
import { X } from 'lucide-react';

const DaPaintList = ({ onClose, onAdd }) => {
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

  return (
    <div className="fixed inset-0 bg-black text-white flex flex-col">
      <div className="flex justify-between items-center p-4">
        <h1 className="text-2xl font-bold">DA PAINT</h1>
        <X size={24} onClick={onClose} className="text-red-500" />
      </div>
      
      <div className="flex-1 p-4 bg-white text-black rounded-t-3xl mt-4 overflow-y-auto">
        {events.map((event) => (
          <div key={event.id} className="flex justify-between items-center mb-4">
            <div className="flex items-center">
              <img src={`/path-to-${event.username.toLowerCase()}-avatar.jpg`} alt={event.username} className="w-8 h-8 rounded-full mr-2" />
              <span className="font-bold">{event.username}</span>
            </div>
            <div className="text-right">
              <div>{event.location} {event.distance}</div>
              <div>{event.date} {event.time}</div>
              <button 
                onClick={() => handleClockIn(event.id)}
                className="bg-black text-white px-2 py-1 rounded-full text-xs mt-1"
              >
                CLOCK IN
              </button>
            </div>
          </div>
        ))}
      </div>
      
      <div className="p-4">
        <button
          onClick={onAdd}
          className="w-full bg-white text-black p-3 rounded-full flex items-center justify-center"
        >
          <span className="text-2xl mr-2">+</span> ADD
        </button>
      </div>
    </div>
  );
};

export default DaPaintList;