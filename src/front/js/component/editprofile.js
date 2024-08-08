import React, { useState, useContext, useEffect } from "react";
import { Context } from "../store/appContext";
import "../../styles/profile.css"; // Assuming you will create this CSS file
import { Phone } from "lucide-react";

export const EditProfile = ({ onClose, initialData, setProfileData }) => {
  // const { store, actions } = useContext(Context);
  // const [imageSizeError, setImageSizeError] = useState(false);
  // const [uploadedImages, setUploadedImages] = useState([]);
  const [user, setUser] = useState({
    email: "",
    is_active: true,
    namecity: "",
    zipcode: "",
    Phone: "",
    birthday: "",

  })

  // useEffect(() => {
  //   fetch(process.env.BACKEND_URL + "/api/current-user", {
  //     headers: { Authorization: "Bearer " + localStorage.getItem("token") }
  //   })
  //     .then(resp => resp.json())
  //     .then(data => setUser(data))
  //     .catch(error => console.log(error))
  // }, []);

  // const handleImageUpload = (event) => {
  //   const files = event.target.files;
  //   const newImages = [];
  //   for (let index = 0; index < files.length; index++) {
  //     if (files[index].size <= 100000) {
  //       setImageSizeError(false);
  //       newImages.push(files[index]);
  //     } else {
  //       setImageSizeError(true);
  //     }
  //   }
  //   setUploadedImages((prev) => [...prev, ...newImages]);
  // };

  // const handleNewImage = async () => {
  //   const formData = new FormData();
  //   uploadedImages.forEach((image) => {
  //     formData.append("file", image); // Ensure this matches the backend's expected field name
  //   });

  //   try {
  //     const response = await fetch(process.env.BACKEND_URL + "/api/user-img", {
  //       method: "POST",
  //       headers: { Authorization: "Bearer " + localStorage.getItem("token") },
  //       body: formData,
  //     });

  //     if (!response.ok) {
  //       throw new Error(`HTTP error! Status: ${response.status}`);
  //     }

  //     const data = await response.json();
  //     console.log("Image upload success:", data);
  //     // Update the user data with the new image URLs if needed
  //     // setUser(data);
  //   } catch (error) {
  //     console.error("Error uploading image:", error);
  //   }
  // };

  // return (
  //   <div className="container">
  //     <div className="row">
  //       <div className="col-md-4 offset-md-4">
  //         <div className="text-center">
  //           <img
  //             src={store.userData && store.userData.profile_pic ? store.userData.profile_pic : "https://static-00.iconduck.com/assets.00/oncoming-fist-medium-dark-emoji-2048x1797-dmd9wvcy.png"}
  //             alt="Profile Picture"
  //             className="rounded-circle img-fluid"
  //             style={{ width: '300px', height: '300px' }}
  //           />
  //           <input
  //             type="file"
  //             id="profile-picture"
  //             className="form-control-file"
  //             onChange={handleImageUpload}
  //             multiple
  //           />
  //           {imageSizeError && <div className="error">File size must be less than 100KB</div>}
  //           <button
  //             className="btn btn-primary"
  //             onClick={handleNewImage}
  //           >
  //             Upload Photo
  //           </button>
  //         </div>
  //       </div>
  //     </div>
  //   </div>
  // );


  //----------------------------------------------------------------------
  const { store, actions } = useContext(Context);
  const [name, setName] = useState('rick');
  const [city, setCity] = useState('miami');
  const [email, setEmail] = useState('rick.sanchez@gmail.com');
  const [zipcode, setZipcode] = useState('123123');
  const [birthday, setBirthday] = useState(new Date());
  const [phone, setPhone] = useState('5555555555');
  const [picture, setPicture] = useState(null);
  const [imageSizeError, setImageSizeError] = useState(false);
  const [previewURL, setPreviewURL] = useState('');
  const [uploadedImages, setUploadedImages] = useState([])

  useEffect(() => {
    if (picture) {
      const temp = URL.createObjectURL(picture);
      setPreviewURL(temp);
    }
  }, [picture]);

  const handleImageUpload = (event) => {
    const files = event.target.files;
    let file_size = event.target.files[0].size;
    console.log(file_size)
    if (file_size <= 100000) {
      console.log(">>> files", files);
      setImageSizeError(false)
      const images = [];
      for (let index = 0; index < files.length; index++) {
        images.push(files.item(index));
      }
      setUploadedImages((prev) => ([
        ...prev,
        ...images
      ]));
    } else {
      setImageSizeError(true)
    }
  };

  const handleNewImg = async () => {
    const success = await actions.addUserImg(uploadedImages)
    if (success) {
      fetch(process.env.BACKEND_URL + "/api/current-user", {
        headers: { Authorization: "Bearer " + localStorage.getItem("Token") }
      })
        .then(resp => resp.json())
        .then(data => setUser(data))
        .catch(error => console.log(error))
    }
  };

  const handleSubmit = async () => {
    try {
      const updatedFields = {};

      // Add fields to updatedFields if they are not empty
      if (name) updatedFields.name = name;
      if (city) updatedFields.city = city;
      if (email) updatedFields.email = email;
      if (zipcode) updatedFields.zipcode = zipcode;
      if (phone) updatedFields.phone = phone;
      if (birthday) updatedFields.birthday = birthday;

      const formData = new FormData();
      formData.append('data', updatedFields);

      if (picture) {
        formData.append('file', picture);
      }

      const response = await fetch(`${process.env.BACKEND_URL}/api/user/edit`, {
        method: 'PUT',
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

      // window.location.reload();
    } catch (error) {
      console.error('Error during profile update:', error);
    }
  };

  return (
    <>
      <button type="button" class="btn" data-bs-toggle="modal" data-bs-target="#editProfileModal">
        <div className="profile-container">
          <div className="profile-header">

            <div className="profile-picture-section">
              <img
                src={previewURL}
                alt="Profile"
                className="profile-picture" />
              <div className="profile-name">{store.userData && store.userData.name}</div>
            </div>
          </div>
        </div>
      </button>



      <div className="modal fade" id="editProfileModal" tabIndex="-1" aria-labelledby="editProfileModalLabel" aria-hidden="true">
        {/* <div className="modal fade" id="editProfileModal" data-bs-backdrop="edit" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="editProfileModalLabel" aria-hidden="true"> */}
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
                      type="file"
                      id="profile-picture"
                      className="form-control-file"
                      onChange={handleImageUpload}
                    />
                    <button
                      className="btn btn-primary"
                      onClick={handleNewImg}
                    >
                      Upload Photo
                    </button>
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
              {/* {previewURL && <img src={previewURL} alt="Preview" className="img-thumbnail mb-2" />}
        {imageSizeError && <div className="text-danger">Image file is too large</div>} */}
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              <button type="button" className="btn btn-primary" onClick={handleSubmit} data-bs-dismiss="modal">Save</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
