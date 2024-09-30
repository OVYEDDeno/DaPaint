import React, { useState, useEffect, useContext } from "react";
import { Context } from "../store/appContext";
import PropTypes from "prop-types";
import "../../styles/landing.css";

export const DaPaintManager = () => {
  const { store, actions } = useContext(Context);
  const [events, setEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    fitnessStyle: "",
    location: "",
    date: "",
    time: "",
    amount: "0",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    actions.fetchCurrentUser();
    fetchEvents();
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

  const filteredEvents = events.filter((event) => {
    const hostFoeName = event.hostFoeId?.name?.toLowerCase() || "";
    const foeName = event.foeId?.name?.toLowerCase() || "";
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    return (
      hostFoeName.includes(lowerCaseSearchTerm) ||
      foeName.includes(lowerCaseSearchTerm)
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
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search for a foe..."
                className="form-control mb-3"
              />
              <button
                class="btn-danger"
                data-bs-target="#DaPaint4"
                data-bs-toggle="modal"
              >
                +ADD
              </button>
              {/* <div className="event-list">
                {filteredEvents.map((event) => (
                  <div key={event.id} className="event-item">
                    <div className="event-info">
                      <img
                        src={
                          event.hostFoeId?.profile_pic?.image_url ||
                          "default-avatar.png"
                        }
                        alt={event.hostFoeId?.name || "Unknown Host"}
                        className="rounded-circle img-fluid"
                        style={{ width: "21px", height: "21px" }}
                      />
                      <span>{event.hostFoeId?.name || "Unknown Host"}</span>
                      <span>{event.fitnessStyle}</span>
                      <span>{event.location}</span>
                      <span>{event.date_time}</span>
                    </div>
                    {event.hostFoeId?.id !== store.userData.user?.id ? (
                      <button
                        onClick={() => handleClockIn(event)}
                        className="btn-danger"
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
                ))}
              </div> */}
              <div className="event-list">
                {filteredEvents.map((event) => (
                  <div key={event.id} className="event-item">
                    <img
                      src={
                        event.hostFoeId?.profile_pic?.image_url ||
                        "default-avatar.png"
                      }
                      alt={event.hostFoeId?.name || "Unknown Host"}
                      className="rounded-circle img-fluid avatar"
                    />
                    <div className="details-container">
                      <span>{event.hostFoeId?.name || "Unknown Host"}</span>
                      <span>{event.fitnessStyle}</span>
                      <span>{event.location}</span>
                      <span>{convertTo12Hr(event.date_time)}</span>

                      {/* <div className="button-container"> */}
                      {event.hostFoeId?.id !== store.userData.user?.id ? (
                        <button
                          onClick={() => handleClockIn(event)}
                          className="btn-danger"
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
                      {/* </div> */}
                    </div>
                  </div>
                ))}
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
                    <option value="boxing">Boxing</option>
                    <option value="breakDancing">Breaking</option>
                  </select>
                </div>
                <div>
                  <label className="form-label" htmlFor="locationSelect">
                    Select a Location:
                  </label>
                  <input
                    type="text"
                    name="location"
                    placeholder="Location"
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
        data-bs-target="#DaPaint"
        data-bs-toggle="modal"
      >
        <h1>⚔️FIND FOE⚔️</h1>
      </button>
    </>
  );
};
