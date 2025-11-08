import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Settings/Settings.css";

const Settings = () => {
  const navigate = useNavigate();
  const [pointsPerCorrectAnswer, setPointsPerCorrectAnswer] = useState(2);
  const [pointsPerWrongAnswer, setPointsPerWrongAnswer] = useState(-1);

  const handleStartQuiz = () => {
    navigate("/question", {
      state: {
        pointsPerCorrectAnswer,
        pointsPerWrongAnswer,
      },
    });
  };

  return (
    <div className="settingsBox">
      <h2>Set Your Scoring Rules</h2>
      <div className="scoringRules">
        <label>
          Points per Correct Answer:
          <input
            type="number"
            value={pointsPerCorrectAnswer}
            onChange={(e) => setPointsPerCorrectAnswer(Number(e.target.value))}
          />
        </label>
        <label>
          Points per Wrong Answer:
          <input
            type="number"
            value={pointsPerWrongAnswer}
            onChange={(e) => setPointsPerWrongAnswer(Number(e.target.value))}
          />
        </label>
      </div>
      <button onClick={handleStartQuiz}>Start Quiz</button>
    </div>
  );
};

export default Settings;
