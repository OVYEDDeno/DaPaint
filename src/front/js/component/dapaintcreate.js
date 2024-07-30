import React, { useState, useEffect } from "react";
import "../../styles/landing.css";
import { X, ChevronLeft } from 'lucide-react';

export const DaPaintCreate = ({ onClose, username, profilePicture }) => {
  const [location, setLocation] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [amount, setAmount] = useState('0');

  const handleCreate = () => {
    console.log('Creating with:', { location, date, time, amount });
    // Add your creation logic here
  };

  return (
    <div className="fixed inset-0 bg-black text-white flex flex-col">
      <div className="flex justify-between items-center p-4">
        <ChevronLeft size={24} />
        <h1 className="text-2xl font-bold">DA PAINT</h1>
        <X size={24} onClick={onClose} className="text-red-500" />
      </div>
      
      <div className="flex-1 p-4 bg-white text-black rounded-t-3xl mt-4">
        <div className="bg-black text-white rounded-full p-2 flex items-center mb-6">
          <img src={profilePicture} alt={username} className="w-8 h-8 rounded-full mr-2" />
          <span>{username}</span>
        </div>
        
        <input
          type="text"
          placeholder="LOCATION"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="w-full p-2 mb-4 border-b border-gray-300 focus:outline-none"
        />
        
        <div className="flex mb-4">
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-1/2 p-2 mr-2 border-b border-gray-300 focus:outline-none"
          />
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="w-1/2 p-2 border-b border-gray-300 focus:outline-none"
          />
        </div>
        
        <div className="relative mb-8">
          <span className="absolute left-0 top-2 text-2xl">$</span>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full p-2 pl-6 text-2xl border-b border-gray-300 focus:outline-none"
          />
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
  );
};