// Timer

import React, { useState, useEffect } from "react";
import "../Timer/timer.css";

const Timer = ({ onComplete }) => {
  const [time, setTime] = useState(30); // 3600 seconds = 1 hour

  useEffect(() => {
    if (time === 0) {
      onComplete(); // Call the onComplete function when time reaches 0
      return;
    }

    const interval = setInterval(() => {
      setTime((prevTime) => Math.max(prevTime - 1, 0)); // Prevent negative time
    }, 1000);

    return () => clearInterval(interval); // Clean up the interval on component unmount
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
    <div className="timerDisplay">
      <p>{formatTime(time)}</p>
    </div>
  );
};

export default Timer;

// User set timer

// import React, { useState, useEffect } from 'react';

// const Timer = () => {
//   const [time, setTime] = useState(0); // Total time in seconds
//   const [inputHours, setInputHours] = useState(0);
//   const [inputMinutes, setInputMinutes] = useState(0);
//   const [inputSeconds, setInputSeconds] = useState(0);
//   const [isRunning, setIsRunning] = useState(false);

//   useEffect(() => {
//     let interval;
//     if (isRunning && time > 0) {
//       interval = setInterval(() => {
//         setTime((prevTime) => prevTime - 1);
//       }, 1000);
//     }

//     return () => clearInterval(interval);
//   }, [isRunning, time]);

//   const handleStart = () => {
//     const totalSeconds = inputHours * 3600 + inputMinutes * 60 + inputSeconds;
//     setTime(totalSeconds);
//     setIsRunning(true);
//   };

//   const formatTime = (seconds) => {
//     const hours = Math.floor(seconds / 3600);
//     const minutes = Math.floor((seconds % 3600) / 60);
//     const secs = seconds % 60;
//     return `${hours}:${minutes < 10 ? '0' : ''}${minutes}:${secs < 10 ? '0' : ''}${secs}`;
//   };

//   return (
//     <div>
//       <h2>Countdown Timer</h2>
//       {!isRunning && (
//         <div>
//           <input
//             type="number"
//             value={inputHours}
//             onChange={(e) => setInputHours(Number(e.target.value))}
//             placeholder="Hours"
//           />
//           <input
//             type="number"
//             value={inputMinutes}
//             onChange={(e) => setInputMinutes(Number(e.target.value))}
//             placeholder="Minutes"
//           />
//           <input
//             type="number"
//             value={inputSeconds}
//             onChange={(e) => setInputSeconds(Number(e.target.value))}
//             placeholder="Seconds"
//           />
//           <button onClick={handleStart}>Start Timer</button>
//         </div>
//       )}
//       {isRunning && <p>{formatTime(time)}</p>}
//     </div>
//   );
// };

// export default Timer;
