import React, { useEffect, useState } from "react";

export default function FloatingMarks({ count = 60 }) {
  const [marks, setMarks] = useState([]);

  useEffect(() => {
    const floating = [];
    for (let i = 0; i < count; i++) {
      floating.push({
        id: i,
        char: Math.random() < 0.5 ? "X" : "O",
        top: Math.random() * 100,
        left: Math.random() * 100,
        duration: 5 + Math.random() * 5,
        delay: Math.random() * 5,
      });
    }
    setMarks(floating);
  }, [count]); // Re-run when count changes

  return (
    <div className="floating-marks">
      {marks.map((mark) => (
        <div
          key={mark.id}
          className="floating-mark"
          style={{
            top: `${mark.top}%`,
            left: `${mark.left}%`,
            animationDuration: `${mark.duration}s`,
            animationDelay: `${mark.delay}s`,
          }}
        >
          {mark.char}
        </div>
      ))}
    </div>
  );
}
