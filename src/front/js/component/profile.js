import React, { useState, useEffect, useContext } from "react";
import { Context } from "../store/appContext";
import "../../styles/profile.css";

export const Profile = () => {
  const { store, actions } = useContext(Context);
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [email, setEmail] = useState("");
  const [zipcode, setZipcode] = useState("");
  const [birthday, setBirthday] = useState("");
  const [phone, setPhone] = useState("");
  const [instagram_url, setInstagram_url] = useState("");
  const [tiktok_url, setTiktok_url] = useState("");
  const [twitch_url, setTwitch_url] = useState("");
  const [kick_url, setKick_url] = useState("");
  const [youtube_url, setYoutube_url] = useState("");
  const [twitter_url, setTwitter_url] = useState("");
  const [facebook_url, setFacebook_url] = useState("");
  const [previewURL, setPreviewURL] = useState("");
  const [imageSizeError, setImageSizeError] = useState(false);
  const [uploadedImages, setUploadedImages] = useState([]);

  const placeholderImage =
    "https://icons.iconarchive.com/icons/microsoft/fluentui-emoji-3d/512/Man-3d-Medium-Dark-icon.png";
  const profileImageUrl =
    store.userData?.profile_pic?.image_url || placeholderImage;

  useEffect(() => {
    actions.fetchCurrentUser();
    if (store.userData) {
      setName(store.userData.name || "");
      setCity(store.userData.city || "");
      setEmail(store.userData.email || "");
      setZipcode(store.userData.zipcode || "");
      setBirthday(store.userData.birthday || "");
      setPhone(store.userData.phone || "");
      setInstagram_url(store.userData.instagram_url || "");
      setTiktok_url(store.userData.tiktok_url || "");
      setTwitch_url(store.userData.twitch_url || "");
      setKick_url(store.userData.kick_url || "");
      setYoutube_url(store.userData.youtube_url || "");
      setTwitter_url(store.userData.twitter_url || "");
      setFacebook_url(store.userData.facebook_url || "");
      setPreviewURL(store.userData?.profile_pic?.image_url || placeholderImage);
    }
  }, []);
  // console.log("Profile User Info", fetchCurrentUser)

  const handleImageUpload = (event) => {
    const files = event.target.files;
    let file_size = files[0].size;
    if (file_size <= 1000000) {
      setImageSizeError(false);
      setUploadedImages(files);
    } else {
      setImageSizeError(true);
    }
  };

  const handleNewImage = async () => {
    const success = await actions.addUserImage(uploadedImages);
    if (success) {
      alert("Profile picture has been updated");
      actions.fetchCurrentUser(); // Refresh user data after update
    } else {
      alert("Failed to update profile picture");
    }
  };

  const handleEditSubmit = async () => {
    const updatedUser = {
      name,
      city,
      email,
      zipcode,
      birthday,
      phone,
      instagram_url,
      tiktok_url,
      twitch_url,
      kick_url,
      youtube_url,
      twitter_url,
      facebook_url,
    };
    let result = await actions.editUserbyUser(updatedUser);
    if (result) {
      window.location.reload();
      actions.fetchCurrentUser(); // Refresh user data after update
    } else {
      alert("Failed to update user data");
    }
  };

  return (
    <>    
      <button
        type="button"
        className="btn"
        data-bs-toggle="modal"
        data-bs-target="#profileModal"
      >
        <div className="profile-header">
          <div className="profile-picture-section">
            <img src={previewURL} alt="Profile" className="profile-picture" />
            <div className="profile-name">
              <h3>{store.userData && store.userData.user?.name}</h3>
            </div>
          </div>
        </div>
      </button>

      {/* Profile Modal */}
      <div className="modal fade" /*this is super important*/ id="profileModal">
        <div className="modal-dialog modal-dialog-centered">
          <div className="profile-content">
            <div className="profile-header">
              <h1 className="profile-title">PROFILE</h1>
              <img
                data-bs-dismiss="modal"
                src="https://icons.iconarchive.com/icons/microsoft/fluentui-emoji-flat/512/Cross-Mark-Flat-icon.png"
                alt="Close"
                className="close-icon"
              />
            </div>
            <div className="profile-container">
                <div className="profile-picture-section">
                  <div
                    data-bs-target="#editProfileModal"
                    data-bs-toggle="modal"
                  >
                    <img
                      src={profileImageUrl}
                      alt="Profile"
                      className="profile-picture"
                    />
                    <div className="profile-name">
                      {store.userData && store.userData.user?.name}
                    </div>
                  </div>
                </div>
              <table className="stats-table">
                <tbody>
                  <tr>
                    <td>Total</td>
                    <td className="total">
                      {store.userData &&
                        store.userData.user?.wins + store.userData.user?.losses}
                    </td>
                  </tr>
                  <tr>
                    <td>Wins</td>
                    <td className="wins">
                      {store.userData && store.userData.user?.wins}
                    </td>
                  </tr>
                  <tr>
                    <td>Losses</td>
                    <td className="losses">
                      {store.userData && store.userData.user?.losses}
                    </td>
                  </tr>
                  <tr>
                    <td>Disqualifications</td>
                    <td className="disqualifications">
                      {store.userData && store.userData.user?.disqualifications}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      <div
        className="modal fade"
        id="editProfileModal"
        aria-hidden="true"
        aria-labelledby="editProfileModalLabel"
        tabIndex="-1"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="editProfileModalLabel">
                Edit Profile
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <div className="flex items-center mb-6">
                <div className="text-center">
                  <img
                    src={profileImageUrl}
                    alt="Profile Picture"
                    className="rounded-circle img-fluid"
                    style={{ width: "30px", height: "30px" }}
                  />
                  <input
                    type="file"
                    id="profile-picture"
                    className="form-control-file"
                    onChange={handleImageUpload}
                  />
                  <button className="btn btn-primary" onClick={handleNewImage}>
                    Upload Photo
                  </button>
                  {imageSizeError && (
                    <div className="text-danger">
                      Image size exceeds the limit.
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2 flex-1">
                <div className="bg-white p-2 rounded-full">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Name"
                    className="bg-white w-full outline-none"
                  />
                </div>
                <div className="bg-white p-2 rounded-full">
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="City"
                    className="bg-white w-full outline-none"
                  />
                </div>
                <div className="bg-white p-2 rounded-full">
                  <input
                    type="text"
                    value={zipcode}
                    onChange={(e) => setZipcode(e.target.value)}
                    placeholder="Zipcode"
                    className="bg-white w-full outline-none"
                  />
                </div>
                <div className="bg-white p-2 rounded-full">
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Phone number"
                    className="bg-white w-full outline-none"
                  />
                </div>
                <h3>Social Media</h3>
                <div>
                  <input
                    type="Instagram"
                    value={instagram_url}
                    placeholder="Instagram"
                    onChange={(e) => setInstagram_url(e.target.value)}
                    // className="bg-white w-full outline-none"
                  />
                </div>
                <div>
                  <input
                    type="Tiktok"
                    value={tiktok_url}
                    placeholder="TikTok"
                    onChange={(e) => setTiktok_url(e.target.value)}
                    // className="bg-white w-full outline-none"
                  />
                </div>
                <div>
                  <input
                    type="Twitch"
                    value={twitch_url}
                    placeholder="Twitch"
                    onChange={(e) => setTwitch_url(e.target.value)}
                    // className="bg-white w-full outline-none"
                  />
                </div>
                <div>
                  <input
                    type="Kick"
                    value={kick_url}
                    placeholder="Kick"
                    onChange={(e) => setKick_url(e.target.value)}
                    // className="bg-white w-full outline-none"
                  />
                </div>
                <div>
                  <input
                    type="Youtube"
                    value={youtube_url}
                    placeholder="Youtube"
                    onChange={(e) => setYoutube_url(e.target.value)}
                    // className="bg-white w-full outline-none"
                  />
                </div>
                <div>
                  <input
                    type="Twitter"
                    value={twitter_url}
                    placeholder="Twitter"
                    onChange={(e) => setTwitter_url(e.target.value)}
                    // className="bg-white w-full outline-none"
                  />
                </div>
                <div>
                  <input
                    type="Facebook"
                    value={facebook_url}
                    placeholder="Facebook"
                    onChange={(e) => setPhone(e.target.value)}
                    // className="bg-white w-full outline-none"
                  />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" data-bs-dismiss="modal">
                Close
              </button>
              <button
                className="btn btn-primary"
                onClick={handleEditSubmit}
                data-bs-dismiss="modal"
              >
                Save
              </button>
              <button
                className="btn btn-primary"
                data-bs-target="#profileModal"
                data-bs-toggle="modal"
              >
                Back to Profile
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
