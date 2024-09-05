// import React, { useState, useEffect, useContext } from "react";
// import { Context } from "../store/appContext";
// import "../../styles/profile.css"; // Assuming you will create this CSS file
// import { EditProfile } from "../component/editprofile.js";

// export const Profile = () => {
//   const { store, actions } = useContext(Context);

//   useEffect(() => {
//     actions.fetchCurrentUser();
//   }, []);

//   return (
//     <>
//       <button
//         type="button"
//         class="btn"
//         data-bs-toggle="modal"
//         data-bs-target="#profileModal"
//       >
//         <div className="profile-container">
//           <div className="profile-header">
//             <div className="profile-picture-section">
//               <img
//                 src={store.userData?.profile_pic?.image_url}
//                 alt="Profile"
//                 className="profile-picture"
//               />
//               <div className="profile-name">
//                 {store.userData && store.userData.user?.name}
//               </div>
//             </div>
//           </div>
//         </div>
//       </button>

//       <div
//         class="modal fade"
//         id="profileModal"
//         tabindex="-1"
//         aria-labelledby="profileModalLabel"
//         aria-hidden="true"
//       >
//         <div class="modal-dialog modal-dialog-centered">
//           <div class="modal-content">
//             <div className="modal-header d-flex justify-content-between align-items-center">
//               <h1
//                 className="modal-title text-2xl font-bold mx-auto"
//                 id="profileModalLabel"
//               >
//                 Profile
//               </h1>
//               <button
//                 type="button"
//                 className="btn-close ms-auto"
//                 data-bs-dismiss="modal"
//                 aria-label="Close"
//               ></button>
//             </div>
//             <div class="modal-body">
//               <EditProfile />

//               <table className="stats-table">
//                 <tbody>
//                   <tr>
//                     <td>Total</td>
//                     <td className="total">
//                       {store.userData &&
//                         store.userData.wins + store.userData.losses}
//                     </td>
//                   </tr>
//                   <tr>
//                     <td>Wins</td>
//                     <td className="wins">
//                       {store.userData && store.userData.wins}
//                     </td>
//                   </tr>
//                   <tr>
//                     <td>By knockout</td>
//                     <td>{store.userData && store.userData.winsByKO}</td>
//                   </tr>
//                   <tr>
//                     <td>By submission</td>
//                     <td>{store.userData && store.userData.winsBySub}</td>
//                   </tr>
//                   <tr>
//                     <td>Losses</td>
//                     <td className="losses">
//                       {store.userData && store.userData.losses}
//                     </td>
//                   </tr>
//                   <tr>
//                     <td>By knockout</td>
//                     <td>{store.userData && store.userData.lossesByKO}</td>
//                   </tr>
//                   <tr>
//                     <td>By submission</td>
//                     <td>{store.userData && store.userData.lossesBySub}</td>
//                   </tr>
//                   <tr>
//                     <td>Disqualifications</td>
//                     <td className="disqualifications">
//                       {store.userData && store.userData.disqualifications}
//                     </td>
//                   </tr>
//                 </tbody>
//               </table>
//             </div>
//             <div class="modal-footer">
//               <button
//                 type="button"
//                 class="btn btn-secondary"
//                 data-bs-dismiss="modal"
//               >
//                 Close
//               </button>
//               <button type="button" class="btn btn-primary">
//                 Save changes
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };
