import React, { useState, useEffect } from "react";
import "../../styles/setting.css";

export const Setting = ({ onClose }) => {
  const handleLogout = () => {
    localStorage.removeItem("token");
    console.log("Log out successful");
    navigate("/auth");
  };
  return (
    <><button type="button" class="btn" data-bs-toggle="modal" data-bs-target="#setting">
      SETTING
    </button>

      <div class="modal fade" id="setting" aria-labelledby="setting" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h3 className="text-2xl font-bold text-black">SETTING</h3>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <div className="space-y-4">
                  <button className="w-full py-2 bg-black text-white rounded-full font-bold hover:bg-gray-800">
                    FEEDBACK
                  </button>
                  <button className="w-full py-2 bg-black text-white rounded-full font-bold hover:bg-gray-800">
                    SUGGESTIONS
                  </button>
                  <button className="w-full py-2 bg-black text-white rounded-full font-bold hover:bg-gray-800" onClick={handleLogout}>
                    CLOCK OUT
                  </button>
                </div>              
            </div>          
          </div>
        </div>
      </div>




    </>
  );
};