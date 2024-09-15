import React, { useState, useContext, useEffect } from "react";
import { Context } from "../store/appContext";

export const Invite = ({ onClose }) => {
  const { store, actions } = useContext(Context);
  const [notifs, setNotifs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNotifs = async () => {
      setLoading(true);
      try {
        const result = await actions.getNotifs();
        if (result.success) {
          setNotifs(result.data);
        } else {
          setError(result.error || "Failed to fetch notifications.");
        }
      } catch (err) {
        setError("An unexpected error occurred.");
      } finally {
        setLoading(false);
      }
    };
    fetchNotifs();
  }, []);

  useEffect(() => {
    setNotifs(store.notifs);
  }, []);

  useEffect(() => {
    setInvite(store.invite);
  }, []);

  return (
    <>
      <button
        type="button"
        className="btn"
        data-bs-toggle="modal"
        data-bs-target="#invite"
      >
        <img
          src="https://icons.iconarchive.com/icons/microsoft/fluentui-emoji-3d/512/People-Hugging-3d-icon.png"
          alt="Invite"
          style={{ width: "68px", height: "68px" }}
        />
      </button>

      <div
        className="modal fade"
        id="invite"
        tabIndex="-1"
        aria-labelledby="invite"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="text-2xl font-bold flex justify-between items-center mb-4">
                INVITE
              </h2>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <p className="text-center mb-4">
                Invite the most people by the end of this winstreak and win
                500K!
              </p>
              <div>
                <h3 className="font-bold mb-2">Your Invite Codes</h3>
              </div>

              {/* Notifications Section */}
              <div>
                <h3>Notifications</h3>
                {loading ? (
                  <p>Loading notifications...</p>
                ) : error ? (
                  <p>Error: {error}</p>
                ) : notifs.length > 0 ? (
                  notifs.map((notif, index) => (
                    <div key={index}>
                      <h4>{notif.message}</h4>
                    </div>
                  ))
                ) : (
                  <p>No notifications</p>
                )}
              </div>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>
              <button type="button" className="btn btn-primary">
                Save changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
