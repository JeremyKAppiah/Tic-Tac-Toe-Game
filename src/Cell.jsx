import React from "react";

export default function Cell({ value, onClick, highlight, avatarMode, avatarX, avatarO }) {
  let content = value;
  if (avatarMode) {
    if (value === "X") content = <img src={avatarX} alt="X" className="cell-avatar" />;
    if (value === "O") content = <img src={avatarO} alt="O" className="cell-avatar" />;
  }

  return (
    <div className={`cell ${highlight ? "highlight" : ""}`} onClick={onClick}>
      {content}
    </div>
  );
}
