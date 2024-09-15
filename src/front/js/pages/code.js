import React, { useState, useContext, useEffect } from "react";
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom";
import "../../styles/auth.css";

export const Code = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ invitationCode: "" });
  const [error, setError] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  function submitcode(formData, navigate, setError) {
      fetch(process.env.BACKEND_URL + "/api/process-invite-code", {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
              "Authorization": "Bearer " + localStorage.getItem("token"),
          },
          body: JSON.stringify({
              invite_code: formData.invitationCode,
          }),
      })
          .then((response) => {
              if (!response.ok) {
                  throw new Error(`HTTP error! Status: ${response.status}`);
              }
              return response.json();
          })
          .then((data) => {
              navigate("/landing");
          })
          .catch((error) => {
              setError({ invitationCode: "Invalid or expired invitation code." });
          });
  }
  useEffect(
    () =>{
        submitcode(formData, navigate, setError);
    },[]
  )
  const handleSubmit = (e) => {
    e.preventDefault();
    submitcode(formData, navigate, setError);
  };

  return (
    <>
      <div className="center-container">
        <a href="/" onClick={() => window.location.reload()}>
          {/* <img
                    src="https://static-00.iconduck.com/assets.00/oncoming-fist-medium-dark-emoji-2048x1797-dmd9wvcy.png"
                    alt="Logo"
                    className="logo" /> */}
        </a>
      </div>
      <div className="container mt">
        <form
          onSubmit={handleSubmit}
          className="mx-auto p-4 border border-2 rounded-300 w-50"
        >
          <div className="mb-3">
            <label className="form-label">Invitation Code</label>
            <input
              type="text"
              name="invitationCode"
              value={formData.invitationCode}
              onChange={handleChange}
              className="form-control"
              required
            />
            {error.invitationCode && (
              <div className="alert alert-danger" role="alert">
                {error.invitationCode}
              </div>
            )}
          </div>
          <button type="submit" className="btn btn-primary w-100">
            Submit
          </button>
        </form>
      </div>
    </>
  );
};

