import React, { useState, useContext, useEffect } from 'react';
import '../../styles/wlsub.css';
import { Context } from "../store/appContext";


export const Wlsub = () => {
  const [hostUser, setHostUser] = useState(null);
  const [foeUser, setFoeUser] = useState(null);
  const [hostVote, setHostVote] = useState(null);
  const { store, actions } = useContext(Context);
  const [foeVote, setFoeVote] = useState(null);

  const [currentUserId, setCurrentUserId] = useState(null);
  const [dapaintId, setDaPaintId] = useState(null);
  const [events, setEvents] = useState([]);

  //-----------------------------------------------
  useEffect(() => {
    const token = localStorage.getItem("token");

    async function getDapaintList() {
      try {
        const response = await fetch(`${process.env.BACKEND_URL}/api/lineup?isaccepted=1`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
        });

        if (response.ok) {
          const EventList = await response.json();
          setEvents(EventList);
          console.log('EVENTS FROM RESPONSE.OK - WLSUB: ', EventList);

          const currentUserId = store.currentUser.id;
          console.log(currentUserId);
          const matchedEvent = EventList.find(
            event => (event.hostFoeId === currentUserId || event.foeId === currentUserId)
          );
          console.log("MATCHED EVENT: ", matchedEvent)
          if (matchedEvent) {
            setDaPaintId(matchedEvent.id);
          }
        } else {
          const error = await response.json();
          console.error('Failed to retrieve list of events:', error);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    }

    getDapaintList();
  }, []);

  // Transform events into matchups
  // const matchups = events
  //   .filter(event => event.hostFoeId)
  //   .map(event => ({
  //     id: event.id,
  //     date_time: event.date_time,
  //     // time: event.time,
  //     // location: `${event.location} ${event.distance}`,
  //     location: `${event.location}`,
  //     user1: event.hostFoeId.name,
  //     user2: event.foeId ? event.foeId.name : 'Unknown'
  //   }));

  console.log("EVENTS FROM WLSUB: ", events);

  //------------------------------------------------
  const handleFileUpload = (e, setUser) => {
    setUser(URL.createObjectURL(e.target.files[0]));
  };

  const handleHostVote = (vote) => {
    setHostVote(vote);
    if (vote === 'winner') {
      setFoeVote('loser'); // Automatically set opponent's vote to 'loser'
    }
  };

  const handleFoeVote = (vote) => {
    setFoeVote(vote);
    if (vote === 'winner') {
      setHostVote('loser'); // Automatically set host's vote to 'loser'
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // let dapaintId = 1
    if (!dapaintId) {
      alert("No valid event found for this user");
      return;
    }

    let result = await actions.updateWinstreak(dapaintId, hostVote);
    if (result) {
      alert("Winstreak has been updated");
      actions.fetchCurrentUser(); // Refresh user data after update
    } else {
      alert("Failed to update win streak");
    }
  };

  return (
    <>
      <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#WLSubmodal">
        START
      </button>
      <div className="modal fade" id="WLSubmodal" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-body">
            <div className="wlsub-container">
            <h1
                className="modal-title text-white text-2xl font-bold mx-auto"
                id="WLSubLabel"
              >
                Who Won?
              </h1>
              <form onSubmit={handleSubmit}>
                <div className="user-section">
                  <div className="upload-ko">
                    <input
                      type="file"
                      accept="image/*,video/*"
                      onChange={(e) => handleFileUpload(e, setHostUser)}
                    />
                    <button type="button" className='rounded-lg'>Upload KO</button>
                  </div>
                  {hostUser && <img src={hostUser} alt="Host User" className="user-img" />}
                  <div className="user-vote">
                    <span>hostUsername</span>
                    <button
                      type="button"
                      className='rounded-lg'
                      style={{ backgroundColor: hostVote === 'winner' ? 'green' : 'black' }}
                      onClick={() => handleHostVote('winner')}>Winner</button>
                    <button
                      type="button"
                      className='rounded-lg'
                      style={{ backgroundColor: hostVote === 'loser' ? 'red' : 'black' }}
                      onClick={() => handleHostVote('loser')}>Loser</button>
                  </div>
                </div>
                <div className="user-section">
                  {foeUser && <img src={foeUser} alt="Foe User" className="user-img" />}
                  <div className="user-vote">
                    <span>foeUsername</span>
                    
                    <button type="button"
                    className='rounded-lg'
                      style={{
                        backgroundColor: foeVote === 'winner' ? '#f5c116' : 'black',
                        color: foeVote === 'winner' ? 'black' : '#f5c116'
                      }} onClick={() => handleFoeVote('winner')}>Winner</button>

                    <button
                      type="button"
                      className='rounded-lg'
                      style={{ backgroundColor: foeVote === 'loser' ? 'red' : 'black' }}
                      onClick={() => handleFoeVote('loser')}>Loser</button>
                  </div>
                </div>
                <button type="submit">Submit</button>
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Forfeit</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};