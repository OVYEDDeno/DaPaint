import React, { useState, useEffect, useContext } from "react";
import { Context } from "../store/appContext.js";
import "../../styles/profile.css"; // Assuming you will create this CSS file
import { EditProfile } from "./editprofile.js";

export const Profile = () => {
  const { store, actions } = useContext(Context);

  useEffect(() => {
    actions.fetchCurrentUser();
  }, []);

  return (
    <div></div>
  );
  }

