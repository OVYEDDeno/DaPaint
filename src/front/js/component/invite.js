import React, { useState, useEffect } from "react";
import "../../styles/landing.css";
import { X } from 'lucide-react';

export const Invite = ({ onClose }) => {
  const [invites, setInvites] = useState(3);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-6 w-80">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">INVITE</h2>
          <button onClick={onClose} className="text-red-500">
            <X size={24} />
          </button>
        </div>
        <p className="text-center mb-4">WHO'S A GREAT POTENTIAL ADDITION TO DIDDY?</p>
        <div className="bg-black text-white p-2 rounded-full flex justify-between items-center mb-4">
          <span>You have {invites} invites</span>
          <span>▼</span>
        </div>
        <button className="w-full bg-black text-white p-2 rounded-full flex items-center justify-center mb-4">
          <span className="mr-2">+</span>
          <span>0.01</span>
        </button>
        <div>
          <h3 className="font-bold mb-2">NOTIFICATIONS</h3>
          <p>OVYEDDENO CLOCK YOUR MATCH</p>
          <p>OVYEDDENO ACCEPTED YOUR MATCH</p>
        </div>
      </div>
    </div>
  );
};