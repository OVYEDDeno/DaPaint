import React, { useContext } from "react";
import { Context } from "../store/appContext";
import rigoImageUrl from "../../img/rigo-baby.jpg";
import "../../styles/home.css";

export const Home = () => {
  const { store, actions } = useContext(Context);

  return (
    <div className="home-container">
      <header className="header">
        <nav className="nav">
          <ul>
            <li><a href="#">Discover</a></li>
            <li><a href="#">Join</a></li>
            <li><a href="#">Create</a></li>
          </ul>
        </nav>
        <img 
          src="https://static-assets.clubhouseapi.com/static/img/img_hand_wave.3454a59f2b06.svg" 
          alt="logo"
          style={{ width: "78px", height: "64px" }}
        />
      </header>
      <main className="main">
        <section className="hero">
          <h1>Welcome to DaPaint</h1>
          <p>A community for creatives</p>
          <button>Join the conversation</button>
        </section>
        <section className="features">
          <h2>Features</h2>
          <ul>
            <li>
              <h3>Rooms</h3>
              <p>Join live conversations with others</p>
            </li>
            <li>
              <h3>Clubs</h3>
              <p>Connect with others who share your interests</p>
            </li>
            <li>
              <h3>Events</h3>
              <p>Attend live events and meetups</p>
            </li>
          </ul>
        </section>
      </main>
      <footer></footer>
    </div>
  );
};