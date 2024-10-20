import React, { useState, useContext, useEffect } from "react";
import "../../styles/start.css";
import { Context } from "../store/appContext";
import { QrReader } from "react-qr-reader";

export const Start = () => {
  const [hostUser, setHostUser] = useState(null);
  const [foeUser, setFoeUser] = useState(null);
  const [hostVote, setHostVote] = useState(null);
  const [foeVote, setFoeVote] = useState(null);
  const { store, actions } = useContext(Context);
  const [previewURL, setPreviewURL] = useState("");
  const [qrCodeInput, setQrCodeInput] = useState("");
  const [isTorchOn, setIsTorchOn] = useState(false);
  const [success, setSuccess] = useState(null);
  const [torchSupported, setTorchSupported] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isScannerActive, setIsScannerActive] = useState(false);
  const placeholderImage =
    "https://icons.iconarchive.com/icons/microsoft/fluentui-emoji-3d/512/Man-3d-Medium-Dark-icon.png";

  const handleManualSubmit = async (e) => {
    e.preventDefault();
    try {
      setErrorMessage(null);
      let success = await actions.redeemTicket(qrCodeInput);
      if (success) {
        setSuccess(true);
        setQrCodeInput("");
      } else {
        setSuccess(false);
        setErrorMessage("The ticket has already been redeemed or is invalid.");
      }
      setTimeout(() => {
        setSuccess(null);
        setErrorMessage(null);
      }, 2000);
    } catch (error) {
      console.error("An error occurred during manual submission:", error);
      setSuccess(false);
      setErrorMessage("An unexpected error occurred. Please try again.");
      setTimeout(() => {
        setSuccess(null);
        setErrorMessage(null);
      }, 2000);
    }
  };

  const handleScan = async (result) => {
    if (result && result.text) {
      try {
        setErrorMessage(null);
        let success = await actions.scanTicket(result.text);
        if (success) {
          setSuccess(true);
        } else {
          setSuccess(false);
          setErrorMessage(
            "The ticket has already been redeemed or is invalid."
          );
        }
        setTimeout(() => {
          setSuccess(null);
          setErrorMessage(null);
        }, 2000);
      } catch (error) {
        console.error("An error occurred during scanning:", error);
        setSuccess(false);
        setErrorMessage("An unexpected error occurred. Please try again.");
        setTimeout(() => {
          setSuccess(null);
          setErrorMessage(null);
        }, 2000);
      }
    }
  };

  const toggleTorch = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment", advanced: [{ torch: !isTorchOn }] },
      });
      const track = stream.getVideoTracks()[0];
      await track.applyConstraints({ advanced: [{ torch: !isTorchOn }] });
      setIsTorchOn(!isTorchOn);
    } catch (error) {
      console.error("Error toggling torch:", error);
      setErrorMessage(
        "Failed to toggle torch. It may not be supported on this device."
      );
    }
  };

  useEffect(() => {
    const checkTorchSupport = async () => {
      try {
        const supported =
          "torch" in navigator.mediaDevices.getSupportedConstraints();
        setTorchSupported(supported);
        if (supported) {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: "environment", advanced: [{ torch: true }] },
          });
          stream.getTracks().forEach((track) => track.stop());
        }
      } catch (error) {
        console.error("Error checking torch support:", error);
        setTorchSupported(false);
      }
    };
    checkTorchSupport();
  }, []);

  const handleFileUpload = (e, setUser) => {
    setUser(URL.createObjectURL(e.target.files[0]));
  };

  const handleHostVote = (vote) => {
    setHostVote(vote);
    setFoeVote(vote === "winner" ? "loser" : foeVote);
  };

  const handleFoeVote = (vote) => {
    setFoeVote(vote);
    setHostVote(vote === "winner" ? "loser" : hostVote);
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   if (!store.userData.dapaintId.id) {
  //     alert("No valid event found for this user");
  //     return;
  //   }
  //   let winner_id = null;
  //   let loser_id = null;
  //   let img_url = e.target.img.value;
  //   if (hostVote === "winner") {
  //     winner_id = store.userData.indulgers.host.id;
  //     loser_id = store.userData.indulgers.foe.id;
  //   }
  //   if (foeVote === "winner") {
  //     winner_id = store.userData.indulgers.foe.id;
  //     loser_id = store.userData.indulgers.host.id;
  //   }
  //   let result = await actions.updateWinstreak(
  //     store.userData.dapaintId.id,
  //     winner_id,
  //     loser_id,
  //     img_url
  //   );
  //   if (result) {
  //     alert("Winstreak has been updated");
  //     actions.fetchCurrentUser();
  //     window.location.reload();
  //   } else {
  //     alert("Failed to update win streak");
  //   }
  // };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!store.userData.dapaintId.id) {
      alert("No valid event found for this user");
      return;
    }
    let winner_id = null;
    let loser_id = null;
    let img_url = e.target.img.value;
    if (hostVote === "winner") {
      winner_id = store.userData.indulgers.host.id;
      loser_id = store.userData.indulgers.foe.id;
    }
    if (foeVote === "winner") {
      winner_id = store.userData.indulgers.foe.id;
      loser_id = store.userData.indulgers.host.id;
    }
    let result = await actions.updateWinstreak(
      store.userData.dapaintId.id,
      winner_id,
      loser_id,
      img_url,
      false  // Set dapaint_unlocked to false
    );
    if (result) {
      alert("Winstreak has been updated");
      actions.fetchCurrentUser();
      window.location.reload();
    } else {
      alert("Failed to update win streak");
    }
  };

  const getDisplayImageFoe = () => {
    const foeProfilePic = store.userData.indulgers?.foe.profile_pic;
    return foeProfilePic?.image_url || placeholderImage;
  };

  const getDisplayImageHost = () => {
    const hostProfilePic = store.userData.indulgers?.host.profile_pic;
    return hostProfilePic?.image_url || placeholderImage;
  };

  const openScanTicketModal = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      setIsScannerActive(true);
      const scanTicketModal = new window.bootstrap.Modal(
        document.getElementById("scanTicketModal")
      );
      scanTicketModal.show();
    } catch (error) {
      console.error("Camera permission denied:", error);
      setErrorMessage("Camera permission is required to scan tickets.");
    }
  };

  const closeScanTicketModal = () => {
    setIsScannerActive(false);
    const scanTicketModal = window.bootstrap.Modal.getInstance(
      document.getElementById("scanTicketModal")
    );
    if (scanTicketModal) {
      scanTicketModal.hide();
    }
  };

  return (
    <>
      <button
        role="button"
        className="golden-button"
        data-bs-toggle="modal"
        data-bs-target="#startModal"
      >
        <span className="golden-text">👊🏾START👊🏾</span>
      </button>

      {/* First Modal */}
      <div
        className="modal fade"
        id="startModal"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        tabIndex="-1"
        aria-labelledby="startModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="profile-header">
              <img
                data-bs-dismiss="modal"
                src="https://icons.iconarchive.com/icons/microsoft/fluentui-emoji-3d/512/Prohibited-3d-icon.png"
                alt="Close"
                className="invite-close"
                onClick={() => {
                  actions.forfeitMatch(store.userData.dapaintId.id);
                }}
              />
              <p style={{ color: "white", fontSize: "10px" }}>--Forfeit</p>
              <h1 className="invite-title">WHO WON?</h1>
              <p style={{ color: "white", fontSize: "10px" }}>Scan Tickets--</p>
              <img
                data-bs-dismiss="modal"
                src="https://icons.iconarchive.com/icons/microsoft/fluentui-emoji-3d/512/Admission-Tickets-3d-icon.png"
                alt="Scan Tickets"
                className="invite-close"
                onClick={openScanTicketModal}
              />
            </div>

            <div className="modal-body">
              <div className="start-container">
                <form onSubmit={handleSubmit}>
                  <div className="user-section">
                    <p style={{ color: "black", fontSize: "10px" }}>
                      Keep a personal record of your winstreak we will request
                      each one upon your 30th winstreaks
                    </p>

                    <div className="mx-auto">
                      <input
                        name="img"
                        type="text"
                        placeholder="add 1 post link here"
                        required
                      />
                    </div>

                    <div className="user-vote">
                      <div className="user-name">
                        <img
                          src={getDisplayImageHost()}
                          alt="Host User"
                          className="rounded-circle img-fluid pe-1"
                          style={{ width: "68px", height: "68px" }}
                        />
                        {store.userData?.indulgers?.host.name}
                      </div>
                      <div className="vote-buttons">
                        <button
                          type="button"
                          className="rounded-lg"
                          style={{
                            backgroundColor:
                              hostVote === "winner" ? "green" : "black",
                          }}
                          onClick={() => handleHostVote("winner")}
                        >
                          Winner
                        </button>
                        <button
                          type="button"
                          className="rounded-lg"
                          style={{
                            backgroundColor:
                              hostVote === "loser" ? "red" : "black",
                          }}
                          onClick={() => handleHostVote("loser")}
                        >
                          Loser
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="user-section">
                    <div className="user-vote">
                      <div className="user-name">
                        <img
                          src={getDisplayImageFoe()}
                          alt="Foe User"
                          className="rounded-circle img-fluid pe-1"
                          style={{ width: "68px", height: "68px" }}
                        />
                        {store.userData.indulgers?.foe.name}
                      </div>
                      <div className="vote-buttons">
                        <button
                          type="button"
                          className="rounded-lg"
                          style={{
                            backgroundColor:
                              foeVote === "winner" ? "green" : "black",
                          }}
                          onClick={() => handleFoeVote("winner")}
                        >
                          Winner
                        </button>
                        <button
                          type="button"
                          className="rounded-lg"
                          style={{
                            backgroundColor:
                              foeVote === "loser" ? "red" : "black",
                          }}
                          onClick={() => handleFoeVote("loser")}
                        >
                          Loser
                        </button>
                      </div>
                    </div>
                  </div>
                  <button type="submit">Submit</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Second Modal (Scan Tickets) */}
      <div
        className="modal fade"
        id="scanTicketModal"
        tabIndex="-1"
        aria-labelledby="scanTicketModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="invite-header">
              <img
                data-bs-target="#startModal"
                data-bs-toggle="modal"
                src="https://icons.iconarchive.com/icons/microsoft/fluentui-emoji-3d/512/Back-Arrow-3d-icon.png"
                alt="Back"
                className="invite-close"
                onClick={closeScanTicketModal}
              />
              <h1 className="invite-title">
                SCAN TICKETS
                <img
                  data-bs-dismiss="modal"
                  src="https://icons.iconarchive.com/icons/microsoft/fluentui-emoji-flat/512/Cross-Mark-Flat-icon.png"
                  alt="Close"
                  className="invite-close"
                  onClick={closeScanTicketModal}
                />
              </h1>
            </div>
            <div className="modal-body">
              <div className="start-container">
                <div className="mx-auto">
                  {torchSupported && (
                    <button
                      className="btn btn-secondary mt-2"
                      onClick={toggleTorch}
                    >
                      {isTorchOn ? "Turn Off Torch" : "Turn On Torch"}
                    </button>
                  )}
                  <div className="qr-reader-container">
                    {isScannerActive && (
                      <QrReader
                        onResult={handleScan}
                        constraints={{
                          facingMode: "environment",
                          advanced: [{ torch: isTorchOn }],
                        }}
                        style={{
                          width: "100%",
                          height: "auto",
                        }}
                      />
                    )}
                  </div>
                </div>

                <form onSubmit={handleManualSubmit}>
                  <h6>Or enter code manually:</h6>
                  <div className="input-group">
                    <input
                      type="text"
                      className="form-control"
                      value={qrCodeInput}
                      onChange={(e) => setQrCodeInput(e.target.value)}
                      placeholder="Enter code manually"
                    />
                  </div>
                  <button className="btn btn-secondary mx-auto">Submit</button>

                  {errorMessage && (
                    <p style={{ color: "red", fontSize: "15px" }}>
                      {errorMessage}
                    </p>
                  )}
                  {success && (
                    <p style={{ color: "green" }}>
                      Ticket redeemed successfully!
                    </p>
                  )}
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
