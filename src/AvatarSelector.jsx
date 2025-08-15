import React from "react";
import "./styling.css";
import avatar1 from "../src/assets/lion.png";
import avatar2 from "../src/assets/zebra.png";
import avatar3 from "../src/assets/panda.png";
import avatar4 from "../src/assets/crocodile.png";
import avatar5 from "../src/assets/owl.png";
import avatar6 from "../src/assets/gorilla.png";

const AVATAR_LIST = [avatar1, avatar2, avatar3, avatar4, avatar5, avatar6];

export default function AvatarSelector({ avatars, setAvatars }) {
  const handleSelect = (player, avatar) => {
    setAvatars({ ...avatars, [player]: avatar });
  };

  return (
    <div className="avatar-selector">
      <div className="avatar-row">
        {AVATAR_LIST.map((avatar, i) => (
          <img
            key={`X-${i}`}
            src={avatar}
            alt={`X-${i}`}
            className="avatar-choice"
            onClick={() => handleSelect("X", avatar)}
          />
        ))}
      </div>
      <div className="avatar-row">
        {AVATAR_LIST.map((avatar, i) => (
          <img
            key={`O-${i}`}
            src={avatar}
            alt={`O-${i}`}
            className="avatar-choice"
            onClick={() => handleSelect("O", avatar)}
          />
        ))}
      </div>
    </div>
  );
}
