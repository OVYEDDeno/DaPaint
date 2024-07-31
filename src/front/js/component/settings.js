import React, { useState, useEffect } from "react";
import "../../styles/settings.css";
import { X } from 'lucide-react';

export const Settings = ({ onClose }) => {
  return (
    <div className="bg-white rounded-lg w-80 p-4 shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-2xl font-bold text-black">SETTINGS</h3>
        <button onClick={onClose} className="text-red-500 hover:text-red-700">
          <X size={24} />
        </button>
      </div>
      <div className="space-y-4">
        <button className="w-full py-2 bg-black text-white rounded-full font-bold hover:bg-gray-800">
          FEEDBACK
        </button>
        <button className="w-full py-2 bg-black text-white rounded-full font-bold hover:bg-gray-800">
          SUGGESTIONS
        </button>
        <button className="w-full py-2 bg-black text-white rounded-full font-bold hover:bg-gray-800">
          LOGOUT
        </button>
      </div>
    </div>
  );
};