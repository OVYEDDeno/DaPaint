import DaPaintList from "../component/dapaintlist";

const getState = ({ getStore, getActions, setStore }) => {
  return {
    store: {
      users: [],
      currentUser: null,
      dapaints: [],
      daPaintList: [],
      notifs: {},
      userId: undefined,
      userData: {},
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
              birthday: user.birthday,
            }),
          }
        );
        if (response.status !== 201) return false;
        const responseBody = await response.json();
        console.log(responseBody);

        return true;
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
          setStore({
            userData: {
              ...data,
              wins: data.winsByKO + data.winsBySub,
              losses: data.lossesByKO + data.lossesBySub,
            },
          });
        } catch (error) {
          console.error("Error fetching current user:", error);
        }
      },

      setCurrentUser: (userData) => {
        setStore({ currentUser: userData });
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
          const response = await fetch(`${process.env.BACKEND_URL}/api/notifs`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });
          if (response.status != 200) {
            const error = await response.json();
            console.error("Failed to retrieve notifications:", error);
			return false;
          } else {
            const notifs = await response.json();
			return notifs
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
      updateWinstreak: async (daPaint_id, vote) => {
        const token = localStorage.getItem("token"); // Assuming JWT is stored in localStorage
        if (!token) {
          console.error("No token found");
          return;
        }
        try {
          const response = await fetch(
            process.env.BACKEND_URL + "/api/update-win-streak",
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({ daPaint_id, vote }),
            }
          );
          if (response.status !== 200) {
            console.log(response.status);
            data = await response.json();
            console.log(data);
            return false;
          }
          const data = await response.json();
          console.log(data);
          return true;
        } catch (error) {
          console.error("Error updating win streak:", error);
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
      // addUserImg: async (images) => {
      // 	try {
      // 		let formData = new FormData();
      // 		console.log(">>> 🍎 images:", images);

      // 		// Append all images to FormData
      // 		images.forEach((image, index) => {
      // 			formData.append(`file${index}`, image);
      // 		});

      // 		const response = await fetch(process.env.BACKEND_URL + "/api/user-img", {
      // 			method: "POST",
      // 			headers: {
      // 				Authorization: "Bearer " + localStorage.getItem("token")
      // 			},
      // 			body: formData
      // 		});

      // 		if (!response.ok) {
      // 			throw new Error(`HTTP error! status: ${response.status}`);
      // 		}

      // 		const responseBody = await response.json();
      // 		console.log("Response Body:", responseBody);

      // 		return true;
      // 	} catch (error) {
      // 		console.error("Error uploading image:", error);
      // 		return false;
      // 	}
      // }

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
