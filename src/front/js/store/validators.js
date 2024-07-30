import React, { useState } from "react";

export const ValidateEmail = (email, setInvalidItems) => {
  console.log("this is the email", email);
  let validRegex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  if (
    email.trim() === "" ||
    !email.match(validRegex) ||
    email.length < 8 ||
    email.length >= 120
  ) {
    setInvalidItems((prevInvalidItems) => [...prevInvalidItems, "email"]);
    return false;
  } else {
    setInvalidItems((prevInvalidItems) =>
      prevInvalidItems.filter((item) => item !== "email")
    );
    return true;
  }
};

export const ValidatePhone = (phone, setInvalidItems) => {
  if (phone.trim() === "" || phone.length < 10 || phone.length > 15) {
    setInvalidItems((prevInvalidItems) => [...prevInvalidItems, "phone"]);
    return false;
  }
  setInvalidItems((prevInvalidItems) =>
    prevInvalidItems.filter((item) => item !== "phone")
  );
  return true;
};

export const ValidateFirstName = (first_name, setInvalidItems) => {
  if (
    first_name.trim() === "" ||
    first_name.length <= 2 ||
    first_name.length > 25
  ) {
    setInvalidItems((prevInvalidItems) => [...prevInvalidItems, "firstName"]);
    return false;
  }
  setInvalidItems((prevInvalidItems) =>
    prevInvalidItems.filter((item) => item !== "firstName")
  );
  return true;
};

export const ValidateLastName = (last_name, setInvalidItems) => {
  if (
    last_name.trim() === "" ||
    last_name.length <= 2 ||
    last_name.length > 25
  ) {
    setInvalidItems((prevInvalidItems) => [...prevInvalidItems, "lastName"]);
    return false;
  }
  setInvalidItems((prevInvalidItems) =>
    prevInvalidItems.filter((item) => item !== "lastName")
  );
  return true;
};

export const ValidatePassword = (password, setInvalidItems) => {
  if (password.trim() === "" || password.length <= 5 || password.length > 20) {
    setInvalidItems((prevInvalidItems) => [...prevInvalidItems, "password"]);
    return false;
  }
  setInvalidItems((prevInvalidItems) =>
    prevInvalidItems.filter((item) => item !== "password")
  );
  return true;
};

export const ValidateAddress = (address, setInvalidItems) => {
  if (address.trim() === "" || address.length <= 6 || address.length > 80) {
    setInvalidItems((prevInvalidItems) => [...prevInvalidItems, "address"]);
    return false;
  }
  setInvalidItems((prevInvalidItems) =>
    prevInvalidItems.filter((item) => item !== "address")
  );
  return true;
};

export const ValidateImages = (uploadedImages, setInvalidItems) => {
  if (uploadedImages.length === 0) {
    setInvalidItems((prevInvalidItems) => [...prevInvalidItems, "images"]);
    return false;
  }
  setInvalidItems((prevInvalidItems) =>
    prevInvalidItems.filter((item) => item !== "images")
  );
  return true;
};

export const ValidateTextArea = (description, setInvalidItems) => {
  if (
    description.trim() === "" ||
    description.length < 5 ||
    description.length > 500
  ) {
    setInvalidItems((prevInvalidItems) => [...prevInvalidItems, "description"]);
    return false;
  }
  setInvalidItems((prevInvalidItems) =>
    prevInvalidItems.filter((item) => item !== "description")
  );
  return true;
};