import { useState } from "react";
import "./styling.css";
import FloatingMarks from "./FloatingMarks.jsx";

export default function Landing({ onStart }) {
  return (
    <div id="landingOverlay" className="landing-overlay">
      {/* Floating X/O marks */}
      <FloatingMarks />

      <div className="landing-content">
        <div className="landing-main-container">
          <h2 className="glow-outline slide-up">Welcome to Tic-Tac-Toe Mania!</h2>
          <p className="slide-up" style={{ animationDelay: "0.15s" }}>
            Click start to jump right in!
          </p>
          <button
            id="landingStartButton"
            className="start-btn slide-up"
            style={{ animationDelay: "0.3s" }}
            onClick={onStart}
          >
            Start
          </button>
          <p className="glow-outline slide-up" style={{ animationDelay: "0.45s" }}>
            Created by Jeremy Appiah
          </p>
        </div>
      </div>
    </div>
  );
}
