// import React, { useState, useContext, useEffect } from "react";
// import { Context } from "../store/appContext";
// import "../../styles/profile.css"; // Assuming you will create this CSS file

// export const EditProfile = () => {
//   const { store, actions } = useContext(Context);
//   const token = localStorage.getItem('token');
//   const [name, setName] = useState('');
//   const [city, setCity] = useState('');
//   const [email, setEmail] = useState('');
//   const [zipcode, setZipcode] = useState('');
//   const [birthday, setBirthday] = useState("");
//   const [phone, setPhone] = useState('');
//   const [previewURL, setPreviewURL] = useState('');
//   const [imageSizeError, setImageSizeError] = useState(false);
//   const [uploadedImages, setUploadedImages] = useState([]);

//   const placeholderImage = 'https://icons.iconarchive.com/icons/microsoft/fluentui-emoji-3d/512/Man-3d-Medium-Dark-icon.png';
//   const profileImageUrl = store.userData?.profile_pic?.image_url || placeholderImage;

//   useEffect(() => {
//     actions.fetchCurrentUser();
//   }, []);

//   useEffect(() => {
//     if (store.userData) {
//       setName(store.userData?.user?.name || '');
//       setCity(store.userData?.user?.city || '');
//       setEmail(store.userData?.user?.email || '');
//       setZipcode(store.userData?.user?.zipcode || '');
//       setBirthday(store.userData?.user?.birthday || '');
//       setPhone(store.userData?.user?.phone || '');
//       setPreviewURL(store.userData.user?.profile_pic?.image_url || placeholderImage);
//     }
//   }, []);
// console.log("USER DATA EditProfile", store.userData)
//   const handleImageUpload = (event) => {
//     const files = event.target.files;
//     let file_size = files[0].size;
//     if (file_size <= 1000000) {
//       setImageSizeError(false);
//       setUploadedImages(files);
//     } else {
//       setImageSizeError(true);
//     }
//   };

//   const handleNewImage = async () => {
//     const success = await actions.addUserImage(uploadedImages);
//     if (success) {
//       alert("Profile picture has been updated");
//       actions.fetchCurrentUser(); // Refresh user data after update
//     } else {
//       alert("Failed to update profile picture");
//     }
//   };

//   const handleEditSubmit = async () => {
//     const updatedUser = {
//       name,
//       city,
//       email,
//       zipcode,
//       birthday,
//       phone
//     };
//     let result = await actions.editUserbyUser(updatedUser);
//     if (result) {
//       alert("User Data has been updated");
//       actions.fetchCurrentUser(); // Refresh user data after update
//     } else {
//       alert("Failed to update user data");
//     }
//   };

//   useEffect(() => {},[])
//   return (
//     <>
//       <button type="button" className="btn" data-bs-toggle="modal" data-bs-target="#editProfileModal">
//         <div className="profile-container">
//           <div className="profile-header">
//             <div className="profile-picture-section">
//               <img src={previewURL} alt="Profile" className="profile-picture" />
//               <div className="profile-name"><h3>{store.userData && store.userData.user?.name}</h3></div>
//             </div>
//           </div>
//         </div>
//       </button>

//       <div className="modal fade" id="editProfileModal" tabIndex="-1" aria-labelledby="editProfileModalLabel" aria-hidden="true">
//         <div className="modal-dialog modal-dialog-centered">
//           <div className="modal-content">
//             <div className="modal-body">
//             <div className="wlsub-container">
//                 <div className="flex justify-between items-center p-4">
//                   <h1 className="text-2xl font-bold">
//                     EDIT
//                     <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
//                   </h1>
//                 </div>

//                 <div className="flex-1 p-4 bg-white text-black rounded-t-3xl mt-4">
//                   <div className="flex items-center mb-6">
//                     <div className="text-center">
//                       <img
//                         src={profileImageUrl}
//                         alt="Profile Picture"
//                         className="rounded-circle img-fluid"
//                         style={{ width: '30px', height: '30px' }}
//                       />
//                       <input
//                         type="file"
//                         id="profile-picture"
//                         className="form-control-file"
//                         onChange={handleImageUpload}
//                       />
//                       <button
//                         className="btn btn-primary"
//                         onClick={handleNewImage}
//                       >
//                         Upload Photo
//                       </button>
//                     </div>

//                     <div className="space-y-2 flex-1">
//                       <div className="bg-whit text-black p-2 rounded-full">
//                         <input
//                           type="text"
//                           value={name}
//                           onChange={(e) => setName(e.target.value)}
//                           placeholder="Name"
//                           className="bg-white w-full outline-none"
//                         />
//                       </div>
//                       <div className="bg-white text-black p-2 rounded-full">
//                         <input
//                           type="text"
//                           value={city}
//                           onChange={(e) => setCity(e.target.value)}
//                           placeholder="City"
//                           className="bg-white w-full outline-none"
//                         />
//                       </div>
//                       <div className="bg-white text-black p-2 rounded-full">
//                         <input
//                           type="text"
//                           value={zipcode}
//                           onChange={(e) => setZipcode(e.target.value)}
//                           placeholder="Zipcode"
//                           className="bg-white w-full outline-none"
//                         />
//                       </div>
//                       <div className="bg-whit text-black p-2 rounded-full">
//                         <input
//                           type="tel"
//                           value={phone}
//                           onChange={(e) => setPhone(e.target.value)}
//                           placeholder="Phone number"
//                           className="bg-white w-full outline-none"
//                         />
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//             <div className="modal-footer">
//               <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
//               <button type="button" className="btn btn-primary" onClick={handleEditSubmit} data-bs-dismiss="modal">Save</button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }
