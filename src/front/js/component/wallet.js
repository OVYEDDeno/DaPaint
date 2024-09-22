import React, { useState } from "react";
import "../../styles/landing.css";

export const Wallet = ({ onClose }) => {
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [zipCode, setZipCode] = useState("");

  const handleLinkCard = () => {
    console.log("Linking card:", { cardNumber, expiry, cvv, zipCode });
    onClose();
  };

  return (
    <>
      {/* First Modal: DaPaintLock */}
      <div
        className="modal fade"
        id="DaPaintLock"
        aria-hidden="true"
        aria-labelledby="DaPaintLockLabel"
        tabIndex="-1"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="DaPaintLockLabel">
                DaPaint
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              OR
              <button
                className="btn btn-primary"
                data-bs-target="#DaPaintAds"
                data-bs-toggle="modal"
              >
                WATCH AN AD
              </button>
              <form
                action="https://www.paypal.com/ncp/payment/SFZCFW7AB3F8Y"
                method="post"
                target="_top"
                style={{
                  display: "inline-grid",
                  justifyItems: "center",
                  alignContent: "start",
                  gap: "0.5rem",
                }}
              >
                <input
                  className="pp-SFZCFW7AB3F8Y"
                  type="submit"
                  value="Pay Now"
                  style={{
                    textAlign: "center",
                    border: "none",
                    borderRadius: "1.5rem",
                    minWidth: "11.625rem",
                    padding: "0 2rem",
                    height: "2.625rem",
                    fontWeight: "bold",
                    backgroundColor: "#000000",
                    color: "#ffffff",
                    fontFamily: '"Helvetica Neue", Arial, sans-serif',
                    fontSize: "1rem",
                    lineHeight: "1.25rem",
                    cursor: "pointer",
                  }}
                />
                <img
                  src="https://www.paypalobjects.com/images/Debit_Credit_APM.svg"
                  alt="cards"
                />
                <section>
                  Powered by{" "}
                  <img
                    src="https://www.paypalobjects.com/paypal-ui/logos/svg/paypal-wordmark-color.svg"
                    alt="paypal"
                    style={{ height: "0.875rem", verticalAlign: "middle" }}
                  />
                </section>
              </form>
              TO UNLOCK
            </div>
          </div>
        </div>
      </div>

      {/* Second Modal: DaPaintAds */}
      <div
        className="modal fade"
        id="DaPaintAds"
        aria-hidden="true"
        aria-labelledby="DaPaintAdsLabel"
        tabIndex="-1"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="DaPaintAdsLabel">
                AD Title from advertiser
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <p>Hide this modal and show the first with the button below.</p>
              <button>CTA</button>
            </div>
            <div className="modal-footer">
              <button
                className="btn btn-primary"
                data-bs-target="#DaPaintLock"
                data-bs-toggle="modal"
              >
                Back to first
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Third Modal: Wallet */}
      <div
        className="modal fade"
        id="WalletModal"
        aria-hidden="true"
        aria-labelledby="WalletModalLabel"
        tabIndex="-1"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="WalletModalLabel">
                WALLET
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <div className="flex flex-col p-4">
                <button className="w-full bg-black text-white p-3 rounded-full mb-4">
                  LINK BANK ACCOUNT
                </button>
                <p className="text-center mb-4">
                  ADD A BANK USING YOUR DEBIT CARD
                </p>
                <input
                  type="text"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  placeholder="DEBIT CARD NUMBER"
                  className="w-full p-3 mb-4 bg-yellow-400 rounded-full text-center"
                />
                <div className="flex justify-between mb-4">
                  <input
                    type="text"
                    value={expiry}
                    onChange={(e) => setExpiry(e.target.value)}
                    placeholder="MM/YY"
                    className="w-[48%] p-3 bg-yellow-400 rounded-full text-center"
                  />
                  <input
                    type="text"
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value)}
                    placeholder="3 DIGIT CVV"
                    className="w-[48%] p-3 bg-yellow-400 rounded-full text-center"
                  />
                </div>
                <input
                  type="text"
                  value={zipCode}
                  onChange={(e) => setZipCode(e.target.value)}
                  placeholder="ZIP CODE"
                  className="w-full p-3 mb-4 bg-yellow-400 rounded-full text-center"
                />
                <p className="text-center mb-4">
                  SECURED WITH 256-BIT ENCRYPTION
                </p>
                <button
                  onClick={handleLinkCard}
                  className="w-full bg-black text-white p-3 rounded-full"
                >
                  LINK CARD
                </button>
              </div>
            </div>
            <div className="modal-footer">
              <button
                className="btn btn-primary"
                data-bs-target="#DaPaintLock"
                data-bs-toggle="modal"
              >
                Back to first
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Button to Open the First Modal */}
      <button
        className="btn btn-primary"
        data-bs-target="#DaPaintLock"
        data-bs-toggle="modal"
      >
        Open DaPaintLock Modal
      </button>

      {/* Button to Open the Wallet Modal 
      <button
        className="btn btn-primary"
        data-bs-target="#WalletModal"
        data-bs-toggle="modal"
      >
        Open Wallet Modal
      </button>*/}
    </>
  );
};
