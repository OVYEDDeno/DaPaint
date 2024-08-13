import React, { useState, useContext } from "react";
import "../../styles/profile.css";
import { AppContext } from "../store/appContext";


export const Invite = ({ onClose }) => {
  const [invites, setInvites] = useState(3);
  const [inviteCode, setInviteCode] = useState('');

  // Function to handle sending an invite
  const handleSendInvite = () => {
    if (invites > 0) {
      fetch('/api/send-invite', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ /* invite data */ }),
      })
        .then(response => response.json())
        .then(data => {
          console.log('Invite sent:', data);
          setInvites(invites - 1); // Decrease invite count
        })
        .catch(error => {
          console.error('Error sending invite:', error);
        });
    } else {
      alert('No invites left');
    }
  };

  // Function to generate an invite code
  const handleGenerateInviteCode = () => {
    const newCode = `INV-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    setInviteCode(newCode);
    console.log('Generated invite code:', newCode);
  };

  export const Invite = ({ onClose }) => {
    const [invites, setInvites] = useState(3);
    const { setInviteCode } = useContext(AppContext);

    const handleGenerateInviteCode = () => {
      const newCode = `INV-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
      setInviteCode(newCode);
      console.log('Generated invite code:', newCode);
    };

    return (
      <>
        <button type="button" className="btn" data-bs-toggle="modal" data-bs-target="#invite">
          INVITE
        </button>

        <div className="modal fade" id="invite" tabIndex="-1" aria-labelledby="invite" aria-hidden="true">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h2 className="text-2xl font-bold flex justify-between items-center mb-4">INVITE</h2>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div className="modal-body">
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                  <div className="bg-white rounded-lg p-6 w-80">
                    <p className="text-center mb-4">WHO'S A GREAT POTENTIAL ADDITION TO DIDDY?</p>
                    <div className="bg-black text-white p-2 rounded-full flex justify-between items-center mb-4">
                      <span>You have {invites} invites</span>
                      <span>▼</span>
                    </div>
                    <button
                      className="w-full bg-black text-white p-2 rounded-full flex items-center justify-center mb-4"
                      onClick={handleSendInvite}
                    >
                      <span className="mr-2">+</span>
                      <span>0.01</span>
                    </button>
                    <div className="mb-4">
                      <button
                        className="w-full bg-black text-white p-2 rounded-full flex items-center justify-center mb-4"
                        onClick={handleGenerateInviteCode}
                      >
                        Generate Invite Code
                      </button>
                      {inviteCode && (
                        <p className="text-center text-black mt-2">Invite Code: {inviteCode}</p>
                      )}
                    </div>
                    <div>
                      <h3 className="font-bold mb-2">NOTIFICATIONS</h3>
                      <p>OVYEDDENO CLOCK YOUR MATCH</p>
                      <p>OVYEDDENO ACCEPTED YOUR MATCH</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                <button type="button" className="btn btn-primary">Save changes</button>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  };
