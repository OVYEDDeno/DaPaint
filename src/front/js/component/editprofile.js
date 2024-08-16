import React, { useState, useContext, useEffect } from "react";
import { Context } from "../store/appContext";
import "../../styles/profile.css"; // Assuming you will create this CSS file


export const EditProfile = () => {
  const { store, actions } = useContext(Context);
  const token = localStorage.getItem('token');
  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [email, setEmail] = useState('');
  const [zipcode, setZipcode] = useState('');
  const [birthday, setBirthday] = useState("");
  const [phone, setPhone] = useState('');
 
  const [previewURL, setPreviewURL] = useState('');

  const [user, setUser] = useState({
    email: "",
    is_active: true,
    namecity: "",
    zipcode: "",
    Phone: "",
    birthday: "",
  })

  useEffect(() => {
    actions.fetchCurrentUser();
  }, []);

  useEffect(() => {
    if (store.userData) {
      setName(store.userData.name || '');
      setCity(store.userData.city || '');
      setEmail(store.userData.email || '');
      setZipcode(store.userData.zipcode || '');
      setBirthday(store.userData.birthday || '');
      setPhone(store.userData.phone || '');
      setPreviewURL(store.userData.profile_pic ? store.userData.profile_pic.url : '');
    }
  }, [store.userData]);

  const handleEditSubmit = async () => {
    const updatedUser = {
      name,
      city,
      email,
      zipcode,
      birthday,
      phone
    };
    let result = await actions.editUserbyUser(updatedUser);
    if (result) {
      alert("User Data has been updated");
      actions.fetchCurrentUser(); // Refresh user data after update
    } else {
      alert("Failed to update user data");
    }
  };

  ///////////////////////////////////////////////////////////////////////////////////////////////////////

  const [imageSizeError, setImageSizeError] = useState(false);
  const [uploadedImages, setUploadedImages] = useState([]);

  const placeholderImage = 'https://static-00.iconduck.com/assets.00/oncoming-fist-medium-dark-emoji-2048x1797-dmd9wvcy.png'; // Path to your placeholder image
	
	const profileImageUrl = store.userData.profile_pic?.image_url || placeholderImage;

  const handleImageUpload = (event) => {
    const files = event.target.files;
    let file_size = event.target.files[0].size;
    console.log(file_size)
    if (file_size <= 100000) {
      console.log(">>> files", files);
      setImageSizeError(false)
     
      setUploadedImages(files);
    } else {
      setImageSizeError(true)
    }
  };


  const handleNewImage = async () => {
    const success = await actions.addUserImage(uploadedImages);
    // if(success){
    //   fetch(process.env.BACKEND_URL + "/api/user-img", {
    //     headers: { Authorization: "Bearer " + localStorage.getItem("token") }
    //   })
    //     .then(resp => resp.json())
    //     .then(data => setUser(data))
    //     .catch(error => console.log(error))
    // }
    if (success) {alert("Profile picture has been updated")};
  }

  return (
    <>
      <button type="button" class="btn" data-bs-toggle="modal" data-bs-target="#editProfileModal">
        <div className="profile-container">
          <div className="profile-header">

            <div className="profile-picture-section">
              <img
                src={setPreviewURL}
                alt="Profile"
                className="profile-picture" />
              <div className="profile-name">{store.userData && store.userData.name}</div>
            </div>
          </div>
        </div>
      </button>



      <div className="modal fade" id="editProfileModal" tabIndex="-1" aria-labelledby="editProfileModalLabel" aria-hidden="true">
        {/* <div className="modal fade" id="editProfileModal" data-bs-backdrop="edit" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="editProfileModalLabel" aria-hidden="true"> */}
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-body">
              <div className="fixed inset-0 bg-white text-black flex flex-col">
                <div className="flex justify-between items-center p-4">
                  <h1 className="text-2xl font-bold">
                    EDIT
                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                  </h1>
                </div>

                <div className="flex-1 p-4 bg-white text-black rounded-t-3xl mt-4">
                  <div className="flex items-center mb-6">
                    {/* <input
                      type="file"
                      id="profile-picture"
                      className="form-control-file"
                      onChange={handleImageUpload}
                    /> */}
                    {/* <button
                      className="btn btn-primary"
                      onClick={handleNewImage}
                    >
                      Upload Photo
                    </button> */}
                    <div className="text-center">
                            <img
                                src={profileImageUrl}
                                alt="Profile Picture"
                                className="rounded-circle img-fluid"
                                style={{ width: '300px', height: '300px' }}
                            />
                            <input
                                type="file"
                                id="profile-picture"
                                className="form-control-file"
                                onChange={handleImageUpload}
                            />
                            <button
                                className="btn btn-primary"
                                onClick={handleNewImage}
                            >
                                Upload Photo
                            </button>
                        </div>





                    <div className="space-y-2 flex-1">
                      <div className="bg-whit text-black p-2 rounded-full">
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Name"
                          className="bg-white w-full outline-none"
                        />
                      </div>
                      <div className="bg-white text-black p-2 rounded-full">
                        <input
                          type="text"
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          placeholder="City"
                          className="bg-white w-full outline-none"
                        />
                      </div>
                      <div className="bg-white text-black p-2 rounded-full">
                        <input
                          type="text"
                          value={zipcode}
                          onChange={(e) => setZipcode(e.target.value)}
                          placeholder="Zipcode"
                          className="bg-white w-full outline-none"
                        />
                      </div>
                      <div className="bg-whit text-black p-2 rounded-full">
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="Phone number"
                          className="bg-white w-full outline-none"
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
              <button type="button" className="btn btn-primary" onClick={handleEditSubmit} data-bs-dismiss="modal">Save</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
