import React, { useState, useContext, useEffect } from "react";
import { Context } from "../store/appContext";

export const Invite = ({ onClose }) => {
  const { store, actions } = useContext(Context);
  const [notifs, setNotifs] = useState([]);
  const [inviteCodes, setInviteCodes] = useState([]);
  const [loadingNotifs, setLoadingNotifs] = useState(true);
  const [loadingCodes, setLoadingCodes] = useState(true);
  const [errorNotifs, setErrorNotifs] = useState(null);
  const [errorCodes, setErrorCodes] = useState(null);

  // Fetch notifications
  useEffect(() => {
    const fetchNotifs = async () => {
      setLoadingNotifs(true);
      try {
        const result = await actions.getNotifs();
        if (result.success) {
          setNotifs(result.data);
        } else {
          setErrorNotifs(result.error || "Failed to fetch notifications.");
        }
      } catch (err) {
        setErrorNotifs("An unexpected error occurred.");
      } finally {
        setLoadingNotifs(false);
      }
    };
    fetchNotifs();
  }, []);

  // Fetch invite codes
  useEffect(() => {
    const fetchInviteCodes = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("User is not logged in.");
        return { success: false, error: "Not logged in" };
      }

      setLoadingCodes(true);
      try {
        const response = await fetch(
          `${process.env.BACKEND_URL}/api/invitecodes`, // Adjust the endpoint as needed
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        let inviteCodes;

        if (Array.isArray(data)) {
          inviteCodes = data;
        } else if (data.inviteCodes && Array.isArray(data.inviteCodes)) {
          inviteCodes = data.inviteCodes;
        } else {
          throw new Error("Unexpected data format");
        }

        setInviteCodes(inviteCodes);
      } catch (error) {
        console.error("Error fetching invite codes:", error);
        setErrorCodes(error.message);
      } finally {
        setLoadingCodes(false);
      }
    };
    fetchInviteCodes();
  }, []);

  return (
    <>
      <button
        className="invitebtn"
        data-bs-target="#invite"
        data-bs-toggle="modal"
      >
        <img
          src="https://icons.iconarchive.com/icons/microsoft/fluentui-emoji-3d/512/People-Hugging-3d-icon.png"
          alt="Invite"
          style={{ width: "51px", height: "51px" }}
        />
      </button>

      <div
        className="invite fade"
        id="invite"
        tabIndex="-1"
        aria-labelledby="invite"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="invite-content">
            {/* <div className="invite-header">
              <h2 className="text-2xl font-bold flex justify-between items-center mb-4">
                INVITE
              </h2>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div> */}
            <div className="invite-header" style={{ position: "justify" }}>
              <img
                data-bs-dismiss="invitemodal"
                src="https://icons.iconarchive.com/icons/microsoft/fluentui-emoji-3d/512/Cross-Mark-3d-icon.png"
                alt="Close"
                style={{
                  position: "absolute",
                  top: "10px",
                  right: "10px",
                  width: "20px",
                  height: "20px",
                  cursor: "pointer",
                }}
              />
              <h1
                className="text-3x5 text-black"
                style={{
                  margin: "0 auto",
                  textAlign: "center",
                  fontStyle: "normal",
                  // position: "absolute",
                  // width: "0%",
                }}
              >
                INVITE
              </h1>
            </div>
            <div className="modal-body">
              <h3 className="text-center mb-4">
                Invite the most people by the end of this winstreak and win
                500K!
              </h3>

              <div>
                <h3 className="font-bold mb-2">Your Invite Codes</h3>
                {loadingCodes ? (
                  <p>Loading invite codes...</p>
                ) : errorCodes ? (
                  <p>Error: {errorCodes}</p>
                ) : inviteCodes.length > 0 ? (
                  inviteCodes.map((code, index) => (
                    <div key={index}>
                      <h4>{code.code}</h4>
                    </div>
                  ))
                ) : (
                  <p>No invite codes</p>
                )}
              </div>

              {/* Notifications Section */}
              <div>
                <h3>Notifications</h3>
                {loadingNotifs ? (
                  <p>Loading notifications...</p>
                ) : errorNotifs ? (
                  <p>Error: {errorNotifs}</p>
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

            {/* <div className="modal-footer">
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
            </div> */}
          </div>
        </div>
      </div>
    </>
  );
};
