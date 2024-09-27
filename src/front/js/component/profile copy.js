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
  const [uploadedImage, setUploadedImage] = useState(null);

  const placeholderImage =
    "https://icons.iconarchive.com/icons/microsoft/fluentui-emoji-3d/512/Man-3d-Medium-Dark-icon.png";

  useEffect(() => {
    actions.fetchCurrentUser();
  }, []);

  useEffect(() => {
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
  }, [store.userData]);

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

  const handleNewImage = async () => {
    if (uploadedImage) {
      const result = await actions.addUserImage([uploadedImage]);
      if (result.success) {
        alert("Profile picture has been updated");
        setPreviewURL(result.imageUrl); // Update the preview URL with the new image URL
        actions.fetchCurrentUser(); // Optionally fetch the updated user data
      } else {
        alert("Failed to update profile picture");
      }
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
      actions.fetchCurrentUser();
    } else {
      alert("Failed to update user data");
    }
  };

  return (
    <>
      {/* Profile Button that opens the Profile Modal */}
      <button
        type="button"
        className="btn"
        data-bs-toggle="modal"
        data-bs-target="#profileModal"
      >
        <div className="profile-picture-section">
          <img src={previewURL} alt="Profile" className="profile-picture" />
          <h3 className="userName">
            {store.userData && store.userData.user?.name}
          </h3>
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
              <h1 className="profile-title" id="profileModalLabel">
                PROFILE
              </h1>
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
                    <img
                      src={previewURL}
                      alt="Profile"
                      className="profile-picture"
                    />
                    <h3 className="userName">
                      {store.userData && store.userData.user?.name}
                    </h3>
                  </div>
                </button>

                {/* Profile stats table */}
                <table className="stats-table">
                  <tbody>
                    <tr>
                      <td>Total</td>
                      <td className="total">
                        {store.userData &&
                          store.userData.user?.wins +
                            store.userData.user?.losses}
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
              <h1 className="profile-title" id="profileModalLabel">
                EDIT PROFILE
              </h1>
              <img
                data-bs-dismiss="modal"
                src="https://icons.iconarchive.com/icons/microsoft/fluentui-emoji-flat/512/Cross-Mark-Flat-icon.png"
                alt="Close"
                className="profile-close"
              />
            </div>

            <div className="profile-container">
              {/* Profile picture and upload logic */}
              <div className="text-center m-6">
                <img
                  src={previewURL}
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
                  <div className="text-danger">
                    Image size exceeds the limit.
                  </div>
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
                  placeholder="Instagram"
                  className="form-control"
                />
                <input
                  type="text"
                  value={tiktok_url}
                  onChange={(e) => setTiktok_url(e.target.value)}
                  placeholder="TikTok"
                  className="form-control"
                />
                <input
                  type="text"
                  value={twitch_url}
                  onChange={(e) => setTwitch_url(e.target.value)}
                  placeholder="Twitch"
                  className="form-control"
                />
                <input
                  type="text"
                  value={kick_url}
                  onChange={(e) => setKick_url(e.target.value)}
                  placeholder="Kick"
                  className="form-control"
                />
                <input
                  type="text"
                  value={youtube_url}
                  onChange={(e) => setYoutube_url(e.target.value)}
                  placeholder="Youtube"
                  className="form-control"
                />
                <input
                  type="text"
                  value={twitter_url}
                  onChange={(e) => setTwitter_url(e.target.value)}
                  placeholder="Twitter"
                  className="form-control"
                />
                <input
                  type="text"
                  value={facebook_url}
                  onChange={(e) => setFacebook_url(e.target.value)}
                  placeholder="Facebook"
                  className="form-control"
                />
              </div>
            </div>

            <div className="profile-footer">
              <button
              className="btn btn-secondary"
              data-bs-dismiss="modal">
                Close
              </button>
              <button
                className="btn btn-secondary"
                onClick={handleEditSubmit}
                data-bs-dismiss="modal"
              >
                Save
              </button>
              <button
                className="btn btn-secondary"
                data-bs-dismiss="modal"
                data-bs-toggle="modal"
                data-bs-target="#profileModal"
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
