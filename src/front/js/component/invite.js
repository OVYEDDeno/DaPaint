import React, { useState, useContext, useEffect } from "react";
import { Context } from "../store/appContext";

export const Invite = ({ onClose }) => {
  const [invites, setInvites] = useState(3);
  const [inviteCodeList, setInviteCodeList] = useState([]);
  const { store, actions } = useContext(Context);
  const [inviteCode, setInviteCode] = useState("");
  const [notifs, setNotifs] = useState({});

  useEffect(() => {
    const fetchNotifs = async () => {
      let data = await actions.getNotifs();
      if (data == false) {
        alert("Failed to fetch notifications.");
        return;
      } else {
        setNotifs(data);
      }
    };
    fetchNotifs();
  }, []);

  const generateCode = () => {
    let result = "";
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const charactersLength = characters.length;
    for (let i = 0; i < 5; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return setInviteCode(result);
  };
  const handleSendInvite = () => {
    if (invites > 0) {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please login to create an invite code.");
        return;
      }

      fetch(`${process.env.BACKEND_URL}/api/invite-code`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({}),
      })
        .then((response) => {
          if (!response.ok) {
            console.error("Error response:", response);
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          setInviteCode(data.code);
          setInviteCodeList([...inviteCodeList, data.code]);
          setInvites(invites - 1);
        })
        .catch((error) => {
          console.error("Error creating invite code:", error);
          if (error.message.includes("500")) {
            alert("Internal server error. Please try again later.");
          } else {
            alert("Error creating invite code. Please try again.");
          }
        });
    } else {
      alert("No invites left");
    }
  };
  const handleUseInviteCode = (code) => {
    fetch("${process.env.BACKEND_URL}/api/invite-code/use", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ code }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setInviteCodeList(inviteCodeList.filter((c) => c !== code));
      })
      .catch((error) => {
        console.error("Error using invite code:", error);
        alert("Error using invite code. Please try again.");
      });
  };

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
                WHO&apos;S A GREAT POTENTIAL ADDITION TO DIDDY?
              </p>
              <div className="bg-black text-white p-2 rounded-full flex justify-between items-center mb-4">
                <span>You have {invites} invites left</span>
                <h1>{inviteCode}</h1>
                <input
                  className="form-control"
                  type="text"
                  placeholder="enter your friend's email address here... e.g., eric@example.com</"
                  // Handle value and change if needed
                />
              </div>
              <button
                className="w-full bg-black text-white p-2 rounded-full flex items-center justify-center mb-4"
                onClick={handleSendInvite}
              >
                <span className="mr-2">+</span>
                <span>Send Invite</span>
              </button>
              <div className="mb-4">
                {inviteCode && (
                  <p className="text-center text-black mt-2">
                    Invite Code: {inviteCode}
                  </p>
                )}
              </div>
              <div>
                <h3 className="font-bold mb-2">Your Invite Codes</h3>
                <ul>
                  {inviteCodeList.map((code, index) => (
                    <li key={index}>
                      {code}{" "}
                      <button onClick={() => handleUseInviteCode(code)}>
                        Use Code
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            clock In
            <div>
              <h3>notifications</h3>
              {notifs?.foed?.map((item, index) => (
                <h4 key={index}>{item} Has accepted Your Match</h4>
              ))}
              {notifs?.hosted?.map((item, index) => (
                <h4 key={index}>{item} Has Clock In Your Match</h4>
              ))}
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
