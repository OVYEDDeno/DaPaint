import React from 'react';
import "../../styles/home.css";

export const Home = () => {
  return (
    <div className="homepage">
      {/* Vimeo Background */}
      <div className="video-bg">
        <div style={{ padding: '56.25% 0 0 0', position: 'relative' }}>
          <iframe 
            src="https://player.vimeo.com/video/972970469?badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479&autoplay=1&loop=1&muted=1" 
            frameBorder="0" 
            allow="autoplay; fullscreen; picture-in-picture; clipboard-write" 
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }} 
            title="Wilson - Blue">
          </iframe>
        </div>
      </div>

      {/* Main Content */}
      <div className="content">
        {/* Top Center Image */}
        <a href="" onClick={() => location.reload()}>
          <img
            src="https://icons.iconarchive.com/icons/microsoft/fluentui-emoji-3d/512/Oncoming-Fist-3d-Medium-Dark-icon.png"
            alt="DaPaintLogo"
            className="logo"
          />
        </a>

        {/* Welcome Text */}
        <h1>Welcome To DaPaint</h1>

        {/* Subtitle */}
        <p>Too many people watching sports. Not enough people PLAYING sports</p>

        {/* Join Now Button */}
        <button className="join-btn">Join Now!</button>
      </div>
    </div>
  );
};