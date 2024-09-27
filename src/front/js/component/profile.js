import React, { useState, useEffect, useContext } from "react";
import { Context } from "../store/appContext";
import "../../styles/profile.css";

export const Profile = () => {
  const { store, actions } = useContext(Context);
  
  // State declarations
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
  
  const [currentProfilePic, setCurrentProfilePic] = useState("");
  const [previewURL, setPreviewURL] = useState("");
  const [imageSizeError, setImageSizeError] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);
  
  const placeholderImage =
    "https://icons.iconarchive.com/icons/microsoft/fluentui-emoji-3d/512/Man-3d-Medium-Dark-icon.png";

  // Fetch user data on component mount
  useEffect(() => {
    actions.fetchCurrentUser();
  }, []);

  // Update state with fetched user data
  useEffect(() => {
    if (store.userData && store.userData.user) {
      setName(store.userData.user.name || "");
      setCity(store.userData.user.city || "");
      setEmail(store.userData.user.email || "");
      setZipcode(store.userData.user.zipcode || "");
      setBirthday(store.userData.user.birthday || "");
      setPhone(store.userData.user.phone || "");
      setInstagram_url(store.userData.user.instagram_url || "");
      setTiktok_url(store.userData.user.tiktok_url || "");
      setTwitch_url(store.userData.user.twitch_url || "");
      setKick_url(store.userData.user.kick_url || "");
      setYoutube_url(store.userData.user.youtube_url || "");
      setTwitter_url(store.userData.user.twitter_url || "");
      setFacebook_url(store.userData.user.facebook_url || "");
      setCurrentProfilePic(store.userData.user.profile_pic?.image_url || "");
    }
  }, [store.userData]);

  // Handle image file upload and preview
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.size <= 1000000) {
      setImageSizeError(false);
      setUploadedImage(file);
      setPreviewURL(URL.createObjectURL(file));
    } else {
      setImageSizeError(true);
    }
  };

  // Handle uploading new image
  const handleNewImage = async () => {
    if (uploadedImage) {
      const result = await actions.addUserImage([uploadedImage]);
      if (result.success) {
        alert("Profile picture has been updated");
        setCurrentProfilePic(result.imageUrl);
        setPreviewURL("");
        actions.fetchCurrentUser();
      } else {
        alert("Failed to update profile picture");
      }
    }
  };

  // Determine which image to display
  const getDisplayImage = () => {
    if (previewURL) {
      return previewURL;
    } else if (currentProfilePic) {
      return currentProfilePic;
    } else {
      return placeholderImage;
    }
  };

  // Handle user data update
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
      actions.fetchCurrentUser();
    } else {
      alert("Failed to update user data");
    }
  };

  return (
    <>
      {/* Profile Button */}
      <button
        type="button"
        className="btn"
        data-bs-toggle="modal"
        data-bs-target="#profileModal"
      >
        <div className="profile-picture-section">
          <img src={getDisplayImage()} alt="Profile" className="profile-picture" />
          <h3 className="userName">{store.userData?.user?.name}</h3>
        </div>
      </button>

      {/* Profile Modal */}
      <div
        className="modal fade"
        id="profileModal"
        aria-hidden="true"
        aria-labelledby="profileModalLabel"
        tabIndex="-1"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="profile-header">
              <h1 className="profile-title" id="profileModalLabel">PROFILE</h1>
              <img
                data-bs-dismiss="modal"
                src="https://icons.iconarchive.com/icons/microsoft/fluentui-emoji-flat/512/Cross-Mark-Flat-icon.png"
                alt="Close"
                className="profile-close"
              />
            </div>
            <div className="modal-body">
              <div className="profile-container">
                <button
                  type="button"
                  className="btn"
                  data-bs-dismiss="modal"
                  data-bs-toggle="modal"
                  data-bs-target="#editProfileModal"
                >
                  <div className="profile-picture-section">
                    <img src={getDisplayImage()} alt="Profile" className="profile-picture" />
                    <h3 className="userName">{store.userData?.user?.name}</h3>
                  </div>
                </button>

                {/* Profile stats */}
                <table className="stats-table">
                  <tbody>
                    <tr>
                      <td>Total</td>
                      <td className="total">
                        {store.userData?.user?.wins + store.userData?.user?.losses}
                      </td>
                    </tr>
                    <tr>
                      <td>Wins</td>
                      <td className="wins">{store.userData?.user?.wins}</td>
                    </tr>
                    <tr>
                      <td>Losses</td>
                      <td className="losses">{store.userData?.user?.losses}</td>
                    </tr>
                    <tr>
                      <td>Disqualifications</td>
                      <td className="disqualifications">
                        {store.userData?.user?.disqualifications}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
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
            <div className="profile-header">
              <h1 className="profile-title" id="profileModalLabel">EDIT PROFILE</h1>
              <img
                data-bs-dismiss="modal"
                src="https://icons.iconarchive.com/icons/microsoft/fluentui-emoji-flat/512/Cross-Mark-Flat-icon.png"
                alt="Close"
                className="profile-close"
              />
            </div>

            <div className="profile-container">
              {/* Profile picture and upload */}
              <div className="text-center m-6">
                <img
                  src={getDisplayImage()}
                  alt="Profile Picture"
                  className="rounded-circle img-fluid"
                  style={{ width: "68px", height: "68px" }}
                />
                <input
                  type="file"
                  id="profile-picture"
                  className="form-control-file"
                  onChange={handleImageUpload}
                />
                <button className="btn btn-secondary" onClick={handleNewImage}>
                  Upload Photo
                </button>
                {imageSizeError && (
                  <div className="text-danger">Image size exceeds the limit.</div>
                )}
              </div>

              {/* Input fields for user details */}
              <div className="space-y-2">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Name"
                  className="form-control"
                />
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="City"
                  className="form-control"
                />
                <input
                  type="text"
                  value={zipcode}
                  onChange={(e) => setZipcode(e.target.value)}
                  placeholder="Zipcode"
                  className="form-control"
                />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Phone number"
                  className="form-control"
                />

                {/* Social Media Input Fields */}
                <h3>Social Media</h3>
                <input
                  type="text"
                  value={instagram_url}
                  onChange={(e) => setInstagram_url(e.target.value)}
                  placeholder="Instagram URL"
                  className="form-control"
                />
                <input
                  type="text"
                  value={tiktok_url}
                  onChange={(e) => setTiktok_url(e.target.value)}
                  placeholder="TikTok URL"
                  className="form-control"
                />
                <input
                  type="text"
                  value={twitch_url}
                  onChange={(e) => setTwitch_url(e.target.value)}
                  placeholder="Twitch URL"
                  className="form-control"
                />
                <input
                  type="text"
                  value={kick_url}
                  onChange={(e) => setKick_url(e.target.value)}
                  placeholder="Kick URL"
                  className="form-control"
                />
                <input
                  type="text"
                  value={youtube_url}
                  onChange={(e) => setYoutube_url(e.target.value)}
                  placeholder="YouTube URL"
                  className="form-control"
                />
                <input
                  type="text"
                  value={twitter_url}
                  onChange={(e) => setTwitter_url(e.target.value)}
                  placeholder="Twitter URL"
                  className="form-control"
                />
                <input
                  type="text"
                  value={facebook_url}
                  onChange={(e) => setFacebook_url(e.target.value)}
                  placeholder="Facebook URL"
                  className="form-control"
                />

                {/* Save Profile Button */}
                <button
                  className="btn btn-primary"
                  data-bs-dismiss="modal"
                  onClick={handleEditSubmit}
                >
                  Save Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
