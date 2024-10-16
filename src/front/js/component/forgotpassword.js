import React, { useState, Component } from "react";
import "../../styles/auth.css";
import { searchParams, useSearchParams } from "react-router-dom";

export const ForgotPassword = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [password, setPassword] = useState("");
  let token = searchParams.get("token");
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Send password to server with token
    // Redirect to login page upon successful reset
    let response = await fetch(
      process.env.BACKEND_URL + "/api/change-password",
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          password: password,
        }),
      }
    );
    let data = await response.json();
    console.log(data);
  };

  return (
    <>
      <div className="center-container">
        <a href="/auth" onClick={() => location.reload()}>
          <img
            src="https://icons.iconarchive.com/icons/microsoft/fluentui-emoji-3d/512/Oncoming-Fist-3d-Medium-Dark-icon.png"
            alt="Logo"
            className="DaPaintlogo"
          />
        </a>
      </div>
      <div className="container  text-center">
        <h1 className="text-white">Reset Password</h1>
        <div className="m-3">
          <input
            type="text"
            placeholder="New Password"
            onChange={(e) => setPassword(e.target.value)}
            className="form-control"
          />
        </div>
        <button className="forgot-button w-50"
        onClick={(e) => handleSubmit(e)}>
          Confirm
        </button>
      </div>
    </>
  );
};
