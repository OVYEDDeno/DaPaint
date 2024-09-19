import React, { useState, useEffect } from "react";
import "../../styles/landing.css";

export const Wallet = ({ onClose }) => {
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [zipCode, setZipCode] = useState("");

  const handleLinkCard = () => {
    // Implement card linking logic here
    console.log("Linking card:", { cardNumber, expiry, cvv, zipCode });
    // In a real app, you would send this data securely to your backend
    // Never log or store full card details on the client side
    onClose();
  };

  return (
      <><><div
      class="modal fade"
      id="DaPaintLock"
      aria-hidden="true"
      aria-labelledby="DaPaintLockLabel"
      tabindex="-1"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-5" id="DaPaintLockLabel">
              DaPaint
            </h1>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <button>WATCH AN AD</button> OR
            <button
              class="btn btn-primary"
              data-bs-target="#DaPaintAds"
              data-bs-toggle="modal"
            >
              PAY A DOLLAR
            </button>
            TO UNLOCK
          </div>
        </div>
      </div>
    </div>



      <><div
        class="modal fade"
        id="DaPaintAds"
        aria-hidden="true"
        aria-labelledby="DaPaintAds"
        tabindex="-1"
      >
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header">
              <h1 class="modal-title fs-5" id="DaPaintAds">
                AD Title from advertiser
              </h1>
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div class="modal-body">
              Hide this modal and show the first with the button below.
            </div>
            <div class="modal-footer">
              <button
                class="btn btn-primary"
                data-bs-target="#exampleModalToggle"
                data-bs-toggle="modal"
              >
                Back to first
              </button>
            </div>
          </div>
        </div>
      </div><button
        class="btn btn-primary"
        data-bs-target="#exampleModalToggle"
        data-bs-toggle="modal"
      >
          Open first modal
        </button></></><><div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header">
              <h1 class="modal-title fs-5" id="DaPaintAds">
                WALLET
              </h1>
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div class="modal-body">
              <div className="fixed inset-0 bg-black text-white flex flex-col">
                <div className="flex justify-between items-center p-4">
                  <ChevronLeft size={24} />
                  <h1 className="text-2xl font-bold">WALLET</h1>
                  <X size={24} onClick={onClose} className="text-red-500" />
                </div>

                <div className="flex-1 p-4 bg-white text-black rounded-t-3xl mt-4">
                  <button className="w-full bg-black text-white p-3 rounded-full mb-4">
                    LINK BANK ACCOUNT
                  </button>

                  <p className="text-center mb-4">ADD A BANK USING YOUR DEBIT CARD</p>

                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    placeholder="DEBIT CARD NUMBER"
                    className="w-full p-3 mb-4 bg-yellow-400 rounded-full text-center" />

                  <div className="flex justify-between mb-4">
                    <input
                      type="text"
                      value={expiry}
                      onChange={(e) => setExpiry(e.target.value)}
                      placeholder="MM/YY"
                      className="w-[48%] p-3 bg-yellow-400 rounded-full text-center" />
                    <input
                      type="text"
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value)}
                      placeholder="3 DIGIT CVV"
                      className="w-[48%] p-3 bg-yellow-400 rounded-full text-center" />
                  </div>

                  <input
                    type="text"
                    value={zipCode}
                    onChange={(e) => setZipCode(e.target.value)}
                    placeholder="ZIP CODE"
                    className="w-full p-3 mb-4 bg-yellow-400 rounded-full text-center" />

                  <p className="text-center mb-4">SECURED WITH 256-BIT ENCRYPTION</p>

                  <button
                    onClick={handleLinkCard}
                    className="w-full bg-black text-white p-3 rounded-full"
                  >
                    LINK CARD
                  </button>
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button
                class="btn btn-primary"
                data-bs-target="#exampleModalToggle"
                data-bs-toggle="modal"
              >
                Back to first
              </button>
            </div>
          </div>
        </div><button
          class="btn btn-primary"
          data-bs-target="#exampleModalToggle"
          data-bs-toggle="modal"
        >
          Open first modal
        </button></></>  
     );
};
