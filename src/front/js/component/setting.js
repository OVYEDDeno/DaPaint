import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from 'react-router-dom';
import "../../styles/setting.css";
import { Context } from "../store/appContext"

export const Setting = ({ onClose }) => {
  const { store, actions } = useContext(Context);
  const navigate = useNavigate();
  const updateAct = async () => {
    let options = {
      method: "PUT",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token")
      }

    }
    let response = await fetch(process.env.BACKEND_URL + "/api/act", options);
    if (response.status != 200) {
      console.log("Error Deactivating User: ", response.statusText);
      alert("Error Deactivating User");
    }
    else {
      actions.fetchCurrentUser()
    }
  }
  const handleLogout = () => {
    localStorage.removeItem("token");
    console.log("Log out successful");
    navigate("/");
  };
  return (
    <> 
    <button class="btn" data-bs-target="#setting" data-bs-toggle="modal">SETTING</button>

      <div class="modal fade" id="setting" aria-labelledby="setting" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header">
              <h3 className="text-2xl font-bold text-black">SETTING</h3>
              <button type="button" class="btn-close closeIcon" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <div className="space-y-4">
                <button className="w-full py-2 bg-black text-white rounded-full font-bold hover:bg-gray-800">
                  FEEDBACK
                </button>
                <button className="w-full py-2 bg-black text-white rounded-full font-bold hover:bg-gray-800" data-bs-target="#exampleModalToggle2" data-bs-toggle="modal">Deactivate</button>

                <button className="w-full py-2 bg-black text-white rounded-full font-bold hover:bg-gray-800" onClick={handleLogout}>
                  CLOCK OUT
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="modal fade" id="exampleModalToggle2" aria-hidden="true" aria-labelledby="exampleModalToggleLabel2" tabindex="-1">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header">
              <h1 class="modal-title fs-5" id="exampleModalToggleLabel2">Modal 2</h1>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              Are you sure you want to deactivate your account?
            </div>
            <div class="modal-footer">
              <button class="btn btn-primary" data-bs-target="#setting" data-bs-toggle="modal">CANCEL</button>
              <button class="btn btn-primary" data-bs-target="#setting" data-bs-toggle="modal" onClick={()=>updateAct()}>Submit</button>

            </div>
          </div>
        </div>
      </div>




    </>
  );
};