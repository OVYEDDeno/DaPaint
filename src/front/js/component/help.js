import React, { useState, useContext, useEffect } from "react";
import "../../styles/start.css";
import { Context } from "../store/appContext";
import { DaPaintList } from "./dapaintlist.js";

export const Help = () => {
  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.text = `aclib.runAutoTag({zoneId: '3jdazwaval'});`;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script); // Clean up the script on component unmount
    };
  }, []);
  return (
    <>
      <div
        class="modal fade"
        id="DaPaint"
        aria-hidden="true"
        aria-labelledby="DaPaintLabel"
        tabindex="-1"
      >
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div className="invite-header">
              <h1 className="invite-title">
                DAPAINT
                <img
                  data-bs-dismiss="modal"
                  src="https://icons.iconarchive.com/icons/microsoft/fluentui-emoji-flat/512/Cross-Mark-Flat-icon.png"
                  alt="Close"
                  className="invite-close"
                />
              </h1>
            </div>

            {/* <div class="modal-header">
              <h1 class="modal-title" id="DaPaintLabel">
                Watch or pay $1 modal
              </h1>
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div> */}
            <div className="profile-container">
              <button
                className="btn-danger"
                data-bs-target="#DaPaint2"
                data-bs-toggle="modal"
              >
                WATCH AN AD
              </button>
              <h1 style={{ color: "black" }}>OR</h1>
              <form
                className="p-0"
                action="https://www.paypal.com/ncp/payment/SFZCFW7AB3F8Y"
                method="post"
                target="_top"
              >
                <input
                  className="btn-danger w-100 pp-SFZCFW7AB3F8Y"
                  type="submit"
                  value="PAY $1"
                />
                <h1 style={{ color: "black" }}>TO UNLOCK</h1>
              </form>
            </div>
            {/* <div class="modal-footer">
              <button
                class="btn btn-primary"
                data-bs-target="#DaPaint2"
                data-bs-toggle="modal"
              >
                Open second modal
              </button>
            </div> */}
          </div>
        </div>
      </div>
      <div
        class="modal fade"
        id="DaPaint2"
        aria-hidden="true"
        aria-labelledby="DaPaintLabel2"
        tabindex="-1"
        data-bs-backdrop="static"
      >
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div className="invite-header">
              <h1 className="invite-title">
              Long Long Man
                {/* <img
                  data-bs-dismiss="modal"
                  src="https://icons.iconarchive.com/icons/microsoft/fluentui-emoji-flat/512/Cross-Mark-Flat-icon.png"
                  alt="Close"
                  className="invite-close"
                /> */}
              </h1>
            </div>
            {/* <div class="modal-header">
              <h1 class="modal-title fs-5" id="DaPaintLabel2">
                AD Title from advertiser
              </h1>
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div> */}
            <div class="profile-container">
              Long Long Man
              <iframe
                width="auto"
                height="249"
                src="https://www.youtube.com/embed/6-1Ue0FFrHY?si=5-DCnlmIGzQW6KKp&amp;controls=0"
                title="YouTube video player"
                frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerpolicy="strict-origin-when-cross-origin"
                allowfullscreen
              ></iframe>
              <button
                className="btn-danger"
                // data-bs-target="#DaPaint"
                // data-bs-toggle="modal"
              >
                <h3>Buy Now</h3>
              </button>
              <button
                class="btn-primary"
                data-bs-target="#DaPaint3"
                data-bs-toggle="modal"
              >
                Clock In
              </button>
            </div>
            {/* <div class="modal-footer">
              
            </div> */}
          </div>
        </div>
      </div>
      <div
        class="modal fade"
        id="DaPaint3"
        aria-hidden="true"
        aria-labelledby="DaPaintLabel3"
        tabindex="-1"
        data-bs-backdrop="static"
      >
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div className="invite-header">
              <h1 className="invite-title">
                DAPAINT
                <img
                  data-bs-dismiss="modal"
                  src="https://icons.iconarchive.com/icons/microsoft/fluentui-emoji-flat/512/Cross-Mark-Flat-icon.png"
                  alt="Close"
                  className="invite-close"
                />
              </h1>
            </div>
            {/* <div class="modal-header">
              <h1 class="modal-title fs-5" id="DaPaintLabel3">
                Dapaint list
              </h1>
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div> */}
            <div class="profile-container">
              Hide this modal and show the fourth with the button below.
              <button
                class="btn-danger"
                data-bs-target="#DaPaint4"
                data-bs-toggle="modal"
              >
                +Add
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div
        class="modal fade"
        id="DaPaint4"
        aria-hidden="true"
        aria-labelledby="DaPaintLabel4"
        tabindex="-1"
      >
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div className="invite-header">
              <h1 className="invite-title">
                DAPAINT
                <img
                  data-bs-dismiss="modal"
                  src="https://icons.iconarchive.com/icons/microsoft/fluentui-emoji-flat/512/Cross-Mark-Flat-icon.png"
                  alt="Close"
                  className="invite-close"
                />
              </h1>
            </div>

            {/* <div class="modal-header">
              <h1 class="modal-title" id="DaPaintLabel">
                Watch or pay $1 modal
              </h1>
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div> */}
            <div className="profile-container">
              <button
                className="btn-danger"
                data-bs-target="#DaPaint5"
                data-bs-toggle="modal"
              >
                WATCH AN AD
              </button>
              <h1 style={{ color: "black" }}>OR</h1>
              <form
                className="p-0"
                action="https://www.paypal.com/ncp/payment/SFZCFW7AB3F8Y"
                method="post"
                target="_top"
              >
                <input
                  className="btn-danger w-100 pp-SFZCFW7AB3F8Y"
                  type="submit"
                  value="PAY $1"
                />
                <h1 style={{ color: "black" }}>TO UNLOCK</h1>
              </form>
            </div>
            {/* <div class="modal-footer">
              <button
                class="btn btn-primary"
                data-bs-target="#DaPaint2"
                data-bs-toggle="modal"
              >
                Open second modal
              </button>
            </div> */}
          </div>
        </div>
      </div>
      
      <div
        class="modal fade"
        id="DaPaint5"
        aria-hidden="true"
        aria-labelledby="DaPaintLabel5"
        tabindex="-1"
        data-bs-backdrop="static"
      >
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div className="invite-header">
              <h1 className="invite-title">
              Long Long Man2
                {/* <img
                  data-bs-dismiss="modal"
                  src="https://icons.iconarchive.com/icons/microsoft/fluentui-emoji-flat/512/Cross-Mark-Flat-icon.png"
                  alt="Close"
                  className="invite-close"
                /> */}
              </h1>
            </div>
            {/* <div class="modal-header">
              <h1 class="modal-title fs-5" id="DaPaintLabel2">
                AD Title from advertiser
              </h1>
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div> */}
            <div class="profile-container">
              Long Long Man2
              <iframe
                width="auto"
                height="249"
                src="https://www.youtube.com/embed/6-1Ue0FFrHY?si=5-DCnlmIGzQW6KKp&amp;controls=0"
                title="YouTube video player"
                frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerpolicy="strict-origin-when-cross-origin"
                allowfullscreen
              ></iframe>
              {/* <script type="text/javascript">aclib.runAutoTag({zoneId: '3jdazwaval',});</script> */}
              <button
                className="btn-danger"
                // data-bs-target="#DaPaint"
                // data-bs-toggle="modal"
              >
                <h3>Buy Now</h3>
              </button>
              <button
                class="btn-primary"
                data-bs-target="#DaPaint6"
                data-bs-toggle="modal"
              >
                Clock In
              </button>
            </div>
            {/* <div class="modal-footer">
              
            </div> */}
          </div>
        </div>
      </div>




      <div
        class="modal fade"
        id="DaPaint6"
        aria-hidden="true"
        aria-labelledby="DaPaintLabel6"
        tabindex="-1"
        data-bs-backdrop="static"
      >
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div className="invite-header">
              <h1 className="invite-title">
                DAPAINT
                <img
                  data-bs-dismiss="modal"
                  src="https://icons.iconarchive.com/icons/microsoft/fluentui-emoji-flat/512/Cross-Mark-Flat-icon.png"
                  alt="Close"
                  className="invite-close"
                />
              </h1>
            </div>
            {/* <div class="modal-header">
              <h1 class="modal-title fs-5" id="DaPaintLabel4">
                Dapaint create
              </h1>
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div> */}
            <div class="profile-container">
              Hide this modal and go back to the first with the button below.
            </div>
            <div class="modal-footer">
              <button
                class="btn btn-primary"
                data-bs-target="#DaPaint"
                data-bs-toggle="modal"
              >
                Back to first modal
              </button>
            </div>
          </div>
        </div>
      </div>
      <button
        className="btn-danger btn-lg"
        data-bs-target="#DaPaint"
        data-bs-toggle="modal"
      >
        <h1>⚔️FIND FOE⚔️</h1>
      </button>
    </>
  );
};
