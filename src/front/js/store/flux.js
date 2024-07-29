const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
			users: [],
			dapaints: [],
			userId: undefined,
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
					name : name,
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
					alert("An error occured while submitted the new member: "+errorMsg.msg)
					return false;
				  }
				  const respBody= await resp.json();
				  console.log("This comes from backend", respBody);
				  return true;
				
			  },   
		}
	};
};

export default getState;
