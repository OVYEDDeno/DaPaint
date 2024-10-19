const getState = ({ getStore, getActions, setStore }) => {
  return {
    store: {
      users: [],
      currentUser: null,
      dapaints: [],
      daPaintList: [],
      tickets: [],
      notifs: [],
      userId: undefined,
      userData: {},
      WinStreakGoal: 30,
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
        const updatedFields = {};

        // Only include the fields that the user has modified
        if (user.email) updatedFields.email = user.email;
        if (user.name) updatedFields.name = user.name;
        if (user.city) updatedFields.city = user.city;
        if (user.zipcode) updatedFields.zipcode = user.zipcode;
        if (user.phone) updatedFields.phone = user.phone;
        if (user.birthday) updatedFields.birthday = user.birthday; // Ensure correct format in the frontend if needed
        if (user.instagram_url)
          updatedFields.instagram_url = user.instagram_url;
        if (user.tiktok_url) updatedFields.tiktok_url = user.tiktok_url;
        if (user.twitch_url) updatedFields.twitch_url = user.twitch_url;
        if (user.kick_url) updatedFields.kick_url = user.kick_url;
        if (user.youtube_url) updatedFields.youtube_url = user.youtube_url;
        if (user.twitter_url) updatedFields.twitter_url = user.twitter_url;
        if (user.facebook_url) updatedFields.facebook_url = user.facebook_url;

        // Send only the updated fields
        const response = await fetch(
          process.env.BACKEND_URL + "/api/user/edit",
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify(updatedFields),
          }
        );

        if (response.status !== 200) {
          console.error("Error updating user");
          return false;
        }

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
          let data = await response.json();
          setStore({
            notifs: data.notifications,
          });
          window.location.reload();
        }
      },
      submitFeedback: async (feedback, rating) => {
        try {
          const resp = await fetch(`${process.env.BACKEND_URL}/api/feedback`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify({ feedback, rating }),
          });

          if (!resp.ok)
            throw Error("There was a problem submitting the feedback");

          const data = await resp.json();
          return data;
        } catch (error) {
          console.error("Error submitting feedback:", error);
        }
      },
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
          let data = await response.json();
          setStore({
            notifs: data.notifications,
          });
        } else {
          console.error("Failed to cancel match:", response.statusText);
        }
      },

      fetchMaxInvitee: async (setMaxInviteeCount, setMaxInviteeUser) => {
        let store = getStore();
        try {
          const response = await fetch(
            process.env.BACKEND_URL + "/api/max-invitee",
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );

          if (response.status !== 200) {
            console.error(
              "Failed to retrieve max invitee count:",
              response.statusText
            );
            return null;
          }

          const data = await response.json();
          console.log("FLUX:ACTIONS.FETCHMAXINVITEE.DATA", data);

          // Update the state/store with the response data
          setMaxInviteeCount(
            data.maxInviteeUser.invite_code.completed_dapaints.length
          );
          setMaxInviteeUser(data.maxInviteeUser.name); // Set the inviter's name with the most invitees
        } catch (error) {
          console.error("Error fetching max invitee:", error);
          return null;
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
            userData: {
              ...data,
              wins: data.user?.wins,
              losses: data.user?.losses,
            },
          });
          console.log("Current User DATA has been set", data);
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
          setStore({
            userData: {
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

      handleClockIn: async (dapaint) => {
        const store = getStore();
        const token = localStorage.getItem("token");
        const userId = store.userData.user.id; // Make sure this is the correct path to the user ID

        try {
          const response = await fetch(
            `${process.env.BACKEND_URL}/api/lineup/${dapaint.id}`,
            {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({ foeId: userId }),
            }
          );
          if (!response.ok) {
            getActions().getDaPaintList();
            const errorData = await response.json();
            throw new Error(errorData.error || "Failed to clock in");
          }
          const updatedDapaint = await response.json();
          return updatedDapaint;
        } catch (error) {
          console.error("Error clocking in:", error);
          throw error; // Re-throw the error so it can be caught in the component
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
      // In your actions.js or wherever your context actions are defined
      getNotifs: async () => {
        const store = getStore();
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("User is not logged in.");
          return { success: false, error: "Not logged in" };
        }

        try {
          const response = await fetch(
            `${process.env.BACKEND_URL}/api/notifications`,
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
          let notifications;

          if (Array.isArray(data)) {
            notifications = data;
          } else if (data.notifications && Array.isArray(data.notifications)) {
            notifications = data.notifications;
          } else {
            throw new Error("Unexpected data format");
          }

          setStore({ notifs: notifications });
          return { success: true, data: notifications };
        } catch (error) {
          console.error("Error fetching notifications:", error);
          return { success: false, error: error.message };
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
      getTickets: async () => {
        const token = localStorage.getItem("token");
        try {
          const response = await fetch(
            `${process.env.BACKEND_URL}/api/tickets`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (response.ok) {
            const data = await response.json();
            setStore({ tickets: data.tickets });
          } else {
            const error = await response.json();
            console.error("Failed to retrieve list of tickets:", error);
          }
        } catch (error) {
          console.error("Error:", error);
        }
      },
      convertTo12Hr: (timeStr) => {
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
      },
      
      scanTicket: async (ticketCode) => { // Use ticketCode as parameter
        const token = localStorage.getItem("token");
        try {
          const response = await fetch(`${process.env.BACKEND_URL}/api/fufill-order`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ ticket_code: ticketCode }), // Send ticket_code as expected by the backend
          });
      
          if (response.ok) {
            const data = await response.json();
            console.log("Ticket scanned successfully", data);
            return true; // Return true if scanning is successful
          } else {
            const error = await response.json();
            console.error("Failed to scan ticket:", error);
            return false; // Return false if scanning fails
          }
        } catch (error) {
          console.error("Error during ticket scan:", error);
          return false; // Return false on catch
        }
      },
      

      redeemTicket: async (ticketCode) => {
        const token = localStorage.getItem("token");
        try {
            const response = await fetch(`${process.env.BACKEND_URL}/api/fufill-order`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ ticket_code: ticketCode }),
            });
    
            if (response.ok) {
                const data = await response.json();
                console.log("Ticket redeemed successfully", data);
                return true;
            } else {
                const error = await response.json();
                console.error("Failed to redeem ticket:", error);
                return false;
            }
        } catch (error) {
            console.error("Error:", error);
            return false;
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
      updateWinstreak: async (daPaint_id, winner_id, loser_id, img_url) => {
        const token = localStorage.getItem("token");

        // Validate daPaint_id
        if (typeof daPaint_id !== "number" && typeof daPaint_id !== "string") {
          console.error("Invalid daPaint_id");
          return false;
        }

        if (!token) {
          console.error("No token found");
          return false;
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
              body: JSON.stringify({
                winner: winner_id,
                loser: loser_id,
                img_url: img_url,
              }),
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
          if (response.status != 200) {
            console.log("ERROR", response.statusText, response.status);
            return false;
          }
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
            },
          });

          console.log("Current User DATA has been set", getStore().userData);
          return true;
        } catch (error) {
          console.error("Error fetching current user:", error);
        }
      },

      fetchMaxWinStreak: async (
        setMaxWinStreak,
        setGoalWinStreak,
        setMaxWinStreakUser
      ) => {
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
          if (response.status !== 200) {
            console.error(
              "Failed to retrieve max win streak:",
              response.statusText
            );
            return null;
          }
          const data = await response.json();
          console.log("FLUX:ACTIONS.FETCHMAXWINSTREAK.DATA", data);
          setStore({ WinStreakGoal: parseInt(data.WinStreakGoal) });
          setMaxWinStreak(data.maxWinStreak);
          setGoalWinStreak(data.WinStreakGoal);
          setMaxWinStreakUser(data.maxWinStreakUser.name);
        } catch (error) {
          console.error("Error fetching max win streak:", error);
          return null;
        }
      },

      resetWinStreak: async () => {
        let store = getStore();
        let userData = store.userData;
        if (userData && userData.winstreak >= process.env.WINSTREAK_GOAL) {
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

            userData.winstreak = 0;
            setStore({ userData: userData });
          } catch (error) {
            console.error("Error fetching current user:", error);
          }
        }
      },

      addUserImage: async (imageFile) => {
        try {
          let formData = new FormData();
          formData.append("file", imageFile[0]); // Assuming imageFile is an array

          const response = await fetch(
            `${process.env.BACKEND_URL}/api/user-img`,
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
              body: formData,
            }
          );

          if (!response.ok) {
            const errorText = await response.text();
            console.error(
              `Server responded with ${response.status}: ${errorText}`
            );
            return { success: false, imageUrl: null };
          }

          const responseBody = await response.json();
          console.log(responseBody);

          // Assuming the server returns the new image URL in the response
          return { success: true, imageUrl: responseBody.image_url };
        } catch (error) {
          console.error("Error uploading image:", error);
          return { success: false, imageUrl: null };
        }
      },
      setInviteCode: (newCode) => {
        const store = getStore();
        setStore({ inviteCode: newCode });
      },
    },
  };
};

export default getState;
