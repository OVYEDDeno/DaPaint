import React, { useState, useEffect, useContext } from "react";
import { Context } from "../store/appContext";
import PropTypes from "prop-types";
import "../../styles/landing.css";
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";

export const DaPaintManager = () => {
  const { store, actions } = useContext(Context);
  const [events, setEvents] = useState([]);
  const [targetZipcode, setTargetZipcode] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    fitnessStyle: "",
    location: "",
    date: "",
    time: "",
    amount: "0",
  });
  const [error, setError] = useState("");

  const [selectedFitnessStyle, setSelectedFitnessStyle] = useState("");

  useEffect(() => {
    async function getUserInfo() {
      let success = await actions.fetchCurrentUser();
      if (success) {
        setTargetZipcode(store.userData.user.zipcode);
        fetchEvents();
        console.log("Updated user data:", store.userData);
      }
    }
    getUserInfo();
  }, []);

  const fetchEvents = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`${process.env.BACKEND_URL}/api/lineup`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const eventList = await response.json();
        setEvents(eventList);
      } else {
        console.error("Failed to retrieve list of events");
      }
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateDateTime = () => {
    if (!formData.date || !formData.time) {
      setError("Please select a valid date and time.");
      return false;
    }
    const selectedDateTime = new Date(`${formData.date}T${formData.time}`);
    if (selectedDateTime < new Date()) {
      setError("Please select a future date and time.");
      return false;
    }
    setError("");
    return true;
  };

  const handleCreate = async () => {
    if (!validateDateTime()) return;

    const token = localStorage.getItem("token");
    const newDaPaint = {
      fitnessStyle: formData.fitnessStyle,
      location: formData.location,
      date_time: `${formData.date} ${formData.time}:00`,
      price: parseFloat(formData.amount),
    };

    try {
      const response = await fetch(`${process.env.BACKEND_URL}/api/dapaint`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newDaPaint),
      });

      if (response.ok) {
        await fetchEvents(); // Refetch all events after creating a new one
        setFormData({
          fitnessStyle: "",
          location: "",
          date: "",
          time: "",
          amount: "0",
        });
      } else {
        console.error("Failed to create event");
      }
    } catch (error) {
      console.error("Error creating event:", error);
    }
  };

  const handleDelete = async (eventId) => {
    const success = await actions.deleteEvent(eventId);
    if (success) {
      setEvents(events.filter((event) => event.id !== eventId));
    }
  };

  const handleClockIn = async (event) => {
    try {
      const updatedDapaint = await actions.handleClockIn(event);
      if (updatedDapaint) {
        setEvents(
          events.map((e) => (e.id === updatedDapaint.id ? updatedDapaint : e))
        );
        console.log("Successfully clocked in!");
      }
    } catch (error) {
      console.error("Error clocking in:", error);
    }
  };
  const isCloseZipcode = (userZipcode, targetZipcode, range = 100) => {
    return Math.abs(parseInt(userZipcode) - parseInt(targetZipcode)) <= range;
  };

  const filteredEvents = events.filter((event) => {
    const hostFoeName = event.hostFoeId?.name?.toLowerCase() || "";
    const foeName = event.foeId?.name?.toLowerCase() || "";
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    const matchesSearch =
      hostFoeName.includes(lowerCaseSearchTerm) ||
      foeName.includes(lowerCaseSearchTerm);
    const matchesFitnessStyle =
      selectedFitnessStyle === "" ||
      event.fitnessStyle === selectedFitnessStyle;

    return (
      isCloseZipcode(event.hostFoeId.zipcode, targetZipcode) &&
      matchesSearch &&
      matchesFitnessStyle
    );
  });

  function convertTo12Hr(timeStr) {
    // Create a Date object from the input string
    const date = new Date(timeStr);

    // Extract hours, minutes, and seconds
    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const seconds = date.getSeconds().toString().padStart(2, "0");

    // Determine AM or PM
    const ampm = hours >= 12 ? "PM" : "AM";

    // Convert hours to 12-hour format
    hours = hours % 12;
    hours = hours ? hours : 12; // Handle midnight (0 should be 12)

    // Format the date part (MM/DD/YYYY)
    const formattedDate =
      (date.getMonth() + 1).toString().padStart(2, "0") +
      "/" +
      date.getDate().toString().padStart(2, "0") +
      "/" +
      date.getFullYear();

    // Return formatted time in 12-hour format
    return `${formattedDate} ${hours}:${minutes}:${seconds} ${ampm}`;
  }
  const initialOptions = {
    clientId:
      "Ab3UDlPb82gsZcwSr7TDWewUxS8yUygIDlBBegXaDPolaA4PGtzqSG-rx6sDkg--HjtZ88XVGJycQbLz",
    currency: "USD",
    intent: "capture",
  };
  // THIS IS ORIGINAL const handleApprove = () => {
  //   console.log("PAYPAL");

  //   // Get references to both modals
  //   const daPaintModal = document.getElementById("DaPaint");
  //   const daPaint3Modal = document.getElementById("DaPaint3");

  //   // Hide the DaPaint modal
  //   const bsModalDaPaint = bootstrap.Modal.getInstance(daPaintModal);
  //   bsModalDaPaint.hide();

  //   // Use a small delay to ensure the first modal is fully hidden
  //   setTimeout(() => {
  //     // Show the DaPaint3 modal
  //     const bsModalDaPaint3 = new bootstrap.Modal(daPaint3Modal);
  //     bsModalDaPaint3.show();
  //   }, 300);
  // };

  const handleFitnessStyleChange = (e) => {
    setSelectedFitnessStyle(e.target.value);
  };
  const handleDaPaintUnlock = async (data) => {
    console.log("PAYPAL");

    // Get references to both modals
    const daPaintModal = document.getElementById("DaPaint");
    const daPaint3Modal = document.getElementById("DaPaint3");

    // Hide the DaPaint modal
    const bsModalDaPaint = bootstrap.Modal.getInstance(daPaintModal);
    if (bsModalDaPaint) {
      bsModalDaPaint.hide();
    }

    // Use a small delay to ensure the first modal is fully hidden
    setTimeout(() => {
      // Show the DaPaint3 modal
      const bsModalDaPaint3 = new bootstrap.Modal(daPaint3Modal);
      bsModalDaPaint3.show();
    }, 300);

    try {
      const response = await fetch(
        `${process.env.BACKEND_URL}/api/capture-paypal-order`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            paypal_id: data.orderID,
            type_of_order: "dapaint_unlocked",
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const responseData = await response.json();

      if (responseData.message === "DaPaint Unlocked!") {
        console.log("DaPaint has been successfully unlocked.");

        // Additional logic after successful unlock
        // e.g., updating the UI to reflect the unlocked status
        // actions.updateUserDaPaintStatus(true);
      } else {
        throw new Error(responseData.error || "Unexpected response message.");
      }

      return responseData;
    } catch (error) {
      console.error("Error unlocking DaPaint:", error);
      // Handle the error appropriately (e.g., show an error message to the user)
      // Display error notification or alert
    }
  };

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
              {store.userData?.user?.wins < 1 &&
              store.userData?.user?.losses < 1 ? (
                <button
                  className="btn-danger"
                  data-bs-target="#DaPaint2"
                  data-bs-toggle="modal"
                >
                  FIRST ONE ON US
                </button>
              ) : null}

              <h1 style={{ color: "black" }}>PAY $1 TO UNLOCK</h1>
              <PayPalScriptProvider options={initialOptions}>
                <PayPalButtons
                  createOrder={(data, actions) => {
                    return actions.order.create({
                      purchase_units: [
                        {
                          amount: {
                            value: "1", // Set the amount here
                          },
                        },
                      ],
                    });
                  }}
                  onApprove={(data, actions) => handleDaPaintUnlock(data)}
                />
              </PayPalScriptProvider>
              {/* <h1 style={{ color: "black" }}>for 30 days or until you lose</h1> */}
              <p style={{ color: "black", fontSize: "15px" }}>
                So people don't say they're <del>single</del>; I mean, loser by
                choice.
              </p>
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
                No Weenies Allowed
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
              {/* No Weenies Allowed! */}
              {/* <iframe
                width="auto"
                height="249"
                src="https://www.youtube.com/embed/6-1Ue0FFrHY?si=5-DCnlmIGzQW6KKp&amp;controls=0"
                title="YouTube video player"
                frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerpolicy="strict-origin-when-cross-origin"
                allowfullscreen
              ></iframe> */}
              <iframe
                width="auto"
                height="249"
                src="https://www.youtube-nocookie.com/embed/HeAmzqrUjcA?si=2D5aozszYgBUFBWU&amp;controls=0&amp;start=58"
                title="YouTube video player"
                frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerpolicy="strict-origin-when-cross-origin"
                allowfullscreen
              ></iframe>
              <button
                className="btn-danger"
                data-bs-target="#DaPaint3"
                data-bs-toggle="modal"
              >
                {/* <h3>Buy Now</h3> */}
                <h3>Clock In</h3>
              </button>
              {/* <button
                class="btn-primary"
                data-bs-target="#DaPaint3"
                data-bs-toggle="modal"
              >
                Clock In
              </button> */}
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
              <img
                data-bs-target="#DaPaint"
                data-bs-toggle="modal"
                src="https://icons.iconarchive.com/icons/microsoft/fluentui-emoji-3d/512/Back-Arrow-3d-icon.png"
                alt="Back"
                className="invite-close"
              />
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
              <div className="m-2">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search for a foe..."
                  className="form-control mb-3"
                />
                <select
                  value={selectedFitnessStyle}
                  onChange={handleFitnessStyleChange}
                  className="form-control mb-3"
                >
                  <option value="">Any Fitness Style</option>
                  <option value="Basketball">Basketball</option>
                  <option value="Boxing">Boxing</option>
                  <option value="Racquetball">Racquetball/Squash</option>
                  <option value="Tennis">Tennis</option>
                  <option value="Pickleball">Pickleball</option>
                  <option value="Golf">Golf</option>
                  <option value="Volleyball">Volleyball</option>
                  <option value="Badminton">Badminton</option>
                  <option value="Table Tennis">Table Tennis</option>
                  <option value="Break Dancing">Break Dancing</option>
                </select>
              </div>

              <button
                class="btn-danger"
                data-bs-target="#DaPaint6"
                data-bs-toggle="modal"
              >
                +ADD
              </button>

              <div className="event-list">
                <p style={{ fontSize: "20px", textTransform: "uppercase" }}>
                  Winners don’t wait! Pick any Fitness Style!
                </p>

                {filteredEvents.length === 0 ? (
                  <p>THERE’S NO DAPAINT. PRESS +ADD TO CREATE ONE</p>
                ) : (
                  filteredEvents.map((event) => (
                    <div key={event.id} className="event-item">
                      <img
                        src={
                          event.hostFoeId?.profile_pic?.image_url ||
                          "https://icons.iconarchive.com/icons/microsoft/fluentui-emoji-3d/512/Man-3d-Medium-Dark-icon.png"
                        }
                        alt={event.hostFoeId?.name || "Unknown Host"}
                        className="rounded-circle img-fluid avatar"
                      />
                      <div className="details-container">
                        <span>{event.hostFoeId?.name || "Unknown Host"}</span>
                        <span>{event.fitnessStyle}</span>
                        <span>{event.location}</span>
                        <span>{convertTo12Hr(event.date_time)}</span>

                        {event.hostFoeId?.id !== store.userData.user?.id ? (
                          <button
                            onClick={() => handleClockIn(event)}
                            className="btn-danger"
                            data-bs-target="#lineUp"
                            data-bs-toggle="modal"
                          >
                            CLOCK IN
                          </button>
                        ) : (
                          <button
                            onClick={() => handleDelete(event.id)}
                            className="btn-danger"
                          >
                            DELETE
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
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
              <img
                data-bs-target="#DaPaint3"
                data-bs-toggle="modal"
                src="https://icons.iconarchive.com/icons/microsoft/fluentui-emoji-3d/512/Back-Arrow-3d-icon.png"
                alt="Back"
                className="invite-close"
              />
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
              <img
                data-bs-target="#DaPaint3"
                data-bs-toggle="modal"
                src="https://icons.iconarchive.com/icons/microsoft/fluentui-emoji-3d/512/Back-Arrow-3d-icon.png"
                alt="Back"
                className="invite-close"
              />
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
              <img
                className="rounded-circle img-fluid"
                style={{ width: "auto", height: "auto" }}
                src={
                  store.userData?.user?.profile_pic?.image_url ||
                  "https://icons.iconarchive.com/icons/microsoft/fluentui-emoji-3d/512/Man-3d-Medium-Dark-icon.png"
                }
                alt={store.userData?.user?.name || "Unknown Host"}
              />
              <span className="m-1">
                {store.userData?.user?.name || "Unknown Host"}
              </span>
              <div className="create-form">
                <div>
                  <label className="form-label" htmlFor="fitnessSelect">
                    Fitness Style:
                  </label>
                  <select
                    name="fitnessStyle"
                    value={formData.fitnessStyle}
                    onChange={handleInputChange}
                    className="form-input"
                  >
                    <option value="">Select Fitness Style</option>
                    <option value="Basketball">Basketball</option>
                    <option value="Boxing">Boxing</option>
                    <option value="Racquetball">Racquetball/Squash</option>
                    <option value="Tennis">Tennis</option>
                    <option value="Pickleball">Pickleball</option>
                    <option value="Golf">Golf</option>
                    <option value="Volleyball">Volleyball</option>
                    <option value="Badminton">Badminton</option>
                    <option value="Table Tennis">Table Tennis</option>
                    <option value="Break Dancing">Break Dancing</option>
                  </select>
                </div>
                <div>
                  <label className="form-label" htmlFor="locationSelect">
                    Select a Location:
                  </label>
                  <input
                    type="text"
                    name="location"
                    placeholder="456 Elm Avenue, Los Angeles, CA 90012, USA"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="form-input"
                  />
                </div>
                <div>
                  <label className="form-label" htmlFor="stateSelect">
                    Select a Date:
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    className="form-input"
                  />
                </div>
                <div>
                  <label className="form-label" htmlFor="timeSelect">
                    Select a Time:
                  </label>
                  <input
                    type="time"
                    name="time"
                    value={formData.time}
                    onChange={handleInputChange}
                    className="form-input"
                  />
                </div>
                <div>
                  <label className="form-label" htmlFor="stateSelect">
                    Ticket Prices:
                  </label>
                  <input
                    type="number"
                    name="amount"
                    placeholder="Ticket Price"
                    value={formData.amount}
                    onChange={handleInputChange}
                    className="form-input"
                  />
                </div>
                {error && <div className="error-message">{error}</div>}
                <button
                  onClick={handleCreate}
                  className="btn-danger"
                  data-bs-target="#DaPaint3"
                  data-bs-toggle="modal"
                >
                  CREATE
                </button>
              </div>
            </div>
            {/* <div class="modal-footer">
              <button
                class="btn btn-primary"
                data-bs-target="#DaPaint"
                data-bs-toggle="modal"
              >
                Back to first modal
              </button>
            </div> */}
          </div>
        </div>
      </div>
      <button
        className="btn-danger btn-lg"
        data-bs-target={
          !store.userData?.user?.dapaint_unlocked ? "#DaPaint" : "#DaPaint3"
        }
        data-bs-toggle="modal"
      >
        <h1>⚔️FIND FOE⚔️</h1>
      </button>
    </>
  );
};
