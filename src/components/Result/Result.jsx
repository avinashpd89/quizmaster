import React from "react";
import { useLocation } from "react-router-dom";
import "../Result/Result.css";
import Navbar from "../Navbar";
import Footer from "../Footer";

function Result() {
  const location = useLocation();
  const {
    score,
    quizStartTime,
    endTime,
    timeTaken,
    questionCount,
    correctAnswers,
  } = location.state || {};

  const formattedStartTime = quizStartTime
    ? new Date(quizStartTime).toLocaleTimeString()
    : "N/A";
  const formattedEndTime = endTime
    ? new Date(endTime).toLocaleTimeString()
    : "N/A";
  const formattedTimeTaken = timeTaken
    ? `${Math.floor(timeTaken / 60)} min ${Math.round(timeTaken % 60)} sec`
    : "N/A";

  return (
    <>
    <Navbar/>
      <div className="resultBox">
        <div className="resultDisplay">
          <dl>
            <dt>Score</dt>
            <dd>
              {score !== undefined ? `${score} / ${questionCount * 2}` : "N/A"}
            </dd>

            <dt>Correct Answers</dt>
            <dd>
              {correctAnswers} out of {questionCount}
            </dd>

            <dt>Start Time</dt>
            <dd>{formattedStartTime}</dd>

            <dt>End Time</dt>
            <dd>{formattedEndTime}</dd>

            <dt>Time Taken</dt>
            <dd>{formattedTimeTaken}</dd>
          </dl>
        </div>
      </div>
      <Footer/>
    </>
  );
}

export default Result;
