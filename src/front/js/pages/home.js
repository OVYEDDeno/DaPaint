import React, { useContext } from "react";
import { Context } from "../store/appContext";
import rigoImageUrl from "../../img/rigo-baby.jpg";
import "../../styles/home.css";

export const Home = () => {
	const { store, actions } = useContext(Context);

	return (
		<div className="home">
			<header>
			<img 
				src="https://static-assets.clubhouseapi.com/static/img/img_hand_wave.3454a59f2b06.svg" 
				alt="logo"
				style={{ width: "78px", height: "64px" }}
			 />
			</header>
			<div>
			</div>
			<footer></footer>
		</div>
	);
};
