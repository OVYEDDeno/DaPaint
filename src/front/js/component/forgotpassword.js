import React, { useState, Component } from "react";
import "../../styles/auth.css";
import { searchParams, useSearchParams } from "react-router-dom";

export const ForgotPassword = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [password, setPassword] = useState("");
  let token = searchParams.get("token");
  const  handleSubmit = async (e) => {
    e.preventDefault();
    // Send password to server with token
    // Redirect to login page upon successful reset
    let response=await fetch(process.env.BACKEND_URL + "/api/change-password",{
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          password: password,
        }),  
    })
    let data=await response.json()
    console.log(data)
  };

  return (
    <div>
      <h1>Reset Password Page</h1>
      <input
        type="text"
        placeholder="New Password"
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={(e)=>handleSubmit(e)}>Confirm</button>
    </div>
  );
};
