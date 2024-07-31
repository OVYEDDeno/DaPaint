import React, { useState, useEffect } from "react";
import { Context } from "../store/appContext";
import "../../styles/profile.css"; // Assuming you will create this CSS file
import { X, ChevronLeft } from 'lucide-react';

export const EditProfile = ({ onClose, initialData }) => {
  const [name, setName] = useState(initialData?.name || '');
  const [city, setCity] = useState(initialData?.city || '');
  const [email, setEmail] = useState(initialData?.email || '');
  const [zipcode, setZipcode] = useState(initialData?.zipcode || '');
  const [birthday, setBirthday] = useState(initialData?.birthday || '');
  const [phone, setPhone] = useState(initialData?.phone || '');
  const [picture, setPicture] = useState("");
  const [imageSizeError, setImageSizeError] = useState(false);
  const [previewURL, setPreviewURL] = useState("");

  useEffect(() => {
    if (!picture) return;
    let temp = URL.createObjectURL(picture);
    setPreviewURL(temp);
  }, [picture]);

  const handleImageUpload = (event) => {
    const files = event.target.files;

    let file_size = files[0].size;

    if (file_size <= 100000) {
      setImageSizeError(false);
      setPicture(files[0]);
    } else {
      setImageSizeError(true);
    }
  };

const handleSubmit = async () => {
      let result = await actions.addMembers(
        email,
				name,
				city,
				zipcode,
				phone,
				birthday,
				picture
      );

      if (result) {
        setName("");
        setPicture("");
        document.getElementById("pictureInput").value = "";
        setImageSizeError(false);
        setPreviewURL("");
      } else {
        console.log("There was an error attempting to create the member!");
      }
    }


  return (
    <div className="fixed inset-0 bg-black text-white flex flex-col">
      <div className="flex justify-between items-center p-4">
        <ChevronLeft size={24} />
        <h1 className="text-2xl font-bold">EDIT</h1>
        <X size={24} onClick={onClose} className="text-red-500" />
      </div>
      
      <div className="flex-1 p-4 bg-white text-black rounded-t-3xl mt-4">
        <div className="flex items-center mb-6">
        <input
            id="pictureInput"
            type="file"
            className="rounded-circle"
            name="myImage"
            accept="image/png, image/gif, image/jpeg, image/bmp, image/svg+xml, image/webp"
            onChange={(e) => {
              if (e.target.files && e.target.files.length > 0) {
                handleImageUpload(e);
              } else {
                <img
                  height="200px"
                  className="rounded-circle"
                  src="https://static-00.iconduck.com/assets.00/oncoming-fist-medium-dark-emoji-2048x1797-dmd9wvcy.png"
                />;
              }
            }}
          />
          <div className="space-y-2 flex-1">
            <div className="bg-black text-white p-2 rounded-full">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Name : }"
                className="bg-transparent w-full outline-none"
              />
            </div>
            <div className="bg-black text-white p-2 rounded-full">
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="City"
                className="bg-transparent w-full outline-none"
              />
            </div>
            <div className="bg-black text-white p-2 rounded-full">
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="Phone number"
                className="bg-transparent w-full outline-none"
              />
            </div>
          </div>
        </div>
        
        <button
          onClick={handleChangePin}
          className="w-full bg-black text-white p-3 rounded-full mb-4"
        >
          CHANGE PIN
        </button>
        
        <button
          onClick={handleSave}
          className="w-full bg-black text-white p-3 rounded-full"
        >
          SAVE
        </button>
      </div>
    </div>
  );
};