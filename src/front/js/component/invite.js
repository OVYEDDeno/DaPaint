import React, { useState, useEffect } from "react";
import "../../styles/profile.css";

export const Invite = ({ onClose }) => {
  const [invites, setInvites] = useState(3);

  return (
    <><button type="button" class="btn" data-bs-toggle="modal" data-bs-target="#invite">
    INVITE
  </button>

  <div class="modal fade" id="invite" tabindex="-1" aria-labelledby="invite" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered">
    <div class="modal-content">
      <div class="modal-header">
        <h2 className="text-2xl font-bold flex justify-between items-center mb-4">INVITE</h2>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-6 w-80">
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
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
        <button type="button" class="btn btn-primary">Save changes</button>
      </div>
    </div>
  </div>
</div>



    </>
  );
};