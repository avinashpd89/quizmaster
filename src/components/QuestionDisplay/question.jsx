import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import Timer from "../Timer/timer.jsx";
import "../QuestionDisplay/question.css";

const Question = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [endTime, setEndTime] = useState(null);
  const [score, setScore] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const quizStartTime = location.state?.quizStartTime || new Date();

  // Fetch custom scoring rules from state or set defaults
  const pointsPerCorrectAnswer = location.state?.pointsPerCorrectAnswer || 2;
  const pointsPerWrongAnswer = location.state?.pointsPerWrongAnswer || -1;

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/questions");
        setQuestions(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching questions:", error);
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  const handleSubmitQuiz = () => {
    console.log("Selected options:", selectedOptions);
    const endQuizTime = new Date();
    setEndTime(endQuizTime);
    const timeTaken = (endQuizTime - quizStartTime) / 1000;

    const correctAnswers = questions.filter(
      (question, index) => selectedOptions[index] === question.answer
    ).length;

    const wrongAnswers = questions.length - correctAnswers;
    const totalScore =
      correctAnswers * pointsPerCorrectAnswer +
      wrongAnswers * pointsPerWrongAnswer;

    navigate("/result", {
      state: {
        score: totalScore,
        quizStartTime,
        endTime: endQuizTime,
        timeTaken,
        questionCount: questions.length,
        correctAnswers,
        wrongAnswers,
      },
    });
  };

  const handleOptionChange = (event) => {
    setSelectedOptions({
      ...selectedOptions,
      [currentQuestionIndex]: event.target.value,
    });
  };

  if (loading) {
    return <div>Loading questions...</div>;
  }

  if (!questions.length) {
    return <div>No questions available.</div>;
  }

  const currentQuestion = questions[currentQuestionIndex];
  const selectedOption = selectedOptions[currentQuestionIndex] || null;

  return (
    <div className="box1">
      <div className="question">
        <Timer onComplete={handleSubmitQuiz} />
        <div className="displayBox">
          <h3>
            {currentQuestionIndex + 1}. {currentQuestion.question}
          </h3>
          <div className="option">
            {currentQuestion.options.map((option, index) => (
              <div key={index}>
                <input
                  type="radio"
                  id={`option-${index}`}
                  name={`option-${currentQuestionIndex}`}
                  value={option}
                  checked={selectedOption === option}
                  onChange={handleOptionChange}
                />
                <label htmlFor={`option-${index}`}>{option}</label>
              </div>
            ))}
          </div>
          <div className="navigationButtons">
            <button
              className="previous"
              onClick={() => setCurrentQuestionIndex((prev) => prev - 1)}
              disabled={currentQuestionIndex === 0}
            >
              Previous
            </button>
            <button
              className="next"
              onClick={() => setCurrentQuestionIndex((prev) => prev + 1)}
              disabled={currentQuestionIndex === questions.length - 1}
            >
              Next
            </button>
          </div>
        </div>
        <button className="submit" onClick={handleSubmitQuiz}>
          Submit
        </button>
      </div>
    </div>
  );
};

export default Question;
