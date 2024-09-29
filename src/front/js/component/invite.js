import React, { useState, useContext, useEffect } from "react";
import { Context } from "../store/appContext";
import "../../styles/invite.css";

export const Invite = ({ onClose }) => {
  const { store, actions } = useContext(Context);
  const [notifs, setNotifs] = useState([]);
  const [maxInviteeCount, setMaxInviteeCount] = useState(null);
  const [maxInviteeUser, setMaxInviteeUser] = useState(null);
  const [inviteCodes, setInviteCodes] = useState([]);
  const [loadingNotifs, setLoadingNotifs] = useState(true);
  const [loadingCodes, setLoadingCodes] = useState(true);
  const [errorNotifs, setErrorNotifs] = useState(null);
  const [errorCodes, setErrorCodes] = useState(null);

  // Fetch invitee
  useEffect(() => {
    actions.fetchMaxInvitee(
      setMaxInviteeCount, // State setter for invitee count
      setMaxInviteeUser // State setter for inviter's name with max invitees
    );
  }, []);

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
          `${process.env.BACKEND_URL}/api/invitecodes`,
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
      <div style={{ position: "relative" }}>
        <button
          className="btn"
          data-bs-target="#inviteModal"
          data-bs-toggle="modal"
        >
          <img
            className="invite-picture"
            src="https://icons.iconarchive.com/icons/microsoft/fluentui-emoji-3d/512/People-Hugging-3d-icon.png"
            alt="Invite"
          />
        </button>

        {/* Notification circle - Always visible */}
        <div className="notification-circle">{notifs.length || 0}</div>
      </div>

      <div
        class="modal fade"
        id="inviteModal"
        aria-hidden="true"
        aria-labelledby="inviteModal"
        tabindex="-1"
        data-bs-backdrop="static"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="invite-header">
              <h1 className="invite-title">
                INVITE
                <img
                  data-bs-dismiss="modal"
                  src="https://icons.iconarchive.com/icons/microsoft/fluentui-emoji-flat/512/Cross-Mark-Flat-icon.png"
                  alt="Close"
                  className="invite-close"
                />
              </h1>
            </div>
            <div className="invite-container text-center">
              <div>
                <p className=" m-3">
                  Invite the most people by the end of this winstreak and win
                  500K!
                </p>
                <p>
                  {maxInviteeUser} has invited {maxInviteeCount} Indulgers
                </p>
                <p>
                  You have invited{" "}
                  {store.userData?.user?.invite_code?.completed_dapaints.length}{" "}
                  Indulgers
                </p>
                <h5 className="font-bold mb-2">Your Invite Code</h5>

                {loadingCodes ? (
                  <p>Loading invite codes...</p>
                ) : errorCodes ? (
                  <p>Error: {errorCodes}</p>
                ) : inviteCodes.length > 0 ? (
                  inviteCodes.map((code, index) => (
                    <p key={index}>{code.code}</p>
                  ))
                ) : (
                  <p>No invite codes</p>
                )}
                <p>^copy your code to easily send^</p>
              </div>

              <div>
                <h3>Notifications</h3>
                {loadingNotifs ? (
                  <p>Loading notifications...</p>
                ) : errorNotifs ? (
                  <p>Error: {errorNotifs}</p>
                ) : notifs.length > 0 ? (
                  notifs.map((notif, index) => (
                    <p key={index}>{notif.message}</p>
                  ))
                ) : (
                  <p>No notifications</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
