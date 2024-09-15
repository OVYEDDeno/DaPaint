import DaPaintList from "../component/dapaintlist";

const getState = ({ getStore, getActions, setStore }) => {
  return {
    store: {
      users: [],
      currentUser: null,
      dapaints: [],
      daPaintList: [],
      notifs: [],
      userId: undefined,
      userData: {},
      WinStreakGoal: undefined,
      dapaintId: undefined,
      token: localStorage.getItem("token"),
    },

    actions: {
      // Use getActions to call a function within a fuction
      logout: () => {
        localStorage.removeItem("token");
        setStore({
          token: undefined,
        });
      },

      editUserbyUser: async (user) => {
        const response = await fetch(
          process.env.BACKEND_URL + "/api/user/edit",
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify({
              email: user.email,
              name: user.name,
              city: user.city,
              zipcode: user.zipcode,
              phone: user.phone,
              instagram_url: user.instagram_url,
              tiktok_url: user.tiktok_url,
              twitch_url: user.twitch_url,
              kick_url: user.kick_url,
              youtube_url: user.youtube_url,
              twitter_url: user.twitter_url,
              facebook_url: user.facebook_url,
            }),
          }
        );
        if (response.status !== 201) return false;
        const responseBody = await response.json();
        console.log(responseBody);

        return true;
      },
      forfeitMatch: async (dapaintId) => {
        const response = await fetch(
          process.env.BACKEND_URL + "/api/forfeit/" + dapaintId,
          {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        if (response.status === 200) {
          console.log("Match forfeited successfully!");
          let data=await response.json()
          setStore({
            notifs:data.notifications
          })
          window.location.reload();
      }},
      cancelMatch: async (dapaintId) => {
        const response = await fetch(
          process.env.BACKEND_URL + "/api/cancel/" + dapaintId,
          {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        if (response.status === 200) {
          console.log("Match canceled successfully!");
          let data=await response.json()
          setStore({
            notifs:data.notifications
          })

        } else {
          console.error("Failed to cancel match:", response.statusText);
        }
      },

      fetchCurrentUser: async () => {

        try {
          const response = await fetch(
            process.env.BACKEND_URL + "/api/current-user",
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );
          const data = await response.json();
          // console.log(data);
          setStore({
            userData: {...data,
              wins: data.user?.wins,
              losses: data.user?.losses,}
          });
          console.log("Current User DATA has been set", data)
        } catch (error) {
          console.error("Error fetching current user:", error);
        }
      },
      fetchAndSetUser: async (setUser, setCurrentWinStreak) => {
        try {
          const response = await fetch(
            process.env.BACKEND_URL + "/api/current-user",
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );
          const data = await response.json();
          console.log("FLUX:actions.fetchAndSetUser: ", data);
          setStore({userData: {
              ...data,
              wins: data.user?.wins,
              losses: data.user?.losses,
            },
          });
          setUser(data);
          setCurrentWinStreak(data.user?.winstreak);
        } catch (error) {
          console.error("Error fetching users:", error);
        }
      },

      createDaPaint: async (newDaPaint) => {
        let response = await fetch(`${process.env.BACKEND_URL}/api/dapaint`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            fitnessStyle: newDaPaint.fitnessStyle,
            location: newDaPaint.location,
            date_time: newDaPaint.date_time,
            price: newDaPaint.price,
            hostFoeId: newDaPaint.hostFoeId,
            userId: newDaPaint.userId,
          }),
        });

        if (response.status !== 200) return false;

        const responseBody = await response.json();
        console.log("Created event:", responseBody);
        return true;
      },
      getNotifs: async () => {
        const token = localStorage.getItem("token");
        try {
          const response = await fetch(
            `${process.env.BACKEND_URL}/api/notifs`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          );
          if (response.status != 200) {
            const error = await response.json();
            console.error("Failed to retrieve notifications:", error);
            return false;
          } else {
            const data = await response.json();
            setStore(
              {notifs:data.notifications}
            );
            return true;
          }
        } catch (error) {
          console.error("Error fetching notifications:", error);
        }
      },

      getDaPaintList: async () => {
        const token = localStorage.getItem("token");
        try {
          const response = await fetch(
            `${process.env.BACKEND_URL}/api/lineup?isaccepted=1`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (response.ok) {
            const eventList = await response.json();
            setStore({ daPaintList: eventList });
          } else {
            const error = await response.json();
            console.error("Failed to retrieve list of events:", error);
          }
        } catch (error) {
          console.error("Error:", error);
        }
      },
      deleteEvent: async (eventId) => {
        const token = localStorage.getItem("token");
        try {
          const response = await fetch(
            `${process.env.BACKEND_URL}/api/dapaint/delete/${eventId}`,
            {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (response.ok) {
            console.log("Event deleted successfully");
            return true;
          } else {
            const error = await response.json();
            console.error("Failed to delete event:", error);
            return false;
          }
        } catch (error) {
          console.error("Error:", error);
          return false;
        }
      },
      updateWinstreak: async (daPaint_id, winner_id, loser_id) => {
        const token = localStorage.getItem("token");
    
        // Validate daPaint_id
        if (typeof daPaint_id !== 'number' && typeof daPaint_id !== 'string') {
            console.error("Invalid daPaint_id");
            return;
        }
    
        if (!token) {
            console.error("No token found");
            return;
        }
    
        try {
            const response = await fetch(
                `${process.env.BACKEND_URL}/api/update-win-streak/${daPaint_id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ "winner": winner_id, "loser": loser_id }),
                }
            );
    
            if (response.status !== 200) {
                const errorData = await response.json();
                console.error("Failed to update win streak:", errorData);
                return false;
            }
    
            const data = await response.json();
            console.log("Win streak updated:", data);
            return true;
        } catch (error) {
            console.error("Error updating win streak:", error);
        }
    },

    fetchCurrentUser: async () => {
      try {
        const response = await fetch(
          process.env.BACKEND_URL + "/api/current-user",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const data = await response.json();
        
        // Debugging log
        console.log("Fetched current user data:", data);

        if (!data.dapaintId) {
          console.error("dapaintId is missing from fetched data.");
        }

        setStore({
          userData: {
            ...data,
            wins: data.wins,
            losses: data.losses,
          }
        });
        
        console.log("Current User DATA has been set", getStore().userData);
      } catch (error) {
        console.error("Error fetching current user:", error);
      }
    },

    
    
      fetchMaxWinStreak: async (setMaxWinStreak, setGoalWinStreak, setMaxWinStreakUser) => {
        let store = getStore();
        try {
          const response = await fetch(
            process.env.BACKEND_URL + "/api/max-win-streak",
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );
          if (response.status!== 200) {
            console.error("Failed to retrieve max win streak:", response.statusText);
            return;
          }
          const data = await response.json();
          console.log("FLUX:ACTIONS.FETCHMAXWINSTREAK.DATA", data);
          setStore({ WinStreakGoal: data.WinStreakGoal });
          setMaxWinStreak(data.maxWinStreak);
          setGoalWinStreak(data.WinStreakGoal);
          setMaxWinStreakUser(data.maxWinStreakUser.name);
        } catch (error) {
          console.error("Error fetching max win streak:", error);
        }
      },

      resetWinStreak: async () => {
        let store = getStore();
        console.log("FLUX: actions.RESETWINSTREAK DATA RESULTS: ", store);
        if (store.WinStreakGoal <= store.userData.winstreak) {
            try {
                const response = await fetch(
                    process.env.BACKEND_URL + "/api/reset-win-streak",
                    {
                        method: "PUT",
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`,
                        },
                    }
                );
                const data = await response.json();
                
                getStore().userData.winstreak = 0;
                setStore({ userData: userData });
    
            } catch (error) {
                console.error("Error fetching current user:", error);
            }
        }
    },
      
      addUserImage: async (imageFile) => {
        let formData = new FormData();
        formData.append("file", imageFile[0]); // Assuming imageFile is an array

        const response = await fetch(
          process.env.BACKEND_URL + "/api/user-img",
          {
            method: "POST",
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token"),
            },
            body: formData,
          }
        );

        if (response.status !== 200) return false;
        const responseBody = await response.json();
        console.log(responseBody);
        return true;
      },
      setInviteCode: (newCode) => {
        const store = getStore();
        setStore({ inviteCode: newCode });
      },
    },
  };
};

export default getState;
