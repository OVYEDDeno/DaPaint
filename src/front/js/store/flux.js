const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
			users: [],
			dapaints: [],
			userId: undefined,
			userData: {},
			dapaintId: undefined,
			token: localStorage.getItem('token')

		},

		actions: {
			// Use getActions to call a function within a fuction
			logout: () => {
				localStorage.removeItem("token");
				setStore({
					token: undefined
				})
			},
			editUser: async (
				email,
				name,
				city,
				zipcode,
				phone,
				birthday,
				img
			) => {
				let data = JSON.stringify({
					email: email,
					name: name,
					city: city,
					zipcode: zipcode,
					phone: phone,
					birthday: birthday
				});

				const formData = new FormData();

				formData.append("data", data);

				formData.append("file", img);

				const opts = {
					method: "PUT",

					headers: {
						Authorization: "Bearer " + sessionStorage.getItem("token"),
					},
					body: formData,
				};
				const resp = await fetch(
					process.env.BACKEND_URL + "/api/user/edit",
					opts
				);
				if (resp.status != 200) {
					let errorMsg = await resp.json();
					alert("An error occured while submitted the new member: " + errorMsg.msg)
					return false;
				}
				const respBody = await resp.json();
				console.log("This comes from backend", respBody);
				return true;

			},
			fetchCurrentUser: async () => {
				try {
					const response = await fetch(process.env.BACKEND_URL + '/api/current-user', {
						headers: {
							"Authorization": `Bearer ${localStorage.getItem("token")}`
						}
					});
					const data = await response.json();
					setStore({ userData: {...data, wins:data.winsByKO+data.winsBySub, losses:data.lossesByKO+data.lossesBySub} });
				} catch (error) {
					console.error("Error fetching current user:", error);
				}
			},
			resetWinStreak: async () => {
				let store = getStore()
					let userData = store.userData
					if(userData && userData.winstreak >= process.env.WINSTREAK_GOAL){
						try {
					const response = await fetch(process.env.BACKEND_URL + '/api/reset-win-streak', {
						method: "PUT",
						headers: {
							"Authorization": `Bearer ${localStorage.getItem("token")}`
						}
					});
					const data = await response.json();
					
					userData.winstreak = 0
					setStore({ userData:userData});
				} catch (error) {
					console.error("Error fetching current user:", error);
				}
					}
				
			},
			addUserImg: async (images) => {
           
                let formData = new FormData();
                console.log(">>> 🍎 images:", images);
                console.log(">>> 🍎 images:", images.images);
                formData.append("file", images[0]);
            

                const response = await fetch(process.env.BACKEND_URL + "/api/user-img", {
                    method: "POST",
                    headers: {
                        Authorization: "Bearer " + sessionStorage.getItem("token")
                    },
                    body: formData
                })
                if (response.status !== 200) return false;
                const responseBody = await response.json();
                console.log(responseBody)
                console.log("This is the Response Body")
                return true;
            },
		}
	};
};

export default getState;
