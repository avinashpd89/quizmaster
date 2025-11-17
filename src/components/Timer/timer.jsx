import React, { useState, useEffect } from "react";

const Timer = ({ onComplete }) => {
  const [time, setTime] = useState(30);

  useEffect(() => {
    if (time === 0) {
      onComplete();
      return;
    }

    const interval = setInterval(() => {
      setTime((prevTime) => Math.max(prevTime - 1, 0));
    }, 1000);

    return () => clearInterval(interval);
  }, [time, onComplete]);

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours}:${minutes < 10 ? "0" : ""}${minutes}:${
      secs < 10 ? "0" : ""
    }${secs}`;
  };

  return (
    <div className="flex justify-center items-center py-4">
      <div
        className="px-6 py-3 bg-white/10 backdrop-blur-xl border border-white/20 
        rounded-2xl shadow-lg shadow-blue-500/20 text-white
        text-3xl font-semibold tracking-wide
        transition-all duration-300 hover:shadow-blue-600/40 hover:scale-105"
      >
        {formatTime(time)}
      </div>
    </div>
  );
};

export default Timer;
