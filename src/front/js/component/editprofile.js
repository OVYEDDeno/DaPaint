import React, { useState, useEffect, useContext } from "react";
import { Context } from "../store/appContext";
import "../../styles/profile.css"; // Assuming you will create this CSS file

export const EditProfile = ({ onClose, initialData }) => {
  const { store, actions } = useContext(Context);
  const [name, setName] = useState(initialData?.name || '');
  const [city, setCity] = useState(initialData?.city || '');
  const [email, setEmail] = useState(initialData?.email || '');
  const [zipcode, setZipcode] = useState(initialData?.zipcode || '');
  const [birthday, setBirthday] = useState(initialData?.birthday || '');
  const [phone, setPhone] = useState(initialData?.phone || '');
  const [picture, setPicture] = useState(null);
  const [imageSizeError, setImageSizeError] = useState(false);
  const [previewURL, setPreviewURL] = useState(initialData?.picture || '');

  useEffect(() => {
    if (picture) {
      const temp = URL.createObjectURL(picture);
      setPreviewURL(temp);
    }
  }, [picture]);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file.size <= 100000) {
      setImageSizeError(false);
      setPicture(file);
    } else {
      setImageSizeError(true);
    }
  };

  const handleSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append('data', JSON.stringify({
        email,
        name,
        city,
        zipcode,
        phone,
        birthday,
      }));
      if (picture) {
        formData.append('file', picture);
      }

      console.log('Form data being sent:', formData);

      const response = await fetch(`${process.env.BACKEND_URL}/user/edit`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${store.token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.msg || 'Something went wrong');
      }

      console.log('Profile updated successfully');

      onClose();
      setName("");
      setCity("");
      setEmail("");
      setZipcode("");
      setBirthday("");
      setPhone("");
      setPicture(null);
      setPreviewURL("");
      document.getElementById("pictureInput").value = "";
      setImageSizeError(false);
    } catch (error) {
      console.error('Error during profile update:', error);
    }
  };

  return (
    <>
      <button type="button" className="btn" data-bs-toggle="modal" data-bs-target="#staticBackdrop">
        <div className="profile-container">
          <div className="profile-header">
            <div className="profile-picture-section">
              <img
                src={previewURL || "https://static-00.iconduck.com/assets.00/oncoming-fist-medium-dark-emoji-2048x1797-dmd9wvcy.png"}
                alt="Profile"
                className="profile-picture"
              />
            </div>
          </div>
        </div>
      </button>

      <div className="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-body">
              <div className="fixed inset-0 bg-black text-white flex flex-col">
                <div className="flex justify-between items-center p-4">
                  <h1 className="text-2xl font-bold">
                    EDIT
                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                  </h1>
                </div>

                <div className="flex-1 p-4 bg-white text-black rounded-t-3xl mt-4">
                  <div className="flex items-center mb-6">
                    <input
                      id="pictureInput"
                      type="file"
                      className="rounded-circle"
                      name="myImage"
                      accept="image/png, image/gif, image/jpeg, image/bmp, image/svg+xml, image/webp"
                      onChange={handleImageUpload}
                    />
                    <div className="space-y-2 flex-1">
                      <div className="bg-black text-white p-2 rounded-full">
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Name"
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
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="Phone number"
                          className="bg-transparent w-full outline-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              <button type="button" className="btn btn-primary" onClick={handleSubmit}>Save</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
