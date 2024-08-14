import React, { useState, useContext } from "react";
import "../../styles/profile.css";
import { Context } from '../store/appContext';

export const Invite = ({ onClose }) => {
  const [invites, setInvites] = useState(3);
  const [inviteCodeList, setInviteCodeList] = useState([]);
  const { store, actions } = useContext(Context);
  const { inviteCode } = store;
  const { setInviteCode } = actions;

  // Function to handle sending an invite
  const handleSendInvite = () => {
    if (invites > 0) {
      fetch('/api/invite-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}` // Ensure token is included
        }
      })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
          console.log('Invite code created:', data);
          setInviteCode(data.code); // Set the invite code in the context
          setInviteCodeList([...inviteCodeList, data.code]); // Add to list of invite codes
          setInvites(invites - 1); // Decrease invite count
      })
      .catch(error => {
          console.error('Error creating invite code:', error);
          alert('Error creating invite code. Please try again.');
      });
    } else {
      alert('No invites left');
    }
  };

  // Function to generate an invite code
  const handleGenerateInviteCode = () => {
    fetch('/api/invite-code', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      setInviteCode(data.code); // Use the action to update inviteCode
      console.log('Generated invite code:', data.code);
    })
    .catch(error => {
      if (error.message.includes('401')) {
        console.error('Unauthorized error:', error);
        alert('Please login to generate invite codes.');
      } else if (error.message.includes('404')) {
        console.error('Not found error:', error);
        alert('Invalid request. Please try again.');
      } else {
        console.error('Error generating invite code:', error);
        alert('Error generating invite code. Please try again.');
      }
    });
  };

  // Function to use an invite code
  const handleUseInviteCode = (code) => {
    fetch('/api/invite-code/use', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ code })
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      console.log('Invite code used:', data);
      setInviteCodeList(inviteCodeList.filter(c => c !== code)); // Remove used code from the list
    })
    .catch(error => {
      console.error('Error using invite code:', error);
      alert('Error using invite code. Please try again.');
    });
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
              <p className="text-center mb-4">WHO&apos;S A GREAT POTENTIAL ADDITION TO DIDDY?</p>
              <div className="bg-black text-white p-2 rounded-full flex justify-between items-center mb-4">
                <span>You have {invites} invites</span>
                <span>▼</span>
              </div>
              <button
                className="w-full bg-black text-white p-2 rounded-full flex items-center justify-center mb-4"
                onClick={handleSendInvite}
              >
                <span className="mr-2">+</span>
                <span>Send Invite</span>
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
              <div>
                <h3 className="font-bold mb-2">Your Invite Codes</h3>
                <ul>
                  {inviteCodeList.map((code, index) => (
                    <li key={index}>
                      {code} <button onClick={() => handleUseInviteCode(code)}>Use Code</button>
                    </li>
                  ))}
                </ul>
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