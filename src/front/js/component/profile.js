import React, { useState, useEffect, useContext } from "react";
import { Context } from "../store/appContext";
import "../../styles/profile.css"; // Assuming you will create this CSS file
import { EditProfile } from "../component/editprofile.js";

export const Profile = () => {
  const { store, actions } = useContext(Context);

  useEffect(() => {
    actions.fetchCurrentUser();
  }, []);

  return (
    <div></div>
  );
  }

